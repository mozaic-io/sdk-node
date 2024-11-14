/**
 * This is the main entry point for working with Payment Cycles. 
 * @group ResourcesGroup
 * @category ResourcesCat
 * @document ../../../documents/resources/PaymentCycles.md
 */

import { Mozaic } from "../..";
import { Configuration, PaymentCyclesApi, PaymentCycleCreateDeets, FeeDirection } from "../../api";
import { ApiException } from "../ApiException";
import { BaseResource } from "../BaseResource";
import { PaymentCycle } from "./PaymentCycle";
import { PaymentCycleList } from "./PaymentCycleList";

export class PaymentCycles extends BaseResource {
    private _mozaic: Mozaic;
    private _paymentCycleApi: PaymentCyclesApi;

    /**
     * @internal
     * You should not call this constructor directly. Instead, use the Mozaic main 
     * entry point to get access to the SDK classes.
     * @param configuration 
     */
    constructor(mozaic: Mozaic, configuration: Configuration) {
        super();
        this._mozaic = mozaic;
        this._paymentCycleApi = new PaymentCyclesApi(configuration);
    }

    /**
     * Get the underlying API for direct calls to the Mozaic API.
     */
    get PaymentCyclesApi() {
        return this._paymentCycleApi;
    }

    /**
     * Creates a Payment Cycle
     * @param name The name of the payment cycle
     * @param feeDirection Determines who will pay the fees for payments issued from this payment cycle.
     * @param memo A free text field containing user supplied information about the payment cycle.
     * @param accountingFromDateUtc The starting data of the payment cycle in UTC.
     * @param accountingToDateUtc The ending date of the payment cycle in UTC.
     * @returns {PaymentCycle}
     */
    async createPaymentCycle(name: string, feeDirection: FeeDirection, memo: string, accountingFromDateUtc: Date, accountingToDateUtc: Date): Promise<PaymentCycle> {
        let deets: PaymentCycleCreateDeets = {
            name: name,
            fee_direction: feeDirection,
            memo: memo,
            accounting_from: accountingFromDateUtc.toISOString(),
            accounting_to: accountingToDateUtc.toISOString()
        };

        const result = await this._paymentCycleApi.createPaymentCycle(deets);

        if(result.status != 200)
            throw new ApiException(result);

        return new PaymentCycle(this._mozaic, this._paymentCycleApi, result.data);
    }
    
    /**
     * Returns a list of payment cycles using limit for the maximum item count and page to retrieve more than one page. 
     * @param limit An integer number between 1 and 100.
     * @param page An integer number of the page starting at 1.
     * @returns A list of PaymentCycle objects.
     */
    async getPaymentCycles(limit: number, page: number): Promise<PaymentCycleList> {
        this.throwIfLimitOrPageAreInvalid(limit, page);

        const result = await this._paymentCycleApi.listPaymentCycles(undefined, undefined, undefined, limit, page, undefined, undefined);

        this.throwIfServerResponseIsNot200(result);

        const data = result.data.data?.map((value, index) => new PaymentCycle(this._mozaic, this._paymentCycleApi, value));

        return new PaymentCycleList(result.data, data);
    }

    /**
     * Retrieves a specific payment cycle id.
     * @param paymentCycleId the payment cycle id to retrieve. Note: This is the long format payment cycle id, not the 9 character short version: XXXX-XXXX.
     * @returns 
     */
    async getPaymentCycle(paymentCycleId: string): Promise<PaymentCycle> {

        const result = await this._paymentCycleApi.getPaymentCycleById(paymentCycleId);

        if(result.status != 200)
            throw new ApiException(result);

        return new PaymentCycle(this._mozaic, this._paymentCycleApi, result.data);
    }
}