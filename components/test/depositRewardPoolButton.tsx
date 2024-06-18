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

export default function DepositRewardPoolButton() {
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

  const handleDepositRewardPool = async (amount: number) => {
    const amountInWei = parseEther(amount.toString());

    writeContract({
      abi: contractABI,
      address: contractAddress,
      functionName: "depositRewardTokens",
      args: [amountInWei],
    });
  };

  return (
    <div>
      <button
        disabled={isPending}
        onClick={() => {
          handleDepositRewardPool(500);
        }}
        className="primary-button"
      >
        {isPending ? "Confirming..." : "Deposit Reward Pool"}
      </button>
      {writeError && <p>Error: {writeError.message}</p>}
      {hash && <p>Hash: {hash}</p>}
      {isConfirming && <div>Waiting for confirmation...</div>}
      {isConfirmed && <div>Transaction confirmed.</div>}
    </div>
  );
}
