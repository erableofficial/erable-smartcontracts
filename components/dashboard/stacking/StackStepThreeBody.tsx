import { Info, Sparkles } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { StakeInfo } from "../../../lib/types";
import { contractABI, contractAddress } from "../../../lib/blockchain-config";
import {
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { Address, formatEther } from "viem";
import { toast } from "react-toastify";

type InfoItemProps = {
  label: string;
  value: string;
};
type StackStepThreeBodyProps = {
  currentAddress: Address | undefined;
  stakingDuration: bigint;
};

const InfoItem: React.FC<InfoItemProps> = ({ label, value }) => (
  <div className="flex flex-col self-stretch my-auto font-medium">
    <div className="flex gap-1 items-center text-base text-neutral-500">
      <div>{label}</div>
      <Info width={10} height={10} color="#7C7C7C" />
    </div>
    <div className="mt-6 text-lg text-neutral-700">{value}</div>
  </div>
);

const StackStepThreeBody: React.FC<StackStepThreeBodyProps> = ({
  currentAddress,
  stakingDuration,
}) => {
  const allUserStakesResult = useReadContract({
    abi: contractABI,
    address: contractAddress,
    functionName: "getUserStakes",
    args: [currentAddress],
  });

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

  React.useEffect(() => {
    if (isConfirmed) {
      toast.success("Transaction confirmed.", {
        autoClose: 2000,
      });
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 2000);
    }
  }, [isConfirmed]);

  // error
  React.useEffect(() => {
    if (writeError) {
      toast.error("Something went wrong.");
      console.error(writeError);
    }
  }, [writeError]);

  // hash
  React.useEffect(() => {
    if (hash) {
      console.info("Transaction Hash: ", hash);
      toast.info("Waiting for confirmation...", {
        autoClose: 2000,
      });
    }
  }, [hash]);

  if (allUserStakesResult.error) {
    console.error(allUserStakesResult.error);
  }

  const stakes: Array<StakeInfo> = allUserStakesResult.data as Array<StakeInfo>;

  const lastStake = stakes ? stakes[stakes.length - 1] : ({} as StakeInfo);

  console.log("Last Stake Info: ", lastStake);

  const { data: rewardAmount, error: readError } = useReadContract({
    abi: contractABI,
    address: contractAddress,
    functionName: "calculateTotalWithdraw",
    args: [lastStake.amount, lastStake.startTime],
  });

  if (readError) {
    console.error(readError);
  }

  console.log("Reward Amount: ", rewardAmount);

  const currentRewards = rewardAmount
    ? BigInt(rewardAmount.toString()) - lastStake.amount
    : BigInt(0);

  const startDate = new Date(
    Number(lastStake.startTime) * 1000
  ).toLocaleDateString();

  const endDate = new Date(
    // Number(lastStake.startTime + stakingDuration) * 1000
    // Number(BigInt(lastStake.startTime) + BigInt(stakingDuration)) * 1000
    (Number(lastStake?.startTime) + Number(stakingDuration)) * 1000
  ).toLocaleDateString();

  const handleUnstake = async (stakeId: number) => {
    writeContract({
      abi: contractABI,
      address: contractAddress,
      functionName: "unstake",
      args: [stakeId],
    });
  };
  const infoItems: InfoItemProps[] = [
    { label: "Start Date", value: startDate },
    { label: "Amount", value: formatEther(lastStake?.amount)?.toString() },
    {
      label: "Current Rewards",
      value: formatEther(currentRewards)?.toString(),
    },
    { label: "End date", value: endDate },
  ];
  return (
    <div className=" mt-14 mx-auto flex flex-col items-center p-10 bg-white rounded-3xl border border-solid border-stone-300 max-w-[977px] max-md:px-5">
      <div className="flex justify-center items-center px-3 bg-yellow-200 h-[45px] rounded-[37.5px] w-[45px]">
        <Sparkles width={24} height={24} color="#000000" />
      </div>
      <h1 className="mt-6 text-5xl font-semibold text-neutral-700">
        10.000 $ERA staked
      </h1>
      <p className="mt-6 text-lg font-medium text-center text-neutral-700 w-[572px] max-md:max-w-full">
        Lorem ipsum dolor sit amet consectetur. Sed consectetur erat feugiat
        felis pharetra mauris neque id
      </p>
      <section className="flex gap-5 justify-between items-center self-stretch px-4 py-2.5 mt-10 rounded-xl border border-solid bg-zinc-50 border-stone-300 max-md:flex-wrap max-md:pl-5 max-md:max-w-full">
        <div className="flex flex-col justify-between self-stretch my-auto text-base font-medium whitespace-nowrap">
          <div className="flex gap-1  pr-1.5 items-center text-neutral-500">
            <div>Type</div>
            <Info width={10} height={10} color="#7C7C7C" />
          </div>
          <div className="justify-center px-3 py-1.5 mt-3 text-neutral-700 bg-yellow-200 rounded-3xl border border-black border-solid">
            Staking
          </div>
        </div>
        {infoItems.map((item, index) => (
          <InfoItem key={index} {...item} />
        ))}
        <div className="flex flex-col justify-between self-stretch p-2 text-base">
          <div className="flex gap-1 items-center  pr-1.5 font-medium whitespace-nowrap text-neutral-500">
            <div>Action</div>
            <Info width={10} height={10} color="#7C7C7C" />
          </div>
          <button
            className="justify-center px-3.5 py-2.5 mt-2 font-semibold text-neutral-700 bg-white rounded-md border border-black border-solid"
            onClick={() => {
              handleUnstake(stakes.length - 1);
            }}
          >
            Unstake
          </button>
        </div>
      </section>
      <div className="flex gap-5 justify-center mt-10 text-lg font-semibold text-neutral-700">
        <button className="secondary-button">Join our community</button>
        <Link className="primary-button" href={"/dashboard"}>
          View my staking
        </Link>
      </div>
    </div>
  );
};

export default StackStepThreeBody;
