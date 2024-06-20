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

export default function ApproveAddressForm() {
  const [amount, setAmount] = useState(0);

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

    writeContract({
      abi: stakingTokenABI,
      address: stakingTokenAddress,
      functionName: "approve",
      args: [contractAddress, parseEther(amount.toString())],
    });
  };

  return (
    <div className="flex items-center justify-center my-8 bg-surface-primary py-4 rounded-xl max-w-[60%] mx-auto ">
      <div className="min-w-[60%] mx-auto">
        <h2 className="text-2xl tracking-wide font-friends font-bold text-gray-800 text-center pb-4  ">
          Approve ST Tokens Form
        </h2>
        <form
          className="gap-5 items-center flex flex-col space-y-2  "
          onSubmit={handleSubmit}
        >
   
          <div className="w-full">
            <label
              className="text-xl tracking-wide font-friends font-medium"
              htmlFor="amount"
            >
              Amount :
            </label>
            <input
              type="number"
              name="amount"
              id="amount"
              placeholder="100"
              className="p-3 ml-2 border rounded w-[70%] "
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>

          <button
            disabled={isPending}
            type="submit"
            className="secondary-button"
          >
            {isPending ? "Confirming..." : "Approve ST Tokens"}
          </button>

          {/* {error && <p>Error: {error.message}</p>} */}
          {/* {hash && <p>Hash: {hash}</p>} */}
        </form>
      </div>
    </div>
  );
}
