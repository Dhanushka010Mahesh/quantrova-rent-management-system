import type { ReactNode } from "react";

interface PageContainerProps {
  title?: string;
  subtitle?: string;
  breadcrumbs?: { label: string; path?: string }[];
  actions?: ReactNode;
  icon?: ReactNode;
  children: ReactNode;
}

/**
 * PageContainer — Global page wrapper for all admin pages.
 * The PageHeader (old styled header) has been removed since DashboardLayout
 * already provides a unified TopBar with the page title for all routes.
 *
 * If actions are passed (e.g. "Add Customer" button), they are rendered
 * in a compact actions bar directly above the page content.
 */
export default function PageContainer({
  actions,
  children,
}: PageContainerProps) {
  return (
    <div className="space-y-4">
      {/* Page Actions Bar — only rendered when action buttons are provided */}
      {actions && (
        <div className="flex flex-wrap items-center justify-end gap-2 rounded-xl border border-[#e2e6ea] dark:border-slate-800 bg-white dark:bg-[#1e293b] px-4 py-2.5 shadow-xs">
          {actions}
        </div>
      )}

      {/* Page Content */}
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}