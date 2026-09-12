import { useMemo, useState } from "react";
import { PieChart, TrendingUp, TrendingDown, Wallet, SlidersHorizontal } from "lucide-react";
import { calculatePLSummary, groupByCategory, groupByMonth, mockExpenseEntries, mockRevenueEntries, type ExpenseEntry, type RevenueEntry } from "../../../types/profitLoss";
import type { Column } from "../../../components/ui/table/DataTable";
import PageContainer from "../../../layout/PageContainer";
import Input from "../../../components/ui/input/Input";
import Select from "../../../components/ui/select/Select";
import RevenueExpenseTrendChart from "../../../components/reports/RevenueExpenseTrendChart";
import CategoryBreakdownTable from "../../../components/reports/CategoryBreakdownTable";
import DataTable from "../../../components/ui/table/DataTable";
// import PageContainer from "../../layout/PageContainer";
// import Input from "../../components/ui/input/Input";
// import Select from "../../components/ui/select/Select";
// import DataTable, { type Column } from "../../components/ui/table/DataTable";
// import RevenueExpenseTrendChart from "../../components/profitLoss/RevenueExpenseTrendChart";
// import CategoryBreakdownTable from "../../components/profitLoss/CategoryBreakdownTable";
// import { mockRevenueEntries, mockExpenseEntries } from "../../data/mockProfitLoss";
// import { calculatePLSummary, groupByCategory, groupByMonth } from "../../types/profitLoss";
// import type { RevenueEntry, ExpenseEntry } from "../../types/profitLoss";

type ViewMode = "ALL" | "REVENUE" | "EXPENSE";

const ProfitLossReport = () => {
  const [revenue] = useState<RevenueEntry[]>(mockRevenueEntries);
  const [expenses] = useState<ExpenseEntry[]>(mockExpenseEntries);

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("ALL");

  const filteredRevenue = useMemo(
    () => revenue.filter((r) => (!dateFrom || r.date >= dateFrom) && (!dateTo || r.date <= dateTo)),
    [revenue, dateFrom, dateTo]
  );
  const filteredExpenses = useMemo(
    () => expenses.filter((e) => (!dateFrom || e.date >= dateFrom) && (!dateTo || e.date <= dateTo)),
    [expenses, dateFrom, dateTo]
  );

  const summary = useMemo(() => calculatePLSummary(filteredRevenue, filteredExpenses), [filteredRevenue, filteredExpenses]);
  const revenueByCategory = useMemo(() => groupByCategory(filteredRevenue), [filteredRevenue]);
  const expenseByCategory = useMemo(() => groupByCategory(filteredExpenses), [filteredExpenses]);
  const revenueByMonth = useMemo(() => groupByMonth(filteredRevenue), [filteredRevenue]);
  const expenseByMonth = useMemo(() => groupByMonth(filteredExpenses), [filteredExpenses]);

  const clearFilters = () => {
    setDateFrom("");
    setDateTo("");
  };

  const combinedRows = useMemo(() => {
    const revRows = filteredRevenue.map((r) => ({ ...r, kind: "Revenue" as const }));
    const expRows = filteredExpenses.map((e) => ({ ...e, kind: "Expense" as const }));
    let rows = [...revRows, ...expRows];
    if (viewMode === "REVENUE") rows = revRows;
    if (viewMode === "EXPENSE") rows = expRows;
    return rows.sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [filteredRevenue, filteredExpenses, viewMode]);

  const columns: Column<(typeof combinedRows)[number]>[] = [
    { key: "date", header: "Date", sortable: true },
    {
      key: "kind",
      header: "Type",
      render: (row) => (
        <span className={`text-xs font-medium ${row.kind === "Revenue" ? "text-success" : "text-danger"}`}>
          {row.kind}
        </span>
      ),
    },
    { key: "category", header: "Category" },
    { key: "description", header: "Description" },
    {
      key: "amount",
      header: "Amount",
      render: (row) => (
        <span className={`font-medium ${row.kind === "Revenue" ? "text-success" : "text-danger"}`}>
          {row.kind === "Revenue" ? "+" : "−"}
          {row.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      ),
    },
  ];

  return (
    <PageContainer
      title="Profit & Loss Report"
      subtitle="Revenue, expenses, and net profit over the selected period"
      breadcrumbs={[{ label: "Reports" }, { label: "Profit & Loss" }]}
      icon={<PieChart className="h-5 w-5" />}
    >
      {/* Filters */}
      <div className="mb-4 rounded-xl border border-border bg-surface p-4">
        <div className="mb-3 flex items-center gap-1.5 text-sm font-medium text-secondary">
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Input label="From Date" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          <Input label="To Date" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          <Select
            label="View"
            value={viewMode}
            options={[
              { label: "Revenue & Expense", value: "ALL" },
              { label: "Revenue Only", value: "REVENUE" },
              { label: "Expense Only", value: "EXPENSE" },
            ]}
            onChange={(e) => setViewMode(e.target.value as ViewMode)}
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
          <div className="mb-1 flex items-center gap-1.5 text-xs text-text-muted">
            <TrendingUp className="h-3.5 w-3.5 text-success" /> Total Revenue
          </div>
          <p className="text-lg font-semibold text-success">
            {summary.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="mb-1 flex items-center gap-1.5 text-xs text-text-muted">
            <TrendingDown className="h-3.5 w-3.5 text-danger" /> Total Expense
          </div>
          <p className="text-lg font-semibold text-danger">
            {summary.totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className={`rounded-xl border p-4 ${summary.netProfit >= 0 ? "border-success/30 bg-success/5" : "border-danger/30 bg-danger/5"}`}>
          <div className="mb-1 flex items-center gap-1.5 text-xs text-text-muted">
            <Wallet className="h-3.5 w-3.5" /> Net Profit
          </div>
          <p className={`text-lg font-semibold ${summary.netProfit >= 0 ? "text-success" : "text-danger"}`}>
            {summary.netProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="mb-1 text-xs text-text-muted">Profit Margin</p>
          <p className={`text-lg font-semibold ${summary.profitMargin >= 0 ? "text-secondary" : "text-danger"}`}>
            {summary.profitMargin.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Trend chart */}
      <div className="mb-4 rounded-xl border border-border bg-surface p-4">
        <p className="mb-3 text-sm font-medium text-secondary">Revenue vs Expense Trend</p>
        <RevenueExpenseTrendChart revenueByMonth={revenueByMonth} expenseByMonth={expenseByMonth} />
      </div>

      {/* Category breakdowns */}
      <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <CategoryBreakdownTable title="Revenue by Category" data={revenueByCategory} total={summary.totalRevenue} accent="success" />
        <CategoryBreakdownTable title="Expense by Category" data={expenseByCategory} total={summary.totalExpense} accent="danger" />
      </div>

      {/* Detail table */}
      <DataTable columns={columns} data={combinedRows} rowKey="id" pageSize={10} loading={false} />
    </PageContainer>
  );
};

export default ProfitLossReport;