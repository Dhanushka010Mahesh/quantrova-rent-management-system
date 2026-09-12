import { useState } from "react";
import Modal from "../ui/modal/Modal";
import Input from "../ui/input/Input";
import Button from "../ui/button/Button";
import type { RentalOrder } from "../../types/rentalOrder";

interface RejectOrderModalProps {
  open: boolean;
  onClose: () => void;
  order: RentalOrder | null;
  onRejected: (order: RentalOrder) => void;
}

export default function RejectOrderModal({ open, onClose, order, onRejected }: RejectOrderModalProps) {
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);

  if (!order) return null;

  const handleConfirm = async () => {
    setSaving(true);
    try {
      // TODO: replace with real API call e.g. PATCH /api/rental-orders/:id/reject
      await new Promise((r) => setTimeout(r, 600));
      onRejected({ ...order, status: "REJECTED", rejectedReason: reason || null });
      setReason("");
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Reject Order — ${order.billNumber}`}
      size="sm"
      closeOnOverlayClick={false}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirm} loading={saving}>
            Reject Order
          </Button>
        </>
      }
    >
      <Input label="Reason (optional)" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Customer cancelled" />
    </Modal>
  );
}