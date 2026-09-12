import { Trash2 } from "lucide-react";
import Select from "../ui/select/Select";
// import { mockCatalogItems } from "../../data/mockRentalCatalog";
import { lineSubtotal, mockCatalogItems } from "../../types/rental";
import type { RentalOrderLine } from "../../types/rental";

interface RentalLineItemsEditorProps {
  lines: RentalOrderLine[];
  onChange: (lines: RentalOrderLine[]) => void;
  days: number;
}

const typeLabel: Record<string, string> = {
  RETURNABLE_UNIT: "Returnable",
  RETURNABLE_STOCK: "Returnable Stock",
  CONSUMABLE: "Consumable",
  RENTAL_PLUS_CONSUMPTION: "Rental + Consumption",
  PACKAGE: "Package",
  SALE: "Sale",
};

export default function RentalLineItemsEditor({ lines, onChange, days }: RentalLineItemsEditorProps) {
  const addLine = (itemId: string) => {
    const item = mockCatalogItems.find((i) => i.id === itemId);
    if (!item) return;

    const newLine: RentalOrderLine = {
      id: crypto.randomUUID(),
      itemId: item.id,
      itemName: item.name,
      itemType: item.type,
      unit: item.unit,
      quantity: 1,
      rate: item.rentalRatePerDay ?? item.consumableRate ?? item.salePrice ?? item.packagePrice ?? 0,
      consumableQty: item.type === "RENTAL_PLUS_CONSUMPTION" ? 0 : undefined,
      consumableRate: item.type === "RENTAL_PLUS_CONSUMPTION" ? item.consumableRate ?? 0 : undefined,
      discount: 0,
      packageComponents: item.packageComponents,
    };
    onChange([...lines, newLine]);
  };

  const updateLine = (id: string, patch: Partial<RentalOrderLine>) =>
    onChange(lines.map((l) => (l.id === id ? { ...l, ...patch } : l)));

  const removeLine = (id: string) => onChange(lines.filter((l) => l.id !== id));

  const cellInput = (value: number, onValueChange: (v: number) => void, width = "w-20") => (
    <input
      type="number"
      value={value}
      onChange={(e) => onValueChange(Number(e.target.value))}
      className={`${width} rounded-md border border-border bg-surface px-2 py-1 text-right text-sm outline-none focus:ring-1 focus:ring-primary`}
    />
  );

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-secondary">Items</p>
        <div className="w-72">
          <Select
            value=""
            options={mockCatalogItems.map((i) => ({ label: `${i.name} (${typeLabel[i.type]})`, value: i.id }))}
            onChange={(e) => e.target.value && addLine(e.target.value)}
            placeholder="+ Add item"
          />
        </div>
      </div>

      {lines.length === 0 ? (
        <p className="text-xs text-text-muted">No items added yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-text-muted">
                <th className="py-1.5 pr-2 font-medium">Item</th>
                <th className="px-2 py-1.5 font-medium">Qty</th>
                <th className="px-2 py-1.5 font-medium">Rate</th>
                <th className="px-2 py-1.5 font-medium">Cons. Qty</th>
                <th className="px-2 py-1.5 font-medium">Cons. Rate</th>
                <th className="px-2 py-1.5 font-medium">Discount</th>
                <th className="px-2 py-1.5 text-right font-medium">Subtotal</th>
                <th className="py-1.5 pl-2"></th>
              </tr>
            </thead>
            <tbody>
              {lines.map((line) => (
                <tr key={line.id} className="border-b border-border/60 align-top">
                  <td className="py-2 pr-2">
                    <p className="font-medium text-secondary">{line.itemName}</p>
                    <p className="text-[11px] text-text-muted">{typeLabel[line.itemType]}</p>
                    {line.itemType === "PACKAGE" && line.packageComponents && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {line.packageComponents.map((c) => (
                          <span key={c.name} className="rounded-full bg-background px-1.5 py-0.5 text-[10px] text-text-muted">
                            {c.name}: {c.qty}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-2 py-2">{cellInput(line.quantity, (v) => updateLine(line.id, { quantity: v }), "w-16")}</td>
                  <td className="px-2 py-2">{cellInput(line.rate, (v) => updateLine(line.id, { rate: v }))}</td>
                  <td className="px-2 py-2">
                    {line.itemType === "RENTAL_PLUS_CONSUMPTION"
                      ? cellInput(line.consumableQty ?? 0, (v) => updateLine(line.id, { consumableQty: v }), "w-16")
                      : <span className="text-text-muted">—</span>}
                  </td>
                  <td className="px-2 py-2">
                    {line.itemType === "RENTAL_PLUS_CONSUMPTION"
                      ? cellInput(line.consumableRate ?? 0, (v) => updateLine(line.id, { consumableRate: v }))
                      : <span className="text-text-muted">—</span>}
                  </td>
                  <td className="px-2 py-2">{cellInput(line.discount, (v) => updateLine(line.id, { discount: v }))}</td>
                  <td className="px-2 py-2 text-right font-medium text-primary-dark">
                    {lineSubtotal(line, days).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-2 pl-2 text-right">
                    <button
                      type="button"
                      onClick={() => removeLine(line.id)}
                      className="rounded-md p-1 text-text-muted hover:bg-danger/10 hover:text-danger"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}