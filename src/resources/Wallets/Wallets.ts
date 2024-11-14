import { Mozaic } from "../..";
import { Configuration, Wallet as RawWallet, WalletsApi } from "../../api";
import { ApiException } from "../ApiException";
import { BaseResource } from "../BaseResource";
import { Wallet } from "./Wallet";

/**
 * @group Resources
 */
export class Wallets extends BaseResource {
    
    private _walletsApi: WalletsApi;

    /**
     * @internal
     * You should not call this constructor directly. Instead, use the Mozaic main 
     * entry point to get access to the SDK classes.
     * @param configuration 
     */
    constructor(mozaic: Mozaic, configuration: Configuration) {
        super();
        this._walletsApi = new WalletsApi(configuration);
    }

    /**
     * Get the underlying API for direct calls to the Mozaic API.
     */
    get WalletsApi() {
        return this._walletsApi;
    }

    /**
     * Gets all of the available wallets that you have created with Mozaic's partner wallet providers.
     * @returns 
     */
    async getWallets() : Promise<Wallet[]> {
        var result = await this._walletsApi.apiWalletsGet();

        this.throwIfServerResponseIsNot200(result);

        return result.data.map((value) => new Wallet(value));
    }
}