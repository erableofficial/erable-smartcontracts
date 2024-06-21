import {
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { contractABI, contractAddress } from "../../lib/blockchain-config";
import { toast } from "react-toastify";
import { useEffect } from "react";

export default function StakeControlSection() {
  const { data: isStakingPaused, error } = useReadContract({
    abi: contractABI,
    address: contractAddress,
    functionName: "paused",
    args: [],
  });

  const {
    writeContract,
    data: hash,
    error: writeError,
    isPending,
  } = useWriteContract();

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
    if (writeError) {
      toast.error("Something went wrong.");
      console.error(writeError);
    }
  }, [writeError]);

  // hash
  useEffect(() => {
    if (hash) {
      console.info("Transaction Hash: ", hash);
      toast.info("Waiting for confirmation...", {
        autoClose: 1000,
      });
    }
  }, [hash]);

  const handlePauseStaking = async () => {
    writeContract({
      abi: contractABI,
      address: contractAddress,
      functionName: "pause",
      args: [],
    });
  };

  const handleUnpauseStaking = async () => {
    writeContract({
      abi: contractABI,
      address: contractAddress,
      functionName: "unpause",
      args: [],
    });
  };

  return (
    <div className="flex justify-center items-center bg-surface-primary max-w-[60%] mx-auto my-4 py-4 ">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl text-center">Stake Control</h1>
        <div className="flex flex-col items-center py-4">
          <div className="flex justify-center gap-5 items-center">
            <p className="capitalize text-center text-gray-800 font-friends font-bold text-xl tracking-wide ">
              {isStakingPaused ? "Staking is paused" : "Staking is Active"}
            </p>
          </div>
          <button
            onClick={
              isStakingPaused ? handleUnpauseStaking : handlePauseStaking
            }
            className="secondary-button mt-4"
          >
            {isStakingPaused ? "Unpause" : "Pause"}
          </button>
        </div>
      </div>
    </div>
  );
}
