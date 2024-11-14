import {Wallet as RawWallet} from "../../../src/api";

export class WalletsEntities {
    static apiWalletsGet(keepPaymentMethodsEmpty: boolean, keepKeyEmpty: boolean): RawWallet[] {
        let returnValue = new Array<RawWallet>();

        returnValue.push({
            id: "prov1_internal_id_12345",
            external_account_id: "prov1_12345",
            key: keepKeyEmpty ? undefined : "prov1-us",
            payment_methods: keepPaymentMethodsEmpty ? [] : [
                {
                    external_id: "prov1_card_12345",
                    last_four: "1111",
                    default_for_currency: true,
                    payment_method_type: "card",
                    brand: "Diner's Club",
                    exp: {
                        display: "04/25",
                        month: 4,
                        year: 2025
                    },
                    account_bank_name: "My Cool Card"
                },
                {
                    external_id: "prov1_card_54321",
                    last_four: "2222",
                    default_for_currency: false,
                    payment_method_type: "card",
                    brand: "Visa",
                    exp: {
                        display: "08/28",
                        month: 8,
                        year: 2028
                    },
                    account_bank_name: "My Visa Card"
                }
            ],
            payout_methods: [
                {
                    external_id: "prov1_payout_card_888888",
                    last_four: "8888",
                    default_for_currency: true,
                    payout_method_type: "card",
                    brand: "Master Card",
                    exp: {
                        display: "06/29",
                        month: 6,
                        year: 2029
                    },
                    account_bank_name: "My MC Card"
                },
                {
                    external_id: "prov1_card_999999",
                    last_four: "7777",
                    default_for_currency: false,
                    payout_method_type: "debit",
                    brand: "Amex",
                    exp: {
                        display: "08/30",
                        month: 9,
                        year: 2031
                    },
                    account_bank_name: "My Amex Card"
                }
            ],
        });


        returnValue.push({
            id: "prov2_internal_id_65432",
            external_account_id: "prov2_65432",
            key: "prov2-us",
            payment_methods: keepPaymentMethodsEmpty ? [] : [
                {
                    external_id: "prov2_card_12345",
                    last_four: "1111",
                    default_for_currency: true,
                    payment_method_type: "card",
                    brand: "Diner's Club",
                    exp: {
                        display: "04/25",
                        month: 4,
                        year: 2025
                    },
                    account_bank_name: "My Cool Card"
                },
                {
                    external_id: "prov2_card_54321",
                    last_four: "2222",
                    default_for_currency: false,
                    payment_method_type: "card",
                    brand: "Visa",
                    exp: {
                        display: "08/28",
                        month: 8,
                        year: 2028
                    },
                    account_bank_name: "My Visa Card"
                }
            ],
            payout_methods: [
                {
                    external_id: "prov2_payout_card_888888",
                    last_four: "8888",
                    default_for_currency: true,
                    payout_method_type: "card",
                    brand: "Master Card",
                    exp: {
                        display: "06/29",
                        month: 6,
                        year: 2029
                    },
                    account_bank_name: "My MC Card"
                },
                {
                    external_id: "prov2_card_999999",
                    last_four: "7777",
                    default_for_currency: false,
                    payout_method_type: "debit",
                    brand: "Amex",
                    exp: {
                        display: "08/30",
                        month: 9,
                        year: 2031
                    },
                    account_bank_name: "My Amex Card"
                }
            ],
        });

        return returnValue;
    }
}