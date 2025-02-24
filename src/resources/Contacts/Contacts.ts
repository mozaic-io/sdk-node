/**
 * This is the main entry point for working with Payment Cycles. 
 * @group ResourcesGroup
 * @category ResourcesCat
 * @document ../../../documents/resources/PaymentCycles.md
 */

import { Mozaic } from "../..";
import { Configuration, ContactsApi, ContactStatusPersona } from "../../api";
import { MozaicError } from "../MozaicError";
import { BaseResource } from "../BaseResource";
import { Contact } from "./Contact";
import { ContactList } from "./ContactList";
import { PaymentCycles } from "../PaymentCycles/PaymentCycles";

export class Contacts extends BaseResource {
    private _mozaic: Mozaic;
    private _contactsApi: ContactsApi;

    /**
     * @internal
     * You should not call this constructor directly. Instead, use the Mozaic main 
     * entry point to get access to the SDK classes.
     * @param configuration 
     */
    constructor(mozaic: Mozaic, configuration: Configuration) {
        super();
        this._mozaic = mozaic;
        this._contactsApi = new ContactsApi(configuration);
    }

    /**
     * Get the underlying API for direct calls to the Mozaic API.
     */
    get ContactsApi() {
        return this._contactsApi;
    }

    /** 
     * Get a contact by external ID. If you have more than one contact with the same external ID,
     * this will return the first contact that matches the external ID. Use getContacts to return all
     * contacts with the same external ID.
     * @param externalId The external ID of the contact to retrieve. This ID represents the user in an external system.
     * @returns A contact that matches the external ID.
     */
    async getContactByExternalId(externalId: string): Promise<Contact> {
        const result = await this.getContacts(1, 1, undefined, externalId);

        if (result.data.length == 0) {
            throw new Error(`No contact found with external ID ${externalId}`);
        }

        return result.data[0];
    }

    /** 
     * Searches for a contact using various search parameters.
     * @param limit The number of items to return per page. Must be between 1 and 100 inclusive.
     * @param page The page number to return. Must be greater than 0.
     * @param term The search term to use. This will search the known name (the name you gave the contact), first name, last name, external ID, and email address of the contact. This parameter is limited to 50 chars max.
     * @param externalId The external ID of the contact to retrieve. This ID represents the user in an external system.
     * @param sinceUTC The date and time to use as a filter. This will return all contacts that were created or updated after this date and time.
     * @param contactStatus An array of contact statuses. Contacts with a status in this array will be returned. 
     * @returns A list of contacts that match the search criteria.
     */
    public async getContacts(limit: number, page: number, term?: string, externalId?: string, sinceUTC?: string, contactStatus?: Array<ContactStatusPersona>): Promise<ContactList> {
        
        if (term != null && term.length > 50)
            throw new Error("The search term is limited to 50 characters.");
        
        const result = await this.execute(() => this._contactsApi.contactsSearch(
            term,
            externalId,
            sinceUTC,
            undefined,
            undefined,
            undefined,
            undefined,
            contactStatus,
            undefined,
            undefined,
            limit,
            page,
            undefined,
            undefined
        ));

        var contacts = result.data?.map(p => new Contact(this._mozaic, this._contactsApi, p));

        if (contacts == null)
            contacts = [];

        return new ContactList(result, contacts);
    }
}