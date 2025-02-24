---
title: Contacts
group: Documents
category: Guides
---

[Back to the SDK](../index.md)

# Contacts (Resource)
Mozaic uses Contacts to refer to your view of the people who you interact with. This is information is separate from user account information. For example, you might give a Contact a different name like "Pat Jones (Business)", but Pat's user account could have a completely different user name that you do not see or control. In this way, your Contact's information is private to them, while still giving you the ability to recognize and interact with them. When you create a [Payment Cycle](PaymentCycles.md), any new recipients you add to your [Payment Cycle](PaymentCycles.md) will automatically have contacts created for them after you finalize the [Payment Cycle](PaymentCycles.md). If you have not finalized the [Payment Cycle](PaymentCycles.md), then any contacts will not exist yet, and will not be retrieved through this resource. You can review contacts that have not yet been created as Payment Cycle Entries through the [Payment Cycle](PaymentCycles.md) resource.

## External IDs 
You can assign an External ID to any contact when you create contacts by sending them payments. The External ID allows you to associate your own system identifier with the contact that have created. This ensures that any future payment you send to the External ID will be delivered to the same person, even if that person changes their email address with you, or if they change their email address on Mozaic. Note: you must ensure that the External ID is unique in your system to avoid sending the payment to an unintentional recipient. Mozaic will allow you to send a payment to a payment recipient even if the recipient's email address does not match Mozaic's records as long as the External IDs match. If your recipient would like to change their email address, they will need to do it via the Mozaic app in addition to updating it in your system.

## Retrieving payments and payments cycles related to a contact
After a Payment Cycle has been finalized and new Contacts have been created, payments, payment cycles and payment cycle entries will all be linked to the contact. You can search for Contacts in various ways. In the below example, we will find a contact by external ID and then find payments related to that contact.

```
// Get a contact by external ID
const contact = await client.Contacts.getContactByExternalId("EXT-1234505");

// Get the last 10 payments to the contact
const payments = await contact.getPayments(10, 1);

// Loop through each payment and get the Payment Cycle Entry and Payment Cycle for each payment
await payments.data.forEach(async payment => {
    const paymentCycle = await payment.getPaymentCycle();
    const paymentCycleEntry = await payment.getPaymentCycleEntry();
}
```