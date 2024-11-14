import { PaymentMethod, PayoutMethod } from "../../../src/api";
import { WalletItem } from "../../../src/resources/Wallets/WalletItem";

describe("Wallet Item Tests", () => {

    it("WalletItem should have empty strings for undefined properties", async () => {

        let walletItem = new WalletItem({payment_method_type: undefined} as PaymentMethod);

        expect(walletItem.paymentMethodId).toBe("");
        expect(walletItem.lastFour).toBe("");
        expect(walletItem.default ).toBe(false);
        expect(walletItem.brand).toBe("");
        expect(walletItem.expiration).toStrictEqual({});
        expect(walletItem.name).toBe("");
        expect(walletItem.type).toBe("");

        walletItem = new WalletItem({payout_method_type: undefined} as PayoutMethod);

        expect(walletItem.paymentMethodId).toBe("");
        expect(walletItem.lastFour).toBe("");
        expect(walletItem.default ).toBe(false);
        expect(walletItem.brand).toBe("");
        expect(walletItem.expiration).toStrictEqual({});
        expect(walletItem.name).toBe("");
        expect(walletItem.type).toBe("");
    });

    
    
});