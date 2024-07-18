import { ArrowLeftRight, Check, Info, TriangleAlert } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { formatEther, parseEther } from "viem";
import {
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import {
  contractABI,
  contractAddress,
  stakingTokenABI,
  stakingTokenAddress,
} from "../../../lib/blockchain-config";
import { toast } from "react-toastify";
import CustomToast from "../CustomToast";
import Tooltip from "../Tooltip";
import AuthorizeStackingModal from "../AuthorizeStackingModal";
import EstimatedWithdrawTokens from "./EstimatedWithdrawTokens";
import ErrorBox from "../../ui/ErrorBox";
import errorMessages from "../toastErrors";

type InfoCardProps = {
  title: string;
  description: string;
  value: string;
};

type StackStepOneBodyProps = {
  infoCards: InfoCardProps[];
  setSteps: React.Dispatch<
    React.SetStateAction<
      {
        number: string;
        title: string;
        text: string;
        isActive: boolean;
      }[]
    >
  >;
  amount: number;
  setAmount: React.Dispatch<React.SetStateAction<number>>;
  myBalance: bigint;
  stakingDuration: bigint;
};

const InfoCard: React.FC<InfoCardProps> = ({ title, description, value }) => (
  <div className="col-span-12 md:col-span-6 lg:col-span-3 h-full">
    <div className="flex flex-col grow h-full justify-center p-6 mx-auto w-full font-semibold text-neutral-700 bg-white rounded-xl border border-solid border-stone-300 max-md:px-5 max-md:mt-5">
      <div className="flex gap-1 pr-5 text-lg font-medium max-sm:text-base">
        <div>{title}</div>
        <Tooltip message={description}>
          <div className="flex items-center cursor-pointer">
            <Info width={15} height={15} color="#000000" />
          </div>
        </Tooltip>
      </div>
      {/* <div className="mt-1 text-base font-medium text-neutral-500">
        {description}
      </div> */}
      <div className="mt-6 text-2xl font-semibold max-sm:mt-5">{value}</div>
    </div>
  </div>
);

const StackStepOneBody: React.FC<StackStepOneBodyProps> = ({
  infoCards,
  setSteps,
  amount,
  setAmount,
  myBalance,
  stakingDuration,
}) => {
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });
  const [toggleAuthorizeStackingModal, setToggleAuthorizeStackingModal] =
    React.useState(false);
  const [lessBalanceError, setLessBalanceError] = React.useState(false);

  React.useEffect(() => {
    if (isConfirmed) {
      toast.success(
        <CustomToast
          title="Confirming Staking Approval."
          message="Approval confirmed! Proceeding to stake tokens..."
        />,
        {
          theme: "colored",
          icon: <Check width={21} height={21} size={32} color="#21725E" />,
        }
      );
      setSteps([
        {
          number: "1",
          title: "Start Your Staking",
          text: "Set Up Staking",
          isActive: false,
        },
        {
          number: "2",
          title: "Transfer Funds",
          text: "Transfer Funds",
          isActive: true,
        },
        {
          number: "3",
          title: "Staking Successful",
          text: "Confirmation",
          isActive: false,
        },
      ]);
    }
  }, [isConfirmed]);

  // error
  React.useEffect(() => {
    if (error) {
      const errorMessage =
        errorMessages.find((e) => e.name === error.name)?.message ||
        "Something went wrong";
      toast.error(
        <CustomToast
          title={error.name || "Something went wrong"}
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
      console.error(error);
      console.error(error.cause);
    }
  }, [error]);

  // hash
  React.useEffect(() => {
    if (hash) {
      console.info("Transaction Hash: ", hash);
      toast.info(
        <CustomToast
          title="Waiting for Staking Approval."
          message="Awaiting approval to stake tokens..."
        />,
        {
          // icon: <Info />,
          // autoClose: 5000000,
          theme: "colored",
          icon: <Info width={21} height={21} size={32} color="#0000" />,
          autoClose: 2000,
        }
      );
    }
  }, [hash]);

  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current && amount !== 0) {
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(inputRef.current);
      range.collapse(false);
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  }, [amount]);

  const handleApproveStacking = async () => {
    writeContract({
      abi: stakingTokenABI,
      address: stakingTokenAddress,
      functionName: "approve",
      args: [contractAddress, parseEther(amount.toString())],
    });
  };

  const handleAmountChange = (amount: string) => {
    console.log("Amount getting changed by conditable element : ", amount);

    // Clean up the input by removing non-numeric characters except for dot (.)
    let cleanedAmount = amount.replace(/[^0-9.]/g, "");

    console.log("Cleaned Amount:", cleanedAmount);

    const amountVal = Number(amount);

    if (!isNaN(amountVal)) {
      setAmount(amountVal);
      if (parseEther(amountVal.toString()) > myBalance) {
        setLessBalanceError(true);
      } else {
        setLessBalanceError(false);
      }
    } else {
      // toast.error("Invalid number format");
      toast.error(<CustomToast title={"Invalid number format"} />, {
        // icon: <Info />,
        // autoClose: 5000000,
        theme: "colored",
        icon: (
          <TriangleAlert width={21} height={21} size={32} color="#B91C1C" />
        ),
      });
      console.error("Invalid number format"); // Debugging line
    }
  };

  return (
    <>
      <AuthorizeStackingModal
        toggleAuthorizeStackingModal={toggleAuthorizeStackingModal}
        setToggleAuthorizeStackingModal={setToggleAuthorizeStackingModal}
        handleApprove={handleApproveStacking}
        isConfirmed={isConfirmed}
        isConfirming={isConfirming}
        hash={hash}
      />

      <div className="max-sm:flex max-sm:flex-col-reverse">
        {/* info cards section */}
        <div className="mt-14 max-md:mt-10 max-md:max-w-full max-sm:mt-0">
          <div className="flex gap-5 max-md:flex-col max-md:gap-0">
            {infoCards.map((card, index) => (
              <div
                key={index}
                className="flex flex-col w-3/12 max-md:ml-0 max-md:w-full"
              >
                <InfoCard {...card} />
              </div>
            ))}
          </div>
        </div>
        {/* end info cards section */}

        <div className="flex flex-col p-6  mt-5 bg-white rounded-3xl border border-solid border-stone-300 max-md:px-5 max-md:max-w-full max-sm:mt-9">
          <div className="flex gap-5 justify-between font-medium text-neutral-700 max-md:flex-wrap max-md:max-w-full">
            <div className="my-auto text-lg max-sm:text-base">
              Enter Amount to Stake:
            </div>
            <div className="justify-center px-4 py-2 text-base bg-surface-500 border-2 border-black border-solid rounded-[38px] max-sm:text-xs max-sm:py-1 max-sm:px-[10px]">
              Projected earning after one year
            </div>
          </div>
          <div className="flex gap-5 justify-between mt-6 w-full items-center text-neutral-700 whitespace-nowrap max-md:flex-nowrap max-md:max-w-full">
            <div className="flex gap-1.5 max-w-[40%]">
              <div className="flex text-5xl font-semibold">
                <div
                  ref={inputRef}
                  contentEditable={true}
                  className={`text-[32px] flex items-center font-semibold outline-none   px-2 max-sm:text-lg `}
                  onInput={(e) =>
                    handleAmountChange(e.currentTarget.textContent as string)
                  }
                >
                  {amount}
                </div>
                <div className="my-auto text-xl font-bold max-sm:text-lg max-sm:font-semibold">
                  $ERA
                </div>
              </div>
            </div>
            <div className="flex items-center max-sm:w-[18px]">
              <ArrowLeftRight width={32} height={32} color="#1F1F1F" />
            </div>
            <EstimatedWithdrawTokens amount={amount} />
          </div>
          <div className="flex gap-5 justify-between text-base font-medium whitespace-nowrap text-neutral-500 max-md:flex-wrap max-md:max-w-full">
            <div>=$250.000</div>
            <div>=$250.000</div>
          </div>
          {lessBalanceError && (
            <div className="pt-6 max-w-fit ">
              <ErrorBox
                text="You  do not have enough $ERA to stake this amount"
                bgColor="bg-red-200"
              />
            </div>
          )}
          <div className="flex gap-5 justify-between mt-6 w-full text-lg max-md:flex-wrap max-md:max-w-full max-sm:mt-5">
            <div className="flex gap-3 pr-20 max-sm:pr-0 max-sm:w-full max-sm:justify-between">
              <div className="my-auto font-medium text-neutral-700 max-sm:text-base">
                Your Balance :{" "}
                {myBalance ? formatEther(myBalance).toString() : "0"} $ERA
              </div>
              <div
                className="justify-center py-1 cursor-pointer font-semibold text-neutral-700 border-b-2 border-black border-solid max-sm:text-base"
                onClick={() => {
                  setAmount(Number(formatEther(myBalance)));
                }}
              >
                Stake Max
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* More Information on Early Unstaking */}
      <div className="flex flex-col p-5  mt-5 bg-white rounded-xl border-2 border-orange-200 border-solid max-md:max-w-full">
        <div className="flex gap-3.5 ">
          <div className="flex justify-center items-center p-2 bg-orange-200 h-[35px] rounded-[29.167px] w-[35px]">
            <TriangleAlert width={18} height={18} color="#000000" />
          </div>
          <div>
            <div className="flex-1 my-auto text-xl font-bold text-neutral-700 max-md:max-w-full max-sm:text-lg">
              *More Information on Early Unstaking
            </div>
            <p className="text-base font-medium text-neutral-700 max-md:max-w-full max-sm:mt-2">
              The longer you stake your tokens, the more rewards you earn.
              However, withdrawing your stake early will result in penalties on
              your accrued rewards. Additionally, please note that there is a
              7-day cooldown period before you can fully withdraw your staked
              tokens. Read our full article on staking rewards and penalties for
              a detailed explanation.
            </p>
          </div>
        </div>
      </div>
      <div className="sticky-button-container">
        <div className="sticky-button max-md:text-center md:text-end">
          <button
            disabled={amount === 0 || lessBalanceError}
            className={`${
              amount === 0 || lessBalanceError
                ? "justify-center  rounded-xl border-solid border-[3px] text-base md:text-lg    max-md:px-5 px-7 py-3 max-sm:px-6 border-neutral-300 text-neutral-300 hover:text-neutral-500 hover:border-neutral-500"
                : "primary-button bg-surface-primary "
            }  justify-center self-end   font-semibold  max-sm:mt-5 max-sm:mx-auto`}
            onClick={() => setToggleAuthorizeStackingModal(true)}
          >
            Start Program
          </button>
        </div>
      </div>
    </>
  );
};
export default StackStepOneBody;
