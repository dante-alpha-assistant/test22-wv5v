'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { DealWithCustomer, Customer } from '@/lib/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const STAGES = [
  { value: 'prospecting', label: 'Prospecting' },
  { value: 'qualification', label: 'Qualified' },
  { value: 'proposal', label: 'Proposal' },
  { value: 'negotiation', label: 'Negotiation' },
  { value: 'closed_won', label: 'Closed Won' },
  { value: 'closed_lost', label: 'Closed Lost' },
]

const dealSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  value: z.coerce.number().min(0, 'Value must be 0 or greater'),
  stage: z.string().min(1, 'Stage is required'),
  customerId: z.string().min(1, 'Customer is required'),
  expectedCloseDate: z.string().optional(),
})

type DealFormData = z.infer<typeof dealSchema>

interface DealFormProps {
  open: boolean
  deal?: DealWithCustomer | null
  defaultStage?: string
  onClose: () => void
  onSaved: () => void
}

export function DealForm({ open, deal, defaultStage, onClose, onSaved }: DealFormProps) {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DealFormData>({
    resolver: zodResolver(dealSchema),
    defaultValues: {
      title: '',
      value: 0,
      stage: defaultStage || 'prospecting',
      customerId: '',
      expectedCloseDate: '',
    },
  })

  useEffect(() => {
    if (open) {
      fetch('/api/customers')
        .then((r) => r.json())
        .then((data) => setCustomers(data))
        .catch(() => setCustomers([]))
    }
  }, [open])

  useEffect(() => {
    if (deal) {
      reset({
        title: deal.title,
        value: deal.value,
        stage: deal.stage,
        customerId: deal.customerId,
        expectedCloseDate: deal.expectedCloseDate
          ? new Date(deal.expectedCloseDate).toISOString().split('T')[0]
          : '',
      })
    } else {
      reset({
        title: '',
        value: 0,
        stage: defaultStage || 'prospecting',
        customerId: '',
        expectedCloseDate: '',
      })
    }
  }, [deal, defaultStage, reset, open])

  const onSubmit = async (data: DealFormData) => {
    setLoading(true)
    setError(null)
    try {
      const url = deal ? `/api/deals/${deal.id}` : '/api/deals'
      const method = deal ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          expectedCloseDate: data.expectedCloseDate || null,
        }),
      })
      if (!res.ok) {
        const errData = await res.json()
        setError(errData.error || 'Failed to save deal')
        return
      }
      onSaved()
      onClose()
    } catch {
      setError('Failed to save deal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{deal ? 'Edit Deal' : 'New Deal'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register('title')} placeholder="Deal title" />
            {errors.title && (
              <p className="text-xs text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="value">Value ($)</Label>
            <Input
              id="value"
              type="number"
              min="0"
              step="0.01"
              {...register('value')}
              placeholder="0"
            />
            {errors.value && (
              <p className="text-xs text-red-500">{errors.value.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="stage">Stage</Label>
            <select
              id="stage"
              {...register('stage')}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              {STAGES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            {errors.stage && (
              <p className="text-xs text-red-500">{errors.stage.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="customerId">Customer</Label>
            <select
              id="customerId"
              {...register('customerId')}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="">Select a customer...</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}{c.company ? ` (${c.company})` : ''}
                </option>
              ))}
            </select>
            {errors.customerId && (
              <p className="text-xs text-red-500">{errors.customerId.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="expectedCloseDate">Expected Close Date (optional)</Label>
            <Input
              id="expectedCloseDate"
              type="date"
              {...register('expectedCloseDate')}
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || loading}>
              {isSubmitting || loading ? 'Saving...' : deal ? 'Update Deal' : 'Create Deal'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
