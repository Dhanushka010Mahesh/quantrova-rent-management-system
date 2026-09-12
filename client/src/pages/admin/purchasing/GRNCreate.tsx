import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  Eye,
  Pencil,
  ChevronLeft,
  ChevronRight,
  Filter,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import PageContainer from "../../../layout/PageContainer";
import DatePicker from "../../../components/ui/date/DatePicker";
import GRNFormModal, {
  type GRNData,
  type GRNStatus,
} from "../../../components/purchasing/GRNFormModal";

// type GRNStatus = "Draft" | "Pending Approval" | "Approved" | "Rejected";

interface GRN {
  id: string;
  grnNumber: string;
  supplier: string;
  invoiceNumber: string;
  invoiceDate: string;
  receivedDate: string;
  itemCount: number;
  total: number;
  advance: number;
  status: GRNStatus;
  createdBy: string;
}

const grns: GRN[] = [
  {
    id: "1",
    grnNumber: "GRN-2026-0001",
    supplier: "ABC Construction Supplies",
    invoiceNumber: "INV-10245",
    invoiceDate: "2026-08-21",
    receivedDate: "2026-08-21",
    itemCount: 5,
    total: 185000,
    advance: 50000,
    status: "Approved",
    createdBy: "Sunil Perera",
  },
  {
    id: "2",
    grnNumber: "GRN-2026-0002",
    supplier: "Lanka Hardware Traders",
    invoiceNumber: "INV-5842",
    invoiceDate: "2026-08-22",
    receivedDate: "2026-08-22",
    itemCount: 8,
    total: 242500,
    advance: 75000,
    status: "Pending Approval",
    createdBy: "Kamal Fernando",
  },
  {
    id: "3",
    grnNumber: "GRN-2026-0003",
    supplier: "Prime Equipment Suppliers",
    invoiceNumber: "PES-8821",
    invoiceDate: "2026-08-23",
    receivedDate: "2026-08-23",
    itemCount: 3,
    total: 375000,
    advance: 100000,
    status: "Draft",
    createdBy: "Nadeesha Silva",
  },
  {
    id: "4",
    grnNumber: "GRN-2026-0004",
    supplier: "ABC Construction Supplies",
    invoiceNumber: "INV-10251",
    invoiceDate: "2026-08-24",
    receivedDate: "2026-08-24",
    itemCount: 12,
    total: 468000,
    advance: 150000,
    status: "Approved",
    createdBy: "Sunil Perera",
  },
  {
    id: "5",
    grnNumber: "GRN-2026-0005",
    supplier: "Lanka Hardware Traders",
    invoiceNumber: "INV-5861",
    invoiceDate: "2026-08-25",
    receivedDate: "2026-08-25",
    itemCount: 6,
    total: 126500,
    advance: 0,
    status: "Rejected",
    createdBy: "Kamal Fernando",
  },
  {
    id: "6",
    grnNumber: "GRN-2026-0006",
    supplier: "Prime Equipment Suppliers",
    invoiceNumber: "PES-8830",
    invoiceDate: "2026-08-25",
    receivedDate: "2026-08-25",
    itemCount: 4,
    total: 298000,
    advance: 50000,
    status: "Pending Approval",
    createdBy: "Nadeesha Silva",
  },
  {
    id: "7",
    grnNumber: "GRN-2026-0007",
    supplier: "ABC Construction Supplies",
    invoiceNumber: "INV-10262",
    invoiceDate: "2026-08-26",
    receivedDate: "2026-08-26",
    itemCount: 10,
    total: 215000,
    advance: 25000,
    status: "Draft",
    createdBy: "Sunil Perera",
  },
  {
    id: "8",
    grnNumber: "GRN-2026-0008",
    supplier: "Lanka Hardware Traders",
    invoiceNumber: "INV-5875",
    invoiceDate: "2026-08-26",
    receivedDate: "2026-08-26",
    itemCount: 7,
    total: 184500,
    advance: 45000,
    status: "Approved",
    createdBy: "Kamal Fernando",
  },
  {
    id: "9",
    grnNumber: "GRN-2026-0009",
    supplier: "Prime Equipment Suppliers",
    invoiceNumber: "PES-8841",
    invoiceDate: "2026-08-27",
    receivedDate: "2026-08-27",
    itemCount: 2,
    total: 95000,
    advance: 20000,
    status: "Draft",
    createdBy: "Nadeesha Silva",
  },
  {
    id: "10",
    grnNumber: "GRN-2026-0010",
    supplier: "ABC Construction Supplies",
    invoiceNumber: "INV-10278",
    invoiceDate: "2026-08-27",
    receivedDate: "2026-08-27",
    itemCount: 9,
    total: 326000,
    advance: 100000,
    status: "Pending Approval",
    createdBy: "Sunil Perera",
  },
  {
    id: "11",
    grnNumber: "GRN-2026-0011",
    supplier: "Lanka Hardware Traders",
    invoiceNumber: "INV-5882",
    invoiceDate: "2026-08-27",
    receivedDate: "2026-08-27",
    itemCount: 5,
    total: 152000,
    advance: 30000,
    status: "Draft",
    createdBy: "Kamal Fernando",
  },
];

const grn_sample: GRNData = {
  id: "8",

  grnNumber: "GRN-2026-0008",

  supplier: "Lanka Hardware Traders",

  invoiceNumber: "INV-5875",

  invoiceDate: "2026-08-26",

  receivedDate: "2026-08-26",

  advance: 45000,

  status: "Approved",

  createdBy: "Kamal Fernando",

  createdAt: "2026-08-26T10:30:00",

  items: [
    {
      id: "1",
      itemId: "ITM-001",
      itemName: "Cement 50kg",
      itemCode: "CEM-50",

      quantity: 50,

      purchasePrice: 2150,
      sellingPrice: 2350,

      total: 107500,
    },
    {
      id: "2",
      itemId: "ITM-002",
      itemName: "Binding Wire 1kg",
      itemCode: "BW-01",

      quantity: 20,

      purchasePrice: 850,
      sellingPrice: 950,

      total: 17000,
    },
    {
      id: "3",
      itemId: "ITM-003",
      itemName: "PVC Pipe 1/2",
      itemCode: "PVC-12",

      quantity: 30,

      purchasePrice: 2000,
      sellingPrice: 2300,

      total: 60000,
    },
  ],
};

const suppliers = [
  "ABC Construction Supplies",
  "Lanka Hardware Traders",
  "Prime Equipment Suppliers",
];

const statusOptions: GRNStatus[] = [
  "Draft",
  "Pending Approval",
  "Approved",
  "Rejected",
];

const formatCurrency = (value: number) =>
  `Rs. ${value.toLocaleString("en-LK")}`;

const formatDate = (value: string) =>
  new Date(`${value}T00:00:00`).toLocaleDateString("en-GB");

function StatusBadge({ status }: { status: GRNStatus }) {
  const config = {
    Draft: {
      icon: Clock3,
      className: "bg-background text-text-muted",
    },
    "Pending Approval": {
      icon: Clock3,
      className: "bg-primary/10 text-primary-dark",
    },
    Approved: {
      icon: CheckCircle2,
      className: "bg-success/10 text-success",
    },
    Rejected: {
      icon: XCircle,
      className: "bg-danger/10 text-danger",
    },
  };

  const current = config[status];
  const Icon = current.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${current.className}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {status}
    </span>
  );
}

export default function GRN() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<GRNStatus | "">("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [grnModalOpen, setGrnModalOpen] = useState(false);

  const [grnModalMode, setGrnModalMode] = useState<"create" | "edit" | "view">(
    "create",
  );

  const [selectedGRN, setSelectedGRN] = useState<GRNData | null>(null);

  const pageSize = 10;

  const filteredGRNs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return grns.filter((grn) => {
      const matchesSearch =
        !query ||
        grn.grnNumber.toLowerCase().includes(query) ||
        grn.supplier.toLowerCase().includes(query) ||
        grn.invoiceNumber.toLowerCase().includes(query);

      const matchesSupplier =
        !supplierFilter || grn.supplier === supplierFilter;

      const matchesStatus = !statusFilter || grn.status === statusFilter;

      const matchesStartDate = !startDate || grn.invoiceDate >= startDate;

      const matchesEndDate = !endDate || grn.invoiceDate <= endDate;

      return (
        matchesSearch &&
        matchesSupplier &&
        matchesStatus &&
        matchesStartDate &&
        matchesEndDate
      );
    });
  }, [search, supplierFilter, statusFilter, startDate, endDate]);

  const totalPages = Math.max(1, Math.ceil(filteredGRNs.length / pageSize));

  const paginatedGRNs = filteredGRNs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const resetFilters = () => {
    setSearch("");
    setSupplierFilter("");
    setStatusFilter("");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleSupplierChange = (value: string) => {
    setSupplierFilter(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: GRNStatus | "") => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  return (
    <PageContainer
      title="Goods Received Notes"
      subtitle="Manage supplier goods receipts and GRN approvals"
      breadcrumbs={[
        {
          label: "Purchasing",
          path: "/admin/purchasing",
        },
        {
          label: "GRN",
        },
      ]}
      actions={
        <button
          type="button"
          onClick={() => {
            setSelectedGRN(null);
            setGrnModalMode("create");
            setGrnModalOpen(true);
          }}
          className="flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3.5 text-sm font-semibold text-secondary transition-colors hover:bg-primary-dark"
        >
          <Plus className="h-4 w-4" />
          Create GRN
        </button>
      }
    >
      <div className="space-y-3">
        {/* Filters */}
        <div className="rounded-xl border border-border bg-surface shadow-sm">
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-primary-dark" />

              <div>
                <h2 className="text-sm font-semibold text-secondary">
                  GRN List
                </h2>

                <p className="text-[11px] text-text-muted">
                  Search and filter received goods
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={resetFilters}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-text-muted hover:bg-background hover:text-secondary"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 p-3 md:grid-cols-2 xl:grid-cols-5">
            {/* Search */}
            <div className="xl:col-span-1">
              <label className="mb-1 block text-[11px] font-medium text-text-muted">
                Search
              </label>

              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />

                <input
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="GRN, supplier, invoice..."
                  className="h-9 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-xs text-secondary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Supplier */}
            <div>
              <label className="mb-1 block text-[11px] font-medium text-text-muted">
                Supplier
              </label>

              <select
                value={supplierFilter}
                onChange={(e) => handleSupplierChange(e.target.value)}
                className="h-9 w-full rounded-lg border border-border bg-surface px-3 text-xs text-secondary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="">All Suppliers</option>

                {suppliers.map((supplier) => (
                  <option key={supplier} value={supplier}>
                    {supplier}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="mb-1 block text-[11px] font-medium text-text-muted">
                Status
              </label>

              <select
                value={statusFilter}
                onChange={(e) =>
                  handleStatusChange(e.target.value as GRNStatus | "")
                }
                className="h-9 w-full rounded-lg border border-border bg-surface px-3 text-xs text-secondary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="">All Statuses</option>

                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Start Date */}
            <DatePicker
              label="From Date"
              value={startDate}
              max={endDate || undefined}
              onChange={(e) => {
                setStartDate(e.target.value);
                setCurrentPage(1);
              }}
              className="h-9 py-2 pl-9 pr-3 text-xs"
            />

            {/* End Date */}
            <DatePicker
              label="To Date"
              value={endDate}
              min={startDate || undefined}
              onChange={(e) => {
                setEndDate(e.target.value);
                setCurrentPage(1);
              }}
              className="h-9 py-2 pl-9 pr-3 text-xs"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
            <div>
              <h3 className="text-sm font-semibold text-secondary">
                Current GRNs
              </h3>

              <p className="mt-0.5 text-[11px] text-text-muted">
                {filteredGRNs.length} GRN
                {filteredGRNs.length !== 1 ? "s" : ""} found
              </p>
            </div>

            <span className="rounded-full bg-background px-2.5 py-1 text-[11px] font-medium text-text-muted">
              Page {currentPage} of {totalPages}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr className="border-b border-border bg-background/50">
                  <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                    GRN
                  </th>

                  <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                    Supplier
                  </th>

                  <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                    Invoice
                  </th>

                  <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                    Date
                  </th>

                  <th className="px-3 py-2.5 text-center text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                    Items
                  </th>

                  <th className="px-3 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                    Total
                  </th>

                  <th className="px-3 py-2.5 text-center text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                    Status
                  </th>

                  <th className="px-4 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {paginatedGRNs.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center">
                      <p className="text-sm font-medium text-secondary">
                        No GRNs found
                      </p>

                      <p className="mt-1 text-xs text-text-muted">
                        Try changing your search or filters.
                      </p>
                    </td>
                  </tr>
                ) : (
                  paginatedGRNs.map((grn) => (
                    <tr
                      key={grn.id}
                      className="border-b border-border last:border-0 hover:bg-background/40"
                    >
                      {/* GRN */}
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/admin/purchasing/grn/${grn.id}`)
                          }
                          className="text-xs font-semibold text-secondary hover:text-primary-dark"
                        >
                          {grn.grnNumber}
                        </button>

                        <p className="mt-0.5 text-[10px] text-text-muted">
                          By {grn.createdBy}
                        </p>
                      </td>

                      {/* Supplier */}
                      <td className="px-3 py-3">
                        <p className="max-w-[220px] truncate text-xs font-medium text-secondary">
                          {grn.supplier}
                        </p>
                      </td>

                      {/* Invoice */}
                      <td className="px-3 py-3">
                        <p className="text-xs text-secondary">
                          {grn.invoiceNumber}
                        </p>
                      </td>

                      {/* Date */}
                      <td className="px-3 py-3">
                        <p className="text-xs text-secondary">
                          {formatDate(grn.invoiceDate)}
                        </p>

                        <p className="text-[10px] text-text-muted">
                          Received {formatDate(grn.receivedDate)}
                        </p>
                      </td>

                      {/* Items */}
                      <td className="px-3 py-3 text-center">
                        <span className="text-xs font-medium text-secondary">
                          {grn.itemCount}
                        </span>
                      </td>

                      {/* Total */}
                      <td className="px-3 py-3 text-right">
                        <p className="text-xs font-semibold text-secondary">
                          {formatCurrency(grn.total)}
                        </p>

                        {grn.advance > 0 && (
                          <p className="mt-0.5 text-[10px] text-text-muted">
                            Adv. {formatCurrency(grn.advance)}
                          </p>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-3 py-3 text-center">
                        <StatusBadge status={grn.status} />
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {/* View */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedGRN(grn_sample); //grn
                              setGrnModalMode("view");
                              setGrnModalOpen(true);
                            }}
                            className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-background hover:text-secondary"
                            title="View GRN"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          {/* Edit - Draft only */}
                          {grn.status === "Draft" && (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedGRN(grn_sample); //grn
                                setGrnModalMode("edit");
                                setGrnModalOpen(true);
                              }}
                              className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-primary/10 hover:text-primary-dark"
                              title="Edit GRN"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                          )}

                          {/* Status */}
                          {grn.status === "Pending Approval" && (
                            <button
                              type="button"
                              onClick={() =>
                                navigate(`/admin/purchasing/grn/${grn.id}`)
                              }
                              className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-success/10 hover:text-success"
                              title="Review GRN"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-border px-4 py-2.5">
            <p className="text-[11px] text-text-muted">
              Showing{" "}
              {filteredGRNs.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}{" "}
              to {Math.min(currentPage * pageSize, filteredGRNs.length)} of{" "}
              {filteredGRNs.length}
            </p>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-text-muted transition-colors hover:bg-background hover:text-secondary disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`h-7 min-w-7 rounded-md px-2 text-[11px] font-medium transition-colors ${
                      currentPage === page
                        ? "bg-primary text-secondary"
                        : "border border-border text-text-muted hover:bg-background hover:text-secondary"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((page) => Math.min(page + 1, totalPages))
                }
                className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-text-muted transition-colors hover:bg-background hover:text-secondary disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <GRNFormModal
        open={grnModalOpen}
        mode={grnModalMode}
        grn={selectedGRN}
        onClose={() => setGrnModalOpen(false)}
        onSaved={(savedGRN) => {
          console.log("Saved GRN:", savedGRN);

          // Later:
          // API call / state update
        }}
        onStatusChange={(updatedGRN, status) => {
          console.log("GRN status changed:", updatedGRN.id, status);

          // Later:
          // PATCH /grns/:id/status
        }}
      />
    </PageContainer>
  );
}
