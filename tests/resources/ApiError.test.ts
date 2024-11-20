import { AxiosError, AxiosHeaders, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { ApiError } from "../../src";

describe("ApiError Tests", () => {

    it("It should preserve the stack", async () => {
        const error = new AxiosError("This is an error", "400");
        error.status = 400;
        
        const apiError = ApiError.create(error);

        expect(apiError.stack).toBe(error.stack);
    });

    it("It should use it's own stack when no stack is present from an inner error", async () => {
        const config: InternalAxiosRequestConfig = {headers: new AxiosHeaders()};
        const result: AxiosResponse = {data: "pork", status: 400, config: config, headers: new AxiosHeaders(), statusText: "pork status" };

        const apiError = ApiError.create(result);

        expect(apiError.stack).not.toBe(undefined);
    });

    it("It should have status = -1 and statusText = empty string when values are not present in AxiosError", async () => {
        const error = new AxiosError("This is an error");
        const config: InternalAxiosRequestConfig = {headers: new AxiosHeaders()};
        error.response = {data: "data", config: config, headers: config.headers, status: 400, statusText: "broken"};

        const apiError = ApiError.create(error);

        expect(apiError.status).toBe(-1);
        expect(apiError.message).toBe("This is an error: broken");
    });

});