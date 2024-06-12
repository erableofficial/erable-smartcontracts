// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";

/**
 * @title Staking Contract
 * @dev A contract for staking ERC20 tokens and earning rewards.
 */
contract Staking is Initializable, OwnableUpgradeable, PausableUpgradeable, ReentrancyGuardUpgradeable {
    IERC20 public stakingToken;
    uint256 public stakingDuration;
    uint256 public minCap;
    uint256 public maxCap;
    uint256 public yieldConstant;
    uint256 public cooldownPeriod;
    uint256 public monthsInStakingPeriod;
    uint256 public startingSlashingPoint;
    uint256 public monthlyIncreasePercentage;

    bool public pauseStaking;
    bool public pauseUnstake;
    bool public whitelistEnabled;

    struct Stake {
        uint256 amount;
        uint256 startTime;
        uint256 requestUnstakeTime;
        bool unstakeRequested;
    }

    mapping(address => Stake) public userStakes;
    mapping(address => bool) public whitelistedAddresses;
    uint256 public _totalStaked;
    uint256 public _rewardPool;

    event Staked(address indexed user, uint256 amount);
    event UnstakeRequested(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);
    event WhitelistStatusChanged(address indexed user, bool status);
    event Deposit(address indexed owner, uint256 amount);
    event Withdraw(address indexed owner, uint256 amount);

    modifier onlyWhitelisted() {
        require(!whitelistEnabled || whitelistedAddresses[msg.sender], "Address not whitelisted");
        _;
    }

    modifier whenStakingNotPaused() {
        require(!pauseStaking, "Staking is paused");
        _;
    }

    /**
     * @dev Initializes the contract with the specified parameters.
     * @param _stakingToken Address of the ERC20 token to be staked.
     * @param _stakingDuration Duration for which tokens will be staked.
     * @param _yieldConstant Constant used to calculate yield.
     * @param _cooldownPeriod Cooldown period before unstaking.
     * @param _startingSlashingPoint Starting point for slashing calculation.
     * @param _monthlyIncreasePercentage Monthly increase percentage for slashing calculation.
     */
    function initialize(
        address _stakingToken,
        uint256 _stakingDuration,
        uint256 _yieldConstant,
        uint256 _cooldownPeriod,
        uint256 _startingSlashingPoint,
        uint256 _monthlyIncreasePercentage
    ) public initializer {
        __Ownable_init(msg.sender);
        __Pausable_init();
        __ReentrancyGuard_init();

        stakingToken = IERC20(_stakingToken);
        stakingDuration = _stakingDuration;
        minCap = 0;
        maxCap = 0;
        yieldConstant = _yieldConstant;
        cooldownPeriod = _cooldownPeriod;
        monthsInStakingPeriod = _stakingDuration / 30 / 24 / 60 / 60;
        startingSlashingPoint = _startingSlashingPoint;
        monthlyIncreasePercentage = _monthlyIncreasePercentage;
    }

    /**
     * @notice Stakes the specified amount of tokens.
     * @dev The function enforces minimum and maximum cap if they are set.
     * @param _amount Amount of tokens to stake.
     */
    function stake(uint256 _amount)
        external
        nonReentrant
        whenNotPaused
        onlyWhitelisted
        whenStakingNotPaused
    {
        require(_amount > 0, "Cannot stake 0");
        if (minCap > 0) {
            require(_amount >= minCap, "Amount below minimum cap");
        }
        if (maxCap > 0) {
            require(_amount <= maxCap, "Amount exceeds maximum cap");
        }
        userStakes[msg.sender] = Stake(_amount, block.timestamp, 0, false);
        _totalStaked += _amount;
        stakingToken.transferFrom(msg.sender, address(this), _amount);
        emit Staked(msg.sender, _amount);
    }

    /**
     * @notice Allows the user to unstake their tokens.
     * @dev If `stakingDuration` is 0, the user can unstake and withdraw their tokens immediately with calculated rewards.
     *      If the current time is within the staking duration, the unstake request is recorded.
     *      If the staking period is over, the user can withdraw their staked amount with possible deductions.
     */
    function unstake() external nonReentrant {
        Stake storage stakeInfo = userStakes[msg.sender];
        require(stakeInfo.amount > 0, "No staked amount to request unstake");
        require(!stakeInfo.unstakeRequested, "Unstake already requested");

        if (stakingDuration == 0) {
            uint256 _amount = stakeInfo.amount;
            stakeInfo.amount = 0;
            uint256 totalAmount = calculateTotalWithdraw(_amount, stakeInfo.startTime);
            _totalStaked -= _amount;
            stakingToken.transfer(msg.sender, totalAmount);
            emit Withdrawn(msg.sender, totalAmount);
        } else if (block.timestamp < stakeInfo.startTime + stakingDuration) {
            // Request unstake if within the staking period
            stakeInfo.requestUnstakeTime = block.timestamp;
            stakeInfo.unstakeRequested = true;
            emit UnstakeRequested(msg.sender, stakeInfo.amount);
        } else {
            // If staking period is over, allow withdrawal with possible deductions
            uint256 _amount = stakeInfo.amount;
            uint256 totalAmount = calculateTotalWithdraw(_amount, stakeInfo.startTime);
            _totalStaked -= _amount;
            stakingToken.transfer(msg.sender, totalAmount);
            emit Withdrawn(msg.sender, totalAmount);
        }
    }

    /**
     * @notice Claims the unstaked tokens after the cooldown period.
     */
    function claim() external nonReentrant whenNotPaused {
        Stake storage stakeInfo = userStakes[msg.sender];
        require(stakeInfo.unstakeRequested, "Unstake not requested");
        require(block.timestamp >= stakeInfo.requestUnstakeTime + cooldownPeriod, "Cooldown period not over");

        uint256 _amount = stakeInfo.amount;
        uint256 totalAmount = calculateTotalWithdraw(_amount, stakeInfo.startTime);

        stakeInfo.amount = 0;
        stakeInfo.unstakeRequested = false;
        _totalStaked -= _amount;
        stakingToken.transfer(msg.sender, totalAmount);
        emit Withdrawn(msg.sender, totalAmount);
    }

    /**
     * @notice Calculates the total amount to withdraw including rewards and slashing tax.
     * @param _amount Amount of tokens staked.
     * @param startTime Start time of the stake.
     * @return The total amount to withdraw.
     */
    function calculateTotalWithdraw(uint256 _amount, uint256 startTime)
        public
        view
        returns (uint256)
    {
        uint256 timeStaked = block.timestamp - startTime;
        uint256 Y = calculateYield(timeStaked);
        uint256 T = calculateTax(timeStaked);

        uint256 reward = (_amount * Y) / 1e18;
        uint256 slashingTax = (reward * T) / 1e18;
        uint256 totalWithdrawAmount = _amount + reward - slashingTax;

        return totalWithdrawAmount;
    }

    /**
     * @notice Returns the total supply of staked tokens.
     * @return The total supply of staked tokens.
     */
    function totalStaked() external view returns (uint256) {
        return _totalStaked;
    }

    /**
     * @notice Returns the reward pool balance.
     * @return The reward pool balance.
     */
    function rewardPool() external view returns (uint256) {
        return _rewardPool;
    }

    /**
     * @notice Pauses the staking functionality.
     */
    function pauseStakingFunction() external onlyOwner whenNotPaused {
        pauseStaking = true;
    }

    /**
     * @notice Unpauses the staking functionality.
     */
    function unpauseStaking() external onlyOwner {
        pauseStaking = false;
    }

    /**
     * @notice Updates the staking duration.
     * @param _stakingDuration The new staking duration.
     */
    function updateStakingDuration(uint256 _stakingDuration) external onlyOwner {
        stakingDuration = _stakingDuration;
        monthsInStakingPeriod = _stakingDuration / 30 / 24 / 60 / 60;
    }

    /**
     * @notice Updates the minimum cap for staking.
     * @param _minCap The new minimum cap.
     */
    function updateMinCap(uint256 _minCap) external onlyOwner {
        minCap = _minCap;
    }

    /**
     * @notice Updates the maximum cap for staking.
     * @param _maxCap The new maximum cap.
     */
    function updateMaxCap(uint256 _maxCap) external onlyOwner {
        maxCap = _maxCap;
    }

    /**
     * @notice Updates the yield constant.
     * @param _yieldConstant The new yield constant.
     */
    function updateYieldConstant(uint256 _yieldConstant) external onlyOwner {
        yieldConstant = _yieldConstant;
    }

    /**
     * @notice Updates the cooldown period before unstaking.
     * @param _cooldownPeriod The new cooldown period.
     */
    function updateCooldownPeriod(uint256 _cooldownPeriod) external onlyOwner {
        cooldownPeriod = _cooldownPeriod;
    }

    /**
     * @notice Updates the starting slashing point.
     * @param _startingSlashingPoint The new starting slashing point.
     */
    function updateStartingSlashingPoint(uint256 _startingSlashingPoint) external onlyOwner {
        startingSlashingPoint = _startingSlashingPoint;
    }

    /**
     * @notice Updates the monthly increase percentage for slashing calculation.
     * @param _monthlyIncreasePercentage The new monthly increase percentage.
     */
    function updateMonthlyIncreasePercentage(uint256 _monthlyIncreasePercentage) external onlyOwner {
        monthlyIncreasePercentage = _monthlyIncreasePercentage;
    }

    /**
     * @notice Calculates the yield based on the time staked.
     * @param timeStaked The amount of time the tokens have been staked.
     * @return The calculated yield.
     */
    function calculateYield(uint256 timeStaked) public view returns (uint256) {
        if (timeStaked >= stakingDuration) {
            return 144 * yieldConstant;
        } else {
            uint256 X = (monthsInStakingPeriod * timeStaked * 1e18) / stakingDuration;
            uint256 Y = (yieldConstant * X * X) / (1e18 * 1e18);
            return Y;
        }
    }

    /**
     * @notice Calculates the slashing tax based on the time staked.
     * @param timeStaked The amount of time the tokens have been staked.
     * @return The calculated slashing tax.
     */
    function calculateTax(uint256 timeStaked) public view returns (uint256) {
        if (timeStaked >= stakingDuration) {
            return 0;
        } else {
            uint256 T = startingSlashingPoint - (monthlyIncreasePercentage * timeStaked) / stakingDuration;
            return T;
        }
    }

    /**
     * @notice Enables the whitelist feature.
     */
    function enableWhitelist() external onlyOwner {
        whitelistEnabled = true;
    }

    /**
     * @notice Disables the whitelist feature.
     */
    function disableWhitelist() external onlyOwner {
        whitelistEnabled = false;
    }

    /**
     * @notice Adds an address to the whitelist.
     * @param _address The address to whitelist.
     */
    function addToWhitelist(address _address) external onlyOwner {
        whitelistedAddresses[_address] = true;
        emit WhitelistStatusChanged(_address, true);
    }

    /**
     * @notice Removes an address from the whitelist.
     * @param _address The address to remove from the whitelist.
     */
    function removeFromWhitelist(address _address) external onlyOwner {
        whitelistedAddresses[_address] = false;
        emit WhitelistStatusChanged(_address, false);
    }

    /**
     * @notice Deposits tokens into the reward pool.
     * @param _amount The amount of tokens to deposit.
     */
    function depositRewardTokens(uint256 _amount) external onlyOwner {
        require(_amount > 0, "Cannot deposit 0");
        _rewardPool += _amount;
        stakingToken.transferFrom(msg.sender, address(this), _amount);
        emit Deposit(msg.sender, _amount);
    }

    /**
     * @notice Withdraws tokens from the reward pool.
     * @param _amount The amount of tokens to withdraw.
     */
    function withdrawRewardTokens(uint256 _amount) external onlyOwner {
        require(_amount > 0, "Cannot withdraw 0");
        require(_rewardPool >= _amount, "Not enough tokens in reward pool");
        _rewardPool -= _amount;
        stakingToken.transfer(msg.sender, _amount);
        emit Withdraw(msg.sender, _amount);
    }
}
