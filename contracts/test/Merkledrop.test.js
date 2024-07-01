const { expect } = require("chai");
const { ethers } = require("hardhat");
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");

describe("MerkleAirdrop", function () {
    let token;
    let merkleAirdrop;
    let owner;
    let addr1;
    let addr2;
    let addr3;
    let addr4;
    let merkleTree;
    let root;
    const initialSupply = ethers.parseEther("1000000");

    before(async function () {
        [owner, addr1, addr2, addr3, addr4] = await ethers.getSigners();
    });

    beforeEach(async function () {
        // Deploy the token contract
        const Token = await ethers.getContractFactory("StakingToken");
        token = await Token.deploy(initialSupply);
        await token.waitForDeployment();

        // Deploy the MerkleAirdrop contract
        const MerkleAirdrop = await ethers.getContractFactory("MerkleAirdrop");
        merkleAirdrop = await MerkleAirdrop.deploy(token.target);
        await merkleAirdrop.waitForDeployment();

        // Create the Merkle Tree for testing
        const elements = [
            { address: addr1.address, amount: ethers.parseEther('10').toString() },
            { address: addr2.address, amount: ethers.parseEther('20').toString() },
            { address: addr3.address, amount: ethers.parseEther('30').toString() },
            { address: addr4.address, amount: ethers.parseEther('40').toString() }
        ];

        const leaves = elements.map(e => keccak256(ethers.solidityPacked(['address', 'uint256'], [e.address, e.amount])));
        merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });
        root = merkleTree.getHexRoot();
    });

    it("Should create a new airdrop cycle", async function () {
        await merkleAirdrop.createAirdropCycle(root);
        const cycle = await merkleAirdrop.airdropCycles(0);
        expect(cycle.merkleRoot).to.equal(root);
        expect(cycle.isActive).to.be.true;
    });

    it("Should allow users to claim tokens", async function () {
        await token.transfer(merkleAirdrop.target, ethers.parseEther("1000"));
        await merkleAirdrop.createAirdropCycle(root);

        const proof1 = merkleTree.getHexProof(keccak256(ethers.solidityPacked(["address", "uint256"], [addr1.address, ethers.parseEther("10")])));
        await merkleAirdrop.connect(addr1).claimTokens(0, ethers.parseEther("10"), proof1);
        const balance1 = await token.balanceOf(addr1.address);
        expect(balance1).to.equal(ethers.parseEther("10"));

        const proof2 = merkleTree.getHexProof(keccak256(ethers.solidityPacked(["address", "uint256"], [addr2.address, ethers.parseEther("20")])));
        await merkleAirdrop.connect(addr2).claimTokens(0, ethers.parseEther("20"), proof2);
        const balance2 = await token.balanceOf(addr2.address);
        expect(balance2).to.equal(ethers.parseEther("20"));
    });

    it("Should not allow double claiming of tokens", async function () {
        await token.transfer(merkleAirdrop.target, ethers.parseEther("1000"));
        await merkleAirdrop.createAirdropCycle(root);

        const proof1 = merkleTree.getHexProof(keccak256(ethers.solidityPacked(["address", "uint256"], [addr1.address, ethers.parseEther("10")])));
        await merkleAirdrop.connect(addr1).claimTokens(0, ethers.parseEther("10"), proof1);

        // Check the hasClaimed mapping before the second claim attempt
        const hasClaimedBeforeSecondClaim = await merkleAirdrop.hasUserClaimed(0, addr1.address);
        console.log("Has addr1 claimed before second claim attempt:", hasClaimedBeforeSecondClaim);

        await expect(merkleAirdrop.connect(addr1).claimTokens(0, ethers.parseEther("10"), proof1)).to.be.revertedWith("Airdrop already claimed in this cycle");
    });

    it("Should verify claimable tokens", async function () {
        await token.transfer(merkleAirdrop.target, ethers.parseEther("1000"));
        await merkleAirdrop.createAirdropCycle(root);

        const proof1 = merkleTree.getHexProof(keccak256(ethers.solidityPacked(["address", "uint256"], [addr1.address, ethers.parseEther("10")])));
        const canClaim1 = await merkleAirdrop.checkClaimable(0, addr1.address, ethers.parseEther("10"), proof1);
        expect(canClaim1).to.be.true;

        const proof2 = merkleTree.getHexProof(keccak256(ethers.solidityPacked(["address", "uint256"], [addr2.address, ethers.parseEther("20")])));
        const canClaim2 = await merkleAirdrop.checkClaimable(0, addr2.address, ethers.parseEther("20"), proof2);
        expect(canClaim2).to.be.true;

        // Claim addr1 and check again
        await merkleAirdrop.connect(addr1).claimTokens(0, ethers.parseEther("10"), proof1);
        const canClaim1After = await merkleAirdrop.checkClaimable(0, addr1.address, ethers.parseEther("10"), proof1);
        expect(canClaim1After).to.be.false;
    });

    it("Should deposit tokens to the contract", async function () {
        await token.transfer(merkleAirdrop.target, ethers.parseEther("1000"));
        const balance = await token.balanceOf(merkleAirdrop.target);
        expect(balance).to.equal(ethers.parseEther("1000"));
    });

    it("Should withdraw tokens from the contract", async function () {
        await token.transfer(merkleAirdrop.target, ethers.parseEther("1000"));
        const balance1 = await token.balanceOf(owner.address);
        console.log(balance1)
        await merkleAirdrop.withdrawTokens(ethers.parseEther("500"));
        const balance = await token.balanceOf(owner.address);
        expect(balance).to.equal(ethers.parseEther("500") + balance1);
    });
});
