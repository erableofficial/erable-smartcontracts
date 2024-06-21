import {
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import {
  contractABI,
  contractAddress,
} from "../../lib/blockchain-config";
import { parseEther } from "viem";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function DepositRewardPoolForm() {
  const [amount, setAmount] = useState(100);

  const {
    writeContract,
    data: hash,
    error,
    isPending,
  } = useWriteContract();

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

    const amountInWei = parseEther(amount.toString());

    writeContract({
      abi: contractABI,
      address: contractAddress,
      functionName: "depositRewardTokens",
      args: [amountInWei],
    });
  };

  return (
    <div className="flex items-center justify-center my-8 bg-surface-primary py-4 rounded-xl max-w-[60%] mx-auto ">
      <div>
        <h2 className="text-2xl tracking-wide font-friends font-bold text-gray-800 text-center pb-4  ">
          Deposit Reward Pool Form
        </h2>
        <form
          className="gap-10 flex items-center justify-around"
          onSubmit={handleSubmit}
        >
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
            className="p-4 ml-2 border rounded"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
          <button
            disabled={isPending}
            type="submit"
            className="secondary-button"
          >
            {isPending ? "Confirming..." : "Deposit"}
          </button>

          {/* {error && <p>Error: {error.message}</p>} */}
          {/* {hash && <p>Hash: {hash}</p>} */}
        </form>
      </div>
    </div>
  );
}
