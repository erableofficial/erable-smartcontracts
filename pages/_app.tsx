import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import "../styles/fonts.css";
import 'react-toastify/dist/ReactToastify.css';
import type { AppProps } from "next/app";


import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, http } from "wagmi";
import { defineChain } from "viem";
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  sepolia,
  polygonAmoy,
} from "wagmi/chains";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  rainbowWallet,
  walletConnectWallet,
  braveWallet,
  metaMaskWallet,
  trustWallet,
  coinbaseWallet,
  ledgerWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { createConfig } from "wagmi";
import { ToastContainer } from "react-toastify";


const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [
        rainbowWallet,
        walletConnectWallet,
        braveWallet,
        metaMaskWallet,
        trustWallet,
        coinbaseWallet,
        ledgerWallet,
      ],
    },
  ],
  {
    appName: "RainbowKit App",
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "",
  }
);

const hardhat = /*#__PURE__*/ defineChain({
  id: 1_337,
  name: "Hardhat",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: { http: ["http://127.0.0.1:8545"] },
  },
});

const config = createConfig({
  connectors,
  chains: [
    hardhat,
    polygonAmoy,
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" ? [sepolia] : []),
  ],
  transports: {
    [hardhat.id]: http(),
    [polygonAmoy.id]: http(),
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    137: http(),
    10: http(),
    42161: http(),
    8453: http(),
  },
  ssr: true,
});

const client = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={client}>
        <RainbowKitProvider>
          <ToastContainer />
          <Component {...pageProps} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default MyApp;
