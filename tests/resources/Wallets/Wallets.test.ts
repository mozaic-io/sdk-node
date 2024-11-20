import { Mozaic } from "../../../src";
import { WalletsApi } from "../../../src/api";
import { TestUtils } from "../../TestUtils";
import { WalletsEntities } from "./WalletsEntities";

const sdk = new Mozaic(
  "http://mocked.mozaic.io",
  "mocked-pat-123456789"
);

jest.mock("../../../src/api");
const mockWalletApi = sdk.Wallets.WalletsApi as jest.Mocked<WalletsApi>;

describe("Wallet Tests", () => {

  it("getWallets should fail if the api returns a wallet with no key", async () => {

    var rawData = WalletsEntities.apiWalletsGet(false, true);

    mockWalletApi.apiWalletsGet.mockResolvedValue(
        TestUtils.createSuccessfulAxiosResponse(
            rawData
        )
      );

      try {
        var wallets = await sdk.Wallets.getWallets();

      fail("It didn't throw the exception.");
    }
    catch(ex) {
      expect(ex).toBeInstanceOf(Error);
      expect((ex as Error).message).toBe("Unknown wallet type");
    }
});

  it("getWallets should return a list of wallets", async () => {

    var rawData = WalletsEntities.apiWalletsGet(false, false);

    mockWalletApi.apiWalletsGet.mockResolvedValue(
        TestUtils.createSuccessfulAxiosResponse(
            rawData
        )
      );

      var wallets = await sdk.Wallets.getWallets();

      expect(wallets.length).toBe(2);

      wallets.forEach((value) => {
        let rawWallet = rawData.find((rawValue) => rawValue.id == value.id)

        expect(value.key).toBe(rawWallet?.key);

        value.paymentMethods.forEach((paymentMethod) => {
            let rawPaymentMethod = rawWallet?.payment_methods?.find((rawValue) => rawValue.external_id == paymentMethod.paymentMethodId);

            expect(paymentMethod.brand).toBe(rawPaymentMethod?.brand);
            expect(paymentMethod.default).toBe(rawPaymentMethod?.default_for_currency);
            expect(paymentMethod.expiration.display).toBe(rawPaymentMethod?.exp?.display);
            expect(paymentMethod.expiration.month).toBe(rawPaymentMethod?.exp?.month);
            expect(paymentMethod.expiration.year).toBe(rawPaymentMethod?.exp?.year);
            expect(paymentMethod.lastFour).toBe(rawPaymentMethod?.last_four);
            expect(paymentMethod.name).toBe(rawPaymentMethod?.account_bank_name);
            expect(paymentMethod.type).toBe(rawPaymentMethod?.payment_method_type);
        });
        
        expect(value.key).toBe(rawWallet?.key);
      });
  });


});