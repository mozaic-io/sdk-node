---
title: Web Hooks
group: Documents
category: Guides
---

[Back to the SDK](index.md)

# Mozaic Web Hooks
Mozaic offers a wide variety of web hook events that you can subscribe to through the Mozaic web application. 

| Environment | Web Hook Control Panel |
| ----------- | ----------- | 
| Sandbox | https://app.sandbox.mozaic.io/account/web-hooks |

Once you add your web hook endpoint to your account, Mozaic will begin sending you events by calling your endpoint with information about the event. A list of events that you can subscribe to is available in the control panel along with logs and activity metrics. 

## Web Hook Descriptions

### Funding Failed (funding-failed)
This event is raised when the payment sender's funding payment fails. This can occur when Mozaic attempts to charge your stored payment method while funding a payment cycle in progress. If you receive this event, you should check the results of the action related to the funding and resubmit it after correcting the funding error.

### Invoice Created (invoice-created)
This event is sent when an invoice has been created. Once you finalize a payment cycle, Mozaic will create an invoice for the payment. If you used a stored funding method to fund the payment, then the invoice is for your records. If you are paying by invoice, then the invoice will also contain a virtual bank account that you can wire money to and complete payment for your payment cycle. 

### Invoice Paid (invoice-paid)
This event is sent when an invoice has been paid. Once the invoice is paid, then the related workflow is completed. When the invoice is related to a payment cycle, then invoice payment triggers the payment cycle to complete. payments will be issued to all recipients on the payment cycle. 

### Payment Cycle Entry Updated (payment-cycle-entry-updated)
This event is sent when a payment cycle entry has been updated. Each payment recipient on your payment cycle is represented by a payment cycle entry consisting of a name, email address, amount and currency. As each recipient is paid in a payment cycle, this event is raised to indicate the status of the payment and provide details about the payment.

### Payment Cycle Updated (payment-cycle-updated)
This event is sent when a payment cycle is updated. A payment cycle has several stages. 
* Draft: The payment cycle has been created and is still being modified. 
* Locked: The payment cycle can not be modified but has not been finalized yet. 
* Processing: The payment cycle has been funded and payments are being sent. 
* Invoicing: The payment cycle is waiting for funding. The funding can be automatically withdrawn from your stored payment sources or provided manually via bank transfer. 
* Cancelled: The payment cycle has been cancelled by the requestor or via system automation. 
* Completed: All payment recipients have been sent payments. 
* CompletedWithErrors: One or more payment recipients on the payment cycle have not been paid. Manual correction is required to complete payment to these recipients. 
* Failed: The payment cycle could not send funds to the payment recipients. Inspect the payment cycle for more details. 

### Payment Updated (payment-updated)
This event is sent when a payment has been updated. This event can be used to detect when a payment recipient has accepted or rejected their payment.
