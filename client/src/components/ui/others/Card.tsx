interface CardProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export default function Card({ title, subtitle, actions, className = "", children }: CardProps) {
  return (
    <div className={`rounded-xl border border-border bg-surface p-4 shadow-sm sm:p-5 ${className}`}>
      {(title || actions) && (
        <div className="mb-4 flex items-start justify-between">
          <div>
            {title && <h3 className="text-sm font-semibold text-secondary">{title}</h3>}
            {subtitle && <p className="text-xs text-text-muted">{subtitle}</p>}
          </div>
          {actions}
        </div>
      )}
      {children}
    </div>
  );
}