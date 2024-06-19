# Staking Project

## Project Overview

### Purpose
The Staking Smart Contract for the $CLAPv2 aims to incentivize holders to stake their tokens for a specified duration (1 year for the first program), with yields increasing as the staking duration approaches maturity. Early unstakers will incur a slashing tax on their rewards, and a cooldown period is enforced for unstaking.

### Features
- **Stake Tokens**: Users can stake their tokens to earn rewards.
- **Unstake Tokens**: Users can request to unstake tokens early, incurring a tax on rewards and waiting through a cooldown period.
- **Claim Rewards**: Users can claim their tokens and rewards after the cooldown period.
- **Whitelist Functionality**: Option to enable and manage a whitelist of addresses allowed to stake.
- **Pause/Unpause**: Owner can pause and unpause the contract functionalities.
- **Reward Pool Management**: Owner can deposit and withdraw tokens from the reward pool.

### Business Logic
The contract incentivizes token holders to stake their tokens for up to one year. Rewards increase as the staking period approaches maturity. If a user unstakes early, they incur a slashing tax on their rewards. A 7-day cooldown period is enforced for early unstakers.

### Use Cases
1. **Staking Tokens**: A user stakes tokens to earn rewards over time.
2. **Unstaking Tokens**: A user requests to unstake tokens early, accepts a slashing tax, and waits for the cooldown period.
3. **Claiming Rewards**: A user claims tokens and rewards after the cooldown period.
4. **Managing Whitelist**: The owner adds or removes users from the whitelist.
5. **Managing Reward Pool**: The owner deposits or withdraws tokens from the reward pool.

### Roles and Authorizations
- **User**: Can stake, unstake, and claim rewards.
- **Owner**: Can pause/unpause the contract, manage staking parameters, whitelist, and reward pool.

## Technical Requirements

### Project Components
- **Contracts**: 
  - `Staking`: Main contract handling staking logic.
  - `StakingToken`: ERC20 token used for staking.
- **Key Functions**:
  - `stake()`: Allows users to stake tokens.
  - `unstake()`: Allows users to request unstake.
  - `claim()`: Allows users to claim staked tokens and rewards.
  - `pause()` and `unpause()`: Allows the owner to pause/unpause the contract.
  - `addToWhitelist()` and `removeFromWhitelist()`: Allows the owner to manage the whitelist.
  - `depositRewardTokens()` and `withdrawRewardTokens()`: Allows the owner to manage the reward pool.
- **State Variables**:
  - `stakingToken`: ERC20 token used for staking.
  - `stakingDuration`: Duration for which tokens need to be staked.
  - `yieldConstant`: Constant used for yield calculation.
  - `cooldownPeriod`: Period after which unstaked tokens can be claimed.
  - `whitelistEnabled`: Indicates if whitelisting is enabled.
  - `userStakes`: Mapping of user stakes.
  - `_totalStaked`: Total amount of tokens staked.
  - `_rewardPool`: Total amount of reward tokens available.

### Technologies Used
- **Solidity**: Smart contract development.
- **OpenZeppelin**: Secure smart contract library.
- **Hardhat**: Ethereum development environment.
- **Ethers.js**: Library for interacting with Ethereum.

### Architectural Design
- **Frontend**: User interface for interacting with the staking contract.
- **Backend**: Smart contracts deployed on the Polygon Blockchain.

## Deployment Steps

### Prerequisites

1. **Node.js and npm**: Ensure you have Node.js and npm installed.
2. **Hardhat**: Ensure Hardhat is installed.

### Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Dar-Blockchain/erable
   cd staking
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory and add your private key and Polygonscan API key:
   ```bash
   PRIVATE_KEY=<your-private-key>
   POLYGONSCAN_API_KEY=<your-polygonscan-api-key>
   ```

### Hardhat Configuration

Ensure your `hardhat.config.ts` file contains the following configuration:

```typescript
import { HardhatUserConfig } from "hardhat/config";
import '@openzeppelin/hardhat-upgrades';
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
import 'solidity-coverage';

dotenv.config();

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    polygon_amoy: {
      url: "https://rpc-amoy.polygon.technology",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: process.env.POLYGONSCAN_API_KEY || "",
  },
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};

export default config;
```

### Deployment

1. **Compile the Contracts**:
   ```bash
   npx hardhat compile
   ```

2. **Deploy the Contracts**:
   Create a deployment script (e.g., `scripts/deploy.ts`) with the following content:

   ```typescript
   import { ethers } from "hardhat";

   async function main() {
     const [deployer] = await ethers.getSigners();

     console.log("Deploying contracts with the account:", deployer.address);
     console.log("Account balance:", (await deployer.getBalance()).toString());

     const StakingToken = await ethers.getContractFactory("StakingToken");
     const stakingToken = await StakingToken.deploy(ethers.utils.parseEther("1000000000"));

     await stakingToken.deployed();
     console.log("StakingToken deployed to:", stakingToken.address);

     const Staking = await ethers.getContractFactory("Staking");
     const staking = await upgrades.deployProxy(Staking, [
       stakingToken.address,
       31556926, // 1 year in seconds
       800000000000000, // yield constant
       300, // cooldown period in seconds
       600000000000000000, // starting slashing point
       480000000000000000 // monthly increase percentage
     ], { initializer: 'initialize' });

     await staking.deployed();
     console.log("Staking contract deployed to:", staking.address);
   }

   main().catch((error) => {
     console.error(error);
     process.exitCode = 1;
   });
   ```

3. **Run the Deployment Script**:
   ```bash
   npx hardhat run scripts/deploy.ts --network polygon_amoy
   ```

### Testing

1. **Run Tests**:
   ```bash
   npx hardhat test
   ```

2. **Run Coverage**:
   ```bash
   npx hardhat coverage
   ```
