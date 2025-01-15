import { Mozaic, MozaicError } from "@mozaic-io/mozaic-sdk-node";
import { FeeDirection } from "@mozaic-io/mozaic-sdk-node/dist/api";
import { PaymentCycle } from "@mozaic-io/mozaic-sdk-node/dist/resources/PaymentCycles/PaymentCycle";
import { WalletItem } from "@mozaic-io/mozaic-sdk-node/dist/resources/Wallets/WalletItem";
import { AxiosError } from "axios";
import 'dotenv/config'
import * as fs from 'fs';

export default class PaymentCyclesExample {

    private _client: Mozaic;

    constructor(apiUrl: string, apiKey: string) {
        
        this._client = new Mozaic(apiUrl, apiKey);
    }

    /**
     * Example of creating a payment cycle and paying it by invoice.
     */
    public async paymentCycle(useStoredPaymentMethod: boolean): Promise<void> {

        console.log("Running payment cycle example using pay by invoice...");

        const paymentCycle = await this._client.PaymentCycles.createPaymentCycle("Test Payment Cycle", FeeDirection.Payer, "October Test Payments", new Date("10/1/2024"), new Date("10/31/2024"));

        console.log(paymentCycle.paymentCycleId);

        const entry1 = await paymentCycle.addPaymentCycleEntry("Jamie Johnson", "jamie.johnson@nomail.com", 245, "USD");

        console.log(`Added: ${entry1.name}`);

        const entry2 = await paymentCycle.addPaymentCycleEntry("Pat Jones", "pat.jones@noemail.com", 99.99, "AUD");

        console.log(`Added: ${entry2.name}`);

        let finalizedPaymentCycle: PaymentCycle;

        if (useStoredPaymentMethod == true) {
            const paymentMethod = await this.getPaymentMethod(this._client);

            console.log(`Got payment method: ${paymentMethod.paymentMethodId}`);

            finalizedPaymentCycle = await paymentCycle.finalize(paymentMethod);
        }
        else {
            finalizedPaymentCycle = await paymentCycle.finalizeByInvoice();
        }

        console.log(`Finalized: ${finalizedPaymentCycle.paymentCycleId}, invoice: ${finalizedPaymentCycle.invoiceId}`);

        const invoice = await finalizedPaymentCycle.getInvoice();

        fs.writeFileSync("invoice.pdf", Buffer.from(invoice));

        console.log(`Saved invoice to invoice.pdf`);
    }

    private async getPaymentMethod(client: Mozaic): Promise<WalletItem> {
        const wallets = await client.Wallets.getWallets();

        console.log(`Got ${wallets.length} wallets`);

        const stripeWallet = wallets.find((value) => value.key == "stripe-us");
        let paymentMethod = stripeWallet?.paymentMethods.find((value) => value.default == true);

        if (paymentMethod === undefined && (stripeWallet?.paymentMethods.length ?? 0 > 0))
            paymentMethod = stripeWallet?.paymentMethods[0];

        if (paymentMethod === undefined)
            throw new Error("No payment method");

        return paymentMethod;
    }
}

(async () => {

    if (!process.env.API_URL || !process.env.API_KEY) {
        console.error("Please set API_URL and API_KEY environment variables.");
        process.exit(1);
    }

    // See SDK Documentation for other available endpoints.
    // Obtain your API key from the app.sandbox.mozaic.io account settings page.
    const app = new PaymentCyclesExample(process.env.API_URL, process.env.API_KEY);
    
    const method = process.argv[2];

    try {
        if (method === "pay-by-invoice") {
            await app.paymentCycle(false);
        } else if (method === "pay-with-stored-payment-method") {
            await app.paymentCycle(true);
        } else {
            console.error("Please specify a valid method: 'pay-by-invoice' or 'pay-with-stored-payment-method'.");
            process.exit(1);
        }
    } catch (error) {
        if (error instanceof MozaicError) {
            console.error(`MozaicError: ${error.message}`);
        } else if (error instanceof AxiosError) {
            console.error(`AxiosError: ${error.message}`);
        } else if(error instanceof Error) {
            console.error(`Error: ${error.message}`);
        } else {
            console.error(`Unknown error: ${error}`);
        }
    }
})();
