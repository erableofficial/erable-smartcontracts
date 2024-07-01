import React, { useEffect } from "react";
import { TabItem } from "../../lib/types";
import { Check, Info, TriangleAlert } from "lucide-react";
import {
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { contractABI, contractAddress } from "../../lib/blockchain-config";
import { toast } from "react-toastify";
import CustomToast from "./CustomToast";
import { formatEther } from "viem";
import WithdrawTokenCdModal from "./WithdrawTokenCdModal";
import Tooltip from "./Tooltip";
import { calculateTotalWithdraw } from "../../lib/utils";

interface StakeItemProps {
  stake: TabItem;
  index: number;
  itemsCounter: number;
  setTransactionSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}

const StakeItem: React.FC<StakeItemProps> = ({
  stake,
  index,
  itemsCounter,
  setTransactionSuccess,
}) => {
  const [toggleWithdrawTokenCdModalModal, setToggleWithdrawTokenCdModalModal] =
    React.useState(false);
  const [currentRewards, setCurrentRewards] = React.useState<bigint>(BigInt(0));

  const {
    data: stakingDuration,
    error: stakingDurationError,
    isLoading: stakingDurationLoading,
  } = useReadContract({
    abi: contractABI,
    address: contractAddress,
    functionName: "stakingDuration",
  });

  const {
    data: yieldConstant,
    error: yieldConstantError,
    isLoading: yieldConstantLoading,
  } = useReadContract({
    abi: contractABI,
    address: contractAddress,
    functionName: "yieldConstant",
  });

  const {
    data: monthlyIncreasePercentage,
    error: monthlyIncreasePercentageError,
    isLoading: monthlyIncreasePercentageLoading,
  } = useReadContract({
    abi: contractABI,
    address: contractAddress,
    functionName: "monthlyIncreasePercentage",
  });

  // startingSlashingPoint
  const { data: startingSlashingPoint } = useReadContract({
    abi: contractABI,
    address: contractAddress,
    functionName: "startingSlashingPoint",
  });

  React.useEffect(() => {
    async function getCurrentRewards() {
      const rewardAmount = await calculateTotalWithdraw(
        stake.amount,
        BigInt(stake.startTime),
        yieldConstant as bigint,
        monthlyIncreasePercentage as bigint,
        startingSlashingPoint as bigint,
        stakingDuration as bigint
      );
      const result = rewardAmount - stake.amount;
      setCurrentRewards(result);
    }

    if (
      stake.amount &&
      stake.startTime &&
      yieldConstant &&
      monthlyIncreasePercentage &&
      startingSlashingPoint &&
      stakingDuration
    ) {
      getCurrentRewards();
    }
  }, [stake.amount, stake.startTime, yieldConstant, monthlyIncreasePercentage]);

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

  useEffect(() => {
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
      setTransactionSuccess(true);
    }
  }, [isConfirmed]);

  // error
  useEffect(() => {
    if (writeError) {
      toast.error(
        <CustomToast
          title={writeError.name || "Something went wrong"}
          message={writeError.message}
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
  useEffect(() => {
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
          // icon: <Info />,
          // autoClose: 5000000,
          theme: "colored",
          icon: <Info width={21} height={21} size={32} color="#0000" />,
        }
      );
    }
  }, [hash]);

  const handleClaim = (stakeId: number) => {
    writeContract({
      abi: contractABI,
      address: contractAddress,
      functionName: "claim",
      args: [stakeId],
    });
  };

  return (
    <React.Fragment>
      <WithdrawTokenCdModal
        toggleWithdrawTokenCdModalModal={toggleWithdrawTokenCdModalModal}
        setToggleWithdrawTokenCdModalModal={setToggleWithdrawTokenCdModalModal}
        stake={stake}
        setTransactionSuccess={setTransactionSuccess}
      />
      <div className="flex gap-0 items-center mt-5 max-md:flex-wrap max-md:max-w-full">
        <div className="flex flex-col flex-1 justify-center items-start self-stretch p-2.5 my-auto text-base font-medium text-black whitespace-nowrap max-md:pr-5">
          <div className="justify-center px-4 py-2 bg-surface-500 border-2 border-black border-solid rounded-[38px]">
            {stake.type}
          </div>
        </div>
        <div className="flex-1 justify-center items-start self-stretch p-2.5 my-auto text-lg font-medium whitespace-nowrap text-stone-300 max-md:pr-5">
          {new Date(stake.startTime).toLocaleDateString()}
        </div>
        <div className="flex-1 justify-center items-start self-stretch p-2.5 my-auto text-lg font-medium whitespace-nowrap text-stone-300 max-md:pr-5">
          {formatEther(stake.amount)}
        </div>
        <div className="flex-1 justify-center items-start self-stretch p-2.5 my-auto text-lg font-medium whitespace-nowrap text-stone-300 max-md:pr-5">
          {formatEther(currentRewards)}
        </div>
        <div className="flex-1 justify-center items-start self-stretch p-2.5 my-auto text-lg font-medium text-stone-300 max-md:pr-5">
          {new Date(stake.endTime).toLocaleDateString()}
        </div>
        <div className="flex flex-col self-stretch px-2.5">
          {stake.daysLeft && (
            <div className="flex gap-1 pr-1.5 text-sm text-neutral-400">
              <div>{stake.daysLeft}</div>
              <Tooltip
                message="You are currently in the process of unstaking your tokens. During this cooldown period, your tokens are being prepared for withdrawal. 
Once this period ends, you can return to the platform to claim your tokens and any associated rewards."
              >
                <Info
                  width={15}
                  height={15}
                  color="#7C7C7C"
                  cursor={"pointer"}
                />
              </Tooltip>
            </div>
          )}
          <button
            onClick={
              stake.action === "Claim"
                ? () => {
                    handleClaim(stake.id);
                  }
                : () => {
                    setToggleWithdrawTokenCdModalModal(true);
                  }
            }
            className={`justify-center px-5 py-3 mt-2 text-base font-semibold whitespace-nowrap ${
              stake.action === "Claim" && stake.daysLeft == null
                ? "bg-surface-primary"
                : "bg-white"
            } rounded-lg border-2 border-solid ${
              stake.daysLeft
                ? "border-stone-300 text-stone-300"
                : "border-black text-black"
            }`}
            disabled={stake.action === "Claim" && stake.daysLeft != null}
          >
            {stake.action}
          </button>
        </div>
      </div>
      {index < itemsCounter && (
        <hr className="shrink-0 mt-5 h-px border border-solid bg-stone-300 border-stone-300 max-md:max-w-full" />
      )}
    </React.Fragment>
  );
};

export default StakeItem;
