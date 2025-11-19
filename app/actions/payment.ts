"use server";

import { stripe, UNLOCK_PRICE } from "@/lib/stripe";
import { sql } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createPaymentIntent() {
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

export async function confirmPayment(paymentIntentId: string) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (paymentIntent.status === "succeeded") {
    // Record payment in database
    await sql`
      INSERT INTO user_payments (user_id, has_paid, stripe_payment_intent_id, paid_at)
      VALUES (${user.id}, true, ${paymentIntentId}, NOW())
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
