import { Mozaic } from "../../../src";
import { InvoicesApi, PaymentCycleListResponse, PaymentCyclesApi } from "../../../src/api";
import { TestUtils } from "../../TestUtils";
import { ApiException } from "../../../src/resources/ApiException";
import { RawAxiosRequestConfig } from "axios";
import { InvoicesEntities } from "./InvoicesEntities";

const sdk = new Mozaic(
  "http://mocked.mozaic.io",
  "mocked-pat-123456789"
);

jest.mock("../../../src/api");
const mockInvoicesApi = sdk.Invoices.InvoicesApi as jest.Mocked<InvoicesApi>;

describe("Payment Cycle Tests", () => {
    it("getInvoice should download an invoice", async () => {
        
        mockInvoicesApi.downloadInvoice.mockImplementation(async (id: string, options?: RawAxiosRequestConfig) => 
            TestUtils.createSuccessfulAxiosResponse(
                InvoicesEntities.downloadInvoice(id)
            )
        );

        let invoice = await sdk.Invoices.getInvoice("invoice_1234456677");

        let invoiceData = Buffer.from(invoice).toString();

        expect(invoiceData).toBe("PDFBYTES");
    });

    it("getInvoice should throw an exception when the response is not 200", async () => {
        mockInvoicesApi.downloadInvoice.mockImplementation(async (id: string, options?: RawAxiosRequestConfig) => 
            TestUtils.createFailedAxiosResponse(
                InvoicesEntities.downloadInvoice(id)
            )
        );
        try {
            await sdk.Invoices.getInvoice("invoice_1234456677");
            fail("It didn't throw the exception.");
        }
        catch (ex) {
            expect(ex).toBeInstanceOf(ApiException);
        }
    });

});