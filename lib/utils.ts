import { readContract } from "@wagmi/core";
import { Address } from "viem";
import { config } from "./wagmi/config";
import { contractABI, contractAddress } from "./blockchain-config";
import { StakeInfo } from "./types";

export function approximateTime(seconds: number): string {
  const minute = 60;
  const hour = minute * 60;
  const day = hour * 24;
  const year = day * 365;

  if (seconds < minute) {
    return `${seconds} seconds`;
  } else if (seconds < hour) {
    return `${Math.round(seconds / minute)} minutes`;
  } else if (seconds < day) {
    return `${Math.round(seconds / hour)} hours`;
  } else if (seconds < year) {
    return `${Math.round(seconds / day)} days`;
  } else {
    return `${Math.round(seconds / year)} years`;
  }
}

export async function getUserStakes(
  userAddress: Address | undefined
): Promise<Array<StakeInfo>> {
  const result = await readContract(config, {
    abi: contractABI,
    address: contractAddress,
    functionName: "getUserStakes",
    args: [userAddress],
  });

  console.log("Result From getUserStakes: ", result);
  return result as StakeInfo[];
}

export async function calculateTotalWithdraw(
  amount: bigint,
  startTime: bigint
): Promise<bigint> {
  const currentTime = BigInt(new Date().getTime());
  const timePassed = currentTime - startTime;
  const timePassedInSeconds = timePassed / BigInt(1000);

  const result = await readContract(config, {
    abi: contractABI,
    address: contractAddress,
    functionName: "calculateTotalWithdraw",
    args: [amount, timePassedInSeconds],
  });

  console.log("Result From calculateTotalWithdraw: ", result);
  return result as bigint;
}
