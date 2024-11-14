import { AxiosResponse } from "axios";

export class ApiException
{
    /** 
     * A string indicating that the error is due to the underlying API 
     */
    public readonly Message : string = "API Error";

    /**
     * The raw response from the API that can be used to diagnose the issue.
     */
    public readonly AxiosResponse : AxiosResponse;

    /**
     * @internal - To be used by the internal system only. 
     * @param axiosResponse 
     */
    constructor(axiosResponse: AxiosResponse)
    {
        this.AxiosResponse = axiosResponse;
    }
}