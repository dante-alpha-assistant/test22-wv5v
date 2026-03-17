'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CustomerForm } from '@/components/customers/customer-form'

export default function NewCustomerPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(data: {
    name: string
    email: string
    phone?: string
    company?: string
    status: string
  }) {
    setIsLoading(true)
    setError('')
    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        const customer = await res.json()
        router.push(`/customers/${customer.id}`)
      } else {
        const body = await res.json()
        setError(body.error || 'Failed to create customer')
      }
    } catch {
      setError('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" asChild>
          <Link href="/customers">← Back</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>New Customer</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 rounded-md bg-red-50 px-4 py-2 text-sm text-red-600">
              {error}
            </div>
          )}
          <CustomerForm onSubmit={handleSubmit} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  )
}
