interface BreakdownBarListProps {
  data: { label: string; value: number }[];
  formatValue?: (v: number) => string;
}

export default function BreakdownBarList({ data, formatValue }: BreakdownBarListProps) {
  const max = Math.max(1, ...data.map((d) => d.value));

  if (data.length === 0) return <p className="text-xs text-text-muted">No data.</p>;

  return (
    <div className="flex flex-col gap-2">
      {data.map((d) => (
        <div key={d.label} className="flex items-center gap-2">
          <div className="w-32 shrink-0 truncate text-xs text-text-muted" title={d.label}>
            {d.label}
          </div>
          <div className="flex-1">
            <div className="h-3.5 w-full overflow-hidden rounded-full bg-background">
              <div className="h-full rounded-full bg-accent-teal" style={{ width: `${(d.value / max) * 100}%` }} />
            </div>
          </div>
          <div className="w-20 shrink-0 text-right text-xs font-medium text-secondary">
            {formatValue ? formatValue(d.value) : d.value.toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}