'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Checkbox } from './ui/checkbox'
import { Badge } from './ui/badge'
import { Calendar, Trash2, Pencil, Check, X } from 'lucide-react'

type Subscription = {
  id: string
  user_id: string
  name: string
  renewalDate: string
  seats: number
  seatCost: number
  reminders: {
    fiveDays: boolean
    twoDays: boolean
    oneDay: boolean
    oneHour: boolean
  }
  created_at?: string
  updated_at?: string
}

type SubscriptionCardProps = {
  subscription: Subscription
  onUpdate: (id: string, updates: Partial<Subscription>) => void
  onDelete: (id: string) => void
  currencySymbol: string
}

export function SubscriptionCard({
  subscription,
  onUpdate,
  onDelete,
  currencySymbol,
}: SubscriptionCardProps) {
  const [isEditingDate, setIsEditingDate] = useState(false)
  const [editedDate, setEditedDate] = useState(subscription.renewalDate)
  const [localSeats, setLocalSeats] = useState(subscription.seats)
  const [localSeatCost, setLocalSeatCost] = useState(subscription.seatCost)
  const [seatCostInput, setSeatCostInput] = useState(subscription.seatCost.toString())
  
  // Update local state when subscription prop changes
  useEffect(() => {
    setLocalSeats(subscription.seats)
    setLocalSeatCost(subscription.seatCost)
    setSeatCostInput(subscription.seatCost.toString())
  }, [subscription.seats, subscription.seatCost])
  
  // Debounce timers
  const seatsTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const costTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  // Throttle function for reminder updates
  // UI updates immediately via optimistic updates, but database calls are throttled
  const reminderUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const latestReminderUpdateRef = useRef<Partial<Subscription> | null>(null)
  const isThrottlingRef = useRef(false)
  
  const throttledReminderUpdate = (updates: Partial<Subscription>) => {
    // Store the latest update
    latestReminderUpdateRef.current = updates
    
    // Update UI immediately (optimistic update - parent handles this)
    onUpdate(subscription.id, updates)
    
    // If we're already throttling, just update the latest state and return
    if (isThrottlingRef.current) {
      return
    }
    
    // Start throttling period
    isThrottlingRef.current = true
    
    // Clear any existing timeout
    if (reminderUpdateTimeoutRef.current) {
      clearTimeout(reminderUpdateTimeoutRef.current)
    }
    
    // After throttle delay, ensure latest state is synced with database
    reminderUpdateTimeoutRef.current = setTimeout(() => {
      if (latestReminderUpdateRef.current) {
        // Final sync to ensure database has the latest state
        // The parent's optimistic update already happened, but this ensures
        // the final state after rapid clicks matches the database
        onUpdate(subscription.id, latestReminderUpdateRef.current)
      }
      latestReminderUpdateRef.current = null
      isThrottlingRef.current = false
    }, 500)
  }
  
  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (seatsTimeoutRef.current) {
        clearTimeout(seatsTimeoutRef.current)
      }
      if (costTimeoutRef.current) {
        clearTimeout(costTimeoutRef.current)
      }
      if (reminderUpdateTimeoutRef.current) {
        clearTimeout(reminderUpdateTimeoutRef.current)
      }
    }
  }, [])
  
  const totalCost = localSeats * localSeatCost

  const daysUntilRenewal = Math.ceil(
    (new Date(subscription.renewalDate).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  )

  const getRenewalStatus = () => {
    if (daysUntilRenewal < 0) return { text: 'Expired', color: 'destructive' }
    if (daysUntilRenewal === 0) return { text: 'Today', color: 'destructive' }
    if (daysUntilRenewal <= 5)
      return { text: `${daysUntilRenewal}d left`, color: 'warning' }
    return { text: `${daysUntilRenewal}d left`, color: 'default' }
  }

  const status = getRenewalStatus()

  const handleSaveDate = () => {
    onUpdate(subscription.id, { renewalDate: editedDate })
    setIsEditingDate(false)
  }

  const handleCancelEdit = () => {
    setEditedDate(subscription.renewalDate)
    setIsEditingDate(false)
  }

  return (
    <Card className="bg-card border-border hover:border-primary/50 transition-colors">
      <CardContent className="p-3 md:p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4">
          
          {/* Left section - Name and date */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm md:text-base font-semibold text-foreground mb-1">
              {subscription.name}
            </h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
              <Calendar className="h-3 w-3 flex-shrink-0" />
              {isEditingDate ? (
                <div className="flex items-center gap-1">
                  <Input
                    type="date"
                    value={editedDate}
                    onChange={(e) => setEditedDate(e.target.value)}
                    className="h-6 w-28 md:w-32 bg-input border-border text-foreground text-xs px-2"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 text-primary hover:text-primary"
                    onClick={handleSaveDate}
                  >
                    <Check className="h-3 w-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 text-muted-foreground hover:text-foreground"
                    onClick={handleCancelEdit}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <>
                  <span className="truncate">{subscription.renewalDate}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-5 w-5 text-muted-foreground hover:text-primary flex-shrink-0"
                    onClick={() => setIsEditingDate(true)}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                </>
              )}
              <Badge
                variant={
                  status.color === 'destructive' ? 'destructive' : 'secondary'
                }
                className={`text-xs px-2 py-0 h-5 ${
                  status.color === 'warning'
                    ? 'bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30'
                    : ''
                }`}
              >
                {status.text}
              </Badge>
            </div>
          </div>

          <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
            
            {/* Middle section - Seats and cost inputs */}
            <div className="flex items-center gap-2 md:gap-3">
              <div className="flex items-center gap-1 md:gap-2">
                <span className="text-xs text-muted-foreground whitespace-nowrap">Seats:</span>
                <Input
                  type="number"
                  min="1"
                  value={localSeats}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 1
                    setLocalSeats(value)
                    
                    // Clear existing timeout
                    if (seatsTimeoutRef.current) {
                      clearTimeout(seatsTimeoutRef.current)
                    }
                    
                    // Debounce the update
                    seatsTimeoutRef.current = setTimeout(() => {
                      onUpdate(subscription.id, { seats: value })
                    }, 500)
                  }}
                  className="w-16 md:w-20 h-7 md:h-8 bg-input border-border text-foreground text-xs px-2 text-right font-mono tabular-nums min-w-[3rem]"
                  style={{ fontVariantNumeric: 'tabular-nums' }}
                />
              </div>
              <div className="flex items-center gap-1 md:gap-2">
                <span className="text-xs text-muted-foreground whitespace-nowrap">Cost:</span>
                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none z-10">
                    {currencySymbol}
                  </span>
                  <Input
                    type="text"
                    inputMode="decimal"
                    value={seatCostInput}
                    onChange={(e) => {
                      const inputValue = e.target.value
                      // Allow empty string or valid number input
                      if (inputValue === '' || /^\d*\.?\d*$/.test(inputValue)) {
                        setSeatCostInput(inputValue)
                        
                        // Update localSeatCost for calculations if valid number
                        const numValue = parseFloat(inputValue)
                        if (!isNaN(numValue) && inputValue !== '') {
                          setLocalSeatCost(numValue)
                        }
                        
                        // Clear existing timeout
                        if (costTimeoutRef.current) {
                          clearTimeout(costTimeoutRef.current)
                        }
                        
                        // Debounce the update
                        costTimeoutRef.current = setTimeout(() => {
                          const finalValue = parseFloat(inputValue) || 0
                          setLocalSeatCost(finalValue)
                          onUpdate(subscription.id, { seatCost: finalValue })
                        }, 500)
                      }
                    }}
                    onBlur={() => {
                      // On blur, ensure we have a valid number or reset to 0
                      if (seatCostInput === '' || isNaN(parseFloat(seatCostInput))) {
                        setSeatCostInput('0')
                        setLocalSeatCost(0)
                        onUpdate(subscription.id, { seatCost: 0 })
                      } else {
                        // Format the value to remove trailing zeros if needed
                        const numValue = parseFloat(seatCostInput)
                        setSeatCostInput(numValue.toString())
                        setLocalSeatCost(numValue)
                      }
                    }}
                    className="h-7 md:h-8 bg-input border-border text-foreground text-xs pl-5 md:pl-6 pr-2 text-right font-mono tabular-nums overflow-x-auto scrollbar-hide"
                    style={{ 
                      fontVariantNumeric: 'tabular-nums',
                      width: '5rem',
                      maxWidth: '5rem',
                      minWidth: '5rem'
                    }}
                  />
                </div>
              </div>
              
              {/* Total cost - inline on mobile */}
              <div className="h-7 md:h-8 flex items-center justify-end px-2 md:px-3 rounded-md bg-primary/10 border border-primary/30 overflow-hidden" style={{ width: '8.33rem', maxWidth: '8.33rem', minWidth: '8.33rem' }}>
                <div className="flex items-center gap-1 w-full justify-end overflow-x-auto scrollbar-hide">
                  <span className="text-primary font-semibold text-xs md:text-sm whitespace-nowrap font-mono tabular-nums" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {currencySymbol}{totalCost.toFixed(2)}
                  </span>
                  <span className="text-xs text-muted-foreground flex-shrink-0">/mo</span>
                </div>
              </div>
            </div>

            {/* Reminders and delete button */}
            <div className="flex items-center justify-between md:gap-3">
              {/* Reminders checkboxes */}
              <div className="flex items-center gap-2">
                <Checkbox
                  id={`reminder-5d-${subscription.id}`}
                  checked={subscription.reminders.fiveDays}
                  onCheckedChange={(checked) => {
                    // Update UI immediately (optimistic update handled by parent)
                    const updates = {
                      reminders: {
                        ...subscription.reminders,
                        fiveDays: checked as boolean,
                      },
                    }
                    // Throttle the database update
                    throttledReminderUpdate(updates)
                  }}
                  className="h-4 w-4"
                />
                <span className="text-xs text-muted-foreground">5d</span>
                
                <Checkbox
                  id={`reminder-2d-${subscription.id}`}
                  checked={subscription.reminders.twoDays}
                  onCheckedChange={(checked) => {
                    // Update UI immediately (optimistic update handled by parent)
                    const updates = {
                      reminders: {
                        ...subscription.reminders,
                        twoDays: checked as boolean,
                      },
                    }
                    // Throttle the database update
                    throttledReminderUpdate(updates)
                  }}
                  className="h-4 w-4"
                />
                <span className="text-xs text-muted-foreground">2d</span>
                
                <Checkbox
                  id={`reminder-1d-${subscription.id}`}
                  checked={subscription.reminders.oneDay}
                  onCheckedChange={(checked) => {
                    // Update UI immediately (optimistic update handled by parent)
                    const updates = {
                      reminders: {
                        ...subscription.reminders,
                        oneDay: checked as boolean,
                      },
                    }
                    // Throttle the database update
                    throttledReminderUpdate(updates)
                  }}
                  className="h-4 w-4"
                />
                <span className="text-xs text-muted-foreground">1d</span>
                
                <Checkbox
                  id={`reminder-1h-${subscription.id}`}
                  checked={subscription.reminders.oneHour}
                  onCheckedChange={(checked) => {
                    // Update UI immediately (optimistic update handled by parent)
                    const updates = {
                      reminders: {
                        ...subscription.reminders,
                        oneHour: checked as boolean,
                      },
                    }
                    // Throttle the database update
                    throttledReminderUpdate(updates)
                  }}
                  className="h-4 w-4"
                />
                <span className="text-xs text-muted-foreground">1h</span>
              </div>

              {/* Delete button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(subscription.id)}
                className="h-7 w-7 md:h-8 md:w-8 text-muted-foreground hover:text-destructive flex-shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
