import { useReadContract } from "wagmi";
import { contractABI, contractAddress } from "../../../lib/blockchain-config";
import { formatEther, parseEther } from "viem";
import React from "react";
import { useStakingContractData } from "../../../context/stakingContractData";

interface EstimatedWithdrawTokensProps {
  amount: number;
}

const EstimatedWithdrawTokens: React.FC<EstimatedWithdrawTokensProps> = ({
  amount,
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

  return (
    <div className="flex gap-1.5">
      <div className="text-[32px] font-semibold">
        =
        {totalEstimatedWithdraw
          ? Number(formatEther(totalEstimatedWithdraw as bigint))
          : amount}
      </div>
      <div className="my-auto text-xl font-bold">$ERA</div>
    </div>
  );
};

export default EstimatedWithdrawTokens;
