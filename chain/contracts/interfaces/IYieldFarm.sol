// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IYieldFarm {
    function deposit(uint256 amount) external;

    function withdraw(uint256 amount) external;

    function totalYield() external view returns (uint256);
}
