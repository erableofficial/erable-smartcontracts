import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const MyToken = await ethers.getContractFactory("StakingToken");
  const myToken = await MyToken.deploy(ethers.parseEther("1000"));

  console.log("MyToken deployed to:", myToken.target);

  const Staking = await ethers.getContractFactory("Staking");
  const staking = await Staking.deploy();

  console.log("Staking contract deployed to: ", staking.target);

  // call intialize function on staking contract
  await staking.initialize(
    myToken.target,
    365 * 24 * 60 * 60, // stakingDuration: 1 year (in seconds)
    50, // yieldConstant: A starting yield
    30 * 24 * 60 * 60, // cooldownPeriod: 30 days (in seconds)
    5, // startingSlashingPoint: 5% penalty
    2 // monthlyIncreasePercentage: 2% penalty increase
  );
  console.log("Staking contract initialized");

  // Approve Staking contract to spend tokens
  await myToken.approve(staking.target, ethers.parseEther("1000"));

  console.log("Approved staking contract to spend tokens");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
