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
    token = (await Token.deploy(initialSupply) as any);
    await token.waitForDeployment();
    const transferAmount = ethers.parseEther("1000000");
  
    // Deploy the staking contract
    const Staking = await ethers.getContractFactory("Staking");
    staking = (await upgrades.deployProxy(Staking, [
        owner.address,
      token.target,
      31536000n, // stakingDuration (1 year)
      ethers.parseEther("0.0008"), // yieldConstant
      300, // cooldownPeriod (5 minutes)
      ethers.parseEther("0.6"), // startingSlashingPoint
      ethers.parseEther("0.48"), // monthlyIncreasePercentage
      ethers.parseEther("0"), // minCap
      ethers.parseEther("0"), // maxCap
      false // whitelistEnabled
    ], { initializer: 'initialize' }) as any);
    await staking.waitForDeployment();
  
    // Transfer tokens to users
    await token.transfer(addr1.address, transferAmount);
    await token.transfer(addr2.address, transferAmount);
  
    // Fund the reward pool
    const rewardPoolAmount = ethers.parseEther("1000000");
    await token.transfer(owner.address, rewardPoolAmount);
    await token.connect(owner).approve(staking.target, rewardPoolAmount);
    await staking.depositRewardTokens(rewardPoolAmount);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await staking.owner()).to.equal(owner.address);
    });

    it("Should initialize the contract with correct parameters", async function () {
      expect(await staking.stakingToken()).to.equal(token.target);
      expect(await staking.stakingDuration()).to.equal(31536000);
      expect(await staking.yieldConstant()).to.equal(ethers.parseEther("0.0008"));
      expect(await staking.cooldownPeriod()).to.equal(300);
      expect(await staking.startingSlashingPoint()).to.equal(ethers.parseEther("0.6"));
      expect(await staking.monthlyIncreasePercentage()).to.equal(ethers.parseEther("0.48"));
      expect(await staking.minCap()).to.equal(ethers.parseEther("0"));
      expect(await staking.maxCap()).to.equal(ethers.parseEther("0"));
      expect(await staking.whitelistEnabled()).to.be.false;
    });
  });
  describe("Stake Function", function () {
    it("Should allow a user to stake tokens", async function () {
      await token.connect(addr1).approve(staking.target, ethers.parseEther("10"));
      await staking.connect(addr1).stake(ethers.parseEther("10"));
  
      expect(await staking.getTotalStakedForUser(addr1.address)).to.equal(ethers.parseEther("10"));
    });
  
    it("Should emit Staked event on successful stake", async function () {
      await token.connect(addr1).approve(staking.target, ethers.parseEther("10"));
  
      await expect(staking.connect(addr1).stake(ethers.parseEther("10")))
        .to.emit(staking, "Staked")
        .withArgs(addr1.address, ethers.parseEther("10"));
    });
  
    it("Should update the total supply of staked tokens", async function () {
      await token.connect(addr1).approve(staking.target, ethers.parseEther("10"));
      await staking.connect(addr1).stake(ethers.parseEther("10"));
  
      expect(await staking.totalStaked()).to.equal(ethers.parseEther("10"));
  
      await token.connect(addr2).approve(staking.target, ethers.parseEther("20"));
      await staking.connect(addr2).stake(ethers.parseEther("20"));
  
      expect(await staking.totalStaked()).to.equal(ethers.parseEther("30"));
    });
  
    it("Should fail if amount is less than the minimum cap", async function () {
        await staking.updateMinCap(ethers.parseEther("5"));
        const stakeAmount = ethers.parseEther("1");
  
        await token.connect(addr1).approve(staking.target, stakeAmount);
        await expect(staking.connect(addr1).stake(stakeAmount)).to.be.revertedWithCustomError(staking,"AmountBelowMinCap");
    });

    it("Should fail if amount is over than the maximum cap", async function () {
        await staking.updateMaxCap(ethers.parseEther("5"));
        const stakeAmount = ethers.parseEther("10");
  
        await token.connect(addr1).approve(staking.target, stakeAmount);
        await expect(staking.connect(addr1).stake(stakeAmount)).to.be.revertedWithCustomError(staking,"AmountExceedsMaxCap");
    });

    it("Should fail if user is not whitelisted and whitelisting is enabled", async function () {
        await staking.enableWhitelist();
        const stakeAmount = ethers.parseEther("10");
  
        await token.connect(addr1).approve(staking.target, stakeAmount);
        await expect(staking.connect(addr1).stake(stakeAmount)).to.be.revertedWithCustomError(staking,"NotWhitelisted");
      });
      it("Should fail if staking is paused", async function () {
        // Pause the staking functionality
        await staking.pause();
    
        const stakeAmount = ethers.parseEther("10");
    
        // Approve tokens
        await token.connect(addr1).approve(staking.target, stakeAmount);
    
        // Attempt to stake while staking is paused and expect it to revert with "EnforcedPause"
        await expect(staking.connect(addr1).stake(stakeAmount)).to.be.revertedWithCustomError(staking,"EnforcedPause");});

      it("Should allow staking if user is whitelisted and whitelisting is enabled", async function () {
        await staking.enableWhitelist();
        await staking.addToWhitelist(addr1.address);
  
        const stakeAmount = ethers.parseEther("10");
  
        await token.connect(addr1).approve(staking.target, stakeAmount);
  
        await staking.connect(addr1).stake(stakeAmount);
  
        const stakeId = 0;
  
        const stakeInfo = await staking.userStakes(addr1.address, stakeId);
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
        expect(userBalance).to.equal(userBalanceBeforeStaking - stakeAmount); 
      });
      it("Should update the contract's balance correctly after staking", async function () {
        const stakeAmount = ethers.parseEther("10");
        const contractBalanceBeforeStaking = await token.balanceOf(staking.target);
  
        // Approve and stake tokens
        await token.connect(addr1).approve(staking.target, stakeAmount);
        await staking.connect(addr1).stake(stakeAmount);
  
        // Check the contract's balance
        const contractBalance = await token.balanceOf(staking.target);
        expect(contractBalance).to.equal(stakeAmount + contractBalanceBeforeStaking);
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
      await ethers.provider.send("evm_increaseTime", [31536000]); // 1 year in seconds

      // Unstake
      await staking.connect(addr1).unstake(0);

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
      await expect(staking.connect(addr1).unstake(0))
        .to.emit(staking, "UnstakeRequested")
        .withArgs(addr1.address, stakeAmount);

      const stakeInfo = await staking.userStakes(addr1.address, 0);
      expect(stakeInfo.unstakeRequested).to.be.true;
    });

    it("Should allow unstake after staking period", async function () {
      const stakeAmount = ethers.parseEther("10");
      await token.connect(addr1).approve(staking.target, stakeAmount);
      await staking.connect(addr1).stake(stakeAmount);

      await ethers.provider.send("evm_increaseTime", [31536000]); // 1 year in seconds
      await ethers.provider.send("evm_mine", []);

      const initialBalance = await token.balanceOf(addr1.address);

      // Unstake
      await staking.connect(addr1).unstake(0);

      const finalBalance = await token.balanceOf(addr1.address);
      expect(finalBalance).to.be.gt(initialBalance); // Balance should increase
    });

    it("Should revert if no staked amount", async function () {
      await expect(staking.connect(addr2).unstake(0)).to.be.revertedWithCustomError(staking,"NoStakedAmount");
    });

    it("Should revert if unstake already requested", async function () {
      const stakeAmount = ethers.parseEther("10");
      await token.connect(addr1).approve(staking.target, stakeAmount);
      await staking.connect(addr1).stake(stakeAmount);
      await staking.connect(addr1).unstake(0);
      await expect(staking.connect(addr1).unstake(0)).to.be.revertedWithCustomError(staking,"UnstakeAlreadyRequested");
    });

    it("Should correctly update total staked after unstaking", async function () {
      const stakeAmount = ethers.parseEther("10");
      await token.connect(addr1).approve(staking.target, stakeAmount);
      await staking.connect(addr1).stake(stakeAmount);

      await ethers.provider.send("evm_increaseTime", [31536000]);
      await ethers.provider.send("evm_mine", []);

      const initialTotalStaked = await staking.totalStaked();

      // Unstake
      await staking.connect(addr1).unstake(0);

      const finalTotalStaked = await staking.totalStaked();
      expect(finalTotalStaked).to.be.lt(initialTotalStaked);
    });

    it("Should correctly transfer tokens to user after unstaking", async function () {
      const stakeAmount = ethers.parseEther("10");
      await token.connect(addr1).approve(staking.target, stakeAmount);
      await staking.connect(addr1).stake(stakeAmount);

      await ethers.provider.send("evm_increaseTime", [31536000]);
      await ethers.provider.send("evm_mine", []);

      const initialBalance = await token.balanceOf(addr1.address);

      // Unstake
      await staking.connect(addr1).unstake(0);

      const finalBalance = await token.balanceOf(addr1.address);
      expect(finalBalance).to.be.gt(initialBalance);
    });
  });
  describe("Claim function", function () {
    it("Should fail if unstake not requested", async function () {
      const stakeAmount = ethers.parseEther("1000");
      await token.connect(addr1).approve(staking.target, stakeAmount);
      await staking.connect(addr1).stake(stakeAmount);

      await ethers.provider.send("evm_increaseTime", [86400 * 50]); // 50 days
      await ethers.provider.send("evm_mine", []);

      await expect(staking.connect(addr1).claim(0)).to.be.revertedWithCustomError(staking,"UnstakeNotRequested");
    });

    it("Should fail if cooldown period not over", async function () {
      const stakeAmount = ethers.parseEther("1000");
      await token.connect(addr1).approve(staking.target, stakeAmount);
      await staking.connect(addr1).stake(stakeAmount);

      await ethers.provider.send("evm_increaseTime", [86400 * 50]); // 50 days
      await ethers.provider.send("evm_mine", []);

      await staking.connect(addr1).unstake(0);
      await expect(staking.connect(addr1).claim(0)).to.be.revertedWithCustomError(staking,"CooldownPeriodNotOver");
    });

    it("Should allow claiming after cooldown period", async function () {
      const stakeAmount = ethers.parseEther("1000");
      await token.connect(addr1).approve(staking.target, stakeAmount);
      await staking.connect(addr1).stake(stakeAmount);
      const stakeInfo = await staking.userStakes(addr1.address, 0);

      await ethers.provider.send("evm_increaseTime", [86400 * 50]); // 50 days
      await ethers.provider.send("evm_mine", []);

      await staking.connect(addr1).unstake(0);
      await ethers.provider.send("evm_increaseTime", [300]); // Cooldown period
      await ethers.provider.send("evm_mine", []);

      const initialBalance = await token.balanceOf(addr1.address);
      await staking.connect(addr1).claim(0);
      const finalBalance = await token.balanceOf(addr1.address);

      const timeStaked = 86400 * 50; // 50 days
      const expectedReward = (stakeAmount * (await staking.calculateYield(timeStaked, stakeInfo.yieldConstant,stakeInfo.stakingDuration))) / ethers.parseEther("1");
      const expectedTax = (expectedReward * (await staking.calculateTax(timeStaked, stakeInfo.monthlyIncreasePercentage, stakeInfo.startingSlashingPoint, stakeInfo.stakingDuration))) / ethers.parseEther("1");
      const expectedFinalBalance = stakeAmount + (expectedReward) - (expectedTax) + (initialBalance);

      expect(finalBalance).to.be.closeTo(expectedFinalBalance, ethers.parseEther("0.01")); // Check with a small tolerance
    });
    it("Should correctly update _totalStaked, _rewardPool, and _totalPendingRewards", async function () {
        const stakeAmount = ethers.parseEther("100000");
        await token.connect(addr1).approve(staking.target , stakeAmount);
        await staking.connect(addr1).stake(stakeAmount);
  
        // Retrieve stake info
        const stakeInfo = await staking.userStakes(addr1.address, 0);
        // Verify initial values after staking
        let totalStaked = await staking.totalStaked();
  
        let rewardPool = await staking.rewardPool();
        let totalPendingRewards = await staking.pendingRewards();
        expect(totalStaked).to.equal(stakeAmount);
        expect(totalPendingRewards).to.be.gt(0);
        await ethers.provider.send("evm_increaseTime", [30000]); 
        await ethers.provider.send("evm_mine", []);
  
        // Unstake
        await staking.connect(addr1).unstake(0);
        await ethers.provider.send("evm_increaseTime", [300]); // Wait for cooldown period
        await ethers.provider.send("evm_mine", []);
  
        // Get initial balances
        const initialBalance = await token.balanceOf(addr1.address);
        totalStaked = await staking.totalStaked();
        rewardPool = await staking.rewardPool();
        totalPendingRewards = await staking.pendingRewards();
  
  
        // Claim
        await staking.connect(addr1).claim(0);
  
        // Verify final balances and contract state
        const finalBalance = await token.balanceOf(addr1.address);
        const newTotalStaked = await staking.totalStaked();
        const newRewardPool = await staking.rewardPool();
        const newTotalPendingRewards = await staking.pendingRewards();
  
        const timeStaked = 30000n; 
        const expectedReward = (stakeAmount * (await staking.calculateYield(timeStaked, stakeInfo.yieldConstant,stakeInfo.stakingDuration))) / ethers.parseEther("1");
        const expectedTax = (expectedReward * (await staking.calculateTax(timeStaked, stakeInfo.monthlyIncreasePercentage, stakeInfo.startingSlashingPoint, stakeInfo.stakingDuration))) / ethers.parseEther("1");
        const expectedFinalBalance = initialBalance+ totalStaked + (expectedReward) - (expectedTax);
  
        // Check balances
        expect(finalBalance).to.be.closeTo(expectedFinalBalance, ethers.parseEther("0.01"));
  
        // Check _totalStaked
        expect(newTotalStaked).to.equal(totalStaked - (stakeAmount));
  
        // Check _rewardPool
        expect(newRewardPool).to.be.closeTo(rewardPool - (expectedReward - (expectedTax)), ethers.parseEther("0.01"));
  
        // Check _totalPendingRewards
        expect(newTotalPendingRewards).to.be.closeTo(totalPendingRewards - (expectedReward - (expectedTax)), ethers.parseEther("0.01"));
      });
  });
  describe("Pause/Unpause Functions", function () {
    it("Should correctly pause and unpause staking", async function () {
      await staking.pause();
      expect(await staking.paused()).to.be.true;
      await staking.unpause();
      expect(await staking.paused()).to.be.false;
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
  describe("updateStartingSlashingPoint", function () {
    it("Should allow the owner to update the starting slashing point", async function () {
      const newSlashingPoint = 700000000000000000n;
      await staking.updateStartingSlashingPoint(newSlashingPoint);
      expect(await staking.startingSlashingPoint()).to.equal(newSlashingPoint);
    });

  
  });

  describe("updateMonthlyIncreasePercentage", function () {
    it("Should allow the owner to update the monthly increase percentage", async function () {
      const newIncreasePercentage = 500000000000000000n;
      await staking.updateMonthlyIncreasePercentage(newIncreasePercentage);
      expect(await staking.monthlyIncreasePercentage()).to.equal(newIncreasePercentage);
    });

    
  });

  describe("Reward Pool Depo", function () {
    it("Should allow owner to deposit and withdraw tokens from reward pool", async function () {
      const depositAmount = ethers.parseEther("100");
      const withdrawAmount = ethers.parseEther("50");
      const rewardPool = await staking.rewardPool();
      await token.connect(owner).approve(staking.target, depositAmount);
      await staking.connect(owner).depositRewardTokens(depositAmount);
      expect(await staking.rewardPool()).to.equal(depositAmount + rewardPool);
      await staking.connect(owner).withdrawRewardTokens(withdrawAmount);
      expect(await staking.rewardPool()).to.equal(rewardPool + depositAmount - withdrawAmount );
    });
    it("Should fail to deposit 0 tokens", async function () {
      await token.connect(owner).approve(staking.target, ethers.parseEther("1000"));
      await expect(staking.connect(owner).depositRewardTokens(0)).to.be.revertedWithCustomError(staking,"CannotDepositZero");
    });
    
    
  });

  describe("pendingRewards Function", function () {
    it("Should return the correct initial pending rewards", async function () {
      const initialPendingRewards = await staking.pendingRewards();
      expect(initialPendingRewards).to.equal(0);
    });

    it("Should update pending rewards correctly after staking", async function () {
      const stakeAmount = ethers.parseEther("1000");
      await token.connect(addr1).approve(staking.target, stakeAmount);
      await staking.connect(addr1).stake(stakeAmount);

      // Calculate expected rewards
      const timeStaked = 31536000; // 1 year
      const stakeInfo = await staking.userStakes(addr1.address, 0);
      const expectedReward = (stakeAmount * (await staking.calculateYield(timeStaked, stakeInfo.yieldConstant,stakeInfo.stakingDuration))) / ethers.parseEther("1");

      const pendingRewardsAfterStake = await staking.pendingRewards();
      expect(pendingRewardsAfterStake).to.equal(expectedReward);
    });

    it("Should update pending rewards correctly after unstaking and claiming", async function () {
      const stakeAmount = ethers.parseEther("1000");
      await token.connect(addr1).approve(staking.target, stakeAmount);
      await staking.connect(addr1).stake(stakeAmount);

      // Calculate expected rewards
      const timeStaked = 31536000; // 1 year
      const stakeInfo = await staking.userStakes(addr1.address, 0);
      const expectedReward = (stakeAmount * (await staking.calculateYield(timeStaked, stakeInfo.yieldConstant,stakeInfo.stakingDuration))) / ethers.parseEther("1");

      await ethers.provider.send("evm_increaseTime", [31536000]); // 1 year
      await ethers.provider.send("evm_mine", []);

      await staking.connect(addr1).unstake(0);
      await ethers.provider.send("evm_increaseTime", [300]); // Cooldown period
      await ethers.provider.send("evm_mine", []);

      const pendingRewardsAfterClaim = await staking.pendingRewards();
      expect(pendingRewardsAfterClaim).to.equal(0);
    });
  });
  describe("Update Cooldown Period", function () {
    it("Should allow the owner to update the cooldown period", async function () {
      const initialCooldownPeriod = await staking.cooldownPeriod();
      expect(initialCooldownPeriod).to.equal(300);

      const newCooldownPeriod = 600; // 10 minutes
      await staking.updateCooldownPeriod(newCooldownPeriod);

      const updatedCooldownPeriod = await staking.cooldownPeriod();
      expect(updatedCooldownPeriod).to.equal(newCooldownPeriod);
    });

    it("Should not allow non-owner to update the cooldown period", async function () {
      const initialCooldownPeriod = await staking.cooldownPeriod();
      expect(initialCooldownPeriod).to.equal(300);

      const newCooldownPeriod = 600; // 10 minutes
      await expect(
        staking.connect(addr1).updateCooldownPeriod(newCooldownPeriod)
      ).to.be.reverted;

      const updatedCooldownPeriod = await staking.cooldownPeriod();
      expect(updatedCooldownPeriod).to.equal(initialCooldownPeriod);
    });
  });
  describe("Disable Whitelist", function () {
    it("Should allow the owner to disable the whitelist", async function () {
      // Enable whitelist first
      await staking.enableWhitelist();
      let whitelistStatus = await staking.whitelistEnabled();
      expect(whitelistStatus).to.equal(true);

      // Disable whitelist
      await staking.disableWhitelist();
      whitelistStatus = await staking.whitelistEnabled();
      expect(whitelistStatus).to.equal(false);
    });

    it("Should not allow non-owner to disable the whitelist", async function () {
      // Enable whitelist first
      await staking.enableWhitelist();
      let whitelistStatus = await staking.whitelistEnabled();
      expect(whitelistStatus).to.equal(true);

      // Try to disable whitelist as non-owner
      await expect(
        staking.connect(addr1).disableWhitelist()
      ).to.be.reverted;

      // Check that whitelist is still enabled
      whitelistStatus = await staking.whitelistEnabled();
      expect(whitelistStatus).to.equal(true);
    });
  });
  describe("Withdraw Reward Tokens", function () {
    it("Should allow the owner to withdraw reward tokens", async function () {
      const withdrawAmount = ethers.parseEther("100000");
      const initialRewardPool = await staking.rewardPool();

      await staking.withdrawRewardTokens(withdrawAmount);

      const updatedRewardPool = await staking.rewardPool();
      expect(updatedRewardPool).to.equal(initialRewardPool - (withdrawAmount));
    });

    it("Should fail if the withdrawal amount is zero", async function () {
      await expect(staking.withdrawRewardTokens(0)).to.be.revertedWithCustomError(staking,"ZeroAmount");
    });

    it("Should fail if there are not enough tokens in the reward pool after accounting for pending rewards", async function () {
      // Stake some tokens to create pending rewards
      const stakeAmount = ethers.parseEther("100000");
      await token.connect(addr1).approve(staking.target, stakeAmount);
      await staking.connect(addr1).stake(stakeAmount);
      const updatedRewardPool = await staking.rewardPool();

      const withdrawAmount = ethers.parseEther("900000") + updatedRewardPool; // More than available after pending rewards

      await expect(staking.withdrawRewardTokens(withdrawAmount)).to.be.revertedWithCustomError(staking, "InsufficientRewardPool");
    });
  });

  describe("Scenario 1: Staking with stakingDuration and user unstakes before the duration is over", function () {
    beforeEach(async function () {
      // Update staking duration to 1 year (31536000 seconds)
      await staking.updateStakingDuration(31536000);
    });
  
    it("Should allow unstake and claim within staking period with correct reward calculation", async function () {
      const stakeAmount = ethers.parseEther("100000");
      await token.connect(addr1).approve(staking.target, stakeAmount);
      await staking.connect(addr1).stake(stakeAmount);
      const stakeInfo = await staking.userStakes(addr1.address, 0);

      // Fast-forward time by 107 days
      await ethers.provider.send("evm_increaseTime", [86400 * 107]);
      await ethers.provider.send("evm_mine", []);
  
      const initialBalance = await token.balanceOf(addr1.address);
  
      // Unstake
      await staking.connect(addr1).unstake(0);
  
      // Fast-forward time by the cooldown period (300 seconds)
      await ethers.provider.send("evm_increaseTime", [300]);
      await ethers.provider.send("evm_mine", []);
  
      // Claim
      await staking.connect(addr1).claim(0);
  
      const finalBalance = await token.balanceOf(addr1.address);
      const timeStaked = 86400 * 107;
  
      // Calculate expected reward and tax using the stored parameters
      const expectedReward = (stakeAmount * (await staking.calculateYield(timeStaked, stakeInfo.yieldConstant,stakeInfo.stakingDuration))) / ethers.parseEther("1");

      const expectedTax = (expectedReward * (await staking.calculateTax(timeStaked, stakeInfo.monthlyIncreasePercentage, stakeInfo.startingSlashingPoint, stakeInfo.stakingDuration))) / ethers.parseEther("1");

      const expectedFinalBalance = initialBalance + (stakeAmount) + (expectedReward) - (expectedTax);

  
      expect(finalBalance).to.be.closeTo(expectedFinalBalance, ethers.parseEther("0.1"));
    });
  });
  describe("Scenario 2: Staking with stakingDuration and user unstakes after the duration is over", function () {
    beforeEach(async function () {
      // Update staking duration to 1 year (31536000 seconds)
      await staking.updateStakingDuration(31536000);
    });
  
    it("Should allow unstake after staking period with correct reward calculation", async function () {
      const stakeAmount = ethers.parseEther("100000");
      await token.connect(addr1).approve(staking.target, stakeAmount);
      await staking.connect(addr1).stake(stakeAmount);
      const stakeInfo = await staking.userStakes(addr1.address, 0);

      // Fast-forward time by the staking duration (1 year)
      await ethers.provider.send("evm_increaseTime", [31536000]);
      await ethers.provider.send("evm_mine", []);
  
      const initialBalance = await token.balanceOf(addr1.address);
  
      // Unstake
      await staking.connect(addr1).unstake(0);
  
      const finalBalance = await token.balanceOf(addr1.address);
      const timeStaked = 31536000;
  
      // Calculate expected reward using the stored parameters
      const expectedReward = (stakeAmount * (await staking.calculateYield(timeStaked, stakeInfo.yieldConstant,stakeInfo.stakingDuration))) / ethers.parseEther("1");
  
      // Calculate the expected final balance
      const expectedFinalBalance = initialBalance + (stakeAmount) + (expectedReward);
  
      expect(finalBalance).to.be.closeTo(expectedFinalBalance, ethers.parseEther("0.00001")); // Check with a small tolerance
    });
  });
  describe("Scenario 3: Staking with stakingDuration = 0 and user unstakes", function () {
    beforeEach(async function () {
      await staking.updateStakingDuration(0);
    });
  
    it("Should allow unstake with correct reward calculation", async function () {
      const stakeAmount = ethers.parseEther("10");
      await token.connect(addr1).approve(staking.target, stakeAmount);
      await staking.connect(addr1).stake(stakeAmount);
      const stakeInfo = await staking.userStakes(addr1.address, 0);

      await ethers.provider.send("evm_increaseTime", [31536000]); // 1 year in seconds
      await ethers.provider.send("evm_mine", []);
  
      const initialBalance = await token.balanceOf(addr1.address);
  
      // Unstake
      await staking.connect(addr1).unstake(0);
  
      const finalBalance = await token.balanceOf(addr1.address);
      const timeStaked = 31536000;
  
      // Calculate expected reward and tax using the stored parameters
      const expectedReward = (stakeAmount * (await staking.calculateYield(timeStaked, stakeInfo.yieldConstant,stakeInfo.stakingDuration))) / ethers.parseEther("1");
      const expectedTax = (expectedReward * (await staking.calculateTax(timeStaked, stakeInfo.monthlyIncreasePercentage, stakeInfo.startingSlashingPoint, stakeInfo.stakingDuration))) / ethers.parseEther("1");
      const expectedFinalBalance = initialBalance + (stakeAmount) + (expectedReward) - (expectedTax);
  
      expect(finalBalance).to.be.closeTo(expectedFinalBalance, ethers.parseEther("0.00001")); // Check with a small tolerance
    });
  });
  describe("Scenario 4: Staking with stakingDuration and user unstakes before the duration is over", function () {
    beforeEach(async function () {
      await staking.updateStakingDuration(31536000);
    });
  
    it("Should allow unstake and claim within staking period with correct reward calculation", async function () {
      const stakeAmount = ethers.parseEther("100000");
      await token.connect(addr1).approve(staking.target, stakeAmount);
      await staking.connect(addr1).stake(stakeAmount);
      const stakeInfo = await staking.userStakes(addr1.address, 0);

      await ethers.provider.send("evm_increaseTime", [86400 * 107]); // Fast-forward time by 107 days
      await ethers.provider.send("evm_mine", []);
  
      const initialBalance = await token.balanceOf(addr1.address);
  
      // Unstake
      await staking.connect(addr1).unstake(0);
  
      await ethers.provider.send("evm_increaseTime", [300]); // Fast-forward time by the cooldown period (300 seconds)
      await ethers.provider.send("evm_mine", []);
  
      // Claim
      await staking.connect(addr1).claim(0);
  
      const finalBalance = await token.balanceOf(addr1.address);
      const timeStaked = 86400 * 107;
  
      // Calculate expected reward and tax using the stored parameters
      const expectedReward = (stakeAmount * (await staking.calculateYield(timeStaked, stakeInfo.yieldConstant,stakeInfo.stakingDuration))) / ethers.parseEther("1");
      const expectedTax = (expectedReward * (await staking.calculateTax(timeStaked, stakeInfo.monthlyIncreasePercentage, stakeInfo.startingSlashingPoint, stakeInfo.stakingDuration))) / ethers.parseEther("1");
      const expectedFinalBalance = initialBalance + (stakeAmount) + (expectedReward) - (expectedTax);
  
      expect(finalBalance).to.be.closeTo(expectedFinalBalance, ethers.parseEther("0.1")); // Check with a small tolerance
    });
  });
  
  describe("Scenario 5: Staking with stakingDuration and user unstakes after the duration is over", function () {
    beforeEach(async function () {
      await staking.updateStakingDuration(31536000);
    });
  
    it("Should allow unstake after staking period with correct reward calculation", async function () {
      const stakeAmount = ethers.parseEther("100000");
      await token.connect(addr1).approve(staking.target, stakeAmount);
      await staking.connect(addr1).stake(stakeAmount);
      const stakeInfo = await staking.userStakes(addr1.address, 0);

      // Fast-forward time by the staking duration (1 year)
      await ethers.provider.send("evm_increaseTime", [31536000]);
      await ethers.provider.send("evm_mine", []);
  
      const initialBalance = await token.balanceOf(addr1.address);
  
      // Unstake
      await staking.connect(addr1).unstake(0);
  
      const finalBalance = await token.balanceOf(addr1.address);
      const timeStaked = 31536000;
  
      // Calculate expected reward using the stored parameters
      const expectedReward = (stakeAmount * (await staking.calculateYield(timeStaked, stakeInfo.yieldConstant,stakeInfo.stakingDuration))) / ethers.parseEther("1");
  
      // Calculate the expected final balance
      const expectedFinalBalance = initialBalance + (stakeAmount) + (expectedReward);
  
      expect(finalBalance).to.be.closeTo(expectedFinalBalance, ethers.parseEther("0.00001")); // Check with a small tolerance
    });
  });

  describe("Scenario 6: Staking with stakingDuration = 0 and user unstakes", function () {
    beforeEach(async function () {
      await staking.updateStakingDuration(0);
    });
  
    it("Should allow unstake with correct reward calculation", async function () {
      const stakeAmount = ethers.parseEther("10");
      await token.connect(addr1).approve(staking.target, stakeAmount);
      await staking.connect(addr1).stake(stakeAmount);
      const stakeInfo = await staking.userStakes(addr1.address, 0);

      await ethers.provider.send("evm_increaseTime", [31536000]); // 1 year in seconds
      await ethers.provider.send("evm_mine", []);
  
      const initialBalance = await token.balanceOf(addr1.address);
  
      // Unstake
      await staking.connect(addr1).unstake(0);
  
      const finalBalance = await token.balanceOf(addr1.address);
      const timeStaked = 31536000;
  
      // Calculate expected reward and tax using the stored parameters
      const expectedReward = (stakeAmount * (await staking.calculateYield(timeStaked, stakeInfo.yieldConstant,stakeInfo.stakingDuration))) / ethers.parseEther("1");
      const expectedTax = (expectedReward * (await staking.calculateTax(timeStaked, stakeInfo.monthlyIncreasePercentage, stakeInfo.startingSlashingPoint, stakeInfo.stakingDuration))) / ethers.parseEther("1");
      const expectedFinalBalance = initialBalance + (stakeAmount) + (expectedReward) - (expectedTax);
  
      expect(finalBalance).to.be.closeTo(expectedFinalBalance, ethers.parseEther("0.00001")); // Check with a small tolerance
    });
  });

  describe("Scenario 7: Multiple Stakes - First Claimed Before Duration Ends, Second Claimed After", function () {
    beforeEach(async function () {
      await staking.updateStakingDuration(31536000); // 1 year in seconds
    });
  
    it("Should handle multiple stakes with one claimed before duration ends and another after", async function () {
      const stakeAmount1 = ethers.parseEther("1000");
      const stakeAmount2 = ethers.parseEther("2000");
      await token.connect(addr1).approve(staking.target, stakeAmount1);
      await staking.connect(addr1).stake(stakeAmount1);
      const stakeInfo1 = await staking.userStakes(addr1.address, 0);

      await ethers.provider.send("evm_increaseTime", [86400 * 180]); // 180 days
      await ethers.provider.send("evm_mine", []);
    
      await token.connect(addr1).approve(staking.target, stakeAmount2);
      await staking.connect(addr1).stake(stakeAmount2);
      const stakeInfo2 = await staking.userStakes(addr1.address, 1);

      await staking.connect(addr1).unstake(0);
      await ethers.provider.send("evm_increaseTime", [300]);
      await ethers.provider.send("evm_mine", []);
  
      await staking.connect(addr1).claim(0);
  
      await ethers.provider.send("evm_increaseTime", [86400 * 200]); // 200 more days
      await ethers.provider.send("evm_mine", []);
  
      const initialBalance = await token.balanceOf(addr1.address);
      const balanceAfterFirstClaim = await token.balanceOf(addr1.address);
  
      // Unstake second stake after duration ends
      await ethers.provider.send("evm_increaseTime", [86400 * 180]); // 180 more days (now total 560 days for second stake)
      await ethers.provider.send("evm_mine", []);
  
      await staking.connect(addr1).unstake(1);
      await ethers.provider.send("evm_increaseTime", [300]);
      await ethers.provider.send("evm_mine", []);
  
      const finalBalance = await token.balanceOf(addr1.address);
  
      // Calculate expected rewards and final balance
      const timeStaked1 = 86400 * 180; // 180 days for the first stake
      const expectedReward1 = (stakeAmount1 * (await staking.calculateYield(timeStaked1, stakeInfo1.yieldConstant,stakeInfo1.stakingDuration))) / ethers.parseEther("1");
      const expectedTax1 = (expectedReward1 * (await staking.calculateTax(timeStaked1, stakeInfo1.monthlyIncreasePercentage, stakeInfo1.startingSlashingPoint, stakeInfo1.stakingDuration))) / ethers.parseEther("1");
      const expectedFinalBalance1 = initialBalance + (stakeAmount1) + (expectedReward1) - (expectedTax1);
  
      expect(balanceAfterFirstClaim).to.be.closeTo(expectedFinalBalance1, ethers.parseEther("10000"));
  
      const timeStaked2 = 86400 * 560; // 180 + 380 days
      const expectedReward2 = (stakeAmount2 * (await staking.calculateYield(timeStaked2, stakeInfo2.yieldConstant, stakeInfo2.stakingDuration))) / ethers.parseEther("1");
      const expectedFinalBalance2 = balanceAfterFirstClaim + (stakeAmount2) + (expectedReward2);
  
      expect(finalBalance).to.be.closeTo(expectedFinalBalance2, ethers.parseEther("10000"));
    });
  });

  describe("Scenario 8: Multiple Stakes and Unstake Before Duration", function () {
    beforeEach(async function () {
      await staking.updateStakingDuration(31536000); // 1 year in seconds
    });
  
    it("Should handle multiple stakes and allow unstaking before the duration", async function () {
      const stakeAmount1 = ethers.parseEther("1000");
      const stakeAmount2 = ethers.parseEther("2000");
      await token.connect(addr1).approve(staking.target, stakeAmount1);
      await staking.connect(addr1).stake(stakeAmount1);
      const stakeInfo1 = await staking.userStakes(addr1.address, 0);

      await ethers.provider.send("evm_increaseTime", [86400 * 180]); // 180 days
      await ethers.provider.send("evm_mine", []);
  
      await token.connect(addr1).approve(staking.target, stakeAmount2);
      await staking.connect(addr1).stake(stakeAmount2);
  
      // Unstake first stake before duration ends
      await staking.connect(addr1).unstake(0);
  
      await ethers.provider.send("evm_increaseTime", [400]);
      await ethers.provider.send("evm_mine", []);
  
      // Claim first stake
      await staking.connect(addr1).claim(0);
  
      const finalBalanceAfterFirstClaim = await token.balanceOf(addr1.address);
  
      await ethers.provider.send("evm_increaseTime", [86400 * 200]); // 200 more days
      await ethers.provider.send("evm_mine", []);
  
      const initialBalance = await token.balanceOf(addr1.address);
  
      const timeStaked1 = 86400 * 380; // 180 + 200 days
      const expectedReward1 = (stakeAmount1 * (await staking.calculateYield(timeStaked1, stakeInfo1.yieldConstant, stakeInfo1.stakingDuration))) / ethers.parseEther("1");
      const expectedTax1 = (expectedReward1 * (await staking.calculateTax(timeStaked1, stakeInfo1.monthlyIncreasePercentage, stakeInfo1.startingSlashingPoint, stakeInfo1.stakingDuration))) / ethers.parseEther("1");
      const expectedFinalBalance1 = initialBalance + (stakeAmount1) + (expectedReward1) - (expectedTax1);
  
      expect(finalBalanceAfterFirstClaim).to.be.closeTo(expectedFinalBalance1, ethers.parseEther("10000"));
    });
  });
  describe("Scenario 9: Multiple Stakes and Unstake After Duration", function () {
    beforeEach(async function () {
      await staking.updateStakingDuration(31536000); // 1 year in seconds
    });
  
    it("Should handle multiple stakes and allow unstaking after the duration", async function () {
      const stakeAmount1 = ethers.parseEther("1000");
      const stakeAmount2 = ethers.parseEther("2000");
      await token.connect(addr1).approve(staking.target, stakeAmount1);
      await staking.connect(addr1).stake(stakeAmount1);
  
      await ethers.provider.send("evm_increaseTime", [86400 * 180]); // 180 days
      await ethers.provider.send("evm_mine", []);
  
      await token.connect(addr1).approve(staking.target, stakeAmount2);
      await staking.connect(addr1).stake(stakeAmount2);
      const stakeInfo2 = await staking.userStakes(addr1.address, 1);

      await ethers.provider.send("evm_increaseTime", [86400 * 400]); // 400 more days
      await ethers.provider.send("evm_mine", []);
  
      const initialBalance = await token.balanceOf(addr1.address);
  
      // Unstake second stake after duration ends
      await staking.connect(addr1).unstake(1);
  
      await ethers.provider.send("evm_increaseTime", [300]);
      await ethers.provider.send("evm_mine", []);
  
      const finalBalance = await token.balanceOf(addr1.address);
      const timeStaked2 = 86400 * 580; // 180 + 400 days
      const expectedReward2 = (stakeAmount2 * (await staking.calculateYield(timeStaked2, stakeInfo2.yieldConstant, stakeInfo2.stakingDuration))) / ethers.parseEther("1");
      const expectedFinalBalance2 = initialBalance + (stakeAmount2) + (expectedReward2);
  
      expect(finalBalance).to.be.closeTo(expectedFinalBalance2, ethers.parseEther("0.1"));
    });
  
    it("should only increase balance after cooldown period ends", async function () {
      const stakeAmount = ethers.parseEther("1000");
      const firstBalance = await token.balanceOf(addr1.address);
  
      // User stakes tokens
      await token.connect(owner).transfer(addr1.address, stakeAmount);
      await token.connect(addr1).approve(staking.target, stakeAmount);
      await staking.connect(addr1).stake(stakeAmount);
  
      // Increase time to half the staking duration
      await ethers.provider.send("evm_increaseTime", [31536000 / 2]);
      await ethers.provider.send("evm_mine", []);
  
      // Request to unstake before the staking period ends
      await staking.connect(addr1).unstake(0);
  
      // Verify that the user's balance does not increase immediately
      let initialBalance = await token.balanceOf(addr1.address);
      expect(initialBalance - (firstBalance)).to.equal(0);
  
      // Increase time to end of cooldown period
      await ethers.provider.send("evm_increaseTime", [300]);
      await ethers.provider.send("evm_mine", []);
  
      // User claims after the cooldown period
      await staking.connect(addr1).claim(0);
  
      // Verify that the user's balance has increased after claiming
      let finalBalance = await token.balanceOf(addr1.address);
      expect(finalBalance).to.be.gt(0);
    });
  
    it("should directly get rewards without cooldown period if unstaked after staking duration", async function () {
      const stakeAmount = ethers.parseEther("1000");
  
      // User stakes tokens
      await token.connect(owner).transfer(addr1.address, stakeAmount);
      await token.connect(addr1).approve(staking.target, stakeAmount);
      await staking.connect(addr1).stake(stakeAmount);
  
      // Increase time to end of staking duration
      await ethers.provider.send("evm_increaseTime", [31536000 + 1]); // +1 to ensure it's after the duration
      await ethers.provider.send("evm_mine", []);
  
      let initialBalance = await token.balanceOf(addr1.address);
  
      // Unstake after staking duration ends
      await staking.connect(addr1).unstake(0);
  
      // User should be able to claim immediately without cooldown
      let finalBalance = await token.balanceOf(addr1.address);
  
      // Verify that the user's balance has increased after claiming
      expect(finalBalance).to.be.gt(initialBalance);
    });
  });
  
  describe("Scenario 10: Calculate rewards on 1st January 2025", function () {
    beforeEach(async function () {
      // Any specific setup can go here
    });
  
    it("Should calculate rewards on 1st January 2025", async function () {
      const stakeAmount = ethers.parseEther("100000");
  
      // User stakes tokens on 1st July 2024
      await token.connect(owner).transfer(addr1.address, stakeAmount);
      await token.connect(addr1).approve(staking.target, stakeAmount);
      await staking.connect(addr1).stake(stakeAmount);
      const stakeInfo = await staking.userStakes(addr1.address, 0);

      // Increase time to 1st January 2025 (184 days later)
      const daysPassed = 184;
      await ethers.provider.send("evm_increaseTime", [86400 * daysPassed]); // 184 days
      await ethers.provider.send("evm_mine", []);
  
      // Calculate rewards accumulation displayed on frontend
      const timeStaked = 86400 * daysPassed;
      const expectedReward = (stakeAmount * (await staking.calculateYield(timeStaked, stakeInfo.yieldConstant, stakeInfo.stakingDuration))) / ethers.parseEther("1");
      console.log(expectedReward)
  
      const expectedRewardDisplayed = ethers.parseEther("2927"); // Expected rewards accumulation displayed
      console.log(expectedRewardDisplayed)
      expect(expectedReward).to.be.closeTo(expectedRewardDisplayed, ethers.parseEther("1000")); // Allow small tolerance
    });
  });
  
  
  
  describe("Scenario 11: Unstake on 1st January 2025 and calculate actual rewards after slashing tax", function () {
    beforeEach(async function () {
      // Any specific setup can go here
    });
  
    it("Should unstake on 1st January 2025 and calculate actual rewards after slashing tax", async function () {
      const stakeAmount = ethers.parseEther("100000");
  
      // User stakes tokens on 1st July 2024
      await token.connect(owner).transfer(addr1.address, stakeAmount);
      await token.connect(addr1).approve(staking.target, stakeAmount);
      await staking.connect(addr1).stake(stakeAmount);
      const stakeInfo = await staking.userStakes(addr1.address, 0);

      // Increase time to 1st January 2025 (184 days later)
      const daysPassed = 184;
      await ethers.provider.send("evm_increaseTime", [86400 * daysPassed]); // 184 days
      await ethers.provider.send("evm_mine", []);
  
      // Unstake before the end of the program
      await staking.connect(addr1).unstake(0);
      await ethers.provider.send("evm_increaseTime", [300]); // Wait for cooldown period
      await ethers.provider.send("evm_mine", []);
  
      // Claim the rewards
      const initialBalance = await token.balanceOf(addr1.address);
      await staking.connect(addr1).claim(0);
      const finalBalance = await token.balanceOf(addr1.address);
  
      // Calculate actual rewards after slashing tax
      const timeStaked = 86400 * daysPassed;
      const expectedReward = (stakeAmount * (await staking.calculateYield(timeStaked, stakeInfo.yieldConstant, stakeInfo.stakingDuration))) / ethers.parseEther("1");
      const expectedTax = (expectedReward * (await staking.calculateTax(timeStaked, stakeInfo.monthlyIncreasePercentage, stakeInfo.startingSlashingPoint, stakeInfo.stakingDuration))) / ethers.parseEther("1");
      const expectedRewardAfterTax = expectedReward - expectedTax;
      const actualReward = finalBalance - (initialBalance) - (stakeAmount);
      console.log("expectedReward", expectedReward)
      console.log("expectedTax", expectedTax)

      console.log("expectedRewardAfterTax", expectedRewardAfterTax)

      console.log("actualReward", actualReward)


  
      expect(actualReward).to.be.closeTo(expectedRewardAfterTax, ethers.parseEther("1000")); // Allow small tolerance
    });
    it("Should unstake on 1st January 2025 and calculate actual rewards after slashing tax", async function () {
        const stakeAmount = ethers.parseEther("100000");
    
        // User stakes tokens on 1st July 2024
        await token.connect(owner).transfer(addr1.address, stakeAmount);
        await token.connect(addr1).approve(staking.target, stakeAmount);
        await staking.connect(addr1).stake(stakeAmount);
        const stakeInfo = await staking.userStakes(addr1.address, 0);
  
        // Increase time to 1st January 2025 (184 days later)
        const daysPassed = 184;
        await ethers.provider.send("evm_increaseTime", [86400 * daysPassed]); // 184 days
        await ethers.provider.send("evm_mine", []);
    
        // Unstake before the end of the program
        await staking.connect(addr1).unstake(0);
        await ethers.provider.send("evm_increaseTime", [300]); // Wait for cooldown period
        await ethers.provider.send("evm_mine", []);
    
        // Claim the rewards
        const initialBalance = await token.balanceOf(addr1.address);
        await staking.connect(addr1).claim(0);
        const finalBalance = await token.balanceOf(addr1.address);
    
        // Calculate actual rewards after slashing tax
        const timeStaked = 86400 * daysPassed;
        const expectedReward = (stakeAmount * (await staking.calculateYield(timeStaked, stakeInfo.yieldConstant,stakeInfo.stakingDuration))) / ethers.parseEther("1");
        const expectedTax = (expectedReward * (await staking.calculateTax(timeStaked, stakeInfo.monthlyIncreasePercentage, stakeInfo.startingSlashingPoint, stakeInfo.stakingDuration))) / ethers.parseEther("1");
        const expectedRewardAfterTax = expectedReward - expectedTax;
        const actualReward = finalBalance - initialBalance - stakeAmount;
        const expectedFinalBalance = ethers.parseEther("101879");
    
        // Log for debugging
        console.log("expectedReward:", expectedReward.toString());
        console.log("expectedTax:", expectedTax.toString());
        console.log("expectedRewardAfterTax:", expectedRewardAfterTax.toString());
        console.log("actualReward:", actualReward.toString());
        console.log("finalBalance:", finalBalance.toString());
    
        // Check if the final balance is as expected
        expect(finalBalance).to.be.closeTo(initialBalance + expectedFinalBalance, ethers.parseEther("1")); // Allow small tolerance
      });
  });
  
  describe("Scenario 12: Claim total tokens on 1st July 2025", function () {
    beforeEach(async function () {
      // Any specific setup can go here
    });
  
    it("Should claim total tokens on 1st July 2025", async function () {
      const stakeAmount = ethers.parseEther("100000");
  
      // User stakes tokens on 1st July 2024
      await token.connect(owner).transfer(addr1.address, stakeAmount);
      await token.connect(addr1).approve(staking.target, stakeAmount);
      await staking.connect(addr1).stake(stakeAmount);
      const stakeInfo = await staking.userStakes(addr1.address, 0);

      // Increase time to 1st July 2025 (1 year later)
      await ethers.provider.send("evm_increaseTime", [31536000]); // 365 days
      await ethers.provider.send("evm_mine", []);
  
      const initialBalance = await token.balanceOf(addr1.address);
  
      // Unstake after the program ends
      await staking.connect(addr1).unstake(0);
  
      // Claim the rewards immediately without cooldown
      const finalBalance = await token.balanceOf(addr1.address);
  
      // Calculate total tokens claimable
      const expectedReward = (stakeAmount * (await staking.calculateYield(31536000, stakeInfo.yieldConstant,stakeInfo.stakingDuration))) / ethers.parseEther("1");
      const expectedTotalTokens = initialBalance + (stakeAmount) + (expectedReward);
  
      expect(finalBalance).to.be.closeTo(expectedTotalTokens, ethers.parseEther("10000")); // Allow small tolerance
      console.log('finalBalance',finalBalance)
      console.log('expectedTotalTokens',expectedTotalTokens)
    });
  });
  describe("Scenario 13: Staking before parameter updates and ensuring calculations are correct", function () {
    beforeEach(async function () {
      // Any specific setup can go here
    });
  
    it("Should handle staking before parameter updates correctly", async function () {
      const stakeAmount = ethers.parseEther("1000");
      const initialBalance = await token.balanceOf(addr1.address);
      await token.connect(addr1).approve(staking.target, stakeAmount);
      await staking.connect(addr1).stake(stakeAmount);
      const stakeInfo = await staking.userStakes(addr1.address, 0);

      // Increase time to simulate passage of time after staking
      await ethers.provider.send("evm_increaseTime", [86400 * 100]); // 100 days
      await ethers.provider.send("evm_mine", []);
  
      // Store initial parameters for comparison
      const initialStakingDuration = await staking.stakingDuration();
      const initialYieldConstant = await staking.yieldConstant();
      const initialStartingSlashingPoint = await staking.startingSlashingPoint();
      const initialMonthlyIncreasePercentage = await staking.monthlyIncreasePercentage();
  
      // Update staking parameters
      await staking.updateStakingDuration(86400 * 365); // 1 year
      await staking.updateYieldConstant(ethers.parseEther("0.9"));
      await staking.updateStartingSlashingPoint(ethers.parseEther("0.7"));
      await staking.updateMonthlyIncreasePercentage(ethers.parseEther("0.5"));
  
      // Unstake and claim after cooldown
      await staking.connect(addr1).unstake(0);
      await ethers.provider.send("evm_increaseTime", [300]); // Cooldown period
      await ethers.provider.send("evm_mine", []);
      await staking.connect(addr1).claim(0);
  
      // Verify that calculations used initial parameters stored in user stake info
      const timeStaked = 86400 * 100; // 100 days
      const expectedReward = (stakeAmount * (await staking.calculateYield(timeStaked, stakeInfo.yieldConstant,stakeInfo.stakingDuration))) / ethers.parseEther("1");
      const expectedTax = (expectedReward * (await staking.calculateTax(timeStaked, stakeInfo.monthlyIncreasePercentage, stakeInfo.startingSlashingPoint, stakeInfo.stakingDuration))) / ethers.parseEther("1");
      const expectedFinalBalance = initialBalance + (expectedReward) - (expectedTax);
  
      const finalBalance = await token.balanceOf(addr1.address);
      expect(finalBalance).to.be.closeTo(expectedFinalBalance, ethers.parseEther("0.01")); // Check with a small tolerance
    });
  });
  
});
/*
1000000004174815172771005
1000000004259340075117411

1101879483706151274175678
1101879000000000000000000
*/