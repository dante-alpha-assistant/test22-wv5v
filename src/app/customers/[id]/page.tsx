import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  lead: 'bg-blue-100 text-blue-800',
  churned: 'bg-red-100 text-red-800',
}

const stageLabels: Record<string, string> = {
  prospecting: 'Prospecting',
  qualification: 'Qualification',
  proposal: 'Proposal',
  negotiation: 'Negotiation',
  closed_won: 'Closed Won',
  closed_lost: 'Closed Lost',
}

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const customer = await prisma.customer.findUnique({
    where: { id },
    include: { deals: { orderBy: { createdAt: 'desc' } } },
  })

  if (!customer) {
    notFound()
  }

  const totalDealsValue = customer.deals.reduce((sum, deal) => sum + deal.value, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link href="/customers">← Customers</Link>
          </Button>
        </div>
        <Button asChild>
          <Link href={`/customers/${id}/edit`}>Edit Customer</Link>
        </Button>
      </div>

      {/* Customer Header Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold">{customer.name}</h1>
                <Badge className={`${statusColors[customer.status] ?? 'bg-gray-100 text-gray-800'} capitalize border-0`}>
                  {customer.status}
                </Badge>
              </div>
              {customer.company && (
                <p className="text-muted-foreground">{customer.company}</p>
              )}
            </div>
            <div className="text-right text-sm text-muted-foreground">
              <p>Customer since</p>
              <p className="font-medium">{new Date(customer.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">Info</TabsTrigger>
          <TabsTrigger value="deals">Deals ({customer.deals.length})</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        {/* Info Tab */}
        <TabsContent value="info" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium">{customer.email}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="font-medium">{customer.phone || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Company</p>
                  <p className="font-medium">{customer.company || '—'}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Deal Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Total Deals</p>
                  <p className="font-medium">{customer.deals.length}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Value</p>
                  <p className="font-medium">${totalDealsValue.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Deals Tab */}
        <TabsContent value="deals" className="mt-4">
          {customer.deals.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No deals yet.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {customer.deals.map((deal) => (
                <Card key={deal.id}>
                  <CardContent className="pt-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{deal.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {stageLabels[deal.stage] ?? deal.stage}
                        {deal.expectedCloseDate && (
                          <> · Close {new Date(deal.expectedCloseDate).toLocaleDateString()}</>
                        )}
                      </p>
                    </div>
                    <p className="font-bold text-lg">${deal.value.toLocaleString()}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="mt-4">
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Activity feed coming soon.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
