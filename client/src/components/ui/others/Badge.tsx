type BadgeVariant = "success" | "warning" | "danger" | "info" | "neutral";

const variantStyles: Record<BadgeVariant, string> = {
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  danger: "bg-danger/15 text-danger",
  info: "bg-info/15 text-info",
  neutral: "bg-border text-text-muted",
};

export default function Badge({ variant = "neutral", children }: { variant?: BadgeVariant; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantStyles[variant]}`}>
      {children}
    </span>
  );
}