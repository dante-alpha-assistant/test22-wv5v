import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create customers
  const alice = await prisma.customer.upsert({
    where: { email: 'alice@acmecorp.com' },
    update: {},
    create: {
      name: 'Alice Johnson',
      email: 'alice@acmecorp.com',
      phone: '+1 (555) 100-2000',
      company: 'Acme Corp',
      status: 'active',
    },
  })

  const bob = await prisma.customer.upsert({
    where: { email: 'bob@globex.com' },
    update: {},
    create: {
      name: 'Bob Smith',
      email: 'bob@globex.com',
      phone: '+1 (555) 300-4000',
      company: 'Globex Inc',
      status: 'active',
    },
  })

  const carol = await prisma.customer.upsert({
    where: { email: 'carol@initech.com' },
    update: {},
    create: {
      name: 'Carol Williams',
      email: 'carol@initech.com',
      phone: '+1 (555) 500-6000',
      company: 'Initech Solutions',
      status: 'inactive',
    },
  })

  console.log('✅ Customers created:', { alice, bob, carol })

  // Create deals
  const deal1 = await prisma.deal.create({
    data: {
      title: 'Enterprise License - Acme Corp',
      value: 50000,
      stage: 'proposal',
      customerId: alice.id,
      expectedCloseDate: new Date('2026-06-30'),
    },
  })

  const deal2 = await prisma.deal.create({
    data: {
      title: 'Consulting Package - Globex',
      value: 12500,
      stage: 'negotiation',
      customerId: bob.id,
      expectedCloseDate: new Date('2026-04-15'),
    },
  })

  const deal3 = await prisma.deal.create({
    data: {
      title: 'Starter Plan - Initech',
      value: 3000,
      stage: 'prospecting',
      customerId: carol.id,
      expectedCloseDate: new Date('2026-05-01'),
    },
  })

  const deal4 = await prisma.deal.create({
    data: {
      title: 'Premium Support - Acme Corp',
      value: 8000,
      stage: 'closed_won',
      customerId: alice.id,
      expectedCloseDate: new Date('2026-03-01'),
    },
  })

  console.log('✅ Deals created:', { deal1, deal2, deal3, deal4 })

  console.log('🎉 Seeding complete!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
