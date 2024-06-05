// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Staking is Ownable, ReentrancyGuard {
    IERC20 public stakingToken;
    //uint256 public penaltyRate; // Penalty rate for early withdrawal (in basis points, e.g., 1000 = 10%)
    uint256 public stakingDuration; // Minimum staking duration in seconds
    uint256 public constant YIELD_CONSTANT = 0.0008 * 1e18; // Yield constant in wei for better precision

    struct Stake {
        uint256 amount;
        uint256 startTime;
    }

    mapping(address => Stake) public userStakes;
    uint256 private _totalSupply;

    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);

    constructor(
        address _stakingToken,
        uint256 _stakingDuration
    ) Ownable(msg.sender) {
        stakingToken = IERC20(_stakingToken);
        stakingDuration = _stakingDuration;
    }

    function stake(uint256 _amount) external nonReentrant{
        require(_amount > 0, "Cannot stake 0");
        userStakes[msg.sender] = Stake(_amount, block.timestamp);
        _totalSupply += _amount;
        stakingToken.transferFrom(msg.sender, address(this), _amount);
        emit Staked(msg.sender, _amount);
    }

    function unstake() public nonReentrant{
        Stake storage stakeInfo = userStakes[msg.sender];
        require(stakeInfo.amount > 0, "No staked amount to withdraw");
        uint256 _amount = stakeInfo.amount;
        uint256 totalAmount = calculateTotalWithdraw(_amount, stakeInfo.startTime);

        stakeInfo.amount = 0;
        _totalSupply -= _amount;
        stakingToken.transfer(msg.sender, totalAmount);
        emit Withdrawn(msg.sender, totalAmount);
    }

    function calculateTotalWithdraw(uint256 _amount, uint256 startTime)
    public
    view
    returns (uint256)
{
    uint256 timeStaked = block.timestamp - startTime;
    uint256 X = (12 * timeStaked * 1e18) / stakingDuration;
    uint256 Y;
    uint256 T;

    if (timeStaked >= stakingDuration) {
        Y = 144 * YIELD_CONSTANT;
        T = 0;
    } else {
        Y = (YIELD_CONSTANT * X * X) / (1e18 * 1e18);
        T = (0.6 * 1e18) - (0.48 * 1e18 * timeStaked) / stakingDuration;
    }

    uint256 reward = (_amount * Y) / 1e18;
    uint256 slashingTax = (reward * T) / 1e18;
    uint256 totalWithdrawAmount = _amount + reward - slashingTax;

    return totalWithdrawAmount;
}

    function totalSupply() external view returns (uint256) {
        return _totalSupply;
    }
}
