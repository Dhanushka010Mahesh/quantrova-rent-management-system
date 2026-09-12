import { useEffect, useState } from "react";
import Modal from "../ui/modal/Modal";
import Input from "../ui/input/Input";
import Select from "../ui/select/Select";
import Button from "../ui/button/Button";
import Badge from "../ui/others/Badge";
import LineItemEditor, { mockEmployees } from "./LineItemEditor";
import type { SalaryRecord, SalaryLineItem, SalaryType } from "../../types/salary";

interface SalaryFormModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: (record: SalaryRecord) => void;
  record: SalaryRecord | null; // null = create
  mode: "create" | "edit" | "view";
}

// Add another salary type here later, e.g. { label: "Hourly Based", value: "hourly" }
const salaryTypeOptions: { label: string; value: SalaryType }[] = [
  { label: "Basic Salary Based", value: "basic" },
  { label: "Day Salary Based", value: "day" },
];

const statusVariant: Record<SalaryRecord["status"], "warning" | "success" | "danger"> = {
  Pending: "warning",
  Approved: "success",
  Rejected: "danger",
};

const emptyForm = {
  employeeId: "",
  employeeName: "",
  designation: "",
  month: new Date().toISOString().slice(0, 7),
  salaryType: "basic" as SalaryType,
  basicSalary: 0,
  dayRate: 0,
  attendedDays: 0,
  attendedHours: 0,
  advance: 0,
  allowances: [] as SalaryLineItem[],
  deductions: [] as SalaryLineItem[],
};

export default function SalaryFormModal({ open, onClose, onSaved, record, mode }: SalaryFormModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const readOnly = mode === "view";

  useEffect(() => {
    if (!open) return;
    if (record) {
      setForm({
        employeeId: record.employeeId,
        employeeName: record.employeeName,
        designation: record.designation,
        month: record.month,
        salaryType: record.salaryType,
        basicSalary: record.basicSalary,
        dayRate: record.dayRate,
        attendedDays: record.attendedDays,
        attendedHours: record.attendedHours,
        advance: record.advance,
        allowances: record.allowances,
        deductions: record.deductions,
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [open, record]);

  const handleEmployeeSelect = (employeeId: string) => {
    const emp = mockEmployees.find((e) => e.id === employeeId);
    if (!emp) return;
    setForm((f) => ({
      ...f,
      employeeId: emp.id,
      employeeName: emp.name,
      designation: emp.designation,
      salaryType: emp.salaryType,
      basicSalary: emp.basicSalary,
      dayRate: emp.dayRate,
      attendedDays: emp.attendedDays,
      attendedHours: emp.attendedHours,
    }));
  };

  const base = form.salaryType === "basic" ? form.basicSalary : form.dayRate * form.attendedDays;
  const allowanceTotal = form.allowances.reduce((s, a) => s + (Number(a.amount) || 0), 0);
  const deductionTotal = form.deductions.reduce((s, d) => s + (Number(d.amount) || 0), 0);
  const grossAmount = base + allowanceTotal;
  const netAmount = grossAmount - deductionTotal - (Number(form.advance) || 0);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.employeeId) next.employeeId = "Select an employee";
    if (!form.month) next.month = "Month is required";
    if (form.salaryType === "basic" && form.basicSalary <= 0) next.basicSalary = "Basic salary must be greater than 0";
    if (form.salaryType === "day" && form.dayRate <= 0) next.dayRate = "Day rate must be greater than 0";
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

      const saved: SalaryRecord = {
        id: record?.id ?? crypto.randomUUID(),
        employeeId: form.employeeId,
        employeeName: form.employeeName,
        designation: form.designation,
        month: form.month,
        salaryType: form.salaryType,
        basicSalary: form.basicSalary,
        dayRate: form.dayRate,
        attendedDays: form.attendedDays,
        attendedHours: form.attendedHours,
        advance: form.advance,
        allowances: form.allowances,
        deductions: form.deductions,
        grossAmount,
        netAmount,
        status: record?.status ?? "Pending",
        createdAt: record?.createdAt ?? new Date().toISOString(),
      };
      onSaved(saved);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const titleMap = { create: "Create Salary Record", edit: "Edit Salary Record", view: "Salary Details" };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="xl"
      scrollable={true}
      title={titleMap[mode]}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            {readOnly ? "Close" : "Cancel"}
          </Button>
          {!readOnly && (
            <Button onClick={handleSubmit} loading={saving}>
              {mode === "create" ? "Create Salary" : "Save Changes"}
            </Button>
          )}
        </>
      }
    >
      <div className="flex flex-col gap-4">
        {mode === "view" && record && (
          <div className="flex items-center justify-between rounded-lg bg-background px-3 py-2">
            <span className="text-xs text-text-muted">Status</span>
            <Badge variant={statusVariant[record.status]}>{record.status}</Badge>
          </div>
        )}

        <Select
          label="Employee"
          value={form.employeeId}
          disabled={readOnly || mode === "edit"}
          error={errors.employeeId}
          options={mockEmployees.map((e) => ({ label: `${e.name} — ${e.designation}`, value: e.id }))}
          onChange={(e) => handleEmployeeSelect(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input label="Designation" value={form.designation} disabled />
          <Input
            label="Month"
            type="month"
            value={form.month}
            disabled={readOnly}
            error={errors.month}
            onChange={(e) => setForm({ ...form, month: e.target.value })}
          />
        </div>

        <Select
          label="Salary Type"
          value={form.salaryType}
          disabled={readOnly}
          options={salaryTypeOptions}
          onChange={(e) => setForm({ ...form, salaryType: e.target.value as SalaryType })}
        />

        <div className="grid grid-cols-2 gap-3">
          {form.salaryType === "basic" ? (
            <Input
              label="Basic Salary"
              type="number"
              value={form.basicSalary}
              disabled={readOnly}
              error={errors.basicSalary}
              onChange={(e) => setForm({ ...form, basicSalary: Number(e.target.value) })}
            />
          ) : (
            <Input
              label="Day Rate"
              type="number"
              value={form.dayRate}
              disabled={readOnly}
              error={errors.dayRate}
              onChange={(e) => setForm({ ...form, dayRate: Number(e.target.value) })}
            />
          )}
          <Input
            label="Attended Days"
            type="number"
            value={form.attendedDays}
            disabled={readOnly}
            onChange={(e) => setForm({ ...form, attendedDays: Number(e.target.value) })}
          />
        </div>

        <Input
          label="Attended Hours (this month)"
          type="number"
          value={form.attendedHours}
          disabled={readOnly}
          onChange={(e) => setForm({ ...form, attendedHours: Number(e.target.value) })}
        />

        <Input
          label="Advance Deducted"
          type="number"
          value={form.advance}
          disabled={readOnly}
          onChange={(e) => setForm({ ...form, advance: Number(e.target.value) })}
        />

        <LineItemEditor
          title="Allowances"
          items={form.allowances}
          onChange={(items) => setForm({ ...form, allowances: items })}
          disabled={readOnly}
          accent="success"
        />

        <LineItemEditor
          title="Deductions"
          items={form.deductions}
          onChange={(items) => setForm({ ...form, deductions: items })}
          disabled={readOnly}
          accent="danger"
        />

        <div className="rounded-lg border border-border bg-secondary/5 p-3">
          <div className="flex justify-between text-sm text-text-muted">
            <span>Base ({form.salaryType === "basic" ? "Basic Salary" : "Day Rate × Days"})</span>
            <span>{base.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between text-sm text-text-muted">
            <span>+ Allowances</span>
            <span>{allowanceTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between border-t border-border/70 pt-1 text-sm font-medium text-secondary">
            <span>Gross Amount</span>
            <span>{grossAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between text-sm text-text-muted">
            <span>− Deductions</span>
            <span>{deductionTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between text-sm text-text-muted">
            <span>− Advance</span>
            <span>{(Number(form.advance) || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="mt-1 flex justify-between border-t border-border pt-1.5 text-base font-semibold text-primary-dark">
            <span>Net Salary</span>
            <span>{netAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}