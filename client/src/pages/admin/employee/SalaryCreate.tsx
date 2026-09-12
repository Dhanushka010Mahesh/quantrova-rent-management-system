import { useEffect, useMemo, useState } from "react";
import { Plus, Eye, Pencil, Search } from "lucide-react";
import Badge from "../../../components/ui/others/Badge";
import PageContainer from "../../../layout/PageContainer";
import Button from "../../../components/ui/button/Button";
import Input from "../../../components/ui/input/Input";
import DataTable, { type Column } from "../../../components/ui/table/DataTable";
import SalaryFormModal from "../../../components/salary/SalaryFormModal";
import type { SalaryRecord, SalaryStatus } from "../../../types/salary";

const statusVariant: Record<SalaryStatus, "warning" | "success" | "danger"> = {
  Pending: "warning",
  Approved: "success",
  Rejected: "danger",
};

const statusOptions: { label: string; value: SalaryStatus }[] = [
  { label: "Pending", value: "Pending" },
  { label: "Approved", value: "Approved" },
  { label: "Rejected", value: "Rejected" },
];

const SalaryCreate = () => {
  const [records, setRecords] = useState<SalaryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">("create");
  const [activeRecord, setActiveRecord] = useState<SalaryRecord | null>(null);

  useEffect(() => {
    // TODO: replace with real API call e.g. GET /api/salaries
    setTimeout(() => {
      setRecords([
        {
          id: "S001",
          employeeId: "E01",
          employeeName: "Sunil Perera",
          designation: "Store Manager",
          month: "2026-07",
          salaryType: "basic",
          basicSalary: 75000,
          dayRate: 0,
          attendedDays: 26,
          attendedHours: 208,
          advance: 5000,
          allowances: [{ id: "a1", label: "Transport", amount: 5000 }],
          deductions: [{ id: "d1", label: "EPF", amount: 6000 }],
          grossAmount: 80000,
          netAmount: 69000,
          status: "Approved",
          createdAt: "2026-07-28",
        },
        {
          id: "S002",
          employeeId: "E03",
          employeeName: "Nadeesha Silva",
          designation: "Warehouse Staff",
          month: "2026-08",
          salaryType: "day",
          basicSalary: 0,
          dayRate: 2200,
          attendedDays: 22,
          attendedHours: 176,
          advance: 0,
          allowances: [],
          deductions: [{ id: "d2", label: "Late Deduction", amount: 1500 }],
          grossAmount: 48400,
          netAmount: 46900,
          status: "Pending",
          createdAt: "2026-08-27",
        },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return records;
    return records.filter(
      (r) => r.employeeName.toLowerCase().includes(q) || r.designation.toLowerCase().includes(q) || r.month.includes(q)
    );
  }, [records, search]);

  const openCreate = () => {
    setActiveRecord(null);
    setModalMode("create");
    setModalOpen(true);
  };

  const openEdit = (record: SalaryRecord) => {
    if (record.status !== "Pending") return; // locked once approved/rejected
    setActiveRecord(record);
    setModalMode("edit");
    setModalOpen(true);
  };

  const openView = (record: SalaryRecord) => {
    setActiveRecord(record);
    setModalMode("view");
    setModalOpen(true);
  };

  const handleSaved = (saved: SalaryRecord) => {
    setRecords((prev) => {
      const exists = prev.some((r) => r.id === saved.id);
      return exists ? prev.map((r) => (r.id === saved.id ? saved : r)) : [saved, ...prev];
    });
  };

  const handleStatusChange = async (record: SalaryRecord, next: SalaryStatus) => {
    if (record.status !== "Pending") return; // approved/rejected records can't be changed again
    setRecords((prev) => prev.map((r) => (r.id === record.id ? { ...r, status: next } : r)));
    // TODO: replace with real API call e.g. PATCH /api/salaries/:id { status: next }
  };

  const columns: Column<SalaryRecord>[] = [
    { key: "employeeName", header: "Employee", sortable: true },
    { key: "designation", header: "Designation" },
    { key: "month", header: "Month", sortable: true },
    {
      key: "salaryType",
      header: "Type",
      render: (row) => (
        <Badge variant={row.salaryType === "basic" ? "info" : "neutral"}>
          {row.salaryType === "basic" ? "Basic" : "Day"}
        </Badge>
      ),
    },
    {
      key: "netAmount",
      header: "Net Amount",
      render: (row) => (
        <span className="font-medium text-secondary">
          {row.netAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <div onClick={(e) => e.stopPropagation()} className="w-32">
          {row.status === "Pending" ? (
            <select
              value={row.status}
              onChange={(e) => handleStatusChange(row, e.target.value as SalaryStatus)}
              className="w-full rounded-md border border-border bg-surface px-2 py-1 text-xs font-medium text-text outline-none focus:ring-1 focus:ring-primary"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <Badge variant={statusVariant[row.status]}>{row.status}</Badge>
          )}
        </div>
      ),
    },
    {
      key: "id",
      header: "Actions",
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openView(row);
            }}
            className="rounded-lg p-1.5 text-text-muted hover:bg-background hover:text-secondary"
            aria-label="View"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              openEdit(row);
            }}
            disabled={row.status !== "Pending"}
            className="rounded-lg p-1.5 text-text-muted hover:bg-background hover:text-secondary disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
            aria-label="Edit"
          >
            <Pencil className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <PageContainer
      title="Salary Records"
      subtitle="Create and manage employee salary records"
      breadcrumbs={[{ label: "Payroll" }, { label: "Salary" }]}
    //   icon={<Wallet className="h-5 w-5" />}
      actions={
        <Button icon={<Plus className="h-4 w-4" />} onClick={openCreate}>
          Create Salary
        </Button>
      }
    >
      <div className="mb-4 max-w-xs">
        <Input
          placeholder="Search by employee, designation, month..."
          icon={<Search className="h-4 w-4" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <DataTable columns={columns} data={filtered} loading={loading} rowKey="id" pageSize={10} />

      <SalaryFormModal
        open={modalOpen}
        mode={modalMode}
        record={activeRecord}
        onClose={() => setModalOpen(false)}
        onSaved={handleSaved}
      />
    </PageContainer>
  );
};

export default SalaryCreate;