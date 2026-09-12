import { useState } from "react";
import { ChevronRight } from "lucide-react";
import type { Column } from "./DataTable";
import { TableSkeleton } from "../loading/Loaders";

interface DetailsTableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: keyof T;
  loading?: boolean;
  renderDetails: (row: T) => React.ReactNode; // expanded content per row
}

export default function DetailsTable<T extends Record<string, any>>({
  columns,
  data,
  rowKey,
  loading = false,
  renderDetails,
}: DetailsTableProps<T>) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <TableSkeleton rows={5} columns={columns.length + 1} />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-background">
            <th className="w-10 px-3 py-3" />
            {columns.map((col) => (
              <th key={String(col.key)} className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-text-muted">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => {
            const id = String(row[rowKey]);
            const isOpen = expanded.has(id);
            return (
              <>
                <tr
                  key={id}
                  onClick={() => toggle(id)}
                  className="cursor-pointer border-b border-border last:border-0 hover:bg-background"
                >
                  <td className="px-3 py-3.5">
                    <ChevronRight className={`h-4 w-4 text-text-muted transition-transform ${isOpen ? "rotate-90" : ""}`} />
                  </td>
                  {columns.map((col) => (
                    <td key={String(col.key)} className="whitespace-nowrap px-4 py-3.5 text-text">
                      {col.render ? col.render(row) : String(row[col.key] ?? "—")}
                    </td>
                  ))}
                </tr>
                {isOpen && (
                  <tr key={`${id}-details`} className="border-b border-border bg-background/60 last:border-0">
                    <td colSpan={columns.length + 1} className="px-6 py-4">
                      {renderDetails(row)}
                    </td>
                  </tr>
                )}
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}