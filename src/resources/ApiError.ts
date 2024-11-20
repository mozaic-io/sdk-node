import { AxiosError, AxiosResponse } from "axios";

export class ApiError extends Error
{
    /**
     * An HTTP Status code from any underlying api call
     */
    status : number;
    
    /**
     * @internal - To be used by the internal system only. 
     * @param axiosResponse 
     */
    private constructor(status: number, message: string, stack: string | undefined)
    {
        super(message);

        if(stack !== undefined)
            this.stack = stack;

        this.status = status;
        
        // Restore the prototype chain
        Object.setPrototypeOf(this, new.target.prototype);
    }

    static create(obj: AxiosResponse) : ApiError;
    static create(obj: AxiosError) : ApiError;

    static create(obj: AxiosResponse | AxiosError) : ApiError {
        if(obj instanceof AxiosError)
        {
            let message = obj.message;
            if(obj.response !== undefined) {
                message += ": " + obj.response.statusText;
            }

            let status = obj.status ?? -1;

            return new ApiError(status, message, obj.stack);
        }
            

        const response = obj as AxiosResponse;

        return new ApiError(response.status, response.data, undefined);
    }
}