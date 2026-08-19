import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: ReactNode;
  subtitle: string;
  visual?: ReactNode;
}

export function StatCard({ title, value, subtitle, visual }: StatCardProps) {
  return (
    <div className="card flex flex-1 items-center justify-between gap-3 p-5">
      <div>
        <p className="text-xs font-medium text-text-muted">{title}</p>
        <p className="mt-1 text-2xl font-bold text-text">{value}</p>
        <p className="mt-1 text-xs text-text-muted">{subtitle}</p>
      </div>
      {visual && <div className="flex-shrink-0">{visual}</div>}
    </div>
  );
}
