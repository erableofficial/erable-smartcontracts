import * as React from "react";
import { Check, Gift, Info, TriangleAlert, X } from "lucide-react";
import { toast } from "react-toastify";
import CustomToast from "./CustomToast";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { contractABI, contractAddress } from "../../lib/blockchain-config";
import { TabItem } from "../../lib/types";
import { useStakingContractData } from "../../context/stakingContractData";
import errorMessages from "./toastErrors";

interface WithdrawTokenCdModalModal {
  toggleWithdrawTokenCdModalModal: boolean;
  setToggleWithdrawTokenCdModalModal: (value: boolean) => void;
  stake: TabItem;
  setTransactionSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}

const WithdrawTokenCdModal: React.FC<WithdrawTokenCdModalModal> = ({
  toggleWithdrawTokenCdModalModal,
  setToggleWithdrawTokenCdModalModal,
  stake,
  setTransactionSuccess,
}) => {
  const { stakingContractData } = useStakingContractData();
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
          title="Confirming Unstaking."
          message="Tokens unstaked successfully!"
        />,
        {
          theme: "colored",
          icon: <Check width={21} height={21} size={32} color="#21725E" />,
        }
      );
      setToggleWithdrawTokenCdModalModal(false);
      // refresh page after transaction
      setTransactionSuccess(true);
    }
  }, [isConfirmed]);

  // error
  React.useEffect(() => {
    if (writeError) {
      const errorMessage =
        errorMessages.find((e) => e.name === writeError.name)?.message ||
        "Something went wrong";
      toast.error(
        <CustomToast
          title={writeError.name || "Something went wrong"}
          message={errorMessage}
          error={true}
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
      setToggleWithdrawTokenCdModalModal(false);
    }
  }, [writeError]);

  // hash
  React.useEffect(() => {
    if (hash) {
      console.info("Transaction Hash: ", hash);
      toast.info(
        <CustomToast
          title="Waiting for Unstaking."
          message="Awaiting approval to unstake tokens..."
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

  if (!toggleWithdrawTokenCdModalModal) return null;
  const closeModal = () => {
    setToggleWithdrawTokenCdModalModal(false);
  };

  const stopPropagation = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  const handleUnstack = async () => {
    writeContract({
      abi: contractABI,
      address: contractAddress,
      functionName: "unstake",
      args: [stake.id],
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 z-[100] flex justify-center items-center"
      onClick={closeModal}
    >
      <div
        className="flex flex-col items-left px-10 pt-10 pb-10 bg-white rounded-[20px] border border-solid border-stone-300 max-w-[800px] max-md:px-5 absolute max-[839px]:mx-5"
        onClick={stopPropagation}
      >
        <div className="flex justify-end">
          <X
            size={32}
            width={14}
            height={14}
            color="#989898"
            cursor={"pointer"}
            onClick={() => setToggleWithdrawTokenCdModalModal(false)}
          />
        </div>
        <div className=" flex items-center justify-between mt-3 text-3xl font-semibold mb-10 text-neutral-700">
          <div className="flex gap-3 items-center">
            <span className="flex justify-center items-center px-3  bg-surface-500 h-[45px] rounded-[37.5px] w-[45px]">
              <Gift size={32} width={24} height={24} />
            </span>
            Withdraw your tokens and rewards
          </div>
          <span className="justify-center flex items-center text-center px-2.5 py-1.5 text-sm font-medium text-neutral-700 bg-surface-500 border-2 border-black border-solid rounded-[38px]">
            {Number(stakingContractData.cooldownPeriod)} secs cooldown
          </span>
        </div>
        <div className="flex flex-row self-stretch p-5 mb-6 bg-white rounded-xl border-2 border-solid border-warning-200 max-w-[720px]">
          <div className="flex gap-3.5 max-md:flex-wrap">
            <div className="flex justify-center mr-3 items-center p-2 bg-warning-200 h-[35px] rounded-[29.167px] w-[35px]">
              <TriangleAlert height={17} width={17} color="#000000" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex-1 my-auto text-xl font-bold text-neutral-700 max-md:max-w-full">
              Withdraw conditions
            </div>
            <div className="self-start text-base font-medium text-neutral-700 max-md:max-w-full">
              Please note that withdrawing your stake early will result in
              penalties on your accrued rewards. For a detailed explanation,
              please read our full article on staking rewards and penalties
            </div>
          </div>
        </div>
        <span className=" font-semibold text-lg mb-3">
          {" "}
          {Number(stakingContractData.cooldownPeriod)}-sec cooldown period:
        </span>
        <p className="self-stretch mb-4 text-base font-medium text-left text-neutral-600 max-md:max-w-full">
          You are currently in the process of unstaking your tokens. During the
          <span className=" font-semibold">
            {" "}
            {Number(stakingContractData.cooldownPeriod)}-sec cooldown period
          </span>
          , your tokens are being prepared for withdrawal. Once this period
          ends, you can return to the platform to claim your tokens and any
          associated rewards.
        </p>

        <div className="flex gap-2.5 justify-left mt-10 text-base font-semibold text-neutral-700">
          <button className="secondary-button-sm">Read tutorial</button>
          <button onClick={handleUnstack} className="primary-button-sm">
            <span className="my-auto">Withdraw my tokens</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WithdrawTokenCdModal;
