import { AxiosResponse } from "axios";
import { ApiException } from "./ApiException";

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
    protected throwIfNullOrUndefined<T> (name: string, value: T | null | undefined) : T
    {
        if(value === null || value === undefined)
            throw new Error(`${name} is null or undefined`);

        return value;
    }

    /**
     * A helper function to validate limit and paging parameters.
     * @param limit Must be between 1 and 100 inclusive.
     * @param page Must be greater than 0
     */
    protected throwIfLimitOrPageAreInvalid(limit: number, page: number) : void {
        if(limit < 1)
            throw new Error("Please specify a limit greater than 0");

        if(limit > 100)
            throw new Error("Please specify a limit less than or equal to 100");

        if(page < 1)
            throw new Error("Please specify a page greater than 0");
    }

    /**
     * A helper function to detect when the API has returned a non-ok response and throw an exception.
     * @param response 
     */
    protected throwIfServerResponseIsNot200(response: AxiosResponse) : void {
        if(response.status != 200)
            throw new ApiException(response);
    }
}

