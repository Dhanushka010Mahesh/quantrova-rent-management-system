import { useEffect, useMemo, useState } from "react";
import { Plus, Eye, Pencil, Search, CalendarCheck } from "lucide-react";
import type { AttendanceRecord, AttendanceStatus } from "../../../types/attendance";
import type { Column } from "../../../components/ui/table/DataTable";
import Badge from "../../../components/ui/others/Badge";
import PageContainer from "../../../layout/PageContainer";
import Button from "../../../components/ui/button/Button";
import Input from "../../../components/ui/input/Input";
import DataTable from "../../../components/ui/table/DataTable";
import AttendanceFormModal from "../../../components/employee/AttendanceFormModal";
// import type { Column } from "../../components/ui/table/DataTable";
// import type { AttendanceRecord, AttendanceStatus } from "../../types/attendance";
// import Badge from "../../components/ui/others/Badge";
// import PageContainer from "../../layout/PageContainer";
// import Button from "../../components/ui/button/Button";
// import Input from "../../components/ui/input/Input";
// import DataTable from "../../components/ui/table/DataTable";
// import AttendanceFormModal from "../../components/attendance/AttendanceFormModal";

const statusVariant: Record<AttendanceStatus, "warning" | "success" | "danger"> = {
  Pending: "warning",
  Approved: "success",
  Rejected: "danger",
};

const statusOptions: { label: string; value: AttendanceStatus }[] = [
  { label: "Pending", value: "Pending" },
  { label: "Approved", value: "Approved" },
  { label: "Rejected", value: "Rejected" },
];

const Attendance = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">("create");
  const [activeRecord, setActiveRecord] = useState<AttendanceRecord | null>(null);

  useEffect(() => {
    // TODO: replace with real API call e.g. GET /api/attendance
    setTimeout(() => {
      setRecords([
        {
          id: "AT001",
          employeeId: "E01",
          employeeName: "Sunil Perera",
          designation: "Store Manager",
          month: "2026-07",
          presentDays: 26,
          expectedDays: 26,
          otDays: 3,
          leaveDays: 0,
          status: "Approved",
          createdAt: "2026-07-28",
        },
        {
          id: "AT002",
          employeeId: "E03",
          employeeName: "Nadeesha Silva",
          designation: "Warehouse Staff",
          month: "2026-08",
          presentDays: 22,
          expectedDays: 24,
          otDays: 1,
          leaveDays: 2,
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

  const openEdit = (record: AttendanceRecord) => {
    if (record.status !== "Pending") return; // locked once approved/rejected
    setActiveRecord(record);
    setModalMode("edit");
    setModalOpen(true);
  };

  const openView = (record: AttendanceRecord) => {
    setActiveRecord(record);
    setModalMode("view");
    setModalOpen(true);
  };

  const handleSaved = (saved: AttendanceRecord) => {
    setRecords((prev) => {
      const exists = prev.some((r) => r.id === saved.id);
      return exists ? prev.map((r) => (r.id === saved.id ? saved : r)) : [saved, ...prev];
    });
  };

  const handleStatusChange = async (record: AttendanceRecord, next: AttendanceStatus) => {
    if (record.status !== "Pending") return; // approved/rejected records can't be changed again
    setRecords((prev) => prev.map((r) => (r.id === record.id ? { ...r, status: next } : r)));
    // TODO: replace with real API call e.g. PATCH /api/attendance/:id { status: next }
  };

  const columns: Column<AttendanceRecord>[] = [
    { key: "employeeName", header: "Employee", sortable: true },
    { key: "designation", header: "Designation" },
    { key: "month", header: "Month", sortable: true },
    { key: "expectedDays", header: "Expected" },
    { key: "presentDays", header: "Present" },
    { key: "otDays", header: "OT Days" },
    { key: "leaveDays", header: "Leave" },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <div onClick={(e) => e.stopPropagation()} className="w-32">
          {row.status === "Pending" ? (
            <select
              value={row.status}
              onChange={(e) => handleStatusChange(row, e.target.value as AttendanceStatus)}
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
      title="Attendance"
      subtitle="Mark and manage monthly employee attendance"
      breadcrumbs={[{ label: "Payroll" }, { label: "Attendance" }]}
      icon={<CalendarCheck className="h-5 w-5" />}
      actions={
        <Button icon={<Plus className="h-4 w-4" />} onClick={openCreate}>
          Create Attendance
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

      <AttendanceFormModal
        open={modalOpen}
        mode={modalMode}
        record={activeRecord}
        onClose={() => setModalOpen(false)}
        onSaved={handleSaved}
      />
    </PageContainer>
  );
};

export default Attendance;