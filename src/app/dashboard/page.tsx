import { StatsCards } from "@/components/dashboard/stats-cards";
import { RecentCustomers } from "@/components/dashboard/recent-customers";
import { PipelineChart } from "@/components/dashboard/pipeline-chart";
import { ActivityFeed } from "@/components/dashboard/activity-feed";

interface StageData {
  stage: string;
  count: number;
  value: number;
}

interface RecentCustomer {
  id: string;
  name: string;
  email: string;
  company: string | null;
  status: string;
  createdAt: string;
}

interface DashboardStats {
  totalCustomers: number;
  openDeals: number;
  totalPipelineValue: number;
  dealsWonThisMonth: number;
  dealsByStage: StageData[];
  recentCustomers: RecentCustomer[];
}

const defaultStats: DashboardStats = {
  totalCustomers: 0,
  openDeals: 0,
  totalPipelineValue: 0,
  dealsWonThisMonth: 0,
  dealsByStage: [],
  recentCustomers: [],
};

export default async function DashboardPage() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/dashboard/stats`,
    { cache: "no-store" }
  ).catch(() => null);

  let stats: DashboardStats = defaultStats;
  if (res && res.ok) {
    try {
      stats = await res.json();
    } catch {
      stats = defaultStats;
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <StatsCards
        totalCustomers={stats.totalCustomers}
        openDeals={stats.openDeals}
        totalPipelineValue={stats.totalPipelineValue}
        dealsWonThisMonth={stats.dealsWonThisMonth}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border p-6">
          <PipelineChart data={stats.dealsByStage} />
        </div>
        <div className="bg-white rounded-lg border p-6">
          <ActivityFeed recentCustomers={stats.recentCustomers} />
        </div>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <RecentCustomers customers={stats.recentCustomers} />
      </div>
    </div>
  );
}
