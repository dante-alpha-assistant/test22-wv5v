'use client'

import { useCallback, useEffect, useState } from 'react'
import { DealWithCustomer } from '@/lib/types'
import { DealPipeline } from '@/components/deals/deal-pipeline'
import { DealFilter } from '@/components/deals/deal-filter'
import { DealForm } from '@/components/deals/deal-form'
import { Button } from '@/components/ui/button'
import { Plus, RefreshCw } from 'lucide-react'

export default function DealsPage() {
  const [deals, setDeals] = useState<DealWithCustomer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [stageFilter, setStageFilter] = useState('')
  const [newDealOpen, setNewDealOpen] = useState(false)

  const fetchDeals = useCallback(async () => {
    try {
      const res = await fetch('/api/deals')
      const data = await res.json()
      setDeals(data)
    } catch (err) {
      console.error('Failed to fetch deals:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDeals()
  }, [fetchDeals])

  const totalValue = deals.reduce((sum, d) => sum + d.value, 0)
  const formattedTotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(totalValue)

  return (
    <div className="flex flex-col h-full">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Deals Pipeline</h1>
          <p className="text-sm text-gray-500 mt-1">
            {deals.length} deals · {formattedTotal} total pipeline value
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchDeals}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button onClick={() => setNewDealOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Deal
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4">
        <DealFilter
          search={search}
          stage={stageFilter}
          onSearchChange={setSearch}
          onStageChange={setStageFilter}
        />
      </div>

      {/* Pipeline board */}
      {loading ? (
        <div className="flex items-center justify-center flex-1 text-gray-500">
          <RefreshCw className="h-5 w-5 animate-spin mr-2" />
          Loading deals...
        </div>
      ) : (
        <DealPipeline
          deals={deals}
          onRefresh={fetchDeals}
          search={search}
          stageFilter={stageFilter}
        />
      )}

      {/* Global new deal form */}
      <DealForm
        open={newDealOpen}
        deal={null}
        onClose={() => setNewDealOpen(false)}
        onSaved={() => {
          fetchDeals()
          setNewDealOpen(false)
        }}
      />
    </div>
  )
}
