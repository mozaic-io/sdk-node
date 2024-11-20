import { Axios, AxiosError, AxiosResponse } from "axios";
import { BaseResource } from "../../src/resources/BaseResource";
import { MozaicError } from "../../src";

class BaseResourceTest extends BaseResource {

  test<T>(name: string, value: T | null | undefined): T {
    return this.throwIfNullOrUndefined(name, value);
  };

  testLimitAndPage(limit: number, page: number): void {
    this.throwIfLimitOrPageAreInvalid(limit, page);
  }

  testExecute<T>(call: () => Promise<AxiosResponse<T, any>>): Promise<T> {
    return this.execute(call);
  }
}

describe("BaseResource Tests", () => {

  it("BaseResource should thrown an error if limit or page are invalid", async () => {
    var resource = new BaseResourceTest();

    try {
      resource.testLimitAndPage(0, 1);
      fail("It didn't throw the exception.");
    }
    catch (ex) {
      expect((ex as Error).message).toBe("Please specify a limit greater than 0");
    }

    try {
      resource.testLimitAndPage(101, 1);
      fail("It didn't throw the exception.");
    }
    catch (ex) {
      expect((ex as Error).message).toBe("Please specify a limit less than or equal to 100");
    }

    try {
      resource.testLimitAndPage(100, 0);
      fail("It didn't throw the exception.");
    }
    catch (ex) {
      expect((ex as Error).message).toBe("Please specify a page greater than 0");
    }
  });

  it("BaseResource should return a value is value is available", async () => {
    var resource = new BaseResourceTest();

    expect(resource.test("testName", "value")).toBe("value");
    expect(resource.test("testName", 10.10)).toBe(10.10);
    expect(resource.test("testName", { its: "complicated" }).its).toBe("complicated");
  });

  it("BaseResource should throw an exception if value is null", async () => {
    var resource = new BaseResourceTest();

    try {
      resource.test("testName", null);
    }
    catch (ex) {
      expect((ex as Error).message).toBe("testName is null or undefined");
    }
  });

  it("BaseResource should throw an exception if value is undefined", async () => {
    var resource = new BaseResourceTest();

    try {
      resource.test("testName", undefined);
    }
    catch (ex) {
      expect((ex as Error).message).toBe("testName is null or undefined");
    }
  });

  it("BaseResource execute should handle AxiosError", async () => {
    var resource = new BaseResourceTest();

    try {
      await resource.testExecute(() => {
        throw new AxiosError("Oh Noes!");
      });

      fail("It didn't throw an exception.");
    } catch (ex) {
      expect(ex).toBeInstanceOf(MozaicError);

      const error = ex as MozaicError;
      expect(error.message).toBe("Oh Noes!");
      expect(error.status).toBe(-1);
    }
  });

  it("BaseResource execute should handle Error", async () => {
    var resource = new BaseResourceTest();

    try {
      await resource.testExecute(() => {
        throw new Error("Oh Noes!");
      });

      fail("It didn't throw an exception.");
    } catch (ex) {
      expect(ex).toBeInstanceOf(MozaicError);
      
      const error = ex as MozaicError;
      expect(error.message).toBe("Oh Noes!");
      expect(error.status).toBe(-1);
    }
  });

  it("BaseResource execute should handle random string exception", async () => {
    var resource = new BaseResourceTest();

    try {
      await resource.testExecute(() => {
        throw "Oh Noes!";
      });

      fail("It didn't throw an exception.");
    } catch (ex) {
      expect(ex).toBeInstanceOf(MozaicError);

      const error = ex as MozaicError;
      expect(error.message).toBe("Oh Noes!");
      expect(error.status).toBe(-1);
    }
  });

  it("BaseResource execute should handle random object exception", async () => {
    var resource = new BaseResourceTest();

    const exception = {msg: "yay", code: 100, junk: "yes"};

    try {
      await resource.testExecute(() => {
        throw exception;
      });

      fail("It didn't throw an exception.");
    } catch (ex) {
      expect(ex).toBeInstanceOf(MozaicError);

      const error = ex as MozaicError;
      expect(error.message).toBe(JSON.stringify(exception));
      expect(error.status).toBe(-1);
    }
  });

  it("BaseResource execute should handle aggregate axios exception", async () => {
    var resource = new BaseResourceTest();

    const exception: AxiosError = new AxiosError;
    
    (exception as any).errors = [{message: "one"}, {message: "two"}];

    try {
      await resource.testExecute(() => {
        throw exception;
      });

      fail("It didn't throw an exception.");
    } catch (ex) {
      expect(ex).toBeInstanceOf(MozaicError);

      const error = ex as MozaicError;
      expect(error.message).toBe("one, two");
      expect(error.status).toBe(-1);
    }
  });
});