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

export default function ApproveAddressButton() {
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

  const handleApproveAddr = async (addr: string, amount: number) => {
    writeContract({
      abi: stakingTokenABI,
      address: stakingTokenAddress,
      functionName: "approve",
      args: [addr, parseEther(amount.toString())],
    });
  };
  return (
    <div>
      <button
        disabled={isPending}
        onClick={() => {
          handleApproveAddr(contractAddress, 50);
        }}
        className="primary-button"
      >
        {isPending ? "Confirming..." : "Approve 50 tokens"}
      </button>
      {writeError && <p>Error: {writeError.message}</p>}
      {hash && <p>Hash: {hash}</p>}
      {isConfirming && <div>Waiting for confirmation...</div>}
      {isConfirmed && <div>Transaction confirmed.</div>}
    </div>
  );
}
