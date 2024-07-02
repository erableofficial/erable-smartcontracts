import { useEffect, useState } from "react";
import {
  Address,
  encodePacked,
  formatEther,
  keccak256,
  parseEther,
} from "viem";
import { IMerkleTreeElement } from "../../../lib/types";
import { toast } from "react-toastify";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import MerkleTree from "merkletreejs";
import {
  airdropContractABI,
  airdropContractAddress,
} from "../../../lib/blockchain-config";

interface IJsonData {
  address: Address;
  amount: number;
}

export default function CreateAirdropCycleFromJson() {
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
      toast.success("Transaction confirmed.");
      // refresh the page after 1000 sec
      setTimeout(() => {
        window.location.reload();
      }, 1000);
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const jsonData = JSON.parse(e.target?.result?.toString() || "{}");

        const formattedData: IMerkleTreeElement[] = jsonData.map(
          (item: IJsonData) => ({
            ...item,
            amount: item.amount
              ? parseEther(item.amount.toString())
              : undefined,
          })
        );
        setMerkleTreeElements(formattedData);
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    };
    reader.readAsText(file);
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
          Create Airdrop Cycle from JSON
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
                </div>
              ))}
            </div>
            <hr className="my-4" />
          </div>
        )}
        <div className="flex justify-center items-center">
          <input type="file" onChange={handleFileChange} />
        </div>
        <hr className="my-4" />

        <div className="flex items-center justify-around">
          <button onClick={handleCreateAirdropCycle} className="primary-button">
            Create Airdrop Cycle
          </button>
        </div>
        <hr className="my-4" />
      </div>
    </div>
  );
}
