'use client'

import { useState } from 'react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Checkbox } from './ui/checkbox'
import { Badge } from './ui/badge'
import { Calendar, Trash2, Pencil, Check, X } from 'lucide-react'
import type { Subscription } from './subscription-manager'

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
  
  const totalCost = subscription.seats * subscription.seatCost

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
                  value={subscription.seats}
                  onChange={(e) =>
                    onUpdate(subscription.id, {
                      seats: parseInt(e.target.value) || 1,
                    })
                  }
                  className="w-14 md:w-16 h-7 md:h-8 bg-input border-border text-foreground text-xs px-2"
                />
              </div>
              <div className="flex items-center gap-1 md:gap-2">
                <span className="text-xs text-muted-foreground whitespace-nowrap">Cost:</span>
                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                    {currencySymbol}
                  </span>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={subscription.seatCost}
                    onChange={(e) =>
                      onUpdate(subscription.id, {
                        seatCost: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-16 md:w-20 h-7 md:h-8 bg-input border-border text-foreground text-xs pl-4 md:pl-5 pr-2"
                  />
                </div>
              </div>
              
              {/* Total cost - inline on mobile */}
              <div className="h-7 md:h-8 flex items-center px-2 md:px-3 rounded-md bg-primary/10 border border-primary/30">
                <span className="text-primary font-semibold text-xs md:text-sm whitespace-nowrap">
                  {currencySymbol}{totalCost.toFixed(2)}
                </span>
                <span className="text-xs text-muted-foreground ml-1">/mo</span>
              </div>
            </div>

            {/* Reminders and delete button */}
            <div className="flex items-center justify-between md:gap-3">
              {/* Reminders checkboxes */}
              <div className="flex items-center gap-2">
                <Checkbox
                  id={`reminder-5d-${subscription.id}`}
                  checked={subscription.reminders.fiveDays}
                  onCheckedChange={(checked) =>
                    onUpdate(subscription.id, {
                      reminders: {
                        ...subscription.reminders,
                        fiveDays: checked as boolean,
                      },
                    })
                  }
                  className="h-4 w-4"
                />
                <span className="text-xs text-muted-foreground">5d</span>
                
                <Checkbox
                  id={`reminder-2d-${subscription.id}`}
                  checked={subscription.reminders.twoDays}
                  onCheckedChange={(checked) =>
                    onUpdate(subscription.id, {
                      reminders: {
                        ...subscription.reminders,
                        twoDays: checked as boolean,
                      },
                    })
                  }
                  className="h-4 w-4"
                />
                <span className="text-xs text-muted-foreground">2d</span>
                
                <Checkbox
                  id={`reminder-1d-${subscription.id}`}
                  checked={subscription.reminders.oneDay}
                  onCheckedChange={(checked) =>
                    onUpdate(subscription.id, {
                      reminders: {
                        ...subscription.reminders,
                        oneDay: checked as boolean,
                      },
                    })
                  }
                  className="h-4 w-4"
                />
                <span className="text-xs text-muted-foreground">1d</span>
                
                <Checkbox
                  id={`reminder-1h-${subscription.id}`}
                  checked={subscription.reminders.oneHour}
                  onCheckedChange={(checked) =>
                    onUpdate(subscription.id, {
                      reminders: {
                        ...subscription.reminders,
                        oneHour: checked as boolean,
                      },
                    })
                  }
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
