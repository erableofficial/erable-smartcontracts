import { useReadContract } from "wagmi";
import { contractABI, contractAddress } from "../../../lib/blockchain-config";
import { formatEther, parseEther } from "viem";
import React, { useEffect } from "react";
import { useStakingContractData } from "../../../context/stakingContractData";

interface EstimatedWithdrawTokensProps {
  amount: number;
  setStakingAPR: (apr: number) => void;
  setEstimatedValue: (value: number) => void;
}

const EstimatedWithdrawTokens: React.FC<EstimatedWithdrawTokensProps> = ({
  amount,
  setStakingAPR,
  setEstimatedValue,
}) => {
  const [withdrawEstimetedAmount, setWithdrawEstimetedAmount] =
    React.useState<number>(amount);
  const { stakingContractData } = useStakingContractData();

  const {
    stakingDuration,
    yieldConstant,
    monthlyIncreasePercentage,
    startingSlashingPoint,
  } = stakingContractData;

  const {
    data: totalEstimatedWithdraw,
    error: totalEstimatedWithdrawError,
    isLoading: totalEstimatedWithdrawLoading,
  } = useReadContract({
    abi: contractABI,
    address: contractAddress,
    functionName: "calculateTotalWithdraw",
    args: [
      parseEther(amount.toString()),
      stakingDuration,
      yieldConstant,
      monthlyIncreasePercentage,
      startingSlashingPoint,
      stakingDuration,
    ],
  });

  useEffect(() => {
    if (totalEstimatedWithdraw) {
      setEstimatedValue(Number(formatEther(totalEstimatedWithdraw as bigint)));
      const estimNumber = Number(formatEther(totalEstimatedWithdraw as bigint));
      const aprT = Number(((estimNumber - amount) / amount) * 100);

      setStakingAPR(aprT);
    }
  }, [totalEstimatedWithdraw]);

  return (
    <div className="flex gap-1.5">
      <div className="text-[32px] font-semibold max-sm:text-lg">
        =
        {totalEstimatedWithdraw
          ? Number(formatEther(totalEstimatedWithdraw as bigint))
          : amount}
      </div>
      <div className="my-auto text-xl font-bold max-sm:text-lg max-sm:font-semibold">
        $ERA
      </div>
    </div>
  );
};

export default EstimatedWithdrawTokens;
