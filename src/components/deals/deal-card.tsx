'use client'

import { DealWithCustomer } from '@/lib/types'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Pencil, Trash2, Calendar, User } from 'lucide-react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

interface DealCardProps {
  deal: DealWithCustomer
  onEdit: (deal: DealWithCustomer) => void
  onDelete: (deal: DealWithCustomer) => void
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDate(date: Date | string | null) {
  if (!date) return null
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function DealCard({ deal, onEdit, onDelete }: DealCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: deal.id,
    data: { deal },
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="mb-2 bg-white shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
    >
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm text-gray-900 truncate">{deal.title}</p>
            <p className="text-lg font-semibold text-blue-600 mt-1">
              {formatCurrency(deal.value)}
            </p>
          </div>
          <div className="flex gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation()
                onEdit(deal)
              }}
            >
              <Pencil className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-red-500 hover:text-red-700"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation()
                onDelete(deal)
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="mt-2 space-y-1">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <User className="h-3 w-3" />
            <span className="truncate">{deal.customer.name}</span>
            {deal.customer.company && (
              <span className="text-gray-400">· {deal.customer.company}</span>
            )}
          </div>
          {deal.expectedCloseDate && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(deal.expectedCloseDate)}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
