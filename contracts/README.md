# Polygon Staking Smart Contract

This smart contract implements a staking system on the Polygon network, allowing users to stake ERC20 tokens and earn rewards. 

## Features

* **Staking and Unstaking:** Users can stake and unstake tokens with a configurable minimum staking duration. 
* **Reward Calculation:**  Rewards are calculated based on the time staked and a configurable yield constant.
* **Slashing:**  A slashing mechanism discourages early unstaking, with a configurable starting slashing point and monthly increase.
* **Cooldown Period:** A configurable cooldown period is enforced after a user requests to unstake.
* **Whitelist:** An optional whitelist system can be enabled to control who can stake.
* **Reward Pool Management:** The contract allows for the deposit and withdrawal of reward tokens by the contract owner.
* **Pause/Unpause:** The contract owner can pause and unpause the contract, for example, for maintenance. 

## Functions

### User Functions

* **`stake(uint256 _amount)`:** Stakes `_amount` of tokens. 
    * Requires:
        * `_amount` must be greater than 0.
        * `_amount` must meet the minimum cap (if set).
        * The user's total staked amount must not exceed the maximum cap (if set).
* **`unstake(uint256 stakeId)`:** Requests to unstake the stake with the provided `stakeId`.
    * Requires:
        * The stake must have a valid amount.
        * The unstake must not have already been requested.
    * If the minimum staking duration is not reached, the user's unstake request will be registered and a cooldown period will apply.
* **`claim(uint256 stakeId)`:** Claims the unstaked stake after the cooldown period.
    * Requires:
        * An unstake request for the `stakeId` must have been made.
        * The cooldown period must have passed.
* **`getTotalStakedForUser(address user)`:** Returns the total amount of tokens staked by a user.

### Admin Functions

* **`initialize(address _stakingToken, uint256 _stakingDuration, uint256 _yieldConstant, uint256 _cooldownPeriod, uint256 _startingSlashingPoint, uint256 _monthlyIncreasePercentage)`:** The constructor for the contract.
    * `_stakingToken`: The address of the ERC20 token used for staking.
    * `_stakingDuration`: The minimum staking duration (in seconds).
    * `_yieldConstant`: A constant used in the yield calculation.
    * `_cooldownPeriod`: The cooldown time after requesting an unstake.
    * `_startingSlashingPoint`: The initial slashing percentage (as a basis point).
    * `_monthlyIncreasePercentage`: The monthly increase in the slashing percentage (as a basis point).
* **`pause()` and `unpause()`:** Pauses and unpauses the contract.
* **`updateStakingDuration(uint256 _stakingDuration)`:** Updates the minimum staking duration.
* **`updateMinCap(uint256 _minCap)`:** Updates the minimum stake amount.
* **`updateMaxCap(uint256 _maxCap)`:** Updates the maximum stake amount.
* **`updateYieldConstant(uint256 _yieldConstant)`:** Updates the yield constant.
* **`updateCooldownPeriod(uint256 _cooldownPeriod)`:** Updates the cooldown period.
* **`updateStartingSlashingPoint(uint256 _startingSlashingPoint)`:** Updates the initial slashing point.
* **`updateMonthlyIncreasePercentage(uint256 _monthlyIncreasePercentage)`:** Updates the monthly increase in the slashing point.
* **`enableWhitelist()`:** Enables the whitelist.
* **`disableWhitelist()`:** Disables the whitelist.
* **`addToWhitelist(address _address)`:** Adds an address to the whitelist.
* **`removeFromWhitelist(address _address)`:** Removes an address from the whitelist.
* **`depositRewardTokens(uint256 _amount)`:** Deposits reward tokens into the contract.
* **`withdrawRewardTokens(uint256 _amount)`:** Withdraws reward tokens from the contract.

## Events

* **`Staked(address indexed user, uint256 amount)`:** Emitted when a user successfully stakes tokens.
* **`UnstakeRequested(address indexed user, uint256 amount)`:** Emitted when a user requests to unstake.
* **`Withdrawn(address indexed user, uint256 amount)`:** Emitted when a user withdraws their staked tokens and earned reward.
* **`RewardPaid(address indexed user, uint256 reward)`:** Emitted when a user claims their earned reward.
* **`WhitelistStatusChanged(address indexed user, bool status)`:** Emitted when an address is added to or removed from the whitelist.
* **`Deposit(address indexed owner, uint256 amount)`:** Emitted when the owner deposits reward tokens.
* **`Withdraw(address indexed owner, uint256 amount)`:** Emitted when the owner withdraws reward tokens.
