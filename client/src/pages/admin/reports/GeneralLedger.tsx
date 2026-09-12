import { useMemo, useState } from "react";
import { BookOpen, Search, SlidersHorizontal, PlusCircle, AlertTriangle, BarChart3 } from "lucide-react";
import { flattenToGLRows, mockJournalEntries, mockLedgerAccounts, withRunningBalance, type GLRow, type JournalEntry, type JournalStatus } from "../../../types/generalLedger";
import type { Column } from "../../../components/ui/table/DataTable";
import Badge from "../../../components/ui/others/Badge";
import PageContainer from "../../../layout/PageContainer";
import Button from "../../../components/ui/button/Button";
import Select from "../../../components/ui/select/Select";
import Input from "../../../components/ui/input/Input";
import AccountBalanceChart from "../../../components/reports/AccountBalanceChart";
import DataTable from "../../../components/ui/table/DataTable";
import AdjustmentEntryModal from "../../../components/reports/AdjustmentEntryModal";
// import PageContainer from "../../layout/PageContainer";
// import Select from "../../components/ui/select/Select";
// import Input from "../../components/ui/input/Input";
// import Button from "../../components/ui/button/Button";
// import Badge from "../../components/ui/others/Badge";
// import DataTable, { type Column } from "../../components/ui/table/DataTable";
// import AccountBalanceChart from "../../components/generalLedger/AccountBalanceChart";
// import AdjustmentEntryModal from "../../components/generalLedger/AdjustmentEntryModal";
// import { mockLedgerAccounts, mockJournalEntries } from "../../data/mockGeneralLedger";
// import { flattenToGLRows, withRunningBalance } from "../../types/generalLedger";
// import type { JournalEntry, JournalStatus } from "../../types/generalLedger";

const statusOptions: { label: string; value: JournalStatus | "ALL" }[] = [
  { label: "All Statuses", value: "ALL" },
  { label: "Posted", value: "POSTED" },
  { label: "Draft", value: "DRAFT" },
  { label: "Reversed", value: "REVERSED" },
];

const statusVariant: Record<JournalStatus, "success" | "warning" | "danger"> = {
  POSTED: "success",
  DRAFT: "warning",
  REVERSED: "danger",
};

const GeneralLedger = () => {
  const [accounts] = useState(mockLedgerAccounts);
  const [entries, setEntries] = useState<JournalEntry[]>(mockJournalEntries);

  const [accountFilter, setAccountFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState<JournalStatus | "ALL">("ALL");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [search, setSearch] = useState("");
  const [showChart, setShowChart] = useState(true);

  const [adjustmentOpen, setAdjustmentOpen] = useState(false);

  const allRows = useMemo(() => flattenToGLRows(entries, accounts), [entries, accounts]);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    let rows = allRows.filter((row) => {
      const matchesAccount = accountFilter === "ALL" || row.accountId === Number(accountFilter);
      const matchesStatus = statusFilter === "ALL" || row.status === statusFilter;
      const matchesDateFrom = !dateFrom || row.journalDate >= dateFrom;
      const matchesDateTo = !dateTo || row.journalDate <= dateTo;
      const matchesSearch =
        !q ||
        row.journalNo.toLowerCase().includes(q) ||
        row.accountName.toLowerCase().includes(q) ||
        (row.description ?? "").toLowerCase().includes(q);
      return matchesAccount && matchesStatus && matchesDateFrom && matchesDateTo && matchesSearch;
    });

    // Running balance only makes sense for a single selected account
    if (accountFilter !== "ALL") {
      const account = accounts.find((a) => a.id === Number(accountFilter));
      if (account) {
        rows = [...rows].sort((a, b) => (a.journalDate < b.journalDate ? -1 : 1));
        return withRunningBalance(rows, account);
      }
    }
    return rows.sort((a, b) => (a.journalDate < b.journalDate ? 1 : -1));
  }, [allRows, accountFilter, statusFilter, dateFrom, dateTo, search, accounts]);

  const totals = useMemo(() => {
    const debit = filteredRows.reduce((s, r) => s + r.debit, 0);
    const credit = filteredRows.reduce((s, r) => s + r.credit, 0);
    const mismatchedEntries = new Set(filteredRows.filter((r) => !r.entryBalanced).map((r) => r.journalEntryId));
    return { debit, credit, diff: debit - credit, mismatchCount: mismatchedEntries.size };
  }, [filteredRows]);

  const handleAdjustmentSaved = (entry: JournalEntry) => {
    setEntries((prev) => [entry, ...prev]);
  };

  const clearFilters = () => {
    setAccountFilter("ALL");
    setStatusFilter("ALL");
    setDateFrom("");
    setDateTo("");
    setSearch("");
  };

  const isSingleAccount = accountFilter !== "ALL";

  const columns: Column<GLRow>[] = [
    { key: "journalDate", header: "Date", sortable: true },
    {
      key: "journalNo",
      header: "Journal No",
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <span>{row.journalNo}</span>
          {!row.entryBalanced && (
            <span title="Debit and credit totals for this journal entry don't match">
              <AlertTriangle className="h-3.5 w-3.5 text-danger" />
            </span>
          )}
        </div>
      ),
    },
    { key: "accountName", header: "Account", render: (row) => `${row.accountCode} — ${row.accountName}` },
    { key: "description", header: "Description" },
    { key: "sourceModule", header: "Source" },
    {
      key: "debit",
      header: "Debit",
      render: (row) => (row.debit ? row.debit.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "—"),
    },
    {
      key: "credit",
      header: "Credit",
      render: (row) => (row.credit ? row.credit.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "—"),
    },
    ...(isSingleAccount
      ? ([
          {
            key: "balance",
            header: "Balance",
            render: (row) => (
              <span className="font-medium text-secondary">
                {(row.balance ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            ),
          },
        ] as Column<GLRow>[])
      : []),
    {
      key: "status",
      header: "Status",
      render: (row) => <Badge variant={statusVariant[row.status]}>{row.status}</Badge>,
    },
  ];

  return (
    <PageContainer
      title="General Ledger"
      subtitle="View journal entries by account, check balance, and post adjustments"
      breadcrumbs={[{ label: "Accounting" }, { label: "General Ledger" }]}
      icon={<BookOpen className="h-5 w-5" />}
      actions={
        <Button icon={<PlusCircle className="h-4 w-4" />} onClick={() => setAdjustmentOpen(true)}>
          New Adjustment
        </Button>
      }
    >
      {/* Filters */}
      <div className="mb-4 rounded-xl border border-border bg-surface p-4">
        <div className="mb-3 flex items-center gap-1.5 text-sm font-medium text-secondary">
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Select
            label="Account"
            value={accountFilter}
            options={[
              { label: "All Accounts", value: "ALL" },
              ...accounts.map((a) => ({ label: `${a.account_code} — ${a.account_name}`, value: String(a.id) })),
            ]}
            onChange={(e) => setAccountFilter(e.target.value)}
          />
          <Select
            label="Status"
            value={statusFilter}
            options={statusOptions}
            onChange={(e) => setStatusFilter(e.target.value as JournalStatus | "ALL")}
          />
          <Input label="From Date" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          <Input label="To Date" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          <Input
            label="Search"
            placeholder="Journal no, description..."
            icon={<Search className="h-4 w-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="mt-3 flex justify-end">
          <button onClick={clearFilters} className="text-xs font-medium text-primary-dark hover:underline">
            Clear filters
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs text-text-muted">Total Debit</p>
          <p className="mt-1 text-lg font-semibold text-secondary">
            {totals.debit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs text-text-muted">Total Credit</p>
          <p className="mt-1 text-lg font-semibold text-secondary">
            {totals.credit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className={`rounded-xl border p-4 ${totals.diff !== 0 ? "border-danger/40 bg-danger/5" : "border-border bg-surface"}`}>
          <p className="text-xs text-text-muted">Difference</p>
          <p className={`mt-1 text-lg font-semibold ${totals.diff !== 0 ? "text-danger" : "text-success"}`}>
            {totals.diff.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className={`rounded-xl border p-4 ${totals.mismatchCount > 0 ? "border-danger/40 bg-danger/5" : "border-border bg-surface"}`}>
          <p className="text-xs text-text-muted">Mismatched Entries</p>
          <p className={`mt-1 text-lg font-semibold ${totals.mismatchCount > 0 ? "text-danger" : "text-success"}`}>
            {totals.mismatchCount}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="mb-4 rounded-xl border border-border bg-surface p-4">
        <button
          onClick={() => setShowChart((v) => !v)}
          className="mb-3 flex items-center gap-1.5 text-sm font-medium text-secondary"
        >
          <BarChart3 className="h-4 w-4" /> Account Balances {showChart ? "▾" : "▸"}
        </button>
        {showChart && <AccountBalanceChart rows={filteredRows} accounts={accounts} />}
      </div>

      {/* Ledger table */}
      <DataTable columns={columns} data={filteredRows} rowKey="lineId" pageSize={10} loading={false} />

      <AdjustmentEntryModal
        open={adjustmentOpen}
        onClose={() => setAdjustmentOpen(false)}
        onSaved={handleAdjustmentSaved}
        accounts={accounts}
        defaultAccountId={accountFilter !== "ALL" ? Number(accountFilter) : null}
      />
    </PageContainer>
  );
};

export default GeneralLedger;