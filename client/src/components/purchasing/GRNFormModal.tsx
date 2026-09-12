import { useEffect, useMemo, useState } from "react";
import {
  X,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  XCircle,
  Package,
} from "lucide-react";

import DatePicker from "../ui/date/DatePicker";

export type GRNStatus =
  | "Draft"
  | "Pending Approval"
  | "Approved"
  | "Rejected";
  
export interface GRNItem {
  id: string;
  itemId?: string;
  itemName: string;
  itemCode: string;
  quantity?: number;
  qty?: number;
  purchasePrice: number;
  sellingPrice: number;
  total?: number;
}

export interface GRNData {
  id?: string;
  grnNumber: string;
  supplier: string;
  invoiceNumber: string;
  invoiceDate: string;
  receivedDate: string;
  advance: number;
  status: GRNStatus;
  items: GRNItem[];
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface GRNFormModalProps {
  open: boolean;
  mode: "create" | "edit" | "view";
  grn?: GRNData | null;
  onClose: () => void;
  onSaved?: (grn: GRNData) => void;
  onStatusChange?: (grn: GRNData, status: GRNStatus) => void;
}

const suppliers = [
  "ABC Construction Supplies",
  "Lanka Hardware Traders",
  "Prime Equipment Suppliers",
];

const availableItems = [
  {
    id: "1",
    name: "Cement 50kg",
    code: "CEM-001",
  },
  {
    id: "2",
    name: "Iron Rod 10mm",
    code: "IRN-010",
  },
  {
    id: "3",
    name: "Sand Cube",
    code: "SND-001",
  },
  {
    id: "4",
    name: "Concrete Blocks",
    code: "BLK-001",
  },
];

const emptyItem = (): GRNItem => ({
  id: crypto.randomUUID(),
  itemName: "",
  itemCode: "",
  qty: 1,
  purchasePrice: 0,
  sellingPrice: 0,
});

const emptyGRN = (): GRNData => ({
  grnNumber: "GRN-2026-0012",
  supplier: "",
  invoiceNumber: "",
  invoiceDate: new Date().toISOString().split("T")[0],
  receivedDate: new Date().toISOString().split("T")[0],
  advance: 0,
  status: "Draft",
  items: [emptyItem()],
});

export default function GRNFormModal({
  open,
  mode,
  grn,
  onClose,
  onSaved,
  onStatusChange,
}: GRNFormModalProps) {
  const readOnly = mode === "view";

  const [form, setForm] = useState<GRNData>(emptyGRN());

  useEffect(() => {
    if (!open) return;

    if (grn) {
      setForm({
        ...grn,
        items: grn.items.map((item) => ({ ...item })),
      });
    } else {
      setForm(emptyGRN());
    }
  }, [open, grn]);

  const total = useMemo(
    () =>
      form.items.reduce(
        (sum, item) => sum + (item.qty ?? 0) * item.purchasePrice,
        0
      ),
    [form.items]
  );

  const balance = Math.max(total - Number(form.advance || 0), 0);

  const updateField = <K extends keyof GRNData>(
    field: K,
    value: GRNData[K]
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateItem = (
    index: number,
    field: keyof GRNItem,
    value: string | number
  ) => {
    setForm((prev) => {
      const items = [...prev.items];

      items[index] = {
        ...items[index],
        [field]: value,
      };

      return {
        ...prev,
        items,
      };
    });
  };

  const selectItem = (index: number, itemId: string) => {
    const item = availableItems.find((x) => x.id === itemId);

    if (!item) return;

    updateItem(index, "itemName", item.name);
    updateItem(index, "itemCode", item.code);
  };

  const addItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, emptyItem()],
    }));
  };

  const removeItem = (index: number) => {
    if (form.items.length === 1) return;

    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = () => {
    if (!form.supplier) {
      alert("Please select supplier");
      return;
    }

    if (!form.invoiceNumber.trim()) {
      alert("Please enter invoice number");
      return;
    }

    if (!form.items.length) {
      alert("Please add at least one item");
      return;
    }

    const invalidItem = form.items.some(
      (item) =>
        !item.itemName ||
        (item.qty ?? 0) <= 0 ||
        item.purchasePrice <= 0
    );

    if (invalidItem) {
      alert("Please complete all item details");
      return;
    }

    onSaved?.({
      ...form,
      status: form.status === "Draft"
        ? "Pending Approval"
        : form.status,
    });

    onClose();
  };

  const changeStatus = (status: GRNStatus) => {
    const updated = {
      ...form,
      status,
    };

    setForm(updated);
    onStatusChange?.(updated, status);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-xl">

        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary-dark">
              <Package className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-base font-semibold text-secondary">
                {mode === "create"
                  ? "Create GRN"
                  : mode === "edit"
                  ? "Edit GRN"
                  : "GRN Details"}
              </h2>

              <p className="text-[11px] text-text-muted">
                {form.grnNumber}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-text-muted hover:bg-background hover:text-secondary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">

          {/* Basic Details */}
          <div className="mb-4 rounded-lg border border-border">
            <div className="border-b border-border px-4 py-2.5">
              <h3 className="text-sm font-semibold text-secondary">
                GRN Information
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-4">

              <div>
                <label className="mb-1 block text-xs font-medium text-text-muted">
                  GRN Number
                </label>

                <input
                  value={form.grnNumber}
                  disabled
                  className="h-9 w-full rounded-lg border border-border bg-background px-3 text-xs text-text-muted"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-text-muted">
                  Supplier
                </label>

                <select
                  disabled={readOnly}
                  value={form.supplier}
                  onChange={(e) =>
                    updateField("supplier", e.target.value)
                  }
                  className="h-9 w-full rounded-lg border border-border bg-surface px-3 text-xs text-secondary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-background"
                >
                  <option value="">Select Supplier</option>

                  {suppliers.map((supplier) => (
                    <option key={supplier} value={supplier}>
                      {supplier}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-text-muted">
                  Invoice Number
                </label>

                <input
                  disabled={readOnly}
                  value={form.invoiceNumber}
                  onChange={(e) =>
                    updateField("invoiceNumber", e.target.value)
                  }
                  placeholder="INV-10245"
                  className="h-9 w-full rounded-lg border border-border bg-surface px-3 text-xs text-secondary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-background"
                />
              </div>

              <DatePicker
                label="Invoice Date"
                disabled={readOnly}
                value={form.invoiceDate}
                onChange={(e) =>
                  updateField("invoiceDate", e.target.value)
                }
                className="h-9 py-2 pl-9 pr-3 text-xs"
              />

            </div>

            <div className="grid grid-cols-1 gap-3 border-t border-border p-4 md:grid-cols-4">

              <DatePicker
                label="Received Date"
                disabled={readOnly}
                value={form.receivedDate}
                onChange={(e) =>
                  updateField("receivedDate", e.target.value)
                }
                className="h-9 py-2 pl-9 pr-3 text-xs"
              />

              <div>
                <label className="mb-1 block text-xs font-medium text-text-muted">
                  Advance Payment
                </label>

                <input
                  disabled={readOnly}
                  type="number"
                  min="0"
                  value={form.advance}
                  onChange={(e) =>
                    updateField(
                      "advance",
                      Number(e.target.value)
                    )
                  }
                  className="h-9 w-full rounded-lg border border-border bg-surface px-3 text-xs text-secondary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-background"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-text-muted">
                  Status
                </label>

                <div className="flex h-9 items-center">
                  <StatusBadge status={form.status} />
                </div>
              </div>

            </div>
          </div>

          {/* Items */}
          <div className="rounded-lg border border-border">

            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <div>
                <h3 className="text-sm font-semibold text-secondary">
                  Received Items
                </h3>

                <p className="text-[11px] text-text-muted">
                  Add items received from the supplier
                </p>
              </div>

              {!readOnly && (
                <button
                  type="button"
                  onClick={addItem}
                  className="flex h-8 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-secondary hover:bg-primary-dark"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Item
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px]">
                <thead>
                  <tr className="border-b border-border bg-background/50">
                    <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase text-text-muted">
                      Item
                    </th>

                    <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase text-text-muted">
                      Code
                    </th>

                    <th className="px-3 py-2 text-right text-[10px] font-semibold uppercase text-text-muted">
                      Qty
                    </th>

                    <th className="px-3 py-2 text-right text-[10px] font-semibold uppercase text-text-muted">
                      Purchase Price
                    </th>

                    <th className="px-3 py-2 text-right text-[10px] font-semibold uppercase text-text-muted">
                      Selling Price
                    </th>

                    <th className="px-3 py-2 text-right text-[10px] font-semibold uppercase text-text-muted">
                      Total
                    </th>

                    {!readOnly && (
                      <th className="w-10 px-3 py-2" />
                    )}
                  </tr>
                </thead>

                <tbody>
                  {form.items.map((item, index) => (
                    <tr
                      key={item.id}
                      className="border-b border-border last:border-0"
                    >
                      <td className="px-3 py-2">
                        {readOnly ? (
                          <span className="text-xs text-secondary">
                            {item.itemName}
                          </span>
                        ) : (
                          <select
                            value={
                              availableItems.find(
                                (x) => x.name === item.itemName
                              )?.id || ""
                            }
                            onChange={(e) =>
                              selectItem(index, e.target.value)
                            }
                            className="h-8 w-full rounded-md border border-border bg-surface px-2 text-xs outline-none focus:border-primary"
                          >
                            <option value="">
                              Select item
                            </option>

                            {availableItems.map((available) => (
                              <option
                                key={available.id}
                                value={available.id}
                              >
                                {available.name}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>

                      <td className="px-3 py-2">
                        <span className="text-xs text-text-muted">
                          {item.itemCode || "-"}
                        </span>
                      </td>

                      <td className="px-3 py-2">
                        <input
                          disabled={readOnly}
                          type="number"
                          min="1"
                          value={item.qty}
                          onChange={(e) =>
                            updateItem(
                              index,
                              "qty",
                              Number(e.target.value)
                            )
                          }
                          className="h-8 w-20 rounded-md border border-border px-2 text-right text-xs outline-none focus:border-primary disabled:bg-background"
                        />
                      </td>

                      <td className="px-3 py-2">
                        <input
                          disabled={readOnly}
                          type="number"
                          min="0"
                          value={item.purchasePrice}
                          onChange={(e) =>
                            updateItem(
                              index,
                              "purchasePrice",
                              Number(e.target.value)
                            )
                          }
                          className="h-8 w-28 rounded-md border border-border px-2 text-right text-xs outline-none focus:border-primary disabled:bg-background"
                        />
                      </td>

                      <td className="px-3 py-2">
                        <input
                          disabled={readOnly}
                          type="number"
                          min="0"
                          value={item.sellingPrice}
                          onChange={(e) =>
                            updateItem(
                              index,
                              "sellingPrice",
                              Number(e.target.value)
                            )
                          }
                          className="h-8 w-28 rounded-md border border-border px-2 text-right text-xs outline-none focus:border-primary disabled:bg-background"
                        />
                      </td>

                      <td className="px-3 py-2 text-right">
                        <span className="text-xs font-semibold text-secondary">
                          Rs.{" "}
                          {(
                            (item.qty ?? 0) * item.purchasePrice
                          ).toLocaleString("en-LK")}
                        </span>
                      </td>

                      {!readOnly && (
                        <td className="px-3 py-2 text-right">
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="rounded-md p-1.5 text-text-muted hover:bg-danger/10 hover:text-danger"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end border-t border-border px-4 py-3">
              <div className="w-72 space-y-2 text-xs">

                <div className="flex justify-between">
                  <span className="text-text-muted">
                    GRN Total
                  </span>

                  <span className="font-semibold text-secondary">
                    Rs. {total.toLocaleString("en-LK")}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-text-muted">
                    Advance
                  </span>

                  <span className="font-semibold text-secondary">
                    Rs.{" "}
                    {Number(form.advance || 0).toLocaleString(
                      "en-LK"
                    )}
                  </span>
                </div>

                <div className="flex justify-between border-t border-border pt-2">
                  <span className="font-semibold text-secondary">
                    Balance
                  </span>

                  <span className="font-bold text-primary-dark">
                    Rs. {balance.toLocaleString("en-LK")}
                  </span>
                </div>

              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-between border-t border-border bg-background/30 px-5 py-3">

          <div className="flex gap-2">
            {mode === "view" &&
              form.status === "Pending Approval" && (
                <>
                  <button
                    type="button"
                    onClick={() => changeStatus("Approved")}
                    className="flex h-8 items-center gap-1.5 rounded-lg bg-success px-3 text-xs font-semibold text-white"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Approve
                  </button>

                  <button
                    type="button"
                    onClick={() => changeStatus("Rejected")}
                    className="flex h-8 items-center gap-1.5 rounded-lg bg-danger px-3 text-xs font-semibold text-white"
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    Reject
                  </button>
                </>
              )}
          </div>

          <div className="flex items-center gap-2">

            <button
              type="button"
              onClick={onClose}
              className="h-8 rounded-lg border border-border px-3 text-xs font-medium text-text-muted hover:bg-background"
            >
              Close
            </button>

            {!readOnly && (
              <button
                type="button"
                onClick={handleSubmit}
                className="flex h-8 items-center gap-1.5 rounded-lg bg-primary px-3.5 text-xs font-semibold text-secondary hover:bg-primary-dark"
              >
                <Save className="h-3.5 w-3.5" />

                {mode === "create"
                  ? "Create GRN"
                  : "Update GRN"}
              </button>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: GRNStatus }) {
  const config = {
    Draft: "bg-background text-text-muted",
    "Pending Approval":
      "bg-primary/10 text-primary-dark",
    Approved: "bg-success/10 text-success",
    Rejected: "bg-danger/10 text-danger",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${config[status]}`}
    >
      {status}
    </span>
  );
}