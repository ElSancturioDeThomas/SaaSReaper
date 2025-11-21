'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Checkbox } from './ui/checkbox'
import type { Subscription } from '@/lib/db'

type AddSubscriptionDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (subscription: Omit<Subscription, "id" | "user_id" | "created_at" | "updated_at">) => void
}

export function AddSubscriptionDialog({
  open,
  onOpenChange,
  onAdd,
}: AddSubscriptionDialogProps) {
  const [name, setName] = useState('')
  const [renewalDate, setRenewalDate] = useState('')
  const [seats, setSeats] = useState(1)
  const [seatCost, setSeatCost] = useState('')
  const [reminders, setReminders] = useState({
    fiveDays: true,
    twoDays: true,
    oneDay: true,
    oneHour: false,
  })

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setName('')
      setRenewalDate('')
      setSeats(1)
      setSeatCost('')
      setReminders({
        fiveDays: true,
        twoDays: true,
        oneDay: true,
        oneHour: false,
      })
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !renewalDate) return

    try {
      await onAdd({
        name,
        renewal_date: renewalDate,
        seats,
        cost_per_seat: parseFloat(seatCost) || 0,
        remind_5d: reminders.fiveDays,
        remind_2d: reminders.twoDays,
        remind_1d: reminders.oneDay,
        remind_1h: reminders.oneHour,
      })
      onOpenChange(false)
    } catch (error) {
      // Error handling is done in the parent component
      throw error
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            Add New Subscription
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Track a new SaaS subscription and set up renewal reminders
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Subscription Name</Label>
            <Input
              id="name"
              placeholder="e.g., Figma, Notion, GitHub"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-input border-border text-foreground"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="renewalDate">Renewal Date</Label>
            <Input
              id="renewalDate"
              type="date"
              value={renewalDate}
              onChange={(e) => setRenewalDate(e.target.value)}
              className="bg-input border-border text-foreground"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="seats">Number of Seats</Label>
              <Input
                id="seats"
                type="number"
                min="1"
                value={seats}
                onChange={(e) => setSeats(parseInt(e.target.value) || 1)}
                className="bg-input border-border text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seatCost">Cost per Seat ($)</Label>
              <Input
                id="seatCost"
                type="number"
                min="0"
                step="0.01"
                value={seatCost}
                onChange={(e) => setSeatCost(e.target.value)}
                className="bg-input border-border text-foreground"
              />
            </div>
          </div>
          <div className="pt-2 space-y-3">
            <Label className="text-sm font-medium">Email Reminders</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="reminder-5d"
                  checked={reminders.fiveDays}
                  onCheckedChange={(checked) =>
                    setReminders({ ...reminders, fiveDays: checked as boolean })
                  }
                />
                <Label htmlFor="reminder-5d" className="text-sm font-normal">
                  5 days before
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="reminder-2d"
                  checked={reminders.twoDays}
                  onCheckedChange={(checked) =>
                    setReminders({ ...reminders, twoDays: checked as boolean })
                  }
                />
                <Label htmlFor="reminder-2d" className="text-sm font-normal">
                  2 days before
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="reminder-1d"
                  checked={reminders.oneDay}
                  onCheckedChange={(checked) =>
                    setReminders({ ...reminders, oneDay: checked as boolean })
                  }
                />
                <Label htmlFor="reminder-1d" className="text-sm font-normal">
                  1 day before
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="reminder-1h"
                  checked={reminders.oneHour}
                  onCheckedChange={(checked) =>
                    setReminders({ ...reminders, oneHour: checked as boolean })
                  }
                />
                <Label htmlFor="reminder-1h" className="text-sm font-normal">
                  1 hour before
                </Label>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Add Subscription
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
