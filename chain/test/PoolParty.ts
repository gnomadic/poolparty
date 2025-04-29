// Language: typescript
import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { bigint } from "hardhat/internal/core/params/argumentTypes";

describe("PoolParty", function () {

    async function deployParty() {
        const [owner, addr1, addr2] = await ethers.getSigners();

        const PoolTicketFactory = await ethers.getContractFactory("PoolTicket");
        const poolTicket = await PoolTicketFactory.deploy();

        const PoolParty = await ethers.getContractFactory("PoolParty");
        const poolParty = await PoolParty.deploy(await poolTicket.getAddress());

        // const Mock20 = await ethers.getContractFactory("MockERC20");
        // const mock20 = await Mock20.deploy();

        const MockYield = await ethers.getContractFactory("MockYieldFarm");
        const mockYield = await MockYield.deploy();

        
            await poolParty.createPool(
                1 * 10 ** 18,
                60 * 24 * 7,
                await mockYield.getAddress()
            );
        

        return { poolParty, poolTicket, mockYield, owner, addr1, addr2 };
    }

    describe("Pool Management", function () {

        it("should allow the owner to create a party", async function () {
            const { poolParty, poolTicket, owner, addr1, addr2 } = await loadFixture(deployParty);
        });

    });

    describe("User flow", function () {


    });

});