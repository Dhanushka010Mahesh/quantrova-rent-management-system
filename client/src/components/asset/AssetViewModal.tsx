import Modal from "../ui/modal/Modal";
import Button from "../ui/button/Button";
import Badge from "../ui/others/Badge";
import { assetOutstandingLiabilityAmount, assetSaleReceived, assetSaleBalance } from "../../types/asset";
import type { Asset } from "../../types/asset";
import type { Liability } from "../../types/liability";

interface AssetViewModalProps {
  open: boolean;
  onClose: () => void;
  asset: Asset | null;
  linkedLiability: Liability | null;
}

const methodLabel: Record<string, string> = { CASH: "Cash", BANK: "Bank", CHEQUE: "Cheque", EXISTING_CHEQUE: "Existing Cheque" };

export default function AssetViewModal({ open, onClose, asset, linkedLiability }: AssetViewModalProps) {
  if (!asset) return null;

  return (
    <Modal open={open} onClose={onClose} title={asset.name} size="lg" scrollable closeOnOverlayClick={false} footer={<Button onClick={onClose}>Close</Button>}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between rounded-lg bg-background px-3 py-2">
          <span className="text-xs text-text-muted">Status</span>
          <Badge variant={asset.status === "OWNED" ? "success" : "neutral"}>{asset.status}</Badge>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-text-muted">Category</p>
            <p className="text-text">{asset.category || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-text-muted">Purchase Date</p>
            <p className="text-text">{asset.purchaseDate}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-background px-3 py-2.5">
            <p className="text-xs text-text-muted">Purchase Amount</p>
            <p className="mt-0.5 text-base font-semibold text-secondary">{asset.purchaseAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="rounded-lg bg-background px-3 py-2.5">
            <p className="text-xs text-text-muted">Paid at Purchase</p>
            <p className="mt-0.5 text-base font-semibold text-success">{asset.paidAtPurchase.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="rounded-lg bg-background px-3 py-2.5">
            <p className="text-xs text-text-muted">Outstanding</p>
            <p className="mt-0.5 text-base font-semibold text-danger">{assetOutstandingLiabilityAmount(asset).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
        </div>

        {linkedLiability && (
          <div className="rounded-lg border border-warning/30 bg-warning/5 px-3 py-2 text-sm">
            <p className="font-medium text-secondary">Linked Liability: {linkedLiability.name}</p>
            <p className="mt-0.5 text-xs text-text-muted">
              Status: {linkedLiability.status} · Balance: {(linkedLiability.totalAmount - linkedLiability.paidAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
            <p className="mt-1 text-xs text-text-muted">Manage payments for this from the Liabilities page.</p>
          </div>
        )}

        {asset.status === "SOLD" && (
          <div className="flex flex-col gap-3 border-t border-border pt-3">
            <p className="text-sm font-semibold text-secondary">Sale Details</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-text-muted">Buyer</p>
                <p className="text-text">{asset.saleCustomerName}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted">Sale Date</p>
                <p className="text-text">{asset.saleDate}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg bg-background px-3 py-2.5">
                <p className="text-xs text-text-muted">Sale Amount</p>
                <p className="mt-0.5 text-base font-semibold text-secondary">{(asset.saleAmount ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="rounded-lg bg-background px-3 py-2.5">
                <p className="text-xs text-text-muted">Received</p>
                <p className="mt-0.5 text-base font-semibold text-success">{assetSaleReceived(asset).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="rounded-lg bg-background px-3 py-2.5">
                <p className="text-xs text-text-muted">Balance</p>
                <p className="mt-0.5 text-base font-semibold text-danger">{assetSaleBalance(asset).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-secondary">Payment History</p>
              {asset.salePayments.length === 0 ? (
                <p className="text-xs text-text-muted">No payments received yet.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {[...asset.salePayments].reverse().map((p) => (
                    <div key={p.id} className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2 text-sm">
                      <div>
                        <p className="text-text">
                          {p.date} · {p.note}
                        </p>
                        <p className="text-xs text-text-muted">{methodLabel[p.payment.method]}</p>
                      </div>
                      <span className="font-medium text-secondary">{p.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}