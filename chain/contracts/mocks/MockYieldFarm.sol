// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IYieldFarm} from "../interfaces/IYieldFarm.sol";

contract MockYieldFarm is IYieldFarm {
    uint256 public depositCounter;
    uint256 public withdrawCounter;

    function deposit(uint256 amount) external {
        depositCounter += amount;
    }

    function withdraw(uint256 amount) external {
        withdrawCounter -= amount;
    }

    function totalYield() external view returns (uint256) {
        return 100;
    }
}
