import { RawAxiosRequestConfig } from "axios";
import { Mozaic } from "../../../src";
import { PaymentCycleEntryCreateDeets, PaymentCyclesApi, PaymentsApi } from "../../../src/api";
import { Contact } from "../../../src/resources/Contacts/Contact";
import { TestUtils } from "../../TestUtils";
import { PaymentCyclesEntities } from "../PaymentCycles/PaymentCyclesEntities";
import { PaymentsEntities } from "./PaymentsEntities";

const sdk = new Mozaic(
  "http://mocked.mozaic.io",
  "mocked-pat-123456789"
);

jest.mock("../../../src/api");
const mockPaymentsApi = sdk.Payments.PaymentsApi as jest.Mocked<PaymentsApi>;
const mockPaymentCyclesApi = sdk.PaymentCycles.PaymentCyclesApi as jest.Mocked<PaymentCyclesApi>;

describe("Payments Tests", () => {
    it("payments API should return a mocked payment", async () => {

        mockPaymentsApi.getPayment.mockResolvedValue(
            TestUtils.createSuccessfulAxiosResponse(
                PaymentsEntities.getPayment()
            ));

        const payment = await sdk.Payments.getPayment("some test payment id");

        expect(payment).not.toBe(null);
    });

    it("getPayment should throw an exception if the payment is not found", async () => {
        mockPaymentsApi.getPayment.mockResolvedValue(
            TestUtils.createFailedAxiosResponse(
                "Not found"
            ));

        try {
            await sdk.Payments.getPayment("some test payment id");
            fail("It didn't throw the exception.");
        }
        catch (ex) {
            expect(ex).toBeInstanceOf(Error);
        }
    });

    it("getPayment should throw an exception if the to element is null", async () => {
        mockPaymentsApi.getPayment.mockResolvedValue(
            TestUtils.createSuccessfulAxiosResponse(
                PaymentsEntities.getPayment(false, false, true)
            ));

        try {
            await sdk.Payments.getPayment("some test payment id");
            fail("It didn't throw the exception.");
        }
        catch (ex) {
            expect(ex).toBeInstanceOf(Error);
            expect((ex as Error).message).toBe("payment.to is undefined");
        }
    });

    it("getPayment should throw an exception if the email is null", async () => {
        mockPaymentsApi.getPayment.mockResolvedValue(
            TestUtils.createSuccessfulAxiosResponse(
                PaymentsEntities.getPayment(true)
            ));

        try {
            await sdk.Payments.getPayment("some test payment id");
            fail("It didn't throw the exception.");
        }
        catch (ex) {
            expect(ex).toBeInstanceOf(Error);
            expect((ex as Error).message).toBe("payment.email is null or undefined");
        }
    });

    it("getPayment should have a null payment cycle id and payment cycle entry id if payment source is null.", async () => {
        mockPaymentsApi.getPayment.mockResolvedValue(
            TestUtils.createSuccessfulAxiosResponse(
                PaymentsEntities.getPayment(false, true)
            ));

        const payment = await sdk.Payments.getPayment("some test payment id");

        expect(payment.paymentCycleId).toBeUndefined();
        expect(payment.paymentCycleEntryId).toBeUndefined();
    });

    it("getPaymentCycle should return a payment cycle if the payment was sent from a payment cycle", async () => {
        mockPaymentCyclesApi.getPaymentCycleById.mockResolvedValue(
            TestUtils.createSuccessfulAxiosResponse(
                PaymentCyclesEntities.getTestPaymentCycleResponse("test cycle", "default", "This is a memo", new Date("1/1/2024"), new Date("1/31/2024"), "draft")
            ));

        mockPaymentsApi.getPayment.mockResolvedValue(
            TestUtils.createSuccessfulAxiosResponse(
                PaymentsEntities.getPayment()
            ));

        const payment = await sdk.Payments.getPayment("some test payment id");
        const paymentCycle = await payment.getPaymentCycle();

        expect(paymentCycle).not.toBeNull();
        expect(paymentCycle).not.toBeUndefined();
    });

    it("getPaymentCycle should return a null if the payment was not sent from a payment cycle", async () => {
        mockPaymentCyclesApi.getPaymentCycleById.mockResolvedValue(
            TestUtils.createSuccessfulAxiosResponse(
                PaymentCyclesEntities.getTestPaymentCycleResponse("test cycle", "default", "This is a memo", new Date("1/1/2024"), new Date("1/31/2024"), "draft")
            ));

        mockPaymentsApi.getPayment.mockResolvedValue(
            TestUtils.createSuccessfulAxiosResponse(
                PaymentsEntities.getPayment(false, true)
            ));

        const payment = await sdk.Payments.getPayment("some test payment id");
        const paymentCycle = await payment.getPaymentCycle();

        expect(paymentCycle).toBeNull();
    });

    it("getPaymentCycleEntry should return a payment cycle entry if the payment was sent from a payment cycle", async () => {
        mockPaymentCyclesApi.getPaymentCycleEntryById
                    .mockImplementation(async (id: string, entryId: string, options?: RawAxiosRequestConfig) =>
                        TestUtils.createSuccessfulAxiosResponse(
                            PaymentCyclesEntities.getTestPaymentCycleEntryResponse(id, {
                                to: {name: "Nick Pirocanac", email: "nick.pirocanac@mozaic.io"}
                            }))
                    );

        mockPaymentsApi.getPayment.mockResolvedValue(
            TestUtils.createSuccessfulAxiosResponse(
                PaymentsEntities.getPayment()
            ));
        
        const payment = await sdk.Payments.getPayment("some test payment id");
        const paymentCycleEntry = await payment.getPaymentCycleEntry();

        expect(paymentCycleEntry).not.toBeNull();
        expect(paymentCycleEntry).not.toBeUndefined();
    });

    it("getPaymentCycleEntry should return a null if the payment was not sent from a payment cycle", async () => {
        mockPaymentCyclesApi.getPaymentCycleEntryById
            .mockImplementation(async (id: string, entryId: string, options?: RawAxiosRequestConfig) =>
                TestUtils.createSuccessfulAxiosResponse(
                    PaymentCyclesEntities.getTestPaymentCycleEntryResponse(id, {
                        to: { name: "Nick Pirocanac", email: "nick.pirocanac@mozaic.io" }
                    }))
            );

        mockPaymentsApi.getPayment.mockResolvedValue(
            TestUtils.createSuccessfulAxiosResponse(
                PaymentsEntities.getPayment(false, true)
            ));

        const payment = await sdk.Payments.getPayment("some test payment id");
        const paymentCycleEntry = await payment.getPaymentCycleEntry();

        expect(paymentCycleEntry).toBeNull();
    });


});