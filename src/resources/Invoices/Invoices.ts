import { Mozaic } from "../..";
import { Configuration, Invoice, InvoicesApi } from "../../api";
import { BaseResource } from "../BaseResource";

/**
 * @group Resources
 */
export class Invoices extends BaseResource {
    private _mozaic: Mozaic;
    private _invoicesApi: InvoicesApi;

    /**
     * @internal
     * You should not call this constructor directly. Instead, use the Mozaic main 
     * entry point to get access to the SDK classes.
     * @param configuration 
     */
    constructor(mozaic: Mozaic, configuration: Configuration) {
        super();
        this._mozaic = mozaic;
        this._invoicesApi = new InvoicesApi(configuration);
    }

    /**
     * Get the underlying API for direct calls to the Mozaic API.
     */
    get InvoicesApi() {
        return this._invoicesApi;
    }

    /**
     * 
     * @param invoiceId Downloads an invoice by it's invoiceId. The invoiceId can be found on a payment cycle that
     * has been completed as well as other areas of the Mozaic SDK. 
     * 
     * @returns an ArrayBuffer containing the bytes of an Invoice PDF. It can be saved using:
     * 
     * ```fs.writeFileSync(fileName, Buffer.from(arrayBuffer));```
     */
    async getInvoice(invoiceId: string) : Promise<ArrayBuffer> {
        const result = await this.execute(() => this._invoicesApi.downloadInvoice(invoiceId, {responseType: "arraybuffer"}));

        // There is a signature error in the generated proxy, this is a work-around for it.
        return result as unknown as ArrayBuffer;
    }

    /**
     * Mark an invoice as Paid. If the invoice is for a payment cycle that has been finalized, then
     * the payment cycle will attempt to be funded from your available Mozaic balance. If there is not
     * enough funds in your balance, then the payment cycle will fail, and you will need to resubmit it.
     * You can use this method to test your Mozaic integration in non-production environments. Ask your
     * Mozaic representative to pre-fund your account with test funds.
     */
    async payInvoice(invoiceId: string | null | undefined): Promise<Invoice> {
        
        invoiceId = this.throwIfNullOrUndefined("invoiceId", invoiceId);
        
        const result = await this.execute(() => this._invoicesApi.payInvoice(invoiceId));

        return result;
    }
}