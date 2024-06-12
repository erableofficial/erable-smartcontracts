import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const MyToken = await ethers.getContractFactory("StakingToken");
  const myToken = await MyToken.deploy(ethers.parseEther("1000")); 

  console.log("MyToken deployed to:", myToken.target);

  const Staking = await ethers.getContractFactory("Staking");
  const staking = await Staking.deploy(myToken.target, 365 * 24 * 60 * 60);

  console.log("Staking contract deployed to: ", staking.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
