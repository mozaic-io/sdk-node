import { Mozaic } from "../../../src";
import { ContactsApi, PaymentListResponse } from "../../../src/api";
import { Contact } from "../../../src/resources/Contacts/Contact";
import { TestUtils } from "../../TestUtils";
import { ContactEntities } from "./ContactEntities";
import { ContactsEntities } from "./ContactsEntities";

const sdk = new Mozaic(
  "http://mocked.mozaic.io",
  "mocked-pat-123456789"
);

jest.mock("../../../src/api");
const mockContactsApi = sdk.Contacts.ContactsApi as jest.Mocked<ContactsApi>;

describe("Contact Tests", () => {
    it("Contact should return a mocked list of payments", async () => {

        mockContactsApi.getPayments.mockResolvedValue(
            TestUtils.createSuccessfulAxiosResponse(
                ContactEntities.getPayments(10)
            ));
        
        mockContactsApi.contactsSearch.mockResolvedValue(
            TestUtils.createSuccessfulAxiosResponse(
                ContactsEntities.contactsSearch(10)
            ));

        const contact = await sdk.Contacts.getContactByExternalId("a single contact");

        expect(contact).not.toBeNull();

        const payments = await contact.getPayments(10, 1);

        expect(payments.count).toBe(10);
    });

    it("Contact.getPayments should return an appropriate response when the API returns a null result", async () => {

        mockContactsApi.getPayments.mockResolvedValue(
            TestUtils.createSuccessfulAxiosResponse(
                { data: null } as PaymentListResponse
            ));

        mockContactsApi.contactsSearch.mockResolvedValue(
            TestUtils.createSuccessfulAxiosResponse(
                ContactsEntities.contactsSearch(10)
            ));

        const contact = await sdk.Contacts.getContactByExternalId("a single contact");

        expect(contact).not.toBeNull();

        const payments = await contact.getPayments(10, 1);

        expect(payments.count).toBe(0);
    });
});