import { faker } from '@faker-js/faker';
import { FeeDirection, PaymentCycle, PaymentCycleEntry, PaymentCycleEntryCreateDeets, PaymentCycleEntryListResponse, PaymentCycleFinalizeDeets, PaymentCycleListResponse, PaymentCycleStatus } from "../../../src/api";

export class PaymentCyclesEntities {

    static finalizePaymentCycleEntry(id: string, paymentCycleFinalizeDeets?: PaymentCycleFinalizeDeets): PaymentCycle {

        var paymentCycle = PaymentCyclesEntities.getTestPaymentCycleResponse(
            "test cycle", "default", "This is a memo", new Date("1/1/2024"), new Date("1/31/2024"), "draft");

        paymentCycle.status = "invoicing";
        paymentCycle.invoice_id = "invoice_12345678";

        return paymentCycle;
    }

    static listPaymentCycleEntries(id: string, limit: number, page: number): PaymentCycleEntryListResponse {
        const data = new Array<PaymentCycleEntry>();

        for (let i = 0; i < limit; i++) {
            data.push(
                PaymentCyclesEntities.getTestPaymentCycleEntryResponse(id, {
                    to: {
                        name: faker.person.fullName(),
                        email: faker.internet.email()
                    },
                    original_amount: {
                        quantity: faker.helpers.rangeToNumber({ min: 100, max: 200 }),
                        currency: faker.helpers.arrayElement(["USD", "GBP", "EUR", "MEX", "CAD"])
                    }
                })
            )
        }

        return {
            count: limit,
            data: data,
            page: page,
            total_count: 10
        };
    }

    static listPaymentCycles(limit: number, page: number, nameIsNull: boolean): PaymentCycleListResponse {
        const data = new Array<PaymentCycle>();

        for (let i = 0; i < limit; i++) {
            let name = nameIsNull ? null : faker.person.fullName();
            data.push(
                PaymentCyclesEntities.getTestPaymentCycleResponse(
                    name,
                    faker.helpers.arrayElement([FeeDirection.Default, FeeDirection.Payee, FeeDirection.Payer, FeeDirection.Split]),
                    faker.lorem.word(10),
                    faker.date.past(),
                    faker.date.future(),
                    "draft"
                )
            );
        }

        return {
            count: data.length,
            page: page,
            data: data,
            total_count: data.length
        };
    }

    static getTestPaymentCycleEntryResponse(id: string, deets: PaymentCycleEntryCreateDeets | undefined): PaymentCycleEntry {
        const returnValue: PaymentCycleEntry = {
            "to": {
                "handle": null,
                "email": deets?.to?.email,
                "phone": null,
                "name": deets?.to?.name ?? "",
                "persona_id": null,
                "user_id": null,
                "user_account_id": null,
                "short_id": null,
                "id": null,
                "created_at": "0001-01-01T00:00:00"
            },
            "account_id": "e963663c-5618-4534-ba27-d32d6d0d0211",
            "payment_cycle_id": "payment-cycle_8bvI67HBcU6tV88880XlIQ",
            "status": "draft",
            "fees": [
                {
                    "order": 0,
                    "type": null,
                    "amount": {
                        "currency": "USD",
                        "wallet_id": null,
                        "quantity": 1.0,
                        "localized_formatted_quantity": "1.00"
                    },
                    "memo": "Fee 1",
                    "external_id": null
                }
            ],
            "gross_amount": {
                "currency": "USD",
                "wallet_id": null,
                "quantity": 201.0,
                "localized_formatted_quantity": "201.00"
            },
            "original_amount": {
                "currency": deets?.original_amount?.currency,
                "wallet_id": null,
                "quantity": deets?.original_amount?.quantity,
                "localized_formatted_quantity": "MOCKED VALUE"
            },
            "amount": {
                "currency": "MOCKED",
                "wallet_id": null,
                "quantity": 123.12345,
                "localized_formatted_quantity": "200.00"
            },
            "memo": null,
            "persona_id": "910a2d82-b419-4aeb-aa6e-1d6c1dc5ec10",
            "payment_id": null,
            "short_id": "M3B6-1RJB",
            "id": "payment-cycle-entry_X_E8888PJk-MlP6nQyd2Jg",
            "created_at": "2024-11-10T06:06:21.0092257Z"
        }

        return returnValue;
    }

    static getTestPaymentCycleResponse(name: string | null, feeDirection: FeeDirection, memo: string, accountingFromDateUtc: Date, accountingToDateUtc: Date, status: PaymentCycleStatus): PaymentCycle {

        let includeInvoiceId = false;

        switch (status) {
            case 'completed':
            case 'completedWithErrors':
            case 'invoicing':
            case 'processing':
                includeInvoiceId = true;
                break;
        }

        return {
            account_id: "e963663c-5618-4534-ba27-d32d6d0d0211",
            invoice_id: includeInvoiceId ? "invoice_123454567" : undefined,
            fee_direction: feeDirection,
            memo: memo,
            status: "draft",
            amount: undefined,
            original_amount: undefined,
            fees: undefined,
            accounting_from: accountingFromDateUtc.toUTCString(),
            accounting_to: accountingToDateUtc.toUTCString(),
            from: {
                handle: null,
                email: "nick.pirocanac@mozaic.io",
                phone: "",
                name: "",
                persona_id: null,
                user_id: "80bd9b52-7ce3-4c91-a3f5-3a1b4336ddac",
                user_account_id: "e963663c-5618-4534-ba27-d32d6d0d0211",
                short_id: null,
                id: null,
                created_at: "0001-01-01T00:00:00",
            },
            total_entries: 0,
            payment_date: null,
            name: name,
            short_id: "NF13-8888",
            id: "payment-cycle_tWB7BiTh-kWIM1__k-tAag",
            created_at: "2024-11-09T05:21:22.3183077Z",
        };
    }
}