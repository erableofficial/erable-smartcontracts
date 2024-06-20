import { ethers, upgrades } from "hardhat";

async function main() {
  // console.log(ethers);
  const [deployer] = await ethers.getSigners();

  const StakingToken = await ethers.getContractFactory("StakingToken");
  const stakingToken = await StakingToken.deploy(
    ethers.parseEther("1000000000")
  );

  await stakingToken.waitForDeployment();
  console.log("StakingToken deployed to:", stakingToken.target);

  const Staking = await ethers.getContractFactory("Staking");
  const staking = await upgrades.deployProxy(
    Staking,
    [
      stakingToken.target,
      31556926n, // 1 year in seconds
      800000000000000n, // yield constant
      300n, // cooldown period in seconds
      600000000000000000n, // starting slashing point
      480000000000000000n, // monthly increase percentage
    ],
    { initializer: "initialize" }
  );

  await staking.waitForDeployment();
  console.log("Staking contract deployed to:", staking.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
