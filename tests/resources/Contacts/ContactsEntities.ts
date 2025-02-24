import { faker } from '@faker-js/faker';
import { AccessPerspective, ContactInfo, ContactInfoListResponse, ContactStatusPersona, Payment, PaymentListResponse } from '../../../src/api';
import { RawAxiosRequestConfig } from 'axios';

export class ContactsEntities {

    static contactsSearch(limit: number, noPrimaryEmailAddresses: boolean = false): ContactInfoListResponse
    {
        if (limit == 0) {
            return {
                count: 0,
                data: [],
                page: 1,
                total_count: 0
            };
        }

        const data = new Array<ContactInfo>();

        for (let i = 0; i < limit - 1; i++) {
            data.push(
                ContactsEntities.getTestContactResponse()
            )
        }

        data.push({
            id: "needle-id",
            created_at: "4/8/2024",
            known_name: "Needle in a Haystack",
            first_name: "Nick",
            last_name: "Pirocanac",
            email_addresses: [{ address: "nick.pirocanac@mozaic.io", is_primary: !noPrimaryEmailAddresses }],
            external_id: "EXT-needle-id",
            contact_status: ContactStatusPersona.Accepted,
        });

        return {
            count: limit,
            data: data,
            page: 1,
            total_count: limit
        };
    }

    static getTestContactResponse(): ContactInfo {
        return {
            id: faker.string.uuid(),
            created_at: faker.date.past().toUTCString(),
            known_name: faker.person.fullName(),
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email_addresses: [{ address: faker.internet.email(), is_primary: true }],
            external_id: "EXT-" + faker.string.uuid(),
            contact_status: faker.helpers.arrayElement([ContactStatusPersona.Accepted, ContactStatusPersona.Invited, ContactStatusPersona.Rejected, ContactStatusPersona.RejectedButKeepInvite, ContactStatusPersona.Undefinded]),
        };
    }

}