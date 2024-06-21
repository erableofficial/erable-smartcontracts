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
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function UnstackButton({ stakeId }: { stakeId: number }) {
  const account = useAccount();
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

  const handleUnstack = async (stakeId: number) => {
    writeContract({
      abi: contractABI,
      address: contractAddress,
      functionName: "unstake",
      args: [stakeId],
    });
  };
  return (
    <div>
      <button
        disabled={isPending}
        onClick={() => {
          handleUnstack(stakeId);
          console.log("Unstaking");
        }}
        className="primary-button"
      >
        {isPending ? "Confirming..." : "Unstack"}
      </button>
    </div>
  );
}
