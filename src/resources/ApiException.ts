import { AxiosResponse } from "axios";

export class ApiException extends Error {
  /**
   * The raw response from the API that can be used to diagnose the issue.
   */
  public readonly AxiosResponse: AxiosResponse;

  /**
   * @internal - To be used by the internal system only.
   * @param axiosResponse
   */
  constructor(axiosResponse: AxiosResponse, message: string = "API Error") {
    super(message);
    this.name = "ApiException";
    this.AxiosResponse = axiosResponse;
  }
}
