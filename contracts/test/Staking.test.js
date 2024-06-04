const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Staking Contract", function () {
  let staking;
  let stakingToken;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // Deploy the ERC20 token contract
    const Token = await ethers.getContractFactory("ERC20PresetMinterPauser");
    stakingToken = await Token.deploy("Staking Token", "STK");

    await stakingToken.mint(owner.address, ethers.utils.parseEther("1000000"));
    await stakingToken.mint(addr1.address, ethers.utils.parseEther("100000"));

    // Deploy the Staking contract
    const Staking = await ethers.getContractFactory("Staking");
    staking = await Staking.deploy(stakingToken.address, 365 * 24 * 60 * 60); // 1 year duration in seconds

    // Approve staking contract to spend tokens
    await stakingToken.connect(addr1).approve(staking.address, ethers.utils.parseEther("100000"));
  });

  describe("Staking", function () {
    it("Should stake tokens", async function () {
      await staking.connect(addr1).stake(ethers.utils.parseEther("1000"));
      const stakeInfo = await staking.userStakes(addr1.address);
      expect(stakeInfo.amount).to.equal(ethers.utils.parseEther("1000"));
    });

    it("Should calculate rewards correctly", async function () {
      await staking.connect(addr1).stake(ethers.utils.parseEther("1000"));

      // Increase time by 107 days
      await ethers.provider.send("evm_increaseTime", [107 * 24 * 60 * 60]);
      await ethers.provider.send("evm_mine");

      const totalWithdrawAmount = await staking.calculateTotalWithdraw(ethers.utils.parseEther("1000"), (await ethers.provider.getBlock()).timestamp - (107 * 24 * 60 * 60));
      console.log("Total Withdraw Amount:", ethers.utils.formatEther(totalWithdrawAmount));

      // Test withdrawal
      await staking.connect(addr1).withdraw();
      const balance = await stakingToken.balanceOf(addr1.address);
      console.log("Balance after withdrawal:", ethers.utils.formatEther(balance));
    });
  });
});
