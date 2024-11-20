import { Mozaic } from "../../../src";
import { PermissionsApi } from "../../../src/api";
import { ApiError } from "../../../src/resources/ApiError";
import { TestUtils } from "../../TestUtils";

const sdk = new Mozaic(
    "http://mocked.mozaic.io",
    "mocked-pat-123456789"
);

jest.mock("../../../src/api");
const mockPermissionApi = sdk.Permissions
    .PermissionsApi as jest.Mocked<PermissionsApi>;

describe("Mock Permissions Tests", () => {
    it("should get a list of permissions from the mock", async () => {
        mockPermissionApi.permissionsGet.mockResolvedValue(
            TestUtils.createSuccessfulAxiosResponse(["Pork"])
        );

        var result = await sdk.Permissions.getPermissions();
        expect(result.length).toBe(1);
        expect(result[0]).toBe("Pork");
    });

    it("should throw an error if the response from the API was not successful", async () => {
        mockPermissionApi.permissionsGet.mockResolvedValue(
            TestUtils.createFailedAxiosResponse(["Pork"])
        );

        //await expect(sdk.Permissions.getPermissions()).rejects.toThrow();

        try {
            await sdk.Permissions.getPermissions();
            fail("Call did not throw an exception.");
        } catch (ex) {
            expect(ex).toBeInstanceOf(ApiError);
        }
    });
});
