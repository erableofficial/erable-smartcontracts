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

export default function AddToWaitlistButton() {
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

  const handleAddAddrToWaitlist = async (addr: string) => {
    writeContract({
      abi: contractABI,
      address: contractAddress,
      functionName: "addToWhitelist",
      args: [addr],
    });
  };
  return (
    <div>
      <button
        disabled={isPending}
        onClick={() => {
          handleAddAddrToWaitlist("0xf97184f71561ca97113329c4FbCb1079c869D702");
        }}
        className="primary-button"
      >
        {isPending ? "Confirming..." : "Add to waitlist"}
      </button>
      {writeError && <p>Error: {writeError.message}</p>}
      {hash && <p>Hash: {hash}</p>}
      {isConfirming && <div>Waiting for confirmation...</div>}
      {isConfirmed && <div>Transaction confirmed.</div>}
    </div>
  );
}
