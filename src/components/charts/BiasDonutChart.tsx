"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

interface BiasDonutChartProps {
  data: { name: string; value: number; color: string }[];
}

export function BiasDonutChart({ data }: BiasDonutChartProps) {
  return (
    <div className="flex items-center gap-6">
      <div className="h-32 w-32 flex-shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={38}
              outerRadius={58}
              paddingAngle={2}
              strokeWidth={0}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="space-y-1.5 text-xs">
        {data.map((entry) => (
          <li key={entry.name} className="flex items-center gap-2">
            <span
              className="h-2 w-2 flex-shrink-0 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-text-muted">{entry.name}</span>
            <span className="font-semibold text-text">{entry.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
