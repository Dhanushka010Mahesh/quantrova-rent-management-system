interface StatCardProps {
  label: string;
  value: string;
  change?: { value: string; trend: "up" | "down" };
  icon: React.ReactNode;
  accent?: "primary" | "teal" | "coral" | "success" | "info";
}

const accentMap: Record<NonNullable<StatCardProps["accent"]>, string> = {
  primary: "bg-primary/15 text-primary-dark",
  teal: "bg-accent-teal/15 text-accent-teal",
  coral: "bg-accent-coral/15 text-accent-coral",
  success: "bg-success/15 text-success",
  info: "bg-info/15 text-info",
};

export default function StatCard({ label, value, change, icon, accent = "primary" }: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-text-muted">{label}</p>
          <p className="mt-1.5 text-2xl font-semibold text-secondary">{value}</p>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${accentMap[accent]}`}>
          {icon}
        </div>
      </div>

      {change && (
        <p
          className={`mt-2.5 flex items-center gap-1 text-xs font-medium ${
            change.trend === "up" ? "text-success" : "text-danger"
          }`}
        >
          {change.trend === "up" ? "▲" : "▼"} {change.value}
          <span className="font-normal text-text-muted">vs last month</span>
        </p>
      )}
    </div>
  );
}