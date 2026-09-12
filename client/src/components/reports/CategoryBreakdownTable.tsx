interface CategoryBreakdownTableProps {
  title: string;
  data: { category: string; amount: number }[];
  total: number;
  accent: "success" | "danger";
}

export default function CategoryBreakdownTable({ title, data, total, accent }: CategoryBreakdownTableProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className="mb-3 text-sm font-semibold text-secondary">{title}</p>
      <div className="flex flex-col gap-2">
        {data.map((d) => {
          const pct = total > 0 ? (d.amount / total) * 100 : 0;
          return (
            <div key={d.category}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-text">{d.category}</span>
                <span className="font-medium text-secondary">
                  {d.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-background">
                <div
                  className={`h-full rounded-full ${accent === "success" ? "bg-success" : "bg-danger"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex justify-between border-t border-border pt-2 text-sm font-semibold">
        <span className="text-secondary">Total</span>
        <span className={accent === "success" ? "text-success" : "text-danger"}>
          {total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      </div>
    </div>
  );
}