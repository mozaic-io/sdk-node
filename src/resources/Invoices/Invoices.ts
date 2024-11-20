import { Mozaic } from "../..";
import { Configuration, InvoicesApi } from "../../api";
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
        var result = await this.execute(() => this._invoicesApi.downloadInvoice(invoiceId, {responseType: "arraybuffer"}));

        // There is a signature error in the generated proxy, this is a work-around for it.
        return result as unknown as ArrayBuffer;
    }

}