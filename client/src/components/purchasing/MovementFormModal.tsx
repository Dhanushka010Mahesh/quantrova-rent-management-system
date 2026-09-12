import { useEffect, useState } from "react";
import Modal from "../ui/modal/Modal";
import Input from "../ui/input/Input";
import Select from "../ui/select/Select";
import Button from "../ui/button/Button";
import Badge from "../ui/others/Badge";
import { mockItems, type ItemMovement, type MovementType } from "../../types/itemMovement";

interface MovementFormModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: (movement: ItemMovement) => void;
}

const typeOptions: { label: string; value: MovementType }[] = [
  { label: "Stock In (Purchase)", value: "IN" },
  { label: "Stock Out (Used)", value: "OUT" },
  { label: "Return", value: "RETURN" },
];

const typeVariant: Record<MovementType, "success" | "danger" | "info"> = {
  IN: "success",
  OUT: "danger",
  RETURN: "info",
};

const emptyForm = {
  itemId: "",
  type: "IN" as MovementType,
  quantity: 0,
  reference: "",
  remarks: "",
  date: new Date().toISOString().slice(0, 10),
};

export default function MovementFormModal({ open, onClose, onSaved }: MovementFormModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(emptyForm);
      setErrors({});
    }
  }, [open]);

  const selectedItem = mockItems.find((i) => i.id === form.itemId) ?? null;

  const projectedBalance = selectedItem
    ? form.type === "OUT"
      ? selectedItem.currentStock - form.quantity
      : selectedItem.currentStock + form.quantity
    : 0;

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.itemId) next.itemId = "Select an item";
    if (!form.quantity || form.quantity <= 0) next.quantity = "Quantity must be greater than 0";
    if (form.type === "OUT" && selectedItem && form.quantity > selectedItem.currentStock)
      next.quantity = `Only ${selectedItem.currentStock} ${selectedItem.unit} available`;
    if (!form.reference.trim()) next.reference = "Reference is required";
    if (!form.date) next.date = "Date is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate() || !selectedItem) return;

    setSaving(true);
    try {
      // TODO: replace with real API call e.g. POST /api/item-movements
      await new Promise((r) => setTimeout(r, 700));

      const saved: ItemMovement = {
        id: crypto.randomUUID(),
        itemId: selectedItem.id,
        itemName: selectedItem.name,
        unit: selectedItem.unit,
        type: form.type,
        quantity: form.quantity,
        reference: form.reference,
        remarks: form.remarks,
        date: form.date,
        balanceAfter: projectedBalance,
        createdAt: new Date().toISOString(),
      };
      onSaved(saved);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const referenceLabel =
    form.type === "IN" ? "Purchase / PO Reference" : form.type === "OUT" ? "Usage / Job Reference" : "Return Reason";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Record Item Movement"
      size="lg"
      scrollable
      closeOnOverlayClick={false}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={saving}>
            Save Movement
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Select
          label="Item"
          value={form.itemId}
          error={errors.itemId}
          options={mockItems.map((i) => ({ label: `${i.name} (${i.currentStock} ${i.unit} in stock)`, value: i.id }))}
          onChange={(e) => setForm({ ...form, itemId: e.target.value })}
        />

        <div className="grid grid-cols-3 gap-2">
          {typeOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setForm({ ...form, type: opt.value })}
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                form.type === opt.value
                  ? "border-primary bg-primary/10 text-primary-dark"
                  : "border-border bg-surface text-text-muted hover:bg-background"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label={`Quantity (${selectedItem?.unit ?? "unit"})`}
            type="number"
            value={form.quantity || ""}
            error={errors.quantity}
            onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
          />
          <Input
            label="Date"
            type="date"
            value={form.date}
            error={errors.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </div>

        <Input
          label={referenceLabel}
          value={form.reference}
          error={errors.reference}
          placeholder={form.type === "IN" ? "e.g. PO-2026-045" : form.type === "OUT" ? "e.g. Site A - Foundation work" : "e.g. Excess material returned"}
          onChange={(e) => setForm({ ...form, reference: e.target.value })}
        />

        <Input
          label="Remarks (optional)"
          value={form.remarks}
          onChange={(e) => setForm({ ...form, remarks: e.target.value })}
        />

        {selectedItem && (
          <div className="rounded-lg border border-border bg-secondary/5 p-3">
            <div className="flex justify-between text-sm text-text-muted">
              <span>Current Stock</span>
              <span>
                {selectedItem.currentStock} {selectedItem.unit}
              </span>
            </div>
            <div className="flex justify-between text-sm text-text-muted">
              <span>
                {form.type === "OUT" ? "− " : "+ "}
                Movement Quantity
              </span>
              <span>
                {form.quantity || 0} {selectedItem.unit}
              </span>
            </div>
            <div className="mt-1 flex items-center justify-between border-t border-border pt-1.5 text-base font-semibold">
              <span className="text-secondary">Balance After</span>
              <span className={projectedBalance < 0 ? "text-danger" : "text-primary-dark"}>
                {projectedBalance} {selectedItem.unit}
              </span>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 text-xs text-text-muted">
          <span>Type:</span>
          <Badge variant={typeVariant[form.type]}>{typeOptions.find((o) => o.value === form.type)?.label}</Badge>
        </div>
      </div>
    </Modal>
  );
}