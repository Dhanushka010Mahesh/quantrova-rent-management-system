import { Plus, Trash2 } from "lucide-react";
import type { SalaryLineItem, SalaryType } from "../../types/salary";

interface LineItemEditorProps {
  title: string;
  items: SalaryLineItem[];
  onChange: (items: SalaryLineItem[]) => void;
  disabled?: boolean;
  accent?: "success" | "danger";
}

export default function LineItemEditor({ title, items, onChange, disabled, accent = "success" }: LineItemEditorProps) {
  const addItem = () => onChange([...items, { id: crypto.randomUUID(), label: "", amount: 0 }]);
  const updateItem = (id: string, patch: Partial<SalaryLineItem>) =>
    onChange(items.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  const removeItem = (id: string) => onChange(items.filter((it) => it.id !== id));

  const total = items.reduce((sum, it) => sum + (Number(it.amount) || 0), 0);

  return (
    <div className="rounded-lg border border-border bg-background/60 p-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-medium text-secondary">{title}</p>
        {!disabled && (
          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-1 text-xs font-medium text-primary-dark hover:underline"
          >
            <Plus className="h-3.5 w-3.5" /> Add
          </button>
        )}
      </div>

      {items.length === 0 && <p className="text-xs text-text-muted">No {title.toLowerCase()} added.</p>}

      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Label (e.g. Transport)"
              value={item.label}
              disabled={disabled}
              onChange={(e) => updateItem(item.id, { label: e.target.value })}
              className="flex-1 rounded-md border border-border bg-surface px-2.5 py-1.5 text-sm text-text outline-none focus:ring-1 focus:ring-primary disabled:bg-background disabled:text-text-muted"
            />
            <input
              type="number"
              placeholder="0.00"
              value={item.amount || ""}
              disabled={disabled}
              onChange={(e) => updateItem(item.id, { amount: Number(e.target.value) })}
              className="w-28 rounded-md border border-border bg-surface px-2.5 py-1.5 text-right text-sm text-text outline-none focus:ring-1 focus:ring-primary disabled:bg-background disabled:text-text-muted"
            />
            {!disabled && (
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="rounded-md p-1.5 text-text-muted hover:bg-danger/10 hover:text-danger"
                aria-label="Remove"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>

      <div
        className={`mt-2 flex justify-between border-t border-border pt-2 text-sm font-medium ${
          accent === "success" ? "text-success" : "text-danger"
        }`}
      >
        <span>Total {title}</span>
        <span>{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
      </div>
    </div>
  );
}

export interface EmployeeSalaryInfo {
  id: string;
  name: string;
  designation: string;
  salaryType: SalaryType;
  basicSalary: number;
  dayRate: number;
  attendedDays: number; // this month
  attendedHours: number; // this month
}

// TODO: replace with real API call e.g. GET /api/employees?month=2026-08
export const mockEmployees: EmployeeSalaryInfo[] = [
  { id: "E01", name: "Sunil Perera", designation: "Store Manager", salaryType: "basic", basicSalary: 75000, dayRate: 0, attendedDays: 26, attendedHours: 208 },
  { id: "E02", name: "Kamal Fernando", designation: "Sales Executive", salaryType: "basic", basicSalary: 55000, dayRate: 0, attendedDays: 24, attendedHours: 192 },
  { id: "E03", name: "Nadeesha Silva", designation: "Warehouse Staff", salaryType: "day", basicSalary: 0, dayRate: 2200, attendedDays: 22, attendedHours: 176 },
  { id: "E04", name: "Ruwan Jayasuriya", designation: "Delivery Rider", salaryType: "day", basicSalary: 0, dayRate: 1800, attendedDays: 25, attendedHours: 200 },
];