import { createContext, useContext, useState } from "react";
import { Address } from "viem";

interface IAirdropCycle {
  cycle: string;
  address: Address;
  amount: string;
  created_at?: string;
}

interface IAirdropCycleContext {
  airdropCycles: IAirdropCycle[];
  setAirdropCycles: (airdropCycles: IAirdropCycle[]) => void;
}

const airdropCyclesContext = createContext<IAirdropCycleContext | undefined>(
  undefined
);

export const useAirdropCycles = (): IAirdropCycleContext => {
  const context = useContext(airdropCyclesContext);

  if (!context) {
    throw new Error(
      "useAirdropCycles must be used within a AirdropCyclesProvider"
    );
  }

  return context;
};

export const AirdropCyclesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [airdropCycles, setAirdropCycles] = useState<IAirdropCycle[]>([]);

  return (
    <airdropCyclesContext.Provider
      value={{
        airdropCycles,
        setAirdropCycles,
      }}
    >
      {children}
    </airdropCyclesContext.Provider>
  );
};
