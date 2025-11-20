'use client'
// Fixes autoloading of the page when user input data changes.


import { useState, useEffect, useTransition } from 'react'
import { SubscriptionCard } from './subscription-card'
import { AddSubscriptionDialog } from './add-subscription-dialog'
import { PaymentDialog } from './payment-dialog'
import { Button } from './ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { Plus, Lock, Zap } from 'lucide-react'
import type { Subscription } from '@/lib/db'
import {
  getSubscriptions,
  getUserPaymentStatus,
  addSubscription as addSubscriptionAction,
  updateSubscription as updateSubscriptionAction,
  deleteSubscription as deleteSubscriptionAction,
} from '@/app/actions/subscriptions'

export function SubscriptionManager() {
  const [currency, setCurrency] = useState('USD')
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState({ hasPaid: false, subscriptionCount: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  const loadData = async () => {
    setIsLoading(true)
    const [subs, status] = await Promise.all([
      getSubscriptions(),
      getUserPaymentStatus(),
    ])
    setSubscriptions(subs)
    setPaymentStatus(status)
    setIsLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleAddSubscription = async (data: Omit<Subscription, "id" | "user_id" | "created_at" | "updated_at">) => {
    const result = await addSubscriptionAction(data)
    
    if (result?.error) {
      if (result.error === "PAYMENT_REQUIRED") {
        setIsAddDialogOpen(false)
        setIsPaymentDialogOpen(true)
      } else {
        console.error("Failed to add subscription:", result.error)
        // You could show a toast notification here
        alert(result.error)
      }
      return
    }
    
    // Success - reload data and close dialog
    await loadData()
    setIsAddDialogOpen(false)
  }

  const handleUpdateSubscription = async (id: number, data: any) => {
    // Find the subscription to update
    const subscriptionIndex = subscriptions.findIndex((sub: any) => parseInt(String(sub.id)) === id)
    if (subscriptionIndex === -1) return

    // Save the original subscription for rollback
    const originalSubscription = subscriptions[subscriptionIndex]

    // Optimistically update local state immediately
    setSubscriptions((prev) => {
      const updated = [...prev]
      const currentSub = updated[subscriptionIndex] as any
      
      // Merge updates into the subscription
      if (data.renewalDate !== undefined) {
        currentSub.renewalDate = data.renewalDate
      }
      if (data.seats !== undefined) {
        currentSub.seats = data.seats
      }
      if (data.seatCost !== undefined) {
        currentSub.seatCost = data.seatCost
      }
      if (data.reminders !== undefined) {
        currentSub.reminders = {
          ...currentSub.reminders,
          ...data.reminders,
        }
      }
      if (data.name !== undefined) {
        currentSub.name = data.name
      }
      
      return updated
    })

    // Update on server in the background
    startTransition(async () => {
      try {
        // Update on server - the returned value has the updated subscription
        const updatedSub = await updateSubscriptionAction(id, data)
        
        // Update only the specific subscription in state instead of refetching all
        setSubscriptions((prev) => {
          const updated = [...prev]
          const subIndex = updated.findIndex((sub: any) => parseInt(String(sub.id)) === id)
          if (subIndex !== -1 && updatedSub) {
            updated[subIndex] = updatedSub as any
          }
          return updated
        })
      } catch (error) {
        // Rollback on error
        setSubscriptions((prev) => {
          const rolledBack = [...prev]
          rolledBack[subscriptionIndex] = originalSubscription
          return rolledBack
        })
        console.error('Failed to update subscription:', error)
        // You could show a toast notification here
      }
    })
  }

  const handleDeleteSubscription = async (id: number) => {
    await deleteSubscriptionAction(id)
    await loadData()
  }

  const handlePaymentSuccess = () => {
    setIsPaymentDialogOpen(false)
    loadData()
  }

  const totalMonthlyCost = subscriptions.reduce(
    (sum, sub: any) => {
      const seatCost = typeof sub.seatCost === 'number' ? sub.seatCost : parseFloat(sub.seatCost || sub.cost_per_seat || '0');
      const seats = sub.seats || 0;
      return sum + seats * seatCost;
    },
    0
  )

  const getCurrencySymbol = () => {
    const symbols: { [key: string]: string } = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      JPY: '¥',
      CAD: 'C$',
      AUD: 'A$',
    }
    return symbols[currency] || '$'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-foreground">
            Your Subscriptions
          </h2>
          {!paymentStatus.hasPaid && paymentStatus.subscriptionCount >= 3 && (
            <p className="text-sm text-muted-foreground mt-1">
              Free limit reached. Unlock unlimited tracking.
            </p>
          )}
          {subscriptions.length > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              Total monthly cost:{' '}
              <span className="text-primary font-semibold">
                {getCurrencySymbol()}
                {totalMonthlyCost.toFixed(2)}
              </span>
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger className="w-[100px] md:w-[120px] bg-card border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD ($)</SelectItem>
              <SelectItem value="EUR">EUR (€)</SelectItem>
              <SelectItem value="GBP">GBP (£)</SelectItem>
              <SelectItem value="JPY">JPY (¥)</SelectItem>
              <SelectItem value="CAD">CAD (C$)</SelectItem>
              <SelectItem value="AUD">AUD (A$)</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm md:text-base"
          >
            <Plus className="mr-1 md:mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Add Subscription</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {subscriptions.length === 0 ? (
          <div className="text-center py-12 border border-border rounded-lg bg-card">
            <h3 className="text-xl font-semibold mb-2">No subscriptions yet</h3>
            <p className="text-muted-foreground mb-4">
              Start tracking the services bleeding your wallet dry.
              <br />
              Because ignorance isn't bliss, it's expensive.
            </p>
            <Button 
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Subscription
            </Button>
          </div>
        ) : (
          subscriptions.map((subscription: any) => (
            <SubscriptionCard
              key={subscription.id}
              subscription={subscription}
              onUpdate={(id, updates) => handleUpdateSubscription(parseInt(String(id)) || 0, updates)}
              onDelete={(id) => handleDeleteSubscription(parseInt(String(id)) || 0)}
              currencySymbol={getCurrencySymbol()}
            />
          ))
        )}
      </div>

      {/* Payment Banner - Shows when user has 3+ subscriptions and hasn't paid */}
      {!paymentStatus.hasPaid && paymentStatus.subscriptionCount >= 3 && (
        <div className="rounded-lg border-2 border-primary/50 bg-gradient-to-r from-primary/10 via-primary/5 to-card p-4 md:p-6 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start gap-3 md:items-center">
              <div className="rounded-full bg-primary/20 p-2 flex-shrink-0">
                <Lock className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg md:text-xl font-semibold text-foreground mb-1">
                  Free Limit Reached
                </h3>
                <p className="text-sm text-muted-foreground">
                  You've reached the free limit of 3 subscriptions. Unlock unlimited tracking with a one-time payment.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl md:text-3xl font-bold text-primary">$9.97</span>
                <span className="text-sm text-muted-foreground">one-time</span>
              </div>
              <Button
                onClick={() => setIsPaymentDialogOpen(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold whitespace-nowrap"
                size="lg"
              >
                <Zap className="mr-2 h-4 w-4" />
                Unlock Now
              </Button>
            </div>
          </div>
        </div>
      )}

      <AddSubscriptionDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAdd={handleAddSubscription}
      />

      <PaymentDialog
        open={isPaymentDialogOpen}
        onOpenChange={setIsPaymentDialogOpen}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  )
}
