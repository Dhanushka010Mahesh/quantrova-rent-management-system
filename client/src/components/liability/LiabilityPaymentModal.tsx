import { useEffect, useState } from "react";
import Modal from "../ui/modal/Modal";
import Button from "../ui/button/Button";
import PaymentSection from "../payment/PaymentSection";
import { liabilityBalance } from "../../types/liability";
import type { Liability, LiabilityPaymentRecord } from "../../types/liability";
import type { PaymentData } from "../../types/payment";

interface LiabilityPaymentModalProps {
  open: boolean;
  onClose: () => void;
  liability: Liability | null;
  onPaid: (liability: Liability) => void;
}

export default function LiabilityPaymentModal({ open, onClose, liability, onPaid }: LiabilityPaymentModalProps) {
  const [amount, setAmount] = useState(0);
  const [payment, setPayment] = useState<PaymentData>({ method: "CASH", cash_id: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open && liability) {
      setAmount(liabilityBalance(liability));
      setPayment({ method: "CASH", cash_id: "" });
      setErrors({});
    }
  }, [open, liability]);

  if (!liability) return null;

  const balance = liabilityBalance(liability);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!amount || amount <= 0) next.amount = "Enter a valid amount";
    if (amount > balance) next.amount = `Cannot exceed remaining balance (${balance.toLocaleString()})`;
    if (payment.method === "CASH" && !payment.cash_id) next.cash_id = "Select a cash account";
    if (payment.method === "BANK" && !payment.bank_account_id) next.bank_account_id = "Select a bank account";
    if (payment.method === "CHEQUE") {
      if (!payment.bank_account_id) next.bank_account_id = "Select a bank account";
      if (!payment.cheque_no.trim()) next.cheque_no = "Cheque number is required";
      if (!payment.payee_name.trim()) next.payee_name = "Payee name is required";
    }
    if (payment.method === "EXISTING_CHEQUE" && !payment.cheque_id) next.cheque_id = "Select a cheque";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      // TODO: replace with real API call e.g. POST /api/liabilities/:id/payments
      await new Promise((r) => setTimeout(r, 700));

      const record: LiabilityPaymentRecord = {
        id: crypto.randomUUID(),
        date: new Date().toISOString().slice(0, 10),
        amount,
        payment,
      };

      const newPaid = liability.paidAmount + amount;
      const updated: Liability = {
        ...liability,
        paidAmount: newPaid,
        status: newPaid >= liability.totalAmount ? "SETTLED" : liability.status,
        payments: [...liability.payments, record],
      };
      onPaid(updated);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Pay Liability — ${liability.name}`}
      size="lg"
      scrollable
      closeOnOverlayClick={false}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={saving}>
            Make Payment
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between rounded-lg bg-background px-3 py-2">
          <span className="text-xs text-text-muted">Remaining Balance</span>
          <span className="text-base font-semibold text-primary-dark">{balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>

        <PaymentSection
          allowedMethods={["CASH", "BANK", "CHEQUE", "EXISTING_CHEQUE"]}
          value={payment}
          onChange={setPayment}
          amount={amount}
          onAmountChange={setAmount}
          errors={errors}
        />
      </div>
    </Modal>
  );
}