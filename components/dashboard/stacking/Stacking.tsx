import React from "react";
import StackingStepsHeader from "./StackingStepsHeader";
import StackStepOneBody from "./StackStepOneBody";
import SignLoadingModal from "../SignLoadingModal";
import StackStepTwoBody from "./StackStepTwoBody";
import StackingLoadingModal from "../StackingLoadingModal";
import StackStepThreeBody from "./StackStepThreeBody";
import { useAccount, useReadContract } from "wagmi";
import {
  contractABI,
  contractAddress,
  stakingTokenABI,
  stakingTokenAddress,
} from "../../../lib/blockchain-config";
import { approximateTime } from "../../../lib/utils";

const Stacking: React.FC = () => {
  const [steps, setSteps] = React.useState([
    {
      number: "1",
      title: "Stake your token : Informations",
      text: "Staking Informations",
      isActive: true,
    },
    { number: "2", title: "Send funds", text: "Send funds", isActive: false },
    {
      number: "3",
      title: "You staked sucessfully",
      text: "Confirmation",
      isActive: false,
    },
  ]);
  const [showSignModal, setShowSignModal] = React.useState(false);
  const [showStackingModal, setShowStackingModal] = React.useState(false);
  const [amount, setAmount] = React.useState(50);

  React.useEffect(() => {
    const step2 = steps.find((step) => step.number == "2");
    const step3 = steps.find((step) => step.number == "3");
    if (step2 && step2.isActive) {
      setShowSignModal(true);
      console.log("showSignModal", showSignModal);
      setTimeout(() => {
        setShowSignModal(false);
        console.log("showSignModal", showSignModal);
      }, 5000);
    }

    if (step3 && step3.isActive) {
      setShowStackingModal(true);
      console.log("showStackingModal", showStackingModal);
      setTimeout(() => {
        setShowStackingModal(false);
        console.log("showStackingModal", showStackingModal);
      }, 2000);
    }
  }, [steps]);

  const { address: currentAddress } = useAccount();

  const { data: myBalance, error: myBalanceError } = useReadContract({
    abi: stakingTokenABI,
    address: stakingTokenAddress,
    functionName: "balanceOf",
    args: [currentAddress],
  });

  const { data: stakedDuration, error: stakedDurationError } = useReadContract({
    abi: contractABI,
    address: contractAddress,
    functionName: "stakingDuration",
    args: [],
  });

  console.log("stakedDuration", stakedDuration);

  const infoCards = [
    {
      title: "Current APY",
      description: "Lorem ipsum dolor sit amet coetur.",
      value: "xx",
    },
    {
      title: "Program duration",
      description: "Lorem ipsum dolor sit amet coetur.",
      value: approximateTime(Number(stakedDuration)) || "xx",
    },

    {
      title: "Start date",
      description: "Lorem ipsum dolor sit amet coetur.",
      value: new Date().toLocaleDateString() || "xx",
    },
    {
      title: "End date",
      description: "Lorem ipsum dolor sit amet coetur.",
      value:
        new Date(
          new Date().getTime() + Number(stakedDuration) * 1000
        ).toLocaleDateString() || "xx",
    },
  ];

  return (
    <div className=" relative flex pb-20 pt-20 bg-neutral-50 flex-col px-20 max-md:px-5">
      <StackingStepsHeader steps={steps} />
      {showSignModal && <SignLoadingModal />}
      {steps[0].isActive && (
        <StackStepOneBody
          infoCards={infoCards}
          setSteps={setSteps}
          amount={amount}
          setAmount={setAmount}
          myBalance={myBalance as bigint}
        />
      )}
      {showStackingModal && <StackingLoadingModal />}
      {steps[1].isActive && showSignModal == false && (
        <StackStepTwoBody
          infoCards={infoCards}
          amount={amount}
          setSteps={setSteps}
        />
      )}

      {steps[2].isActive && showStackingModal == false && (
        <StackStepThreeBody
          currentAddress={currentAddress}
          stakingDuration={stakedDuration as bigint}
        />
      )}
    </div>
  );
};

export default Stacking;
