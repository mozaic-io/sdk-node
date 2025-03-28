import { AxiosError, AxiosResponse } from "axios";

export class MozaicError extends Error {
    /**
     * An HTTP Status code from any underlying api call
     */
    status: number;

    /**
     * The raw exception or other data object that was wrapped by MozaicError. 
     * This can be logged if you need additional details about the issue.
     */
    rawError: any;

    /**
     * @internal - To be used by the internal system only. 
     * @param axiosResponse 
     */
    private constructor(status: number, message: string, stack: string | undefined, rawError: any) {
        super(message);

        if (stack !== undefined)
            this.stack = stack;

        this.status = status;
        this.rawError = rawError;

        // Restore the prototype chain
        Object.setPrototypeOf(this, new.target.prototype);
    }

    static create(obj: AxiosResponse): MozaicError;
    static create(obj: AxiosError): MozaicError;
    static create(obj: Error): MozaicError;
    static create(obj: any): MozaicError;

    static create(obj: AxiosResponse | AxiosError | Error): MozaicError {
        if (obj instanceof AxiosError) {
            let message = "";

            if ((obj as any).errors !== undefined) {
                ((obj as any).errors as []).forEach((value: any, index) => {
                    if (index > 0)
                        message += ", ";

                    message += value.message;
                });
            }
            else {
                message = obj.message;
            }

            if (obj.response !== undefined) {
                message += ": " + obj.response.statusText;

                if (obj.response.data !== undefined) {
                    if (Array.isArray(obj.response.data) == true) {
                        obj.response.data.forEach(value => {
                            if (value.ErrorMessage === undefined)
                                message += JSON.stringify(value);
                            else
                                message += ", " + value.ErrorMessage;
                        });
                    }
                    else if (obj.response.data.errors !== undefined && obj.response.data.errors.Status !== undefined && Array.isArray(obj.response.data.errors.Status) == true) {
                        obj.response.data.errors.Status.forEach((value: any, index: number) => {
                            message += ", " + value;
                        });
                    }
                    else {
                        message += ", " + obj.response.data;
                    }
                }
            }

            let status = obj.status ?? -1;

            return new MozaicError(status, message, obj.stack, obj);
        }
        else if (obj instanceof Error) {
            return new MozaicError(-1, obj.message, obj.stack, obj);
        }

        const response = obj as AxiosResponse;

        // If it is a real AxiosResponse, then these should be set at a minimum.
        if (response.status !== undefined && response.data !== undefined)
            return new MozaicError(response.status, response.data, undefined, obj);

        // If it's just a raw string.
        if (typeof obj === "string")
            return new MozaicError(-1, obj, undefined, obj);

        // Everything else!
        return new MozaicError(-1, JSON.stringify(obj), undefined, obj);
    }
}