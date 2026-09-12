import { useEffect, useState } from "react";
import Modal from "../ui/modal/Modal";
import Input from "../ui/input/Input";
import Select from "../ui/select/Select";
import Button from "../ui/button/Button";
// import { mockBankAccounts } from "../../data/mockFinance";
import type { ChequeInHand, ChequeType } from "../../types/chequeInHand";
import { mockBankAccounts } from "../../types/payment";

interface ChequeFormModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: (cheque: ChequeInHand) => void;
}

const typeOptions: { label: string; value: ChequeType }[] = [
  { label: "Received (from customer)", value: "RECEIVED" },
  { label: "Issued (to a party)", value: "ISSUED" },
];

const emptyForm = {
  type: "RECEIVED" as ChequeType,
  chequeNo: "",
  bankAccountId: "" as number | "",
  partyName: "",
  amount: 0,
  chequeDate: new Date().toISOString().slice(0, 10),
  receivedOrIssuedDate: new Date().toISOString().slice(0, 10),
};

export default function ChequeFormModal({ open, onClose, onSaved }: ChequeFormModalProps) {
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
    if (!form.chequeNo.trim()) next.chequeNo = "Cheque number is required";
    if (!form.bankAccountId) next.bankAccountId = "Select a bank account";
    if (!form.partyName.trim()) next.partyName = "Party name is required";
    if (!form.amount || form.amount <= 0) next.amount = "Amount must be greater than 0";
    if (!form.chequeDate) next.chequeDate = "Cheque date is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setSaving(true);
    try {
      // TODO: replace with real API call e.g. POST /api/cheques-in-hand
      await new Promise((r) => setTimeout(r, 700));

      const bankAcc = mockBankAccounts.find((a) => a.id === form.bankAccountId);

      const saved: ChequeInHand = {
        id: crypto.randomUUID(),
        type: form.type,
        chequeNo: form.chequeNo,
        bankAccountId: Number(form.bankAccountId),
        bankAccountName: bankAcc?.name ?? "",
        partyName: form.partyName,
        amount: form.amount,
        chequeDate: form.chequeDate,
        receivedOrIssuedDate: form.receivedOrIssuedDate,
        status: "IN_HAND",
        statusDate: null,
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
      title="Add Cheque In Hand"
      size="md"
      closeOnOverlayClick={false}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={saving}>
            Add Cheque
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-2">
          {typeOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setForm({ ...form, type: opt.value })}
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                form.type === opt.value
                  ? "border-primary bg-primary/10 text-primary-dark"
                  : "border-border bg-surface text-text-muted hover:bg-background"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Cheque No"
            value={form.chequeNo}
            error={errors.chequeNo}
            placeholder="e.g. CHQ-000125"
            onChange={(e) => setForm({ ...form, chequeNo: e.target.value })}
          />
          <Select
            label="Bank Account"
            value={form.bankAccountId}
            error={errors.bankAccountId}
            options={mockBankAccounts.map((a) => ({ label: a.name, value: a.id.toString() }))}
            onChange={(e) => setForm({ ...form, bankAccountId: Number(e.target.value) })}
          />
        </div>

        <Input
          label={form.type === "RECEIVED" ? "Received From" : "Issued To"}
          value={form.partyName}
          error={errors.partyName}
          onChange={(e) => setForm({ ...form, partyName: e.target.value })}
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
            label="Cheque Date"
            type="date"
            value={form.chequeDate}
            error={errors.chequeDate}
            onChange={(e) => setForm({ ...form, chequeDate: e.target.value })}
          />
        </div>

        <Input
          label={form.type === "RECEIVED" ? "Date Received" : "Date Issued"}
          type="date"
          value={form.receivedOrIssuedDate}
          onChange={(e) => setForm({ ...form, receivedOrIssuedDate: e.target.value })}
        />
      </div>
    </Modal>
  );
}