import { Wallet } from "../../../src/resources/Wallets/Wallet";

describe("Wallet Tests", () => {

    it("Wallet should set id and key to empty if an invalid wallet is passed, then throw an exception for an invalid wallet type", async () => {

        try {
            let wallet = new Wallet({});

            fail("It didn't throw the exception.");
        }
        catch (ex) {
            expect(ex).toBeInstanceOf(Error);
            expect((ex as Error).message).toBe("Unknown wallet type");
        }

    });

    it("Wallet should set payment and payout arrays to [] if they are undefined in the raw data", async () => {

        let wallet = new Wallet({id: "walletID", key: "prov1-123456778"});

        expect(wallet.paymentMethods.length).toBe(0);
        expect(wallet.payoutMethods.length).toBe(0);

    });
    
});