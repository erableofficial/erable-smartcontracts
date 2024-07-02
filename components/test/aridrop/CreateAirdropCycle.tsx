import MerkleTree from "merkletreejs";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Address,
  encodePacked,
  formatEther,
  keccak256,
  parseEther,
} from "viem";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import {
  airdropContractABI,
  airdropContractAddress,
} from "../../../lib/blockchain-config";

interface IMerkleTreeElement {
  address: Address;
  amount: bigint;
}

export default function CreateAirdropCycle() {
  const [addAddressForm, setAddAddressForm] = useState<boolean>(false);
  const [addr, setAddr] = useState<Address>();
  const [amount, setAmount] = useState<number>(0);
  const [merkleTreeElements, setMerkleTreeElements] = useState<
    IMerkleTreeElement[]
  >([]);

  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  useEffect(() => {
    if (isConfirmed) {
      setAmount(100);
      toast.success("Transaction confirmed.");
    }
  }, [isConfirmed]);

  // error
  useEffect(() => {
    if (error) {
      toast.error("Something went wrong.");
      console.error(error);
    }
  }, [error]);

  // hash
  useEffect(() => {
    if (hash) {
      console.info("Transaction Hash: ", hash);
      toast.info("Waiting for confirmation...", {
        autoClose: 1000,
      });
    }
  }, [hash]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!addr || !amount) return;
    // add address to merkle tree
    setMerkleTreeElements([
      ...merkleTreeElements,
      {
        address: addr,
        amount: parseEther(amount.toString()),
      },
    ]);
    setAddAddressForm(false);
    setAddr(undefined);
    setAmount(0);
  };

  const handleDeleteAddressFromMerkelTree = (index: number) => {
    // delete address from merkle tree
    setMerkleTreeElements([
      ...merkleTreeElements.slice(0, index),
      ...merkleTreeElements.slice(index + 1),
    ]);
  };

  const handleCreateAirdropCycle = async () => {
    // create airdrop cycle
    console.log("Creating Airdrop Cycle...");
    if (merkleTreeElements.length === 0) {
      toast.error("No addresses to airdrop.");
      console.log("No addresses to airdrop.");
      return;
    }
    console.log("Merkle Tree Elements:", merkleTreeElements);
    const leaves = merkleTreeElements.map((element) =>
      keccak256(
        encodePacked(["address", "uint256"], [element.address, element.amount])
      )
    );
    console.log("Leaves:", leaves);

    const merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });
    const root = merkleTree.getHexRoot();
    console.log("Merkle Tree :", merkleTree);
    console.log("Merkle Tree Root:", root);

    writeContract({
      abi: airdropContractABI,
      address: airdropContractAddress,
      functionName: "createAirdropCycle",
      args: [root],
    });
  };

  return (
    <div className="flex items-center justify-center my-8 bg-surface-primary py-4 rounded-xl max-w-[60%] mx-auto ">
      <div className="min-w-[60%] mx-auto">
        <h2 className="text-2xl tracking-wide font-friends font-bold text-gray-800 text-center pb-4  ">
          Create Airdrop Cycle
        </h2>
        <p className="text-center text-gray-600">
          Create a new airdrop cycle by providing the address and amount.
        </p>
        <hr className="my-4" />
        <h3 className="text-xl text-center tracking-wide font-friends font-medium">
          Airdrop Cycle Addresses
        </h3>
        <hr className="my-4" />
        {merkleTreeElements.length > 0 && (
          <div className="">
            <div className="flex flex-col gap-2">
              {merkleTreeElements.map((element, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-5"
                >
                  <p>{element.address}</p>
                  <p>{element.amount && formatEther(element.amount)}</p>
                  <button
                    onClick={() => {
                      handleDeleteAddressFromMerkelTree(index);
                    }}
                    className="bg-warning-500 p-2 rounded-lg  font-friends font-medium text-lg"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
            <hr className="my-4" />
          </div>
        )}
        <div className="flex items-center justify-around">
          <button onClick={handleCreateAirdropCycle} className="primary-button">
            Create Airdrop Cycle
          </button>
          <button
            onClick={() => {
              setAddAddressForm(true);
              setAddr(undefined);
              setAmount(0);
            }}
            className="secondary-button"
          >
            Add Address To Cycle
          </button>
        </div>
        <hr className="my-4" />

        {addAddressForm && (
          <form
            className="gap-5 items-center flex flex-col space-y-2  "
            onSubmit={handleSubmit}
          >
            <div className="w-full">
              <label
                className="text-xl tracking-wide font-friends font-medium"
                htmlFor="address"
              >
                Address :
              </label>
              <input
                type="string"
                name="address"
                id="address"
                placeholder="0x*****"
                className="p-3 ml-2 border rounded w-[70%] "
                value={addr}
                onChange={(e) => setAddr(e.target.value as Address)}
              />
            </div>
            <div className="w-full">
              <label
                className="text-xl tracking-wide font-friends font-medium"
                htmlFor="amount"
              >
                Amount :
              </label>
              <input
                type="string"
                name="amount"
                id="amount"
                placeholder="100"
                className="p-3 ml-2 border rounded w-[70%]"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </div>

            {/* <button
              disabled={isPending}
              type="submit"
              className="secondary-button"
            >
              {isPending ? "Confirming..." : "Create Airdrop Cycle"}
            </button> */}
            <button type="submit" className="secondary-button">
              Add Address To Cycle
            </button>

            {/* {error && <p>Error: {error.message}</p>} */}
            {/* {hash && <p>Hash: {hash}</p>} */}
          </form>
        )}
      </div>
    </div>
  );
}
