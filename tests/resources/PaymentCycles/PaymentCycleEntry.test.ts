import { Mozaic } from "../../../src";
import { PaymentCycleEntry } from "../../../src/resources/PaymentCycles/PaymentCycleEntry";
import { faker } from "@faker-js/faker";

const sdk = new Mozaic(
  "http://mocked.mozaic.io",
  "mocked-pat-123456789"
);


describe("Payment Cycle Entry Tests", () => {
  
  

  it("PaymentCycleEntry should ensure the RawPaymentCycleEntry contains correct data during wrapping", () =>
  {
    
    try {
      new PaymentCycleEntry({});
      fail("It didn't throw the exception.");
    }
    catch(ex) {
      expect((ex as Error).message).toBe("paymentCycleEntry.to is undefined");
    }

    try {
      new PaymentCycleEntry({to: {name: faker.person.fullName()}});
      fail("It didn't throw the exception.");
    }
    catch(ex) {
      expect((ex as Error).message).toBe("paymentCycleEntry.to.email is null or undefined");
    }

    try {
      new PaymentCycleEntry({to: {name: faker.person.fullName(), email: faker.internet.email()}});
      fail("It didn't throw the exception.");
    }
    catch(ex) {
      expect((ex as Error).message).toBe("paymentCycleEntry.original_amount is null or undefined");
    }

    try {
      new PaymentCycleEntry({to: {name: faker.person.fullName(), email: faker.internet.email()}, original_amount: {}});
      fail("It didn't throw the exception.");
    }
    catch(ex) {
      expect((ex as Error).message).toBe("paymentCycleEntry.status is null or undefined");
    }
  });

});

