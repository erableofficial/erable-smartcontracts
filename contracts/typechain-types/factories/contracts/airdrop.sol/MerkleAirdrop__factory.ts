/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type {
  Signer,
  AddressLike,
  ContractDeployTransaction,
  ContractRunner,
} from "ethers";
import type { NonPayableOverrides } from "../../../common";
import type {
  MerkleAirdrop,
  MerkleAirdropInterface,
} from "../../../contracts/airdrop.sol/MerkleAirdrop";

const _abi = [
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "_token",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "target",
        type: "address",
      },
    ],
    name: "AddressEmptyCode",
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
    name: "AddressInsufficientBalance",
    type: "error",
  },
  {
    inputs: [],
    name: "AirdropAlreadyClaimed",
    type: "error",
  },
  {
    inputs: [],
    name: "AirdropNotActive",
    type: "error",
  },
  {
    inputs: [],
    name: "CannotDepositZero",
    type: "error",
  },
  {
    inputs: [],
    name: "FailedInnerCall",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidCycleIndex",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidMerkleProof",
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
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "SafeERC20FailedOperation",
    type: "error",
  },
  {
    inputs: [],
    name: "TokenTransferFailed",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "cycleIndex",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "merkleRoot",
        type: "bytes32",
      },
    ],
    name: "AirdropCycleCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "cycleIndex",
        type: "uint256",
      },
    ],
    name: "AirdropCycleDisabled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "leaf",
        type: "bytes32",
      },
    ],
    name: "LogLeaf",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "root",
        type: "bytes32",
      },
    ],
    name: "LogMerkleRoot",
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
        indexed: true,
        internalType: "address",
        name: "claimant",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "TokensClaimed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "TokensDeposited",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "airdropCycles",
    outputs: [
      {
        internalType: "bytes32",
        name: "merkleRoot",
        type: "bytes32",
      },
      {
        internalType: "bool",
        name: "isActive",
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
        name: "cycleIndex",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "wallet",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "bytes32[]",
        name: "proof",
        type: "bytes32[]",
      },
    ],
    name: "checkClaimable",
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
        name: "cycleIndex",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "bytes32[]",
        name: "proof",
        type: "bytes32[]",
      },
    ],
    name: "claimTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_merkleRoot",
        type: "bytes32",
      },
    ],
    name: "createAirdropCycle",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "depositTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "cycleIndex",
        type: "uint256",
      },
    ],
    name: "disableAirdropCycle",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "hasClaimed",
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
        name: "cycleIndex",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "hasUserClaimed",
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
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "token",
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
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "withdrawTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b50604051610f40380380610f4083398101604081905261002f916100d4565b338061005557604051631e4fbdf760e01b81526000600482015260240160405180910390fd5b61005e81610084565b50600180546001600160a01b0319166001600160a01b0392909216919091179055610104565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6000602082840312156100e657600080fd5b81516001600160a01b03811681146100fd57600080fd5b9392505050565b610e2d806101136000396000f3fe608060405234801561001057600080fd5b50600436106100cf5760003560e01c8063972346f11161008c578063d80e720d11610066578063d80e720d146101cd578063dd49756e146101e0578063f2fde38b146101f3578063fc0c546a1461020657600080fd5b8063972346f11461017f578063b69d1a08146101a7578063ba53be3a146101ba57600080fd5b806307c7a72d146100d4578063315a095d146100fc5780633e59cca914610111578063715018a614610124578063873f6f9e1461012c5780638da5cb5b1461015a575b600080fd5b6100e76100e2366004610be7565b610219565b60405190151581526020015b60405180910390f35b61010f61010a366004610c13565b610246565b005b6100e761011f366004610c78565b610268565b61010f6103b9565b6100e761013a366004610be7565b600360209081526000928352604080842090915290825290205460ff1681565b6000546001600160a01b03165b6040516001600160a01b0390911681526020016100f3565b61019261018d366004610c13565b6103cd565b604080519283529015156020830152016100f3565b61010f6101b5366004610ce0565b6103fe565b61010f6101c8366004610c13565b61066d565b61010f6101db366004610c13565b610706565b61010f6101ee366004610c13565b6107d3565b61010f610201366004610d33565b610844565b600154610167906001600160a01b031681565b60008281526003602090815260408083206001600160a01b038516845290915290205460ff165b92915050565b61024e610884565b600154610265906001600160a01b031633836108b1565b50565b600254600090861061028d57604051630b731bb760e21b815260040160405180910390fd5b600286815481106102a0576102a0610d4e565b600091825260209091206001600290920201015460ff166102d457604051631e232a8760e31b815260040160405180910390fd5b6040516bffffffffffffffffffffffff19606087901b16602082015260348101859052600090605401604051602081830303815290604052805190602001209050600061037b85858080602002602001604051908101604052809392919081815260200183836020028082843760009201919091525050600280549092508c9150811061036357610363610d4e565b90600052602060002090600202016000015484610915565b90508080156103ad575060008881526003602090815260408083206001600160a01b038b16845290915290205460ff16155b98975050505050505050565b6103c1610884565b6103cb600061092d565b565b600281815481106103dd57600080fd5b60009182526020909120600290910201805460019091015490915060ff1682565b600254841061042057604051630b731bb760e21b815260040160405180910390fd5b600084815260036020908152604080832033845290915290205460ff161561045b5760405163e4ca4c0b60e01b815260040160405180910390fd5b6002848154811061046e5761046e610d4e565b600091825260209091206001600290920201015460ff166104a257604051631e232a8760e31b815260040160405180910390fd5b6040516bffffffffffffffffffffffff193360601b1660208201526034810184905260009060540160408051601f1981840301815290829052805160209182012080835292507f04a4f20d6a387ce097b38ccdb2227bf44a4c6df611a933c01d78d4762e7bebb5910160405180910390a17f48ea34bbce4a95382a77a55f86a31c66a0719a0d4baed17727e5b0276ebb6e7b6002868154811061054757610547610d4e565b90600052602060002090600202016000015460405161056891815260200190565b60405180910390a16105d4838380806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250506002805490925089915081106105bc576105bc610d4e565b90600052602060002090600202016000015483610915565b6105f15760405163582f497d60e11b815260040160405180910390fd5b6000858152600360209081526040808320338085529252909120805460ff1916600190811790915554610631916001600160a01b039190911690866108b1565b60405184815233907f896e034966eaaf1adc54acc0f257056febbd300c9e47182cf761982cf1f5e4309060200160405180910390a25050505050565b610675610884565b600254811061069757604051630b731bb760e21b815260040160405180910390fd5b6000600282815481106106ac576106ac610d4e565b600091825260209182902060029190910201600101805460ff1916921515929092179091556040518281527fe0a427f3c40760903210cfed0cff8190958fdee6efbe1f004589372be561f70091015b60405180910390a150565b61070e610884565b60408051808201909152818152600160208201818152600280548084018255600082905293517f405787fa12a823e0f2b7631cc41b3ba8828b3321ca811111fa75cd3aa3bb5ace9482029485015590517f405787fa12a823e0f2b7631cc41b3ba8828b3321ca811111fa75cd3aa3bb5acf909301805460ff19169315159390931790925590547f7f78dff38800845b30d90c3b43f18b940d783543d6bc0eeb68bf082fd69b1816916107bf91610d7a565b6040805191825260208201849052016106fb565b6107db610884565b806000036107fc576040516330d6375d60e11b815260040160405180910390fd5b600154610814906001600160a01b031633308461097d565b6040518181527f77acf75e237f9aae98f997395832d522bdb695e4a9bd07704936aa889a3667d1906020016106fb565b61084c610884565b6001600160a01b03811661087b57604051631e4fbdf760e01b8152600060048201526024015b60405180910390fd5b6102658161092d565b6000546001600160a01b031633146103cb5760405163118cdaa760e01b8152336004820152602401610872565b6040516001600160a01b0383811660248301526044820183905261091091859182169063a9059cbb906064015b604051602081830303815290604052915060e01b6020820180516001600160e01b0383818316178352505050506109bc565b505050565b6000826109228584610a1f565b1490505b9392505050565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6040516001600160a01b0384811660248301528381166044830152606482018390526109b69186918216906323b872dd906084016108de565b50505050565b60006109d16001600160a01b03841683610a6c565b905080516000141580156109f65750808060200190518101906109f49190610d8d565b155b1561091057604051635274afe760e01b81526001600160a01b0384166004820152602401610872565b600081815b8451811015610a6457610a5082868381518110610a4357610a43610d4e565b6020026020010151610a7a565b915080610a5c81610daf565b915050610a24565b509392505050565b606061092683836000610aa9565b6000818310610a96576000828152602084905260409020610926565b6000838152602083905260409020610926565b606081471015610ace5760405163cd78605960e01b8152306004820152602401610872565b600080856001600160a01b03168486604051610aea9190610dc8565b60006040518083038185875af1925050503d8060008114610b27576040519150601f19603f3d011682016040523d82523d6000602084013e610b2c565b606091505b5091509150610b3c868383610b46565b9695505050505050565b606082610b5b57610b5682610ba2565b610926565b8151158015610b7257506001600160a01b0384163b155b15610b9b57604051639996b31560e01b81526001600160a01b0385166004820152602401610872565b5080610926565b805115610bb25780518082602001fd5b604051630a12f52160e11b815260040160405180910390fd5b80356001600160a01b0381168114610be257600080fd5b919050565b60008060408385031215610bfa57600080fd5b82359150610c0a60208401610bcb565b90509250929050565b600060208284031215610c2557600080fd5b5035919050565b60008083601f840112610c3e57600080fd5b50813567ffffffffffffffff811115610c5657600080fd5b6020830191508360208260051b8501011115610c7157600080fd5b9250929050565b600080600080600060808688031215610c9057600080fd5b85359450610ca060208701610bcb565b935060408601359250606086013567ffffffffffffffff811115610cc357600080fd5b610ccf88828901610c2c565b969995985093965092949392505050565b60008060008060608587031215610cf657600080fd5b8435935060208501359250604085013567ffffffffffffffff811115610d1b57600080fd5b610d2787828801610c2c565b95989497509550505050565b600060208284031215610d4557600080fd5b61092682610bcb565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b8181038181111561024057610240610d64565b600060208284031215610d9f57600080fd5b8151801515811461092657600080fd5b600060018201610dc157610dc1610d64565b5060010190565b6000825160005b81811015610de95760208186018101518583015201610dcf565b50600092019182525091905056fea26469706673582212205db6cbdb99181144f5edfdbaa0e84823bd40f6a81576d4f328b530abfc41581964736f6c63430008140033";

type MerkleAirdropConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: MerkleAirdropConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class MerkleAirdrop__factory extends ContractFactory {
  constructor(...args: MerkleAirdropConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    _token: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(_token, overrides || {});
  }
  override deploy(
    _token: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(_token, overrides || {}) as Promise<
      MerkleAirdrop & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): MerkleAirdrop__factory {
    return super.connect(runner) as MerkleAirdrop__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MerkleAirdropInterface {
    return new Interface(_abi) as MerkleAirdropInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): MerkleAirdrop {
    return new Contract(address, _abi, runner) as unknown as MerkleAirdrop;
  }
}
