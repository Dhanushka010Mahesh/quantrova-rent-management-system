import { useEffect, useState } from "react";
import Modal from "../ui/modal/Modal";
import Input from "../ui/input/Input";
import Select from "../ui/select/Select";
import Button from "../ui/button/Button";
import Badge from "../ui/others/Badge";
// import { mockEmployees } from "../../data/mockEmployees";
import type { AttendanceRecord } from "../../types/attendance";
import { mockEmployees } from "../salary/LineItemEditor";

interface AttendanceFormModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: (record: AttendanceRecord) => void;
  record: AttendanceRecord | null; // null = create
  mode: "create" | "edit" | "view";
}

const statusVariant: Record<AttendanceRecord["status"], "warning" | "success" | "danger"> = {
  Pending: "warning",
  Approved: "success",
  Rejected: "danger",
};

const emptyForm = {
  employeeId: "",
  employeeName: "",
  designation: "",
  month: new Date().toISOString().slice(0, 7),
  presentDays: 0,
  expectedDays: 0,
  otDays: 0,
  leaveDays: 0,
};

export default function AttendanceFormModal({ open, onClose, onSaved, record, mode }: AttendanceFormModalProps) {
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
        presentDays: record.presentDays,
        expectedDays: record.expectedDays,
        otDays: record.otDays,
        leaveDays: record.leaveDays,
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
    }));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.employeeId) next.employeeId = "Select an employee";
    if (!form.month) next.month = "Month is required";
    if (form.expectedDays <= 0) next.expectedDays = "Expected days must be greater than 0";
    if (form.presentDays < 0) next.presentDays = "Present days can't be negative";
    if (form.presentDays > form.expectedDays + form.otDays)
      next.presentDays = "Present days can't exceed expected + OT days";
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

      const saved: AttendanceRecord = {
        id: record?.id ?? crypto.randomUUID(),
        employeeId: form.employeeId,
        employeeName: form.employeeName,
        designation: form.designation,
        month: form.month,
        presentDays: form.presentDays,
        expectedDays: form.expectedDays,
        otDays: form.otDays,
        leaveDays: form.leaveDays,
        status: record?.status ?? "Pending",
        createdAt: record?.createdAt ?? new Date().toISOString(),
      };
      onSaved(saved);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const titleMap = { create: "Mark Attendance", edit: "Edit Attendance", view: "Attendance Details" };

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
              {mode === "create" ? "Create Attendance" : "Save Changes"}
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

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Expected Working Days"
            type="number"
            value={form.expectedDays || ""}
            disabled={readOnly}
            error={errors.expectedDays}
            onChange={(e) => setForm({ ...form, expectedDays: Number(e.target.value) })}
          />
          <Input
            label="Present Days"
            type="number"
            value={form.presentDays || ""}
            disabled={readOnly}
            error={errors.presentDays}
            onChange={(e) => setForm({ ...form, presentDays: Number(e.target.value) })}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="OT Days"
            type="number"
            value={form.otDays || ""}
            disabled={readOnly}
            onChange={(e) => setForm({ ...form, otDays: Number(e.target.value) })}
          />
          <Input
            label="Leave Days"
            type="number"
            value={form.leaveDays || ""}
            disabled={readOnly}
            onChange={(e) => setForm({ ...form, leaveDays: Number(e.target.value) })}
          />
        </div>

        <div className="rounded-lg border border-border bg-secondary/5 p-3">
          <div className="flex justify-between text-sm text-text-muted">
            <span>Expected Days</span>
            <span>{form.expectedDays}</span>
          </div>
          <div className="flex justify-between text-sm text-text-muted">
            <span>Present Days</span>
            <span>{form.presentDays}</span>
          </div>
          <div className="flex justify-between text-sm text-text-muted">
            <span>OT Days</span>
            <span>{form.otDays}</span>
          </div>
          <div className="flex justify-between text-sm text-text-muted">
            <span>Leave Days</span>
            <span>{form.leaveDays}</span>
          </div>
          <div className="mt-1 flex justify-between border-t border-border pt-1.5 text-base font-semibold text-primary-dark">
            <span>Attendance Rate</span>
            <span>
              {form.expectedDays > 0 ? Math.round((form.presentDays / form.expectedDays) * 100) : 0}%
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
}