import { useEffect, useState } from "react";
import Modal from "../ui/modal/Modal";
import Button from "../ui/button/Button";
import PaymentSection from "../payment/PaymentSection";
import { assetSaleBalance } from "../../types/asset";
import type { Asset, AssetSalePaymentRecord } from "../../types/asset";
import type { PaymentData } from "../../types/payment";

interface AssetAddSalePaymentModalProps {
  open: boolean;
  onClose: () => void;
  asset: Asset | null;
  onPaid: (asset: Asset) => void;
}

export default function AssetAddSalePaymentModal({ open, onClose, asset, onPaid }: AssetAddSalePaymentModalProps) {
  const [amount, setAmount] = useState(0);
  const [payment, setPayment] = useState<PaymentData>({ method: "CASH", cash_id: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open && asset) {
      setAmount(assetSaleBalance(asset));
      setPayment({ method: "CASH", cash_id: "" });
      setErrors({});
    }
  }, [open, asset]);

  if (!asset) return null;
  const balance = assetSaleBalance(asset);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!amount || amount <= 0) next.amount = "Enter a valid amount";
    if (amount > balance) next.amount = `Cannot exceed remaining balance (${balance.toLocaleString()})`;
    if (payment.method === "CASH" && !payment.cash_id) next.cash_id = "Select a cash account";
    if (payment.method === "BANK" && !payment.bank_account_id) next.bank_account_id = "Select a bank account";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      // TODO: replace with real API call e.g. POST /api/assets/:id/sale-payments
      await new Promise((r) => setTimeout(r, 700));
      const record: AssetSalePaymentRecord = {
        id: crypto.randomUUID(),
        date: new Date().toISOString().slice(0, 10),
        amount,
        payment,
        note: "Installment",
      };
      onPaid({ ...asset, salePayments: [...asset.salePayments, record] });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Receive Payment — ${asset.name}`}
      size="lg"
      scrollable
      closeOnOverlayClick={false}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={saving}>
            Record Payment
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between rounded-lg bg-background px-3 py-2">
          <span className="text-xs text-text-muted">Remaining Balance</span>
          <span className="text-base font-semibold text-primary-dark">{balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
        <PaymentSection allowedMethods={["CASH", "BANK"]} value={payment} onChange={setPayment} amount={amount} onAmountChange={setAmount} errors={errors} />
      </div>
    </Modal>
  );
}