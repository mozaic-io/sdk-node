import { Amount, PaymentCycleEntry as RawPaymentCycleEntry } from "../../api"
import { BaseResource } from "../BaseResource";

export class PaymentCycleEntry extends BaseResource {
    
    /**
     * The ID of the payment cycle entry. This can be used to retrieve a payment cycle entry.
     */
    id: string;

    /**
     * The name of the contact receiving the payment from the payment cycle.
     */
    name: string;

    /**
     * The email of the contact receiving the payment from the payment cycle.
     */
    email: string;

    /**
     * An object representing the amount received by the user from the payment cycle.
     */
    amount: Amount;

    /**
     * The status of payment to the user for the payment cycle.
     */
    status: string;

    /**
     * The external ID of the payment recipient from the payment cycle.
     * This ID represents the user in an external system.
     */
    externalId: string | null | undefined;

    /**
     * A free text field containing user supplied information about the payment cycle.
     * This field has a maximum length of 140 characters.
     */
    memo: string | null | undefined;

    /**
     * The raw PaymentCycleEntry object that was returned from the API
     */
    rawObject: RawPaymentCycleEntry;

    /**
     * @internal
     * Internal use only. Please use the Mozaic object to utilize this object.
     * @param paymentCycleEntry 
     */
    constructor(paymentCycleEntry : RawPaymentCycleEntry) {
        super();

        this.rawObject = paymentCycleEntry;

        if(paymentCycleEntry.to === undefined)
            throw new Error("paymentCycleEntry.to is undefined");

        this.id = this.throwIfNullOrUndefined("paymentCycleEntry.id", paymentCycleEntry.id);
        this.name = this.throwIfNullOrUndefined("paymentCycleEntry.to.name", paymentCycleEntry.to.name);
        this.email = this.throwIfNullOrUndefined("paymentCycleEntry.to.email", paymentCycleEntry.to.email);
        this.amount = this.throwIfNullOrUndefined("paymentCycleEntry.original_amount", paymentCycleEntry.original_amount);
        this.status = this.throwIfNullOrUndefined("paymentCycleEntry.status", paymentCycleEntry.status);

        this.externalId = paymentCycleEntry.external_id;
        this.memo = paymentCycleEntry.memo?.substring(0, 140);
    }
}