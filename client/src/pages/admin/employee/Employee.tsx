import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Eye, Search, Users as UsersIcon } from "lucide-react";
import type { Column } from "../../../components/ui/table/DataTable";
import Badge from "../../../components/ui/others/Badge";
import StatusToggle from "../../../components/ui/others/StatusToggle";
import PageContainer from "../../../layout/PageContainer";
import Button from "../../../components/ui/button/Button";
import Input from "../../../components/ui/input/Input";
import DetailsTable from "../../../components/ui/table/DetailsTable";
import EmployeeFormModal from "../../../components/employee/EmployeeFormModal";
import type { Employee as EmployeeType } from "../../../types/employee";

const salaryTypeVariant: Record<EmployeeType["salaryType"], "info" | "neutral"> = {
  basic: "info",
  day: "neutral",
};

const Employee = () => {
  const [employees, setEmployees] = useState<EmployeeType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">("create");
  const [activeEmployee, setActiveEmployee] = useState<EmployeeType | null>(null);

  useEffect(() => {
    // TODO: replace with real API call e.g. GET /api/employees
    setTimeout(() => {
      setEmployees([
        {
          id: "E01",
          name: "Sunil Perera",
          email: "sunil@company.lk",
          phone: "0771234567",
          designation: "Store Manager",
          salaryType: "basic",
          basicSalary: 75000,
          dayRate: 0,
          joinedDate: "2023-04-10",
          active: true,
          createdAt: "2023-04-10",
        },
        {
          id: "E02",
          name: "Kamal Fernando",
          email: "kamal@company.lk",
          phone: "0719876543",
          designation: "Sales Executive",
          salaryType: "basic",
          basicSalary: 55000,
          dayRate: 0,
          joinedDate: "2024-01-15",
          active: true,
          createdAt: "2024-01-15",
        },
        {
          id: "E03",
          name: "Nadeesha Silva",
          email: "nadeesha@company.lk",
          phone: "0765554321",
          designation: "Warehouse Staff",
          salaryType: "day",
          basicSalary: 0,
          dayRate: 2200,
          joinedDate: "2024-06-02",
          active: false,
          createdAt: "2024-06-02",
        },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return employees;
    return employees.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.phone.includes(q) ||
        e.designation.toLowerCase().includes(q)
    );
  }, [employees, search]);

  const openCreate = () => {
    setActiveEmployee(null);
    setModalMode("create");
    setModalOpen(true);
  };

  const openEdit = (employee: EmployeeType) => {
    setActiveEmployee(employee);
    setModalMode("edit");
    setModalOpen(true);
  };

  const openView = (employee: EmployeeType) => {
    setActiveEmployee(employee);
    setModalMode("view");
    setModalOpen(true);
  };

  const handleSaved = (saved: EmployeeType) => {
    setEmployees((prev) => {
      const exists = prev.some((e) => e.id === saved.id);
      return exists ? prev.map((e) => (e.id === saved.id ? saved : e)) : [saved, ...prev];
    });
  };

  const handleStatusChange = async (employee: EmployeeType, next: boolean) => {
    // optimistic update
    setEmployees((prev) => prev.map((e) => (e.id === employee.id ? { ...e, active: next } : e)));
    // TODO: replace with real API call e.g. PATCH /api/employees/:id { active: next }
  };

  const columns: Column<EmployeeType>[] = [
    { key: "name", header: "Name", sortable: true },
    { key: "designation", header: "Designation", sortable: true },
    { key: "phone", header: "Phone" },
    {
      key: "salaryType",
      header: "Salary Type",
      render: (row) => (
        <Badge variant={salaryTypeVariant[row.salaryType]}>{row.salaryType === "basic" ? "Basic" : "Day"}</Badge>
      ),
    },
    {
      key: "active",
      header: "Status",
      render: (row) => <StatusToggle active={row.active} onChange={(next) => handleStatusChange(row, next)} />,
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
            className="rounded-lg p-1.5 text-text-muted hover:bg-background hover:text-secondary"
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
      title="Employees"
      subtitle="Manage employee records and salary setup"
      breadcrumbs={[{ label: "Employees" }]}
      icon={<UsersIcon className="h-5 w-5" />}
      actions={
        <Button icon={<Plus className="h-4 w-4" />} onClick={openCreate}>
          Add Employee
        </Button>
      }
    >
      <div className="mb-4 max-w-xs">
        <Input
          placeholder="Search by name, email, phone, designation..."
          icon={<Search className="h-4 w-4" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <DetailsTable
        columns={columns}
        data={filtered}
        rowKey="id"
        loading={loading}
        renderDetails={(row) => (
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm sm:grid-cols-4">
            <div>
              <p className="text-xs text-text-muted">Employee ID</p>
              <p className="text-text">{row.id}</p>
            </div>
            <div>
              <p className="text-xs text-text-muted">Email</p>
              <p className="text-text">{row.email}</p>
            </div>
            <div>
              <p className="text-xs text-text-muted">
                {row.salaryType === "basic" ? "Basic Salary" : "Day Rate"}
              </p>
              <p className="text-text">
                {(row.salaryType === "basic" ? row.basicSalary : row.dayRate).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
            <div>
              <p className="text-xs text-text-muted">Joined</p>
              <p className="text-text">{row.joinedDate}</p>
            </div>
          </div>
        )}
      />

      <EmployeeFormModal
        open={modalOpen}
        mode={modalMode}
        employee={activeEmployee}
        onClose={() => setModalOpen(false)}
        onSaved={handleSaved}
      />
    </PageContainer>
  );
};

export default Employee;