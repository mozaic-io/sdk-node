
import { Mozaic } from "../../../src";
import { PaymentCycleListResponse, PaymentCyclesApi } from "../../../src/api";
import { TestUtils } from "../../TestUtils";
import { ApiException } from "../../../src/resources/ApiException";
import { PaymentCyclesEntities } from "./PaymentCyclesEntities";
import { PaymentCycleList } from "../../../src/resources/PaymentCycles/PaymentCycleList";
import { PaymentCycle } from "../../../src/resources/PaymentCycles/PaymentCycle";

const sdk = new Mozaic(
  "http://mocked.mozaic.io",
  "mocked-pat-123456789"
);

jest.mock("../../../src/api");
const mockPaymentCyclesApi = sdk.PaymentCycles.PaymentCyclesApi as jest.Mocked<PaymentCyclesApi>;

describe("Payment Cycle Tests", () => {
  it("createPaymentCycle should attempt to create a payment cycle through the mock", async () => {

    mockPaymentCyclesApi.createPaymentCycle.mockResolvedValue(
      TestUtils.createSuccessfulAxiosResponse(
        PaymentCyclesEntities.getTestPaymentCycleResponse("test cycle", "default", "This is a memo", new Date("1/1/2024"), new Date("1/31/2024"), "draft")
      )
    );

    const paymentCycle = await sdk.PaymentCycles.createPaymentCycle(
      "test cycle",
      "default",
      "This is a memo",
      new Date("1/1/2024"),
      new Date("1/31/2024")
    );

    expect(paymentCycle.paymentCycleId).toBe("payment-cycle_tWB7BiTh-kWIM1__k-tAag");
  });

  it("createPaymentCycle should throw an exception when it gets an error from the api", async () => {
    mockPaymentCyclesApi.createPaymentCycle.mockResolvedValue(
      TestUtils.createFailedAxiosResponse(
        PaymentCyclesEntities.getTestPaymentCycleResponse("test cycle", "default", "This is a memo", new Date("1/1/2024"), new Date("1/31/2024"), "draft")
      )
    );

    try {
      await sdk.PaymentCycles.createPaymentCycle("test cycle", "default", "This is a memo", new Date("1/1/2024"), new Date("1/31/2024"));
      fail("Call did not throw an exception.");
    } catch (ex) {
      expect(ex).toBeInstanceOf(ApiException);
    }
  });

  it("getPaymentCycles should get a list of payment cycles", async () =>
  {
    mockPaymentCyclesApi.listPaymentCycles.mockResolvedValue(
      TestUtils.createSuccessfulAxiosResponse(
        PaymentCyclesEntities.listPaymentCycles(10, 1)
      )
    );

    var paymentCycles = await sdk.PaymentCycles.getPaymentCycles(10, 1);

    expect(paymentCycles.data.length).toBe(10);
  });

  // it("getPaymentCycles should ensure all parameters are valid", async() =>
  // {
  //   mockPaymentCyclesApi.listPaymentCycles.mockResolvedValue(
  //     TestUtils.createSuccessfulAxiosResponse(
  //       PaymentCyclesEntities.listPaymentCycles(10, 1)
  //     )
  //   );

    
  // });

  it("getPaymentCycles should fail when the api returns a non 200 result", async () =>
  {
    mockPaymentCyclesApi.listPaymentCycles.mockResolvedValue(
      TestUtils.createFailedAxiosResponse(
        PaymentCyclesEntities.listPaymentCycles(10, 1)
      )
    );

    try {
      var paymentCycles = await sdk.PaymentCycles.getPaymentCycles(10, 1);
      fail("It didn't throw the exception.");
    }
    catch(ex) {
      expect(ex).toBeInstanceOf(ApiException);
    }
  });

  it("getPaymentCycles should fail when the api returns invalid data", async () =>
    {
      mockPaymentCyclesApi.listPaymentCycles.mockResolvedValue(
        TestUtils.createSuccessfulAxiosResponse(
          {
            count: 0,
            page: 1,
            data: undefined,
            total_count: 0
          } as PaymentCycleListResponse
        )
      );
  
      try {
        var paymentCycles = await sdk.PaymentCycles.getPaymentCycles(10, 1);
        fail("It didn't throw the exception.");
      }
      catch(ex) {
        expect((ex as Error).message).toBe("Data element was undefined, unable to copy the data from the API to the list. Check the map function on the API result handler.");
      }
    });


    it("getPaymentCycle should get a single payment cycles", async () =>
      {
        mockPaymentCyclesApi.getPaymentCycleById.mockResolvedValue(
          TestUtils.createSuccessfulAxiosResponse(
            PaymentCyclesEntities.getTestPaymentCycleResponse("test cycle", "default", "This is a memo", new Date("1/1/2024"), new Date("1/31/2024"), "draft")
          )
        );
    
        var paymentCycle = await sdk.PaymentCycles.getPaymentCycle("payment-cycle_tWB7BiTh-kWIM1__k-tAag");
    
        // This is not a great test, it's really just checking that the values in the deets made it into the response
        // but as that is done in the test helper and not on the server side, we are validating the helper not 
        // any real code. At least we know the helper is correct.
        expect(paymentCycle.paymentCycleId).toBe("payment-cycle_tWB7BiTh-kWIM1__k-tAag");
      });

      it("getPaymentCycle should throw an exception when the response from the server is invalid", async () =>
        {
          mockPaymentCyclesApi.getPaymentCycleById.mockResolvedValue(
            TestUtils.createFailedAxiosResponse(
              PaymentCyclesEntities.getTestPaymentCycleResponse("test cycle", "default", "This is a memo", new Date("1/1/2024"), new Date("1/31/2024"), "draft")
            )
          );
      
          try {
            var paymentCycle = await sdk.PaymentCycles.getPaymentCycle("payment-cycle_tWB7BiTh-kWIM1__k-tAag");
            fail("It didn't throw the exception.");
          }
          catch(ex) {
            expect(ex).toBeInstanceOf(ApiException);
          }

        });

      it("PaymentCycleList should be create-able with optional arguments", () => {
          let paymentCycle = new PaymentCycleList({count: 1, page: 1, total_count: 1}, [new PaymentCycle(sdk, mockPaymentCyclesApi, PaymentCyclesEntities.getTestPaymentCycleResponse("test cycle", "default", "This is a memo", new Date("1/1/2024"), new Date("1/31/2024"), "draft"))]);

          expect(paymentCycle.count).toBe(1);
          expect(paymentCycle.data.length).toBe(1);
          expect(paymentCycle.totalCount).toBe(1);
          expect(paymentCycle.page).toBe(1);

          paymentCycle = new PaymentCycleList({}, []);

          expect(paymentCycle.count).toBe(0);
          expect(paymentCycle.data.length).toBe(0);
          expect(paymentCycle.totalCount).toBe(0);
          expect(paymentCycle.page).toBe(0);
      });
});