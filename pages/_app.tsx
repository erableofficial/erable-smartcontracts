import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import "../styles/fonts.css";
import "react-toastify/dist/ReactToastify.css";
import type { AppProps } from "next/app";
import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, http } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { ToastContainer } from "react-toastify";
import { config } from "../lib/wagmi/config";
import {
  StakingContractDataProvider,
  useStakingContractData,
} from "../context/stakingContractData";
import { getStakingDuration } from "../lib/utils";
import { CurrentUserProvider } from "../context/currentUser";
import { AirdropCyclesProvider } from "../context/airdropCycles";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const client = new QueryClient();

// store.dispatch(fetchStakingContractData());

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={client}>
        <RainbowKitProvider>
          <StakingContractDataProvider>
            <AirdropCyclesProvider>
              <CurrentUserProvider>
                <ToastContainer />
                {getLayout(<Component {...pageProps} />)}
              </CurrentUserProvider>
            </AirdropCyclesProvider>
          </StakingContractDataProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default MyApp;
