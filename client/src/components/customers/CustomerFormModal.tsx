import { useEffect, useState } from "react";
import type { Customer } from "../../types/customer";
import Modal from "../ui/modal/Modal";
import Button from "../ui/button/Button";
import Input from "../ui/input/Input";

interface CustomerFormModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: (customer: Customer) => void;
  customer: Customer | null;
  mode: "create" | "edit" | "view";
}

const emptyForm = { name: "", email: "", phone: "", address: "" };

export default function CustomerFormModal({ open, onClose, onSaved, customer, mode }: CustomerFormModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const readOnly = mode === "view";

  useEffect(() => {
    if (open) {
      setForm(
        customer
          ? { name: customer.name, email: customer.email || "", phone: customer.phone, address: customer.address }
          : emptyForm
      );
      setErrors({});
    }
  }, [open, customer]);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!form.email.trim()) next.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Invalid email format";
    if (!form.phone.trim()) next.phone = "Phone is required";
    if (!form.address.trim()) next.address = "Address is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (readOnly) return onClose();
    if (!validate()) return;

    setSaving(true);
    try {
      // TODO: replace with real API call
      await new Promise((r) => setTimeout(r, 700));

      const saved: Customer = {
        id: customer?.id ?? crypto.randomUUID(),
        ...form,
        active: customer?.active ?? true,
        creditBalance: customer?.creditBalance ?? 0,
        createdAt: customer?.createdAt ?? new Date().toISOString(),
      };
      onSaved(saved);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const titleMap = { create: "Add Customer", edit: "Edit Customer", view: "Customer Details" };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={titleMap[mode]}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            {readOnly ? "Close" : "Cancel"}
          </Button>
          {!readOnly && (
            <Button onClick={handleSubmit} loading={saving}>
              {mode === "create" ? "Create Customer" : "Save Changes"}
            </Button>
          )}
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Input
          label="Full Name"
          value={form.name}
          disabled={readOnly}
          error={errors.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Input
          label="Email"
          type="email"
          value={form.email}
          disabled={readOnly}
          error={errors.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Input
          label="Phone"
          value={form.phone}
          disabled={readOnly}
          error={errors.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <Input
          label="Address"
          value={form.address}
          disabled={readOnly}
          error={errors.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
      </div>
    </Modal>
  );
}