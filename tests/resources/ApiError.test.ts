import { AxiosError, AxiosHeaders, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { MozaicError } from "../../src";

describe("ApiError Tests", () => {

    it("It should preserve the stack", async () => {
        const error = new AxiosError("This is an error", "400");
        error.status = 400;
        
        const apiError = MozaicError.create(error);

        expect(apiError.stack).toBe(error.stack);
        expect(apiError.rawError).toEqual(error);
    });

    it("It should use it's own stack when no stack is present from an inner error", async () => {
        const config: InternalAxiosRequestConfig = {headers: new AxiosHeaders()};
        const result: AxiosResponse = {data: "pork", status: 400, config: config, headers: new AxiosHeaders(), statusText: "pork status" };

        const apiError = MozaicError.create(result);

        expect(apiError.stack).not.toBe(undefined);
        expect(apiError.rawError).toEqual(result);
    });

    it("It should have status = -1 and statusText = empty string when values are not present in AxiosError", async () => {
        const error = new AxiosError("This is an error");
        const config: InternalAxiosRequestConfig = {headers: new AxiosHeaders()};
        error.response = {data: "data", config: config, headers: config.headers, status: 400, statusText: "broken"};

        const apiError = MozaicError.create(error);

        expect(apiError.status).toBe(-1);
        expect(apiError.message).toBe("This is an error: broken, data");
        expect(apiError.rawError).toEqual(error);
    });

    it("It should show all values from data when data is an array", async () => {
        const error = new AxiosError("This is an error");
        const config: InternalAxiosRequestConfig = {headers: new AxiosHeaders()};
        error.response = {data: [{ErrorMessage: "data 1", ErrorNumber: -1234}, {ErrorMessage: "data 2", ErrorNumber: -1234}], config: config, headers: config.headers, status: 400, statusText: "broken"};

        const apiError = MozaicError.create(error);

        expect(apiError.status).toBe(-1);
        expect(apiError.message).toBe("This is an error: broken, data 1, data 2");
        expect(apiError.rawError).toEqual(error);
    });

    it("It should not break with an invalid type in the data array", async () => {
        const error = new AxiosError("This is an error");
        const config: InternalAxiosRequestConfig = {headers: new AxiosHeaders()};
        error.response = {data: [{Flonk: "data 1", Bonk: -1234}, {Donk: "data 2", McGonk: -1234}], config: config, headers: config.headers, status: 400, statusText: "broken"};

        const apiError = MozaicError.create(error);

        expect(apiError.status).toBe(-1);
        expect(apiError.message).toBe("This is an error: broken{\"Flonk\":\"data 1\",\"Bonk\":-1234}{\"Donk\":\"data 2\",\"McGonk\":-1234}");
        expect(apiError.rawError).toEqual(error);
    });

});