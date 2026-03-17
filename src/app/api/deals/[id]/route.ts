import { NextRequest, NextResponse } from 'next/server'
import { prisma as db } from '@/lib/db'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const deal = await db.deal.findUnique({
      where: { id },
      include: { customer: true },
    })

    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 })
    }

    return NextResponse.json(deal)
  } catch (error) {
    console.error('Error fetching deal:', error)
    return NextResponse.json({ error: 'Failed to fetch deal' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, value, stage, expectedCloseDate } = body

    const updateData: Record<string, unknown> = {}
    if (title !== undefined) updateData.title = title
    if (value !== undefined) updateData.value = parseFloat(value)
    if (stage !== undefined) updateData.stage = stage
    if (expectedCloseDate !== undefined) {
      updateData.expectedCloseDate = expectedCloseDate ? new Date(expectedCloseDate) : null
    }

    const deal = await db.deal.update({
      where: { id },
      data: updateData,
      include: { customer: true },
    })

    return NextResponse.json(deal)
  } catch (error) {
    console.error('Error updating deal:', error)
    return NextResponse.json({ error: 'Failed to update deal' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.deal.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting deal:', error)
    return NextResponse.json({ error: 'Failed to delete deal' }, { status: 500 })
  }
}
