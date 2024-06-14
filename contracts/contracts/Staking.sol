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
    IERC20 public stakingToken;
    uint256 public stakingDuration;
    uint256 public minCap;
    uint256 public maxCap;
    uint256 public yieldConstant;
    uint256 public cooldownPeriod;
    uint256 public monthsInStakingPeriod;
    uint256 public startingSlashingPoint;
    uint256 public monthlyIncreasePercentage;

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

        _totalStaked -= _amount;
        _rewardPool -= totalAmount - _amount;
        delete userStakes[msg.sender][stakeId];
        stakingToken.transfer(msg.sender, totalAmount);
        emit Withdrawn(msg.sender, totalAmount);

        if (getTotalStakedForUser(msg.sender) == 0) {
            delete userStakeCounter[msg.sender];
        }
    }

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

    function calculateTotalWithdraw(uint256 _amount, uint256 timeStaked)
        public
        view
        returns (uint256)
    {
        uint256 Y = calculateYield(timeStaked);
        uint256 T = calculateTax(timeStaked);

        uint256 reward = (_amount * Y) / 1e18;
        uint256 slashingTax = (reward * T) / 1e18;
        uint256 totalWithdrawAmount = _amount + reward - slashingTax;

        require(
            _rewardPool >= reward - slashingTax,
            "Insufficient reward pool"
        );

        return totalWithdrawAmount;
    }

    function totalStaked() external view returns (uint256) {
        return _totalStaked;
    }

    function rewardPool() external view returns (uint256) {
        return _rewardPool;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function updateStakingDuration(uint256 _stakingDuration)
        external
        onlyOwner
    {
        stakingDuration = _stakingDuration;
        monthsInStakingPeriod = _stakingDuration / 30 / 24 / 60 / 60;
    }

    function updateMinCap(uint256 _minCap) external onlyOwner {
        minCap = _minCap;
    }

    function updateMaxCap(uint256 _maxCap) external onlyOwner {
        maxCap = _maxCap;
    }

    function updateYieldConstant(uint256 _yieldConstant) external onlyOwner {
        yieldConstant = _yieldConstant;
    }

    function updateCooldownPeriod(uint256 _cooldownPeriod) external onlyOwner {
        cooldownPeriod = _cooldownPeriod;
    }

    function updateStartingSlashingPoint(uint256 _startingSlashingPoint)
        external
        onlyOwner
    {
        startingSlashingPoint = _startingSlashingPoint;
    }

    function updateMonthlyIncreasePercentage(uint256 _monthlyIncreasePercentage)
        external
        onlyOwner
    {
        monthlyIncreasePercentage = _monthlyIncreasePercentage;
    }

    function calculateYield(uint256 timeStaked)
        internal
        view
        returns (uint256)
    {
        if (timeStaked >= stakingDuration) {
            return 144 * yieldConstant;
        } else {
            uint256 X = (12 * timeStaked * 1e18) / 365 days;
            uint256 Y = (yieldConstant * X * X) / (1e18 * 1e18);
            return Y;
        }
    }

    function calculateTax(uint256 timeStaked) internal view returns (uint256) {
        if (timeStaked >= stakingDuration) {
            return 0;
        } else {
            uint256 T = startingSlashingPoint -
                (monthlyIncreasePercentage * timeStaked) /
                stakingDuration;
            return T;
        }
    }

    function enableWhitelist() external onlyOwner {
        whitelistEnabled = true;
    }

    function disableWhitelist() external onlyOwner {
        whitelistEnabled = false;
    }

    function addToWhitelist(address _address) external onlyOwner {
        whitelistedAddresses[_address] = true;
        emit WhitelistStatusChanged(_address, true);
    }

    function removeFromWhitelist(address _address) external onlyOwner {
        whitelistedAddresses[_address] = false;
        emit WhitelistStatusChanged(_address, false);
    }

    function depositRewardTokens(uint256 _amount) external onlyOwner {
        require(_amount > 0, "Cannot deposit 0");
        _rewardPool += _amount;
        stakingToken.transferFrom(msg.sender, address(this), _amount);
        emit Deposit(msg.sender, _amount);
    }

    function withdrawRewardTokens(uint256 _amount) external onlyOwner {
        require(_amount > 0, "Cannot withdraw 0");
        require(_rewardPool >= _amount, "Not enough tokens in reward pool");
        _rewardPool -= _amount;
        stakingToken.transfer(msg.sender, _amount);
        emit Withdraw(msg.sender, _amount);
    }

    function getTotalStakedForUser(address user) public view returns (uint256) {
        uint256 totalStakedTokens = 0;
        for (uint256 i = 0; i < userStakeCounter[user]; i++) {
            totalStakedTokens += userStakes[user][i].amount;
        }
        return totalStakedTokens;
    }
}
