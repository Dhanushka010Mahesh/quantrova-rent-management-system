import { useEffect, useState } from "react";
import Modal from "../ui/modal/Modal";
import Input from "../ui/input/Input";
import Button from "../ui/button/Button";
import type { Customer } from "../../types/rental";

interface CustomerQuickCreateModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (customer: Customer) => void;
}

const emptyForm = { name: "", phone: "", nic: "", address: "", description: "" };

export default function CustomerQuickCreateModal({ open, onClose, onCreated }: CustomerQuickCreateModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(emptyForm);
      setErrors({});
    }
  }, [open]);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!form.phone.trim()) next.phone = "Phone is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      // TODO: replace with real API call e.g. POST /api/customers
      await new Promise((r) => setTimeout(r, 600));
      const customer: Customer = {
        id: crypto.randomUUID(),
        name: form.name,
        phone: form.phone,
        nic: form.nic,
        address: form.address,
        description: form.description,
        creditBalance: 0,
      };
      onCreated(customer);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add New Customer"
      size="md"
      closeOnOverlayClick={false}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={saving}>
            Create Customer
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-3.5">
        <Input label="Full Name" value={form.name} error={errors.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Phone" value={form.phone} error={errors.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input label="NIC" value={form.nic} onChange={(e) => setForm({ ...form, nic: e.target.value })} />
        </div>
        <Input label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        <Input label="Description (optional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </div>
    </Modal>
  );
}