import { readContract } from "@wagmi/core";
import { Address } from "viem";
import { config } from "./wagmi/config";
import {
  contractABI,
  contractAddress,
  stakingTokenABI,
  stakingTokenAddress,
} from "./blockchain-config";
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
  startTime: bigint,
  yieldConstant: bigint,
  monthlyIncreasePercentage: bigint,
  startingSlashingPoint: bigint,
  stakingDuration: bigint
): Promise<bigint> {
  const currentTime = BigInt(new Date().getTime());
  const timePassed = currentTime - startTime;
  const timePassedInSeconds = timePassed / BigInt(1000);

  const result = await readContract(config, {
    abi: contractABI,
    address: contractAddress,
    functionName: "calculateTotalWithdraw",
    args: [
      amount,
      timePassedInSeconds,
      yieldConstant,
      monthlyIncreasePercentage,
      startingSlashingPoint,
      stakingDuration,
    ],
  });

  console.log("Result From calculateTotalWithdraw: ", result);
  return result as bigint;
}

export async function getUserBalance(address: Address | undefined) {
  const result = await readContract(config, {
    abi: stakingTokenABI,
    address: stakingTokenAddress,
    functionName: "balanceOf",
    args: [address],
  });

  console.log("Result From getUserBalance: ", result);
  return result as bigint;
}

export async function getTotalStaked(): Promise<bigint> {
  const result = await readContract(config, {
    abi: contractABI,
    address: contractAddress,
    functionName: "totalStaked",
    args: [],
  });

  console.log("Result From getTotalStaked: ", result);
  return result as bigint;
}

export async function getTotalStakedForUser(
  address: Address | undefined
): Promise<bigint> {
  const result = await readContract(config, {
    abi: contractABI,
    address: contractAddress,
    functionName: "getTotalStakedForUser",
    args: [address],
  });

  console.log("Result From getTotalStakedForUser: ", result);
  return result as bigint;
}
