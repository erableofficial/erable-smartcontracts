import { Address } from "viem";

export interface StakeInfo {
  amount: bigint;
  startTime: bigint;
  requestUnstakeTime: bigint;
  unstakeRequested: boolean;
}

export interface TabItem {
  type: "Staking" | "LP Farming" | "Airdrop";
  id: number;
  startTime: number;
  amount: bigint;
  currentRewards?: bigint;
  endTime: number;
  requestUnstakeTime: string;
  unstakeRequested: boolean;
  action: "Claim" | "Unstake" | "Claimed";
  daysLeft?: string | null;
  airdropCycleIndex?: number;
}

export interface IMerkleTreeElement {
  address: Address;
  amount: bigint;
}

export interface IAirdropCycleInfo {
  merkleRoot: Address;
  isActive: boolean;
}

export interface IRedisAirdop {
  cycle: string;
  address: Address;
  amount: string;
}
