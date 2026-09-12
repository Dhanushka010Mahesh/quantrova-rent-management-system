import { useEffect, useState } from "react";
import Modal from "../ui/modal/Modal";
import Button from "../ui/button/Button";
import Badge from "../ui/others/Badge";
import OrderLineItemsTable from "./OrderLineItemsTable";
import OrderNotesPanel from "./OrderNotesPanel";
import { orderTotal, orderPaidTotal, orderBalanceDue } from "../../types/rentalOrder";
import type { RentalOrder, RentalOrderStatus, OrderLine, OrderNote } from "../../types/rentalOrder";

interface OrderDetailModalProps {
  open: boolean;
  onClose: () => void;
  order: RentalOrder | null;
  mode: "view" | "edit";
  onSaved: (order: RentalOrder) => void;
}

const statusVariant: Record<RentalOrderStatus, "warning" | "success" | "danger"> = {
  PENDING: "warning",
  PROCESSED: "success",
  REJECTED: "danger",
};

export default function OrderDetailModal({ open, onClose, order, mode, onSaved }: OrderDetailModalProps) {
  const [lines, setLines] = useState<OrderLine[]>([]);
  const [notes, setNotes] = useState<OrderNote[]>([]);
  const [saving, setSaving] = useState(false);
  const editable = mode === "edit";

  useEffect(() => {
    if (open && order) {
      setLines(order.lines);
      setNotes(order.notes);
    }
  }, [open, order]);

  if (!order) return null;

  const currentOrder = { ...order, lines };
  const total = orderTotal(currentOrder);
  const paid = orderPaidTotal(order);
  const balance = orderBalanceDue(currentOrder);

  const handleAddNote = (text: string) => {
    const note: OrderNote = { id: crypto.randomUUID(), text, author: "Current User", date: new Date().toISOString() };
    setNotes((prev) => [...prev, note]);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // TODO: replace with real API call e.g. PATCH /api/rental-orders/:id
      await new Promise((r) => setTimeout(r, 700));
      onSaved({ ...order, lines, notes });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`${editable ? "Edit" : "View"} Order — ${order.billNumber}`}
      size="xl"
      scrollable
      closeOnOverlayClick={false}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {editable && (
            <Button onClick={handleSave} loading={saving}>
              Save Changes
            </Button>
          )}
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-background px-3 py-2">
          <div>
            <p className="text-sm font-medium text-secondary">{order.customerName}</p>
            <p className="text-xs text-text-muted">{order.customerPhone || "—"} · Order date: {order.orderDate}</p>
          </div>
          <Badge variant={statusVariant[order.status]}>{order.status}</Badge>
        </div>

        {editable && (
          <p className="text-xs text-text-muted">
            New items you add will be dated today automatically. Existing items keep their original out date.
          </p>
        )}

        <OrderLineItemsTable lines={lines} onChange={editable ? setLines : undefined} editable={editable} />

        <div className="rounded-lg border border-border bg-secondary/5 p-3">
          <div className="flex justify-between text-sm text-text-muted">
            <span>Order Total</span>
            <span>{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between text-sm text-text-muted">
            <span>Paid</span>
            <span>{paid.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="mt-1 flex justify-between border-t border-border pt-1.5 text-base font-semibold text-primary-dark">
            <span>Balance Due</span>
            <span>{balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        {order.guarantors.length > 0 && (
          <div className="rounded-lg border border-border bg-background/60 p-3">
            <p className="mb-2 text-sm font-medium text-secondary">Guarantors</p>
            <div className="flex flex-col gap-1.5">
              {order.guarantors.map((g) => (
                <div key={g.id} className="text-xs text-text-muted">
                  {g.name} · {g.nic} · {g.phone}
                </div>
              ))}
            </div>
          </div>
        )}

        <OrderNotesPanel notes={notes} onAdd={handleAddNote} readOnly={false} />
      </div>
    </Modal>
  );
}