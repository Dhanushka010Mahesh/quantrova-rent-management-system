import { useEffect, useState } from "react";
import Modal from "../ui/modal/Modal";
import Input from "../ui/input/Input";
import Button from "../ui/button/Button";
import type { IncomeCategory } from "../../types/income";

interface IncomeCategoryFormModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: (category: IncomeCategory) => void;
}

export default function IncomeCategoryFormModal({ open, onClose, onSaved }: IncomeCategoryFormModalProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setName("");
      setError("");
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Category name is required");
      return;
    }
    setSaving(true);
    try {
      // TODO: replace with real API call e.g. POST /api/income-categories
      await new Promise((r) => setTimeout(r, 500));
      onSaved({ id: crypto.randomUUID(), name: name.trim() });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add Income Category"
      size="sm"
      closeOnOverlayClick={false}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={saving}>
            Add Category
          </Button>
        </>
      }
    >
      <Input
        label="Category Name"
        value={name}
        error={error}
        placeholder="e.g. Product Sales"
        onChange={(e) => setName(e.target.value)}
      />
    </Modal>
  );
}