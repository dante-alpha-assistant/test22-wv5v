import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { EditCustomerClient } from './edit-client'

export default async function EditCustomerPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const customer = await prisma.customer.findUnique({ where: { id } })

  if (!customer) {
    notFound()
  }

  return <EditCustomerClient customer={customer} />
}
