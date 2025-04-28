// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IYieldFarm} from "./IYieldFarm.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract AaveYieldFarm is IYieldFarm {
    IAaveLendingPool public lendingPool;

    constructor(address _lendingPool) {
        lendingPool = IAaveLendingPool(_lendingPool);
    }

    function deposit(address token, uint256 amount) external override {
        IERC20(token).approve(address(lendingPool), amount);
        lendingPool.deposit(token, amount, address(this), 0);
    }

    function withdraw(address token, uint256 amount) external override {
        lendingPool.withdraw(token, amount, msg.sender);
    }

    function getBalance(address token) external view override returns (uint256) {
        (uint256 balance,,,,,,) = lendingPool.getUserReserveData(token, address(this));
        return balance;
    }
}

interface IAaveLendingPool {
    function deposit(
        address asset,
        uint256 amount,
        address onBehalfOf,
        uint16 referralCode
    ) external;

    function withdraw(
        address asset,
        uint256 amount,
        address to
    ) external returns (uint256);

    function getUserReserveData(
        address asset,
        address user
    )
        external
        view
        returns (
            uint256 currentATokenBalance,
            uint256 currentStableDebt,
            uint256 currentVariableDebt,
            uint256 principalStableDebt,
            uint256 scaledVariableDebt,
            uint256 liquidityRate,
            uint40 stableBorrowRate
        );
}
