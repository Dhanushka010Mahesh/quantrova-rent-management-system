import { useEffect, useState } from "react";
import Modal from "../ui/modal/Modal";
import Input from "../ui/input/Input";
import Select from "../ui/select/Select";
import Button from "../ui/button/Button";
import Badge from "../ui/others/Badge";
import type { BankAccount } from "../../types/account";

interface BankAccountFormModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: (account: BankAccount) => void;
  account: BankAccount | null; // null = create
  mode: "create" | "edit" | "view";
}

const emptyForm = {
  accountName: "",
  bankName: "",
  branch: "",
  accountNumber: "",
  openingBalance: 0,
  status: "Active" as BankAccount["status"],
};

export default function BankAccountFormModal({ open, onClose, onSaved, account, mode }: BankAccountFormModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const readOnly = mode === "view";

  useEffect(() => {
    if (!open) return;
    if (account) {
      setForm({
        accountName: account.accountName,
        bankName: account.bankName,
        branch: account.branch,
        accountNumber: account.accountNumber,
        openingBalance: account.openingBalance,
        status: account.status,
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [open, account]);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.accountName.trim()) next.accountName = "Account name is required";
    if (!form.bankName.trim()) next.bankName = "Bank name is required";
    if (!form.branch.trim()) next.branch = "Branch is required";
    if (!form.accountNumber.trim()) next.accountNumber = "Account number is required";
    if (form.openingBalance < 0) next.openingBalance = "Opening balance can't be negative";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (readOnly) return onClose();
    if (!validate()) return;

    setSaving(true);
    try {
      // TODO: replace with real API call (POST for create, PATCH for edit)
      await new Promise((r) => setTimeout(r, 700));

      const balanceDelta = account ? form.openingBalance - account.openingBalance : 0;

      const saved: BankAccount = {
        id: account?.id ?? crypto.randomUUID(),
        accountName: form.accountName,
        bankName: form.bankName,
        branch: form.branch,
        accountNumber: form.accountNumber,
        openingBalance: form.openingBalance,
        currentBalance: account ? account.currentBalance + balanceDelta : form.openingBalance,
        status: form.status,
        createdAt: account?.createdAt ?? new Date().toISOString(),
      };
      onSaved(saved);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const titleMap = { create: "Add Bank Account", edit: "Edit Bank Account", view: "Bank Account Details" };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={titleMap[mode]}
      size="md"
      scrollable
      closeOnOverlayClick={false}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            {readOnly ? "Close" : "Cancel"}
          </Button>
          {!readOnly && (
            <Button onClick={handleSubmit} loading={saving}>
              {mode === "create" ? "Create Account" : "Save Changes"}
            </Button>
          )}
        </>
      }
    >
      <div className="flex flex-col gap-4">
        {mode === "view" && account && (
          <div className="flex items-center justify-between rounded-lg bg-background px-3 py-2">
            <span className="text-xs text-text-muted">Current Balance</span>
            <span className="text-base font-semibold text-primary-dark">
              {account.currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        )}

        <Input
          label="Account Name"
          value={form.accountName}
          disabled={readOnly}
          error={errors.accountName}
          placeholder="e.g. Business Current Account"
          onChange={(e) => setForm({ ...form, accountName: e.target.value })}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Bank Name"
            value={form.bankName}
            disabled={readOnly}
            error={errors.bankName}
            placeholder="e.g. Commercial Bank"
            onChange={(e) => setForm({ ...form, bankName: e.target.value })}
          />
          <Input
            label="Branch"
            value={form.branch}
            disabled={readOnly}
            error={errors.branch}
            placeholder="e.g. Colombo 03"
            onChange={(e) => setForm({ ...form, branch: e.target.value })}
          />
        </div>

        <Input
          label="Account Number"
          value={form.accountNumber}
          disabled={readOnly || mode === "edit"}
          error={errors.accountNumber}
          onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
        />

        <Input
          label="Opening Balance"
          type="number"
          value={form.openingBalance || ""}
          disabled={readOnly || mode === "edit"}
          error={errors.openingBalance}
          onChange={(e) => setForm({ ...form, openingBalance: Number(e.target.value) })}
        />

        <Select
          label="Status"
          value={form.status}
          disabled={readOnly}
          options={[
            { label: "Active", value: "Active" },
            { label: "Inactive", value: "Inactive" },
          ]}
          onChange={(e) => setForm({ ...form, status: e.target.value as BankAccount["status"] })}
        />

        {mode === "view" && account && (
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <span>Status:</span>
            <Badge variant={account.status === "Active" ? "success" : "neutral"}>{account.status}</Badge>
          </div>
        )}
      </div>
    </Modal>
  );
}