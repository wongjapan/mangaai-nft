const { ethers } = require("hardhat");
const hre = require("hardhat");

const owner = "0x796616BBC0D45A3Fc72e3f66846Ad03D2107af16";
const marketing = "0x803B74F303914B72F27512ea2a2951ddff9d62e1";
const router = "0x10ED43C718714eb63d5aA57B78B54704E256024E";


async function main() {

  const [deployer] = await ethers.getSigners();
  const gasPrice = await hre.ethers.provider.getGasPrice();

  /**
   * get contract factory
   */
  const MangaAI = await ethers.getContractFactory("MangaAI")

  const mangaAI = await MangaAI.deploy(router, marketing, {
    gasPrice: gasPrice
  });

  await mangaAI.deployed();


  /**
   * verify contract
   */

  try {
    await hre.run("verify:verify", {
      address: mangaAI.address,
      constructorArguments: [router, marketing],
    });
  } catch (error) {
    console.log(error);
  }




  /**
   * console all address
   */

  console.log("MangaAI deployed to:", mangaAI.address);

  const setOwner = await mangaAI.transferOwnership(owner, {
    gasPrice: gasPrice
  })

  await setOwner.wait();

  const transferAll = await mangaAI.transfer(owner, ethers.utils.parseEther("10000000"), {
    gasPrice: gasPrice
  })

  await transferAll.wait();



}

const verify = async () => {
  try {
    await hre.run("verify:verify", {
      address: '0xdA022bf4402F3eDF32B02356056400E8d7eF5522',
      constructorArguments: [router, marketing],
    });
  } catch (error) {
    console.log(error);
  }
}


verify().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});