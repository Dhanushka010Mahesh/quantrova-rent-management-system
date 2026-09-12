interface RevenueExpenseTrendChartProps {
  revenueByMonth: { month: string; amount: number }[];
  expenseByMonth: { month: string; amount: number }[];
}

export default function RevenueExpenseTrendChart({ revenueByMonth, expenseByMonth }: RevenueExpenseTrendChartProps) {
  const months = Array.from(new Set([...revenueByMonth.map((r) => r.month), ...expenseByMonth.map((e) => e.month)])).sort();

  if (months.length === 0) return <p className="text-xs text-text-muted">No data for the current filters.</p>;

  const revenueMap = new Map(revenueByMonth.map((r) => [r.month, r.amount]));
  const expenseMap = new Map(expenseByMonth.map((e) => [e.month, e.amount]));

  const max = Math.max(1, ...months.map((m) => Math.max(revenueMap.get(m) ?? 0, expenseMap.get(m) ?? 0)));
  const width = 700;
  const height = 200;
  const padding = 28;
  const stepX = months.length > 1 ? (width - padding * 2) / (months.length - 1) : 0;

  const buildPoints = (map: Map<string, number>) =>
    months
      .map((m, i) => {
        const v = map.get(m) ?? 0;
        const x = padding + i * stepX;
        const y = height - padding - (v / max) * (height - padding * 2);
        return `${x},${y}`;
      })
      .join(" ");

  return (
    <div>
      <div className="mb-2 flex items-center gap-4 text-xs">
        <span className="flex items-center gap-1.5 text-text-muted">
          <span className="h-2 w-2 rounded-full bg-success" /> Revenue
        </span>
        <span className="flex items-center gap-1.5 text-text-muted">
          <span className="h-2 w-2 rounded-full bg-danger" /> Expense
        </span>
      </div>
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[500px]" style={{ height }}>
          <polyline points={buildPoints(revenueMap)} fill="none" stroke="var(--color-success)" strokeWidth={2.5} />
          <polyline points={buildPoints(expenseMap)} fill="none" stroke="var(--color-danger)" strokeWidth={2.5} />
        </svg>
        <div className="mt-1 flex justify-between text-[10px] text-text-muted">
          {months.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
      </div>
    </div>
  );
}