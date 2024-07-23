import React, { useEffect } from "react";
import StackingStepsHeader from "./StackingStepsHeader";
import StackStepOneBody from "./StackStepOneBody";
import StackStepTwoBody from "./StackStepTwoBody";
import StackStepThreeBody from "./StackStepThreeBody";
import { useAccount, useReadContract } from "wagmi";
import {
  contractABI,
  contractAddress,
  stakingTokenABI,
  stakingTokenAddress,
} from "../../../lib/blockchain-config";
import { approximateTime } from "../../../lib/utils";
import { useStakingContractData } from "../../../context/stakingContractData";
import { useRouter } from "next/router";
import { formatEther } from "viem";

const Stacking: React.FC = () => {
  const { stakingContractData, setStakingContractData } =
    useStakingContractData();
  const [stakingAPR, setStakingAPR] = React.useState<number>(0);
  const [steps, setSteps] = React.useState([
    {
      number: "1",
      title: "Start Your Staking",
      text: "Set Up Staking",
      isActive: true,
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
      isActive: false,
    },
  ]);
  const [amount, setAmount] = React.useState(2);

  const { address: currentAddress, isConnected } = useAccount();
  const router = useRouter();

  const { data: myBalance, error: myBalanceError } = useReadContract({
    abi: stakingTokenABI,
    address: stakingTokenAddress,
    functionName: "balanceOf",
    args: [currentAddress],
  });

  const { data: stakingDuration, error: stakingDurationError } =
    useReadContract({
      abi: contractABI,
      address: contractAddress,
      functionName: "stakingDuration",
      args: [],
    });

  const {
    data: yieldConstant,
    error: yieldConstantError,
    isLoading: yieldConstantLoading,
  } = useReadContract({
    abi: contractABI,
    address: contractAddress,
    functionName: "yieldConstant",
  });

  const {
    data: monthlyIncreasePercentage,
    error: monthlyIncreasePercentageError,
    isLoading: monthlyIncreasePercentageLoading,
  } = useReadContract({
    abi: contractABI,
    address: contractAddress,
    functionName: "monthlyIncreasePercentage",
  });

  // startingSlashingPoint
  const { data: startingSlashingPoint } = useReadContract({
    abi: contractABI,
    address: contractAddress,
    functionName: "startingSlashingPoint",
  });

  const { data: coolDownPeriod, error: coolDownPeriodError } = useReadContract({
    abi: contractABI,
    address: contractAddress,
    functionName: "cooldownPeriod",
    args: [],
  });

  const { data: totalPendingRewards, error: totalPendingRewardsError } =
    useReadContract({
      abi: contractABI,
      address: contractAddress,
      functionName: "totalPendingRewards",
    });

  const { data: totalStaked, error: totalStakedError } = useReadContract({
    abi: contractABI,
    address: contractAddress,
    functionName: "totalStaked",
  });

  useEffect(() => {
    if (
      stakingDuration &&
      coolDownPeriod &&
      yieldConstant &&
      monthlyIncreasePercentage &&
      startingSlashingPoint
    ) {
      setStakingContractData({
        ...stakingContractData,
        stakingDuration: stakingDuration as bigint,
        cooldownPeriod: coolDownPeriod as bigint,
        yieldConstant: yieldConstant as bigint,
        monthlyIncreasePercentage: monthlyIncreasePercentage as bigint,
        startingSlashingPoint: startingSlashingPoint as bigint,
      });
      if (!isConnected) {
        router.push("/dashboard");
      }
    }
  }, [
    stakingDuration,
    coolDownPeriod,
    yieldConstant,
    monthlyIncreasePercentage,
    startingSlashingPoint,
    isConnected,
  ]);

  const infoCards = [
    {
      title: "Reward Rate (APR)*",
      description:
        "The annual percentage rate currently being earned in the staking program.",
      value: stakingAPR.toFixed(2) + "%" || "00",
    },
    {
      title: "Staking Duration*",
      description: "The total length of time the staking program will run.",
      value: approximateTime(Number(stakingDuration)) || "xx",
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
          new Date().getTime() + Number(stakingDuration) * 1000
        ).toLocaleDateString() || "xx",
    },
  ];

  return (
    <div className="flex w-full justify-center bg-neutral-50 max-[1281px]:px-5">
      <div className=" relative flex pb-20 pt-20  flex-col max-w-[1260px] max-lg:px-5 max-md:pt-10 w-full max-sm:px-0">
        <StackingStepsHeader steps={steps} />

        {steps[0].isActive && (
          <StackStepOneBody
            infoCards={infoCards}
            setSteps={setSteps}
            amount={amount}
            setAmount={setAmount}
            myBalance={myBalance as bigint}
            stakingDuration={stakingDuration as bigint}
            setStakingAPR={setStakingAPR}
          />
        )}
        {steps[1].isActive && (
          <StackStepTwoBody
            setSteps={setSteps}
            infoCards={infoCards}
            amount={amount}
          />
        )}

        {steps[2].isActive && <StackStepThreeBody amount={amount} />}
      </div>
    </div>
  );
};

export default Stacking;
