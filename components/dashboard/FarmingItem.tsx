import React, { useEffect } from "react";
import { TabItem } from "../../lib/types";
import { Check, Info, TriangleAlert } from "lucide-react";
import {
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import {
  airdropContractABI,
  airdropContractAddress,
  contractABI,
  contractAddress,
} from "../../lib/blockchain-config";
import { toast } from "react-toastify";
import CustomToast from "./CustomToast";
import { formatEther, parseEther } from "viem";

import { useCurrentUser } from "../../context/currentUser";

interface FarmingItemProps {
  farming: TabItem;
  index: number;
  itemsCounter: number;
  setTransactionSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}

const FarmingItem: React.FC<FarmingItemProps> = ({
  farming,
  index,
  itemsCounter,
  setTransactionSuccess,
}) => {
  const { currentUser, setCurrentUser } = useCurrentUser();

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

  return (
    <React.Fragment>
      <div className="flex gap-0 items-center mt-5 max-md:flex-wrap max-md:max-w-full max-sm:mt-4">
        <div className="flex flex-col flex-1 justify-center items-start self-stretch p-2.5 my-auto text-base font-medium text-black whitespace-nowrap max-md:pr-5">
          <div className="justify-center px-[10px] py-[6px] bg-surface-500 border-2 border-black border-solid rounded-[38px] text-sm">
            {farming.type}
          </div>
        </div>
        <div className="flex-1 justify-center items-start self-stretch p-2.5 my-auto text-lg font-medium whitespace-nowrap text-neutral-700 max-md:pr-5">
          --
        </div>
        <div className="flex-1 justify-center items-start self-stretch p-2.5 my-auto text-lg font-medium whitespace-nowrap text-neutral-700 max-md:pr-5">
          {formatEther(farming.amount)}
        </div>
        <div className="flex-1 justify-center items-start self-stretch p-2.5 my-auto text-lg font-medium whitespace-nowrap text-neutral-700 max-md:pr-5 min-w-[222px]">
          --
        </div>
        <div className="flex-1 justify-center items-start self-stretch p-2.5 my-auto text-lg font-medium text-neutral-700 max-md:pr-5 max-w-[171px]">
          --
        </div>
        <div className="flex flex-col self-stretch px-2.5 min-w-[150px]">
          <button
            disabled={farming.action === "Claimed"}
            className={`justify-center px-5 py-3 mt-2 text-base font-semibold whitespace-nowrap rounded-lg border-2 border-solid ${
              farming.action === "Claimed"
                ? "border-stone-300 text-stone-300"
                : "bg-surface-primary border-black text-black"
            } `}
          >
            {farming.action}
          </button>
        </div>
      </div>
      {index < itemsCounter && (
        <hr className="shrink-0 mt-5 h-px border border-solid bg-stone-300 border-stone-300 max-md:max-w-full" />
      )}
    </React.Fragment>
  );
};

export default FarmingItem;
