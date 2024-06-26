import { useReadContract } from "wagmi";
import { contractABI, contractAddress } from "../../../lib/blockchain-config";
import { formatEther, parseEther } from "viem";
import React from "react";

interface EstimatedWithdrawTokensProps {
  amount: number;
  stakingDuration: bigint;
}

const EstimatedWithdrawTokens: React.FC<EstimatedWithdrawTokensProps> = ({
  amount,
  stakingDuration,
}) => {
  const [withdrawEstimetedAmount, setWithdrawEstimetedAmount] =
    React.useState<number>(amount);
  const {
    data: totalEstimatedWithdraw,
    error: totalEstimatedWithdrawError,
    isLoading: totalEstimatedWithdrawLoading,
  } = useReadContract({
    abi: contractABI,
    address: contractAddress,
    functionName: "calculateTotalWithdraw",
    args: [parseEther(amount.toString()), stakingDuration],
  });

  return (
    <div className="flex gap-1.5">
      <div className="text-5xl font-semibold">
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
