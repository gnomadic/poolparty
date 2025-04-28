// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./IYieldFarm.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract PoolManager {
    struct Pool {
        address depositToken;
        uint256 ticketPrice;
        uint256 timePeriod; // e.g., 168 hours = 1 week
        address yieldFarm;
        uint256 totalDeposits;
    }

    struct UserInfo {
        uint256 depositAmount;
        uint256 winningsAmount;
    }

    uint256 public nextPoolId;
    mapping(uint256 => Pool) public pools;
    mapping(uint256 => mapping(address => UserInfo)) public userInfo;
    mapping(uint256 => address[]) public poolParticipants;
    mapping(uint256 => mapping(address => bool)) public hasJoinedPool;

    event PoolCreated(uint256 indexed poolId);
    event Deposit(uint256 indexed poolId, address indexed user, uint256 amount);
    event Withdrawal(uint256 indexed poolId, address indexed user, uint256 amount);
    event WinnersDrawn(uint256 indexed poolId, address[] winners);

    // Create a new pool
    function createPool(address _depositToken, uint256 _ticketPrice, uint256 _timePeriod, address _yieldFarm) external {
        pools[nextPoolId] = Pool({
            depositToken: _depositToken,
            ticketPrice: _ticketPrice,
            timePeriod: _timePeriod,
            yieldFarm: _yieldFarm,
            totalDeposits: 0
        });

        emit PoolCreated(nextPoolId);
        nextPoolId++;
    }

    // Deposit funds into a pool
    function deposit(uint256 poolId, uint256 amount) external {
        Pool storage pool = pools[poolId];
        require(amount >= pool.ticketPrice, "Amount too small");

        IERC20(pool.depositToken).transferFrom(msg.sender, address(this), amount);

        if (!hasJoinedPool[poolId][msg.sender]) {
            poolParticipants[poolId].push(msg.sender);
            hasJoinedPool[poolId][msg.sender] = true;
        }

        userInfo[poolId][msg.sender].depositAmount += amount;
        pool.totalDeposits += amount;

        // Deposit into the yield farm
        IYieldFarm(pool.yieldFarm).deposit(pool.depositToken, amount);

        emit Deposit(poolId, msg.sender, amount);
    }

    // Withdraw full balance
    function withdraw(uint256 poolId) external {
        Pool storage pool = pools[poolId];
        UserInfo storage user = userInfo[poolId][msg.sender];

        uint256 totalAmount = user.depositAmount + user.winningsAmount;
        require(totalAmount > 0, "Nothing to withdraw");

        // Withdraw from yield farm if needed (this sends to user directly)
        IYieldFarm(pool.yieldFarm).withdraw(pool.depositToken, totalAmount);

        user.depositAmount = 0;
        user.winningsAmount = 0;
        pool.totalDeposits -= totalAmount;

        emit Withdrawal(poolId, msg.sender, totalAmount);
    }

    // Draw winners for a pool
    function drawWinners(uint256 poolId) external {
        Pool storage pool = pools[poolId];
        address[] storage participants = poolParticipants[poolId];
        uint256 ticketPrice = pool.ticketPrice;

        require(participants.length > 0, "No participants");

        uint256 totalTickets = _getTotalTickets(poolId, ticketPrice);
        require(totalTickets > 0, "No tickets");

        // Pull total yield available
        uint256 totalYield = IYieldFarm(pool.yieldFarm).getBalance(pool.depositToken) - pool.totalDeposits;
        require(totalYield > 0, "No yield");

        uint256 numWinners = (totalTickets * 10) / 100; // 10% winners
        if (numWinners == 0) {
            numWinners = 1; // At least one winner
        }

        address[] memory winners = new address[](numWinners);

        uint256 nonce = 0;
        for (uint256 i = 0; i < numWinners; i++) {
            uint256 winningTicket = _random(totalTickets, nonce);
            address winner = _findTicketOwner(poolId, winningTicket, ticketPrice);
            winners[i] = winner;
            nonce++;
        }

        // Distribute yield evenly among winners
        uint256 rewardPerWinner = totalYield / numWinners;
        for (uint256 i = 0; i < winners.length; i++) {
            userInfo[poolId][winners[i]].winningsAmount += rewardPerWinner;
        }

        emit WinnersDrawn(poolId, winners);
    }

    // ---- INTERNAL HELPERS ----

    function _getTotalTickets(uint256 poolId, uint256 ticketPrice) internal view returns (uint256 totalTickets) {
        address[] storage participants = poolParticipants[poolId];
        for (uint256 i = 0; i < participants.length; i++) {
            totalTickets += userInfo[poolId][participants[i]].depositAmount / ticketPrice;
        }
    }

    function _findTicketOwner(uint256 poolId, uint256 winningTicket, uint256 ticketPrice) internal view returns (address) {
        address[] storage participants = poolParticipants[poolId];
        uint256 currentTicket = 0;

        for (uint256 i = 0; i < participants.length; i++) {
            address participant = participants[i];
            uint256 userTickets = userInfo[poolId][participant].depositAmount / ticketPrice;

            if (winningTicket < currentTicket + userTickets) {
                return participant;
            }
            currentTicket += userTickets;
        }

        revert("No ticket owner found");
    }

    function _random(uint256 max, uint256 nonce) internal view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, msg.sender, nonce))) % max;
    }
}
