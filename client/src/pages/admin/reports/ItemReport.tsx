// src/pages/rental/ItemReport.tsx

import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  CircleDollarSign,
  ClipboardCheck,
  Clock3,
  Coins,
  Package,
  PackageCheck,
  RefreshCw,
  Settings,
  TrendingUp,
  Wrench,
} from "lucide-react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  Line,
  LineChart,
} from "recharts";

// import PageContainer from "../../layout/PageContainer";
// import Select from "../../components/ui/select/Select";
// import Badge from "../../components/ui/others/Badge";

import {
  maintenanceHistory,
  monthlyPerformance,
  otherExpenses,
  priceHistory,
  rentalHistory,
  reportItems,
  type ItemStatus,
} from "./reportData";
import PageContainer from "../../../layout/PageContainer";
import Select from "../../../components/ui/select/Select";
import Badge from "../../../components/ui/others/Badge";

const money = (value: number) =>
  value.toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const compactMoney = (value: number) => {
  if (value >= 1_000_000) {
    return `Rs. ${(value / 1_000_000).toFixed(2)}M`;
  }

  if (value >= 1_000) {
    return `Rs. ${(value / 1_000).toFixed(0)}K`;
  }

  return `Rs. ${value.toLocaleString()}`;
};

const statusVariant = (status: ItemStatus) => {
  switch (status) {
    case "AVAILABLE":
      return "success";

    case "RENTED":
      return "warning";

    case "MAINTENANCE":
      return "danger";

    default:
      return "neutral";
  }
};

const ItemReport = () => {
  const [selectedItemId, setSelectedItemId] = useState(reportItems[0]?.id ?? "");
  const [period, setPeriod] = useState("6_MONTHS");

  const selectedItem = useMemo(
    () => reportItems.find((item) => item.id === selectedItemId) ?? reportItems[0],
    [selectedItemId]
  );

  const itemRentals = useMemo(
    () => rentalHistory.filter((rental) => rental.itemId === selectedItem?.id),
    [selectedItem]
  );

  const itemMaintenance = useMemo(
    () =>
      maintenanceHistory.filter(
        (maintenance) => maintenance.itemId === selectedItem?.id
      ),
    [selectedItem]
  );

  const itemOtherExpenses = useMemo(
    () =>
      otherExpenses.filter((expense) => expense.itemId === selectedItem?.id),
    [selectedItem]
  );

  const itemPrices = useMemo(
    () =>
      priceHistory
        .filter((price) => price.itemId === selectedItem?.id)
        .sort((a, b) => a.date.localeCompare(b.date)),
    [selectedItem]
  );

  const performanceData = useMemo(() => {
    const data = monthlyPerformance[selectedItem?.id ?? ""] ?? [];

    if (period === "3_MONTHS") {
      return data.slice(-3);
    }

    if (period === "12_MONTHS") {
      return data;
    }

    return data.slice(-6);
  }, [selectedItem, period]);

  const expenseBreakdown = useMemo(() => {
    const maintenance = selectedItem?.totalMaintenanceExpense ?? 0;
    const other = selectedItem?.totalOtherExpense ?? 0;

    return [
      {
        name: "Maintenance",
        value: maintenance,
      },
      {
        name: "Other Expenses",
        value: other,
      },
    ];
  }, [selectedItem]);

  const averageRentalValue = useMemo(() => {
    if (!selectedItem?.totalRentals) return 0;

    return selectedItem.totalRentalIncome / selectedItem.totalRentals;
  }, [selectedItem]);

  const totalExpenses = useMemo(() => {
    if (!selectedItem) return 0;

    return (
      selectedItem.totalMaintenanceExpense + selectedItem.totalOtherExpense
    );
  }, [selectedItem]);

  const profitMargin = useMemo(() => {
    if (!selectedItem?.totalRentalIncome) return 0;

    return (selectedItem.netIncome / selectedItem.totalRentalIncome) * 100;
  }, [selectedItem]);

  const latestRentalRate = useMemo(() => {
    const rates = itemPrices.filter((price) => price.type === "RENTAL_RATE");

    return rates.length ? rates[rates.length - 1].newPrice : 0;
  }, [itemPrices]);

  if (!selectedItem) {
    return (
      <PageContainer
        title="Item Report"
        subtitle="Detailed rental and financial performance of an item"
        breadcrumbs={[
          { label: "Rental" },
          { label: "Reports" },
          { label: "Item Report" },
        ]}
        icon={<Package className="h-5 w-5" />}
      >
        <div className="rounded-xl border border-border bg-surface p-8 text-center">
          No items available.
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Item Report"
      subtitle="Detailed rental, financial, maintenance and performance analysis"
      breadcrumbs={[
        { label: "Rental" },
        { label: "Reports" },
        { label: "Item Report" },
      ]}
      icon={<Package className="h-5 w-5" />}
    >
      <div className="flex flex-col gap-5">
        {/* ============================================================
            ITEM SELECTOR
        ============================================================ */}

        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
                Select Item
              </p>

              <p className="mt-1 text-lg font-semibold text-secondary">
                Item Performance Report
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="min-w-[280px]">
                <Select
                  value={selectedItem.id}
                  options={reportItems.map((item) => ({
                    label: `${item.code} — ${item.name}`,
                    value: item.id,
                  }))}
                  onChange={(e) => setSelectedItemId(e.target.value)}
                />
              </div>

              <div className="min-w-[150px]">
                <Select
                  value={period}
                  options={[
                    { label: "Last 3 Months", value: "3_MONTHS" },
                    { label: "Last 6 Months", value: "6_MONTHS" },
                    { label: "Last 12 Months", value: "12_MONTHS" },
                  ]}
                  onChange={(e) => setPeriod(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================
            ITEM HEADER
        ============================================================ */}

        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Package className="h-7 w-7 text-primary-dark" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-semibold text-secondary">
                    {selectedItem.name}
                  </h2>

                  <Badge variant={statusVariant(selectedItem.status)}>
                    {selectedItem.status}
                  </Badge>
                </div>

                <p className="mt-1 text-sm text-text-muted">
                  {selectedItem.code} · {selectedItem.category}
                </p>

                <p className="mt-2 max-w-2xl text-xs text-text-muted">
                  {selectedItem.description}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm sm:grid-cols-4">
              <div>
                <p className="text-xs text-text-muted">Brand</p>
                <p className="font-medium text-secondary">{selectedItem.brand}</p>
              </div>

              <div>
                <p className="text-xs text-text-muted">Model</p>
                <p className="font-medium text-secondary">{selectedItem.model}</p>
              </div>

              <div>
                <p className="text-xs text-text-muted">Serial No.</p>
                <p className="font-medium text-secondary">
                  {selectedItem.serialNumber}
                </p>
              </div>

              <div>
                <p className="text-xs text-text-muted">Purchased</p>
                <p className="font-medium text-secondary">
                  {selectedItem.purchaseDate}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================
            KPI CARDS
        ============================================================ */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Total Rental Income"
            value={compactMoney(selectedItem.totalRentalIncome)}
            description={`${selectedItem.totalRentals} completed/active rentals`}
            icon={<CircleDollarSign className="h-5 w-5" />}
            positive
          />

          <MetricCard
            title="Net Income"
            value={compactMoney(selectedItem.netIncome)}
            description={`${profitMargin.toFixed(1)}% profit margin`}
            icon={<TrendingUp className="h-5 w-5" />}
            positive
          />

          <MetricCard
            title="Total Expenses"
            value={compactMoney(totalExpenses)}
            description="Maintenance + other expenses"
            icon={<ArrowDownRight className="h-5 w-5" />}
          />

          <MetricCard
            title="Utilization"
            value={`${selectedItem.utilizationRate}%`}
            description={`${selectedItem.totalRentalDays} total rental days`}
            icon={<Activity className="h-5 w-5" />}
            positive={selectedItem.utilizationRate >= 70}
          />
        </div>

        {/* ============================================================
            FINANCIAL SUMMARY
        ============================================================ */}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <SummaryCard
            title="Asset Value"
            icon={<Coins className="h-5 w-5" />}
          >
            <SummaryRow
              label="Purchase Price"
              value={`Rs. ${money(selectedItem.purchasePrice)}`}
            />

            <SummaryRow
              label="Current Value"
              value={`Rs. ${money(selectedItem.currentValue)}`}
            />

            <SummaryRow
              label="Value Depreciation"
              value={`Rs. ${money(
                selectedItem.purchasePrice - selectedItem.currentValue
              )}`}
            />
          </SummaryCard>

          <SummaryCard
            title="Rental Pricing"
            icon={<CircleDollarSign className="h-5 w-5" />}
          >
            <SummaryRow
              label="Daily Rate"
              value={`Rs. ${money(selectedItem.rentalRateDaily)}`}
            />

            <SummaryRow
              label="Weekly Rate"
              value={`Rs. ${money(selectedItem.rentalRateWeekly)}`}
            />

            <SummaryRow
              label="Monthly Rate"
              value={`Rs. ${money(selectedItem.rentalRateMonthly)}`}
            />

            <SummaryRow
              label="Average / Rental"
              value={`Rs. ${money(averageRentalValue)}`}
            />
          </SummaryCard>

          <SummaryCard
            title="Maintenance"
            icon={<Wrench className="h-5 w-5" />}
          >
            <SummaryRow
              label="Total Maintenance"
              value={`Rs. ${money(selectedItem.totalMaintenanceExpense)}`}
            />

            <SummaryRow
              label="Last Maintenance"
              value={selectedItem.lastMaintenanceDate}
            />

            <SummaryRow
              label="Next Maintenance"
              value={selectedItem.nextMaintenanceDate}
            />

            <SummaryRow
              label="Maintenance Records"
              value={String(itemMaintenance.length)}
            />
          </SummaryCard>
        </div>

        {/* ============================================================
            CHARTS
        ============================================================ */}

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-7">
          {/* Income / Expense Chart */}

          <div className="rounded-xl border border-border bg-surface p-4 xl:col-span-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-secondary">
                  Income vs Expenses
                </p>

                <p className="mt-0.5 text-xs text-text-muted">
                  Monthly financial performance
                </p>
              </div>

              <TrendingUp className="h-4 w-4 text-primary-dark" />
            </div>

            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />

                  <XAxis dataKey="month" fontSize={12} />

                  <YAxis
                    fontSize={11}
                    tickFormatter={(value) => compactMoney(value)}
                  />

                  <Tooltip
                    formatter={(value: any) =>
                      `Rs. ${money(value ?? 0)}`
                    }
                  />

                  <Legend />

                  <Bar
                    dataKey="rentalIncome"
                    name="Rental Income"
                    radius={[4, 4, 0, 0]}
                  />

                  <Bar
                    dataKey="maintenanceExpense"
                    name="Maintenance"
                    radius={[4, 4, 0, 0]}
                  />

                  <Bar
                    dataKey="otherExpense"
                    name="Other Expense"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Expense Pie */}

          <div className="rounded-xl border border-border bg-surface p-4 xl:col-span-3">
            <div className="mb-4">
              <p className="text-sm font-semibold text-secondary">
                Expense Breakdown
              </p>

              <p className="mt-0.5 text-xs text-text-muted">
                Where money is being spent
              </p>
            </div>

            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseBreakdown}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={55}
                    paddingAngle={3}
                  >
                    {expenseBreakdown.map((entry, index) => (
                      <Cell key={`${entry.name}-${index}`} />
                    ))}
                  </Pie>

                  <Tooltip
                    formatter={(value: any) =>
                      `Rs. ${money(value ?? 0)}`
                    }
                  />

                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ============================================================
            UTILIZATION + INCOME TREND
        ============================================================ */}

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <div className="rounded-xl border border-border bg-surface p-4">
            <div className="mb-4">
              <p className="text-sm font-semibold text-secondary">
                Rental Income Trend
              </p>

              <p className="mt-0.5 text-xs text-text-muted">
                Monthly rental revenue
              </p>
            </div>

            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />

                  <XAxis dataKey="month" fontSize={12} />

                  <YAxis
                    fontSize={11}
                    tickFormatter={(value) => compactMoney(value)}
                  />

                  <Tooltip
                    formatter={(value: any) =>
                      `Rs. ${money(value ?? 0)}`
                    }
                  />

                  <Line
                    type="monotone"
                    dataKey="rentalIncome"
                    name="Rental Income"
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface p-4">
            <div className="mb-4">
              <p className="text-sm font-semibold text-secondary">
                Rental Activity
              </p>

              <p className="mt-0.5 text-xs text-text-muted">
                Rental count and days per month
              </p>
            </div>

            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />

                  <XAxis dataKey="month" fontSize={12} />

                  <YAxis fontSize={11} />

                  <Tooltip />

                  <Legend />

                  <Bar
                    dataKey="rentalDays"
                    name="Rental Days"
                    radius={[4, 4, 0, 0]}
                  />

                  <Bar
                    dataKey="rentalCount"
                    name="Rental Count"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ============================================================
            PRICE HISTORY
        ============================================================ */}

        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-secondary">
                Price History
              </p>

              <p className="mt-0.5 text-xs text-text-muted">
                Rental rate and asset price changes
              </p>
            </div>

            <RefreshCw className="h-4 w-4 text-text-muted" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-text-muted">
                  <th className="px-3 py-3 font-medium">Date</th>
                  <th className="px-3 py-3 font-medium">Type</th>
                  <th className="px-3 py-3 font-medium">Description</th>
                  <th className="px-3 py-3 text-right font-medium">
                    Previous
                  </th>
                  <th className="px-3 py-3 text-right font-medium">New</th>
                  <th className="px-3 py-3 text-right font-medium">
                    Change
                  </th>
                  <th className="px-3 py-3 font-medium">Reason</th>
                </tr>
              </thead>

              <tbody>
                {itemPrices.map((price) => {
                  const change = price.newPrice - price.oldPrice;

                  return (
                    <tr
                      key={price.id}
                      className="border-b border-border last:border-0"
                    >
                      <td className="px-3 py-3 text-text-muted">
                        {price.date}
                      </td>

                      <td className="px-3 py-3">
                        <Badge variant="neutral">
                          {price.type.replace("_", " ")}
                        </Badge>
                      </td>

                      <td className="px-3 py-3 font-medium text-secondary">
                        {price.label}
                      </td>

                      <td className="px-3 py-3 text-right text-text-muted">
                        {price.oldPrice
                          ? `Rs. ${money(price.oldPrice)}`
                          : "—"}
                      </td>

                      <td className="px-3 py-3 text-right font-medium text-secondary">
                        Rs. {money(price.newPrice)}
                      </td>

                      <td className="px-3 py-3 text-right">
                        {price.oldPrice ? (
                          <span
                            className={
                              change >= 0
                                ? "inline-flex items-center gap-1 text-success"
                                : "inline-flex items-center gap-1 text-danger"
                            }
                          >
                            {change >= 0 ? (
                              <ArrowUpRight className="h-3.5 w-3.5" />
                            ) : (
                              <ArrowDownRight className="h-3.5 w-3.5" />
                            )}

                            {Math.abs(change).toLocaleString()}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>

                      <td className="px-3 py-3 text-text-muted">
                        {price.reason}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ============================================================
            RENTAL HISTORY
        ============================================================ */}

        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-secondary">
                Rental History
              </p>

              <p className="mt-0.5 text-xs text-text-muted">
                All rental transactions for this item
              </p>
            </div>

            <PackageCheck className="h-4 w-4 text-text-muted" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-text-muted">
                  <th className="px-3 py-3 font-medium">Rental No.</th>
                  <th className="px-3 py-3 font-medium">Customer</th>
                  <th className="px-3 py-3 font-medium">Start</th>
                  <th className="px-3 py-3 font-medium">Return</th>
                  <th className="px-3 py-3 text-right font-medium">Days</th>
                  <th className="px-3 py-3 text-right font-medium">Rate</th>
                  <th className="px-3 py-3 text-right font-medium">Income</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                </tr>
              </thead>

              <tbody>
                {itemRentals.map((rental) => (
                  <tr
                    key={rental.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-3 py-3 font-medium text-primary-dark">
                      {rental.rentalNumber}
                    </td>

                    <td className="px-3 py-3 text-secondary">
                      {rental.customer}
                    </td>

                    <td className="px-3 py-3 text-text-muted">
                      {rental.startDate}
                    </td>

                    <td className="px-3 py-3 text-text-muted">
                      {rental.returnDate}
                    </td>

                    <td className="px-3 py-3 text-right">
                      {rental.days}
                    </td>

                    <td className="px-3 py-3 text-right">
                      Rs. {money(rental.rate)}
                    </td>

                    <td className="px-3 py-3 text-right font-medium text-secondary">
                      Rs. {money(rental.income)}
                    </td>

                    <td className="px-3 py-3">
                      <Badge
                        variant={
                          rental.status === "ACTIVE"
                            ? "warning"
                            : rental.status === "OVERDUE"
                              ? "danger"
                              : "success"
                        }
                      >
                        {rental.status}
                      </Badge>
                    </td>
                  </tr>
                ))}

                {itemRentals.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-3 py-8 text-center text-sm text-text-muted"
                    >
                      No rental records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ============================================================
            MAINTENANCE + OTHER EXPENSES
        ============================================================ */}

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <div className="rounded-xl border border-border bg-surface p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-secondary">
                  Maintenance History
                </p>

                <p className="mt-0.5 text-xs text-text-muted">
                  Service, repair and inspection costs
                </p>
              </div>

              <Wrench className="h-4 w-4 text-text-muted" />
            </div>

            <div className="flex flex-col divide-y divide-border">
              {itemMaintenance.map((maintenance) => (
                <div
                  key={maintenance.id}
                  className="flex gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background">
                    {maintenance.type === "REPAIR" ? (
                      <Settings className="h-4 w-4 text-danger" />
                    ) : maintenance.type === "SERVICE" ? (
                      <Wrench className="h-4 w-4 text-primary-dark" />
                    ) : (
                      <ClipboardCheck className="h-4 w-4 text-success" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-secondary">
                          {maintenance.description}
                        </p>

                        <p className="mt-0.5 text-xs text-text-muted">
                          {maintenance.date} · {maintenance.technician}
                        </p>
                      </div>

                      <p className="shrink-0 text-sm font-semibold text-secondary">
                        Rs. {money(maintenance.cost)}
                      </p>
                    </div>

                    <div className="mt-2">
                      <Badge
                        variant={
                          maintenance.status === "COMPLETED"
                            ? "success"
                            : "warning"
                        }
                      >
                        {maintenance.type}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}

              {itemMaintenance.length === 0 && (
                <p className="py-5 text-center text-sm text-text-muted">
                  No maintenance records.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-secondary">
                  Other Expenses
                </p>

                <p className="mt-0.5 text-xs text-text-muted">
                  Expenses outside maintenance
                </p>
              </div>

              <ArrowDownRight className="h-4 w-4 text-text-muted" />
            </div>

            <div className="flex flex-col divide-y divide-border">
              {itemOtherExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                >
                  <div>
                    <p className="text-sm font-medium text-secondary">
                      {expense.description}
                    </p>

                    <p className="mt-0.5 text-xs text-text-muted">
                      {expense.date} · {expense.category}
                    </p>
                  </div>

                  <p className="shrink-0 text-sm font-semibold text-secondary">
                    Rs. {money(expense.amount)}
                  </p>
                </div>
              ))}

              {itemOtherExpenses.length === 0 && (
                <p className="py-5 text-center text-sm text-text-muted">
                  No other expenses.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ============================================================
            PROFITABILITY
        ============================================================ */}

        <div className="rounded-xl border border-border bg-secondary/5 p-5">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary-dark" />

            <div>
              <p className="text-sm font-semibold text-secondary">
                Item Profitability
              </p>

              <p className="text-xs text-text-muted">
                Overall financial performance of this asset
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <ProfitBox
              label="Rental Income"
              value={selectedItem.totalRentalIncome}
            />

            <ProfitBox
              label="Maintenance"
              value={selectedItem.totalMaintenanceExpense}
              negative
            />

            <ProfitBox
              label="Other Expenses"
              value={selectedItem.totalOtherExpense}
              negative
            />

            <ProfitBox
              label="Net Income"
              value={selectedItem.netIncome}
              highlight
            />
          </div>

          <div className="mt-5 border-t border-border pt-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs text-text-muted">Return on Asset Cost</p>

                <p className="mt-1 text-lg font-semibold text-secondary">
                  {(
                    (selectedItem.netIncome / selectedItem.purchasePrice) *
                    100
                  ).toFixed(2)}
                  %
                </p>
              </div>

              <div>
                <p className="text-xs text-text-muted">Current Daily Rate</p>

                <p className="mt-1 text-lg font-semibold text-secondary">
                  Rs. {money(latestRentalRate || selectedItem.rentalRateDaily)}
                </p>
              </div>

              <div>
                <p className="text-xs text-text-muted">Average Income / Rental</p>

                <p className="mt-1 text-lg font-semibold text-secondary">
                  Rs. {money(averageRentalValue)}
                </p>
              </div>

              <div>
                <p className="text-xs text-text-muted">Next Maintenance</p>

                <p className="mt-1 flex items-center gap-1 text-lg font-semibold text-secondary">
                  <CalendarDays className="h-4 w-4" />
                  {selectedItem.nextMaintenanceDate}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================
            QUICK INSIGHTS
        ============================================================ */}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <InsightCard
            icon={<TrendingUp className="h-5 w-5" />}
            title="Strong Revenue"
            text={`This item has generated Rs. ${money(
              selectedItem.totalRentalIncome
            )} from ${selectedItem.totalRentals} rental transactions.`}
          />

          <InsightCard
            icon={<Clock3 className="h-5 w-5" />}
            title="Utilization"
            text={`The item has been utilized ${selectedItem.utilizationRate}% of the available rental period.`}
          />

          <InsightCard
            icon={<AlertTriangle className="h-5 w-5" />}
            title="Maintenance"
            text={`Next maintenance is scheduled for ${selectedItem.nextMaintenanceDate}.`}
          />
        </div>
      </div>
    </PageContainer>
  );
};

/* ================================================================
   COMPONENTS
================================================================ */

interface MetricCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  positive?: boolean;
}

const MetricCard = ({
  title,
  value,
  description,
  icon,
  positive,
}: MetricCardProps) => {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="flex items-start justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-background">
          {icon}
        </div>

        {positive !== undefined && (
          <span
            className={
              positive
                ? "text-xs font-medium text-success"
                : "text-xs font-medium text-danger"
            }
          >
            {positive ? "Positive" : "Expense"}
          </span>
        )}
      </div>

      <p className="mt-4 text-xs text-text-muted">{title}</p>

      <p className="mt-1 text-xl font-semibold text-secondary">{value}</p>

      <p className="mt-1 text-xs text-text-muted">{description}</p>
    </div>
  );
};

const SummaryCard = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="mb-3 flex items-center gap-2">
        {icon}

        <p className="text-sm font-semibold text-secondary">{title}</p>
      </div>

      <div className="flex flex-col divide-y divide-border">{children}</div>
    </div>
  );
};

const SummaryRow = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <span className="text-xs text-text-muted">{label}</span>

      <span className="text-sm font-medium text-secondary">{value}</span>
    </div>
  );
};

const ProfitBox = ({
  label,
  value,
  negative,
  highlight,
}: {
  label: string;
  value: number;
  negative?: boolean;
  highlight?: boolean;
}) => {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <p className="text-xs text-text-muted">{label}</p>

      <p
        className={
          highlight
            ? "mt-1 text-lg font-semibold text-primary-dark"
            : negative
              ? "mt-1 text-lg font-semibold text-danger"
              : "mt-1 text-lg font-semibold text-secondary"
        }
      >
        {negative ? "-" : ""}Rs. {money(value)}
      </p>
    </div>
  );
};

const InsightCard = ({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) => {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="flex items-center gap-2">
        {icon}

        <p className="text-sm font-semibold text-secondary">{title}</p>
      </div>

      <p className="mt-2 text-xs leading-5 text-text-muted">{text}</p>
    </div>
  );
};

export default ItemReport;