import { useEffect, useState } from "react";
import Modal from "../ui/modal/Modal";
import Input from "../ui/input/Input";
import Select from "../ui/select/Select";
import Button from "../ui/button/Button";
import Badge from "../ui/others/Badge";
import PaymentSection from "../payment/PaymentSection";
import type { Income, IncomeCategory, IncomeStatus } from "../../types/income";
import type { PaymentData } from "../../types/payment";

interface IncomeFormModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: (income: Income) => void;
  income: Income | null; // null = create
  mode: "create" | "edit" | "view";
  categories: IncomeCategory[];
}

const statusVariant: Record<IncomeStatus, "success" | "warning" | "danger"> = {
  Approved: "success",
  Pending: "warning",
  Cancelled: "danger",
};

const emptyForm = {
  categoryId: "",
  description: "",
  amount: 0,
  date: new Date().toISOString().slice(0, 10),
};

export default function IncomeFormModal({ open, onClose, onSaved, income, mode, categories }: IncomeFormModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [approveNow, setApproveNow] = useState(false);
  const [payment, setPayment] = useState<PaymentData | null>({ method: "CASH", cash_id: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const readOnly = mode === "view";

  useEffect(() => {
    if (!open) return;
    if (income) {
      setForm({
        categoryId: income.categoryId,
        description: income.description,
        amount: income.amount,
        date: income.date,
      });
      setApproveNow(income.status === "Approved");
      setPayment(income.payment ?? { method: "CASH", cash_id: "" });
    } else {
      setForm(emptyForm);
      setApproveNow(false);
      setPayment({ method: "CASH", cash_id: "" });
    }
    setErrors({});
  }, [open, income]);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.categoryId) next.categoryId = "Select a category";
    if (!form.description.trim()) next.description = "Description is required";
    if (!form.amount || form.amount <= 0) next.amount = "Amount must be greater than 0";
    if (!form.date) next.date = "Date is required";

    if (approveNow && payment) {
      if (payment.method === "CASH" && !payment.cash_id) next.cash_id = "Select a cash account";
      if (payment.method === "BANK") {
        if (!payment.bank_account_id) next.bank_account_id = "Select a bank account";
        if (!payment.payer_name?.trim()) next.payer_name = "Payer name is required";
      }
      if (payment.method === "CHEQUE") {
        if (!payment.bank_account_id) next.bank_account_id = "Select a bank account";
        if (!payment.cheque_no.trim()) next.cheque_no = "Cheque number is required";
        if (!payment.cheque_date) next.cheque_date = "Cheque date is required";
        if (!payment.payer_name?.trim()) next.payer_name = "Payer name is required";
      }
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (readOnly) return onClose();
    if (!validate()) return;

    setSaving(true);
    try {
      // TODO: replace with real API call (POST for create, PATCH for edit/approve)
      await new Promise((r) => setTimeout(r, 700));

      const category = categories.find((c) => c.id === form.categoryId);

      const saved: Income = {
        id: income?.id ?? crypto.randomUUID(),
        categoryId: form.categoryId,
        categoryName: category?.name ?? "",
        description: form.description,
        amount: form.amount,
        date: form.date,
        status: approveNow ? "Approved" : "Pending",
        payment: approveNow ? payment : null,
        createdAt: income?.createdAt ?? new Date().toISOString(),
      };
      onSaved(saved);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const titleMap = { create: "Create Income", edit: "Edit / Approve Income", view: "Income Details" };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={titleMap[mode]}
      size="lg"
      scrollable
      closeOnOverlayClick={false}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            {readOnly ? "Close" : "Cancel"}
          </Button>
          {!readOnly && (
            <Button onClick={handleSubmit} loading={saving}>
              {mode === "create" ? (approveNow ? "Create & Approve" : "Create Income") : approveNow ? "Approve Income" : "Save Changes"}
            </Button>
          )}
        </>
      }
    >
      <div className="flex flex-col gap-4">
        {mode === "view" && income && (
          <div className="flex items-center justify-between rounded-lg bg-background px-3 py-2">
            <span className="text-xs text-text-muted">Status</span>
            <Badge variant={statusVariant[income.status]}>{income.status}</Badge>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Category"
            value={form.categoryId}
            disabled={readOnly}
            error={errors.categoryId}
            options={categories.map((c) => ({ label: c.name, value: c.id }))}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          />
          <Input
            label="Date"
            type="date"
            value={form.date}
            disabled={readOnly}
            error={errors.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </div>

        <Input
          label="Description"
          value={form.description}
          disabled={readOnly}
          error={errors.description}
          placeholder="e.g. Product sale - August"
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        {!readOnly && (
          <label className="flex w-fit cursor-pointer items-center gap-2 text-sm text-secondary">
            <input
              type="checkbox"
              checked={approveNow}
              onChange={(e) => setApproveNow(e.target.checked)}
              className="h-4 w-4 rounded border-border-dark text-primary accent-primary"
            />
            Approve now (select where the money went)
          </label>
        )}

        {approveNow ? (
          <PaymentSection
            allowedMethods={["CASH", "BANK", "CHEQUE"]}
            value={payment}
            onChange={setPayment}
            amount={form.amount}
            onAmountChange={(amount) => setForm({ ...form, amount })}
            disabled={readOnly}
            errors={errors}
          />
        ) : (
          <Input
            label="Amount"
            type="number"
            value={form.amount || ""}
            disabled={readOnly}
            error={errors.amount}
            onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
          />
        )}
      </div>
    </Modal>
  );
}