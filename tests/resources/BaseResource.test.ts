import { BaseResource } from "../../src/resources/BaseResource";

class BaseResourceTest extends BaseResource {

    test<T>(name: string, value: T | null | undefined) : T
    {
        return this.throwIfNullOrUndefined(name, value);
    };

    testLimitAndPage(limit: number, page: number) : void {
        this.throwIfLimitOrPageAreInvalid(limit, page);
    }
}

describe("BaseResource Tests", () => {

    it("BaseResource should thrown an error if limit or page are invalid", async () => {
        var resource = new BaseResourceTest();

        try {
            resource.testLimitAndPage(0, 1);
            fail("It didn't throw the exception.");
          }
          catch(ex) {
            expect((ex as Error).message).toBe("Please specify a limit greater than 0");
          }
      
          try {
            resource.testLimitAndPage(101, 1);
            fail("It didn't throw the exception.");
          }
          catch(ex) {
            expect((ex as Error).message).toBe("Please specify a limit less than or equal to 100");
          }
      
          try {
            resource.testLimitAndPage(100, 0);
            fail("It didn't throw the exception.");
          }
          catch(ex) {
            expect((ex as Error).message).toBe("Please specify a page greater than 0");
          }
    });

    it("BaseResource should return a value is value is available", async () => {
        var resource = new BaseResourceTest();

        expect(resource.test("testName", "value")).toBe("value");
        expect(resource.test("testName", 10.10)).toBe(10.10);
        expect(resource.test("testName", {its:"complicated"}).its).toBe("complicated");
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
});