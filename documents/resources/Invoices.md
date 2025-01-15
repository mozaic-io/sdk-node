---
title: Invoices
group: Documents
category: Guides
---

[Back to the SDK](../index.md)

# Invoices (Resource)

Mozaic uses invoices to request money from you to pay other people. When you create a [Payment Cycle](PaymentCycles.md), you will need to provide funding for it before Mozaic can pay your recipients. If you are using a funding source like a Bank Account or a Debit Card, then Mozaic can transfer money from this funding source to your payment recipients. If you would prefer to manage this payment yourself, Mozaic can send you an invoice instead. You can then work with your bank to wire money to the virtual account that Mozaic will provide on your invoice. 

## Testing an Invoice Payment

While there isn't a way to test transferring money to your Mozaic virtual account to fund a test invoice, you can download the invoice and then use the online payment link to pay the invoice using a test credit card. The following test credit card will work for testing an invoice payment in any non-production environment. See the [Payment Cycle Example](https://github.com/mozaic-io/sdk-node/tree/master/examples/payment-cycles) for details.

```
Visa (Debit)
PAN: 4000 0566 5566 5556 
EXP: 09/30 
CVC: 123
```