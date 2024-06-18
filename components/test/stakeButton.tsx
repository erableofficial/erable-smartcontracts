import {
  useReadContract,
  useSendTransaction,
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";
import { contractABI, contractAddress } from "../../lib/blockchain-config";
import { parseEther } from "viem";

export default function StakeButton() {
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

  const handleStake = async (amount: number) => {
    writeContract({
      abi: contractABI,
      address: contractAddress,
      functionName: "stake",
      args: [parseEther(amount.toString())],
    });
  };

  console.log(writeError)

  return (
    <div>
      <button
        disabled={isPending}
        onClick={() => {
          handleStake(2);
        }}
        className="primary-button"
      >
        {isPending ? "Confirming..." : "Stake 2 tokens"}
      </button>
      {writeError && <p>Error: {writeError.message}</p>}

      {hash && <p>Hash: {hash}</p>}
      {isConfirming && <div>Waiting for confirmation...</div>}
      {isConfirmed && <div>Transaction confirmed.</div>}
    </div>
  );
}
