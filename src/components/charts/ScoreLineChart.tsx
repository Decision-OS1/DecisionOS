"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface ScoreLineChartProps {
  data: { day: number; score: number }[];
}

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: { day: number; score: number } }[];
}) {
  if (!active || !payload?.length) return null;
  const { day, score } = payload[0].payload;
  return (
    <div className="rounded-xl border border-border bg-surface px-3 py-2 text-xs shadow-card">
      <p className="font-semibold text-text">Scenario {day}</p>
      <p className="text-text-muted">Score: {score}</p>
    </div>
  );
}

export function ScoreLineChart({ data }: ScoreLineChartProps) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#ECECF5" />
          <XAxis
            dataKey="day"
            tickFormatter={(d) => `#${d}`}
            tick={{ fontSize: 11, fill: "#8A8798" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: "#8A8798" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<ChartTooltip />} />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#6C5DD3"
            strokeWidth={2.5}
            dot={{ r: 3, fill: "#6C5DD3" }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
