// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

const { ethers } = require("hardhat");
const path = require("path");

async function main() {
    // This is just a convenience check
    if (network.name === "hardhat") {
        console.warn(
            "You are trying to deploy a contract to the Hardhat Network, which" +
            "gets automatically created and destroyed every time. Use the Hardhat" +
            " option '--network localhost'"
        );
    }

    // ethers is available in the global scope
    const [deployer,acc2,acc3,acc4,acc5] = await ethers.getSigners();
    console.log(
        "Deploying the contracts with the account:",
        await deployer.getAddress()
    );

    //console.log("Account balance:", (await ethers.provider.getBalace(await deployer.getAddress())).toString());

    const MyContract = await ethers.getContractFactory('DonationForGood');
    const myContract = await MyContract.deploy();
    await myContract.waitForDeployment();
    // await myContract.connect(acc2).createDonorAcc('Donor1');
    // await myContract.connect(acc3).createRecieverAcc('Charity1',100,'Help!',true);
    // await myContract.connect(acc4).createRecieverAcc('Charity2',100,'Help!',true);
    // await myContract.connect(acc5).createRecieverAcc('Charity3',100,'Help!',true);
    // await myContract.connect(deployer).activateRecieverAcc(acc3.address);
    // await myContract.connect(acc2).donateTo(acc3.address,{value: ethers.parseEther('10')});

    const contractAddress = await myContract.getAddress();

    // console.log(await myContract.getDetailsReciever(acc3.address));
    // console.log(await myContract.getDetailsReciever(acc4.address));
    // console.log(await myContract.getDetailsReciever(acc5.address));

    console.log("Token address:", contractAddress);

    // We also save the contract's artifacts and address in the frontend directory
    saveFrontendFiles(contractAddress);
}

function saveFrontendFiles(address) {
    const fs = require("fs");
    const contractsDir = path.join(__dirname, "..", "frontendForSolidity", "src", "contracts");

    if (!fs.existsSync(contractsDir)) {
        fs.mkdirSync(contractsDir);
    }
    
    fs.writeFileSync(
        path.join(contractsDir, "contract-address.json"),
        JSON.stringify({ Address: address }, undefined, 2)
    );

    const TokenArtifact = artifacts.readArtifactSync("DonationForGood");

    fs.writeFileSync(
        path.join(contractsDir, "DonationForGood.json"),
        JSON.stringify(TokenArtifact, null, 2)
    );
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
