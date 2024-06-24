import { ArrowLeftRight, Info, TriangleAlert } from "lucide-react";
import React, { useEffect } from "react";
import { formatEther, parseEther } from "viem";
import {
  contractAddress,
  stakingTokenABI,
  stakingTokenAddress,
} from "../../../lib/blockchain-config";
import { toast } from "react-toastify";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

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
  <div className="flex flex-col grow justify-center p-6 mx-auto w-full font-semibold text-black bg-white rounded-xl border border-solid border-stone-300 max-md:px-5 max-md:mt-5">
    <div className="flex gap-1 pr-5 text-lg">
      <div>{title}</div>
      <Info width={15} height={15} color="#000000" />
    </div>
    <div className="mt-1 text-base font-medium text-neutral-500">
      {description}
    </div>
    <div className="mt-6 text-4xl">{value}</div>
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

  useEffect(() => {
    if (isConfirmed) {
      toast.success("Transaction confirmed.", {
        autoClose: 2500,
      });
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
  useEffect(() => {
    if (error) {
      toast.error("Something went wrong.");
      console.error(error);
    }
  }, [error]);

  // hash
  useEffect(() => {
    if (hash) {
      console.info("Transaction Hash: ", hash);
      toast.info("Waiting for confirmation...", {
        autoClose: 1500,
      });
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

      <div className="flex flex-col p-6 mx-2.5 mt-5 bg-white rounded-3xl border border-solid border-stone-300 max-md:px-5 max-md:max-w-full">
        <div className="flex gap-5 justify-between font-medium text-black max-md:flex-wrap max-md:max-w-full">
          <div className="my-auto text-lg">
            Enter the amount you want to stake:
          </div>
          <div className="justify-center px-4 py-2 text-base bg-surface-500 border-2 border-black border-solid rounded-[38px]">
            Total staked + rewards:
          </div>
        </div>
        <div className="flex gap-5 justify-between mt-6 w-full text-black whitespace-nowrap max-md:flex-wrap max-md:max-w-full">
          <div className="flex gap-1.5 overflow-auto">
            <input
              className={`text-5xl font-semibold outline-none max-w-[30%] overflow-auto `}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
            <div className="my-auto text-xl font-bold">$ERA</div>
          </div>

          <ArrowLeftRight width={32} height={32} color="#1F1F1F" />
          <div className="flex gap-1.5">
            <div className="text-5xl font-semibold">{amount}</div>
            <div className="my-auto text-xl font-bold">$ERA</div>
          </div>
        </div>
        <div className="flex gap-5 justify-between text-base font-medium whitespace-nowrap text-neutral-500 max-md:flex-wrap max-md:max-w-full">
          <div>=$250.000</div>
          <div>=$250.000</div>
        </div>
        <div className="flex gap-5 justify-between mt-6 w-full text-lg max-md:flex-wrap max-md:max-w-full">
          <div className="flex gap-3 pr-20 max-md:flex-wrap">
            <div className="my-auto font-medium text-black">
              You own : {myBalance ? formatEther(myBalance).toString() : "0"}{" "}
              $ERA
            </div>
            <button
              onClick={() => {
                setAmount(Number(formatEther(myBalance)));
              }}
              className="justify-center py-1 font-semibold text-black border-b-2 border-black border-solid"
            >
              Stake Max
            </button>
          </div>
          <div className="my-auto font-medium text-black">
            1 year simulation
          </div>
        </div>
      </div>
      <div className="flex flex-col p-5 mx-2.5 mt-5 bg-white rounded-xl border-2 border-orange-200 border-solid max-md:max-w-full">
        <div className="flex gap-3.5 max-md:flex-wrap">
          <div className="flex justify-center items-center p-2 bg-orange-200 h-[35px] rounded-[29.167px] w-[35px]">
            <TriangleAlert width={18} height={18} color="#000000" />
          </div>
          <h2 className="flex-1 my-auto text-xl font-bold text-black max-md:max-w-full">
            More infos about early unstaking{" "}
          </h2>
        </div>
        <p className="text-base font-medium text-black max-md:max-w-full">
          If you decide to unstake before the end of the period, you'll get a
          tax on your rewards. =&gt; derrière trouver comment bien expliquer
          slashing ici (en + de l'article qui expliquera ofc)
        </p>
      </div>
      <button
        className="primary-button justify-center self-end px-7 py-4 mt-14 text-lg font-semibold text-black bg-emerald-200 rounded-xl border-black border-solid border-[3px] max-md:px-5 max-md:mt-10 max-md:mr-2.5"
        onClick={handleClick}
      >
        Approve {amount} $ERA
      </button>
    </>
  );
};

export default StackStepOneBody;
