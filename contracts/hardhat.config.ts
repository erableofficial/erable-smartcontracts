import { HardhatUserConfig } from "hardhat/config";
import "@openzeppelin/hardhat-upgrades";
// import "@nomiclabs/hardhat-waffle";

import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
import "solidity-coverage";

dotenv.config();

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    hardhat: {
      chainId: 1337,
    },
    ethereum: {
      url: `https://mainnet.infura.io/v3/d2bad00af6094fc5a92fb2ff20518cf0`    },
    polygon_amoy: {
      url: "https://rpc-amoy.polygon.technology",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: "4CVM5673I8HISYU9M5JHC4IWS145EB1AZ3",
  },
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      paths: {
        sources: "./contracts",
        tests: "./test",
        cache: "./cache",
        artifacts: "./artifacts"
      }
    },
  },
};

export default config;
