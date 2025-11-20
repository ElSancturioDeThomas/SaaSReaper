"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyCheckoutSession } from "@/app/actions/payment";
import { Button } from "@/components/ui/button";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      setStatus("error");
      setError("No session ID provided");
      return;
    }

    const verifyPayment = async () => {
      try {
        const result = await verifyCheckoutSession(sessionId);
        
        if (result.success) {
          setStatus("success");
          // Redirect to home after 2 seconds
          setTimeout(() => {
            router.push("/");
          }, 2000);
        } else {
          setStatus("error");
          setError("Payment verification failed");
        }
      } catch (err: any) {
        setStatus("error");
        setError(err.message || "Failed to verify payment");
      }
    };

    verifyPayment();
  }, [searchParams, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-muted-foreground">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold">Payment Verification Failed</h1>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={() => router.push("/")} className="mt-4">
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4 max-w-md">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-2xl font-bold">Payment Successful!</h1>
        <p className="text-muted-foreground">
          Your payment has been processed. You now have unlimited access to track subscriptions.
        </p>
        <p className="text-sm text-muted-foreground">
          Redirecting to home page...
        </p>
      </div>
    </div>
  );
}

