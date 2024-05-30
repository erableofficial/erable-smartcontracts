const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const Lock = await ethers.getContractFactory("Lock");

    // Assuming the Lock contract constructor takes one argument: unlockTime
    const unlockTime = Math.floor(Date.now() / 1000) + 60 * 60; // 1 hour from now
    const lock = await Lock.deploy(unlockTime);
    
    // Wait for the contract to be deployed
    const deploymentReceipt = await lock.deploymentTransaction().wait(2);
    console.log("Lock deployed to:", deploymentReceipt.contractAddress);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
