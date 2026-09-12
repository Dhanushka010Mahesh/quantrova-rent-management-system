import { useState } from "react";
import Modal from "../ui/modal/Modal";
import Input from "../ui/input/Input";
import Button from "../ui/button/Button";
import PaymentSection from "../payment/PaymentSection";
import type { Asset } from "../../types/asset";
import type { Liability } from "../../types/liability";
import type { PaymentData } from "../../types/payment";

interface AssetFormModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: (asset: Asset, createdLiability: Liability | null) => void;
}

const emptyForm = { name: "", category: "", purchaseDate: new Date().toISOString().slice(0, 10), purchaseAmount: 0, paidNow: 0 };

export default function AssetFormModal({ open, onClose, onSaved }: AssetFormModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [payment, setPayment] = useState<PaymentData>({ method: "CASH", cash_id: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const reset = () => {
    setForm(emptyForm);
    setPayment({ method: "CASH", cash_id: "" });
    setErrors({});
  };

  const remaining = Math.max(form.purchaseAmount - form.paidNow, 0);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Asset name is required";
    if (!form.purchaseAmount || form.purchaseAmount <= 0) next.purchaseAmount = "Enter a valid purchase amount";
    if (form.paidNow < 0 || form.paidNow > form.purchaseAmount) next.paidNow = "Paid amount must be between 0 and the purchase amount";
    if (form.paidNow > 0) {
      if (payment.method === "CASH" && !payment.cash_id) next.cash_id = "Select a cash account";
      if (payment.method === "BANK" && !payment.bank_account_id) next.bank_account_id = "Select a bank account";
      if (payment.method === "CHEQUE" && !payment.bank_account_id) next.bank_account_id = "Select a bank account";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      // TODO: replace with real API call e.g. POST /api/assets
      // Backend should also create the linked liability record if paidNow < purchaseAmount.
      await new Promise((r) => setTimeout(r, 800));

      const assetId = crypto.randomUUID();
      let createdLiability: Liability | null = null;

      if (remaining > 0) {
        createdLiability = {
          id: crypto.randomUUID(),
          name: `Asset Purchase — ${form.name}`,
          description: `Remaining balance for purchase of ${form.name}`,
          totalAmount: remaining,
          paidAmount: 0,
          status: "PENDING",
          sourceType: "ASSET_PURCHASE",
          assetId,
          dueDate: null,
          payments: [],
          createdAt: new Date().toISOString(),
        };
      }

      const saved: Asset = {
        id: assetId,
        name: form.name,
        category: form.category,
        purchaseDate: form.purchaseDate,
        purchaseAmount: form.purchaseAmount,
        paidAtPurchase: form.paidNow,
        liabilityId: createdLiability?.id ?? null,
        status: "OWNED",
        saleDate: null,
        saleAmount: null,
        saleCustomerName: null,
        salePayments: [],
        createdAt: new Date().toISOString(),
      };

      onSaved(saved, createdLiability);
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
      title="Add Asset"
      size="lg"
      scrollable
      closeOnOverlayClick={false}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={saving}>
            Create Asset
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Input label="Asset Name" value={form.name} error={errors.name} placeholder="e.g. Generator 20kVA" onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Category" value={form.category} placeholder="e.g. Equipment, Vehicle" onChange={(e) => setForm({ ...form, category: e.target.value })} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input label="Purchase Date" type="date" value={form.purchaseDate} onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })} />
          <Input label="Purchase Amount" type="number" value={form.purchaseAmount || ""} error={errors.purchaseAmount} onChange={(e) => setForm({ ...form, purchaseAmount: Number(e.target.value) })} />
        </div>

        <PaymentSection
          allowedMethods={["CASH", "BANK", "CHEQUE"]}
          value={payment}
          onChange={setPayment}
          amount={form.paidNow}
          onAmountChange={(v) => setForm({ ...form, paidNow: v })}
          errors={errors}
        />

        {remaining > 0 && (
          <div className="rounded-lg border border-warning/30 bg-warning/5 px-3 py-2 text-xs text-secondary">
            Remaining <span className="font-semibold">{remaining.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span> will be
            added to the Liabilities page as a pending item, awaiting approval.
          </div>
        )}
      </div>
    </Modal>
  );
}