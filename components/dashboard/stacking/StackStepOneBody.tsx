import { ArrowLeftRight, Check, Info, TriangleAlert } from "lucide-react";
import React from "react";
import { formatEther, parseEther } from "viem";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import {
  contractAddress,
  stakingTokenABI,
  stakingTokenAddress,
} from "../../../lib/blockchain-config";
import { toast } from "react-toastify";
import CustomToast from "../CustomToast";

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
};

const InfoCard: React.FC<InfoCardProps> = ({ title, description, value }) => (
  <div className="col-span-12 md:col-span-6 lg:col-span-3">
    <div className="flex flex-col grow justify-center p-6 mx-auto w-full font-semibold text-neutral-700 bg-white rounded-xl border border-solid border-stone-300 max-md:px-5 max-md:mt-5">
      <div className="flex gap-1 pr-5 text-lg">
        <div>{title}</div>
        <div className="flex items-center">
          <Info width={15} height={15} color="#000000" />
        </div>
      </div>
      <div className="mt-1 text-base font-medium text-neutral-500">
        {description}
      </div>
      <div className="mt-6 text-4xl">{value}</div>
    </div>
  </div>
);

const StackStepOneBody: React.FC<StackStepOneBodyProps> = ({
  infoCards,
  setSteps,
  amount,
  setAmount,
  myBalance,
}) => {
  const { writeContract, data: hash, error, isPending } = useWriteContract();
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
      // wait for 2.5 second before setting the steps
      setTimeout(() => {
        setSteps([
          {
            number: "1",
            title: "Stake your token : Informations",
            text: "Staking Informations",
            isActive: false,
          },
          {
            number: "2",
            title: "Send funds",
            text: "Send funds",
            isActive: true,
          },
          {
            number: "3",
            title: "You staked sucessfully",
            text: "Confirmation",
            isActive: false,
          },
        ]);
      }, 2500);
    }
  }, [isConfirmed]);

  // error
  React.useEffect(() => {
    if (error) {
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
      console.error(error);
    }
  }, [error]);

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
          // icon: <Info />,
          // autoClose: 5000000,
          theme: "colored",
          icon: <Info width={21} height={21} size={32} color="#0000" />,
        }
      );
    }
  }, [hash]);

  const handleClick = () => {
    writeContract({
      abi: stakingTokenABI,
      address: stakingTokenAddress,
      functionName: "approve",
      args: [contractAddress, parseEther(amount.toString())],
    });
  };

  return (
    <>
      {/* info cards section */}
      <div className="mx-2.5 mt-14 max-md:mt-10 max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col max-md:gap-0">
          <div className="grid grid-cols-12 gap-5 max-md:grid-cols-1">
            {infoCards.map((card, index) => (
              <React.Fragment key={index}>
                <InfoCard {...card} />
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
      {/* end info cards section */}

      <div className="flex flex-col p-6 mx-2.5 mt-5 bg-white rounded-3xl border border-solid border-stone-300 max-md:px-5 max-md:max-w-full">
        <div className="flex gap-5 justify-between font-medium text-neutral-700 max-md:flex-wrap max-md:max-w-full">
          <div className="my-auto text-lg">Enter Amount to Stake:</div>
          <div className="justify-center px-4 py-2 text-base bg-surface-500 border-2 border-black border-solid rounded-[38px]">
            Total staked + rewards:
          </div>
        </div>
        <div className="flex gap-5 justify-between mt-6 w-full text-neutral-700 whitespace-nowrap max-md:flex-wrap max-md:max-w-full">
          <div className="flex gap-1.5 max-w-[40%]">
            <div className="flex text-5xl font-semibold">
              <input
                className={`text-5xl font-semibold outline-none w-[80%] overflow-auto `}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
              <div className="my-auto text-xl font-bold">$ERA</div>
            </div>
          </div>
          <div className="flex items-center">
            <ArrowLeftRight width={32} height={32} color="#1F1F1F" />
          </div>
          <div className="flex gap-1.5">
            <div className="text-5xl font-semibold">={amount}</div>
            <div className="my-auto text-xl font-bold">$ERA</div>
          </div>
        </div>
        <div className="flex gap-5 justify-between text-base font-medium whitespace-nowrap text-neutral-500 max-md:flex-wrap max-md:max-w-full">
          <div>=$250.000</div>
          <div>=$250.000</div>
        </div>
        <div className="flex gap-5 justify-between mt-6 w-full text-lg max-md:flex-wrap max-md:max-w-full">
          <div className="flex gap-3 pr-20 max-md:flex-wrap">
            <div className="my-auto font-medium text-neutral-700">
              Your Balance :{" "}
              {myBalance ? formatEther(myBalance).toString() : "0"} $ERA
            </div>
            <div
              className="justify-center py-1 cursor-pointer font-semibold text-neutral-700 border-b-2 border-black border-solid"
              onClick={() => {
                setAmount(Number(formatEther(myBalance)));
              }}
            >
              Stake Max
            </div>
          </div>
          <div className="my-auto font-medium text-neutral-700">
            Projected Earning After 1 Year
          </div>
        </div>
      </div>
      <div className="flex flex-col p-5 mx-2.5 mt-5 bg-white rounded-xl border-2 border-orange-200 border-solid max-md:max-w-full">
        <div className="flex gap-3.5 max-md:flex-wrap">
          <div className="flex justify-center items-center p-2 bg-orange-200 h-[35px] rounded-[29.167px] w-[35px]">
            <TriangleAlert width={18} height={18} color="#000000" />
          </div>
          <h2 className="flex-1 my-auto text-xl font-bold text-neutral-700 max-md:max-w-full">
            More Information on Early Unstaking
          </h2>
        </div>
        <p className="text-base font-medium text-neutral-700 max-md:max-w-full">
          The longer you stake your tokens, the more rewards you earn. However,
          withdrawing your stake early will result in penalties on your accrued
          rewards. Additionally, please note that there is a 7-day cooldown
          period before you can fully withdraw your staked tokens. Read our full
          article on staking rewards and penalties for a detailed explanation.
        </p>
      </div>
      <button
        className="primary-button justify-center self-end px-7 py-4 mt-14 text-lg font-semibold text-neutral-700 bg-emerald-200 rounded-xl border-black border-solid border-[3px] max-md:px-5 max-md:mt-10 max-md:mr-2.5"
        onClick={handleClick}
      >
        Approve {amount} $ERA
      </button>
    </>
  );
};

export default StackStepOneBody;
