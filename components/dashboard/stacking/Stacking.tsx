import React from "react";
import StackingStepsHeader from "./StackingStepsHeader";
import StackStepOneBody from "./StackStepOneBody";
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
      title: "Staking Process",
      text: "Set Up Staking",
      isActive: true,
    },
    {
      number: "2",
      title: "Staking Process",
      text: "Transfer Funds",
      isActive: false,
    },
    {
      number: "3",
      title: "Staking Process",
      text: "Start Earning",
      isActive: false,
    },
  ]);
  const [showStackingModal, setShowStackingModal] = React.useState(false);
  const [amount, setAmount] = React.useState(2);

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
      title: "Reward Rate (APR)",
      description:
        "The annual percentage rate currently being earned in the staking program.",
      value: "xx",
    },
    {
      title: "Staking Duration",
      description: "The total length of time the staking program will run.",
      value: approximateTime(Number(stakedDuration)) || "xx",
    },

    {
      title: "Start Date",
      description: "The date when the staking program begins.",
      value: new Date().toLocaleDateString() || "xx",
    },
    {
      title: "End Date",
      description: "The date when the staking program concludes.",
      value:
        new Date(
          new Date().getTime() + Number(stakedDuration) * 1000
        ).toLocaleDateString() || "xx",
    },
  ];

  return (
    <div className=" relative flex pb-20 pt-20 bg-neutral-50 flex-col px-20 max-md:px-5 max-md:pt-7">
      <StackingStepsHeader steps={steps} />

      {steps[0].isActive && (
        <StackStepOneBody
          infoCards={infoCards}
          setSteps={setSteps}
          amount={amount}
          setAmount={setAmount}
          myBalance={myBalance as bigint}
        />
      )}
      {steps[1].isActive && (
        <StackStepTwoBody
          setSteps={setSteps}
          infoCards={infoCards}
          amount={amount}
        />
      )}

      {steps[2].isActive && (
        <StackStepThreeBody
          currentAddress={currentAddress}
          stakingDuration={stakedDuration as bigint}
        />
      )}
    </div>
  );
};

export default Stacking;
