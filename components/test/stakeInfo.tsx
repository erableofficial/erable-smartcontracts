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
import { formatEther, parseEther } from "viem";
import ClaimButton from "./claimButton";
import Loading from "../ui/loading";
import { toast } from "react-toastify";

export default function StakeInfo({
  stakeId,
  cooldownPeriod,
}: {
  stakeId: number;
  cooldownPeriod?: string;
}) {
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

  const [amount, startTime, requestUnstakeTime, unstakeRequested] =
    result.data as any[];

  console.log(result.data);

  console.log("Amount : ", amount);
  console.log("startTime : ", startTime);
  console.log("requestUnstakeTime : ", requestUnstakeTime.toString());
  console.log("unstakeRequested : ", unstakeRequested);

  return (
    <div
      className="card mb-5 flex justify-around items-center  
    border-2 border-primary bg-surface-500 p-5 w-[40%] rounded-lg shadow-lg"
    >
      <div className="space-y-4 flex flex-col">
        <div className="flex items-center gap-2 text-xl font-medium font-friends">
          <p className=" capitalize ">amount:</p>
          <p>{formatEther(amount.toString())} ST</p>
        </div>
        <div className="flex items-center gap-2 text-xl font-medium font-friends">
          <p className=" capitalize ">startTime:</p>
          <p>
            {new Date(Number(startTime.toString()) * 1000).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xl font-medium font-friends">
          <p className=" capitalize ">requestUnstakeTime:</p>
          {requestUnstakeTime.toString() !== "0" ? (
            <p>
              {new Date(
                Number(requestUnstakeTime.toString()) * 1000
              ).toLocaleString()}
            </p>
          ) : (
            <p>Not requested</p>
          )}
        </div>
        <div className="flex items-center gap-2 text-xl font-medium font-friends">
          <p className=" capitalize ">unstakeRequested:</p>
          <p>{unstakeRequested.toString()}</p>
        </div>

        <div className="flex justify-center items-center">
          {amount.toString() === "0" ? (
            <button disabled className="primary-button">
              Claimed
            </button>
          ) : unstakeRequested === false ? (
            <UnstackButton stakeId={stakeId} />
          ) : (
            <ClaimButton
              stakeId={stakeId}
              coolDownPeriod={cooldownPeriod}
              stake={result.data}
            />
          )}
        </div>
      </div>
    </div>
  );
}
