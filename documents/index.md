---
title: Mozaic SDK
group: Documents
category: Guides
children:
    - ./resources/Invoices.md
    - ./resources/PaymentCycles.md
    - ./resources/Permissions.md
    - ./resources/Wallets.md
---

# The Mozaic SDK
The purpose of this SDK to is to provide easy access to the underlying Mozaic API. You can always get full access to the Mozaic API through this SDK. Each resource object will also provide access to all API endpoints and server responses so that you can take advantage of all of the features of Mozaic any time you wish. Refer to the HTTP Api documentation for more information about the Mozaic API. This SDK documentation will only focus on the higher-level SDK features. 

## Prerequisites
* You will need to obtain a **Personal Access Token** from your Mozaic account representative to authorize your access to the API.

* You will need to complete onboarding steps with your Mozaic account representative. After you have added your payment information to the system Mozaic will be able to process payments on your behalf. Payments and Payouts should both be enabled on your account, which is visible inside the Mozaic website. Your account representative will assist you with this one-time setup.

## Endpoints

The following endpoints can be passed to the SDK:

| Environment | End Point |
| --------- | ----------- | 
| Sandbox | https://api.sandbox.mozaic.io |



## Before you call a Resource...

All Resources require an active SDK connection. This is done by simply creating an instance of the SDK's root Mozaic class.

```
const sdk = new Mozaic(<End Point>, <Personal Access Token>);         
```

Creating an instance of the SDK is very cheap and it is also stateless. You can keep it globally, or create one whenever you need to use it.

## Web Hooks
Mozaic provides a rich set of Web Hooks that enables direct callbacks to your own API when key events happen inside the system. For more information and documentation of web hook options, please see [Web Hooks](webhooks.md).

## Resources

The Mozaic SDK consists of *Resources*. These are functional groupings of services and logic that let you perform actions with the Mozaic API. Each resource will have a top level object that is the main interface to other classes and functionality in the Resource. Resources can call other Resources and you may use several Resources together to complete a business process. The SDK's goal is to make this as easy and intuitive as possible.

### [Invoices](resources/Invoices.md)

The [Invoices](resources/Invoices.md) resource enables you to download the PDF bytes of an invoice. You can then send them to a UI or download the bytes to a local file. You can also use this resource to mark an invoice as paid which will then use your Mozaic balance to fund your payment cycle.

### [PaymentCycles](resources/PaymentCycles.md)

The [PaymentCycles](resources/PaymentCycles.md) resource enables you to create a payment of various amounts to various people for an accounting period. This resource also lets you edit a payment cycle's entries, provide funding for the payment cycle, finalize the payment cycle to pay your recipients and download an invoice for the payment cycle. 

### [Permissions](resources/Permissions.md)

The [Permissions](resources/Permissions.md) resource enables you to get a list of UI visibility permissions for the current Personal Access Token used to authenticate to the SDK. If you are running into issues while doing an action with the API, it might be because your Personal Access Token is lacking the correct security setup. Contact your Mozaic account representative to correct any issues.

### [Wallets](resources/Wallets.md)

The [Wallets](resources/Wallets.md) resource enables you to manipulate your stored payment and payout methods. You will use your wallet to fund payment cycles, withdraw money from your Mozaic account and other wallet actions.

