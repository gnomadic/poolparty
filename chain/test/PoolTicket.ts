// Language: typescript
import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("PoolTicket", function () {

    async function deployTicket() {
        const [owner, addr1, addr2] = await ethers.getSigners();
        const PoolTicketFactory = await ethers.getContractFactory("PoolTicket");
        const poolTicket = await PoolTicketFactory.deploy();

        return { poolTicket, owner, addr1, addr2 };
    }

    describe("Minting", function () {

        it("should allow the owner to mint a token", async function () {
            const { poolTicket, owner, addr1, addr2 } = await loadFixture(deployTicket);

            const poolId = 42;
            const tx = await poolTicket.mint(await owner.getAddress(), poolId);
            const receipt = await tx.wait();
            const tokenId = await tx.wait().then((receipt: any) => receipt.logs[0].args.tokenId || 0);

            // Since nextTokenId starts at 0, tokenId should be 0
            expect(tokenId).to.equal(0);

            // Verify token owner and mapping
            expect(await poolTicket.ownerOf(tokenId)).to.equal(await owner.getAddress());
            expect(await poolTicket.ticketToPool(tokenId)).to.equal(poolId);
            expect(await poolTicket.nextTokenId()).to.equal(1);



        });

        it("should track the pool associated with the minted token", async function () {
            const { poolTicket, owner, addr1, addr2 } = await loadFixture(deployTicket);
            for (let i = 0; i < 10; i++) {
                let poolId = 100;
                let tx = await poolTicket.mint(await owner.getAddress(), poolId);
                let tokenId = await tx.wait().then((receipt: any) => receipt.logs[0].args.tokenId || 0);
                let poolIdFromMapping = await poolTicket.ticketToPool(tokenId);
                expect(poolIdFromMapping).to.equal(poolId);
            }
        });

        it("should not allow a non-owner to mint a token", async function () {
            const { poolTicket, owner, addr1, addr2 } = await loadFixture(deployTicket);

            await expect(poolTicket.connect(addr1).mint(await addr1.getAddress(), 1))
                .to.be.reverted;
        });
    });

    describe("Burning", function () {


        it("should allow the owner to burn a token", async function () {
            const { poolTicket, owner, addr1, addr2 } = await loadFixture(deployTicket);

            const poolId = 100;
            const mintTx = await poolTicket.mint(await owner.getAddress(), poolId);
            const tokenId = await mintTx.wait().then((receipt: any) => receipt.logs[0].args.tokenId || 0);

            // Confirm the token exists
            expect(await poolTicket.ownerOf(tokenId)).to.equal(await owner.getAddress());

            // Burn the token
            await poolTicket.burn(tokenId);

            // Verify that ownerOf reverts after burn
            await expect(poolTicket.ownerOf(tokenId)).to.be.reverted;

            // Verify mapping ticketToPool entry is deleted (default 0)
            expect(await poolTicket.ticketToPool(tokenId)).to.equal(0);
        });

        it("should not allow a non-owner to burn a token", async function () {
            const { poolTicket, owner, addr1, addr2 } = await loadFixture(deployTicket);

            const poolId = 200;
            const mintTx = await poolTicket.mint(await owner.getAddress(), poolId);
            const tokenId = await mintTx.wait().then((receipt: any) => receipt.logs[0].args.tokenId || 0);

            await expect(poolTicket.connect(addr1).burn(tokenId))
                .to.be.reverted;
        });
    });
});
