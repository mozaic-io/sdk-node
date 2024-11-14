import { AxiosHeaders, AxiosResponse } from "axios";

export class TestUtils {

  static createSuccessfulAxiosResponse<T>(data: T): AxiosResponse {
    return {
      data: data,
      status: 200,
      statusText: "Ok",
      config: { headers: new AxiosHeaders() },
      headers: {},
    };
  }

  static createFailedAxiosResponse<T>(data: T): AxiosResponse {
    return {
      data: data,
      status: 400,
      statusText: "Failed",
      config: { headers: new AxiosHeaders() },
      headers: {},
    };
  }
}
