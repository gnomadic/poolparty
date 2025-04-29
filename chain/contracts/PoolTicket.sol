// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract PoolTicket is ERC721Enumerable, Ownable {
    uint256 public nextTokenId;
    mapping(uint256 => uint256) public ticketToPool;

    constructor() ERC721("Pool Party Ticket", "PPT") Ownable(msg.sender) {}

    function mint(
        address to,
        uint256 poolId
    ) external onlyOwner returns (uint256) {
        uint256 tokenId = nextTokenId++;
        _mint(to, tokenId);
        ticketToPool[tokenId] = poolId;
        return tokenId;
    }

    function burn(uint256 tokenId) external onlyOwner {
        _burn(tokenId);
        delete ticketToPool[tokenId];
    }
}
