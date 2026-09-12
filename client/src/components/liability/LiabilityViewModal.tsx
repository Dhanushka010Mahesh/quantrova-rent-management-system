import Modal from "../ui/modal/Modal";
import Button from "../ui/button/Button";
import Badge from "../ui/others/Badge";
import { liabilityBalance } from "../../types/liability";
import type { Liability, LiabilityStatus } from "../../types/liability";

interface LiabilityViewModalProps {
  open: boolean;
  onClose: () => void;
  liability: Liability | null;
}

const statusVariant: Record<LiabilityStatus, "warning" | "success" | "info"> = {
  PENDING: "warning",
  APPROVED: "info",
  SETTLED: "success",
};

const methodLabel: Record<string, string> = { CASH: "Cash", BANK: "Bank", CHEQUE: "Cheque", EXISTING_CHEQUE: "Existing Cheque" };

export default function LiabilityViewModal({ open, onClose, liability }: LiabilityViewModalProps) {
  if (!liability) return null;
  const balance = liabilityBalance(liability);

  return (
    <Modal open={open} onClose={onClose} title={liability.name} size="lg" scrollable closeOnOverlayClick={false} footer={<Button onClick={onClose}>Close</Button>}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between rounded-lg bg-background px-3 py-2">
          <span className="text-xs text-text-muted">Status</span>
          <Badge variant={statusVariant[liability.status]}>{liability.status}</Badge>
        </div>

        {liability.description && <p className="text-sm text-text-muted">{liability.description}</p>}

        {liability.sourceType === "ASSET_PURCHASE" && (
          <div className="rounded-lg bg-primary/10 px-3 py-2 text-xs text-primary-dark">
            This liability was created from an asset purchase.
          </div>
        )}

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-background px-3 py-2.5">
            <p className="text-xs text-text-muted">Total Amount</p>
            <p className="mt-0.5 text-base font-semibold text-secondary">{liability.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="rounded-lg bg-background px-3 py-2.5">
            <p className="text-xs text-text-muted">Paid</p>
            <p className="mt-0.5 text-base font-semibold text-success">{liability.paidAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="rounded-lg bg-background px-3 py-2.5">
            <p className="text-xs text-text-muted">Balance</p>
            <p className="mt-0.5 text-base font-semibold text-danger">{balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-secondary">Payment History</p>
          {liability.payments.length === 0 ? (
            <p className="text-xs text-text-muted">No payments made yet.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {[...liability.payments].reverse().map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2 text-sm">
                  <div>
                    <p className="text-text">{p.date}</p>
                    <p className="text-xs text-text-muted">{methodLabel[p.payment.method]}</p>
                  </div>
                  <span className="font-medium text-secondary">{p.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}