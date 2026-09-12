import { useEffect, useState } from "react";
import Modal from "../ui/modal/Modal";
import Input from "../ui/input/Input";
import Select from "../ui/select/Select";
import Button from "../ui/button/Button";
import Badge from "../ui/others/Badge";
import PaymentSection from "../payment/PaymentSection";
import type { Expense, ExpenseCategory, ExpenseStatus } from "../../types/expense";
import type { PaymentData } from "../../types/payment";

interface ExpenseFormModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: (expense: Expense) => void;
  expense: Expense | null; // null = create
  mode: "create" | "edit" | "view";
  categories: ExpenseCategory[];
}

const statusVariant: Record<ExpenseStatus, "success" | "warning" | "danger"> = {
  Approved: "success",
  Pending: "warning",
  Cancelled: "danger",
};

const emptyForm = {
  categoryId: "",
  description: "",
  amount: 0,
  date: new Date().toISOString().slice(0, 10),
  status: "Approved" as ExpenseStatus,
};

export default function ExpenseFormModal({ open, onClose, onSaved, expense, mode, categories }: ExpenseFormModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [payment, setPayment] = useState<PaymentData | null>({ method: "CASH", cash_id: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const readOnly = mode === "view";

  useEffect(() => {
    if (!open) return;
    if (expense) {
      setForm({
        categoryId: expense.categoryId,
        description: expense.description,
        amount: expense.amount,
        date: expense.date,
        status: expense.status === "Cancelled" ? "Pending" : expense.status,
      });
      setPayment(expense.payment ?? { method: "CASH", cash_id: "" });
    } else {
      setForm(emptyForm);
      setPayment({ method: "CASH", cash_id: "" });
    }
    setErrors({});
  }, [open, expense]);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.categoryId) next.categoryId = "Select a category";
    if (!form.description.trim()) next.description = "Description is required";
    if (!form.amount || form.amount <= 0) next.amount = "Amount must be greater than 0";
    if (!form.date) next.date = "Date is required";

    if (form.status === "Approved" && payment) {
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
    }

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

      const category = categories.find((c) => c.id === form.categoryId);

      const saved: Expense = {
        id: expense?.id ?? crypto.randomUUID(),
        categoryId: form.categoryId,
        categoryName: category?.name ?? "",
        description: form.description,
        amount: form.amount,
        date: form.date,
        status: form.status,
        payment: form.status === "Approved" ? payment : null,
        createdAt: expense?.createdAt ?? new Date().toISOString(),
      };
      onSaved(saved);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const titleMap = { create: "Create Expense", edit: "Edit Expense", view: "Expense Details" };

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
              {mode === "create" ? "Create Expense" : "Save Changes"}
            </Button>
          )}
        </>
      }
    >
      <div className="flex flex-col gap-4">
        {mode === "view" && expense && (
          <div className="flex items-center justify-between rounded-lg bg-background px-3 py-2">
            <span className="text-xs text-text-muted">Status</span>
            <Badge variant={statusVariant[expense.status]}>{expense.status}</Badge>
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
          placeholder="e.g. Electricity bill - August"
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <Select
          label="Status"
          value={form.status}
          disabled={readOnly || mode === "edit"}
          options={[
            { label: "Approved", value: "Approved" },
            { label: "Pending", value: "Pending" },
          ]}
          onChange={(e) => setForm({ ...form, status: e.target.value as ExpenseStatus })}
        />

        {form.status === "Approved" ? (
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