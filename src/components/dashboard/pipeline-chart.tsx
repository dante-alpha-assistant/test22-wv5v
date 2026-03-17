"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface StageData {
  stage: string;
  count: number;
  value: number;
}

interface PipelineChartProps {
  data: StageData[];
}

const stageLabels: Record<string, string> = {
  prospecting: "Prospect",
  qualification: "Qualify",
  proposal: "Proposal",
  negotiation: "Negotiate",
  closed_won: "Won",
  closed_lost: "Lost",
};

export function PipelineChart({ data }: PipelineChartProps) {
  const chartData = data.map((d) => ({
    ...d,
    label: stageLabels[d.stage] ?? d.stage,
    value: Math.round(d.value),
  }));

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Pipeline by Stage</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis yAxisId="left" orientation="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip
            formatter={(value, name) => {
              const numVal = typeof value === "number" ? value : Number(value);
              if (name === "Value ($)") {
                return [
                  new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  }).format(numVal),
                  "Value",
                ];
              }
              return [numVal, "Count"];
            }}
          />
          <Legend />
          <Bar yAxisId="left" dataKey="count" name="Count" fill="#6366f1" />
          <Bar yAxisId="right" dataKey="value" name="Value ($)" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
