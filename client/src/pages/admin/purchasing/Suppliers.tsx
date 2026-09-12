import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Eye,
  Pencil,
  Users,
  CheckCircle2,
  XCircle,
  Wallet,
  X,
  Building2,
} from "lucide-react";

import PageContainer from "../../../layout/PageContainer";
import Button from "../../../components/ui/button/Button";
import Input from "../../../components/ui/input/Input";
import StatusToggle from "../../../components/ui/others/StatusToggle";
import DetailsTable from "../../../components/ui/table/DetailsTable";
import type { Column } from "../../../components/ui/table/DataTable";

interface Supplier {
  id: string;
  code: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  payableBalance: number;
  active: boolean;
  createdAt: string;
}

const initialSuppliers: Supplier[] = [
  {
    id: "1",
    code: "SUP-001",
    name: "ABC Construction Supplies",
    contactPerson: "Sunil Perera",
    phone: "0771234567",
    email: "abc@company.lk",
    address: "Colombo 10",
    payableBalance: 125000,
    active: true,
    createdAt: "2026-01-08",
  },
  {
    id: "2",
    code: "SUP-002",
    name: "Lanka Hardware Traders",
    contactPerson: "Kamal Fernando",
    phone: "0719876543",
    email: "lankahardware@gmail.com",
    address: "Wattala",
    payableBalance: 78500,
    active: true,
    createdAt: "2026-01-18",
  },
  {
    id: "3",
    code: "SUP-003",
    name: "Prime Equipment Suppliers",
    contactPerson: "Nadeesha Silva",
    phone: "0765554321",
    email: "primeequipment@gmail.com",
    address: "Nugegoda",
    payableBalance: 245000,
    active: true,
    createdAt: "2026-02-02",
  },
  {
    id: "4",
    code: "SUP-004",
    name: "Metro Safety Solutions",
    contactPerson: "Kasun Perera",
    phone: "0754567890",
    email: "metro@company.lk",
    address: "Rajagiriya",
    payableBalance: 0,
    active: false,
    createdAt: "2026-02-15",
  },
  {
    id: "5",
    code: "SUP-005",
    name: "BuildPro Materials",
    contactPerson: "Amal Jayasinghe",
    phone: "0783456789",
    email: "buildpro@gmail.com",
    address: "Kelaniya",
    payableBalance: 98500,
    active: true,
    createdAt: "2026-03-05",
  },
];

const statusOptions = ["All Status", "Active", "Inactive"];

export default function Suppliers() {
  const [suppliers, setSuppliers] =
    useState<Supplier[]>(initialSuppliers);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Status");
  const [showFilters, setShowFilters] = useState(false);

  const [selectedSupplier, setSelectedSupplier] =
    useState<Supplier | null>(null);

  const [modalMode, setModalMode] = useState<
    "create" | "edit" | "view"
  >("create");

  const [modalOpen, setModalOpen] = useState(false);

  const filteredSuppliers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return suppliers.filter((supplier) => {
      const matchesSearch =
        !query ||
        supplier.name.toLowerCase().includes(query) ||
        supplier.code.toLowerCase().includes(query) ||
        supplier.contactPerson.toLowerCase().includes(query) ||
        supplier.phone.includes(query) ||
        supplier.email.toLowerCase().includes(query);

      const matchesStatus =
        status === "All Status" ||
        (status === "Active" && supplier.active) ||
        (status === "Inactive" && !supplier.active);

      return matchesSearch && matchesStatus;
    });
  }, [suppliers, search, status]);

  const activeCount = suppliers.filter(
    (supplier) => supplier.active
  ).length;

  const inactiveCount = suppliers.filter(
    (supplier) => !supplier.active
  ).length;

  const totalPayable = suppliers.reduce(
    (total, supplier) => total + supplier.payableBalance,
    0
  );

  const openCreate = () => {
    setSelectedSupplier(null);
    setModalMode("create");
    setModalOpen(true);
  };

  const openView = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setModalMode("view");
    setModalOpen(true);
  };

  const openEdit = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setModalMode("edit");
    setModalOpen(true);
  };

  const handleStatusChange = async (
    supplier: Supplier,
    nextStatus: boolean
  ) => {
    setSuppliers((prev) =>
      prev.map((current) =>
        current.id === supplier.id
          ? { ...current, active: nextStatus }
          : current
      )
    );

    // TODO:
    // PATCH /api/suppliers/:id
    // { active: nextStatus }
  };

  const columns = useMemo<Column<Supplier>[]>(
    () => [
      {
        key: "name",
        header: "Supplier",
        sortable: true,
        render: (row) => (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary-dark">
              <Building2 className="h-4 w-4" />
            </div>

            <div className="min-w-0">
              <p className="truncate font-medium text-secondary">
                {row.name}
              </p>

              <p className="text-xs text-text-muted">
                {row.code}
              </p>
            </div>
          </div>
        ),
      },

      {
        key: "contactPerson",
        header: "Contact Person",
        sortable: true,
        render: (row) => (
          <span className="text-sm text-text">
            {row.contactPerson}
          </span>
        ),
      },

      {
        key: "phone",
        header: "Phone",
        render: (row) => (
          <span className="text-sm text-text-muted">
            {row.phone}
          </span>
        ),
      },

      {
        key: "payableBalance",
        header: "Payable Balance",
        sortable: true,
        render: (row) => (
          <span
            className={`font-medium ${
              row.payableBalance > 0
                ? "text-secondary"
                : "text-text-muted"
            }`}
          >
            Rs. {row.payableBalance.toLocaleString()}
          </span>
        ),
      },

      {
        key: "active",
        header: "Status",
        render: (row) => (
          <StatusToggle
            active={row.active}
            onChange={(next) =>
              handleStatusChange(row, next)
            }
          />
        ),
      },

      {
        key: "id",
        header: "Actions",
        render: (row) => (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                openView(row);
              }}
              className="rounded-lg p-2 text-text-muted transition-colors hover:bg-background hover:text-secondary"
              title="View supplier"
              aria-label={`View ${row.name}`}
            >
              <Eye className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                openEdit(row);
              }}
              className="rounded-lg p-2 text-text-muted transition-colors hover:bg-primary/10 hover:text-primary-dark"
              title="Edit supplier"
              aria-label={`Edit ${row.name}`}
            >
              <Pencil className="h-4 w-4" />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <PageContainer
      title="Suppliers"
      subtitle="Manage suppliers, contact information and outstanding payables"
      breadcrumbs={[
        { label: "Purchasing", path: "/admin/purchasing" },
        { label: "Suppliers" },
      ]}
      actions={
        <Button
          icon={<Plus className="h-4 w-4" />}
          onClick={openCreate}
        >
          New Supplier
        </Button>
      }
    >
      {/* Summary Cards */}
      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Suppliers */}
        <div className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary-dark">
            <Users className="h-4 w-4" />
          </div>

          <div>
            <p className="text-xs font-medium text-text-muted">
              Total Suppliers
            </p>

            <p className="text-lg font-semibold text-secondary">
              {suppliers.length}
            </p>
          </div>
        </div>

        {/* Active */}
        <div className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/10 text-success">
            <CheckCircle2 className="h-4 w-4" />
          </div>

          <div>
            <p className="text-xs font-medium text-text-muted">
              Active Suppliers
            </p>

            <p className="text-lg font-semibold text-secondary">
              {activeCount}
            </p>
          </div>
        </div>

        {/* Inactive */}
        <div className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-background text-text-muted">
            <XCircle className="h-4 w-4" />
          </div>

          <div>
            <p className="text-xs font-medium text-text-muted">
              Inactive Suppliers
            </p>

            <p className="text-lg font-semibold text-secondary">
              {inactiveCount}
            </p>
          </div>
        </div>

        {/* Payable */}
        <div className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary-dark">
            <Wallet className="h-4 w-4" />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-medium text-text-muted">
              Total Payable
            </p>

            <p className="truncate text-lg font-semibold text-secondary">
              Rs. {totalPayable.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Supplier Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
        {/* Toolbar */}
        <div className="border-b border-border">
          <div className="flex flex-col gap-3 px-4 py-3.5 lg:flex-row lg:items-center lg:justify-between">
            {/* Heading */}
            <div className="flex items-center gap-3">
             

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold text-secondary">
                    Supplier List
                  </h2>

                  <span className="rounded-full bg-background px-2 py-0.5 text-[10px] font-medium text-text-muted">
                    {filteredSuppliers.length}
                  </span>
                </div>

                <p className="mt-0.5 text-xs text-text-muted">
                  {search || status !== "All Status"
                    ? `Showing ${filteredSuppliers.length} matching suppliers`
                    : `Manage ${suppliers.length} suppliers`}
                </p>
              </div>
            </div>

            {/* Search + Filter */}
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="w-full sm:w-72">
                <Input
                  placeholder="Search suppliers..."
                  icon={<Search className="h-4 w-4" />}
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                />
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowFilters((prev) => !prev)
                }
                className={`flex h-10 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-medium transition-colors ${
                  showFilters
                    ? "border-primary/30 bg-primary/10 text-primary-dark"
                    : "border-border text-text-muted hover:bg-background hover:text-secondary"
                }`}
              >
                <Filter className="h-4 w-4" />
                Filters
              </button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="flex flex-col gap-3 border-t border-border bg-background/50 px-4 py-3 sm:flex-row sm:items-end">
              <div className="w-full sm:w-44">
                <label className="mb-1.5 block text-xs font-medium text-text-muted">
                  Status
                </label>

                <select
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value)
                  }
                  className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-secondary outline-none transition-colors focus:border-primary"
                >
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {(status !== "All Status" || search) && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setStatus("All Status");
                  }}
                  className="flex h-10 items-center justify-center gap-1.5 px-3 text-xs font-medium text-text-muted hover:text-secondary"
                >
                  <X className="h-3.5 w-3.5" />
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Data Table */}
        <div className="min-h-[280px]">
          <DetailsTable
            columns={columns}
            data={filteredSuppliers}
            rowKey="id"
            loading={false}
            renderDetails={(row) => (
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm sm:grid-cols-4">
                <div>
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                    Supplier Code
                  </p>

                  <p className="font-medium text-secondary">
                    {row.code}
                  </p>
                </div>

                <div>
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                    Email
                  </p>

                  <p className="truncate text-text">
                    {row.email}
                  </p>
                </div>

                <div>
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                    Address
                  </p>

                  <p className="text-text">
                    {row.address}
                  </p>
                </div>

                <div>
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                    Joined
                  </p>

                  <p className="text-text">
                    {row.createdAt}
                  </p>
                </div>
              </div>
            )}
          />
        </div>

        {/* Empty State */}
        {!filteredSuppliers.length && (
          <div className="border-t border-border px-4 py-10 text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-background text-text-muted">
              <Search className="h-5 w-5" />
            </div>

            <p className="text-sm font-medium text-secondary">
              No suppliers found
            </p>

            <p className="mt-1 text-xs text-text-muted">
              Try changing your search or filter criteria.
            </p>

            {(search || status !== "All Status") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatus("All Status");
                }}
                className="mt-3 text-xs font-medium text-primary-dark hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Temporary Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-xl border border-border bg-surface shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <h3 className="font-semibold text-secondary">
                  {modalMode === "create" && "New Supplier"}
                  {modalMode === "edit" && "Edit Supplier"}
                  {modalMode === "view" && "Supplier Details"}
                </h3>

                <p className="mt-0.5 text-xs text-text-muted">
                  {modalMode === "view"
                    ? "View supplier information and account details."
                    : "Supplier form will be connected here."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-2 text-text-muted hover:bg-background hover:text-secondary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5">
              {modalMode === "view" && selectedSupplier ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 rounded-xl bg-background p-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary-dark">
                      <Building2 className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="font-semibold text-secondary">
                        {selectedSupplier.name}
                      </p>

                      <p className="text-xs text-text-muted">
                        {selectedSupplier.code}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-background p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                        Contact Person
                      </p>

                      <p className="mt-1 text-sm text-text">
                        {selectedSupplier.contactPerson}
                      </p>
                    </div>

                    <div className="rounded-lg bg-background p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                        Phone
                      </p>

                      <p className="mt-1 text-sm text-text">
                        {selectedSupplier.phone}
                      </p>
                    </div>

                    <div className="rounded-lg bg-background p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                        Email
                      </p>

                      <p className="mt-1 truncate text-sm text-text">
                        {selectedSupplier.email}
                      </p>
                    </div>

                    <div className="rounded-lg bg-background p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                        Payable
                      </p>

                      <p className="mt-1 text-sm font-semibold text-secondary">
                        Rs.{" "}
                        {selectedSupplier.payableBalance.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg bg-background p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                      Address
                    </p>

                    <p className="mt-1 text-sm text-text">
                      {selectedSupplier.address}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-border bg-background px-4 py-10 text-center">
                  <Building2 className="mx-auto h-7 w-7 text-text-muted" />

                  <p className="mt-2 text-sm font-medium text-secondary">
                    Supplier Form
                  </p>

                  <p className="mt-1 text-xs text-text-muted">
                    Connect your SupplierFormModal here.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-2 border-t border-border px-5 py-3">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-muted transition-colors hover:bg-background hover:text-secondary"
              >
                Close
              </button>

              {modalMode !== "view" && (
                <Button>
                  {modalMode === "edit"
                    ? "Save Changes"
                    : "Create Supplier"}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}