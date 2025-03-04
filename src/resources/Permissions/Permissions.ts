import { AxiosError, AxiosResponse } from "axios";
import { Mozaic } from "../..";
import { Configuration, PermissionsApi } from "../../api";
import { MozaicError } from "../MozaicError";
import { BaseResource } from "../BaseResource";

/**
 * Use the Permissions class to get the UI visibility permissions for 
 * the Personal Access Token supplied to the Mozaic SDK.
 * @group Resources
 */
export class Permissions extends BaseResource {
    
    private _permissionsApi: PermissionsApi;

    /**
     * @internal
     * You should not call this constructor directly. Instead, use the Mozaic main 
     * entry point to get convinent access to the SDK classes.
     * @param configuration 
     */
    constructor(mozaic: Mozaic, configuration: Configuration) {
        super();

        this._permissionsApi = new PermissionsApi(configuration);
    }

    /**
     * Get the underlying API for direct calls to the Mozaic API.
     */
    get PermissionsApi() {
        return this._permissionsApi;
    }

    /**
     * Gets a list of permissions assigned to the Personal Access Token
     * that was used to initialize the Mozaic SDK.
     * @returns a list of visibility roles
     * @throws ApiException
     */
    async getPermissions() : Promise<string[]>
    {
        return await this.execute(() => this._permissionsApi.permissionsGet(true));
    }
}