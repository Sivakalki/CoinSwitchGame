const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // Print deployer balance
    const balance = await deployer.provider.getBalance(deployer.address);
    console.log("Deployer balance:", ethers.formatEther(balance), "ETH");

    // Get the contract factory
    const ContractFactory = await ethers.getContractFactory("CoinFlip");
    console.log("Deploying contract...");

    // Deploy the contract
    const contract = await ContractFactory.deploy();
    console.log("Deployment transaction hash:", contract.deployTransaction?.hash);

    try {
        // Wait for the contract to be mined
        const receipt = await contract.deployTransaction.wait();
        console.log("Contract deployed to address:", receipt.contractAddress);
    } catch (error) {
        console.error("Error waiting for contract deployment:", error);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Script error:", error);
        process.exit(1);
    });
