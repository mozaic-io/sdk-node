import { Mozaic } from "../..";
import { Configuration, PermissionsApi } from "../../api";
import { ApiException } from "../ApiException";
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
     */
    async getPermissions() : Promise<string[]>
    {
        const result = await this._permissionsApi.permissionsGet(true);

        if(result.status != 200)
            throw new ApiException(result);

        return result.data;
    }
}