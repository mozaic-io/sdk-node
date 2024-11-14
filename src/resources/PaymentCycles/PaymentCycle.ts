import { Mozaic } from "../..";
import { Amount, FeeDirection, PaymentCycle as RawPaymentCycle, PaymentCycleStatus, PaymentCyclesApi, PaymentCycleEntryCreateDeets, Wallet, Invoice } from "../../api";
import { ApiException } from "../ApiException";
import { BaseResource } from "../BaseResource";
import { WalletItem } from "../Wallets/WalletItem";
import { PaymentCycleEntry } from "./PaymentCycleEntry";
import { PaymentCycleEntryList } from "./PaymentCycleEntryList";

/**
 * A payment cycle
 */
export class PaymentCycle extends BaseResource {

    private _paymentCycleApi: PaymentCyclesApi;
    private _mozaic: Mozaic;

    /**
     * The long ID of the payment cycle. This can be used to retrieve a payment cycle. 
     */
    readonly paymentCycleId: string;

    /**
     * The current status of the payment cycle. 
     */
    readonly status: PaymentCycleStatus | undefined;

    /**
     * The total amount of money that will be paid out by the payment cycle.
     */
    readonly amount: Amount | undefined;

    /**
     * The total amount of fees that will be paid on the payment cycle.
     */
    readonly fees: Amount | undefined;

    /**
     * The short ID of the payment cycle. Use this for a human readable version of the Payment Cycle ID. 
     * This can also be used to retrieve a payment cycle.
     */
    readonly shortId: string | null | undefined;

    /**
     * The number of payment cycle entries attached to the payment cycle.
     */
    readonly paymentCycleEntryCount: number | undefined;

    /**
     * A fee direction indicating who will pay the fees on a transaction.
     * 
     * default = Use the setting defined in the paying user's account settings
     * 
     * payer = The paying user also pays the fees
     * 
     * payee = The receiving user pays the fees
     * 
     * split = The payer and the receiver will split the fees equally
     * 
     */
    feeDirection: FeeDirection | undefined;

    /**
     * The payer can specify a free-text string to help describe the reason for the payment
     */
    memo: string | null | undefined;

    /**
     * The starting date of the accounting period of the payment cycle
     */
    accountingFrom: Date | undefined;

    /**
     * The ending date of the accounting period of the payment cycle
     */
    accountingTo: Date | undefined;

    /**
     * The name of the payment cycle
     */
    name: string;

    /**
     * The ID of the invoice. This will only be present after the payment cycle has been finalized.
     */
    invoiceId: string | null | undefined;

    /**
     * The underlying raw object returned from the API
     */
    rawObject: RawPaymentCycle;

    /**
     * @internal
     * Internal use only. Please use the Mozaic object to utilize this object.
     * @param paymentCycleApi 
     * @param paymentCycle 
     */
    constructor(mozaic: Mozaic, paymentCycleApi: PaymentCyclesApi, paymentCycle: RawPaymentCycle) {
        super();

        this._mozaic = mozaic;
        this._paymentCycleApi = paymentCycleApi;
        
        this.rawObject = paymentCycle;

        this.paymentCycleId = this.throwIfNullOrUndefined("paymentCycle.id", paymentCycle.id);

        this.status = this.throwIfNullOrUndefined("paymentCycle.status", paymentCycle.status);
        this.amount = paymentCycle.amount;
        this.fees = paymentCycle.fees;
        this.shortId = this.throwIfNullOrUndefined("paymentCycle.short_id", paymentCycle.short_id);

        this.paymentCycleEntryCount = paymentCycle.total_entries;
        this.feeDirection = paymentCycle.fee_direction;
        this.memo = paymentCycle.memo;

        if (paymentCycle.accounting_from !== null)
            this.accountingFrom = new Date(paymentCycle.accounting_from ?? "");

        if (paymentCycle.accounting_to !== null)
            this.accountingTo = new Date(paymentCycle.accounting_to ?? "");

        this.name = this.throwIfNullOrUndefined("paymentCycle.name", paymentCycle.name);
        this.invoiceId = paymentCycle.invoice_id;
    }

    /**
     * Adds a payment cycle entry to the current payment cycle. The payment cycle entry pays the given user the specified amount.
     * @param name The first and last name of the user to pay.
     * @param email The email address of the user to pay. If the user has not already joined Mozaic, they will be sent an email invite to join.
     * @param amount The amount of money to be paid to the user.
     * @param currency The currency that the amount will be paid in. Foreign exchange rates may apply to cross-boarder payments.
     */
    async addPaymentCycleEntry(name: string, email: string, amount: number, currency: string): Promise<PaymentCycleEntry> {
        const deets: PaymentCycleEntryCreateDeets = {
            to: {
                name: name,
                email: email
            },
            original_amount: {
                currency: currency,
                quantity: amount
            }
        };

        const result = await this._paymentCycleApi.createPaymentCycleEntry(this.paymentCycleId, deets);

        this.throwIfServerResponseIsNot200(result);

        return new PaymentCycleEntry(result.data);
    }

    /**
     * Gets payment cycle entries for the payment cycle. Use limit and page to page through
     * the results for large data sets.
     * @param limit The number of records in a page from 1 - 100
     * @param page The number of the page, starts at 1
     * @returns 
     */
    async getPaymentCycleEntries(limit: number, page: number) : Promise<PaymentCycleEntryList> {
        this.throwIfLimitOrPageAreInvalid(limit, page);

        const result = await this._paymentCycleApi.listPaymentCycleEntries(this.paymentCycleId, undefined, undefined, undefined, limit, page, undefined, undefined);

        this.throwIfServerResponseIsNot200(result);

        const data = result.data.data?.map((value, index) => new PaymentCycleEntry(value));

        return new PaymentCycleEntryList(result.data, data);
    }

    /**
     * Completes the payment cycle by withdrawing money from your specified wallet item and then 
     * distributing it to recipients on the payment cycle. 
     * @param walletItem The source of funding for the payment cycle. This must be a Payment wallet item and 
     * not a Payout wallet item.
     * @returns 
     */
    async finalize(walletItem: WalletItem) : Promise<PaymentCycle> {

        var wallets = await this._mozaic.Wallets.getWallets();
        var existingPaymentMethod = wallets.find((value) => {
            return value.paymentMethods.find((pm) => {
                if(pm.paymentMethodId == walletItem.paymentMethodId)
                    return walletItem;
            })
        })

        if(existingPaymentMethod === undefined)
            throw Error("An invalid payment method id was selected. You must use a valid payment method. (Did you select a payout method by mistake?)");

        const result = await this._paymentCycleApi.finalizePaymentCycleEntry(this.paymentCycleId, {
            auto_advance: true,
            payment_method_id: walletItem.paymentMethodId
        });

        this.throwIfServerResponseIsNot200(result);

        return new PaymentCycle(this._mozaic, this._paymentCycleApi, result.data);
    }

    /**
     * Retrieves an invoice for this payment cycle. Note that an invoice is not generated for a payment
     * cycle until it has been finalized. 
     * 
     * @returns an ArrayBuffer containing the bytes of an Invoice PDF. It can be saved using:
     * 
     * ```fs.writeFileSync(fileName, Buffer.from(arrayBuffer));```
     */
    async getInvoice() : Promise<ArrayBuffer> {

        let invoiceId = this.invoiceId ?? "";

        if(invoiceId === "")
            throw new Error("There isn't an invoice assigned to this payment cycle yet. Please finalize the payment cycle to receive an invoice.");

        return this._mozaic.Invoices.getInvoice(invoiceId);
    }
}