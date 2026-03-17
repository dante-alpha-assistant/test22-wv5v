import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardsProps {
  totalCustomers: number;
  openDeals: number;
  totalPipelineValue: number;
  dealsWonThisMonth: number;
}

export function StatsCards({
  totalCustomers,
  openDeals,
  totalPipelineValue,
  dealsWonThisMonth,
}: StatsCardsProps) {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(totalPipelineValue);

  const cards = [
    { title: "Total Customers", value: totalCustomers.toString() },
    { title: "Open Deals", value: openDeals.toString() },
    { title: "Pipeline Value", value: formatted },
    { title: "Deals Won This Month", value: dealsWonThisMonth.toString() },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              {card.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{card.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
