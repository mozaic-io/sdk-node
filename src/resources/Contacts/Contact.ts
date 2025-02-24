import { Mozaic } from "../..";
import { ContactsApi, PaymentCyclesApi, ContactInfo as RawContactInfo } from "../../api"
import { BaseResource } from "../BaseResource";
import { PaymentCycleEntry } from "../PaymentCycles/PaymentCycleEntry";
import { PaymentCycleEntryList } from "../PaymentCycles/PaymentCycleEntryList";
import { PaymentCycleList } from "../PaymentCycles/PaymentCycleList";
import { Payment } from "../Payments/Payment";
import { PaymentList } from "../Payments/PaymentList";

export class Contact extends BaseResource {
    private _mozaic: Mozaic;
    private _contactsApi: ContactsApi;

    /**
     * The ID of the contact. This can be used to retrieve a contact.
     */
    id: string;

    /**
     * The known name of the contact. This is the name that you have given the contact when you created it.
     */
    name: string;

    /**
     * The contact's email address
     */
    email: string;

    /**
     * The contact's status.
     */
    status: string;

    /**
     * The optional external ID of the payment recipient from the payment cycle.
     * This ID represents the user in an external system.
     */
    externalId: string | null | undefined;

    /**
     * The raw ContactInfo object that was returned from the API
     */
    rawObject: RawContactInfo;

    /**
     * @internal
     * Internal use only. Please use the Mozaic object to utilize this object.
     * @param contactInfo 
     */
    constructor(mozaic: Mozaic, contactsApi: ContactsApi, contactInfo : RawContactInfo) {
        super();

        this._mozaic = mozaic;
        this._contactsApi = contactsApi;

        this.rawObject = contactInfo;
        this.id = this.throwIfNullOrUndefined("contactInfo.id", contactInfo.id);
        this.name = this.throwIfNullOrUndefined("contactInfo.known_name", contactInfo.known_name);
        this.status = this.throwIfNullOrUndefined("contactInfo.status", contactInfo.contact_status);

        // Find the contact's primary email address.
        let emails = this.throwIfNullOrUndefined("contactInfo.email", contactInfo.email_addresses);
        let primaryEmail = emails.find((email) => email.is_primary === true)?.address;

        this.email = this.throwIfNullOrUndefined("contactInfo.email (no primary email)", primaryEmail);

        this.externalId = contactInfo.external_id;
    }

    /** 
     * Returns a list of payments that have been sent to this contact. From these payments, you can see the payment cycle that the payment was sent from.
     * Note that only payments that have been sent to this contact will be returned. Payments that have been sent from a payment cycle that is
     * still in Draft status will not be returned because they have not been created yet. 
     * @param limit An integer number between 1 and 100.
     * @param page An integer number of the page starting at 1.
     */

    async getPayments(limit: number, page: number): Promise<PaymentList> {
        const result = await this.execute(() => this._contactsApi.getPayments(
            this.id,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            limit,
            page,
            undefined,
            undefined));
        
        let data = result.data?.map((value) => new Payment(this._mozaic, value));

        if (data === undefined)
            data = [];

        return new PaymentList(result, data);
    }
}