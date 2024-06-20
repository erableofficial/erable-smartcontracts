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

export default function ClaimButton({
  stakeId,
  stake,
  coolDownPeriod,
}: {
  stakeId: number;
  stake: any;
  coolDownPeriod?: string;
}) {
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

  const handleClaim = async (stakeId: number) => {
    writeContract({
      abi: contractABI,
      address: contractAddress,
      functionName: "claim",
      args: [stakeId],
    });
  };

  const [amount, startTime, requestUnstakeTime, unstakeRequested] = stake;

  const canClaimTime =
    Number(requestUnstakeTime.toString()) + Number(coolDownPeriod?.toString());

  return (
    <div>
      {Math.floor(new Date().getTime() / 1000) - canClaimTime >= 0 ? (
        <button
          disabled={isPending}
          onClick={() => {
            handleClaim(stakeId);
            console.log("Claiming");
          }}
          className="primary-button"
        >
          {isPending ? "Confirming..." : "Claim"}
        </button>
      ) : (
        <button disabled={true} className="primary-button cursor-not-allowed ">
          {isPending
            ? "Confirming..."
            : "Claim in " +
              (canClaimTime - Math.floor(new Date().getTime() / 1000)) +
              " seconds"}
        </button>
      )}
    </div>
  );
}
