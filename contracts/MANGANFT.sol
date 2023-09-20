// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MANGANFT is ERC721, ERC721Royalty, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    string public baseURI;

    address payable public feeAddr;
    uint256 public mintPriceInWei = 0.1 ether;

    uint256 public constant MAX_SUPPLY = 333;
    uint96 public constant ROYALTY_FEE = 200;

    constructor(
        address _royaltyReceiver,
        address _feeAddr
    ) ERC721("Manga Membership NFT", "MANGANFT") {
        feeAddr = payable(_feeAddr);
        _setDefaultRoyalty(_royaltyReceiver, ROYALTY_FEE);
    }

    function Mint(address to) public payable {
        require(totalSupply() < MAX_SUPPLY, "Max supply reached");
        require(msg.value >= mintPriceInWei, "Insufficient funds");
        require(to != address(0), "Invalid address");
        _mintSingle(to);
        feeAddr.transfer(msg.value);
    }

    // bulk mint

    function MintBulk(address to, uint256 amount) public payable {
        uint256 total = totalSupply();
        uint256 newSupply = total + amount;

        require(newSupply < MAX_SUPPLY, "Max supply reached");
        require(msg.value >= mintPriceInWei * amount, "Insufficient funds");
        require(to != address(0), "Invalid address");
        for (uint256 i = 0; i < amount; i++) {
            _mintSingle(to);
        }
        feeAddr.transfer(msg.value);
    }

    function _mintSingle(address to) internal {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }

    function setFeeAddr(address payable _feeAddr) public onlyOwner {
        require(_feeAddr != feeAddr, "Same address");
        require(_feeAddr != address(0), "Invalid address");
        feeAddr = _feeAddr;
    }

    function setMintPriceInWei(uint256 _mintPriceInWei) public onlyOwner {
        require(_mintPriceInWei != mintPriceInWei, "Same price");
        mintPriceInWei = _mintPriceInWei;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function setBaseURI(string memory _baseURI_) public onlyOwner {
        baseURI = _baseURI_;
    }

    // set royalty receiver

    function setDefaultRoyaltyReceiver(
        address _royaltyReceiver
    ) public onlyOwner {
        _setDefaultRoyalty(_royaltyReceiver, ROYALTY_FEE);
    }

    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

    function tokenURI(
        uint256 tokenId
    ) public view virtual override(ERC721) returns (string memory) {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );
        string memory baseURI_ = _baseURI();
        return
            bytes(baseURI_).length > 0
                ? string(
                    abi.encodePacked(
                        baseURI_,
                        Strings.toString(tokenId),
                        ".json"
                    )
                )
                : "";
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721Royalty) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721Royalty) {
        super._burn(tokenId);
    }

    // withdraw bnb

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }
}
