'use client'

import { useState, useEffect } from 'react'
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
import { Plus } from 'lucide-react'
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
    try {
      await addSubscriptionAction(data)
      await loadData()
      setIsAddDialogOpen(false)
    } catch (error: any) {
      if (error.message === "PAYMENT_REQUIRED") {
        setIsAddDialogOpen(false)
        setIsPaymentDialogOpen(true)
      } else {
        throw error
      }
    }
  }

  const handleUpdateSubscription = async (id: number, data: Partial<Subscription>) => {
    await updateSubscriptionAction(id, data)
    await loadData()
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
    (sum, sub) => sum + sub.seats * parseFloat(sub.cost_per_seat.toString()),
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
          subscriptions.map((subscription) => (
            <SubscriptionCard
              key={subscription.id}
              subscription={subscription}
              onUpdate={(id, updates) => handleUpdateSubscription(id as number, updates)}
              onDelete={(id) => handleDeleteSubscription(id as number)}
              currencySymbol={getCurrencySymbol()}
            />
          ))
        )}
      </div>

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
