import { useState } from "react";
import Modal from "../ui/modal/Modal";
import Input from "../ui/input/Input";
import Button from "../ui/button/Button";
import PaymentSection from "../payment/PaymentSection";
import type { Asset } from "../../types/asset";
import type { PaymentData } from "../../types/payment";

interface AssetSaleModalProps {
  open: boolean;
  onClose: () => void;
  asset: Asset | null;
  onSold: (asset: Asset) => void;
}

export default function AssetSaleModal({ open, onClose, asset, onSold }: AssetSaleModalProps) {
  const [customerName, setCustomerName] = useState("");
  const [saleAmount, setSaleAmount] = useState(0);
  const [saleDate, setSaleDate] = useState(new Date().toISOString().slice(0, 10));
  const [advanceEnabled, setAdvanceEnabled] = useState(false);
  const [advanceAmount, setAdvanceAmount] = useState(0);
  const [payment, setPayment] = useState<PaymentData>({ method: "CASH", cash_id: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  if (!asset) return null;

  const reset = () => {
    setCustomerName("");
    setSaleAmount(0);
    setSaleDate(new Date().toISOString().slice(0, 10));
    setAdvanceEnabled(false);
    setAdvanceAmount(0);
    setPayment({ method: "CASH", cash_id: "" });
    setErrors({});
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!customerName.trim()) next.customerName = "Customer name is required";
    if (!saleAmount || saleAmount <= 0) next.saleAmount = "Enter a valid sale amount";
    if (advanceEnabled) {
      if (!advanceAmount || advanceAmount <= 0) next.advanceAmount = "Enter a valid advance amount";
      if (advanceAmount > saleAmount) next.advanceAmount = "Advance cannot exceed the sale amount";
      if (payment.method === "CASH" && !payment.cash_id) next.cash_id = "Select a cash account";
      if (payment.method === "BANK" && !payment.bank_account_id) next.bank_account_id = "Select a bank account";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      // TODO: replace with real API call e.g. PATCH /api/assets/:id/sell
      await new Promise((r) => setTimeout(r, 800));

      const updated: Asset = {
        ...asset,
        status: "SOLD",
        saleDate,
        saleAmount,
        saleCustomerName: customerName,
        salePayments: advanceEnabled
          ? [{ id: crypto.randomUUID(), date: saleDate, amount: advanceAmount, payment, note: "Advance" }]
          : [],
      };
      onSold(updated);
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
      title={`Sell Asset — ${asset.name}`}
      size="lg"
      scrollable
      closeOnOverlayClick={false}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={saving}>
            Confirm Sale
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Input label="Buyer / Customer Name" value={customerName} error={errors.customerName} onChange={(e) => setCustomerName(e.target.value)} />
          <Input label="Sale Date" type="date" value={saleDate} onChange={(e) => setSaleDate(e.target.value)} />
        </div>

        <Input label="Sale Amount" type="number" value={saleAmount || ""} error={errors.saleAmount} onChange={(e) => setSaleAmount(Number(e.target.value))} />

        <div className="rounded-lg border border-border bg-background/60 p-3">
          <label className="flex w-fit cursor-pointer items-center gap-2 text-sm font-medium text-secondary">
            <input type="checkbox" checked={advanceEnabled} onChange={(e) => setAdvanceEnabled(e.target.checked)} className="h-4 w-4 rounded border-border-dark text-primary accent-primary" />
            Receive advance now
          </label>

          {advanceEnabled && (
            <div className="mt-3">
              <PaymentSection
                allowedMethods={["CASH", "BANK"]}
                value={payment}
                onChange={setPayment}
                amount={advanceAmount}
                onAmountChange={setAdvanceAmount}
                errors={errors}
              />
              <p className="mt-2 text-xs text-text-muted">
                Remaining balance can be collected later as further installments from the asset's detail view.
              </p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}