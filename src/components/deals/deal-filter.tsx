'use client'

import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

const STAGES = [
  { value: '', label: 'All Stages' },
  { value: 'prospecting', label: 'Prospecting' },
  { value: 'qualification', label: 'Qualified' },
  { value: 'proposal', label: 'Proposal' },
  { value: 'negotiation', label: 'Negotiation' },
  { value: 'closed_won', label: 'Closed Won' },
  { value: 'closed_lost', label: 'Closed Lost' },
]

interface DealFilterProps {
  search: string
  stage: string
  onSearchChange: (value: string) => void
  onStageChange: (value: string) => void
}

export function DealFilter({ search, stage, onSearchChange, onStageChange }: DealFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search deals or customers..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <select
        value={stage}
        onChange={(e) => onStageChange(e.target.value)}
        className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 min-w-[150px]"
      >
        {STAGES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
    </div>
  )
}
