// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Staking is Ownable {
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

    function stake(uint256 _amount) external {
        require(_amount > 0, "Cannot stake 0");
        stakingToken.transferFrom(msg.sender, address(this), _amount);
        userStakes[msg.sender] = Stake(_amount, block.timestamp);
        _totalSupply += _amount;
        emit Staked(msg.sender, _amount);
    }

    function withdraw() public {
        Stake storage stakeInfo = userStakes[msg.sender];
        require(stakeInfo.amount > 0, "No staked amount to withdraw");
        uint256 _amount = stakeInfo.amount;
        uint256 totalAmount = calculateTotalWithdraw(_amount, stakeInfo.startTime);

        stakingToken.transfer(msg.sender, totalAmount);
        stakeInfo.amount = 0;
        _totalSupply -= _amount;
        emit Withdrawn(msg.sender, totalAmount);
    }

    function calculateTotalWithdraw(uint256 _amount, uint256 startTime)
        public
        view
        returns (uint256)
    {
        uint256 daysStaked = (block.timestamp - startTime) / 1 days;
        uint256 X = (12 * daysStaked * 1e18) / 365;
        uint256 Y;
        uint256 T;

        if (daysStaked >= 365) {
            Y = 144 * YIELD_CONSTANT;
            T = 0;
        } else {
            Y = (YIELD_CONSTANT * X * X) / (1e18 * 1e18);
            T = (0.6 * 1e18) - (0.48 * 1e18 * daysStaked) / 365;
        }

        uint256 reward = (_amount * Y) / 1e18;
        uint256 slashingTax = (reward * T) / 1e18;
        uint256 totalWithdrawAmount = _amount + reward - slashingTax;

        return totalWithdrawAmount;
    }

    function calculateTotalWithdrawal(uint256 _amount, uint256 period)
        public
        pure
        returns (uint256)
    {
        //uint256 daysStaked = (block.timestamp - startTime) / 1 days;
        uint256 X = (12 * period * 1e18) / 365;
        uint256 Y;
        uint256 T;

        if (period >= 365) {
            Y = 144 * YIELD_CONSTANT;
            T = 0;
        } else {
            Y = (YIELD_CONSTANT * X * X) / (1e18 * 1e18);
            T = (0.6 * 1e18) - (0.48 * 1e18 * period) / 365;
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
