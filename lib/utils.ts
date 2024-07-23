import { readContract } from "@wagmi/core";
import { Address } from "viem";
import { config } from "./wagmi/config";
import {
  airdropContractABI,
  airdropContractAddress,
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
    return `${Math.round(seconds / year)} year`;
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

  return result as StakeInfo[];
}

export async function calculateTotalWithdraw(
  amount: bigint,
  startTime: number,
  yieldConstant: bigint,
  monthlyIncreasePercentage: bigint,
  startingSlashingPoint: bigint,
  stakingDuration: bigint
): Promise<bigint> {
  const currentTime = BigInt(Math.floor(new Date().getTime() / 1000));
  const timePassed = currentTime - BigInt(startTime / 1000);

  const result = await readContract(config, {
    abi: contractABI,
    address: contractAddress,
    functionName: "calculateTotalWithdraw",
    args: [
      amount,
      timePassed,
      yieldConstant,
      monthlyIncreasePercentage,
      startingSlashingPoint,
      stakingDuration,
    ],
  });

  return result as bigint;
}

export async function getUserBalance(address: Address | undefined) {
  const result = await readContract(config, {
    abi: stakingTokenABI,
    address: stakingTokenAddress,
    functionName: "balanceOf",
    args: [address],
  });

  return result as bigint;
}

export async function getTotalStaked(): Promise<bigint> {
  const result = await readContract(config, {
    abi: contractABI,
    address: contractAddress,
    functionName: "totalStaked",
    args: [],
  });

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

  return result as bigint;
}

export async function getStakingDuration(): Promise<bigint> {
  const result = await readContract(config, {
    abi: contractABI,
    address: contractAddress,
    functionName: "stakingDuration",
    args: [],
  });

  return result as bigint;
}

export async function getCooldownPeriod(): Promise<bigint> {
  const result = await readContract(config, {
    abi: contractABI,
    address: contractAddress,
    functionName: "cooldownPeriod",
    args: [],
  });

  return result as bigint;
}

export async function getMonthlyIncreasePercentage(): Promise<bigint> {
  const result = await readContract(config, {
    abi: contractABI,
    address: contractAddress,
    functionName: "monthlyIncreasePercentage",
    args: [],
  });

  return result as bigint;
}

export async function getMonthsInStakingPeriod(): Promise<bigint> {
  const result = await readContract(config, {
    abi: contractABI,
    address: contractAddress,
    functionName: "monthsInStakingPeriod",
    args: [],
  });

  return result as bigint;
}

export async function getStartingSlashingPoint(): Promise<bigint> {
  const result = await readContract(config, {
    abi: contractABI,
    address: contractAddress,
    functionName: "startingSlashingPoint",
    args: [],
  });

  return result as bigint;
}

export async function getMaxCap(): Promise<bigint> {
  const result = await readContract(config, {
    abi: contractABI,
    address: contractAddress,
    functionName: "maxCap",
    args: [],
  });

  return result as bigint;
}

export async function getMinCap(): Promise<bigint> {
  const result = await readContract(config, {
    abi: contractABI,
    address: contractAddress,
    functionName: "minCap",
    args: [],
  });

  return result as bigint;
}

export async function getYieldConstant(): Promise<bigint> {
  const result = await readContract(config, {
    abi: contractABI,
    address: contractAddress,
    functionName: "yieldConstant",
    args: [],
  });

  return result as bigint;
}

export async function getWhiteListEnabled(): Promise<boolean> {
  const result = await readContract(config, {
    abi: contractABI,
    address: contractAddress,
    functionName: "whitelistEnabled",
    args: [],
  });

  return result as boolean;
}

export async function getUserHasClaimedAirdrop(
  cycleIndex: string,
  address: Address | undefined
): Promise<boolean> {
  const result = await readContract(config, {
    abi: airdropContractABI,
    address: airdropContractAddress,
    functionName: "hasUserClaimed",
    args: [BigInt(cycleIndex), address],
  });
  return result as boolean;
}
