import { useState } from "react";
import Modal from "../ui/modal/Modal";
import Input from "../ui/input/Input";
import Button from "../ui/button/Button";
import type { Liability } from "../../types/liability";

interface LiabilityFormModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: (liability: Liability) => void;
}

const emptyForm = { name: "", description: "", totalAmount: 0, dueDate: "" };

export default function LiabilityFormModal({ open, onClose, onSaved }: LiabilityFormModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const reset = () => {
    setForm(emptyForm);
    setErrors({});
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!form.totalAmount || form.totalAmount <= 0) next.totalAmount = "Amount must be greater than 0";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      // TODO: replace with real API call e.g. POST /api/liabilities
      await new Promise((r) => setTimeout(r, 700));
      const saved: Liability = {
        id: crypto.randomUUID(),
        name: form.name,
        description: form.description,
        totalAmount: form.totalAmount,
        paidAmount: 0,
        status: "APPROVED",
        sourceType: "MANUAL",
        assetId: null,
        dueDate: form.dueDate || null,
        payments: [],
        createdAt: new Date().toISOString(),
      };
      onSaved(saved);
      reset();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        reset();
        onClose();
      }}
      title="Add Liability"
      size="md"
      closeOnOverlayClick={false}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={saving}>
            Create Liability
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-3.5">
        <Input label="Name" value={form.name} error={errors.name} placeholder="e.g. Bank Loan - Equipment" onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input label="Description (optional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Total Amount" type="number" value={form.totalAmount || ""} error={errors.totalAmount} onChange={(e) => setForm({ ...form, totalAmount: Number(e.target.value) })} />
          <Input label="Due Date (optional)" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
        </div>
      </div>
    </Modal>
  );
}