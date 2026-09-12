import { useEffect, useMemo, useState } from "react";
import { Plus, Eye, Pencil, Search, Wallet, Landmark } from "lucide-react";
import type { BankAccount, CashAccount } from "../../../types/account";
import type { Column } from "../../../components/ui/table/DataTable";
import Badge from "../../../components/ui/others/Badge";
import PageContainer from "../../../layout/PageContainer";
import Button from "../../../components/ui/button/Button";
import Input from "../../../components/ui/input/Input";
import DataTable from "../../../components/ui/table/DataTable";
import CashAccountFormModal from "../../../components/accounts/CashAccountFormModal";
import BankAccountFormModal from "../../../components/accounts/BankAccountFormModal";
// import type { Column } from "../../components/ui/table/DataTable";
// import type { CashAccount, BankAccount } from "../../types/account";
// import Badge from "../../components/ui/others/Badge";
// import PageContainer from "../../layout/PageContainer";
// import Button from "../../components/ui/button/Button";
// import Input from "../../components/ui/input/Input";
// import DataTable from "../../components/ui/table/DataTable";
// import CashAccountFormModal from "../../components/accounts/CashAccountFormModal";
// import BankAccountFormModal from "../../components/accounts/BankAccountFormModal";

type Tab = "cash" | "bank";

const Accounts = () => {
  const [tab, setTab] = useState<Tab>("cash");
  const [search, setSearch] = useState("");

  // Cash accounts state
  const [cashAccounts, setCashAccounts] = useState<CashAccount[]>([]);
  const [cashLoading, setCashLoading] = useState(true);
  const [cashModalOpen, setCashModalOpen] = useState(false);
  const [cashModalMode, setCashModalMode] = useState<"create" | "edit" | "view">("create");
  const [activeCashAccount, setActiveCashAccount] = useState<CashAccount | null>(null);

  // Bank accounts state
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [bankLoading, setBankLoading] = useState(true);
  const [bankModalOpen, setBankModalOpen] = useState(false);
  const [bankModalMode, setBankModalMode] = useState<"create" | "edit" | "view">("create");
  const [activeBankAccount, setActiveBankAccount] = useState<BankAccount | null>(null);

  useEffect(() => {
    // TODO: replace with real API call e.g. GET /api/accounts/cash
    setTimeout(() => {
      setCashAccounts([
        {
          id: "C01",
          name: "Main Cash Drawer",
          holder: "Sunil Perera",
          openingBalance: 50000,
          currentBalance: 62500,
          status: "Active",
          notes: "Daily sales cash",
          createdAt: "2026-01-05",
        },
        {
          id: "C02",
          name: "Petty Cash",
          holder: "Kamal Fernando",
          openingBalance: 10000,
          currentBalance: 4200,
          status: "Active",
          notes: "",
          createdAt: "2026-02-10",
        },
      ]);
      setCashLoading(false);
    }, 700);

    // TODO: replace with real API call e.g. GET /api/accounts/bank
    setTimeout(() => {
      setBankAccounts([
        {
          id: "B01",
          accountName: "Business Current Account",
          bankName: "Commercial Bank",
          branch: "Colombo 03",
          accountNumber: "8001234567",
          openingBalance: 500000,
          currentBalance: 742300,
          status: "Active",
          createdAt: "2025-11-01",
        },
        {
          id: "B02",
          accountName: "Payroll Account",
          bankName: "Sampath Bank",
          branch: "Kandy",
          accountNumber: "1123456789",
          openingBalance: 200000,
          currentBalance: 185000,
          status: "Active",
          createdAt: "2026-01-15",
        },
      ]);
      setBankLoading(false);
    }, 700);
  }, []);

  const filteredCash = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return cashAccounts;
    return cashAccounts.filter((a) => a.name.toLowerCase().includes(q) || a.holder.toLowerCase().includes(q));
  }, [cashAccounts, search]);

  const filteredBank = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return bankAccounts;
    return bankAccounts.filter(
      (a) =>
        a.accountName.toLowerCase().includes(q) ||
        a.bankName.toLowerCase().includes(q) ||
        a.accountNumber.includes(q)
    );
  }, [bankAccounts, search]);

  // Cash handlers
  const openCreateCash = () => {
    setActiveCashAccount(null);
    setCashModalMode("create");
    setCashModalOpen(true);
  };
  const openEditCash = (account: CashAccount) => {
    setActiveCashAccount(account);
    setCashModalMode("edit");
    setCashModalOpen(true);
  };
  const openViewCash = (account: CashAccount) => {
    setActiveCashAccount(account);
    setCashModalMode("view");
    setCashModalOpen(true);
  };
  const handleCashSaved = (saved: CashAccount) => {
    setCashAccounts((prev) => {
      const exists = prev.some((a) => a.id === saved.id);
      return exists ? prev.map((a) => (a.id === saved.id ? saved : a)) : [saved, ...prev];
    });
  };

  // Bank handlers
  const openCreateBank = () => {
    setActiveBankAccount(null);
    setBankModalMode("create");
    setBankModalOpen(true);
  };
  const openEditBank = (account: BankAccount) => {
    setActiveBankAccount(account);
    setBankModalMode("edit");
    setBankModalOpen(true);
  };
  const openViewBank = (account: BankAccount) => {
    setActiveBankAccount(account);
    setBankModalMode("view");
    setBankModalOpen(true);
  };
  const handleBankSaved = (saved: BankAccount) => {
    setBankAccounts((prev) => {
      const exists = prev.some((a) => a.id === saved.id);
      return exists ? prev.map((a) => (a.id === saved.id ? saved : a)) : [saved, ...prev];
    });
  };

  const cashColumns: Column<CashAccount>[] = [
    { key: "name", header: "Account Name", sortable: true },
    { key: "holder", header: "Holder" },
    {
      key: "currentBalance",
      header: "Current Balance",
      render: (row) => (
        <span className="font-medium text-secondary">
          {row.currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <Badge variant={row.status === "Active" ? "success" : "neutral"}>{row.status}</Badge>,
    },
    {
      key: "id",
      header: "Actions",
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openViewCash(row);
            }}
            className="rounded-lg p-1.5 text-text-muted hover:bg-background hover:text-secondary"
            aria-label="View"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              openEditCash(row);
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

  const bankColumns: Column<BankAccount>[] = [
    { key: "accountName", header: "Account Name", sortable: true },
    { key: "bankName", header: "Bank" },
    { key: "branch", header: "Branch" },
    { key: "accountNumber", header: "Account No." },
    {
      key: "currentBalance",
      header: "Current Balance",
      render: (row) => (
        <span className="font-medium text-secondary">
          {row.currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <Badge variant={row.status === "Active" ? "success" : "neutral"}>{row.status}</Badge>,
    },
    {
      key: "id",
      header: "Actions",
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openViewBank(row);
            }}
            className="rounded-lg p-1.5 text-text-muted hover:bg-background hover:text-secondary"
            aria-label="View"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              openEditBank(row);
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
      title="Accounts"
      subtitle="Manage cash and bank accounts"
      breadcrumbs={[{ label: "Accounts" }]}
      icon={<Wallet className="h-5 w-5" />}
      actions={
        <Button
          icon={<Plus className="h-4 w-4" />}
          onClick={tab === "cash" ? openCreateCash : openCreateBank}
        >
          {tab === "cash" ? "Add Cash Account" : "Add Bank Account"}
        </Button>
      }
    >
      {/* Tabs */}
      <div className="mb-4 flex items-center gap-1 rounded-lg border border-border bg-background p-1 w-fit">
        <button
          onClick={() => {
            setTab("cash");
            setSearch("");
          }}
          className={`flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors ${
            tab === "cash" ? "bg-surface text-secondary shadow-sm" : "text-text-muted hover:text-secondary"
          }`}
        >
          <Wallet className="h-4 w-4" /> Cash Accounts
        </button>
        <button
          onClick={() => {
            setTab("bank");
            setSearch("");
          }}
          className={`flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors ${
            tab === "bank" ? "bg-surface text-secondary shadow-sm" : "text-text-muted hover:text-secondary"
          }`}
        >
          <Landmark className="h-4 w-4" /> Bank Accounts
        </button>
      </div>

      <div className="mb-4 max-w-xs">
        <Input
          placeholder={tab === "cash" ? "Search by name, holder..." : "Search by name, bank, account no..."}
          icon={<Search className="h-4 w-4" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {tab === "cash" ? (
        <DataTable columns={cashColumns} data={filteredCash} loading={cashLoading} rowKey="id" pageSize={10} />
      ) : (
        <DataTable columns={bankColumns} data={filteredBank} loading={bankLoading} rowKey="id" pageSize={10} />
      )}

      <CashAccountFormModal
        open={cashModalOpen}
        mode={cashModalMode}
        account={activeCashAccount}
        onClose={() => setCashModalOpen(false)}
        onSaved={handleCashSaved}
      />

      <BankAccountFormModal
        open={bankModalOpen}
        mode={bankModalMode}
        account={activeBankAccount}
        onClose={() => setBankModalOpen(false)}
        onSaved={handleBankSaved}
      />
    </PageContainer>
  );
};

export default Accounts;