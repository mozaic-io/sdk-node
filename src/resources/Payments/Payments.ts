/**
 * This is the main entry point for working with Payment Cycles. 
 * @group ResourcesGroup
 * @category ResourcesCat
 * @document ../../../documents/resources/PaymentCycles.md
 */

import { Mozaic } from "../..";
import { Configuration, PaymentsApi } from "../../api";
import { MozaicError } from "../MozaicError";
import { BaseResource } from "../BaseResource";
import { Payment } from "./Payment";

export class Payments extends BaseResource {
    private _mozaic: Mozaic;
    private _paymentsApi: PaymentsApi;

    /**
     * @internal
     * You should not call this constructor directly. Instead, use the Mozaic main 
     * entry point to get access to the SDK classes.
     * @param configuration 
     */
    constructor(mozaic: Mozaic, configuration: Configuration) {
        super();
        this._mozaic = mozaic;
        this._paymentsApi = new PaymentsApi(configuration);
    }

    /**
     * Get the underlying API for direct calls to the Mozaic API.
     */
    get PaymentsApi() {
        return this._paymentsApi;
    }    

    /**
     * Get a payment by ID
     * @param paymentId The ID of the payment to retrieve
     * @returns A Payment object
     */
    async getPayment(paymentId: string): Promise<Payment> {
        const result = await this.execute(() => this._paymentsApi.getPayment(paymentId));

        return new Payment(this._mozaic, result);
    }
}