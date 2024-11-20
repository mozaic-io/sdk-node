import { AxiosError, AxiosResponse } from "axios";
import { MozaicError } from "./MozaicError";

/**
 * All classes in the resource folder should implement this interface so that they
 * can be instantiated in the main barrel.
 */
export abstract class BaseResource {

    /**
     * A helper function that will either return the variable's value or throw an exception
     * if the value is null or undefined. Unit testing is simplified by avoiding ??
     * @param name The name of the variable being checked
     * @param value The value of the variable being checked
     * @returns The value of the variable if it is available, otherwise an exception is thrown.
     */
    protected throwIfNullOrUndefined<T>(name: string, value: T | null | undefined): T {
        if (value === null || value === undefined)
            throw new Error(`${name} is null or undefined`);

        return value;
    }

    /**
     * A helper function to validate limit and paging parameters.
     * @param limit Must be between 1 and 100 inclusive.
     * @param page Must be greater than 0
     */
    protected throwIfLimitOrPageAreInvalid(limit: number, page: number): void {
        if (limit < 1)
            throw new Error("Please specify a limit greater than 0");

        if (limit > 100)
            throw new Error("Please specify a limit less than or equal to 100");

        if (page < 1)
            throw new Error("Please specify a page greater than 0");
    }

    /**
     * A helper function to ensure that API calls are successful and return a valid status code.
     * @param call The API call to guard for exceptions and bad return codes.
     * @returns A promise of the type returned by Axios in the data field.
     */
    protected async execute<T>(call: () => Promise<AxiosResponse<T, any>>): Promise<T> {

        let result: AxiosResponse;

        try {

            result = await call();

        } catch (ex) {

            if (ex instanceof AxiosError) {
                throw MozaicError.create(ex);
            } 
            else if(ex instanceof Error) {
                throw MozaicError.create(ex);
            }

            throw MozaicError.create(ex);
        }

        if (result.status != 200)
            throw MozaicError.create(result);

        return result.data;
    }
}

