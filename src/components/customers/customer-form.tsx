'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const customerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  company: z.string().optional(),
  status: z.enum(['active', 'inactive', 'lead', 'churned']),
})

type CustomerFormValues = z.infer<typeof customerSchema>

interface CustomerFormProps {
  customer?: {
    id?: string
    name?: string
    email?: string
    phone?: string | null
    company?: string | null
    status?: string
  }
  onSubmit: (data: CustomerFormValues) => void
  isLoading?: boolean
}

export function CustomerForm({ customer, onSubmit, isLoading }: CustomerFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: customer?.name || '',
      email: customer?.email || '',
      phone: customer?.phone || '',
      company: customer?.company || '',
      status: (customer?.status as CustomerFormValues['status']) || 'lead',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="name">Name *</Label>
        <Input id="name" {...register('name')} placeholder="John Doe" />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="email">Email *</Label>
        <Input id="email" type="email" {...register('email')} placeholder="john@example.com" />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" {...register('phone')} placeholder="+1 (555) 000-0000" />
      </div>

      <div className="space-y-1">
        <Label htmlFor="company">Company</Label>
        <Input id="company" {...register('company')} placeholder="Acme Corp" />
      </div>

      <div className="space-y-1">
        <Label htmlFor="status">Status *</Label>
        <select
          id="status"
          {...register('status')}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="lead">Lead</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="churned">Churned</option>
        </select>
        {errors.status && (
          <p className="text-sm text-red-500">{errors.status.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Saving...' : customer?.id ? 'Update Customer' : 'Create Customer'}
      </Button>
    </form>
  )
}
