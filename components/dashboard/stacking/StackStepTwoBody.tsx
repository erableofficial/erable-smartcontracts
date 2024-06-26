import React from "react";
import { contractABI, contractAddress } from "../../../lib/blockchain-config";
import { toast } from "react-toastify";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { parseEther } from "viem";
import CustomToast from "../CustomToast";
import { Check, Info, TriangleAlert } from "lucide-react";
import SignLoadingModal from "../SignLoadingModal";
import InfoText from "../../ui/InfoText";
import { InfoBox } from "../AuthorizeStackingModal";
import StackingLoadingModal from "../StackingLoadingModal";

type InfoCardProps = {
  title: string;
  description: string;
  value: string;
};
type StackStepTwoBodyProps = {
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
  infoCards: InfoCardProps[];
  amount: number;
};

const StackStepTwoBody: React.FC<StackStepTwoBodyProps> = ({
  setSteps,
  infoCards,
  amount,
}) => {
  const [toggleStackingLoadingModal, setToggleStackingLoadingModal] =
    React.useState(false);
  const [showSignModal, setShowSignModal] = React.useState(false);
  const items = [
    { label: "Total APR:", value: "00" },
    { label: "Duration:", value: infoCards[1].value },
    { label: "Start date:", value: infoCards[2].value },
    { label: "End date:", value: infoCards[3].value },
  ];
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
        setShowSignModal(false);
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
            isActive: false,
          },
          {
            number: "3",
            title: "You staked sucessfully",
            text: "Confirmation",
            isActive: true,
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
      setShowSignModal(true);
    }
  }, [hash]);

  const handleSendFund = () => {
    writeContract({
      abi: contractABI,
      address: contractAddress,
      functionName: "stake",
      args: [parseEther(amount.toString())],
    });
  };

  if (showSignModal) {
    return <SignLoadingModal />;
  } else {
    return (
      <div>
        <div className="flex mx-auto flex-col p-10 mt-14 bg-white rounded-3xl border border-solid border-stone-300 max-w-[791px] max-md:px-5">
          <div className="text-3xl font-semibold text-neutral-700 max-md:max-w-full">
            Confirm Fund Transfer
          </div>
          <p className=" text-lg mt-3">
            Now, let’s secure your rewards! Please confirm the transfer of your
            tokens into the staking contract. This action will lock your tokens
            for one year, starting your earnings. Remember, withdrawing funds
            before the term ends may result in penalties. This transfer might
            take a few moments.
          </p>
          <div className="mt-10 text-xl font-bold text-neutral-700 max-md:max-w-full">
            Your staking:
          </div>
          <section className="flex gap-5 justify-between mt-2.5 max-md:flex-wrap max-md:max-w-full">
            <div className="text-3xl font-semibold text-neutral-700">
              {amount} $ERA
            </div>
            <div className="my-auto text-base font-medium text-neutral-500">
              =$250.000
            </div>
          </section>
          <hr className="shrink-0 mt-6 h-px border border-solid bg-neutral-300 border-neutral-300 max-md:max-w-full" />
          <div className="mt-6 text-xl font-bold text-neutral-700 max-md:max-w-full">
            Staking key informations:
          </div>
          <section className="flex gap-5 justify-between mt-6 text-lg font-medium text-neutral-700 max-md:flex-wrap max-md:max-w-full">
            <div className="flex flex-col">
              {items.map((item, index) => (
                <div key={index} className={index > 0 ? "mt-5" : ""}>
                  {item.label}
                </div>
              ))}
            </div>
            <div className="flex flex-col">
              {items.map((item, index) => (
                <div key={index} className={index > 0 ? "mt-5" : ""}>
                  {item.value}
                </div>
              ))}
            </div>
          </section>
          <button
            className="justify-center self-center px-7 py-4 mt-10 text-lg font-semibold text-neutral-700 bg-emerald-200 rounded-xl border-black border-solid border-[3px] max-md:px-5"
            onClick={handleClick}
          >
            Send funds
          </button>
        </div>
      </div>
    );
  }
};

export default StackStepTwoBody;
