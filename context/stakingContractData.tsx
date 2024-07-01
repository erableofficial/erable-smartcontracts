import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  getCooldownPeriod,
  getMaxCap,
  getMinCap,
  getMonthlyIncreasePercentage,
  getMonthsInStakingPeriod,
  getStakingDuration,
  getStartingSlashingPoint,
  getTotalStaked,
  getWhiteListEnabled,
  getYieldConstant,
} from "../lib/utils";
import { contractAddress } from "../lib/blockchain-config";

interface IStakingContractData {
  stakingDuration?: bigint;
  cooldownPeriod?: bigint;
  monthlyIncreasePercentage?: bigint;
  monthsInStakingPeriod?: bigint;
  startingSlashingPoint?: bigint;
  maxCap?: bigint;
  minCap?: bigint;
  totalStaked?: bigint;
  yieldConstant?: bigint;
  whiteListEnabled?: boolean;
}

interface IStakingContractDataType {
  stakingContractData: IStakingContractData;
  setStakingContractData: React.Dispatch<
    React.SetStateAction<IStakingContractData>
  >;
}

const StakingContractDataContext = createContext<
  IStakingContractDataType | undefined
>(undefined);

export const useStakingContractData = (): IStakingContractDataType => {
  const context = useContext(StakingContractDataContext);
  if (!context) {
    throw new Error(
      "useContractData must be used within a ContractDataProvider"
    );
  }
  return context;
};

export const StakingContractDataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [stakingContractData, setStakingContractData] =
    useState<IStakingContractData>({});

  async function fetchStakingContractData() {
    const cooldownPeriod = await getCooldownPeriod();
    const stakingDuration = await getStakingDuration();
    const monthlyIncreasePercentage = await getMonthlyIncreasePercentage();
    const monthsInStakingPeriod = await getMonthsInStakingPeriod();
    const startingSlashingPoint = await getStartingSlashingPoint();
    const maxCap = await getMaxCap();
    const minCap = await getMinCap();
    const totalStaked = await getTotalStaked();
    const yieldConstant = await getYieldConstant();
    const whiteListEnabled = await getWhiteListEnabled();

    const details = {
      stakingDuration,
      cooldownPeriod,
      monthlyIncreasePercentage,
      monthsInStakingPeriod,
      startingSlashingPoint,
      maxCap,
      minCap,
      totalStaked,
      yieldConstant,
      whiteListEnabled,
    };
    setStakingContractData(details);
  }

  // useEffect(() => {
  //   fetchStakingContractData();
  // }, []);

  return (
    <StakingContractDataContext.Provider
      value={{ stakingContractData, setStakingContractData }}
    >
      {children}
    </StakingContractDataContext.Provider>
  );
};
