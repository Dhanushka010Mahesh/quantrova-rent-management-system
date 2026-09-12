import { useEffect, useState } from "react";
import Select from "../ui/select/Select";
import Button from "../ui/button/Button";
import PaymentSection from "../payment/PaymentSection";
import type { PayableEntity, PaymentTransaction } from "../../types/paymentTransaction";
import type { PaymentData, PaymentMethod } from "../../types/payment";
import type { PaymentCategoryConfig } from "./paymentCategoryConfig";

interface PaymentTypeFormProps {
  config: PaymentCategoryConfig;
  entities: PayableEntity[];
  onPaid: (transaction: PaymentTransaction) => void;
}

function defaultPayment(method: PaymentMethod): PaymentData {
  switch (method) {
    case "CASH":
      return { method: "CASH", cash_id: "" };
    case "BANK":
      return { method: "BANK", bank_account_id: "", payee_name: "", payer_name: null };
    case "CHEQUE":
      return {
        method: "CHEQUE",
        bank_account_id: "",
        cheque_no: "",
        cheque_date: new Date().toISOString().slice(0, 10),
        payee_name: "",
        payer_name: null,
      };
    case "EXISTING_CHEQUE":
      return { method: "EXISTING_CHEQUE", cheque_id: "" };
  }
}

export default function PaymentTypeForm({ config, entities, onPaid }: PaymentTypeFormProps) {
  const [entityId, setEntityId] = useState("");
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [payment, setPayment] = useState<PaymentData>(defaultPayment(config.allowedMethods[0]));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // Reset the form whenever the tab (category) changes
  useEffect(() => {
    setEntityId("");
    setAmount(0);
    setDate(new Date().toISOString().slice(0, 10));
    setPayment(defaultPayment(config.allowedMethods[0]));
    setErrors({});
  }, [config.key]);

  const selectedEntity = entities.find((e) => e.id === entityId) ?? null;

  const handleEntitySelect = (id: string) => {
    setEntityId(id);
    const entity = entities.find((e) => e.id === id);
    setAmount(entity?.amountDue ?? 0);
    setErrors({});
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!entityId) next.entityId = `Select a${/^[aeiou]/i.test(config.entityLabel) ? "n" : ""} ${config.entityLabel.toLowerCase()}`;
    if (!amount || amount <= 0) next.amount = "Amount must be greater than 0";
    if (selectedEntity && amount > selectedEntity.amountDue) next.amount = `Cannot exceed due amount (${selectedEntity.amountDue.toLocaleString()})`;
    if (!date) next.date = "Date is required";

    if (payment.method === "CASH" && !payment.cash_id) next.cash_id = "Select a cash account";
    if (payment.method === "BANK") {
      if (!payment.bank_account_id) next.bank_account_id = "Select a bank account";
      if (!payment.payee_name.trim()) next.payee_name = "Payee name is required";
    }
    if (payment.method === "CHEQUE") {
      if (!payment.bank_account_id) next.bank_account_id = "Select a bank account";
      if (!payment.cheque_no.trim()) next.cheque_no = "Cheque number is required";
      if (!payment.cheque_date) next.cheque_date = "Cheque date is required";
      if (!payment.payee_name.trim()) next.payee_name = "Payee name is required";
    }
    if (payment.method === "EXISTING_CHEQUE" && !payment.cheque_id) next.cheque_id = "Select a cheque";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate() || !selectedEntity) return;

    setSaving(true);
    try {
      // TODO: replace with real API call e.g. POST /api/payments
      // Backend should: deduct `amount` from selectedEntity's due balance,
      // and apply the payment effect to the chosen cash/bank account (or cheque record).
      await new Promise((r) => setTimeout(r, 700));

      const transaction: PaymentTransaction = {
        id: crypto.randomUUID(),
        category: config.key,
        entityId: selectedEntity.id,
        entityName: selectedEntity.name,
        entitySubtitle: selectedEntity.subtitle,
        amount,
        date,
        payment,
        createdAt: new Date().toISOString(),
      };

      onPaid(transaction);

      // reset for next payment
      setEntityId("");
      setAmount(0);
      setPayment(defaultPayment(config.allowedMethods[0]));
      setErrors({});
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className="mb-3 text-sm font-semibold text-secondary">New {config.label}</p>

      <div className="flex flex-col gap-3.5">
        <Select
          label={config.entityLabel}
          value={entityId}
          error={errors.entityId}
          options={entities.map((e) => ({ label: e.subtitle ? `${e.name} — ${e.subtitle}` : e.name, value: e.id }))}
          onChange={(e) => handleEntitySelect(e.target.value)}
        />

        {selectedEntity && (
          <div className="flex items-center justify-between rounded-lg bg-background px-3 py-2">
            <span className="text-xs text-text-muted">Amount Due</span>
            <span className="text-base font-semibold text-primary-dark">
              {selectedEntity.amountDue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        )}

        <PaymentSection
          allowedMethods={config.allowedMethods}
          value={payment}
          onChange={setPayment}
          amount={amount}
          onAmountChange={setAmount}
          disabled={!entityId}
          errors={errors}
        />

        <div>
          <label className="mb-1 block text-xs font-medium text-text-muted">Payment Date</label>
          <input
            type="date"
            value={date}
            disabled={!entityId}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-md border border-border bg-surface px-2.5 py-1.5 text-sm text-text outline-none focus:ring-1 focus:ring-primary disabled:bg-background disabled:text-text-muted"
          />
          {errors.date && <p className="mt-1 text-xs text-danger">{errors.date}</p>}
        </div>

        <Button disabled={!entityId} loading={saving} onClick={handleSubmit}>
          Make Payment
        </Button>
      </div>
    </div>
  );
}