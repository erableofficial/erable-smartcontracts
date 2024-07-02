import { ethers, upgrades } from "hardhat";

async function main() {
  // console.log(ethers);
  const [deployer] = await ethers.getSigners();

  // deploying airdrop smart contract
  const MerkleAirdrop = await ethers.getContractFactory("MerkleAirdrop");
  const merkleAirdrop = await MerkleAirdrop.deploy(
    "0x0AF364d9F6a18ad6A12900BD8c88536e33B4a8f9"
  );

  await merkleAirdrop.waitForDeployment();
  console.log("MerkleAirdrop contract deployed to:", merkleAirdrop.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
