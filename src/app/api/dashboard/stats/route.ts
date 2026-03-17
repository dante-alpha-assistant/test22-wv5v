import { NextResponse } from "next/server";
import { prisma as db } from "@/lib/db";
import { DealStage } from "@/lib/types";

export async function GET() {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const [totalCustomers, allDeals, recentCustomers] = await Promise.all([
      db.customer.count(),
      db.deal.findMany(),
      db.customer.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          name: true,
          email: true,
          company: true,
          status: true,
          createdAt: true,
        },
      }),
    ]);

    const openDeals = allDeals.filter(
      (d) => d.stage !== DealStage.CLOSED_WON && d.stage !== DealStage.CLOSED_LOST
    ).length;

    const totalPipelineValue = allDeals
      .filter((d) => d.stage !== DealStage.CLOSED_LOST)
      .reduce((sum, d) => sum + d.value, 0);

    const dealsWonThisMonth = allDeals.filter(
      (d) =>
        d.stage === DealStage.CLOSED_WON &&
        d.updatedAt >= startOfMonth &&
        d.updatedAt <= endOfMonth
    ).length;

    const stageMap = new Map<string, { count: number; value: number }>();
    for (const deal of allDeals) {
      const existing = stageMap.get(deal.stage) ?? { count: 0, value: 0 };
      stageMap.set(deal.stage, {
        count: existing.count + 1,
        value: existing.value + deal.value,
      });
    }

    const dealsByStage = Array.from(stageMap.entries()).map(([stage, data]) => ({
      stage,
      count: data.count,
      value: data.value,
    }));

    return NextResponse.json({
      totalCustomers,
      openDeals,
      totalPipelineValue,
      dealsWonThisMonth,
      dealsByStage,
      recentCustomers,
    });
  } catch {
    return NextResponse.json({
      totalCustomers: 0,
      openDeals: 0,
      totalPipelineValue: 0,
      dealsWonThisMonth: 0,
      dealsByStage: [],
      recentCustomers: [],
    });
  }
}
