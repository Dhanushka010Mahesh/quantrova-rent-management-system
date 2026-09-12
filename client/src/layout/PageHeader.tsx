import { Link } from "react-router-dom";
import { ChevronRight, Home, Maximize2, Minimize2 } from "lucide-react";
import type { ReactNode } from "react";
import { useFullscreen } from "../hooks/useFullscreen";

export interface Breadcrumb {
  label: string;
  path?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[];
  actions?: ReactNode;
  icon?: ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  actions,
  icon,
}: PageHeaderProps) {
  const { isFullscreen, toggle } = useFullscreen();

  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
      {/* Top brand accent */}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary via-primary-light to-transparent" />

      <div className="flex flex-col gap-4 px-4 py-3.5 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
        {/* Left section */}
        <div className="flex min-w-0 items-center gap-3">
          {/* Page icon */}
          {icon && (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary-dark">
              {icon}
            </div>
          )}

          <div className="min-w-0">
            {/* Breadcrumbs */}
            {breadcrumbs && breadcrumbs.length > 0 && (
              <nav
                aria-label="Breadcrumb"
                className="mb-1.5 flex flex-wrap items-center gap-1.5 text-[11px] font-medium"
              >
                <Link
                  to="/admin/dashboard"
                  className="flex items-center gap-1 text-text-muted transition-colors hover:text-primary-dark"
                >
                  <Home className="h-3 w-3" />
                  <span>Dashboard</span>
                </Link>

                {breadcrumbs.map((crumb, index) => {
                  const isLast = index === breadcrumbs.length - 1;

                  return (
                    <span
                      key={`${crumb.label}-${index}`}
                      className="flex items-center gap-1.5"
                    >
                      <ChevronRight className="h-3 w-3 text-border-dark" />

                      {crumb.path && !isLast ? (
                        <Link
                          to={crumb.path}
                          className="text-text-muted transition-colors hover:text-primary-dark"
                        >
                          {crumb.label}
                        </Link>
                      ) : (
                        <span
                          className={
                            isLast
                              ? "font-semibold text-secondary"
                              : "text-text-muted"
                          }
                        >
                          {crumb.label}
                        </span>
                      )}
                    </span>
                  );
                })}
              </nav>
            )}

            {/* Title */}
            <h1 className="truncate text-lg font-bold leading-tight tracking-tight text-secondary sm:text-xl">
              {title}
            </h1>

            {/* Subtitle */}
            {subtitle && (
              <p className="mt-0.5 max-w-2xl truncate text-xs leading-relaxed text-text-muted">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        {/* {actions && (
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {actions}
          </div>
        )} */}
        {/* Actions */}
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {actions}
          <button
            type="button"
            onClick={toggle}
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-text-muted transition-colors hover:bg-border/40 hover:text-secondary"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}