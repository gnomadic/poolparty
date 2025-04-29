// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Treasury is Ownable {
    address public poolManager;
    address public devTeam;
    address public charity;

    uint256 public treasuryBalance;

    // Events to track actions
    event TreasuryDeposited(uint256 amount);
    event TreasuryDistributed(uint256 amount);
    event DevTeamWithdrawn(uint256 amount);
    event CharitySent(uint256 amount);

    constructor(
        address _poolManager,
        address _devTeam,
        address _charity
    ) Ownable(msg.sender) {
        poolManager = _poolManager;
        devTeam = _devTeam;
        charity = _charity;
    }

    // Only the PoolManager can deposit funds into the treasury
    modifier onlyPoolManager() {
        require(msg.sender == poolManager, "Not authorized");
        _;
    }

    // Function to deposit yield into the treasury (called by PoolManager)
    function deposit(uint256 amount) external onlyPoolManager {
        treasuryBalance += amount;
        emit TreasuryDeposited(amount);
    }

    // Function to distribute funds from the treasury according to the rules
    function distributeTreasury() external onlyOwner {
        require(treasuryBalance > 0, "Treasury is empty");

        uint256 treasuryShare = treasuryBalance;
        uint256 poolContribution = (treasuryShare * 90) / 100; // 90% to the pool
        uint256 devShare = (treasuryShare * 5) / 100; // 5% to dev team
        uint256 charityShare = (treasuryShare * 5) / 100; // 5% to charity

        // Transfer 90% back to the pool
        (bool sentPool, ) = poolManager.call{value: poolContribution}("");
        require(sentPool, "Failed to send funds to the pool");

        // Send 5% to dev team (manually withdrawable)
        emit DevTeamWithdrawn(devShare);

        // Send 5% to charity (manually send)
        emit CharitySent(charityShare);

        // Remaining funds stay in treasury for future distribution
        treasuryBalance = 0; // reset balance after distribution
        emit TreasuryDistributed(treasuryShare);
    }

    // Manually withdraw funds to dev team
    function withdrawToDevTeam(uint256 amount) external onlyOwner {
        require(amount <= treasuryBalance, "Insufficient balance");
        treasuryBalance -= amount;
        (bool sent, ) = devTeam.call{value: amount}("");
        require(sent, "Failed to withdraw to dev team");
        emit DevTeamWithdrawn(amount);
    }

    // Manually send funds to charity
    function sendToCharity(uint256 amount) external onlyOwner {
        require(amount <= treasuryBalance, "Insufficient balance");
        treasuryBalance -= amount;
        (bool sent, ) = charity.call{value: amount}("");
        require(sent, "Failed to send funds to charity");
        emit CharitySent(amount);
    }

    // Receive function to accept deposits
    receive() external payable {
        treasuryBalance += msg.value;
    }
}
