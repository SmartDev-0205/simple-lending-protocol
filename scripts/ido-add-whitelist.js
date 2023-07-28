const fs = require("fs");
const colors = require("colors");
const { ethers } = require("hardhat");
async function main() {
  // get network
  let [owner] = await ethers.getSigners();
  console.log(owner.address);
  let network = await owner.provider._networkPromise;

  const ERC20TOKEN = await ethers.getContractFactory("NormalToken");
  tokenContract = await ERC20TOKEN.deploy("Peko Token", "PEKO");
  await tokenContract.deployed();
  console.log("Token contract", tokenContract.address);
  const IDOCONTRACT = await ethers.getContractFactory("IDO");
  var idoContract = await IDOCONTRACT.deploy(tokenContract.address);
  await idoContract.deployed();
  console.log("IDO contract", idoContract.address);
  await tokenContract.transfer(idoContract.address, "40000000000000");

  // deployment result
  var contractObject = {
    token: {
      address: tokenContract.address,
    },
    IDO: {
      address: idoContract.address,
    },
  };

  fs.writeFileSync(
    `./build/IDO_${network.chainId}.json`,
    JSON.stringify(contractObject, undefined, 4)
  );
}

main()
  .then(() => {
    console.log("complete".green);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
