import { useEffect, useMemo, useState } from "react";
import { Plus, Search, ArrowRightLeft, FileStack, CheckCircle2, RotateCcw } from "lucide-react";
import type { ChequeInHand, ChequeStatus } from "../../../types/chequeInHand";
import type { FundTransfer } from "../../../types/fundTransfer";
import type { Column } from "../../../components/ui/table/DataTable";
import Badge from "../../../components/ui/others/Badge";
import PageContainer from "../../../layout/PageContainer";
import Button from "../../../components/ui/button/Button";
import Input from "../../../components/ui/input/Input";
import DataTable from "../../../components/ui/table/DataTable";
import TransferFormModal from "../../../components/transfers/TransferFormModal";
import ChequeFormModal from "../../../components/transfers/ChequeFormModal";
// import type { Column } from "../../components/ui/table/DataTable";
// import type { FundTransfer } from "../../types/fundTransfer";
// import type { ChequeInHand, ChequeStatus } from "../../types/chequeInHand";
// import Badge from "../../components/ui/others/Badge";
// import PageContainer from "../../layout/PageContainer";
// import Button from "../../components/ui/button/Button";
// import Input from "../../components/ui/input/Input";
// import DataTable from "../../components/ui/table/DataTable";
// import TransferFormModal from "../../components/transfers/TransferFormModal";
// import ChequeFormModal from "../../components/cheques/ChequeFormModal";

type Tab = "transfer" | "cheques";

const chequeStatusVariant: Record<ChequeStatus, "warning" | "success" | "danger"> = {
  IN_HAND: "warning",
  RELEASED: "success",
  RETURNED: "danger",
};

const FundTransferPage = () => {
  const [tab, setTab] = useState<Tab>("transfer");
  const [search, setSearch] = useState("");

  // Fund transfers
  const [transfers, setTransfers] = useState<FundTransfer[]>([]);
  const [transferLoading, setTransferLoading] = useState(true);
  const [transferModalOpen, setTransferModalOpen] = useState(false);

  // Cheques in hand
  const [cheques, setCheques] = useState<ChequeInHand[]>([]);
  const [chequeLoading, setChequeLoading] = useState(true);
  const [chequeModalOpen, setChequeModalOpen] = useState(false);

  useEffect(() => {
    // TODO: replace with real API call e.g. GET /api/fund-transfers
    setTimeout(() => {
      setTransfers([
        {
          id: "T001",
          direction: "CASH_TO_BANK",
          cashAccountId: 1,
          cashAccountName: "Main Cash Drawer",
          bankAccountId: 1,
          bankAccountName: "Business Current Account - Commercial Bank",
          amount: 50000,
          date: "2026-08-15",
          note: "Weekly cash deposit",
          createdAt: "2026-08-15",
        },
      ]);
      setTransferLoading(false);
    }, 700);

    // TODO: replace with real API call e.g. GET /api/cheques-in-hand
    setTimeout(() => {
      setCheques([
        {
          id: "CQ001",
          type: "RECEIVED",
          chequeNo: "CHQ-000125",
          bankAccountId: 1,
          bankAccountName: "Business Current Account - Commercial Bank",
          partyName: "Retailer A",
          amount: 25000,
          chequeDate: "2026-08-12",
          receivedOrIssuedDate: "2026-08-12",
          status: "IN_HAND",
          statusDate: null,
          createdAt: "2026-08-12",
        },
        {
          id: "CQ002",
          type: "ISSUED",
          chequeNo: "CHQ-990045",
          bankAccountId: 2,
          bankAccountName: "Payroll Account - Sampath Bank",
          partyName: "ABC Traders",
          amount: 18000,
          chequeDate: "2026-08-05",
          receivedOrIssuedDate: "2026-08-05",
          status: "RELEASED",
          statusDate: "2026-08-19",
          createdAt: "2026-08-05",
        },
      ]);
      setChequeLoading(false);
    }, 700);
  }, []);

  const filteredTransfers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return transfers;
    return transfers.filter(
      (t) => t.cashAccountName.toLowerCase().includes(q) || t.bankAccountName.toLowerCase().includes(q)
    );
  }, [transfers, search]);

  const filteredCheques = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return cheques;
    return cheques.filter(
      (c) => c.chequeNo.toLowerCase().includes(q) || c.partyName.toLowerCase().includes(q)
    );
  }, [cheques, search]);

  const handleTransferSaved = (saved: FundTransfer) => {
    setTransfers((prev) => [saved, ...prev]);
  };

  const handleChequeSaved = (saved: ChequeInHand) => {
    setCheques((prev) => [saved, ...prev]);
  };

  const handleChequeStatus = async (cheque: ChequeInHand, status: "RELEASED" | "RETURNED") => {
    if (cheque.status !== "IN_HAND") return; // decided once — locked
    const action = status === "RELEASED" ? "release" : "return";
    if (!window.confirm(`Mark cheque "${cheque.chequeNo}" as ${action}ed? This can't be undone.`)) return;

    // TODO: replace with real API call e.g. PATCH /api/cheques-in-hand/:id { status }
    // Backend should update the linked bank account balance:
    //  - RECEIVED + RELEASED -> credit bank account
    //  - ISSUED + RELEASED -> debit bank account
    //  - RETURNED (either type) -> no balance movement
    setCheques((prev) =>
      prev.map((c) => (c.id === cheque.id ? { ...c, status, statusDate: new Date().toISOString().slice(0, 10) } : c))
    );
  };

  const transferColumns: Column<FundTransfer>[] = [
    { key: "date", header: "Date", sortable: true },
    {
      key: "direction",
      header: "Direction",
      render: (row) => (
        <Badge variant={row.direction === "CASH_TO_BANK" ? "info" : "neutral"}>
          {row.direction === "CASH_TO_BANK" ? "Cash → Bank" : "Bank → Cash"}
        </Badge>
      ),
    },
    { key: "cashAccountName", header: "Cash Account" },
    { key: "bankAccountName", header: "Bank Account" },
    {
      key: "amount",
      header: "Amount",
      render: (row) => (
        <span className="font-medium text-secondary">
          {row.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    { key: "note", header: "Note" },
  ];

  const chequeColumns: Column<ChequeInHand>[] = [
    { key: "chequeNo", header: "Cheque No", sortable: true },
    {
      key: "type",
      header: "Type",
      render: (row) => (
        <Badge variant={row.type === "RECEIVED" ? "success" : "info"}>
          {row.type === "RECEIVED" ? "Received" : "Issued"}
        </Badge>
      ),
    },
    { key: "partyName", header: "Party" },
    { key: "bankAccountName", header: "Bank Account" },
    {
      key: "amount",
      header: "Amount",
      render: (row) => (
        <span className="font-medium text-secondary">
          {row.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    { key: "chequeDate", header: "Cheque Date" },
    {
      key: "status",
      header: "Status",
      render: (row) => <Badge variant={chequeStatusVariant[row.status]}>{row.status.replace("_", " ")}</Badge>,
    },
    {
      key: "id",
      header: "Actions",
      render: (row) =>
        row.status === "IN_HAND" ? (
          <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-1.5">
            <button
              onClick={() => handleChequeStatus(row, "RELEASED")}
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-success hover:bg-success/10"
            >
              <CheckCircle2 className="h-3.5 w-3.5" /> Release
            </button>
            <button
              onClick={() => handleChequeStatus(row, "RETURNED")}
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-danger hover:bg-danger/10"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Return
            </button>
          </div>
        ) : (
          <span className="text-xs text-text-muted">{row.statusDate}</span>
        ),
    },
  ];

  return (
    <PageContainer
      title="Fund Transfer"
      subtitle="Move funds between accounts and manage cheques in hand"
      breadcrumbs={[{ label: "Accounts" }, { label: "Fund Transfer" }]}
      icon={<ArrowRightLeft className="h-5 w-5" />}
      actions={
        tab === "transfer" ? (
          <Button icon={<Plus className="h-4 w-4" />} onClick={() => setTransferModalOpen(true)}>
            New Transfer
          </Button>
        ) : (
          <Button icon={<Plus className="h-4 w-4" />} onClick={() => setChequeModalOpen(true)}>
            Add Cheque
          </Button>
        )
      }
    >
      <div className="mb-4 flex items-center gap-1 rounded-lg border border-border bg-background p-1 w-fit">
        <button
          onClick={() => {
            setTab("transfer");
            setSearch("");
          }}
          className={`flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors ${
            tab === "transfer" ? "bg-surface text-secondary shadow-sm" : "text-text-muted hover:text-secondary"
          }`}
        >
          <ArrowRightLeft className="h-4 w-4" /> Fund Transfer
        </button>
        <button
          onClick={() => {
            setTab("cheques");
            setSearch("");
          }}
          className={`flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors ${
            tab === "cheques" ? "bg-surface text-secondary shadow-sm" : "text-text-muted hover:text-secondary"
          }`}
        >
          <FileStack className="h-4 w-4" /> Cheques In Hand
        </button>
      </div>

      <div className="mb-4 max-w-xs">
        <Input
          placeholder={tab === "transfer" ? "Search by account..." : "Search by cheque no, party..."}
          icon={<Search className="h-4 w-4" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {tab === "transfer" ? (
        <DataTable columns={transferColumns} data={filteredTransfers} loading={transferLoading} rowKey="id" pageSize={10} />
      ) : (
        <DataTable columns={chequeColumns} data={filteredCheques} loading={chequeLoading} rowKey="id" pageSize={10} />
      )}

      <TransferFormModal
        open={transferModalOpen}
        onClose={() => setTransferModalOpen(false)}
        onSaved={handleTransferSaved}
      />

      <ChequeFormModal open={chequeModalOpen} onClose={() => setChequeModalOpen(false)} onSaved={handleChequeSaved} />
    </PageContainer>
  );
};

export default FundTransferPage;