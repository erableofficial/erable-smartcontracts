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
contract Staking is
    Initializable,
    OwnableUpgradeable,
    PausableUpgradeable,
    ReentrancyGuardUpgradeable
{
    /// @notice The ERC20 token used for staking
    IERC20 public stakingToken;

    /// @notice The duration for which tokens need to be staked to avoid slashing tax
    uint256 public stakingDuration;

    /// @notice The minimum amount of tokens that can be staked
    uint256 public minCap;

    /// @notice The maximum amount of tokens that can be staked
    uint256 public maxCap;

    /// @notice The constant used to calculate yield
    uint256 public yieldConstant;

    /// @notice The cooldown period after unstake request
    uint256 public cooldownPeriod;

    /// @notice The number of months in the staking period
    uint256 public monthsInStakingPeriod;

    /// @notice The starting point for slashing tax
    uint256 public startingSlashingPoint;

    /// @notice The monthly increase percentage for slashing tax
    uint256 public monthlyIncreasePercentage;

    /// @notice Indicates if whitelisting is enabled
    bool public whitelistEnabled;

    struct Stake {
        uint256 amount;
        uint256 startTime;
        uint256 requestUnstakeTime;
        bool unstakeRequested;
    }

    mapping(address => mapping(uint256 => Stake)) public userStakes;
    mapping(address => uint256) public userStakeCounter;
    mapping(address => bool) public whitelistedAddresses;
    uint256 private _totalStaked;
    uint256 private _rewardPool;

    event Staked(address indexed user, uint256 amount);
    event UnstakeRequested(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);
    event WhitelistStatusChanged(address indexed user, bool status);
    event Deposit(address indexed owner, uint256 amount);
    event Withdraw(address indexed owner, uint256 amount);

    modifier onlyWhitelisted() {
        require(
            !whitelistEnabled || whitelistedAddresses[msg.sender],
            "Address not whitelisted"
        );
        _;
    }

    /**
     * @notice Initializes the staking contract with the given parameters
     * @param _stakingToken The address of the ERC20 token used for staking
     * @param _stakingDuration The duration for which tokens need to be staked to avoid slashing tax
     * @param _yieldConstant The constant used to calculate yield
     * @param _cooldownPeriod The cooldown period after unstake request
     * @param _startingSlashingPoint The starting point for slashing tax
     * @param _monthlyIncreasePercentage The monthly increase percentage for slashing tax
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
        monthsInStakingPeriod = _stakingDuration / 30 days;
        startingSlashingPoint = _startingSlashingPoint;
        monthlyIncreasePercentage = _monthlyIncreasePercentage;
    }

    /**
     * @notice Stakes a specified amount of tokens
     * @param _amount The amount of tokens to stake
     */
    function stake(uint256 _amount)
        external
        nonReentrant
        whenNotPaused
        onlyWhitelisted
    {
        require(_amount > 0, "Cannot stake 0");
        if (minCap > 0) {
            require(_amount >= minCap, "Amount below minimum cap");
        }
        if (maxCap > 0) {
            require(_amount + getTotalStakedForUser(msg.sender) <= maxCap, "Amount exceeds maximum cap");
        }

        uint256 stakeId = userStakeCounter[msg.sender];
        Stake memory newStake = Stake(_amount, block.timestamp, 0, false);
        userStakes[msg.sender][stakeId] = newStake;
        userStakeCounter[msg.sender]++;
        _totalStaked += _amount;
        stakingToken.transferFrom(msg.sender, address(this), _amount);
        emit Staked(msg.sender, _amount);
    }

    /**
     * @notice Requests to unstake a specified stake
     * @param stakeId The ID of the stake to unstake
     */
    function unstake(uint256 stakeId) external nonReentrant {
    Stake storage stakeInfo = userStakes[msg.sender][stakeId];
    require(stakeInfo.amount > 0, "No staked amount to request unstake");
    require(!stakeInfo.unstakeRequested, "Unstake already requested");

    uint256 _amount = stakeInfo.amount;
    uint256 totalAmount;

    if (stakingDuration == 0) {
        totalAmount = calculateTotalWithdraw(_amount, block.timestamp - stakeInfo.startTime);
    } else if (block.timestamp < stakeInfo.startTime + stakingDuration) {
        stakeInfo.requestUnstakeTime = block.timestamp;
        stakeInfo.unstakeRequested = true;
        emit UnstakeRequested(msg.sender, stakeInfo.amount);
        return;
    } else {
        totalAmount = calculateTotalWithdraw(_amount, block.timestamp - stakeInfo.startTime);
    }

    require(_totalStaked >= _amount, "Overflow: total staked amount");
    _totalStaked -= _amount;

    uint256 rewardAmount = totalAmount - _amount;
    require(_rewardPool >= rewardAmount, "Overflow: reward pool amount");
    _rewardPool -= rewardAmount;

    delete userStakes[msg.sender][stakeId];
    stakingToken.transfer(msg.sender, totalAmount);
    emit Withdrawn(msg.sender, totalAmount);

    if (getTotalStakedForUser(msg.sender) == 0) {
        delete userStakeCounter[msg.sender];
    }
}


    /**
     * @notice Claims the tokens and rewards after the cooldown period
     * @param stakeId The ID of the stake to claim
     */
    function claim(uint256 stakeId) external nonReentrant whenNotPaused {
        Stake storage stakeInfo = userStakes[msg.sender][stakeId];
        require(stakeInfo.unstakeRequested, "Unstake not requested");
        require(block.timestamp >= stakeInfo.requestUnstakeTime + cooldownPeriod, "Cooldown period not over");

        uint256 _amount = stakeInfo.amount;
        uint256 totalAmount = calculateTotalWithdraw(_amount, block.timestamp - stakeInfo.startTime);

        _totalStaked -= _amount;
        _rewardPool -= totalAmount - _amount;
        delete userStakes[msg.sender][stakeId];
        stakingToken.transfer(msg.sender, totalAmount);
        emit Withdrawn(msg.sender, totalAmount);

        if (getTotalStakedForUser(msg.sender) == 0) {
            delete userStakeCounter[msg.sender];
        }
    }

    /**
     * @notice Calculates the total withdrawable amount including rewards and slashing tax
     * @param _amount The initial staked amount
     * @param timeStaked The duration for which the tokens were staked
     * @return The total withdrawable amount
     */
function calculateTotalWithdraw(uint256 _amount, uint256 timeStaked)
    public
    view
    returns (uint256)
{
    uint256 Y = calculateYield(timeStaked);
    uint256 T = calculateTax(timeStaked);

    // Ensure that reward calculation does not overflow
    uint256 reward = (_amount * Y) / 1e18;

    // Ensure that slashing tax calculation does not overflow
    uint256 slashingTax = (reward * T) / 1e18;

    // Ensure that total withdraw amount does not overflow
    require(_amount + reward >= _amount, "Overflow in total withdraw amount calculation");
    uint256 totalWithdrawAmount = _amount + reward - slashingTax;

    require(
        _rewardPool >= reward - slashingTax,
        "Insufficient reward pool"
    );

    return totalWithdrawAmount;
}


    /**
     * @notice Returns the total amount of tokens staked in the contract
     * @return The total staked amount
     */
    function totalStaked() external view returns (uint256) {
        return _totalStaked;
    }

    /**
     * @notice Returns the total amount of tokens in the reward pool
     * @return The total reward pool amount
     */
    function rewardPool() external view returns (uint256) {
        return _rewardPool;
    }

    /**
     * @notice Pauses the staking contract
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Unpauses the staking contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @notice Updates the staking duration
     * @param _stakingDuration The new staking duration
     */
    function updateStakingDuration(uint256 _stakingDuration)
        external
        onlyOwner
    {
        stakingDuration = _stakingDuration;
        monthsInStakingPeriod = _stakingDuration / 30 days;
    }

    /**
     * @notice Updates the minimum cap for staking
     * @param _minCap The new minimum cap
     */
    function updateMinCap(uint256 _minCap) external onlyOwner {
        minCap = _minCap;
    }

    /**
     * @notice Updates the maximum cap for staking
     * @param _maxCap The new maximum cap
     */
    function updateMaxCap(uint256 _maxCap) external onlyOwner {
        maxCap = _maxCap;
    }

    /**
     * @notice Updates the yield constant
     * @param _yieldConstant The new yield constant
     */
    function updateYieldConstant(uint256 _yieldConstant) external onlyOwner {
        yieldConstant = _yieldConstant;
    }

    /**
     * @notice Updates the cooldown period
     * @param _cooldownPeriod The new cooldown period
     */
    function updateCooldownPeriod(uint256 _cooldownPeriod) external onlyOwner {
        cooldownPeriod = _cooldownPeriod;
    }

    /**
     * @notice Updates the starting slashing point
     * @param _startingSlashingPoint The new starting slashing point
     */
    function updateStartingSlashingPoint(uint256 _startingSlashingPoint)
        external
        onlyOwner
    {
        startingSlashingPoint = _startingSlashingPoint;
    }

    /**
     * @notice Updates the monthly increase percentage for slashing tax
     * @param _monthlyIncreasePercentage The new monthly increase percentage
     */
    function updateMonthlyIncreasePercentage(uint256 _monthlyIncreasePercentage)
        external
        onlyOwner
    {
        monthlyIncreasePercentage = _monthlyIncreasePercentage;
    }

    /**
     * @notice Calculates the yield based on the time staked
     * @param timeStaked The duration for which the tokens were staked
     * @return The calculated yield
     */
    function calculateYield(uint256 timeStaked)
        public
        view
        returns (uint256)
    {
        if (timeStaked >= stakingDuration) {
            return 144 * yieldConstant;
        } else {
            uint256 X = (monthsInStakingPeriod * timeStaked * 1e18) / stakingDuration;
            uint256 Y = (yieldConstant * X * X) / (1e18 * 1e18);
            return Y;
        }
    }

    /**
     * @notice Calculates the slashing tax based on the time staked
     * @param timeStaked The duration for which the tokens were staked
     * @return The calculated slashing tax
     */
    function calculateTax(uint256 timeStaked) public view returns (uint256) {
        if (timeStaked >= stakingDuration) {
            return 0;
        } else {
            uint256 T = startingSlashingPoint -
                (monthlyIncreasePercentage * timeStaked) /
                stakingDuration;
            require(T > 0 , "Cannot slash a negative value");
            return T;
        }
    }

    /**
     * @notice Enables the whitelist
     */
    function enableWhitelist() external onlyOwner {
        whitelistEnabled = true;
    }

    /**
     * @notice Disables the whitelist
     */
    function disableWhitelist() external onlyOwner {
        whitelistEnabled = false;
    }

    /**
     * @notice Adds an address to the whitelist
     * @param _address The address to add
     */
    function addToWhitelist(address _address) external onlyOwner {
        whitelistedAddresses[_address] = true;
        emit WhitelistStatusChanged(_address, true);
    }

    /**
     * @notice Removes an address from the whitelist
     * @param _address The address to remove
     */
    function removeFromWhitelist(address _address) external onlyOwner {
        whitelistedAddresses[_address] = false;
        emit WhitelistStatusChanged(_address, false);
    }

    /**
     * @notice Deposits reward tokens into the reward pool
     * @param _amount The amount of tokens to deposit
     */
    function depositRewardTokens(uint256 _amount) external onlyOwner {
        require(_amount > 0, "Cannot deposit 0");
        _rewardPool += _amount;
        stakingToken.transferFrom(msg.sender, address(this), _amount);
        emit Deposit(msg.sender, _amount);
    }

    /**
     * @notice Withdraws reward tokens from the reward pool
     * @param _amount The amount of tokens to withdraw
     */
    function withdrawRewardTokens(uint256 _amount) external onlyOwner {
        require(_amount > 0, "Cannot withdraw 0");
        require(_rewardPool >= _amount, "Not enough tokens in reward pool");
        _rewardPool -= _amount;
        stakingToken.transfer(msg.sender, _amount);
        emit Withdraw(msg.sender, _amount);
    }

    /**
     * @notice Returns the total staked amount for a user
     * @param user The address of the user
     * @return The total staked amount
     */
    function getTotalStakedForUser(address user) public view returns (uint256) {
    uint256 totalStakedTokens = 0;
    uint256 stakeCount = userStakeCounter[user]; // Read from storage only once
    mapping(uint256 => Stake) storage stakes = userStakes[user]; // Cache the mapping

    for (uint256 i = 0; i < stakeCount; ) {
        totalStakedTokens += stakes[i].amount;
        unchecked {
            i++;
        }
    }

    return totalStakedTokens;
}

}
