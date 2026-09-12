import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Eye, Pencil, CheckCircle2, XCircle, PackageSearch } from "lucide-react";
import { mockRentalOrders, orderBalanceDue, orderTotal, type RentalOrder, type RentalOrderStatus } from "../../../types/rentalOrder";
import type { Column } from "../../../components/ui/table/DataTable";
import Badge from "../../../components/ui/others/Badge";
import PageContainer from "../../../layout/PageContainer";
import Button from "../../../components/ui/button/Button";
import Input from "../../../components/ui/input/Input";
import Select from "../../../components/ui/select/Select";
import DataTable from "../../../components/ui/table/DataTable";
import OrderDetailModal from "../../../components/rental/OrderDetailModal";
import ProcessOrderModal from "../../../components/rental/ProcessOrderModal";
import RejectOrderModal from "../../../components/rental/RejectOrderModal";
// import PageContainer from "../../layout/PageContainer";
// import Input from "../../components/ui/input/Input";
// import Select from "../../components/ui/select/Select";
// import Button from "../../components/ui/button/Button";
// import Badge from "../../components/ui/others/Badge";
// import DataTable, { type Column } from "../../components/ui/table/DataTable";
// import OrderDetailModal from "../../components/rentalOrders/OrderDetailModal";
// import ProcessOrderModal from "../../components/rentalOrders/ProcessOrderModal";
// import RejectOrderModal from "../../components/rentalOrders/RejectOrderModal";
// import { mockRentalOrders } from "../../data/mockRentalOrders";
// import { orderTotal, orderBalanceDue } from "../../types/rentalOrder";
// import type { RentalOrder, RentalOrderStatus } from "../../types/rentalOrder";

const statusVariant: Record<RentalOrderStatus, "warning" | "success" | "danger"> = {
  PENDING: "warning",
  PROCESSED: "success",
  REJECTED: "danger",
};

const statusOptions: { label: string; value: RentalOrderStatus | "ALL" }[] = [
  { label: "All Statuses", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Processed", value: "PROCESSED" },
  { label: "Rejected", value: "REJECTED" },
];

const RentalOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<RentalOrder[]>(mockRentalOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<RentalOrderStatus | "ALL">("ALL");

  const [detailOrder, setDetailOrder] = useState<RentalOrder | null>(null);
  const [detailMode, setDetailMode] = useState<"view" | "edit">("view");
  const [detailOpen, setDetailOpen] = useState(false);

  const [processOrder, setProcessOrder] = useState<RentalOrder | null>(null);
  const [processOpen, setProcessOpen] = useState(false);

  const [rejectOrder, setRejectOrder] = useState<RentalOrder | null>(null);
  const [rejectOpen, setRejectOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((o) => {
      const matchesStatus = statusFilter === "ALL" || o.status === statusFilter;
      const matchesSearch = !q || o.billNumber.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [orders, search, statusFilter]);

  const openView = (order: RentalOrder) => {
    setDetailOrder(order);
    setDetailMode("view");
    setDetailOpen(true);
  };

  const openEdit = (order: RentalOrder) => {
    if (order.status !== "PENDING") return;
    setDetailOrder(order);
    setDetailMode("edit");
    setDetailOpen(true);
  };

  const openProcess = (order: RentalOrder) => {
    if (order.status !== "PENDING") return;
    setProcessOrder(order);
    setProcessOpen(true);
  };

  const openReject = (order: RentalOrder) => {
    if (order.status !== "PENDING") return;
    setRejectOrder(order);
    setRejectOpen(true);
  };

  const handleSaved = (updated: RentalOrder) => {
    setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
  };

  const columns: Column<RentalOrder>[] = [
    { key: "billNumber", header: "Bill No", sortable: true },
    { key: "orderDate", header: "Order Date", sortable: true },
    { key: "customerName", header: "Customer" },
    {
      key: "id",
      header: "Total",
      render: (row) => orderTotal(row).toLocaleString(undefined, { minimumFractionDigits: 2 }),
    },
    {
      key: "id",
      header: "Balance Due",
      render: (row) => {
        const bal = orderBalanceDue(row);
        return (
          <span className={bal > 0 ? "text-danger" : "text-success"}>
            {bal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <Badge variant={statusVariant[row.status]}>{row.status}</Badge>,
    },
    {
      key: "id",
      header: "Actions",
      render: (row) => (
        <div className="flex items-center gap-1">
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
            disabled={row.status !== "PENDING"}
            className="rounded-lg p-1.5 text-text-muted hover:bg-background hover:text-secondary disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
            aria-label="Edit"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              openProcess(row);
            }}
            disabled={row.status !== "PENDING"}
            className="rounded-lg p-1.5 text-text-muted hover:bg-success/10 hover:text-success disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
            aria-label="Process"
          >
            <CheckCircle2 className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              openReject(row);
            }}
            disabled={row.status !== "PENDING"}
            className="rounded-lg p-1.5 text-text-muted hover:bg-danger/10 hover:text-danger disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
            aria-label="Reject"
          >
            <XCircle className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <PageContainer
      title="Rental Orders"
      subtitle="View and manage all rent and sale orders"
      breadcrumbs={[{ label: "Rental" }, { label: "Orders" }]}
      icon={<PackageSearch className="h-5 w-5" />}
      actions={
        <Button icon={<Plus className="h-4 w-4" />} onClick={() => navigate("/admin/rental")}>
          Create New
        </Button>
      }
    >
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="max-w-xs flex-1">
          <Input
            placeholder="Search by bill no, customer..."
            icon={<Search className="h-4 w-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-48">
          <Select value={statusFilter} options={statusOptions} onChange={(e) => setStatusFilter(e.target.value as RentalOrderStatus | "ALL")} />
        </div>
      </div>

      <DataTable columns={columns} data={filtered} rowKey="id" pageSize={10} loading={false} />

      <OrderDetailModal
        open={detailOpen}
        mode={detailMode}
        order={detailOrder}
        onClose={() => setDetailOpen(false)}
        onSaved={handleSaved}
      />

      <ProcessOrderModal
        open={processOpen}
        order={processOrder}
        onClose={() => setProcessOpen(false)}
        onProcessed={handleSaved}
      />

      <RejectOrderModal
        open={rejectOpen}
        order={rejectOrder}
        onClose={() => setRejectOpen(false)}
        onRejected={handleSaved}
      />
    </PageContainer>
  );
};

export default RentalOrders;