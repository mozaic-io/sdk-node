import { faker } from '@faker-js/faker';
import { AccessPerspective, ContactInfo, ContactInfoListResponse, ContactStatusPersona, Payment, PaymentListResponse } from '../../../src/api';
import { RawAxiosRequestConfig } from 'axios';

export class ContactEntities {
    
    static getPayments(limit: number): PaymentListResponse {
        const data = new Array<Payment>();

        for (let i = 0; i < limit; i++) {
            data.push(
                ContactEntities.getTestPayment()
            )
        }

        return {
            count: limit,
            data: data,
            page: 1,
            total_count: limit
        }
    }

    static getTestPayment(): Payment {
        return {
            id: faker.string.uuid(),
            created_at: faker.date.past().toUTCString(),
            amount: {
                quantity: faker.number.int(100),
                currency: faker.helpers.arrayElement(["USD", "GBP", "EUR", "MEX", "CAD"])
            },
            status: faker.helpers.arrayElement(["paid", "failed", "pending"]),
            payment_cycle_id: faker.string.uuid(),
            payment_source: {
                id: faker.string.uuid(),
                payment_source: "payment-cycle",
                payment_cycle_entry_id: faker.string.uuid()
            },
            to: {
                id: faker.string.uuid(),
                
                created_at: faker.date.past().toUTCString(),
                name: faker.person.fullName(),
                email: faker.internet.email(),
                external_id: "EXT-" + faker.string.uuid(),
                persona_id: faker.string.uuid(),

            }
        }
    }
}