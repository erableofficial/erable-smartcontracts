import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const MyToken = await ethers.getContractFactory("StakingToken");
  const myToken = await MyToken.deploy(ethers.parseEther("8000"));

  console.log("MyToken deployed to:", myToken.target);

  const Staking = await ethers.getContractFactory("Staking");
  const staking = await Staking.deploy();

  console.log("Staking contract deployed to: ", staking.target);

  // call intialize function on staking contract
  await staking.initialize(
    myToken.target,
    31556926n, // 1 year in seconds
    800000000000000n, // yield constant
    60, // cooldown period in seconds
    600000000000000000n, // starting slashing point
    480000000000000000n // monthly increase percentage
  );
  console.log("Staking contract initialized");

  // Approve Staking contract to spend tokens
  await myToken.approve(staking.target, ethers.parseEther("8000"));

  console.log("Approved staking contract to spend tokens");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
