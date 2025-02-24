import { Mozaic } from "../../../src";
import { ContactInfoListResponse, ContactsApi } from "../../../src/api";
import { Contact } from "../../../src/resources/Contacts/Contact";
import { TestUtils } from "../../TestUtils";
import { ContactsEntities } from "./ContactsEntities";

const sdk = new Mozaic(
  "http://mocked.mozaic.io",
  "mocked-pat-123456789"
);

jest.mock("../../../src/api");
const mockContactsApi = sdk.Contacts.ContactsApi as jest.Mocked<ContactsApi>;

describe("Contacts Tests", () => {
    it("contacts API should return a mocked list of contacts", async () => {

        mockContactsApi.contactsSearch.mockResolvedValue(
            TestUtils.createSuccessfulAxiosResponse(
                ContactsEntities.contactsSearch(10)
            ));

        const contacts = await sdk.Contacts.getContacts(10, 1);

        expect(contacts.count).toBe(10);
    });
    
    it("contacts should throw an exception when the term is greater than 50 characters", async () => {

        mockContactsApi.contactsSearch.mockResolvedValue(
            TestUtils.createSuccessfulAxiosResponse(
                ContactsEntities.contactsSearch(10)
            ));

        // No exception is expected here.
        await sdk.Contacts.getContacts(10, 1, "12345678901234567890123456789012345678901234567890");

        try {
            await sdk.Contacts.getContacts(10, 1, "123456789012345678901234567890123456789012345678901");
            fail("It didn't throw the exception.");
        }
        catch (ex) {
            expect(ex).toBeInstanceOf(Error);
        }
        
    });

    it("getContactByExternalId should return a contact with the specified external ID", async () => {
        mockContactsApi.contactsSearch.mockResolvedValue(
            TestUtils.createSuccessfulAxiosResponse(
                ContactsEntities.contactsSearch(1)
            ));

        const contact = await sdk.Contacts.getContactByExternalId("EXT-needle-id");

        expect(contact.externalId).toBe("EXT-needle-id");
    });

    it("getContactByExternalId should throw an exception if the contact is not found", async () => {
        mockContactsApi.contactsSearch.mockResolvedValue(
            TestUtils.createSuccessfulAxiosResponse(
                ContactsEntities.contactsSearch(0)
            ));

        try {
            await sdk.Contacts.getContactByExternalId("EXT-needle-id");
            fail("It didn't throw the exception.");
        }
        catch (ex) {
            expect(ex).toBeInstanceOf(Error);
        }
    });

    it("searchContacts should throw an error if a contact does not have a primary email address", async () => {
        mockContactsApi.contactsSearch.mockResolvedValue(
            TestUtils.createSuccessfulAxiosResponse(
                ContactsEntities.contactsSearch(1, true)
            ));

        try {
            await sdk.Contacts.getContactByExternalId("EXT-needle-id");
            fail("It didn't throw the exception.");
        }
        catch (ex) {
            expect(ex).toBeInstanceOf(Error);
        }
    });

    it("getContacts should return a an appropriate result when the API returns a null", async () => {
        mockContactsApi.contactsSearch.mockResolvedValue(
            TestUtils.createSuccessfulAxiosResponse(
                { data: null } as ContactInfoListResponse
            ));

        const contacts = await sdk.Contacts.getContacts(10, 1);

        expect(contacts.count).toBe(0);
    });
});