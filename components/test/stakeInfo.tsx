import UnstackButton from "./unstackButton";
import {
  useReadContract,
  useSendTransaction,
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
  UseReadContractReturnType,
} from "wagmi";
import {
  contractABI,
  contractAddress,
  stakingTokenABI,
  stakingTokenAddress,
} from "../../lib/blockchain-config";
import { parseEther } from "viem";
import ClaimButton from "./claimButton";
import Loading from "../ui/loading";
import {  toast } from "react-toastify";
interface StakeData {
  amount: number;
  startTime: number;
  requestUnstakeTime: number;
  unstakeRequested: boolean;
}
export default function StakeInfo({ stakeId }: { stakeId: number }) {
  const account = useAccount();

  const result: UseReadContractReturnType = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "userStakes",
    args: [account.address, stakeId],
  });
  console.log(result);

  if (result.isLoading) {
    return <Loading className="mb-5" />;
  }

  if (result.isError) {
    toast.error("Error fetching stake data.");

    console.error(
      "Error fetching stake data : ",
      result.error && result.error.message
    );
    return (
      <div className="pb-6 flex justify-center items-center max-w-[85%]  ">
        {result.error && (
          <p className=" text-lg text-center text-red-500">
            {result.error.message}
          </p>
        )}
      </div>
    );
  }

  const { amount, startTime, requestUnstakeTime, unstakeRequested } =
    result.data as StakeData;

  return (
    <div className="pb-6">
      <h1 className="text-center font-medium tracking-wide text-primary leading-loose">
        Stake ID : {stakeId}
      </h1>
      {amount === 0 ? (
        <button disabled className="primary-button">
          Claimed
        </button>
      ) : unstakeRequested === false ? (
        <UnstackButton stakeId={stakeId} />
      ) : (
        <ClaimButton stakeId={stakeId} />
      )}
    </div>
  );
}
