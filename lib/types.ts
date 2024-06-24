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
  amount: string;
  currentRewards?: string;
  endTime: number;
  requestUnstakeTime: string;
  unstakeRequested: boolean;
  action: "Claim" | "Unstake";
  daysLeft?: string | null;
}
