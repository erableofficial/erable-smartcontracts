import React from "react";
import { contractABI, contractAddress } from "../../../lib/blockchain-config";
import { toast } from "react-toastify";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { parseEther } from "viem";
import CustomToast from "../CustomToast";
import { Check, Info, TriangleAlert } from "lucide-react";
import InfoText from "../../ui/InfoText";
import { InfoBox } from "../AuthorizeStackingModal";
import StackingLoadingModal from "../StackingLoadingModal";
import ErrorBox from "../../ui/ErrorBox";

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

interface WithdrawDetailsBoxProps {
  text: string;
}

const WithdrawDetailsBox: React.FC<WithdrawDetailsBoxProps> = ({ text }) => (
  <div
    className={`p-5 rounded-xl font-NeueHaas border-[1.5px] border-solid border-[#BDBDBD]`}
  >
    <div className="flex gap-4 items-start">
      <div className="bg-surface-500 p-2 rounded-full ">
        <Info width={17} height={17} color="#000000" />
      </div>
      <div className="flex flex-col">
        <h4 className="text-xl font-NeueHaas font-semibold leading-6 text-neutral-700 max-sm:text-lg">
          Withdrawing details
        </h4>

        <p className="font-medium text-neutral-700">{text}</p>
      </div>
    </div>
  </div>
);

const StackStepTwoBody: React.FC<StackStepTwoBodyProps> = ({
  setSteps,
  infoCards,
  amount,
}) => {
  const [toggleStackingLoadingModal, setToggleStackingLoadingModal] =
    React.useState(false);

  const items = [
    { label: "Total APR", value: "00" },
    { label: "Duration", value: infoCards[1].value },
    { label: "Start date", value: infoCards[2].value },
    { label: "End date", value: infoCards[3].value },
  ];
  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  React.useEffect(() => {
    if (isConfirmed) {
      setToggleStackingLoadingModal(false);
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
          isActive: false,
        },
        {
          number: "3",
          title: "Staking Successful",
          text: "Confirmation",
          isActive: true,
        },
      ]);
    }
  }, [isConfirmed]);

  // error
  React.useEffect(() => {
    if (error) {
      setToggleStackingLoadingModal(false);
      toast.error(
        <CustomToast
          title={error.name || "Something went wrong"}
          message={error.message}
        />,
        {
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

  const handleSendFund = async () => {
    setToggleStackingLoadingModal(true);
    writeContract({
      abi: contractABI,
      address: contractAddress,
      functionName: "stake",
      args: [parseEther(amount.toString())],
    });
  };

  return (
    <div>
      <div className="flex mx-auto flex-col p-10 mt-14 bg-white rounded-3xl border border-solid border-stone-300 max-w-[791px] max-md:px-5">
        <StackingLoadingModal
          toggleStackingLoadingModal={toggleStackingLoadingModal}
        />
        <div className="text-3xl mb-3 font-NeueHaas font-semibold text-neutral-700 max-md:max-w-full max-sm:text-2xl">
          Confirm Fund Transfer
        </div>

        {error && (
          <div className="flex max-w-fit py-4">
            <ErrorBox
              text="Transaction faliled, try again !"
              bgColor="bg-[#FFD4D4]"
            />
          </div>
        )}

        <p className="flex flex-col mt-3 text-neutral-700 font-NeueHaas font-semibold text-lg leading-[1.35rem] max-sm:text-base">
          Please confirm the transfer of your tokens into the staking contract.
          <span className="font-medium max-sm:text-base">
            This action will lock your tokens for one year, starting your
            earnings.
          </span>
        </p>

        <div className="mt-10 text-xl font-semibold text-neutral-700 max-md:max-w-full max-sm:text-lg">
          Your staking
        </div>
        <section className="flex gap-5 justify-between mt-2.5 max-md:flex-wrap max-md:max-w-full">
          <div className="text-3xl font-semibold text-neutral-700 max-sm:text-2xl">
            {amount} $ERA
          </div>
          <div className="my-auto text-base font-medium text-neutral-500">
            =$250.000
          </div>
        </section>
        <hr className="shrink-0 mt-6 h-px border border-solid bg-neutral-300 border-neutral-300 max-md:max-w-full" />
        <div className="mt-6 text-xl font-semibold text-neutral-700 max-md:max-w-full max-sm:text-lg">
          Staking key informations
        </div>
        <section className="flex gap-5 justify-between mt-6 text-lg font-medium text-neutral-700 max-md:flex-wrap max-md:max-w-full">
          <div className="flex flex-col max-sm:text-base">
            {items.map((item, index) => (
              <div key={index} className={index > 0 ? "mt-5" : ""}>
                {item.label}
              </div>
            ))}
          </div>
          <div className="flex flex-col max-sm:text-base">
            {items.map((item, index) => (
              <div key={index} className={index > 0 ? "mt-5" : ""}>
                {item.value}
              </div>
            ))}
          </div>
        </section>
        <div className=" py-10">
          <WithdrawDetailsBox text="Remember, withdrawing funds before the term ends may result in penalties. This transfer might take a few moments." />
        </div>
        <div className="sticky-button-container2">
          <div className="sticky-button text-center">
            <button
              className="primary-button justify-center self-center px-7 py-4 text-lg font-semibold text-neutral-700 rounded-xl border-black border-solid border-[3px] max-md:px-5"
              onClick={() => {
                setToggleStackingLoadingModal(true);
                handleSendFund();
              }}
            >
              Send funds
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StackStepTwoBody;
