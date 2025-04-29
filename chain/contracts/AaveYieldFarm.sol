// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IYieldFarm} from "./interfaces/IYieldFarm.sol";
import {IAaveLendingPool} from "./interfaces/IAaveLendingPool.sol";

contract AaveYieldFarm is IYieldFarm, Ownable {
    IAaveLendingPool public lendingPool;
    address public immutable asset;

    constructor(address _lendingPool, address _asset) Ownable(msg.sender) {
        lendingPool = IAaveLendingPool(_lendingPool);
        asset = _asset;
    }

    function deposit(uint256 amount) external override onlyOwner {
        IERC20(asset).approve(address(lendingPool), amount);
        lendingPool.deposit(asset, amount, address(this), 0);
    }

    function withdraw(uint256 amount) external override onlyOwner {
        lendingPool.withdraw(asset, amount, address(this));
    }

    function totalYield() external view override returns (uint256) {
        return IERC20(asset).balanceOf(address(this));
    }
}
