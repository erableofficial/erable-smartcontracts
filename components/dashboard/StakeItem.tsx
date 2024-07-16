import React, { useEffect } from "react";
import { TabItem } from "../../lib/types";
import { Check, Info, TriangleAlert } from "lucide-react";
import {
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
  ChainNotConfiguredError,
} from "wagmi";
import { contractABI, contractAddress } from "../../lib/blockchain-config";
import { toast } from "react-toastify";
import CustomToast from "./CustomToast";
import { formatEther } from "viem";
import WithdrawTokenCdModal from "./WithdrawTokenCdModal";
import Tooltip from "./Tooltip";
import { calculateTotalWithdraw } from "../../lib/utils";
import { useStakingContractData } from "../../context/stakingContractData";
import EndStackingModal from "./EndStackingModal";

interface StakeItemProps {
  stake: TabItem;
  index: number;
  itemsCounter: number;
  setTransactionSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  stakingAPR: number;
}

const StakeItem: React.FC<StakeItemProps> = ({
  stake,
  index,
  itemsCounter,
  setTransactionSuccess,
  stakingAPR,
}) => {
  const [toggleWithdrawTokenCdModalModal, setToggleWithdrawTokenCdModalModal] =
    React.useState(false);
  const [toggleEndStackingModal, setToggleEndStackingModal] =
    React.useState<boolean>(false);
  const [itemId, setItemId] = React.useState<number>(0);
  const [currentRewards, setCurrentRewards] = React.useState<bigint>(BigInt(0));
  const { stakingContractData } = useStakingContractData();
  const {
    yieldConstant,
    monthlyIncreasePercentage,
    startingSlashingPoint,
    stakingDuration,
  } = stakingContractData;

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
      stake.currentRewards = result;
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
      setToggleEndStackingModal(false);
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

  const handleItemAction = (stakeId: number, action: string, type: string) => {
    if (action === "Claim" && type === "Staking") {
      setToggleEndStackingModal(true);
      setItemId(stakeId);
    }
    // if (action === "Claim" && type == "Airdrop") {
    //   // instruction to open  airdrop modal
    // if (action === "Claim" && type == "LP Farming") {
    //   // instruction to open  LP Farming modal
    // }
    if (action == "Unstake") {
      setToggleWithdrawTokenCdModalModal(true);
    }
  };

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
      <EndStackingModal
        toggleEndStackingModal={toggleEndStackingModal}
        setToggleEndStackingModal={setToggleEndStackingModal}
        stakeId={itemId}
        handleClaim={handleClaim}
        stake={stake}
        stakingAPR={stakingAPR}
      />
      <div className="flex gap-0 items-center mt-5 max-md:flex-wrap max-md:max-w-full max-sm:mt-4">
        <div className="flex flex-col flex-1 justify-center items-start self-stretch p-2.5 my-auto text-base font-medium text-black whitespace-nowrap max-md:pr-5">
          <div className="justify-center px-[10px] py-[6px] bg-surface-500 border-2 border-black border-solid rounded-[38px] text-sm">
            {stake.type}
          </div>
        </div>
        <div className="flex-1 justify-center items-start self-stretch p-2.5 my-auto text-lg font-medium whitespace-nowrap text-neutral-700 max-md:pr-5">
          {new Date(stake.startTime).toLocaleDateString()}
        </div>
        <div className="flex-1 justify-center items-start self-stretch p-2.5 my-auto text-lg font-medium whitespace-nowrap text-neutral-700 max-md:pr-5">
          {formatEther(stake.amount)}
        </div>
        <div className="flex-1 justify-center items-start self-stretch p-2.5 my-auto text-lg font-medium whitespace-nowrap text-neutral-700 max-md:pr-5 min-w-[222px]">
          {Number(formatEther(currentRewards)).toFixed(6)}
        </div>
        <div className="flex-1 justify-center items-start self-stretch p-2.5 my-auto text-lg font-medium text-neutral-700 max-md:pr-5 max-w-[171px]">
          {new Date(stake.endTime).toLocaleDateString()}
        </div>
        <div className="flex flex-col self-stretch px-2.5 min-w-[150px]">
          {stake.daysLeft && (
            <div className="flex gap-1 pr-1.5 text-sm text-neutral-400">
              <div>{stake.daysLeft}</div>
              {/* <Tooltip
                message="You are currently in the process of unstaking your tokens. During this cooldown period, your tokens are being prepared for withdrawal. 
Once this period ends, you can return to the platform to claim your tokens and any associated rewards."
              >
                <Info
                  width={15}
                  height={15}
                  color="#7C7C7C"
                  cursor={"pointer"}
                />
              </Tooltip> */}
              <div className="group relative  overflow-visible flex">
                <Info
                  width={15}
                  height={15}
                  color="#7C7C7C"
                  cursor={"pointer"}
                />
                <span className="absolute top-5 right-0 scale-0 transition-all rounded-xl group-hover:scale-100 break-words whitespace-normal justify-center p-3.5 text-base font-medium text-black bg-white  border border-solid shadow-sm border-stone-300 max-w-60 ">
                  <p className=" min-w-48">
                    You are currently in the process of unstaking your tokens.
                    During this cooldown period, your tokens are being prepared
                    for withdrawal. Once this period ends, you can return to the
                    platform to claim your tokens and any associated rewards.
                  </p>
                </span>
              </div>
            </div>
          )}
          <button
            onClick={() => {
              handleItemAction(stake.id, stake.action, stake.type);
            }}
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
