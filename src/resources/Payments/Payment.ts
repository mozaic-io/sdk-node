import { Mozaic } from "../..";
import { Amount, Payment as RawPayment } from "../../api"
import { BaseResource } from "../BaseResource";
import { PaymentCycle } from "../PaymentCycles/PaymentCycle";
import { PaymentCycleEntry } from "../PaymentCycles/PaymentCycleEntry";

export class Payment extends BaseResource {
    private _mozaic: Mozaic;

    /**
     * The ID of the payment. This can be used to retrieve a payment.
     */
    id: string;

    /**
     * The recipient's email address. This is the email address at the time the payment was sent.
     * If the email address has changed, this will be the old email address.
     */
    email: string;

    /**
     * The status of the payment. Refer to the API documentation for a list of possible statuses.
     */
    status: string;

    /**
     * The amount of the payment
     */
    amount: Amount;

    /**
     * If the payment was sent from a payment cycle, then this is the ID of the payment cycle. Otherwise, it will be null.
     */
    paymentCycleId: string | undefined | null;

    /**
     * If the payment was sent from a payment cycle, then this is the ID of the payment cycle entry. Otherwise, it will be null.
     */
    paymentCycleEntryId: string | undefined | null;

    /** 
     * An optional free text field containing user supplied information about the payment.
     * This field has a maximum length of 140 characters.
     */
    memo: string | null | undefined;

    /**
     * The raw ContactInfo object that was returned from the API
     */
    rawObject: RawPayment;

    /**
     * @internal
     * Internal use only. Please use the Mozaic object to utilize this object.
     */
    constructor(mozaic: Mozaic, payment: RawPayment) {
        super();

        this._mozaic = mozaic;

        this.rawObject = payment;

        if(payment.to === undefined)
            throw new Error("payment.to is undefined");

        // Required fields
        this.id = this.throwIfNullOrUndefined("payment.id", payment.id);
        this.email = this.throwIfNullOrUndefined("payment.email", payment.to.email);
        this.status = this.throwIfNullOrUndefined("payment.status", payment.status);
        this.amount = this.throwIfNullOrUndefined("payment.amount", payment.amount);

        //  Optional fields
        if (payment.payment_source?.payment_source == "payment-cycle") {
            this.paymentCycleId = payment.payment_source.id;
            this.paymentCycleEntryId = payment.payment_source.payment_cycle_entry_id;
        }

        this.memo = payment.memo;
    }

    /**
     * Returns the payment cycle entry that this payment was sent from. If the payment was not sent from a payment cycle, then this will be null.
     * @returns {PaymentCycleEntry | null}
     */
    async getPaymentCycleEntry(): Promise<PaymentCycleEntry | null> {
        if (this.paymentCycleEntryId == null)
            return null;

        return await this._mozaic.PaymentCycles.getPaymentCycleEntry(this.paymentCycleEntryId);
    }

    /**
     * Returns the payment cycle that this payment was sent from. If the payment was not sent from a payment cycle, then this will be null.
     * @returns {PaymentCycle | null}
     */
    async getPaymentCycle(): Promise<PaymentCycle | null> {
        if (this.paymentCycleId == null)
            return null;

        return await this._mozaic.PaymentCycles.getPaymentCycle(this.paymentCycleId);
    }
}