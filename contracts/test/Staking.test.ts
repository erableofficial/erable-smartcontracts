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
    token = (await Token.deploy(initialSupply)) as StakingToken;
    await token.waitForDeployment();
    const transferAmount = ethers.parseEther("1000000");
  
    // Deploy the staking contract
    const Staking = await ethers.getContractFactory("Staking");
    staking = (await upgrades.deployProxy(Staking, [
      token.target,
      31556926n, // 1 year in seconds
      800000000000000n, // yield constant
      300, // cooldown period in seconds
      600000000000000000n, // starting slashing point
      480000000000000000n // monthly increase percentage
    ], { initializer: 'initialize' })) as Staking;
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
      expect(await staking.stakingDuration()).to.equal(31556926);
      expect(await staking.yieldConstant()).to.equal(800000000000000n);
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

      const stakeId = 0;

      // Check the staked amount
      const stakeInfo = await staking.userStakes(addr1.address, stakeId);
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
    /*
    it("Should fail if staking is paused", async function () {
      // Pause the staking functionality
      await staking.pause();
  
      const stakeAmount = ethers.parseEther("10");
  
      // Approve tokens
      await token.connect(addr1).approve(staking.target, stakeAmount);
  
      // Attempt to stake while staking is paused and expect it to revert with "EnforcedPause"
      await expect(staking.connect(addr1).stake(stakeAmount)).to.be.revertedWith("EnforcedPause");
    });
*/
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

    it("Should correctly handle minimum and maximum cap", async function () {
      await staking.updateMinCap(ethers.parseEther("5"));
      await staking.updateMaxCap(ethers.parseEther("15"));
      const stakeAmountValid = ethers.parseEther("10");

      await token.connect(addr1).approve(staking.target, stakeAmountValid);
      await staking.connect(addr1).stake(stakeAmountValid);

      const stakeId = 0;

      const stakeInfoValid = await staking.userStakes(addr1.address, stakeId);
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

      await ethers.provider.send("evm_increaseTime", [31556926]); // 1 year in seconds
      await ethers.provider.send("evm_mine", []);

      const initialBalance = await token.balanceOf(addr1.address);

      // Unstake
      await staking.connect(addr1).unstake(0);

      const finalBalance = await token.balanceOf(addr1.address);
      expect(finalBalance).to.be.gt(initialBalance); // Balance should increase
    });

    it("Should revert if no staked amount", async function () {
      await expect(staking.connect(addr2).unstake(0)).to.be.revertedWith("No staked amount to request unstake");
    });

    it("Should revert if unstake already requested", async function () {
      const stakeAmount = ethers.parseEther("10");
      await token.connect(addr1).approve(staking.target, stakeAmount);
      await staking.connect(addr1).stake(stakeAmount);
      await staking.connect(addr1).unstake(0);
      await expect(staking.connect(addr1).unstake(0)).to.be.revertedWith("Unstake already requested");
    });

    it("Should correctly update total staked after unstaking", async function () {
      const stakeAmount = ethers.parseEther("10");
      await token.connect(addr1).approve(staking.target, stakeAmount);
      await staking.connect(addr1).stake(stakeAmount);

      await ethers.provider.send("evm_increaseTime", [31556926]);
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

      await ethers.provider.send("evm_increaseTime", [31556926]);
      await ethers.provider.send("evm_mine", []);

      const initialBalance = await token.balanceOf(addr1.address);

      // Unstake
      await staking.connect(addr1).unstake(0);

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
      await staking.connect(addr1).unstake(0);

      await ethers.provider.send("evm_increaseTime", [300]);
      await ethers.provider.send("evm_mine", []);

      const initialBalance = await token.balanceOf(addr1.address);

      // Claim
      await staking.connect(addr1).claim(0);

      const finalBalance = await token.balanceOf(addr1.address);
      expect(finalBalance).to.be.gt(initialBalance);
    });

    it("Should revert if unstake not requested", async function () {
      await expect(staking.connect(addr1).claim(0)).to.be.revertedWith("Unstake not requested");
    });

    it("Should revert if cooldown period not over", async function () {
      const stakeAmount = ethers.parseEther("10");
      await token.connect(addr1).approve(staking.target, stakeAmount);
      await staking.connect(addr1).stake(stakeAmount);

      await ethers.provider.send("evm_increaseTime", [86400]);
      await ethers.provider.send("evm_mine", []);
      await staking.connect(addr1).unstake(0);

      await expect(staking.connect(addr1).claim(0)).to.be.revertedWith("Cooldown period not over");
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
      await expect(staking.connect(owner).depositRewardTokens(0)).to.be.revertedWith("Cannot deposit 0");
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
      await staking.connect(addr1).unstake(0);

      await ethers.provider.send("evm_increaseTime", [300]);
      await ethers.provider.send("evm_mine", []);

      // Claim
      await staking.connect(addr1).claim(0);

      const finalBalance = await token.balanceOf(addr1.address);
      const timeStaked = 86400 * 107;
      const expectedReward = (stakeAmount * (await staking.calculateYield(timeStaked))) / 1000000000000000000n;
      const expectedTax = (expectedReward * (await staking.calculateTax(timeStaked))) / 1000000000000000000n;
      //console.log("R(t) = ", stakeAmount + expectedReward - expectedTax);
      const expectedFinalBalance = (initialBalance + stakeAmount + expectedReward) - expectedTax;
      //console.log("finalBalance", finalBalance);
      //console.log("expectedFinalBalance", expectedFinalBalance);

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
      await staking.connect(addr1).unstake(0);

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
      await staking.connect(addr1).unstake(0);

      const finalBalance = await token.balanceOf(addr1.address);
      const timeStaked = 31556926n;
      const expectedReward = (stakeAmount * (await staking.calculateYield(timeStaked))) / 1000000000000000000n;
      const expectedTax = (expectedReward * (await staking.calculateTax(timeStaked))) / 1000000000000000000n;
      const expectedFinalBalance = (initialBalance + stakeAmount + expectedReward) - expectedTax;

      expect(finalBalance).to.be.closeTo(expectedFinalBalance, ethers.parseEther("0.00001")); // Check with a small tolerance
    });
  });
  
  describe("Scenario: Staking with stakingDuration and user unstakes before the duration is over", function () {
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
      await staking.connect(addr1).unstake(0);

      await ethers.provider.send("evm_increaseTime", [300]);
      await ethers.provider.send("evm_mine", []);

      // Claim
      await staking.connect(addr1).claim(0);

      const finalBalance = await token.balanceOf(addr1.address);
      const timeStaked = 86400 * 107;
      const expectedReward = (stakeAmount * (await staking.calculateYield(timeStaked))) / 1000000000000000000n;
      const expectedTax = (expectedReward * (await staking.calculateTax(timeStaked))) / 1000000000000000000n;
      const expectedFinalBalance = initialBalance + stakeAmount + expectedReward - expectedTax;

      expect(finalBalance).to.be.closeTo(expectedFinalBalance, ethers.parseEther("0.1"));
    });
  });

  describe("Scenario: Staking with stakingDuration and user unstakes after the duration is over", function () {
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
      await staking.connect(addr1).unstake(0);

      const finalBalance = await token.balanceOf(addr1.address);
      const timeStaked = 31556926;
      const expectedReward = (stakeAmount * (await staking.calculateYield(timeStaked))) / 1000000000000000000n;
      const expectedFinalBalance = initialBalance + stakeAmount + expectedReward;

      expect(finalBalance).to.be.closeTo(expectedFinalBalance, ethers.parseEther("0.00001"));
    });
  });

  describe("Scenario: Staking with stakingDuration = 0 and user unstakes", function () {
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
      await staking.connect(addr1).unstake(0);

      const finalBalance = await token.balanceOf(addr1.address);
      const timeStaked = 31556926;
      const expectedReward = (stakeAmount * (await staking.calculateYield(timeStaked))) / 1000000000000000000n;
      const expectedTax = (expectedReward * (await staking.calculateTax(timeStaked))) / 1000000000000000000n;
      const expectedFinalBalance = initialBalance + stakeAmount + expectedReward - expectedTax;

      expect(finalBalance).to.be.closeTo(expectedFinalBalance, ethers.parseEther("0.00001"));
    });
  });

  describe("Scenario: Multiple Stakes - First Claimed Before Duration Ends, Second Claimed After", function () {
    beforeEach(async function () {
      await staking.updateStakingDuration(31556926); // 1 year in seconds
    });

    it("Should handle multiple stakes with one claimed before duration ends and another after", async function () {
      const stakeAmount1 = ethers.parseEther("1000");
      const stakeAmount2 = ethers.parseEther("2000");
      await token.connect(addr1).approve(staking.target, stakeAmount1);
      await staking.connect(addr1).stake(stakeAmount1);
    
      await ethers.provider.send("evm_increaseTime", [86400 * 180]); // 180 days
      await ethers.provider.send("evm_mine", []);
    
      await token.connect(addr1).approve(staking.target, stakeAmount2);
      await staking.connect(addr1).stake(stakeAmount2);

    
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
      const expectedReward1 = (stakeAmount1 * (await staking.calculateYield(timeStaked1))) / 1000000000000000000n;
      const expectedTax1 = (expectedReward1 * (await staking.calculateTax(timeStaked1))) / 1000000000000000000n;
      const expectedFinalBalance1 = initialBalance + (stakeAmount1) + (expectedReward1) - (expectedTax1);
    
      expect(balanceAfterFirstClaim).to.be.closeTo(expectedFinalBalance1, ethers.parseEther("10000"));
    
      const timeStaked2 = 86400 * 560; // 180 + 380 days
      const expectedReward2 = (stakeAmount2 * (await staking.calculateYield(timeStaked2))) / 1000000000000000000n;
      const expectedFinalBalance2 = balanceAfterFirstClaim+(stakeAmount2)+(expectedReward2);
    
      expect(finalBalance).to.be.closeTo(expectedFinalBalance2, ethers.parseEther("1"));
    });
    
    
  });

  describe("Scenario: Multiple Stakes and Unstake Before Duration", function () {
    beforeEach(async function () {
      await staking.updateStakingDuration(31556926); // 1 year in seconds
    });

    it("Should handle multiple stakes and allow unstaking before the duration", async function () {
      const stakeAmount1 = ethers.parseEther("1000");
      const stakeAmount2 = ethers.parseEther("2000");
      await token.connect(addr1).approve(staking.target, stakeAmount1);
      await staking.connect(addr1).stake(stakeAmount1);

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

      const expectedReward1 = (stakeAmount1 * (await staking.calculateYield(timeStaked1))) / 1000000000000000000n;
      const expectedTax1 = (expectedReward1 * (await staking.calculateTax(timeStaked1))) / 1000000000000000000n;
      const expectedFinalBalance1 = initialBalance + stakeAmount1 + expectedReward1 - expectedTax1;

      expect(finalBalanceAfterFirstClaim).to.be.closeTo(expectedFinalBalance1, ethers.parseEther("10000"));
    });
  });

  describe("Scenario: Multiple Stakes and Unstake After Duration", function () {
    beforeEach(async function () {
      await staking.updateStakingDuration(31556926); // 1 year in seconds
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

      await ethers.provider.send("evm_increaseTime", [86400 * 400]); // 400 more days
      await ethers.provider.send("evm_mine", []);

      const initialBalance = await token.balanceOf(addr1.address);

      // Unstake second stake after duration ends
      await staking.connect(addr1).unstake(1);

      await ethers.provider.send("evm_increaseTime", [300]);
      await ethers.provider.send("evm_mine", []);

      const finalBalance = await token.balanceOf(addr1.address);

      const timeStaked2 = 86400 * 580; // 180 + 400 days

      const expectedReward2 = (stakeAmount2 * (await staking.calculateYield(timeStaked2))) / 1000000000000000000n;
      const expectedFinalBalance2 = initialBalance + (stakeAmount2) + (expectedReward2);

      expect(finalBalance).to.be.closeTo(expectedFinalBalance2, ethers.parseEther("0.1"));
    });
  });
});
