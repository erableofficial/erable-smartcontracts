import { Check, Info, Sparkles, TriangleAlert } from "lucide-react";
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
import CustomToast from "../CustomToast";

type StackStepThreeBodyProps = {
  currentAddress: Address | undefined;
  stakingDuration: bigint;
};


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
      toast.success(
        <CustomToast
          title="Transaction confirmed."
          message="When you do something noble and beautiful and nobody noticed, do not be
        sad. For the sun every morning is a beautiful spectacle and yet most of
        the audience still sleeps."
        />,
        {
          theme: "colored",
          icon: <Check width={21} height={21} size={32} color="#21725E" />,
        }
      );
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 2000);
    }
  }, [isConfirmed]);

  // error
  React.useEffect(() => {
    if (writeError) {
      toast.error(
        <CustomToast
          title="Something went wrong"
          message="When you do something noble and beautiful and nobody noticed, do not be
        sad. For the sun every morning is a beautiful spectacle and yet most of
        the audience still sleeps."
        />,
        {
          // icon: <Info />,
          // autoClose: 5000000,
          theme: "colored",
          icon: (
            <TriangleAlert width={21} height={21} size={32} color="#B91C1C" />
          ),
        }
      );
      console.error(writeError);
    }
  }, [writeError]);

  // hash
  React.useEffect(() => {
    if (hash) {
      console.info("Transaction Hash: ", hash);
      toast.info(
        <CustomToast
          title="Waiting for confirmation..."
          message="When you do something noble and beautiful and nobody noticed, do not be
        sad. For the sun every morning is a beautiful spectacle and yet most of
        the audience still sleeps."
        />,
        {
          theme: "colored",
          icon: <Info width={21} height={21} size={32} color="#0000" />,
        }
      );
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

  const handleUnstake = async (stakeId: number) => {
    writeContract({
      abi: contractABI,
      address: contractAddress,
      functionName: "unstake",
      args: [stakeId],
    });
  };

  return (
    <div className=" mt-14 mx-auto flex flex-col items-center p-10 bg-white rounded-3xl border border-solid border-stone-300 max-w-[977px] max-md:px-5">
      <div className="flex justify-center items-center px-3 bg-yellow-200 h-[45px] rounded-[37.5px] w-[45px]">
        <Sparkles width={24} height={24} color="#000000" />
      </div>
      <h1 className="mt-6 text-5xl font-semibold text-neutral-700">
        {lastStake?.amount && formatEther(lastStake?.amount)?.toString()} $ERA
        staked
      </h1>
      <p className="mt-6 text-lg font-medium text-center text-neutral-700 max-w-[572px] max-md:max-w-full">
        Lorem ipsum dolor sit amet consectetur. Sed consectetur erat feugiat
        felis pharetra mauris neque id
      </p>
      {/* <section className="flex gap-5 justify-between items-center self-stretch px-4 py-2.5 mt-10 rounded-xl border border-solid bg-zinc-50 border-stone-300 max-md:flex-wrap max-md:pl-5 max-md:max-w-full">
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
      </section> */}
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
