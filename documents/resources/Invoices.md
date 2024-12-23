---
title: Invoices
group: Documents
category: Guides
---

[Back to the SDK](../index.md)

# Invoices (Resource)

Mozaic uses invoices to request money from you to pay other people. When you create a [Payment Cycle](PaymentCycles.md), you will need to provide funding for it before Mozaic can pay your recipients. If you are using a funding source like a Bank Account or a Debit Card, then Mozaic can transfer money from this funding source to your payment recipients. If you would prefer to manage this payment yourself, Mozaic can send you an invoice instead. You can then work with your bank to wire money to the virtual account that Mozaic will provide on your invoice. 

## Testing an Invoice Payment

While there isn't a way to test transferring money to your Mozaic virtual account on a test invoice, you can use the Mozaic SDK to make an invoice as paid. When you do this, Mozaic will use your virtual account balance to fund your payment cycle. As part of your sandbox setup, Mozaic will add money to this virtual account balance to enable you to test the integration in the sandbox environment. 

### Marking an Invoice as Paid (Example)
```
const finalizedPaymentCycle = await paymentCycle.finalizeByInvoice();

const paidInvoice = await client.Invoices.payInvoice(finalizedPaymentCycle.invoiceId);
```