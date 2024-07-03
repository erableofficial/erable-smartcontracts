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
import {
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
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

  const { data: airdropCycleCount, error: airdropCycleCountError } =
    useReadContract({
      abi: airdropContractABI,
      address: airdropContractAddress,
      functionName: "getAirdropCycleCount",
    });

  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  useEffect(() => {
    if (isConfirmed) {
      toast.success("Transaction confirmed.");
      // refresh the page after 1000 sec
      // setTimeout(() => {
      //   window.location.reload();
      // }, 1000);
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

  console.log("AirdopCycle : ", Number(airdropCycleCount as bigint));

  const handleCreateAirdropCycle = async () => {
    // create airdrop cycle
    console.log("Creating Airdrop Cycle...");
    if (merkleTreeElements.length === 0) {
      toast.error("No addresses to airdrop.");
      console.log("No addresses to airdrop.");
      return;
    }

    // sort merkleTreeElements by address
    const sortedMerkleTreeElements = merkleTreeElements.sort((a, b) => {
      if (a.address < b.address) return -1;
      if (a.address > b.address) return 1;
      return 0;
    });

    console.log("Sorted Merkle Tree Elements:", sortedMerkleTreeElements);

    const leaves = sortedMerkleTreeElements.map((element) =>
      keccak256(
        encodePacked(["address", "uint256"], [element.address, element.amount])
      )
    );
    console.log("Leaves:", leaves);

    const merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });
    const root = merkleTree.getHexRoot();
    console.log("Merkle Tree :", merkleTree);
    console.log("Merkle Tree Root:", root);

    // convert merkleTreeElements.amount to number ans store them int new variable elements
    const elements = merkleTreeElements.map((element) => ({
      cycle: Number(airdropCycleCount as bigint),
      address: element.address,
      amount: formatEther(element.amount),
    }));

    console.log("Elements:", elements);

    const loadingToast = toast.loading("Saving Airdrop Cycle To Redis...");

    // call /api/airdrop/create-cycle endpoint
    const response = await fetch("/api/airdrop/create-cycle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        elements,
      }),
    });

    if (!response.ok) {
      // toast.error("Failed to register airdrop cycle to db.");
      toast.update(loadingToast, {
        render: "Failed to save airdrop cycle to Redis.",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });

      return;
    }

    const { success, message } = await response.json();

    if (!success) {
      // toast.error(message);
      toast.update(loadingToast, {
        render: message,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
      return;
    }

    toast.update(loadingToast, {
      render: message,
      type: "success",
      isLoading: false,
      autoClose: 3000,
    });

    // create airdrop cycle
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
