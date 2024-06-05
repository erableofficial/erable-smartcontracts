import { expect } from "chai";
import { ethers } from "hardhat";
import { StakingToken, Staking } from "../typechain-types/contracts";

describe("Staking Contract", function () {
  let staking: Staking;
  let token: StakingToken;
  let owner: any;
  let addr1: any;
  let addr2: any;
  const initialSupply = ethers.parseEther("10000000000000");

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy the token contract
    const Token = await ethers.getContractFactory("StakingToken");
    token = (await Token.deploy(initialSupply)) as StakingToken;
    //await token.deployed();
    const transferAmount = ethers.parseEther("1000000");
    await token.transfer(addr1.address, transferAmount);
    

    // Deploy the staking contract
    const Staking = await ethers.getContractFactory("Staking");
    staking = (await Staking.deploy(token.target, 365 * 24 * 60 * 60)) as Staking; // 1 year in seconds
    //await staking.deployed();
    const res = await token.balanceOf(staking.target);
    await token.transfer(staking.target, ethers.parseEther("1000000000"))

    console.log("res",res)

  });

  describe("Stake Function", function () {
    it("Should allow a user to stake tokens", async function () {
      const stakeAmount = ethers.parseEther("10");
      //console.log(token)

      // Approve and stake tokens
      await token.connect(addr1).approve(staking.target, stakeAmount);
      console.log("approved")
      const tx = await staking.connect(addr1).stake(stakeAmount);
      //console.log(tx)

      // Check the staked amount
      const stakeInfo = await staking.userStakes(addr1.address);
      expect(stakeInfo.amount).to.equal(stakeAmount);
    });

    it("Should emit Staked event on successful stake", async function () {
      const stakeAmount = ethers.parseEther("10");

      // Approve and stake tokens
      await token.connect(addr1).approve(staking.target, stakeAmount);
      await expect(staking.connect(addr1).stake(stakeAmount))
        .to.emit(staking, "Staked")
        .withArgs(addr1.address, stakeAmount);
    });

    it("Should update the total supply of staked tokens", async function () {
      const stakeAmount = ethers.parseEther("10");

      // Approve and stake tokens
      await token.connect(addr1).approve(staking.target, stakeAmount);
      await staking.connect(addr1).stake(stakeAmount);

      // Check the total supply
      const totalSupply = await staking.totalSupply();
      expect(totalSupply).to.equal(stakeAmount);
    });
  });
});
