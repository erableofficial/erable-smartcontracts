// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title Staking Contract
 * @dev A contract for staking ERC20 tokens and earning rewards.
 */
contract Staking is Initializable, OwnableUpgradeable, PausableUpgradeable, ReentrancyGuardUpgradeable {
    using SafeERC20 for IERC20;

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

    /// @notice Total amount of tokens staked in the contract
    uint256 public totalStaked;

    /// @notice Total amount of tokens in the reward pool
    uint256 public rewardPool;

    /// @notice Total amount of pending rewards
    uint256 public totalPendingRewards;

    /// @notice Structure representing a stake
    struct Stake {
        uint256 amount;
        uint32 startTime;
        uint32 stakingDuration;
        uint32 requestUnstakeTime;
        bool unstakeRequested;
        uint256 yieldConstant;
        uint256 monthlyIncreasePercentage;
        uint256 startingSlashingPoint;
    }

    /// @notice Mapping of user addresses to their stakes
    mapping(address => mapping(uint256 => Stake)) public userStakes;

    /// @notice Mapping of user addresses to their stake counters
    mapping(address => uint256) public userStakeCounter;

    /// @notice Mapping of whitelisted addresses
    mapping(address => bool) public whitelistedAddresses;

    /// @notice Emitted when a user stakes tokens
    event Staked(address indexed user, uint256 amount);

    /// @notice Emitted when a user requests to unstake tokens
    event UnstakeRequested(address indexed user, uint256 amount);

    /// @notice Emitted when a user withdraws staked tokens
    event Withdrawn(address indexed user, uint256 amount);

    /// @notice Emitted when rewards are paid to a user
    event RewardPaid(address indexed user, uint256 reward);

    /// @notice Emitted when the whitelist status of a user changes
    event WhitelistStatusChanged(address indexed user, bool status);

    /// @notice Emitted when tokens are deposited into the reward pool
    event Deposit(address indexed owner, uint256 amount);

    /// @notice Emitted when tokens are withdrawn from the reward pool
    event Withdraw(address indexed owner, uint256 amount);

    // Custom errors
    error ZeroAmount();
    error AmountBelowMinCap();
    error AmountExceedsMaxCap();
    error NotWhitelisted();
    error UnstakeNotRequested();
    error CooldownPeriodNotOver();
    error NoStakedAmount();
    error UnstakeAlreadyRequested();
    error CannotDepositZero();
    error InsufficientRewardPool();

    /// @notice Modifier to check if the caller is whitelisted
    modifier onlyWhitelisted() {
        if (whitelistEnabled && !whitelistedAddresses[msg.sender]) {
            revert NotWhitelisted();
        }
        _;
    }

    /**
     * @notice Initializes the staking contract with the given parameters
     * @param _owner The address of the contract owner
     * @param _stakingToken The address of the ERC20 token used for staking
     * @param _whitelistEnabled Indicates if whitelisting is enabled
     * @param _stakingDuration The duration for which tokens need to be staked to avoid slashing tax
     * @param _yieldConstant The constant used to calculate yield
     * @param _cooldownPeriod The cooldown period after unstake request
     * @param _startingSlashingPoint The starting point for slashing tax
     * @param _monthlyIncreasePercentage The monthly increase percentage for slashing tax
     * @param _minCap The minimum amount of tokens that can be staked
     * @param _maxCap The maximum amount of tokens that can be staked
     */
    function initialize(
        address _owner,
        address _stakingToken,
        bool _whitelistEnabled,
        uint32 _stakingDuration,
        uint256 _yieldConstant,
        uint256 _cooldownPeriod,
        uint256 _startingSlashingPoint,
        uint256 _monthlyIncreasePercentage,
        uint256 _minCap,
        uint256 _maxCap
    ) public initializer {
        __Ownable_init(msg.sender);
        __Pausable_init();
        __ReentrancyGuard_init();
        transferOwnership(_owner);

        stakingToken = IERC20(_stakingToken);
        whitelistEnabled = _whitelistEnabled;
        stakingDuration = _stakingDuration;
        yieldConstant = _yieldConstant;
        cooldownPeriod = _cooldownPeriod;
        monthsInStakingPeriod = _stakingDuration / 30 days;
        startingSlashingPoint = _startingSlashingPoint;
        monthlyIncreasePercentage = _monthlyIncreasePercentage;
        minCap = _minCap;
        maxCap = _maxCap;
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
        if (_amount == 0) {
            revert ZeroAmount();
        }
        if (minCap > 0 && _amount < minCap) {
            revert AmountBelowMinCap();
        }
        if (maxCap > 0 && _amount + getTotalStakedForUser(msg.sender) > maxCap) {
            revert AmountExceedsMaxCap();
        }

        uint256 stakeId = userStakeCounter[msg.sender];
        userStakes[msg.sender][stakeId] = Stake(
            _amount,
            uint32(block.timestamp),
            uint32(stakingDuration),
            0,
            false,
            yieldConstant,
            monthlyIncreasePercentage,
            startingSlashingPoint
        );
        ++userStakeCounter[msg.sender];
        totalStaked += _amount;
        totalPendingRewards += (_amount * calculateYield(stakingDuration, yieldConstant, stakingDuration)) / 1e18;

        stakingToken.safeTransferFrom(msg.sender, address(this), _amount);
        emit Staked(msg.sender, _amount);
    }

    /**
     * @notice Requests to unstake a specified stake
     * @param stakeId The ID of the stake to unstake
     */
    function unstake(uint256 stakeId) external nonReentrant {
        Stake storage stakeInfo = userStakes[msg.sender][stakeId];
        if (stakeInfo.amount == 0) {
            revert NoStakedAmount();
        }
        if (stakeInfo.unstakeRequested) {
            revert UnstakeAlreadyRequested();
        }

        if (block.timestamp < stakeInfo.startTime + stakeInfo.stakingDuration) {
            stakeInfo.requestUnstakeTime = uint32(block.timestamp);
            stakeInfo.unstakeRequested = true;
            emit UnstakeRequested(msg.sender, stakeInfo.amount);
            return;
        } 

        _processUnstake(msg.sender, stakeId);
    }

    /**
     * @notice Claims the tokens and rewards after the cooldown period
     * @param stakeId The ID of the stake to claim
     */
    function claim(uint256 stakeId) external nonReentrant {
        Stake storage stakeInfo = userStakes[msg.sender][stakeId];
        if (!stakeInfo.unstakeRequested) {
            revert UnstakeNotRequested();
        }
        if (block.timestamp < stakeInfo.requestUnstakeTime + cooldownPeriod) {
            revert CooldownPeriodNotOver();
        }

        _processUnstake(msg.sender, stakeId);
    }

    /**
     * @notice Internal function to process unstaking and reward calculation
     * @param user The address of the user
     * @param stakeId The ID of the stake to process
     */
    function _processUnstake(address user, uint256 stakeId) internal {
        Stake storage stakeInfo = userStakes[user][stakeId];
        uint256 _amount = stakeInfo.amount;
        uint256 totalAmount = calculateTotalWithdraw(
            _amount,
            block.timestamp - stakeInfo.startTime,
            stakeInfo.yieldConstant,
            stakeInfo.monthlyIncreasePercentage,
            stakeInfo.startingSlashingPoint,
            stakeInfo.stakingDuration
        );

        uint256 rewardAmount = totalAmount - _amount;

        totalStaked -= _amount;
        rewardPool -= rewardAmount;
        totalPendingRewards -= rewardAmount;
        delete userStakes[user][stakeId];
        stakingToken.safeTransfer(user, totalAmount);
        emit Withdrawn(user, totalAmount);
        emit RewardPaid(user, rewardAmount);

        if (getTotalStakedForUser(user) == 0) {
            delete userStakeCounter[user];
        }
    }

    /**
     * @notice Calculates the total withdrawable amount including rewards and slashing tax
     * @param _amount The initial staked amount
     * @param timeStaked The duration for which the tokens were staked
     * @param _yieldConstant The constant used to calculate yield
     * @param _monthlyIncreasePercentage The monthly increase percentage for slashing tax
     * @param _startingSlashingPoint The starting point for slashing tax
     * @param _stakingDuration The duration for which tokens need to be staked to avoid slashing tax
     * @return The total withdrawable amount
     */
    function calculateTotalWithdraw(
        uint256 _amount,
        uint256 timeStaked,
        uint256 _yieldConstant,
        uint256 _monthlyIncreasePercentage,
        uint256 _startingSlashingPoint,
        uint256 _stakingDuration
    )
        public
        view
        returns (uint256)
    {
        uint256 Y = calculateYield(timeStaked, _yieldConstant, _stakingDuration);
        uint256 T = calculateTax(timeStaked, _monthlyIncreasePercentage, _startingSlashingPoint, _stakingDuration);

        uint256 reward = (_amount * Y) / 1e18;
        uint256 slashingTax = (reward * T) / 1e18;

        return _amount + reward - slashingTax;

    }


    /**
     * @notice Returns the total amount of pending rewards in the contract
     * @return The total pending rewards
     */
    function pendingRewards() external view returns (uint256) {
        return totalPendingRewards;
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
    function updateStakingDuration(
        uint256 _stakingDuration
    ) external onlyOwner {
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
    function updateStartingSlashingPoint(
        uint256 _startingSlashingPoint
    ) external onlyOwner {
        startingSlashingPoint = _startingSlashingPoint;
    }

    /**
     * @notice Updates the monthly increase percentage for slashing tax
     * @param _monthlyIncreasePercentage The new monthly increase percentage
     */
    function updateMonthlyIncreasePercentage(
        uint256 _monthlyIncreasePercentage
    ) external onlyOwner {
        monthlyIncreasePercentage = _monthlyIncreasePercentage;
    }

    /**
     * @notice Calculates the yield based on the time staked
     * @param timeStaked The duration for which the tokens were staked
     * @param _yieldConstant The constant used to calculate yield
     * @return The calculated yield
     */
    function calculateYield(uint256 timeStaked, uint256 _yieldConstant, uint256 _stakingDuration) public view returns (uint256) {
        if (timeStaked >= _stakingDuration) {
            return 144 * _yieldConstant;
        } else {
            uint256 X = (monthsInStakingPeriod * timeStaked * 1e18) / _stakingDuration;
            uint256 Y = (_yieldConstant * X * X) / (1e36);
            return Y;
        }
    }

    /**
     * @notice Calculates the slashing tax based on the time staked
     * @param timeStaked The duration for which the tokens were staked
     * @param _monthlyIncreasePercentage The monthly increase percentage for slashing tax
     * @param _startingSlashingPoint The starting point for slashing tax
     * @param _stakingDuration The duration for which tokens need to be staked to avoid slashing tax
     * @return The calculated slashing tax
     */
    function calculateTax(
        uint256 timeStaked,
        uint256 _monthlyIncreasePercentage,
        uint256 _startingSlashingPoint,
        uint256 _stakingDuration
    ) public pure returns (uint256) {
        if (timeStaked >= _stakingDuration) {
            return 0;
        } else {
            uint256 T = _startingSlashingPoint - (_monthlyIncreasePercentage * timeStaked) / _stakingDuration;
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
        if (_amount == 0) {
            revert CannotDepositZero();
        }
        rewardPool += _amount;
        stakingToken.safeTransferFrom(msg.sender, address(this), _amount);
        emit Deposit(msg.sender, _amount);
    }

    /**
     * @notice Withdraws reward tokens from the reward pool
     * @param _amount The amount of tokens to withdraw
     */
    function withdrawRewardTokens(uint256 _amount) external onlyOwner {
        if (_amount == 0) {
            revert ZeroAmount();
        }
        if (rewardPool - totalPendingRewards < _amount) {
            revert InsufficientRewardPool();
        }
        rewardPool -= _amount;
        stakingToken.safeTransfer(msg.sender, _amount);
        emit Withdraw(msg.sender, _amount);
    }

    /**
     * @notice Returns the total staked amount for a user
     * @param user The address of the user
     * @return The total staked amount
     */
    function getTotalStakedForUser(address user) public view returns (uint256) {
        uint256 totalStakedTokens;
        uint256 stakeCount = userStakeCounter[user];
        mapping(uint256 => Stake) storage stakes = userStakes[user];

        for (uint256 i = 0; i < stakeCount; ) {
            totalStakedTokens += stakes[i].amount;
            unchecked {
                ++i;
            }
        }

        return totalStakedTokens;
    }

    /**
     * @notice Returns all user stakes as an array of Stake structs.
     * @param user The address of the user.
     * @return An array of Stake structs representing all the user's stakes.
     */
    function getUserStakes(
        address user
    ) external view returns (Stake[] memory) {
        uint256 stakeCount = userStakeCounter[user];
        Stake[] memory stakes = new Stake[](stakeCount);

        for (uint256 i = 0; i < stakeCount; ) {
            stakes[i] = userStakes[user][i];
            unchecked {
                i++;
            }
        }

        return stakes;
    }
}
