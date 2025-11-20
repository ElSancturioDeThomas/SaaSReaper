"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createCheckoutSession } from "@/app/actions/payment";

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

// Check if Stripe key is set and not a placeholder
const isStripeConfigured = stripePublishableKey && 
  !stripePublishableKey.includes('your_publishable_key_here') && 
  stripePublishableKey.startsWith('pk_');

if (!isStripeConfigured) {
  console.warn(
    "Stripe is not configured. Using placeholder keys. Please set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in your .env.local file."
  );
}

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function PaymentDialog({ open, onOpenChange, onSuccess }: PaymentDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpen = (isOpen: boolean) => {
    if (!isOpen) {
      // Reset error state when dialog closes
      setError(null);
      setIsLoading(false);
    }
    onOpenChange(isOpen);
  };

  const handleCheckout = async () => {
    if (!isStripeConfigured) {
      setError("Stripe is not configured. Please contact support.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await createCheckoutSession();
      
      if (result.url) {
        // Redirect to Stripe Checkout
        window.location.href = result.url;
      } else {
        setError("Failed to create checkout session. Please try again.");
        setIsLoading(false);
      }
    } catch (err: any) {
      setError(err.message || "Failed to initialize payment. Please try again.");
      console.error("Payment initialization error:", err);
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Unlock Unlimited Subscriptions</DialogTitle>
          <DialogDescription>
            Pay once, track forever. No monthly bullshit.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="rounded-lg border border-primary/20 bg-card p-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">$9.97</div>
              <div className="text-sm text-muted-foreground">One-time payment</div>
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Track unlimited subscriptions</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Email reminders before renewals</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Lifetime access</span>
              </li>
            </ul>
          </div>

          {error ? (
            <div className="text-sm text-destructive p-4 rounded-md bg-destructive/10 border border-destructive/20">
              {error}
            </div>
          ) : !isStripeConfigured ? (
            <div className="text-sm text-muted-foreground p-4 rounded-md bg-muted border">
              Stripe is not configured. Please set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY and STRIPE_SECRET_KEY in your .env.local file to enable payments.
            </div>
          ) : (
            <Button
              onClick={handleCheckout}
              disabled={isLoading}
              className="w-full bg-[#635BFF] hover:bg-[#5851E6] text-white font-semibold py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connecting to Stripe...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 2.081.89 3.965 2.405 5.093 1.427 1.074 3.633 1.48 5.776 1.662l1.042.105c.996.108 1.938.199 2.756.363 1.816.291 3.773 1.006 3.773 2.479 0 .988-.84 1.581-2.354 1.581-2.123 0-4.39-.644-6.169-1.533l-.9 5.555C9.255 21.96 11.813 22 14.201 22c2.604 0 4.577-.624 5.94-1.751 1.488-1.198 2.102-3.069 2.102-5.052 0-2.174-.781-4.026-2.182-5.18-1.427-1.11-3.699-1.529-5.085-1.669z"/>
                  </svg>
                  Connect to Stripe
                </span>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
