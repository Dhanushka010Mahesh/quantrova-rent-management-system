import { useEffect, useState } from "react";
import Modal from "../ui/modal/Modal";
import Input from "../ui/input/Input";
import Select from "../ui/select/Select";
import Button from "../ui/button/Button";
import Badge from "../ui/others/Badge";
import type { CashAccount } from "../../types/account";

interface CashAccountFormModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: (account: CashAccount) => void;
  account: CashAccount | null; // null = create
  mode: "create" | "edit" | "view";
}

const emptyForm = {
  name: "",
  holder: "",
  openingBalance: 0,
  status: "Active" as CashAccount["status"],
  notes: "",
};

export default function CashAccountFormModal({ open, onClose, onSaved, account, mode }: CashAccountFormModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const readOnly = mode === "view";

  useEffect(() => {
    if (!open) return;
    if (account) {
      setForm({
        name: account.name,
        holder: account.holder,
        openingBalance: account.openingBalance,
        status: account.status,
        notes: account.notes,
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [open, account]);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Account name is required";
    if (!form.holder.trim()) next.holder = "Account holder is required";
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

      const saved: CashAccount = {
        id: account?.id ?? crypto.randomUUID(),
        name: form.name,
        holder: form.holder,
        openingBalance: form.openingBalance,
        currentBalance: account ? account.currentBalance + balanceDelta : form.openingBalance,
        status: form.status,
        notes: form.notes,
        createdAt: account?.createdAt ?? new Date().toISOString(),
      };
      onSaved(saved);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const titleMap = { create: "Add Cash Account", edit: "Edit Cash Account", view: "Cash Account Details" };

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
          value={form.name}
          disabled={readOnly}
          error={errors.name}
          placeholder="e.g. Main Cash Drawer"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <Input
          label="Account Holder"
          value={form.holder}
          disabled={readOnly}
          error={errors.holder}
          placeholder="e.g. Sunil Perera"
          onChange={(e) => setForm({ ...form, holder: e.target.value })}
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
          onChange={(e) => setForm({ ...form, status: e.target.value as CashAccount["status"] })}
        />

        <Input
          label="Notes (optional)"
          value={form.notes}
          disabled={readOnly}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
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