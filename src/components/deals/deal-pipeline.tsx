'use client'

import { useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { useDroppable } from '@dnd-kit/core'
import { DealWithCustomer } from '@/lib/types'
import { DealCard } from './deal-card'
import { DealForm } from './deal-form'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

const STAGES = [
  { value: 'prospecting', label: 'Prospecting', color: 'bg-gray-100 border-gray-300' },
  { value: 'qualification', label: 'Qualified', color: 'bg-blue-50 border-blue-200' },
  { value: 'proposal', label: 'Proposal', color: 'bg-indigo-50 border-indigo-200' },
  { value: 'negotiation', label: 'Negotiation', color: 'bg-amber-50 border-amber-200' },
  { value: 'closed_won', label: 'Closed Won', color: 'bg-green-50 border-green-200' },
  { value: 'closed_lost', label: 'Closed Lost', color: 'bg-red-50 border-red-200' },
]

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

interface KanbanColumnProps {
  stage: (typeof STAGES)[0]
  deals: DealWithCustomer[]
  onEdit: (deal: DealWithCustomer) => void
  onDelete: (deal: DealWithCustomer) => void
  onAddDeal: (stage: string) => void
}

function KanbanColumn({ stage, deals, onEdit, onDelete, onAddDeal }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.value })
  const total = deals.reduce((sum, d) => sum + d.value, 0)

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col rounded-lg border-2 ${stage.color} ${
        isOver ? 'ring-2 ring-blue-400 ring-offset-1' : ''
      } min-h-[400px] w-[260px] shrink-0`}
    >
      {/* Column header */}
      <div className="p-3 border-b border-current/10">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-gray-700">{stage.label}</h3>
          <span className="text-xs bg-white rounded-full px-2 py-0.5 font-medium text-gray-600 shadow-sm">
            {deals.length}
          </span>
        </div>
        <p className="text-sm font-medium text-gray-500 mt-1">{formatCurrency(total)}</p>
      </div>

      {/* Cards */}
      <div className="flex-1 p-2 overflow-y-auto">
        {deals.map((deal) => (
          <DealCard key={deal.id} deal={deal} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>

      {/* Add deal button */}
      <div className="p-2 border-t border-current/10">
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-gray-500 hover:text-gray-700 hover:bg-white/60"
          onClick={() => onAddDeal(stage.value)}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add deal
        </Button>
      </div>
    </div>
  )
}

interface DealPipelineProps {
  deals: DealWithCustomer[]
  onRefresh: () => void
  search: string
  stageFilter: string
}

export function DealPipeline({ deals, onRefresh, search, stageFilter }: DealPipelineProps) {
  const [editDeal, setEditDeal] = useState<DealWithCustomer | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [defaultStage, setDefaultStage] = useState('prospecting')
  const [activeDeal, setActiveDeal] = useState<DealWithCustomer | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  )

  // Filter deals
  const filtered = deals.filter((deal) => {
    const matchesSearch =
      !search ||
      deal.title.toLowerCase().includes(search.toLowerCase()) ||
      deal.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      (deal.customer.company || '').toLowerCase().includes(search.toLowerCase())
    const matchesStage = !stageFilter || deal.stage === stageFilter
    return matchesSearch && matchesStage
  })

  const handleDragStart = (event: DragStartEvent) => {
    const deal = deals.find((d) => d.id === event.active.id)
    setActiveDeal(deal || null)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveDeal(null)

    if (!over) return
    const dealId = active.id as string
    const newStage = over.id as string
    const deal = deals.find((d) => d.id === dealId)

    if (!deal || deal.stage === newStage) return

    try {
      await fetch(`/api/deals/${dealId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage }),
      })
      onRefresh()
    } catch (err) {
      console.error('Failed to update deal stage:', err)
    }
  }

  const handleEdit = (deal: DealWithCustomer) => {
    setEditDeal(deal)
    setFormOpen(true)
  }

  const handleDelete = async (deal: DealWithCustomer) => {
    if (!confirm(`Delete deal "${deal.title}"?`)) return
    await fetch(`/api/deals/${deal.id}`, { method: 'DELETE' })
    onRefresh()
  }

  const handleAddDeal = (stage: string) => {
    setEditDeal(null)
    setDefaultStage(stage)
    setFormOpen(true)
  }

  const handleClose = () => {
    setFormOpen(false)
    setEditDeal(null)
  }

  return (
    <>
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {STAGES.map((stage) => (
            <KanbanColumn
              key={stage.value}
              stage={stage}
              deals={filtered.filter((d) => d.stage === stage.value)}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAddDeal={handleAddDeal}
            />
          ))}
        </div>

        <DragOverlay>
          {activeDeal && (
            <div className="opacity-80 rotate-2">
              <DealCard
                deal={activeDeal}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      <DealForm
        open={formOpen}
        deal={editDeal}
        defaultStage={defaultStage}
        onClose={handleClose}
        onSaved={() => {
          onRefresh()
          handleClose()
        }}
      />
    </>
  )
}
