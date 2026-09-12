import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { mockAdvances, type AdvanceRecord } from "../../../types/advance";
import { mockEmployees } from "../../../components/salary/LineItemEditor";
import PageContainer from "../../../layout/PageContainer";
import Select from "../../../components/ui/select/Select";
import Input from "../../../components/ui/input/Input";
import Button from "../../../components/ui/button/Button";
import Badge from "../../../components/ui/others/Badge";
import DataTable, { type Column } from "../../../components/ui/table/DataTable";

const emptyForm = {
  amount: 0,
  reason: "",
  date: new Date().toISOString().slice(0, 10),
};

const AdvanceCreate = () => {
  const [advances, setAdvances] = useState<AdvanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const [employeeId, setEmployeeId] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // TODO: replace with real API call e.g. GET /api/advances
    setTimeout(() => {
      setAdvances(mockAdvances);
      setLoading(false);
    }, 600);
  }, []);

  const selectedEmployee = mockEmployees.find((e) => e.id === employeeId) ?? null;

  const employeeAdvances = useMemo(
    () =>
      advances
        .filter((a) => a.employeeId === employeeId)
        .sort((a, b) => (a.date < b.date ? 1 : -1)),
    [advances, employeeId]
  );

  const summary = useMemo(() => {
    const total = employeeAdvances.reduce((sum, a) => sum + a.amount, 0);
    return {
      total,
      count: employeeAdvances.length,
      lastDate: employeeAdvances[0]?.date ?? "—",
    };
  }, [employeeAdvances]);

  const handleEmployeeSelect = (id: string) => {
    setEmployeeId(id);
    setForm(emptyForm);
    setErrors({});
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!employeeId) next.employeeId = "Select an employee";
    if (!form.amount || form.amount <= 0) next.amount = "Amount must be greater than 0";
    if (!form.reason.trim()) next.reason = "Reason is required";
    if (!form.date) next.date = "Date is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate() || !selectedEmployee) return;

    setSaving(true);
    try {
      // TODO: replace with real API call e.g. POST /api/advances
      await new Promise((r) => setTimeout(r, 700));

      const newRecord: AdvanceRecord = {
        id: crypto.randomUUID(),
        employeeId: selectedEmployee.id,
        employeeName: selectedEmployee.name,
        designation: selectedEmployee.designation,
        amount: form.amount,
        reason: form.reason,
        date: form.date,
        createdAt: new Date().toISOString(),
      };

      setAdvances((prev) => [newRecord, ...prev]);
      setForm(emptyForm);
    } finally {
      setSaving(false);
    }
  };

  const columns: Column<AdvanceRecord>[] = [
    { key: "date", header: "Date", sortable: true },
    { key: "reason", header: "Reason" },
    {
      key: "amount",
      header: "Amount",
      render: (row) => (
        <span className="font-medium text-secondary">
          {row.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      ),
    },
  ];

  return (
    <PageContainer
      title="Create Advance"
      subtitle="Issue a salary advance and review an employee's advance history"
      breadcrumbs={[{ label: "Payroll" }, { label: "Advance" }]}
    //   icon={<HandCoins className="h-5 w-5" />}
    >
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        {/* Left: form */}
        <div className="rounded-xl border border-border bg-surface p-4 lg:col-span-2">
          <p className="mb-3 text-sm font-semibold text-secondary">New Advance</p>

          <div className="flex flex-col gap-3.5">
            <Select
              label="Employee"
              value={employeeId}
              error={errors.employeeId}
              options={mockEmployees.map((e) => ({ label: `${e.name} — ${e.designation}`, value: e.id }))}
              onChange={(e) => handleEmployeeSelect(e.target.value)}
            />

            <Input label="Designation" value={selectedEmployee?.designation ?? ""} disabled />

            <Input
              label="Advance Amount"
              type="number"
              value={form.amount || ""}
              disabled={!employeeId}
              error={errors.amount}
              onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
            />

            <Input
              label="Reason"
              value={form.reason}
              disabled={!employeeId}
              error={errors.reason}
              placeholder="e.g. Medical emergency"
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
            />

            <Input
              label="Date"
              type="date"
              value={form.date}
              disabled={!employeeId}
              error={errors.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />

            <Button
              icon={<Plus className="h-4 w-4" />}
              disabled={!employeeId}
              loading={saving}
              onClick={handleSubmit}
            >
              Create Advance
            </Button>
          </div>
        </div>

        {/* Right: employee summary + history */}
        <div className="flex flex-col gap-4 lg:col-span-3">
          {!employeeId ? (
            <div className="flex h-full min-h-[240px] items-center justify-center rounded-xl border border-dashed border-border bg-background text-center text-sm text-text-muted">
              Select an employee to view their advance summary
            </div>
          ) : (
            <>
              <div className="rounded-xl border border-border bg-surface p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-secondary">{selectedEmployee?.name}</p>
                    <p className="text-xs text-text-muted">{selectedEmployee?.designation}</p>
                  </div>
                  <Badge variant={selectedEmployee?.salaryType === "basic" ? "info" : "neutral"}>
                    {selectedEmployee?.salaryType === "basic" ? "Basic Salary" : "Day Salary"}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg bg-background px-3 py-2.5">
                    <p className="text-xs text-text-muted">Total Advances</p>
                    <p className="mt-0.5 text-lg font-semibold text-primary-dark">
                      {summary.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="rounded-lg bg-background px-3 py-2.5">
                    <p className="text-xs text-text-muted">No. of Advances</p>
                    <p className="mt-0.5 text-lg font-semibold text-secondary">{summary.count}</p>
                  </div>
                  <div className="rounded-lg bg-background px-3 py-2.5">
                    <p className="text-xs text-text-muted">Last Advance</p>
                    <p className="mt-0.5 text-lg font-semibold text-secondary">{summary.lastDate}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-surface p-4">
                <p className="mb-3 text-sm font-semibold text-secondary">Advance History</p>
                <DataTable
                  columns={columns}
                  data={employeeAdvances}
                  loading={loading}
                  rowKey="id"
                  pageSize={5}
                //   emptyText="No advances given to this employee yet."
                />
              </div>
            </>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default AdvanceCreate;