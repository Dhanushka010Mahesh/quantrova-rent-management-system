import { useMemo, useState } from "react";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Inbox } from "lucide-react";
import { TableSkeleton } from "../loading/Loaders";

export interface Column<T> {
  key: keyof T;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  pageSize?: number;
  rowKey: keyof T;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
}

export default function DataTable<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  pageSize = 10,
  rowKey,
  emptyMessage = "No records found",
  onRowClick,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  const sorted = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av === bv) return 0;
      const result = av > bv ? 1 : -1;
      return sortDir === "asc" ? result : -result;
    });
  }, [data, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paged = sorted.slice((page - 1) * pageSize, page * pageSize);

  const toggleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-background">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  style={{ width: col.width }}
                  className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-text-muted"
                >
                  {col.sortable ? (
                    <button
                      onClick={() => toggleSort(col.key)}
                      className="flex items-center gap-1 hover:text-secondary"
                    >
                      {col.header}
                      {sortKey === col.key ? (
                        sortDir === "asc" ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronUp className="h-3.5 w-3.5 opacity-20" />
                      )}
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              ))}
            </tr>
          </thead>

          {!loading && (
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-14 text-center">
                    <div className="flex flex-col items-center gap-2 text-text-muted">
                      <Inbox className="h-8 w-8 opacity-40" />
                      <span className="text-sm">{emptyMessage}</span>
                    </div>
                  </td>
                </tr>
              ) : (
                paged.map((row) => (
                  <tr
                    key={String(row[rowKey])}
                    onClick={() => onRowClick?.(row)}
                    className={`border-b border-border last:border-0 ${
                      onRowClick ? "cursor-pointer hover:bg-background" : ""
                    }`}
                  >
                    {columns.map((col) => (
                      <td key={String(col.key)} className="whitespace-nowrap px-4 py-3.5 text-text">
                        {col.render ? col.render(row) : String(row[col.key] ?? "—")}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          )}
        </table>

        {loading && <TableSkeleton rows={pageSize} columns={columns.length} />}
      </div>

      {/* Pagination */}
      {!loading && sorted.length > 0 && (
        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <p className="text-xs text-text-muted">
            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, sorted.length)} of {sorted.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-muted hover:bg-background disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-2 text-xs text-text">{page} / {totalPages}</span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-muted hover:bg-background disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}