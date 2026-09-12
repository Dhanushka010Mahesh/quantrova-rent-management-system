import Spinner from "../others/Spinner";

/** Full-page loading overlay — e.g. initial route load, auth check */
export function PageLoader({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background">
      <Spinner size="lg" className="text-primary-dark" />
      <p className="text-sm text-text-muted">{label}</p>
    </div>
  );
}

/** Inline loader for a section within a page (e.g. table area, chart area while re-fetching) */
export function SectionLoader({ label, className = "" }: { label?: string; className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-2 py-12 ${className}`}>
      <Spinner size="md" className="text-primary-dark" />
      {label && <p className="text-xs text-text-muted">{label}</p>}
    </div>
  );
}

/** Skeleton placeholder for a Card while its data is loading */
export function CardSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="animate-pulse rounded-xl border border-border bg-surface p-4 sm:p-5">
      <div className="mb-4 h-4 w-1/3 rounded bg-border" />
      <div className="flex flex-col gap-2.5">
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="h-3 rounded bg-border" style={{ width: `${90 - i * 12}%` }} />
        ))}
      </div>
    </div>
  );
}

/** Skeleton placeholder for a stat card */
export function StatCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-border bg-surface p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="h-3 w-20 rounded bg-border" />
          <div className="mt-2 h-6 w-16 rounded bg-border" />
        </div>
        <div className="h-10 w-10 rounded-lg bg-border" />
      </div>
    </div>
  );
}

/** Skeleton rows for a table while fetching */
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="animate-pulse">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex items-center gap-4 border-b border-border px-4 py-3.5 last:border-0">
          {Array.from({ length: columns }).map((_, c) => (
            <div key={c} className="h-3 flex-1 rounded bg-border" style={{ maxWidth: c === 0 ? "20%" : "100%" }} />
          ))}
        </div>
      ))}
    </div>
  );
}