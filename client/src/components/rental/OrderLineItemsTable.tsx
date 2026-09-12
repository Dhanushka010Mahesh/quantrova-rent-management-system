import { Trash2 } from "lucide-react";
import Select from "../ui/select/Select";
// import { mockCatalogItems } from "../../data/mockRentalCatalog";
import { lineAmount, lineDayCount } from "../../types/rentalOrder";
import type { OrderLine } from "../../types/rentalOrder";
import { mockCatalogItems } from "../../types/rental";

interface OrderLineItemsTableProps {
  lines: OrderLine[];
  onChange?: (lines: OrderLine[]) => void;
  editable?: boolean;
  editableDays?: boolean; // allow overriding the auto-calculated day count (used during processing)
}

const typeLabel: Record<string, string> = {
  RETURNABLE_UNIT: "Returnable",
  RETURNABLE_STOCK: "Returnable Stock",
  CONSUMABLE: "Consumable",
  RENTAL_PLUS_CONSUMPTION: "Rental + Consumption",
  PACKAGE: "Package",
  SALE: "Sale",
};

const DAY_BASED = ["RETURNABLE_UNIT", "RETURNABLE_STOCK", "RENTAL_PLUS_CONSUMPTION"];

export default function OrderLineItemsTable({ lines, onChange, editable, editableDays }: OrderLineItemsTableProps) {
  const addLine = (itemId: string) => {
    if (!onChange) return;
    const item = mockCatalogItems.find((i) => i.id === itemId);
    if (!item) return;

    const today = new Date().toISOString().slice(0, 10);
    const newLine: OrderLine = {
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
      outDate: today,
      returnDate: null,
    };
    onChange([...lines, newLine]);
  };

  const updateLine = (id: string, patch: Partial<OrderLine>) =>
    onChange?.(lines.map((l) => (l.id === id ? { ...l, ...patch } : l)));

  const removeLine = (id: string) => onChange?.(lines.filter((l) => l.id !== id));

  const numberCell = (value: number, onValueChange: (v: number) => void, width = "w-20") =>
    editable ? (
      <input
        type="number"
        value={value}
        onChange={(e) => onValueChange(Number(e.target.value))}
        className={`${width} rounded-md border border-border bg-surface px-2 py-1 text-right text-sm outline-none focus:ring-1 focus:ring-primary`}
      />
    ) : (
      <span>{value}</span>
    );

  return (
    <div>
      {editable && (
        <div className="mb-3 flex justify-end">
          <div className="w-72">
            <Select
              value=""
              options={mockCatalogItems.map((i) => ({ label: `${i.name} (${typeLabel[i.type]})`, value: i.id }))}
              onChange={(e) => e.target.value && addLine(e.target.value)}
              placeholder="+ Add item (dated today)"
            />
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-text-muted">
              <th className="py-1.5 pr-2 font-medium">Item</th>
              <th className="px-2 py-1.5 font-medium">Out Date</th>
              <th className="px-2 py-1.5 font-medium">Days</th>
              <th className="px-2 py-1.5 font-medium">Qty</th>
              <th className="px-2 py-1.5 font-medium">Rate</th>
              <th className="px-2 py-1.5 font-medium">Discount</th>
              <th className="px-2 py-1.5 text-right font-medium">Amount</th>
              {editable && <th className="py-1.5 pl-2"></th>}
            </tr>
          </thead>
          <tbody>
            {lines.map((line) => {
              const isDayBased = DAY_BASED.includes(line.itemType);
              return (
                <tr key={line.id} className="border-b border-border/60">
                  <td className="py-2 pr-2">
                    <p className="font-medium text-secondary">{line.itemName}</p>
                    <p className="text-[11px] text-text-muted">{typeLabel[line.itemType]}</p>
                  </td>
                  <td className="px-2 py-2 text-text-muted">{line.outDate}</td>
                  <td className="px-2 py-2">
                    {!isDayBased ? (
                      <span className="text-text-muted">—</span>
                    ) : editableDays ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min={1}
                          value={line.manualDays ?? lineDayCount(line)}
                          onChange={(e) => updateLine(line.id, { manualDays: Number(e.target.value) })}
                          className="w-16 rounded-md border border-border bg-surface px-2 py-1 text-right text-sm outline-none focus:ring-1 focus:ring-primary"
                        />
                        <span className="text-[11px] text-text-muted">d</span>
                      </div>
                    ) : (
                      <span className="text-text-muted">{lineDayCount(line)}d</span>
                    )}
                  </td>
                  <td className="px-2 py-2">{numberCell(line.quantity, (v) => updateLine(line.id, { quantity: v }), "w-16")}</td>
                  <td className="px-2 py-2">{numberCell(line.rate, (v) => updateLine(line.id, { rate: v }))}</td>
                  <td className="px-2 py-2">{numberCell(line.discount, (v) => updateLine(line.id, { discount: v }))}</td>
                  <td className="px-2 py-2 text-right font-medium text-primary-dark">
                    {lineAmount(line).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  {editable && (
                    <td className="py-2 pl-2 text-right">
                      <button
                        type="button"
                        onClick={() => removeLine(line.id)}
                        className="rounded-md p-1 text-text-muted hover:bg-danger/10 hover:text-danger"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}