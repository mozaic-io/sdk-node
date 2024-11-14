import { Expiration, PaymentMethod, PayoutMethod } from "../../api";

export class WalletItem {
    /**
     * The external provider ID for this payment instrument
     */
    paymentMethodId: string;

    /**
     * The type of the payment instrument. Can be Card, Bank, etc. Provider specific.
     */
    type: string;

    /**
     * The last four digits of the card or account.
     */
    lastFour: string;

    /**
     * If the payment instrument is the default instrument for the currency.
     */
    default: boolean;

    /**
     * The vendor of the payment instrument, example: Visa, MasterCard, etc. Provider specific.
     */
    brand: string;

    /**
     * An object representing the expiration date of the payment instrument. 
     */
    expiration: Expiration; 

    /**
     * A bank account name (for bank account payment instruments, not set for Cards)
     */
    name: string;

    /**
     * @internal - Please use the Mozaic.Wallet resource to access this object.
     * @param source The raw payment method from the API
     */
    constructor(source: PaymentMethod);

    /**
     * @internal - Please use the Mozaic.Wallet resource to access this object.
     * @param source The raw payout method from the API
     */
    constructor(source: PayoutMethod);

    constructor(source: PaymentMethod | PayoutMethod)
    {
        this.paymentMethodId = source.external_id ?? "";
        this.lastFour = source.last_four ?? "";
        this.default = source.default_for_currency ?? false;
        this.brand = source.brand ?? "";
        this.expiration = source.exp ?? {};
        this.name = source.account_bank_name ?? "";

        if("payment_method_type" in source )
            this.type = (source as PaymentMethod).payment_method_type ?? "";
        else
            this.type = (source as PayoutMethod).payout_method_type ?? "";
    }

}