import React, { ReactNode, createContext, useContext, useState } from "react";
import { Account, Address, Chain } from "viem";
import { Connector } from "wagmi";

interface ICurrentUser {
  address: Address | undefined;
  account: Account | undefined;
  chain: Chain | undefined;
  connector: Connector | undefined;
}

interface ICurrentUserType {
  currentUser: ICurrentUser;
  setCurrentUser: (currentUser: ICurrentUser) => void;
}

const currentUserContext = createContext<ICurrentUserType | undefined>(
  undefined
);

export const useCurrentUser = (): ICurrentUserType => {
  const context = useContext(currentUserContext);

  if (!context) {
    throw new Error("useCurrentUser must be used within a CurrentUserProvider");
  }

  return context;
};

export const CurrentUserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<ICurrentUser>({
    address: undefined,
    account: undefined,
    chain: undefined,
    connector: undefined,
  });

  return (
    <currentUserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </currentUserContext.Provider>
  );
};
