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

export default function DisableWhiteListButton() {
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

  const handleDisableWaitlist = async () => {
    writeContract({
      abi: contractABI,
      address: contractAddress,
      functionName: "disableWhitelist",
      args: [],
    });
  };
  return (
    <div>
      <button
        disabled={isPending}
        onClick={() => {
          handleDisableWaitlist();
        }}
        className="primary-button"
      >
        {isPending ? "Confirming..." : "Disable waitlist"}
      </button>
      {writeError && <p>Error: {writeError.message}</p>}
      {hash && <p>Hash: {hash}</p>}
      {isConfirming && <div>Waiting for confirmation...</div>}
      {isConfirmed && <div>Transaction confirmed.</div>}
    </div>
  );
}
