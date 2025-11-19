import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

// Check if Stripe key is set and not a placeholder
const isStripeConfigured = stripeSecretKey && 
  !stripeSecretKey.includes('your_secret_key_here') && 
  stripeSecretKey.startsWith('sk_');

// Create a dummy Stripe instance if not configured (to prevent crashes)
// Using a valid format placeholder that will fail gracefully when used
export const stripe = isStripeConfigured 
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2025-11-17.clover",
    })
  : new Stripe('dummy_stripe_key_for_build_purposes_only', {
      apiVersion: "2025-11-17.clover",
    });

export const UNLOCK_PRICE = 997; // $9.97 one-time payment in cents
export const isStripeEnabled = isStripeConfigured;
