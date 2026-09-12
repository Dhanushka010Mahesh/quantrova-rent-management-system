import { useEffect, useState } from "react";
import Modal from "../ui/modal/Modal";
import Input from "../ui/input/Input";
import Button from "../ui/button/Button";
import type { Liability } from "../../types/liability";

interface LiabilityApproveModalProps {
  open: boolean;
  onClose: () => void;
  liability: Liability | null;
  onApproved: (liability: Liability) => void;
}

export default function LiabilityApproveModal({ open, onClose, liability, onApproved }: LiabilityApproveModalProps) {
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open && liability) {
      setDescription(liability.description);
      setDueDate(liability.dueDate ?? "");
      setTotalAmount(liability.totalAmount);
      setErrors({});
    }
  }, [open, liability]);

  if (!liability) return null;

  const handleApprove = async () => {
    const next: Record<string, string> = {};
    if (!dueDate) next.dueDate = "Due date is required to approve";
    if (!totalAmount || totalAmount <= 0) next.totalAmount = "Amount must be greater than 0";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSaving(true);
    try {
      // TODO: replace with real API call e.g. PATCH /api/liabilities/:id/approve
      await new Promise((r) => setTimeout(r, 700));
      onApproved({ ...liability, description, dueDate, totalAmount, status: "APPROVED" });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Approve Liability — ${liability.name}`}
      size="md"
      closeOnOverlayClick={false}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleApprove} loading={saving}>
            Approve
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-3.5">
        {liability.sourceType === "ASSET_PURCHASE" && (
          <div className="rounded-lg bg-background px-3 py-2 text-xs text-text-muted">
            This liability was created from a partial asset purchase. Confirm the remaining amount and set a due
            date before it can be paid.
          </div>
        )}
        <Input label="Total Amount" type="number" value={totalAmount || ""} error={errors.totalAmount} onChange={(e) => setTotalAmount(Number(e.target.value))} />
        <Input label="Due Date" type="date" value={dueDate} error={errors.dueDate} onChange={(e) => setDueDate(e.target.value)} />
        <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
    </Modal>
  );
}