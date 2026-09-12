import { Plus, Trash2 } from "lucide-react";
import type { ProcessDeduction } from "../../types/rentalOrder";

interface ProcessDeductionsEditorProps {
  items: ProcessDeduction[];
  onChange: (items: ProcessDeduction[]) => void;
}

const quickLabels = ["Damage Cost", "Cleaning Cost", "Missing Item Charge", "Late Return Charge"];

export default function ProcessDeductionsEditor({ items, onChange }: ProcessDeductionsEditorProps) {
  const addItem = (label = "") => onChange([...items, { id: crypto.randomUUID(), label, amount: 0 }]);
  const updateItem = (id: string, patch: Partial<ProcessDeduction>) =>
    onChange(items.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  const removeItem = (id: string) => onChange(items.filter((it) => it.id !== id));

  const total = items.reduce((sum, it) => sum + (Number(it.amount) || 0), 0);

  return (
    <div className="rounded-lg border border-border bg-background/60 p-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-medium text-secondary">Additional Charges / Deductions</p>
        <button
          type="button"
          onClick={() => addItem()}
          className="flex items-center gap-1 text-xs font-medium text-primary-dark hover:underline"
        >
          <Plus className="h-3.5 w-3.5" /> Add
        </button>
      </div>

      <div className="mb-2 flex flex-wrap gap-1.5">
        {quickLabels.map((label) => (
          <button
            key={label}
            type="button"
            onClick={() => addItem(label)}
            className="rounded-full border border-border bg-surface px-2.5 py-1 text-[11px] text-text-muted hover:bg-background"
          >
            + {label}
          </button>
        ))}
      </div>

      {items.length === 0 && <p className="text-xs text-text-muted">No additional charges added.</p>}

      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Label (e.g. Damage Cost)"
              value={item.label}
              onChange={(e) => updateItem(item.id, { label: e.target.value })}
              className="flex-1 rounded-md border border-border bg-surface px-2.5 py-1.5 text-sm text-text outline-none focus:ring-1 focus:ring-primary"
            />
            <input
              type="number"
              placeholder="0.00"
              value={item.amount || ""}
              onChange={(e) => updateItem(item.id, { amount: Number(e.target.value) })}
              className="w-28 rounded-md border border-border bg-surface px-2.5 py-1.5 text-right text-sm text-text outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              type="button"
              onClick={() => removeItem(item.id)}
              className="rounded-md p-1.5 text-text-muted hover:bg-danger/10 hover:text-danger"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-2 flex justify-between border-t border-border pt-2 text-sm font-medium text-danger">
        <span>Total Additional Charges</span>
        <span>{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
      </div>
    </div>
  );
}