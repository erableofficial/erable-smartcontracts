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
interface StakeData {
  amount: string;
  startTime: number;
  requestUnstakeTime: number;
  unstakeRequested: boolean;
}
export default function StakeInfo({ stakeId }: { stakeId: number }) {
  const account = useAccount();
  const result:any= useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "userStakes",
    args: [account.address, stakeId],
  });
  console.log(result)
  const {amount, startTime, requestUnstakeTime,unstakeRequested} = result.data 

  return (
    <div>
      <h1 className="text-center">Stake ID : {stakeId}</h1>
      {amount === 0 ? (
        <button disabled className="primary-button">
          Claimed
        </button>
      ) : unstakeRequested === false ? (
        <UnstackButton stakeId={stakeId} />
      ) : (
        <ClaimButton stakeId={stakeId} />
      )}
      <div className="text-center">
        <h2>Stake Details</h2>
      </div>
      {result.stakeError && <p>Error: {result.stakeError?.message}</p>}
    </div>
  );
}
