interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

export default function ChartCard({ title, subtitle, children, className = "", action }: ChartCardProps) {
  return (
    <div className={`rounded-xl border border-border bg-surface p-4 shadow-sm sm:p-5 ${className}`}>
      <div className="mb-4">
        {action && <div className="ml-auto">{action}</div>}
        <h3 className="text-sm font-semibold text-secondary">{title}</h3>
        {subtitle && <p className="text-xs text-text-muted">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}