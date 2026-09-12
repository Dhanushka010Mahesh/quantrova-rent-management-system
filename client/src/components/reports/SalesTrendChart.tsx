import { useMemo } from "react";
import type { SaleLineRecord } from "../../types/salesReport";

interface SalesTrendChartProps {
  rows: SaleLineRecord[];
}

export default function SalesTrendChart({ rows }: SalesTrendChartProps) {
  const byDate = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of rows) {
      map.set(r.date, (map.get(r.date) ?? 0) + r.amount);
    }
    return Array.from(map.entries()).sort((a, b) => (a[0] < b[0] ? -1 : 1));
  }, [rows]);

  if (byDate.length === 0) return <p className="text-xs text-text-muted">No data for the current filters.</p>;

  const max = Math.max(...byDate.map(([, v]) => v));
  const width = 700;
  const height = 160;
  const padding = 24;
  const stepX = byDate.length > 1 ? (width - padding * 2) / (byDate.length - 1) : 0;

  const points = byDate.map(([, v], i) => {
    const x = padding + i * stepX;
    const y = height - padding - (v / max) * (height - padding * 2);
    return `${x},${y}`;
  });

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[500px]" style={{ height }}>
        <polyline points={points.join(" ")} fill="none" stroke="var(--color-primary)" strokeWidth={2} />
        {byDate.map(([date, v], i) => {
          const x = padding + i * stepX;
          const y = height - padding - (v / max) * (height - padding * 2);
          return (
            <g key={date}>
              <circle cx={x} cy={y} r={3} fill="var(--color-primary-dark)" />
            </g>
          );
        })}
      </svg>
      <div className="mt-1 flex justify-between text-[10px] text-text-muted">
        <span>{byDate[0][0]}</span>
        <span>{byDate[byDate.length - 1][0]}</span>
      </div>
    </div>
  );
}