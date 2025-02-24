import { faker } from '@faker-js/faker';
import { AccessPerspective, ContactInfo, ContactInfoListResponse, ContactStatusPersona, Payment, PaymentListResponse } from '../../../src/api';
import { RawAxiosRequestConfig } from 'axios';

export class PaymentsEntities {

    static getPayment(
        useNullEmail: boolean = false,
        useUndefinedPaymentSource: boolean = false,
        useUndefinedToBlock: boolean = false): Payment
    {
        return {
            id: faker.string.uuid(),
            created_at: faker.date.past().toUTCString(),
            amount: {
                quantity: faker.number.int(100),
                currency: faker.helpers.arrayElement(["USD", "GBP", "EUR", "MEX", "CAD"])
            },
            status: faker.helpers.arrayElement(["paid", "failed", "pending"]),
            payment_cycle_id: faker.string.uuid(),
            payment_source: useUndefinedPaymentSource ? undefined : {
                id: faker.string.uuid(),
                payment_source: "payment-cycle",
                payment_cycle_entry_id: faker.string.uuid()
            },
            to: useUndefinedToBlock ? undefined : {
                id: faker.string.uuid(),
                
                created_at: faker.date.past().toUTCString(),
                name: faker.person.fullName(),
                email: useNullEmail ? null : faker.internet.email(),
                external_id: "EXT-" + faker.string.uuid(),
                persona_id: faker.string.uuid(),
            }
        }
    }
}