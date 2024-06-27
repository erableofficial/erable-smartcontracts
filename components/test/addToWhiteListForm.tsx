import {
  useReadContract,
  useSendTransaction,
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";
import {
  contractABI,
  contractAddress,
  stakingTokenABI,
  stakingTokenAddress,
} from "../../lib/blockchain-config";
import { parseEther } from "viem";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function AddToWhiteListForm() {
  const [addr, setAddr] = useState("");

  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  useEffect(() => {
    if (isConfirmed) {
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

    writeContract({
      abi: contractABI,
      address: contractAddress,
      functionName: "addToWhitelist",
      args: [addr],
    });
  };

  return (
    <div className="flex items-center justify-center my-8 bg-surface-primary py-4 rounded-xl max-w-[60%] mx-auto ">
      <div className="min-w-[60%] mx-auto">
        <h2 className="text-2xl tracking-wide font-friends font-bold text-gray-800 text-center pb-4  ">
          Add To WhiteList Form
        </h2>
        <form
          className="gap-5 items-center flex flex-col space-y-2  "
          onSubmit={handleSubmit}
        >
          <div className="w-full">
            <label
              className="text-xl tracking-wide font-friends font-medium"
              htmlFor="addr"
            >
              Address :
            </label>
            <input
              type="string"
              name="addr"
              id="addr"
              placeholder="0x************"
              className="p-3 ml-2 border rounded w-[70%] "
              value={addr}
              onChange={(e) => setAddr(e.target.value)}
            />
          </div>

          <button
            disabled={isPending}
            type="submit"
            className="secondary-button"
          >
            {isPending ? "Confirming..." : "Add To WhiteList"}
          </button>
        </form>
      </div>
    </div>
  );
}
