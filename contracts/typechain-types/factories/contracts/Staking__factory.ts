/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../common";
import type { Staking, StakingInterface } from "../../contracts/Staking";

const _abi = [
  {
    inputs: [],
    name: "EnforcedPause",
    type: "error",
  },
  {
    inputs: [],
    name: "ExpectedPause",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidInitialization",
    type: "error",
  },
  {
    inputs: [],
    name: "NotInitializing",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    inputs: [],
    name: "ReentrancyGuardReentrantCall",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Deposit",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint64",
        name: "version",
        type: "uint64",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Paused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "reward",
        type: "uint256",
      },
    ],
    name: "RewardPaid",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Staked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Unpaused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "UnstakeRequested",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "status",
        type: "bool",
      },
    ],
    name: "WhitelistStatusChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Withdraw",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Withdrawn",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_address",
        type: "address",
      },
    ],
    name: "addToWhitelist",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "timeStaked",
        type: "uint256",
      },
    ],
    name: "calculateTax",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "timeStaked",
        type: "uint256",
      },
    ],
    name: "calculateTotalWithdraw",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "timeStaked",
        type: "uint256",
      },
    ],
    name: "calculateYield",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "stakeId",
        type: "uint256",
      },
    ],
    name: "claim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "cooldownPeriod",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "depositRewardTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "disableWhitelist",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "enableWhitelist",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getTotalStakedForUser",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_stakingToken",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_stakingDuration",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_yieldConstant",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_cooldownPeriod",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_startingSlashingPoint",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_monthlyIncreasePercentage",
        type: "uint256",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "maxCap",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "minCap",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "monthlyIncreasePercentage",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "monthsInStakingPeriod",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_address",
        type: "address",
      },
    ],
    name: "removeFromWhitelist",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "rewardPool",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "stake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "stakingDuration",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "stakingToken",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "startingSlashingPoint",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalStaked",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "stakeId",
        type: "uint256",
      },
    ],
    name: "unstake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_cooldownPeriod",
        type: "uint256",
      },
    ],
    name: "updateCooldownPeriod",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_maxCap",
        type: "uint256",
      },
    ],
    name: "updateMaxCap",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_minCap",
        type: "uint256",
      },
    ],
    name: "updateMinCap",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_monthlyIncreasePercentage",
        type: "uint256",
      },
    ],
    name: "updateMonthlyIncreasePercentage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_stakingDuration",
        type: "uint256",
      },
    ],
    name: "updateStakingDuration",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_startingSlashingPoint",
        type: "uint256",
      },
    ],
    name: "updateStartingSlashingPoint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_yieldConstant",
        type: "uint256",
      },
    ],
    name: "updateYieldConstant",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "userStakeCounter",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "userStakes",
    outputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "startTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "requestUnstakeTime",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "unstakeRequested",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "whitelistEnabled",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "whitelistedAddresses",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "withdrawRewardTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "yieldConstant",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b50611bb1806100206000396000f3fe608060405234801561001057600080fd5b506004361061025e5760003560e01c806372f702f311610146578063b3c55721116100c3578063d2771e0111610087578063d2771e0114610545578063d6b0f48414610558578063e43252d714610560578063e6d2486614610573578063e81ba08014610586578063f2fde38b1461059957600080fd5b8063b3c557211461049f578063b5d5b5fa146104b2578063bcaabf6c14610517578063cb43b2dd1461052a578063cdfb2b4e1461053d57600080fd5b80638456cb591161010a5780638456cb591461042e578063861f6bfd146104365780638ab1d681146104495780638da5cb5b1461045c578063a694fc3a1461048c57600080fd5b806372f702f3146103d65780637a65cd0b146104015780638005a7de1461040a57806380a3301b14610413578063817b1cd21461042657600080fd5b80633f4ba83a116101df5780635678b024116101a35780635678b024146103725780635b1d7086146103925780635c975abb146103a557806366666aa9146103bd5780636f629512146103c5578063715018a6146103ce57600080fd5b80633f4ba83a1461032e5780633fa615b01461033657806345ff4c801461033f578063483a93101461035257806351fb012d1461036557600080fd5b8063291614791161022657806329161479146102d95780632e17de78146102e257806336c1105a146102f5578063379607f5146103085780633b42ffcf1461031b57600080fd5b806304646a491461026357806306c933d81461027f5780630b7ead4a146102b257806316c621e0146102bb57806323548b8b146102d0575b600080fd5b61026c60055481565b6040519081526020015b60405180910390f35b6102a261028d3660046119ba565b600c6020526000908152604090205460ff1681565b6040519015158152602001610276565b61026c60075481565b6102ce6102c93660046119dc565b6105ac565b005b61026c60035481565b61026c60085481565b6102ce6102f03660046119dc565b6106c8565b6102ce6103033660046119dc565b610a4d565b6102ce6103163660046119dc565b610a5a565b61026c6103293660046119ba565b610ca0565b6102ce610cfd565b61026c60025481565b6102ce61034d3660046119f5565b610d0f565b61026c6103603660046119dc565b610e80565b6009546102a29060ff1681565b61026c6103803660046119ba565b600b6020526000908152604090205481565b6102ce6103a03660046119dc565b610f1a565b600080516020611b3c8339815191525460ff166102a2565b600e5461026c565b61026c60065481565b6102ce610f3a565b6000546103e9906001600160a01b031681565b6040516001600160a01b039091168152602001610276565b61026c60045481565b61026c60015481565b61026c6104213660046119dc565b610f4c565b600d5461026c565b6102ce610fd3565b6102ce6104443660046119dc565b610fe3565b6102ce6104573660046119ba565b610ff0565b7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300546001600160a01b03166103e9565b6102ce61049a3660046119dc565b611047565b6102ce6104ad3660046119dc565b611335565b6104f56104c0366004611a3f565b600a60209081526000928352604080842090915290825290208054600182015460028301546003909301549192909160ff1684565b6040805194855260208501939093529183015215156060820152608001610276565b6102ce6105253660046119dc565b611342565b6102ce6105383660046119dc565b61134f565b6102ce6114ac565b61026c610553366004611a69565b6114c3565b6102ce61160e565b6102ce61056e3660046119ba565b611622565b6102ce6105813660046119dc565b611681565b6102ce6105943660046119dc565b61168e565b6102ce6105a73660046119ba565b61169b565b6105b46116d6565b600081116105fc5760405162461bcd60e51b815260206004820152601060248201526f043616e6e6f74206465706f73697420360841b60448201526064015b60405180910390fd5b80600e600082825461060e9190611aa1565b90915550506000546040516323b872dd60e01b8152336004820152306024820152604481018390526001600160a01b03909116906323b872dd906064016020604051808303816000875af115801561066a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061068e9190611ab4565b5060405181815233907fe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c906020015b60405180910390a250565b6106d0611731565b336000908152600a60209081526040808320848452909152902080546107445760405162461bcd60e51b815260206004820152602360248201527f4e6f207374616b656420616d6f756e7420746f207265717565737420756e7374604482015262616b6560e81b60648201526084016105f3565b600381015460ff16156107995760405162461bcd60e51b815260206004820152601960248201527f556e7374616b6520616c7265616479207265717565737465640000000000000060448201526064016105f3565b805460015460009081036107c2576107bb828460010154426105539190611ad6565b905061084c565b60015483600101546107d49190611aa1565b4210156108355742600284015560038301805460ff19166001179055825460405133917f828764c21e74c28710e19919735825aba966621c95cbd913f8ed65a2d298f48c9161082591815260200190565b60405180910390a2505050610a33565b610849828460010154426105539190611ad6565b90505b81600d54101561089e5760405162461bcd60e51b815260206004820152601d60248201527f4f766572666c6f773a20746f74616c207374616b656420616d6f756e7400000060448201526064016105f3565b81600d60008282546108b09190611ad6565b90915550600090506108c28383611ad6565b905080600e5410156109165760405162461bcd60e51b815260206004820152601c60248201527f4f766572666c6f773a2072657761726420706f6f6c20616d6f756e740000000060448201526064016105f3565b80600e60008282546109289190611ad6565b9091555050336000818152600a602090815260408083208984529091528082208281556001810183905560028101839055600301805460ff191690559054905163a9059cbb60e01b81526004810192909252602482018490526001600160a01b03169063a9059cbb906044016020604051808303816000875af11580156109b3573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109d79190611ab4565b5060405182815233907f7084f5476618d8e60b11ef0d7d3f06914655adb8793e28ff7f018d4c76d505d59060200160405180910390a2610a1633610ca0565b600003610a2e57336000908152600b60205260408120555b505050505b610a4a6001600080516020611b5c83398151915255565b50565b610a556116d6565b600455565b610a62611731565b610a6a61177d565b336000908152600a602090815260408083208484529091529020600381015460ff16610ad05760405162461bcd60e51b8152602060048201526015602482015274155b9cdd185ad9481b9bdd081c995c5d595cdd1959605a1b60448201526064016105f3565b6005548160020154610ae29190611aa1565b421015610b315760405162461bcd60e51b815260206004820152601860248201527f436f6f6c646f776e20706572696f64206e6f74206f766572000000000000000060448201526064016105f3565b80546001820154600090610b4b9083906105539042611ad6565b905081600d6000828254610b5f9190611ad6565b90915550610b6f90508282611ad6565b600e6000828254610b809190611ad6565b9091555050336000818152600a602090815260408083208884529091528082208281556001810183905560028101839055600301805460ff191690559054905163a9059cbb60e01b81526004810192909252602482018390526001600160a01b03169063a9059cbb906044016020604051808303816000875af1158015610c0b573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c2f9190611ab4565b5060405181815233907f7084f5476618d8e60b11ef0d7d3f06914655adb8793e28ff7f018d4c76d505d59060200160405180910390a2610c6e33610ca0565b600003610c8657336000908152600b60205260408120555b505050610a4a6001600080516020611b5c83398151915255565b6001600160a01b0381166000908152600b6020908152604080832054600a9092528220829190825b82811015610cf357600081815260208390526040902054610ce99085611aa1565b9350600101610cc8565b5091949350505050565b610d056116d6565b610d0d6117ae565b565b7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a008054600160401b810460ff16159067ffffffffffffffff16600081158015610d555750825b905060008267ffffffffffffffff166001148015610d725750303b155b905081158015610d80575080155b15610d9e5760405163f92ee8a960e01b815260040160405180910390fd5b845467ffffffffffffffff191660011785558315610dc857845460ff60401b1916600160401b1785555b610dd13361180e565b610dd961181f565b610de161182f565b600080546001600160a01b0319166001600160a01b038d1617815560018b9055600281905560035560048990556005889055610e2062278d008b611ae9565b600655600787905560088690558315610e7357845460ff60401b19168555604051600181527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d29060200160405180910390a15b5050505050505050505050565b60006001548210610e9357506000919050565b600060015483600854610ea69190611b0b565b610eb09190611ae9565b600754610ebd9190611ad6565b905060008111610f0f5760405162461bcd60e51b815260206004820152601d60248201527f43616e6e6f7420736c6173682061206e656761746976652076616c756500000060448201526064016105f3565b92915050565b919050565b610f226116d6565b6001819055610f3462278d0082611ae9565b60065550565b610f426116d6565b610d0d600061183f565b60006001548210610f6557600454610f0f906090611b0b565b600060015483600654610f789190611b0b565b610f8a90670de0b6b3a7640000611b0b565b610f949190611ae9565b905060006ec097ce7bc90715b34b9f10000000008283600454610fb79190611b0b565b610fc19190611b0b565b610fcb9190611ae9565b949350505050565b610fdb6116d6565b610d0d6118b0565b610feb6116d6565b600555565b610ff86116d6565b6001600160a01b0381166000818152600c60209081526040808320805460ff19169055519182527f8daaf060c3306c38e068a75c054bf96ecd85a3db1252712c4d93632744c42e0d91016106bd565b61104f611731565b61105761177d565b60095460ff1615806110785750336000908152600c602052604090205460ff165b6110c45760405162461bcd60e51b815260206004820152601760248201527f41646472657373206e6f742077686974656c697374656400000000000000000060448201526064016105f3565b600081116111055760405162461bcd60e51b815260206004820152600e60248201526d043616e6e6f74207374616b6520360941b60448201526064016105f3565b6002541561115f5760025481101561115f5760405162461bcd60e51b815260206004820152601860248201527f416d6f756e742062656c6f77206d696e696d756d20636170000000000000000060448201526064016105f3565b600354156111cb5760035461117333610ca0565b61117d9083611aa1565b11156111cb5760405162461bcd60e51b815260206004820152601a60248201527f416d6f756e742065786365656473206d6178696d756d2063617000000000000060448201526064016105f3565b336000818152600b602081815260408084208054825160808101845288815242818601908152818501888152606083018981528a8a52600a8852868a20858b528852958920835181559151600183015551600282015593516003909401805460ff191694151594909417909355958552929091528154909290919061124f83611b22565b919050555082600d60008282546112669190611aa1565b90915550506000546040516323b872dd60e01b8152336004820152306024820152604481018590526001600160a01b03909116906323b872dd906064016020604051808303816000875af11580156112c2573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906112e69190611ab4565b5060405183815233907f9e71bc8eea02a63969f509818f2dafb9254532904319f9dbda79b67bd34a5f3d9060200160405180910390a25050610a4a6001600080516020611b5c83398151915255565b61133d6116d6565b600855565b61134a6116d6565b600255565b6113576116d6565b6000811161139b5760405162461bcd60e51b8152602060048201526011602482015270043616e6e6f74207769746864726177203607c1b60448201526064016105f3565b80600e5410156113ed5760405162461bcd60e51b815260206004820181905260248201527f4e6f7420656e6f75676820746f6b656e7320696e2072657761726420706f6f6c60448201526064016105f3565b80600e60008282546113ff9190611ad6565b909155505060005460405163a9059cbb60e01b8152336004820152602481018390526001600160a01b039091169063a9059cbb906044016020604051808303816000875af1158015611455573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906114799190611ab4565b5060405181815233907f884edad9ce6fa2440d8a54cc123490eb96d2768479d49ff9c7366125a9424364906020016106bd565b6114b46116d6565b6009805460ff19166001179055565b6000806114cf83610f4c565b905060006114dc84610e80565b90506000670de0b6b3a76400006114f38488611b0b565b6114fd9190611ae9565b90506000670de0b6b3a76400006115148484611b0b565b61151e9190611ae9565b90508661152b8382611aa1565b101561158f5760405162461bcd60e51b815260206004820152602d60248201527f4f766572666c6f7720696e20746f74616c20776974686472617720616d6f756e60448201526c3a1031b0b631bab630ba34b7b760991b60648201526084016105f3565b60008161159c848a611aa1565b6115a69190611ad6565b90506115b28284611ad6565b600e5410156116035760405162461bcd60e51b815260206004820152601860248201527f496e73756666696369656e742072657761726420706f6f6c000000000000000060448201526064016105f3565b979650505050505050565b6116166116d6565b6009805460ff19169055565b61162a6116d6565b6001600160a01b0381166000818152600c6020908152604091829020805460ff1916600190811790915591519182527f8daaf060c3306c38e068a75c054bf96ecd85a3db1252712c4d93632744c42e0d91016106bd565b6116896116d6565b600755565b6116966116d6565b600355565b6116a36116d6565b6001600160a01b0381166116cd57604051631e4fbdf760e01b8152600060048201526024016105f3565b610a4a8161183f565b336117087f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300546001600160a01b031690565b6001600160a01b031614610d0d5760405163118cdaa760e01b81523360048201526024016105f3565b600080516020611b5c83398151915280546001190161176357604051633ee5aeb560e01b815260040160405180910390fd5b60029055565b6001600080516020611b5c83398151915255565b600080516020611b3c8339815191525460ff1615610d0d5760405163d93c066560e01b815260040160405180910390fd5b6117b66118f9565b600080516020611b3c833981519152805460ff191681557f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa335b6040516001600160a01b03909116815260200160405180910390a150565b611816611929565b610a4a81611972565b611827611929565b610d0d61197a565b611837611929565b610d0d61199b565b7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c19930080546001600160a01b031981166001600160a01b03848116918217845560405192169182907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a3505050565b6118b861177d565b600080516020611b3c833981519152805460ff191660011781557f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258336117f0565b600080516020611b3c8339815191525460ff16610d0d57604051638dfc202b60e01b815260040160405180910390fd5b7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a0054600160401b900460ff16610d0d57604051631afcd79f60e31b815260040160405180910390fd5b6116a3611929565b611982611929565b600080516020611b3c833981519152805460ff19169055565b611769611929565b80356001600160a01b0381168114610f1557600080fd5b6000602082840312156119cc57600080fd5b6119d5826119a3565b9392505050565b6000602082840312156119ee57600080fd5b5035919050565b60008060008060008060c08789031215611a0e57600080fd5b611a17876119a3565b9860208801359850604088013597606081013597506080810135965060a00135945092505050565b60008060408385031215611a5257600080fd5b611a5b836119a3565b946020939093013593505050565b60008060408385031215611a7c57600080fd5b50508035926020909101359150565b634e487b7160e01b600052601160045260246000fd5b80820180821115610f0f57610f0f611a8b565b600060208284031215611ac657600080fd5b815180151581146119d557600080fd5b81810381811115610f0f57610f0f611a8b565b600082611b0657634e487b7160e01b600052601260045260246000fd5b500490565b8082028115828204841417610f0f57610f0f611a8b565b600060018201611b3457611b34611a8b565b506001019056fecd5ed15c6e187e77e9aee88184c21f4f2182ab5827cb3b7e07fbedcd63f033009b779b17422d0df92223018b32b4d1fa46e071723d6817e2486d003becc55f00a2646970667358221220b9f6ad9444e9efe9d4e5d004b820ac5dd26195bbd3fdd2de0eae3bf00ba47b1464736f6c63430008140033";

type StakingConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: StakingConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Staking__factory extends ContractFactory {
  constructor(...args: StakingConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      Staking & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): Staking__factory {
    return super.connect(runner) as Staking__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): StakingInterface {
    return new Interface(_abi) as StakingInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): Staking {
    return new Contract(address, _abi, runner) as unknown as Staking;
  }
}
