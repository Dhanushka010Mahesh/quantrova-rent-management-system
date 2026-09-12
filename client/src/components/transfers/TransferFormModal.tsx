import { useEffect, useState } from "react";
import Modal from "../ui/modal/Modal";
import Input from "../ui/input/Input";
import Select from "../ui/select/Select";
import Button from "../ui/button/Button";
// import { mockCashAccounts, mockBankAccounts } from "../../data/mockFinance";
import type { FundTransfer, TransferDirection } from "../../types/fundTransfer";
import { mockBankAccounts, mockCashAccounts } from "../../types/payment";

interface TransferFormModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: (transfer: FundTransfer) => void;
}

const directionOptions: { label: string; value: TransferDirection }[] = [
  { label: "Cash → Bank", value: "CASH_TO_BANK" },
  { label: "Bank → Cash", value: "BANK_TO_CASH" },
];

const emptyForm = {
  direction: "CASH_TO_BANK" as TransferDirection,
  cashAccountId: "" as number | "",
  bankAccountId: "" as number | "",
  amount: 0,
  date: new Date().toISOString().slice(0, 10),
  note: "",
};

export default function TransferFormModal({ open, onClose, onSaved }: TransferFormModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(emptyForm);
      setErrors({});
    }
  }, [open]);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.cashAccountId) next.cashAccountId = "Select a cash account";
    if (!form.bankAccountId) next.bankAccountId = "Select a bank account";
    if (!form.amount || form.amount <= 0) next.amount = "Amount must be greater than 0";
    if (!form.date) next.date = "Date is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setSaving(true);
    try {
      // TODO: replace with real API call e.g. POST /api/fund-transfers
      // Backend should atomically debit the source account and credit the destination account.
      await new Promise((r) => setTimeout(r, 700));

      const cashAcc = mockCashAccounts.find((a) => a.id === form.cashAccountId);
      const bankAcc = mockBankAccounts.find((a) => a.id === form.bankAccountId);

      const saved: FundTransfer = {
        id: crypto.randomUUID(),
        direction: form.direction,
        cashAccountId: Number(form.cashAccountId),
        cashAccountName: cashAcc?.name ?? "",
        bankAccountId: Number(form.bankAccountId),
        bankAccountName: bankAcc?.name ?? "",
        amount: form.amount,
        date: form.date,
        note: form.note,
        createdAt: new Date().toISOString(),
      };
      onSaved(saved);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New Fund Transfer"
      size="md"
      closeOnOverlayClick={false}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={saving}>
            Transfer
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-2">
          {directionOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setForm({ ...form, direction: opt.value })}
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                form.direction === opt.value
                  ? "border-primary bg-primary/10 text-primary-dark"
                  : "border-border bg-surface text-text-muted hover:bg-background"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <Select
          label="Cash Account"
          value={form.cashAccountId}
          error={errors.cashAccountId}
          options={mockCashAccounts.map((a) => ({ label: a.name, value: a.id.toString() }))}
          onChange={(e) => setForm({ ...form, cashAccountId: Number(e.target.value) })}
        />

        <Select
          label="Bank Account"
          value={form.bankAccountId}
          error={errors.bankAccountId}
          options={mockBankAccounts.map((a) => ({ label: a.name, value: a.id.toString() }))}
          onChange={(e) => setForm({ ...form, bankAccountId: Number(e.target.value) })}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Amount"
            type="number"
            value={form.amount || ""}
            error={errors.amount}
            onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
          />
          <Input
            label="Date"
            type="date"
            value={form.date}
            error={errors.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </div>

        <Input
          label="Note (optional)"
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
        />

        <div className="rounded-lg bg-background px-3 py-2 text-sm text-text-muted">
          {form.direction === "CASH_TO_BANK"
            ? "Amount will be deducted from the cash account and added to the bank account."
            : "Amount will be deducted from the bank account and added to the cash account."}
        </div>
      </div>
    </Modal>
  );
}