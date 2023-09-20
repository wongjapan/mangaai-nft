const { expect } = require("chai");
const { ethers } = require("hardhat");


const MAX_SUPPLY = ethers.utils.parseEther("10000000");
const MAX_TAX = 10;

const ROUTER_ADDRESS = "0x10ED43C718714eb63d5aA57B78B54704E256024E";

describe("Manga AI Test", function () {

  let mangaAI;
  let owner;
  let marketing;
  let addr;

  beforeEach(async function () {
    const MangaAI = await ethers.getContractFactory("MangaAI");
    [owner, marketing, ...addr] = await ethers.getSigners();
    mangaAI = await MangaAI.deploy(ROUTER_ADDRESS, marketing.address);
  })

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await mangaAI.owner()).to.equal(owner.address);
    });

    it("Should set the right marketing", async function () {
      expect(await mangaAI.marketingWallet()).to.equal(marketing.address);
    });

    it("Should set the right router", async function () {
      expect(await mangaAI.defaultDexRouter()).to.equal(ROUTER_ADDRESS);
    });

    it("Should set the right max supply", async function () {
      expect(await mangaAI.totalSupply()).to.equal(MAX_SUPPLY);
    });

    it("Should set the right max buy tax to 1000 or 10%", async function () {
      await expect(mangaAI.updateBuyFees(1001, 1)).to.be.reverted;
    });


  })

})