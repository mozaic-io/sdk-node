/**
 * This module provides access to the rest of the Mozaic SDK. 
 * Proceed to the main SDK in the {@link Mozaic} class for more information.
 * @module Mozaic SDK
 */

import * as packageInfo from '../package.json';
import https from 'https';
import { Configuration } from "./api/configuration";
import { BaseResource } from "./resources/BaseResource";
import { Invoices } from "./resources/Invoices/Invoices";
import { PaymentCycles } from "./resources/PaymentCycles/PaymentCycles";
import { Permissions } from "./resources/Permissions/Permissions";
import { Wallets } from "./resources/Wallets/Wallets";


// export { Invoices } from "./resources/Invoices/Invoices";
// export { PaymentCycles } from "./resources/PaymentCycles/PaymentCycles";
// export { Permissions } from "./resources/Permissions/Permissions";
// export { Wallets } from "./resources/Wallets/Wallets";

/**
 * This is the main entry point for the Mozaic SDK. You will need to obtain an API Key and 
 * and endpoint to use this SDK. Please reach out to your Mozaic account representative to 
 * get set up with system access.
 * 
 * More information: [SDK Documentation](../documents/index.md)
 * 
 * @category Mozaic SDK
 */
export class Mozaic {
    private _basePath: string;
    private _apiKey: string;
    private _configuration: Configuration;
    private _sdks: { [id: string]: BaseResource; } = {};


    /**
      * Creates an instance of the Mozaic SDK.
      * @param basePath - The base URL for the Mozaic API.
      */
    constructor(basePath: string, apiKey: string) {
        this._basePath = basePath;
        this._apiKey = apiKey;

        const httpsAgent = new https.Agent({
            rejectUnauthorized: false,
            
          });

        this._configuration = new Configuration({ 
            basePath: basePath, 
            apiKey: apiKey, 
            baseOptions: {
                headers: {
                    "x-sdk-version": packageInfo.version,
                    
                },
                httpsAgent: httpsAgent
            } 
        });
    }

    /**
     * Root resources are treated as singletons and should not keep state.
     * @param ctor The constructor pattern that each resource must implement.
     * @returns The one and only instance of the resource.
     */
    private getResource<T extends BaseResource>(ctor: new (mozaic: Mozaic, configuration: Configuration) => T): T {
        return (this._sdks[ctor.name] ??= new ctor(this, this._configuration)) as T;
    }

    /**
     * The Invoices resource gives you access to the Invoices API so that you can download invoices related to 
     * payments you have made, including payments for Payment Cycles.
     * @group Resources
     */
    get Invoices(): Invoices {
        return this.getResource(Invoices);
    }

    /**
     * The PaymentCycles resource gives you access to the PaymentCycles API to create new payment cycles, 
     * add entries to a payment cycle and finalize a payment cycle. You can also use this to retrieve and manage
     *  payment cycles, invoices and payment cycle entries. 
     * 
     * @group Resources
     */
    get PaymentCycles(): PaymentCycles {
        return this.getResource(PaymentCycles);
    }

    /**
     * The Permissions resource gives you access to the Permissions API to get UI visibility permissions for the 
     * current Personal Access Token in use.
     * 
     * @group Resources
     */
    get Permissions(): Permissions {
        return this.getResource(Permissions);
    }

    /**
     * The Wallets resource gives you access to the Wallets API so that you can get payment and payout methods
     * from your wallets stored at Mozaic partners. Mozaic can then instruct a partner to move money using your
     * Wallet's tokens on your behalf.
     * 
     * @group Resources
     */
    get Wallets(): Wallets {
        return this.getResource(Wallets);
    }
}