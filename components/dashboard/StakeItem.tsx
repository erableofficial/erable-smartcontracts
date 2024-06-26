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

interface StakeItemProps {
  stake: TabItem;
  index: number;
  itemsCounter: number;
}

const StakeItem: React.FC<StakeItemProps> = ({
  stake,
  index,
  itemsCounter,
}) => {
  const [toggleWithdrawTokenCdModalModal, setToggleWithdrawTokenCdModalModal] =
    React.useState(false);

  const { data: rewardAmount, error } = useReadContract({
    abi: contractABI,
    address: contractAddress,
    functionName: "calculateTotalWithdraw",
    args: [stake.amount, BigInt(stake.startTime / 1000)],
  });

  console.log("Stake ID: ", stake.id);

  console.log("Reward Amount: ", rewardAmount);

  console.log("Stake Amount : ", stake.amount);

  const currentRewards: bigint = rewardAmount
    ? BigInt(rewardAmount.toString()) - BigInt(stake.amount)
    : BigInt(0);

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
    }
  }, [isConfirmed]);

  // error
  useEffect(() => {
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

  const handleClaim = async (stakeId: number) => {
    writeContract({
      abi: contractABI,
      address: contractAddress,
      functionName: "claim",
      args: [stakeId],
    });
  };


  //   const handleActionClick = (
  //     action: string,
  //     daysLeft: string | null | undefined
  //   ) => {
  //     if (action === "Claim" && daysLeft == null) {
  //       setToggleWithdrawTokenCdModalModal(true);
  //     }
  //   };

  return (
    <React.Fragment>
      <WithdrawTokenCdModal
        toggleWithdrawTokenCdModalModal={toggleWithdrawTokenCdModalModal}
        setToggleWithdrawTokenCdModalModal={setToggleWithdrawTokenCdModalModal}
        stake={stake}
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
              <Info width={15} height={15} color="#7C7C7C" />
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
