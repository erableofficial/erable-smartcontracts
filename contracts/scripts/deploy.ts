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
      deployer.address,
      stakingToken.target,
      false, // whitelistEnabled
      31536000n, // stakingDuration (1 year)
      ethers.parseEther("0.0008"), // yieldConstant
      300, // cooldownPeriod (5 minutes)
      ethers.parseEther("0.6"), // startingSlashingPoint
      ethers.parseEther("0.48"), // monthlyIncreasePercentage
      ethers.parseEther("0"), // minCap
      ethers.parseEther("0"), // maxCap
    ],
    { initializer: "initialize" }
  );

  await staking.waitForDeployment();
  console.log("Staking contract deployed to:", staking.target);

  // Fund the reward pool
  const rewardPoolAmount = ethers.parseEther("500000");
  

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
