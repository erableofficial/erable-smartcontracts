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

export default function UnstackButton() {
  const account = useAccount();
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
          handleUnstack(0);
        }}
        className="primary-button"
      >
        {isPending ? "Confirming..." : "Unstack"}
      </button>
      {writeError && <p>Error: {writeError.message}</p>}
      {hash && <p>Hash: {hash}</p>}
      {isConfirming && <div>Waiting for confirmation...</div>}
      {isConfirmed && <div>Transaction confirmed.</div>}
    </div>
  );
}
