const { ethers } = require("hardhat");
const hre = require("hardhat");
const fs = require('fs');
const { LOCK_1M, MANGA_AI_ERC_ADDRESS, LOCK_1M_RATE, LOCK_6M, LOCK_6M_RATE } = require('./config.js');


// write append to file
async function writeToFile(address) {

  const file = __dirname + '../../deployed.txt';

  fs.appendFile('deployed.txt', address + '\n', function (err) {
    if (err) throw err;
    console.log('Saved!');
  });
}


async function deployNFT() {

  const [deployer] = await ethers.getSigners();
  const gasPrice = await hre.ethers.provider.getGasPrice();

  /**
   * get contract factory
   */

  const mangaNFTContract = await ethers.getContractFactory("MANGANFT")

  const mangaNFT = await mangaNFTContract.deploy(deployer.address, deployer.address,
    {
      gasPrice: gasPrice
    });

  await mangaNFT.deployed();

  try {
    await hre.run("verify:verify", {
      address: mangaNFT.address,
      contract: "contracts/MANGANFT.sol:MANGANFT",
      constructorArguments: [deployer.address],
    });
  } catch (error) {
    console.log(error);
  }

  await writeToFile("NFT Deployed to : " + mangaNFT.address);

  return mangaNFT.address;

}

async function deployStaking() {

  const [deployer] = await ethers.getSigners();
  const gasPrice = await hre.ethers.provider.getGasPrice();

  /**
   * get contract factory
   */

  const stakingContract = await ethers.getContractFactory("MangaAIOpen")
  const lockContract = await ethers.getContractFactory("MangaAILock")
  const rewardContract = await ethers.getContractFactory("RewardWallet")
  const treasuryContract = await ethers.getContractFactory("Treasury")

  const staking = await stakingContract.deploy(
    MANGA_AI_ERC_ADDRESS, MANGA_AI_ERC_ADDRESS,
    {
      gasPrice: gasPrice
    });

  await staking.deployed();

  await writeToFile("Open Staking Deployed to : " + staking.address);

  const lock1m = await lockContract.deploy(
    MANGA_AI_ERC_ADDRESS, MANGA_AI_ERC_ADDRESS,
    LOCK_1M,
    LOCK_1M_RATE,
    {
      gasPrice: gasPrice
    });

  await lock1m.deployed();

  await writeToFile("Lock 1m Staking Deployed to : " + lock1m.address);

  const lock6m = await lockContract.deploy(
    MANGA_AI_ERC_ADDRESS, MANGA_AI_ERC_ADDRESS,
    LOCK_6M,
    LOCK_6M_RATE,
    {
      gasPrice: gasPrice
    });

  await lock6m.deployed();

  await writeToFile("Lock 6m Staking Deployed to : " + lock6m.address);

  const openReward = await rewardContract.deploy(
    MANGA_AI_ERC_ADDRESS,
    staking.address,
    {
      gasPrice: gasPrice
    });

  await openReward.deployed();

  await writeToFile("Open Reward Deployed to : " + openReward.address);

  const lock1Reward = await rewardContract.deploy(
    MANGA_AI_ERC_ADDRESS,
    lock1m.address,
    {
      gasPrice: gasPrice
    });

  await lock1Reward.deployed();

  await writeToFile("Lock 1m Reward Deployed to : " + lock1Reward.address);

  const lock6Reward = await rewardContract.deploy(
    MANGA_AI_ERC_ADDRESS,
    lock6m.address,
    {
      gasPrice: gasPrice
    });

  await lock6Reward.deployed();

  await writeToFile("Lock 6m Reward Deployed to : " + lock6Reward.address);

  const openTreasury = await treasuryContract.deploy(
    MANGA_AI_ERC_ADDRESS,
    staking.address,
    {
      gasPrice: gasPrice
    });

  await openTreasury.deployed();

  await writeToFile("Open Treasury Deployed to : " + openTreasury.address);

  const lock1Treasury = await treasuryContract.deploy(
    MANGA_AI_ERC_ADDRESS,
    lock1m.address,
    {
      gasPrice: gasPrice
    });

  await lock1Treasury.deployed();

  await writeToFile("Lock 1m Treasury Deployed to : " + lock1Treasury.address);

  const lock6Treasury = await treasuryContract.deploy(
    MANGA_AI_ERC_ADDRESS,
    lock6m.address,
    {
      gasPrice: gasPrice
    });

  await lock6Treasury.deployed();

  await writeToFile("Lock 6m Treasury Deployed to : " + lock6Treasury.address);

  try {

    await hre.run("verify:verify", {
      address: staking.address,
      contract: "contracts/MangaAIOpen.sol:MangaAIOpen",
      constructorArguments: [MANGA_AI_ERC_ADDRESS, MANGA_AI_ERC_ADDRESS],
    });

    await hre.run("verify:verify", {
      address: lock1m.address,
      contract: "contracts/MangaAILock.sol:MangaAILock",
      constructorArguments: [MANGA_AI_ERC_ADDRESS, MANGA_AI_ERC_ADDRESS, LOCK_1M, LOCK_1M_RATE],
    });

    await hre.run("verify:verify", {
      address: openReward.address,
      contract: "contracts/RewardWallet.sol:RewardWallet",
      constructorArguments: [MANGA_AI_ERC_ADDRESS, staking.address],
    });



    await hre.run("verify:verify", {
      address: openTreasury.address,
      contract: "contracts/Treasury.sol:Treasury",
      constructorArguments: [MANGA_AI_ERC_ADDRESS, staking.address],
    });


  } catch (error) {

    console.log(error);
  }




}

async function deployMembershipStaking() {

  const [deployer] = await ethers.getSigners();
  const gasPrice = await hre.ethers.provider.getGasPrice();

  const NFTAddress = await deployNFT();

  /**
   * get contract factory
   */

  const stakingContract = await ethers.getContractFactory("MangaAIOpenNFT")
  const lockContract = await ethers.getContractFactory("MangaAILockNFT")
  const rewardContract = await ethers.getContractFactory("RewardWallet")
  const treasuryContract = await ethers.getContractFactory("Treasury")

  const staking = await stakingContract.deploy(
    MANGA_AI_ERC_ADDRESS, NFTAddress, MANGA_AI_ERC_ADDRESS, NFTAddress,
    {
      gasPrice: gasPrice
    });

  await staking.deployed();

  await writeToFile("Open Staking Membership Deployed to : " + staking.address);

  const lock1m = await lockContract.deploy(
    MANGA_AI_ERC_ADDRESS, NFTAddress, MANGA_AI_ERC_ADDRESS, NFTAddress,
    LOCK_1M,
    LOCK_1M_RATE,
    {
      gasPrice: gasPrice
    });

  await lock1m.deployed();

  await writeToFile("Lock 1m Staking Membership Deployed to : " + lock1m.address);

  const lock6m = await lockContract.deploy(
    MANGA_AI_ERC_ADDRESS, NFTAddress, MANGA_AI_ERC_ADDRESS, NFTAddress,
    LOCK_6M,
    LOCK_6M_RATE,
    {
      gasPrice: gasPrice
    });

  await lock6m.deployed();

  await writeToFile("Lock 6m Staking Membership Deployed to : " + lock6m.address);

  const openReward = await rewardContract.deploy(
    MANGA_AI_ERC_ADDRESS,
    staking.address,
    {
      gasPrice: gasPrice
    });

  await openReward.deployed();

  await writeToFile("Open Reward Membership Deployed to : " + openReward.address);

  const lock1Reward = await rewardContract.deploy(
    MANGA_AI_ERC_ADDRESS,
    lock1m.address,
    {
      gasPrice: gasPrice
    });

  await lock1Reward.deployed();

  await writeToFile("Lock 1m Reward Membership Deployed to : " + lock1Reward.address);

  const lock6Reward = await rewardContract.deploy(
    MANGA_AI_ERC_ADDRESS,
    lock6m.address,
    {
      gasPrice: gasPrice
    });

  await lock6Reward.deployed();

  await writeToFile("Lock 6m Reward Membership Deployed to : " + lock6Reward.address);

  const openTreasury = await treasuryContract.deploy(
    MANGA_AI_ERC_ADDRESS,
    staking.address,
    {
      gasPrice: gasPrice
    });

  await openTreasury.deployed();

  await writeToFile("Open Treasury Membership Deployed to : " + openTreasury.address);

  const lock1Treasury = await treasuryContract.deploy(
    MANGA_AI_ERC_ADDRESS,
    lock1m.address,
    {
      gasPrice: gasPrice
    });

  await lock1Treasury.deployed();

  await writeToFile("Lock 1m Treasury Membership Deployed to : " + lock1Treasury.address);

  const lock6Treasury = await treasuryContract.deploy(
    MANGA_AI_ERC_ADDRESS,
    lock6m.address,
    {
      gasPrice: gasPrice
    });

  await lock6Treasury.deployed();

  await writeToFile("Lock 6m Treasury Membership Deployed to : " + lock6Treasury.address);


  try {

    await hre.run("verify:verify", {
      address: staking.address,
      contract: "contracts/MangaAIOpenNFT.sol:MangaAIOpenNFT",
      constructorArguments: [MANGA_AI_ERC_ADDRESS, NFTAddress, MANGA_AI_ERC_ADDRESS, NFTAddress],
    });

    await hre.run("verify:verify", {
      address: lock1m.address,
      contract: "contracts/MangaAILockNFT.sol:MangaAILockNFT",
      constructorArguments: [MANGA_AI_ERC_ADDRESS, NFTAddress, MANGA_AI_ERC_ADDRESS, NFTAddress, LOCK_1M, LOCK_1M_RATE],
    });

  } catch (error) {
    console.log(error);
  }

}

async function main() {
  await deployStaking();
  await deployMembershipStaking();
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });