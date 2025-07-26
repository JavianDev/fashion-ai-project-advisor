"use server"
// TODO: Migrate to .NET Web API - temporarily disabled
// import prisma from "@/lib/prisma";
import { clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import configFile from "@/config";
import { stripeService } from "@/lib/lib/stripe";
import emailEvents from "@/events/email-events";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-06-30.basil' });

export async function getSubscriptionByUserId(userId: string) {
    // TODO: Migrate to .NET Web API
    throw new Error('Function temporarily disabled - migrating to .NET Web API');

    /* DISABLED - MIGRATE TO .NET WEB API
    const existingSubscription = await prisma.subscriptionSnb.findFirst({
        where: { userId: userId },
    });
    return existingSubscription
    */
}

export async function processCheckoutSuccessWebhook(body: any, event: Stripe.Event) {
  // TODO: Migrate to .NET Web API
  throw new Error('Function temporarily disabled - migrating to .NET Web API');
}

/* DISABLED - MIGRATE TO .NET WEB API
export async function processCheckoutSuccessWebhook_DISABLED(body: any, event: Stripe.Event) {
  const stripeObject: Stripe.Checkout.Session = event.data
  .object as Stripe.Checkout.Session;
const session = await stripeService.findCheckoutSession(stripeObject.id);
const customerId = session?.customer;
const priceId = session?.line_items?.data[0]?.price.id;
const plan = configFile.stripe.products.find((p) => p.priceId === priceId);
if (!plan) {
  return NextResponse.json({ error: 'Plan not found' }, { status: 400 });
}
const customer = (await stripe.customers.retrieve(
  customerId as string
)) as Stripe.Customer;

if (!customer || !customer.email) {
  console.error('No customer email found');
  return NextResponse.json({ error: 'No customer email found for subscription' }, { status: 400 });
}

const price = await stripe.prices.retrieve(priceId)

if(!price) {
  return new Response('Price not found', {
    status: 500
  })
}

const product = await stripe.products.retrieve(
  typeof price.product === 'string' ? price.product : price.product.id
);

if(!product) {
return new Response('Product not found', {
  status: 500
})
}

const subsType = product.metadata.subscription_type || 'default'
const customerEmail = customer.email;
const users = await (await clerkClient()).users.getUserList({emailAddress:[customerEmail]})

if (!users.data.length) {
  console.error('Clerc user not found');
  return NextResponse.json({ error: 'No customer email found for subscription' }, { status: 400 });
}

const user = users.data[0]
const subsId = body?.data?.object?.subscription as string

// First check if a subscription already exists for this user
const existingSubscription = await prisma.subscriptionSnb.findFirst({
  where: {
    userId: user.id,
  },
});

if (existingSubscription) {
  // Update existing subscription
  await prisma.subscriptionSnb.update({
    where: {
      id: existingSubscription.id,
    },
    data: {
      stripeSubscriptionId: subsId || stripeObject.id,
      status: 'active',
    }
  });
} else {
  // Create new subscription
  await prisma.subscriptionSnb.create({
    data: {
      userId: user.id,
      stripeSubscriptionId: subsId || '',
      status: 'active',
      planType: subsType,
      startsAt: new Date(),
      endsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    }
  });
}

emailEvents.emit('sendThanksYouEmail', customerEmail)

return NextResponse.json({}, { status: 200 });
}

export async function processSubscriptonDelete(event: Stripe.Event) {
        // TODO: Migrate to .NET Web API
        throw new Error('Function temporarily disabled - migrating to .NET Web API');
}

/* DISABLED - MIGRATE TO .NET WEB API
export async function processSubscriptonDelete_DISABLED(event: Stripe.Event) {

        /* DISABLED - MIGRATE TO .NET WEB API
        // The customer subscription stopped
        // ❌ Revoke access to the product
        const stripeObject: Stripe.Subscription = event.data
          .object as Stripe.Subscription;
        const subscription = await stripe.subscriptions.retrieve(
          stripeObject.id
        );
        const prismaSub = await prisma.subscriptionSnb.findFirst({
          where: { stripeSubscriptionId: subscription.id },
        });
        // Revoke access to your product
        await prisma.subscriptionSnb.update({
          where: { id: prismaSub.id },
          data: { status: 'inactive', },
        });
}

export async function processInvoicePaid(body: any, event: Stripe.Event) {
        // TODO: Migrate to .NET Web API
        throw new Error('Function temporarily disabled - migrating to .NET Web API');
}

/* DISABLED - MIGRATE TO .NET WEB API
export async function processInvoicePaid_DISABLED(body: any, event: Stripe.Event) {

        /* DISABLED - MIGRATE TO .NET WEB API
        // Customer just paid an invoice (for instance, a recurring payment for a subscription)
        // ✅ Grant access to the product
        const stripeObject: Stripe.Invoice = event.data
          .object as Stripe.Invoice;
        // Find subscription by the Stripe subscription ID
        const subsId = body?.data?.object?.subscription as string

        if(!subsId) {
          return new Response('Subscription is invalid', {
            status: 400
          })
        }

        const subscription = await prisma.subscriptionSnb.findFirst({
          where: { stripeSubscriptionId: subsId },
        });

        if(!subscription) {
          return new Response('Subscription not found', {
            status: 404
          })
        }

        // Make sure the invoice is for the same plan (priceId) the user subscribed to
        // Grant user access to your product. It's a boolean in the database, but could be a number of credits, etc...
        await prisma.subscriptionSnb.update({
          where: { id: subscription.id },
          data: { status: 'active', },
        });
}
*/
