import { AxiosPromise, AxiosResponse } from "axios";
import { Invoice } from "../../../src/api";
import { TestUtils } from "../../TestUtils";

export class InvoicesEntities {
    static downloadInvoice(id: string) : ArrayBuffer { 

        let arrayBuffer = new ArrayBuffer(8);
        Buffer.from(arrayBuffer).write("PDFBYTES");

        return arrayBuffer;
    }
}