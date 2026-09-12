import { useMemo, useState } from "react";
import { Plus, Search, Eye, CreditCard, CheckCircle2, ScrollText } from "lucide-react";
import { liabilityBalance, mockLiabilities, type Liability, type LiabilityStatus } from "../../../types/liability";
import type { Column } from "../../../components/ui/table/DataTable";
import Badge from "../../../components/ui/others/Badge";
import PageContainer from "../../../layout/PageContainer";
import Button from "../../../components/ui/button/Button";
import Input from "../../../components/ui/input/Input";
import Select from "../../../components/ui/select/Select";
import DataTable from "../../../components/ui/table/DataTable";
import LiabilityFormModal from "../../../components/liability/LiabilityFormModal";
import LiabilityPaymentModal from "../../../components/liability/LiabilityPaymentModal";
import LiabilityViewModal from "../../../components/liability/LiabilityViewModal";
import LiabilityApproveModal from "../../../components/liability/LiabilityApproveModal";
// import PageContainer from "../../layout/PageContainer";
// import Input from "../../components/ui/input/Input";
// import Select from "../../components/ui/select/Select";
// import Button from "../../components/ui/button/Button";
// import Badge from "../../components/ui/others/Badge";
// import DataTable, { type Column } from "../../components/ui/table/DataTable";
// import LiabilityFormModal from "../../components/liability/LiabilityFormModal";
// import LiabilityPaymentModal from "../../components/liability/LiabilityPaymentModal";
// import LiabilityApproveModal from "../../components/liability/LiabilityApproveModal";
// import LiabilityViewModal from "../../components/liability/LiabilityViewModal";
// import { mockLiabilities } from "../../data/mockLiabilities";
// import { liabilityBalance } from "../../types/liability";
// import type { Liability, LiabilityStatus } from "../../types/liability";

const statusVariant: Record<LiabilityStatus, "warning" | "success" | "info"> = {
  PENDING: "warning",
  APPROVED: "info",
  SETTLED: "success",
};

const statusOptions: { label: string; value: LiabilityStatus | "ALL" }[] = [
  { label: "All Statuses", value: "ALL" },
  { label: "Pending Approval", value: "PENDING" },
  { label: "Approved", value: "APPROVED" },
  { label: "Settled", value: "SETTLED" },
];

const Liabilities = () => {
  const [liabilities, setLiabilities] = useState<Liability[]>(mockLiabilities);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<LiabilityStatus | "ALL">("ALL");

  const [createOpen, setCreateOpen] = useState(false);
  const [payTarget, setPayTarget] = useState<Liability | null>(null);
  const [payOpen, setPayOpen] = useState(false);
  const [approveTarget, setApproveTarget] = useState<Liability | null>(null);
  const [approveOpen, setApproveOpen] = useState(false);
  const [viewTarget, setViewTarget] = useState<Liability | null>(null);
  const [viewOpen, setViewOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return liabilities.filter((l) => {
      const matchesStatus = statusFilter === "ALL" || l.status === statusFilter;
      const matchesSearch = !q || l.name.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [liabilities, search, statusFilter]);

  const handleUpdated = (updated: Liability) => {
    setLiabilities((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
  };

  const handleCreated = (created: Liability) => {
    setLiabilities((prev) => [created, ...prev]);
  };

  const columns: Column<Liability>[] = [
    { key: "name", header: "Name", sortable: true },
    { key: "totalAmount", header: "Total", render: (row) => row.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 }) },
    { key: "paidAmount", header: "Paid", render: (row) => row.paidAmount.toLocaleString(undefined, { minimumFractionDigits: 2 }) },
    {
      key: "id",
      header: "Balance",
      render: (row) => {
        const bal = liabilityBalance(row);
        return <span className={bal > 0 ? "text-danger" : "text-success"}>{bal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>;
      },
    },
    { key: "dueDate", header: "Due Date", render: (row) => row.dueDate ?? "—" },
    {
      key: "status",
      header: "Status",
      render: (row) => <Badge variant={statusVariant[row.status]}>{row.status}</Badge>,
    },
    {
      key: "id",
      header: "Actions",
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setViewTarget(row);
              setViewOpen(true);
            }}
            className="rounded-lg p-1.5 text-text-muted hover:bg-background hover:text-secondary"
            aria-label="View"
          >
            <Eye className="h-4 w-4" />
          </button>
          {row.status === "PENDING" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setApproveTarget(row);
                setApproveOpen(true);
              }}
              className="rounded-lg p-1.5 text-text-muted hover:bg-success/10 hover:text-success"
              aria-label="Approve"
            >
              <CheckCircle2 className="h-4 w-4" />
            </button>
          )}
          {row.status === "APPROVED" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setPayTarget(row);
                setPayOpen(true);
              }}
              className="rounded-lg p-1.5 text-text-muted hover:bg-primary/10 hover:text-primary-dark"
              aria-label="Pay"
            >
              <CreditCard className="h-4 w-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <PageContainer
      title="Liabilities"
      subtitle="Track and settle company liabilities"
      breadcrumbs={[{ label: "Accounts" }, { label: "Liabilities" }]}
      icon={<ScrollText className="h-5 w-5" />}
      actions={
        <Button icon={<Plus className="h-4 w-4" />} onClick={() => setCreateOpen(true)}>
          Add Liability
        </Button>
      }
    >
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="max-w-xs flex-1">
          <Input placeholder="Search by name..." icon={<Search className="h-4 w-4" />} value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="w-52">
          <Select value={statusFilter} options={statusOptions} onChange={(e) => setStatusFilter(e.target.value as LiabilityStatus | "ALL")} />
        </div>
      </div>

      <DataTable columns={columns} data={filtered} rowKey="id" pageSize={10} loading={false} />

      <LiabilityFormModal open={createOpen} onClose={() => setCreateOpen(false)} onSaved={handleCreated} />
      <LiabilityPaymentModal open={payOpen} liability={payTarget} onClose={() => setPayOpen(false)} onPaid={handleUpdated} />
      <LiabilityApproveModal open={approveOpen} liability={approveTarget} onClose={() => setApproveOpen(false)} onApproved={handleUpdated} />
      <LiabilityViewModal open={viewOpen} liability={viewTarget} onClose={() => setViewOpen(false)} />
    </PageContainer>
  );
};

export default Liabilities;