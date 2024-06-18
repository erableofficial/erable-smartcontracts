import UnstackButton from "./unstackButton";
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
import ClaimButton from "./claimButton";

export default function StakeInfo({ stakeId }: { stakeId: number }) {
  const account = useAccount();

  const { data: stake, error: stakeError } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "userStakes",
    args: [account.address, stakeId],
  });

  console.log(stake);

  return (
    <div>
      <h1 className="text-center">Stake ID : {stakeId}</h1>
      {stake && stake[0] === 0n ? (
        <button disabled className="primary-button">
          Claimed
        </button>
      ) : stake && stake[3] === false ? (
        <UnstackButton stakeId={stakeId} />
      ) : (
        <ClaimButton stakeId={stakeId} />
      )}
      <div className="text-center">
        <h2>Stake Details</h2>
      </div>
      {stakeError && <p>Error: {stakeError?.message}</p>}
    </div>
  );
}
