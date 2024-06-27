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
import { http } from "wagmi";

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

export const config = createConfig({
  connectors,
  chains: [
    polygon,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true"
      ? [hardhat, polygonAmoy]
      : []),
  ],
  transports: {
    [hardhat.id]: http(),
    [polygonAmoy.id]: http(),
    [polygon.id]: http(),
  },
  ssr: true,
});
