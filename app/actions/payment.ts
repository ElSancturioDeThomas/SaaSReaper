"use server";

import { stripe, UNLOCK_PRICE, isStripeEnabled } from "@/lib/stripe";
import { sql } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function createPaymentIntent() {
  if (!isStripeEnabled) {
    throw new Error("Stripe is not configured. Please set STRIPE_SECRET_KEY in your .env.local file.");
  }

  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: UNLOCK_PRICE,
    currency: "usd",
    metadata: {
      user_id: user.id,
    },
  });

  return {
    clientSecret: paymentIntent.client_secret,
  };
}

export async function createCheckoutSession() {
  if (!isStripeEnabled) {
    throw new Error("Stripe is not configured. Please set STRIPE_SECRET_KEY in your .env.local file.");
  }

  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  // Get base URL from request headers or environment variable
  let baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  
  if (!baseUrl) {
    try {
      const headersList = await headers();
      const host = headersList.get('x-forwarded-host') || headersList.get('host') || 'localhost:3000';
      const protocol = headersList.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
      baseUrl = `${protocol}://${host}`;
    } catch (error) {
      // Fallback if headers are not available
      baseUrl = process.env.NODE_ENV === 'production'
        ? 'https://v0-saa-s-reaper-app-design.vercel.app'
        ? 'https://app.saasreaper.com' 
        : 'http://localhost:3000';
    }
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Unlock Unlimited Subscriptions',
            description: 'One-time payment for lifetime access',
          },
          unit_amount: UNLOCK_PRICE,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}?canceled=true`,
    metadata: {
      user_id: user.id,
    },
  });

  return {
    url: session.url,
  };
}

export async function confirmPayment(paymentIntentId: string) {
  if (!isStripeEnabled) {
    throw new Error("Stripe is not configured. Please set STRIPE_SECRET_KEY in your .env.local file.");
  }

  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (paymentIntent.status === "succeeded") {
    // Record payment in database using subquery to ensure user exists
    // Use users_sync (public schema) where auth stores users
    // This ensures the foreign key constraint is satisfied
    await sql`
      INSERT INTO user_payments (user_id, has_paid, stripe_payment_intent_id, paid_at)
      SELECT id, true, ${paymentIntentId}, NOW()
      FROM users_sync
      WHERE id::text = ${user.id}
      ON CONFLICT (user_id) 
      DO UPDATE SET 
        has_paid = true,
        stripe_payment_intent_id = ${paymentIntentId},
        paid_at = NOW()
    `;

    revalidatePath("/");
    return { success: true };
  }

  return { success: false };
}

export async function verifyCheckoutSession(sessionId: string) {
  if (!isStripeEnabled) {
    throw new Error("Stripe is not configured. Please set STRIPE_SECRET_KEY in your .env.local file.");
  }

  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status === "paid" && session.metadata?.user_id === user.id) {
    // Record payment in database
    await sql`
      INSERT INTO user_payments (user_id, has_paid, stripe_payment_intent_id, paid_at)
      SELECT id, true, ${session.payment_intent}, NOW()
      FROM users_sync
      WHERE id::text = ${user.id}
      ON CONFLICT (user_id) 
      DO UPDATE SET 
        has_paid = true,
        stripe_payment_intent_id = ${session.payment_intent},
        paid_at = NOW()
    `;

    revalidatePath("/");
    return { success: true };
  }

  return { success: false };
}
