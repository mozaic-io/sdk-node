import { AxiosPromise, AxiosResponse } from "axios";
import { Invoice } from "../../../src/api";
import { TestUtils } from "../../TestUtils";

export class InvoicesEntities {
    static downloadInvoice(id: string) : ArrayBuffer { 

        let arrayBuffer = new ArrayBuffer(8);
        Buffer.from(arrayBuffer).write("PDFBYTES");

        return arrayBuffer;
    }

    static payInvoice(id: string): Invoice {
        const invoice: Invoice = {
            id: id,
            created_at: (new Date()).toUTCString(),
            status: "paid"
        };

        return invoice;
    }
}