import { useEffect, useState } from "react";
import Modal from "../ui/modal/Modal";
import Input from "../ui/input/Input";
import Select from "../ui/select/Select";
import Button from "../ui/button/Button";
import Badge from "../ui/others/Badge";
import type { Employee } from "../../types/employee";
import type { SalaryType } from "../../types/salary";

interface EmployeeFormModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: (employee: Employee) => void;
  employee: Employee | null; // null = create
  mode: "create" | "edit" | "view";
}

// Add another salary type here later, e.g. { label: "Hourly Based", value: "hourly" }
const salaryTypeOptions: { label: string; value: SalaryType }[] = [
  { label: "Basic Salary Based", value: "basic" },
  { label: "Day Salary Based", value: "day" },
];

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  designation: "",
  salaryType: "basic" as SalaryType,
  basicSalary: 0,
  dayRate: 0,
  joinedDate: new Date().toISOString().slice(0, 10),
};

export default function EmployeeFormModal({ open, onClose, onSaved, employee, mode }: EmployeeFormModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const readOnly = mode === "view";

  useEffect(() => {
    if (!open) return;
    if (employee) {
      setForm({
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        designation: employee.designation,
        salaryType: employee.salaryType,
        basicSalary: employee.basicSalary,
        dayRate: employee.dayRate,
        joinedDate: employee.joinedDate,
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [open, employee]);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!form.email.trim()) next.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Invalid email format";
    if (!form.phone.trim()) next.phone = "Phone is required";
    if (!form.designation.trim()) next.designation = "Designation is required";
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

      const saved: Employee = {
        id: employee?.id ?? crypto.randomUUID(),
        name: form.name,
        email: form.email,
        phone: form.phone,
        designation: form.designation,
        salaryType: form.salaryType,
        basicSalary: form.basicSalary,
        dayRate: form.dayRate,
        joinedDate: form.joinedDate,
        active: employee?.active ?? true,
        createdAt: employee?.createdAt ?? new Date().toISOString(),
      };
      onSaved(saved);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const titleMap = { create: "Add Employee", edit: "Edit Employee", view: "Employee Details" };

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
              {mode === "create" ? "Create Employee" : "Save Changes"}
            </Button>
          )}
        </>
      }
    >
      <div className="flex flex-col gap-4">
        {mode === "view" && employee && (
          <div className="flex items-center justify-between rounded-lg bg-background px-3 py-2">
            <span className="text-xs text-text-muted">Status</span>
            <Badge variant={employee.active ? "success" : "neutral"}>
              {employee.active ? "Active" : "Inactive"}
            </Badge>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Full Name"
            value={form.name}
            disabled={readOnly}
            error={errors.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            label="Designation"
            value={form.designation}
            disabled={readOnly}
            error={errors.designation}
            onChange={(e) => setForm({ ...form, designation: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Email"
            type="email"
            value={form.email}
            disabled={readOnly}
            error={errors.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Input
            label="Phone"
            value={form.phone}
            disabled={readOnly}
            error={errors.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Salary Type"
            value={form.salaryType}
            disabled={readOnly}
            options={salaryTypeOptions}
            onChange={(e) => setForm({ ...form, salaryType: e.target.value as SalaryType })}
          />
          <Input
            label="Joined Date"
            type="date"
            value={form.joinedDate}
            disabled={readOnly}
            onChange={(e) => setForm({ ...form, joinedDate: e.target.value })}
          />
        </div>

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
      </div>
    </Modal>
  );
}