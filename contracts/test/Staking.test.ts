import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { StakingToken, Staking } from "../typechain-types/contracts";

describe("Staking Contract", function () {
  let staking: Staking;
  let token: StakingToken;
  let owner: any;
  let addr1: any;
  let addr2: any;
  const initialSupply = ethers.parseEther("1000000000000000000000000");

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy the token contract
    const Token = await ethers.getContractFactory("StakingToken");
    token = (await Token.deploy(initialSupply));
    await token.waitForDeployment();
    const transferAmount = ethers.parseEther("1000000");

    // Deploy the staking contract
    const Staking = await ethers.getContractFactory("Staking");
    staking = (await upgrades.deployProxy(Staking, [
      token.target,
      31556926n, 
      800000000000000n, 
      300n, 
      600000000000000000n,
      480000000000000000n 
    ], { initializer: 'initialize' }));
    await staking.waitForDeployment();

    await token.transfer(addr1.address, transferAmount);
    await token.transfer(addr2.address, transferAmount);
    await token.transfer(staking.target, ethers.parseEther("1000000000000000000"));
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
        expect(await staking.owner()).to.equal(owner.address);
    });

    it("Should initialize the contract with correct parameters", async function () {
        expect(await staking.stakingToken()).to.equal(token.target);
        expect(await staking.stakingDuration()).to.equal(31556926);
        expect(await staking.yieldConstant()).to.equal(800000000000000);
        expect(await staking.cooldownPeriod()).to.equal(300);
        expect(await staking.startingSlashingPoint()).to.equal(600000000000000000n);
        expect(await staking.monthlyIncreasePercentage()).to.equal(480000000000000000n);
    });
  });

  describe("Stake Function", function () {
    it("Should allow a user to stake tokens", async function () {
      const stakeAmount = ethers.parseEther("10");

      // Approve and stake tokens
      await token.connect(addr1).approve(staking.target, stakeAmount);
      await staking.connect(addr1).stake(stakeAmount);

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
      const totalSupply = await staking.totalStaked();
      expect(totalSupply).to.equal(stakeAmount);
    });

    it("Should fail if amount is less than the minimum cap", async function () {
      await staking.updateMinCap(ethers.parseEther("5"));
      const stakeAmount = ethers.parseEther("1");

      await token.connect(addr1).approve(staking.target, stakeAmount);
      await expect(staking.connect(addr1).stake(stakeAmount)).to.be.revertedWith("Amount below minimum cap");
    });

    it("Should fail if amount exceeds the maximum cap", async function () {
      await staking.updateMaxCap(ethers.parseEther("5"));
      const stakeAmount = ethers.parseEther("10");

      await token.connect(addr1).approve(staking.target, stakeAmount);
      await expect(staking.connect(addr1).stake(stakeAmount)).to.be.revertedWith("Amount exceeds maximum cap");
    });

    it("Should fail if staking is paused", async function () {
      await staking.pauseStakingFunction();
      const stakeAmount = ethers.parseEther("10");

      await token.connect(addr1).approve(staking.target, stakeAmount);
      await expect(staking.connect(addr1).stake(stakeAmount)).to.be.revertedWith("Staking is paused");
    });
    
    it("Should fail if user is not whitelisted and whitelisting is enabled", async function () {
      await staking.enableWhitelist();
      const stakeAmount = ethers.parseEther("10");

      await token.connect(addr1).approve(staking.target, stakeAmount);
      await expect(staking.connect(addr1).stake(stakeAmount)).to.be.revertedWith("Address not whitelisted");
    });

    it("Should allow staking if user is whitelisted and whitelisting is enabled", async function () {
      await staking.enableWhitelist();
      await staking.addToWhitelist(addr1.address);
      const stakeAmount = ethers.parseEther("10");

      await token.connect(addr1).approve(staking.target, stakeAmount);
      await staking.connect(addr1).stake(stakeAmount);

      const stakeInfo = await staking.userStakes(addr1.address);
      expect(stakeInfo.amount).to.equal(stakeAmount);
    });

    it("Should update the user's balance correctly after staking", async function () {
      const stakeAmount = ethers.parseEther("10");

      const userBalanceBeforeStaking = await token.balanceOf(addr1.address);

      // Approve and stake tokens
      await token.connect(addr1).approve(staking.target, stakeAmount);
      await staking.connect(addr1).stake(stakeAmount);

      // Check the user's balance
      const userBalance = await token.balanceOf(addr1.address);
      expect(userBalance).to.equal(ethers.parseEther("999990")); 
    });

    it("Should update the contract's balance correctly after staking", async function () {
      const stakeAmount = ethers.parseEther("10");

      // Approve and stake tokens
      await token.connect(addr1).approve(staking.target, stakeAmount);
      await staking.connect(addr1).stake(stakeAmount);

      // Check the contract's balance
      const contractBalance = await token.balanceOf(staking.target);
      expect(contractBalance).to.equal(ethers.parseEther("1000000000000000010")); 
    });

    it("Should correctly handle minimum and maximum cap", async function () {
      await staking.updateMinCap(ethers.parseEther("5"));
      await staking.updateMaxCap(ethers.parseEther("15"));
      const stakeAmountValid = ethers.parseEther("10");

      await token.connect(addr1).approve(staking.target, stakeAmountValid);
      await staking.connect(addr1).stake(stakeAmountValid);

      const stakeInfoValid = await staking.userStakes(addr1.address);
      expect(stakeInfoValid.amount).to.equal(stakeAmountValid);
    });
  });

  describe("Unstake Function", function () {
    it("Should allow immediate unstake if stakingDuration is infinite", async function () {
      const stakeAmount = ethers.parseEther("10");
      await token.connect(addr1).approve(staking.target, stakeAmount);
      await staking.connect(addr1).stake(stakeAmount);
      
      // Set stakingDuration to 0 (infinite)
      await staking.updateStakingDuration(0);

      const initialBalance = await token.balanceOf(addr1.address);
      const totalStakedBeforeUnstake = await staking.totalStaked();
      const contractBalanceBeforeUnstake = await token.balanceOf(staking.target);

      // Unstake
      await staking.connect(addr1).unstake();

      const finalBalance = await token.balanceOf(addr1.address);
      const totalStakedAfterUnstake = await staking.totalStaked();
      const contractBalanceAfterUnstake = await token.balanceOf(staking.target);

      expect(finalBalance).to.be.gt(initialBalance);
      expect(totalStakedAfterUnstake).to.be.lt(totalStakedBeforeUnstake);
      expect(contractBalanceAfterUnstake).to.be.lt(contractBalanceBeforeUnstake);
    });

    it("Should record unstake request if within staking period", async function () {
      const stakeAmount = ethers.parseEther("10");
      await token.connect(addr1).approve(staking.target, stakeAmount);
      await staking.connect(addr1).stake(stakeAmount);
      await expect(staking.connect(addr1).unstake())
        .to.emit(staking, "UnstakeRequested")
        .withArgs(addr1.address, ethers.parseEther("10"));
      
      const stakeInfo = await staking.userStakes(addr1.address);
      expect(stakeInfo.unstakeRequested).to.be.true;
    });

    it("Should allow unstake after staking period", async function () {
      const stakeAmount = ethers.parseEther("10");
      await token.connect(addr1).approve(staking.target, stakeAmount);
      await staking.connect(addr1).stake(stakeAmount);

      await ethers.provider.send("evm_increaseTime", [31556926]); // 1 year in seconds
      await ethers.provider.send("evm_mine", []);

      const initialBalance = await token.balanceOf(addr1.address);

      // Unstake
      await staking.connect(addr1).unstake();

      const finalBalance = await token.balanceOf(addr1.address);
      expect(finalBalance).to.be.gt(initialBalance); // Balance should increase
    });

    it("Should revert if no staked amount", async function () {
      await expect(staking.connect(addr2).unstake()).to.be.revertedWith("No staked amount to request unstake");
    });

    it("Should revert if unstake already requested", async function () {
      const stakeAmount = ethers.parseEther("10");
      await token.connect(addr1).approve(staking.target, stakeAmount);
      await staking.connect(addr1).stake(stakeAmount);
      await staking.connect(addr1).unstake();
      await expect(staking.connect(addr1).unstake()).to.be.revertedWith("Unstake already requested");
    });

    it("Should correctly update total staked after unstaking", async function () {
      const stakeAmount = ethers.parseEther("10");
      await token.connect(addr1).approve(staking.target, stakeAmount);
      await staking.connect(addr1).stake(stakeAmount);

      await ethers.provider.send("evm_increaseTime", [31556926]); 
      await ethers.provider.send("evm_mine", []);

      const initialTotalStaked = await staking.totalStaked();

      // Unstake
      await staking.connect(addr1).unstake();

      const finalTotalStaked = await staking.totalStaked();
      expect(finalTotalStaked).to.be.lt(initialTotalStaked); 
    });

    it("Should correctly transfer tokens to user after unstaking", async function () {
      const stakeAmount = ethers.parseEther("10");
      await token.connect(addr1).approve(staking.target, stakeAmount);
      await staking.connect(addr1).stake(stakeAmount);

      await ethers.provider.send("evm_increaseTime", [31556926]); 
      await ethers.provider.send("evm_mine", []);

      const initialBalance = await token.balanceOf(addr1.address);

      // Unstake
      await staking.connect(addr1).unstake();

      const finalBalance = await token.balanceOf(addr1.address);
      expect(finalBalance).to.be.gt(initialBalance); 
    });
  });

  describe("Claim Function", function () {
    it("Should allow claiming tokens after cooldown period", async function () {
      const stakeAmount = ethers.parseEther("10");
      await token.connect(addr1).approve(staking.target, stakeAmount);
      await staking.connect(addr1).stake(stakeAmount);
      
      await ethers.provider.send("evm_increaseTime", [86400]); 
      await ethers.provider.send("evm_mine", []);
      await staking.connect(addr1).unstake();

      await ethers.provider.send("evm_increaseTime", [300]); 
      await ethers.provider.send("evm_mine", []);

      const initialBalance = await token.balanceOf(addr1.address);

      // Claim
      await staking.connect(addr1).claim();

      const finalBalance = await token.balanceOf(addr1.address);
      expect(finalBalance).to.be.gt(initialBalance); 
    });

    it("Should revert if unstake not requested", async function () {
      await expect(staking.connect(addr1).claim()).to.be.revertedWith("Unstake not requested");
    });

    it("Should revert if cooldown period not over", async function () {
      const stakeAmount = ethers.parseEther("10");
      await token.connect(addr1).approve(staking.target, stakeAmount);
      await staking.connect(addr1).stake(stakeAmount);
      
      await ethers.provider.send("evm_increaseTime", [86400]); 
      await ethers.provider.send("evm_mine", []);
      await staking.connect(addr1).unstake();

      await expect(staking.connect(addr1).claim()).to.be.revertedWith("Cooldown period not over");
    });
  });

  describe("Pause/Unpause Functions", function () {
    it("Should correctly pause and unpause staking", async function () {
      await staking.pauseStakingFunction();
      expect(await staking.pauseStaking()).to.be.true;
      await staking.unpauseStaking();
      expect(await staking.pauseStaking()).to.be.false;
    });
  });

  describe("Whitelist Functions", function () {
    it("Should correctly add and remove addresses from whitelist", async function () {
      await staking.enableWhitelist();
      await staking.addToWhitelist(addr1.address);
      expect(await staking.whitelistedAddresses(addr1.address)).to.be.true;
      await staking.removeFromWhitelist(addr1.address);
      expect(await staking.whitelistedAddresses(addr1.address)).to.be.false;
    });
  });

  describe("Reward Pool Functions", function () {
    it("Should allow owner to deposit and withdraw tokens from reward pool", async function () {
      const depositAmount = ethers.parseEther("100");
      await token.connect(owner).approve(staking.target, depositAmount);
      await staking.connect(owner).depositRewardTokens(depositAmount);
      expect(await staking.rewardPool()).to.equal(depositAmount);
      await staking.connect(owner).withdrawRewardTokens(depositAmount);
      expect(await staking.rewardPool()).to.equal(0);
    });
  });

  describe("Scenario 1: Staking with stakingDuration and user unstakes before the duration is over", function () {
    beforeEach(async function () {

      await staking.updateStakingDuration(31556926);
    });

    it("Should allow unstake and claim within staking period with correct reward calculation", async function () {
      const stakeAmount = ethers.parseEther("100000");
      await token.connect(addr1).approve(staking.target, stakeAmount);
      await staking.connect(addr1).stake(stakeAmount);


      await ethers.provider.send("evm_increaseTime", [86400 * 107]); 
      await ethers.provider.send("evm_mine", []);

      const initialBalance = await token.balanceOf(addr1.address);

      // Unstake
      await staking.connect(addr1).unstake();

      await ethers.provider.send("evm_increaseTime", [300]); 
      await ethers.provider.send("evm_mine", []);

      // Claim
      await staking.connect(addr1).claim();

      const finalBalance = await token.balanceOf(addr1.address);
      const timeStaked = 86400 * 107;
      const expectedReward = (stakeAmount * (await staking.calculateYield(timeStaked))) / 1000000000000000000n;
      const expectedTax = (expectedReward * (await staking.calculateTax(timeStaked))) / 1000000000000000000n;     
      console.log("R(t) = ",stakeAmount+expectedReward-expectedTax)
      const expectedFinalBalance = (initialBalance + stakeAmount + expectedReward) - expectedTax;
      console.log("finalBalance", finalBalance)
      console.log("expectedFinalBalance", expectedFinalBalance)

      expect(finalBalance).to.be.closeTo(expectedFinalBalance, ethers.parseEther("0.1"));
    });
  });

  describe("Scenario 2: Staking with stakingDuration and user unstakes after the duration is over", function () {
    beforeEach(async function () {

      await staking.updateStakingDuration(31556926); 
    });

    it("Should allow unstake after staking period with correct reward calculation", async function () {
      const stakeAmount = ethers.parseEther("100000");
      await token.connect(addr1).approve(staking.target, stakeAmount);
      await staking.connect(addr1).stake(stakeAmount);


      await ethers.provider.send("evm_increaseTime", [31556926]); 
      await ethers.provider.send("evm_mine", []);

      const initialBalance = await token.balanceOf(addr1.address);

      // Unstake
      await staking.connect(addr1).unstake();

      const finalBalance = await token.balanceOf(addr1.address);
      const timeStaked = 31556926;
      const expectedReward = (stakeAmount * (await staking.calculateYield(timeStaked))) / 1000000000000000000n;
      const expectedFinalBalance = initialBalance + stakeAmount + expectedReward;

      expect(finalBalance).to.be.closeTo(expectedFinalBalance, ethers.parseEther("0.00001")); // Check with a small tolerance
    });
    
  });

  describe("Scenario 3: Staking with stakingDuration = 0 and user unstakes", function () {
    beforeEach(async function () {

      await staking.updateStakingDuration(0); // 1 year in seconds
    });

    it("Should allow unstake with correct reward calculation", async function () {
      const stakeAmount = ethers.parseEther("10");
      await token.connect(addr1).approve(staking.target, stakeAmount);
      await staking.connect(addr1).stake(stakeAmount);


      await ethers.provider.send("evm_increaseTime", [31556926]); // 1 year in seconds
      await ethers.provider.send("evm_mine", []);

      const initialBalance = await token.balanceOf(addr1.address);

      // Unstake
      await staking.connect(addr1).unstake();

      const finalBalance = await token.balanceOf(addr1.address);
      const timeStaked = 31556926;
      const expectedReward = (stakeAmount * (await staking.calculateYield(timeStaked))) / 1000000000000000000n;
      const expectedTax = (expectedReward * (await staking.calculateTax(timeStaked))) / 1000000000000000000n;     
      const expectedFinalBalance = (initialBalance + stakeAmount + expectedReward) - expectedTax;

      expect(finalBalance).to.be.closeTo(expectedFinalBalance, ethers.parseEther("0.00001")); // Check with a small tolerance
    });
    
  });
});