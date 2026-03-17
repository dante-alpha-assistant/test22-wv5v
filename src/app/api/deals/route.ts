import { NextRequest, NextResponse } from 'next/server'
import { prisma as db } from '@/lib/db'

export async function GET() {
  try {
    const deals = await db.deal.findMany({
      include: { customer: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(deals)
  } catch (error) {
    console.error('Error fetching deals:', error)
    return NextResponse.json({ error: 'Failed to fetch deals' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, value, stage, customerId, expectedCloseDate } = body

    if (!title || value === undefined || !customerId) {
      return NextResponse.json(
        { error: 'Missing required fields: title, value, customerId' },
        { status: 400 }
      )
    }

    const deal = await db.deal.create({
      data: {
        title,
        value: parseFloat(value),
        stage: stage || 'prospecting',
        customerId,
        expectedCloseDate: expectedCloseDate ? new Date(expectedCloseDate) : null,
      },
      include: { customer: true },
    })

    return NextResponse.json(deal, { status: 201 })
  } catch (error) {
    console.error('Error creating deal:', error)
    return NextResponse.json({ error: 'Failed to create deal' }, { status: 500 })
  }
}
