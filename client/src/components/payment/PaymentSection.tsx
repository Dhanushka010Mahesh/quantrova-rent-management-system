// import { mockCashAccounts, mockBankAccounts, mockExistingCheques } from "../../data/mockFinance";
import Select from "../ui/select/Select";
import Input from "../ui/input/Input";
import { type PaymentMethod, type PaymentData, mockCashAccounts, mockBankAccounts, mockExistingCheques } from "../../types/payment";

interface PaymentSectionProps {
  allowedMethods: PaymentMethod[];
  value: PaymentData | null;
  onChange: (value: PaymentData) => void;
  amount: number;
  onAmountChange: (amount: number) => void;
  disabled?: boolean;
  errors?: Record<string, string>;
}

const methodLabel: Record<PaymentMethod, string> = {
  CASH: "Cash",
  BANK: "Bank",
  CHEQUE: "Cheque",
  EXISTING_CHEQUE: "Existing Cheque",
};

function defaultForMethod(method: PaymentMethod): PaymentData {
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

export default function PaymentSection({
  allowedMethods,
  value,
  onChange,
  amount,
  onAmountChange,
  disabled,
  errors = {},
}: PaymentSectionProps) {
  const currentMethod: PaymentMethod = value?.method ?? allowedMethods[0];

  const handleMethodChange = (method: PaymentMethod) => {
    onChange(defaultForMethod(method));
  };

  const updateField = (patch: Partial<PaymentData>) => {
    if (!value) return;
    onChange({ ...value, ...patch } as PaymentData);
  };

  return (
    <div className="rounded-lg border border-border bg-background/60 p-3">
      <p className="mb-2.5 text-sm font-medium text-secondary">Payment</p>

      {allowedMethods.length > 1 && (
        <div className="mb-3 grid gap-2" style={{ gridTemplateColumns: `repeat(${allowedMethods.length}, minmax(0, 1fr))` }}>
          {allowedMethods.map((m) => (
            <button
              key={m}
              type="button"
              disabled={disabled}
              onClick={() => handleMethodChange(m)}
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                currentMethod === m
                  ? "border-primary bg-primary/10 text-primary-dark"
                  : "border-border bg-surface text-text-muted hover:bg-background"
              }`}
            >
              {methodLabel[m]}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Amount"
          type="number"
          value={amount || ""}
          disabled={disabled}
          error={errors.amount}
          onChange={(e) => onAmountChange(Number(e.target.value))}
        />

        {currentMethod === "CASH" && value?.method === "CASH" && (
          <Select
            label="Cash Account"
            value={value.cash_id}
            disabled={disabled}
            error={errors.cash_id}
            options={mockCashAccounts.map((a) => ({ label: a.name, value: a.id.toString() }))}
            onChange={(e) => updateField({ cash_id: Number(e.target.value) })}
          />
        )}

        {currentMethod === "BANK" && value?.method === "BANK" && (
          <Select
            label="Bank Account"
            value={value.bank_account_id}
            disabled={disabled}
            error={errors.bank_account_id}
            options={mockBankAccounts.map((a) => ({ label: a.name, value: a.id.toString() }))}
            onChange={(e) => updateField({ bank_account_id: Number(e.target.value) })}
          />
        )}

        {currentMethod === "CHEQUE" && value?.method === "CHEQUE" && (
          <Select
            label="Bank Account"
            value={value.bank_account_id}
            disabled={disabled}
            error={errors.bank_account_id}
            options={mockBankAccounts.map((a) => ({ label: a.name, value: a.id.toString() }))}
            onChange={(e) => updateField({ bank_account_id: Number(e.target.value) })}
          />
        )}

        {currentMethod === "EXISTING_CHEQUE" && value?.method === "EXISTING_CHEQUE" && (
          <Select
            label="Existing Cheque"
            value={value.cheque_id}
            disabled={disabled}
            error={errors.cheque_id}
            options={mockExistingCheques.map((c) => ({
              label: `${c.chequeNo} — ${c.bankAccountName} (${c.amount.toLocaleString()})`,
              value: c.id.toString(),
            }))}
            onChange={(e) => updateField({ cheque_id: Number(e.target.value) })}
          />
        )}
      </div>

      {currentMethod === "CHEQUE" && value?.method === "CHEQUE" && (
        <div className="mt-3 grid grid-cols-2 gap-3">
          <Input
            label="Cheque No"
            value={value.cheque_no}
            disabled={disabled}
            error={errors.cheque_no}
            placeholder="e.g. CHQ-000125"
            onChange={(e) => updateField({ cheque_no: e.target.value })}
          />
          <Input
            label="Cheque Date"
            type="date"
            value={value.cheque_date}
            disabled={disabled}
            error={errors.cheque_date}
            onChange={(e) => updateField({ cheque_date: e.target.value })}
          />
        </div>
      )}

      {(currentMethod === "BANK" || currentMethod === "CHEQUE") && value && "payee_name" in value && (
        <div className="mt-3 grid grid-cols-2 gap-3">
          <Input
            label="Payee Name"
            value={value.payee_name}
            disabled={disabled}
            error={errors.payee_name}
            placeholder="e.g. CEB"
            onChange={(e) => updateField({ payee_name: e.target.value })}
          />
          <Input
            label="Payer Name (optional)"
            value={value.payer_name ?? ""}
            disabled={disabled}
            onChange={(e) => updateField({ payer_name: e.target.value || null })}
          />
        </div>
      )}
    </div>
  );
}