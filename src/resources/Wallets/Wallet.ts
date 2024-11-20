import { Wallet as RawWallet } from "../../api";
import { WalletItem } from "./WalletItem";

export class Wallet {

    /**
     * The unique mozaic ID of the wallet
     */
    id: string;

    /**
     * The provider type that is providing the wallet to Mozaic
     */
    key: string;

    /**
     * The payment instruments you have registered in the wallet. These can be 
     * used to send money and fund Payment Cycles.
     */
    paymentMethods: WalletItem[];

    /**
     * The payout instruments you have registered in the wallet. These can be used
     * to move money from Mozaic and into your bank account.
     */
    payoutMethods: WalletItem[];

    /**
     * @internal Please use Mozaic.Wallets to interact with the Wallet object.
     * @param source The raw wallet data that is returned from the Mozaic API.
     */
    constructor(source: RawWallet) {
        this.id = source.id ?? "";
        this.key = source.key ?? "";

        if(this.key === "")
            throw new Error("Unknown wallet type");

        this.paymentMethods = source.payment_methods?.map((value) => new WalletItem(value)) ?? [];
        this.payoutMethods = source.payout_methods?.map((value) => new WalletItem(value)) ?? [];
    }
}