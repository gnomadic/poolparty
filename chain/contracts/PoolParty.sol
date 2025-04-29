// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import {IYieldFarm} from "./interfaces/IYieldFarm.sol";
import {IAaveLendingPool} from "./interfaces/IAaveLendingPool.sol";
import {PoolTicket} from "./PoolTicket.sol";

contract PoolParty is Ownable, ReentrancyGuard {
    struct Pool {
        uint256 id;
        uint256 ticketPrice;
        uint256 timePeriod;
        address yieldFarm;
        uint256 totalDeposits;
        uint256 lastDrawTimestamp;
        bool isActive;
    }

    PoolTicket public ticket;
    uint256 public nextPoolId;
    mapping(uint256 => Pool) public pools;
    mapping(uint256 => mapping(address => uint256)) public deposits;
    mapping(address => uint256) public pendingWinnings;

    constructor(address _ticket) Ownable(msg.sender) {
        ticket = PoolTicket(_ticket);
    }

    function createPool(
        uint256 ticketPrice,
        uint256 timePeriod,
        address yieldFarm
    ) external onlyOwner {
        pools[nextPoolId] = Pool({
            id: nextPoolId,
            ticketPrice: ticketPrice,
            timePeriod: timePeriod,
            yieldFarm: yieldFarm,
            totalDeposits: 0,
            lastDrawTimestamp: block.timestamp,
            isActive: true
        });
        emit PoolCreated(nextPoolId);
        nextPoolId++;
    }

    function deposit(uint256 poolId, uint256 amount) external nonReentrant {
        Pool storage pool = pools[poolId];
        require(pool.isActive, "Pool not active");
        require(amount >= pool.ticketPrice, "Amount too small");

        IYieldFarm(pool.yieldFarm).deposit(amount);

        uint256 numTickets = amount / pool.ticketPrice;
        for (uint256 i = 0; i < numTickets; i++) {
            ticket.mint(msg.sender, poolId);
        }

        deposits[poolId][msg.sender] += amount;
        pool.totalDeposits += amount;

        emit Deposited(poolId, msg.sender, amount);
    }

    function withdraw(uint256 poolId, uint256 amount) external nonReentrant {
        Pool storage pool = pools[poolId];
        require(deposits[poolId][msg.sender] >= amount, "Insufficient balance");

        IYieldFarm(pool.yieldFarm).withdraw(amount);
        deposits[poolId][msg.sender] -= amount;
        pool.totalDeposits -= amount;

        uint256 ticketsToBurn = amount / pool.ticketPrice;
        _burnUserTickets(msg.sender, poolId, ticketsToBurn);

        emit Withdrawn(poolId, msg.sender, amount);
    }

    function drawWinners(uint256 poolId) external nonReentrant onlyOwner {
        Pool storage pool = pools[poolId];
        require(
            block.timestamp >= pool.lastDrawTimestamp + pool.timePeriod,
            "Too early"
        );

        uint256 yield = IYieldFarm(pool.yieldFarm).totalYield();
        uint256 bonus = (yield * 99) / 100;
        uint256 treasury = yield - bonus;

        uint256 winnersCount = ticket.totalSupply() / 10;
        if (winnersCount == 0) return;

        for (uint256 i = 0; i < winnersCount; i++) {
            uint256 randomTokenId = uint256(
                keccak256(
                    abi.encodePacked(block.timestamp, block.prevrandao, i)
                )
            ) % ticket.totalSupply();
            address winner = ticket.ownerOf(randomTokenId);
            pendingWinnings[winner] += bonus / winnersCount;
        }

        pool.lastDrawTimestamp = block.timestamp;
        emit WinnersDrawn(poolId);
    }

    function claimWinnings() external nonReentrant {
        uint256 amount = pendingWinnings[msg.sender];
        require(amount > 0, "No winnings to claim");
        pendingWinnings[msg.sender] = 0;
        (bool sent, ) = msg.sender.call{value: amount}("");
        require(sent, "Claim failed");

        emit Claimed(msg.sender, amount);
    }

    function _burnUserTickets(
        address user,
        uint256 poolId,
        uint256 ticketsToBurn
    ) internal {
        uint256 burned = 0;
        uint256 supply = ticket.totalSupply();

        for (uint256 i = 0; i < supply && burned < ticketsToBurn; i++) {
            uint256 tokenId = ticket.tokenByIndex(i);
            if (
                ticket.ownerOf(tokenId) == user &&
                ticket.ticketToPool(tokenId) == poolId
            ) {
                ticket.burn(tokenId);
                burned++;
            }
        }
    }

    receive() external payable {
        require(false, "Do Not Transfer");
    }

    // ---------------  Events ---------------

    event PoolCreated(uint256 indexed poolId);
    event Deposited(
        uint256 indexed poolId,
        address indexed user,
        uint256 amount
    );
    event Withdrawn(
        uint256 indexed poolId,
        address indexed user,
        uint256 amount
    );
    event WinnersDrawn(uint256 indexed poolId);
    event Claimed(address indexed user, uint256 amount);
}
