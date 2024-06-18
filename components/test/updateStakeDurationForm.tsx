import { useState } from "react";
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

export default function UpdateStakeDurationForm() {
  const [stakeDuration, setStakeDuration] = useState(0);
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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStakeDuration(Number(event.target.value));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle form submission here
    console.log("Updating staking duration....");
    writeContract({
      address: contractAddress,
      abi: contractABI,
      functionName: "updateStakingDuration",
      args: [stakeDuration.toString()],
    });
    console.log("Stake duration updated:", stakeDuration);
  };

  return (
    <form
      className="flex items-center justify-center gap-6 my-8"
      onSubmit={handleSubmit}
    >
      <label className="text-xl font-medium">
        Stake Duration (days):
        <input
          type="number"
          name="stakeDuration"
          value={stakeDuration}
          onChange={handleChange}
          className="p-4 ml-2 border rounded"
        />
      </label>
      <button className="secondary-button" type="submit">
        Update
      </button>
      {writeError && <p>Error: {writeError.message}</p>}
      {isPending && <p>Updating stake duration...</p>}
      {isConfirmed && <p>Stake duration updated!</p>}
      {isConfirming && <p>Confirming transaction...</p>}
    </form>
  );
}
