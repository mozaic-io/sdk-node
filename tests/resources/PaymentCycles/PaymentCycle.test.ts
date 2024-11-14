import { RawAxiosRequestConfig } from "axios";
import { Mozaic } from "../../../src";
import { InvoicesApi, PaymentCycleEntryCreateDeets, PaymentCycleEntryStatus, PaymentCycleFinalizeDeets, PaymentCyclesApi, PaymentCycleStatus, WalletsApi } from "../../../src/api";
import { PaymentCycle } from "../../../src/resources/PaymentCycles/PaymentCycle";
import { TestUtils } from "../../TestUtils";
import { PaymentCyclesEntities } from "./PaymentCyclesEntities";
import { ApiException } from "../../../src/resources/ApiException";
import { PaymentCycleEntryList } from "../../../src/resources/PaymentCycles/PaymentCycleEntryList";
import { WalletsEntities } from "../Wallets/WalletsEntities";
import { InvoicesEntities } from "../Invoices/InvoicesEntities";

const sdk = new Mozaic(
    "http://mocked.mozaic.io",
    "mocked-pat-123456789"
);

jest.mock("../../../src/api");
const mockPaymentCyclesApi = sdk.PaymentCycles.PaymentCyclesApi as jest.Mocked<PaymentCyclesApi>;
const mockWalletApi = sdk.Wallets.WalletsApi as jest.Mocked<WalletsApi>;
const mockInvoiceApi = sdk.Invoices.InvoicesApi as jest.Mocked<InvoicesApi>;

describe("Payment Cycle Tests", () => {

    it("An incomplete payment cycle should not be able to download an invoice", async () => {

        mockInvoiceApi.downloadInvoice.mockImplementation(async (id: string, options?: RawAxiosRequestConfig) =>
            TestUtils.createSuccessfulAxiosResponse(
                InvoicesEntities.downloadInvoice(id)
            )
        );

        try {
            const paymentCycle = await getTestPaymentCycle("cancelled");
            let invoice = await paymentCycle.getInvoice();
            fail("It did not throw an exception")
        }
        catch (ex) {
            expect(ex).toBeInstanceOf(Error);
        }    

        try {
            const paymentCycle = await getTestPaymentCycle("draft");
            let invoice = await paymentCycle.getInvoice();
            fail("It did not throw an exception")
        }
        catch (ex) {
            expect(ex).toBeInstanceOf(Error);
        }    

        try {
            const paymentCycle = await getTestPaymentCycle("failed");
            let invoice = await paymentCycle.getInvoice();
            fail("It did not throw an exception")
        }
        catch (ex) {
            expect(ex).toBeInstanceOf(Error);
        }    

        try {
            const paymentCycle = await getTestPaymentCycle("locked");
            let invoice = await paymentCycle.getInvoice();
            fail("It did not throw an exception")
        }
        catch (ex) {
            expect(ex).toBeInstanceOf(Error);
        }    
    });

it("A completed payment cycle should be able to download an invoice", async () => {

    mockInvoiceApi.downloadInvoice.mockImplementation(async (id: string, options?: RawAxiosRequestConfig) =>
        TestUtils.createSuccessfulAxiosResponse(
            InvoicesEntities.downloadInvoice(id)
        )
    );

    const paymentCycle = await getTestPaymentCycle("completed");

    let invoice = await paymentCycle.getInvoice();

    let invoiceData = Buffer.from(invoice).toString();

    expect(invoiceData).toBe("PDFBYTES");
});

it("finalize should fail if there are no payment methods in the wallet and the caller tries to fake it", async () => {
    mockPaymentCyclesApi.finalizePaymentCycleEntry
        .mockImplementation(async (id: string, paymentCycleFinalizeDeets?: PaymentCycleFinalizeDeets, options?: RawAxiosRequestConfig) =>
            TestUtils.createSuccessfulAxiosResponse(
                PaymentCyclesEntities.finalizePaymentCycleEntry(id, paymentCycleFinalizeDeets))
        );

    mockWalletApi.apiWalletsGet.mockResolvedValue(
        TestUtils.createSuccessfulAxiosResponse(
            WalletsEntities.apiWalletsGet(true, false)
        )
    );

    const paymentCycle = await getTestPaymentCycle("draft");

    // Use the first available payment method from the wallet.
    const paymentMethod = (await sdk.Wallets.getWallets())[0].paymentMethods[0];

    try {
        var paymentCycleEntries = await paymentCycle.finalize(paymentMethod);
        fail("It did not throw the exception");
    } catch (ex) {
        expect(ex).toBeInstanceOf(Error);
        expect((ex as Error).message).toBe("An invalid payment method id was selected. You must use a valid payment method. (Did you select a payout method by mistake?)");
    }
});

it("finalize should fail if a payout method is chosen instead of a payment method", async () => {
    mockPaymentCyclesApi.finalizePaymentCycleEntry
        .mockImplementation(async (id: string, paymentCycleFinalizeDeets?: PaymentCycleFinalizeDeets, options?: RawAxiosRequestConfig) =>
            TestUtils.createSuccessfulAxiosResponse(
                PaymentCyclesEntities.finalizePaymentCycleEntry(id, paymentCycleFinalizeDeets))
        );

    mockWalletApi.apiWalletsGet.mockResolvedValue(
        TestUtils.createSuccessfulAxiosResponse(
            WalletsEntities.apiWalletsGet(false, false)
        )
    );

    const paymentCycle = await getTestPaymentCycle("draft");

    // Use the first available payout method from the wallet.
    const payoutMethod = (await sdk.Wallets.getWallets())[0].payoutMethods[0];

    try {
        var paymentCycleEntries = await paymentCycle.finalize(payoutMethod);
        fail("It did not throw the exception");
    } catch (ex) {
        expect(ex).toBeInstanceOf(Error);
    }
});


it("finalize should finalize the payment cycle", async () => {
    mockPaymentCyclesApi.finalizePaymentCycleEntry
        .mockImplementation(async (id: string, paymentCycleFinalizeDeets?: PaymentCycleFinalizeDeets, options?: RawAxiosRequestConfig) =>
            TestUtils.createSuccessfulAxiosResponse(
                PaymentCyclesEntities.finalizePaymentCycleEntry(id, paymentCycleFinalizeDeets))
        );

    mockWalletApi.apiWalletsGet.mockResolvedValue(
        TestUtils.createSuccessfulAxiosResponse(
            WalletsEntities.apiWalletsGet(false, false)
        )
    );

    const paymentCycle = await getTestPaymentCycle("draft");

    // Use the first available payment method from the wallet.
    const paymentMethod = (await sdk.Wallets.getWallets())[0].paymentMethods[0];

    var finalizedPaymentCycle = await paymentCycle.finalize(paymentMethod);

    expect(finalizedPaymentCycle.status).toBe(PaymentCycleStatus.Invoicing);
    expect(finalizedPaymentCycle.invoiceId).toBe("invoice_12345678");
});


it("PaymentCycleEntryList should be create-able with no arguments", async () => {
    new PaymentCycleEntryList({}, []);
});

it("getPaymentCycleEntries should get payment cycle entries for the payment cycle", async () => {
    mockPaymentCyclesApi.listPaymentCycleEntries
        .mockImplementation(async (id: string, status?: PaymentCycleEntryStatus, name?: string, email?: string, limit?: number, page?: number, userId?: string, options?: RawAxiosRequestConfig) =>
            TestUtils.createSuccessfulAxiosResponse(
                PaymentCyclesEntities.listPaymentCycleEntries(id, limit ?? 0, page ?? 0))
        );

    const paymentCycle = await getTestPaymentCycle("draft");

    var paymentCycleEntries = await paymentCycle.getPaymentCycleEntries(10, 1);

    expect(paymentCycleEntries.data.length).toBe(10);
});

it("getPaymentCycleEntries should set data to undefined when the server response is invalid", async () => {
    mockPaymentCyclesApi.listPaymentCycleEntries
        .mockImplementation(async (id: string, status?: PaymentCycleEntryStatus, name?: string, email?: string, limit?: number, page?: number, userId?: string, options?: RawAxiosRequestConfig) =>
            TestUtils.createSuccessfulAxiosResponse(
                {}
            )
        );

    const paymentCycle = await getTestPaymentCycle("draft");

    try {
        var paymentCycleEntries = await paymentCycle.getPaymentCycleEntries(10, 1);
        fail("It didn't throw the exception.");
    } catch (ex) {
        expect(ex).toBeInstanceOf(Error);
    }
});

it("getPaymentCycleEntries should throw an exception when the response is not 200", async () => {
    mockPaymentCyclesApi.listPaymentCycleEntries
        .mockImplementation(async (id: string, status?: PaymentCycleEntryStatus, name?: string, email?: string, limit?: number, page?: number, userId?: string, options?: RawAxiosRequestConfig) =>
            TestUtils.createFailedAxiosResponse(
                PaymentCyclesEntities.listPaymentCycleEntries(id, limit ?? 0, page ?? 0))
        );

    const paymentCycle = await getTestPaymentCycle("draft");

    try {
        var paymentCycleEntries = await paymentCycle.getPaymentCycleEntries(10, 1);
        fail("It didn't throw the exception.");
    }
    catch (ex) {
        expect(ex).toBeInstanceOf(ApiException);
    }
});

it("addPaymentCycleEntry should create a payment cycle entry", async () => {
    mockPaymentCyclesApi.createPaymentCycleEntry
        .mockImplementation(async (id: string, paymentCycleEntryCreateDeets?: PaymentCycleEntryCreateDeets, options?: RawAxiosRequestConfig) =>
            TestUtils.createSuccessfulAxiosResponse(
                PaymentCyclesEntities.getTestPaymentCycleEntryResponse(id, paymentCycleEntryCreateDeets))
        );

    const paymentCycle = await getTestPaymentCycle("draft");

    const paymentCycleEntry = await paymentCycle.addPaymentCycleEntry("Jamie Johnson", "jamie.johnson@noemail.com", 200.12345678, "USD");

    expect(paymentCycleEntry.name).toBe("Jamie Johnson");
    expect(paymentCycleEntry.email).toBe("jamie.johnson@noemail.com");
    expect(paymentCycleEntry.amount.quantity).toBe(200.12345678);
    expect(paymentCycleEntry.amount.currency).toBe("USD");

    expect(paymentCycleEntry.rawObject.to?.name).toBe("Jamie Johnson");
    expect(paymentCycleEntry.rawObject.to?.email).toBe("jamie.johnson@noemail.com");
    expect(paymentCycleEntry.rawObject.original_amount?.quantity).toBe(200.12345678);
    expect(paymentCycleEntry.rawObject.original_amount?.currency).toBe("USD");
});

it("addPaymentCycleEntry should throw an exception when the response is not 200", async () => {
    mockPaymentCyclesApi.createPaymentCycleEntry
        .mockImplementation(async (id: string, paymentCycleEntryCreateDeets?: PaymentCycleEntryCreateDeets, options?: RawAxiosRequestConfig) =>
            TestUtils.createFailedAxiosResponse(
                PaymentCyclesEntities.getTestPaymentCycleEntryResponse(id, paymentCycleEntryCreateDeets))
        );

    const paymentCycle = await getTestPaymentCycle("draft");

    try {
        const paymentCycleEntry = await paymentCycle.addPaymentCycleEntry("Jamie Johnson", "jamie.johnson@noemail.com", 200.12345678, "USD");
        fail("It didn't throw the exception.");
    }
    catch (ex) {
        expect(ex).toBeInstanceOf(ApiException);
    }
});

it("PaymentCycle should ensure the RawPaymentCycle contains correct data during wrapping", () => {

    try {
        new PaymentCycle(sdk, sdk.PaymentCycles.PaymentCyclesApi, {});
        fail("It didn't throw the exception.");
    }
    catch (ex) {
        expect((ex as Error).message).toBe("paymentCycle.id is null or undefined");
    }

    try {
        new PaymentCycle(sdk, sdk.PaymentCycles.PaymentCyclesApi, { id: "paymentCycle_test1223342542" });
        fail("It didn't throw the exception.");
    }
    catch (ex) {
        expect((ex as Error).message).toBe("paymentCycle.status is null or undefined");
    }

    try {
        new PaymentCycle(sdk, sdk.PaymentCycles.PaymentCyclesApi, { id: "paymentCycle_test1223342542", short_id: "1234-TID1" });
        fail("It didn't throw the exception.");
    }
    catch (ex) {
        expect((ex as Error).message).toBe("paymentCycle.status is null or undefined");
    }

    try {
        new PaymentCycle(sdk, sdk.PaymentCycles.PaymentCyclesApi, { id: "paymentCycle_test1223342542", short_id: "1234-TID1", status: "completed" });
        fail("It didn't throw the exception.");
    }
    catch (ex) {
        expect((ex as Error).message).toBe("paymentCycle.name is null or undefined");
    }

    const testCycle = new PaymentCycle(sdk, sdk.PaymentCycles.PaymentCyclesApi, { id: "paymentCycle_test1223342542", short_id: "1234-TID1", status: "completed", name: "Payment Cycle Name" });

    expect(testCycle.accountingFrom?.getTime()).toBeNaN();
    expect(testCycle.accountingTo?.getTime()).toBeNaN();
});

});


async function getTestPaymentCycle(status: PaymentCycleStatus) {
    mockPaymentCyclesApi.createPaymentCycle.mockResolvedValue(
        TestUtils.createSuccessfulAxiosResponse(
            PaymentCyclesEntities.getTestPaymentCycleResponse("test cycle", "default", "This is a memo", new Date("1/1/2024"), new Date("1/31/2024"), status))
    );

    const paymentCycle = await sdk.PaymentCycles.createPaymentCycle("test cycle", "default", "This is a memo", new Date("1/1/2024"), new Date("1/31/2024"));

    return paymentCycle;
}