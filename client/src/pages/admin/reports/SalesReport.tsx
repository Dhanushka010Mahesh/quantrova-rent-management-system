import { useMemo, useState } from "react";
import { LineChart, Search, SlidersHorizontal, TrendingUp } from "lucide-react";
import { itemTypeLabel, mockCreatedByUsers, mockSaleLines, type SaleItemType, type SaleLineRecord } from "../../../types/salesReport";
import type { Column } from "../../../components/ui/table/DataTable";
import Badge from "../../../components/ui/others/Badge";
import PageContainer from "../../../layout/PageContainer";
import Input from "../../../components/ui/input/Input";
import Select from "../../../components/ui/select/Select";
import SalesTrendChart from "../../../components/reports/SalesTrendChart";
import BreakdownBarList from "../../../components/reports/BreakdownBarList";
import DataTable from "../../../components/ui/table/DataTable";
// import PageContainer from "../../layout/PageContainer";
// import Select from "../../components/ui/select/Select";
// import Input from "../../components/ui/input/Input";
// import DataTable, { type Column } from "../../components/ui/table/DataTable";
// import Badge from "../../components/ui/others/Badge";
// import SalesTrendChart from "../../components/salesReport/SalesTrendChart";
// import BreakdownBarList from "../../components/salesReport/BreakdownBarList";
// import { mockSaleLines, mockCreatedByUsers } from "../../data/mockSalesReport";
// import { itemTypeLabel } from "../../types/salesReport";
// import type { SaleLineRecord, SaleItemType } from "../../types/salesReport";

const itemTypeOptions: { label: string; value: SaleItemType | "ALL" }[] = [
  { label: "All Item Types", value: "ALL" },
  { label: "Returnable", value: "RETURNABLE_UNIT" },
  { label: "Returnable Stock", value: "RETURNABLE_STOCK" },
  { label: "Consumable", value: "CONSUMABLE" },
  { label: "Rental + Consumption", value: "RENTAL_PLUS_CONSUMPTION" },
  { label: "Package", value: "PACKAGE" },
  { label: "Sale", value: "SALE" },
];

const itemTypeVariant: Record<SaleItemType, "info" | "success" | "warning" | "neutral" | "danger"> = {
  RETURNABLE_UNIT: "info",
  RETURNABLE_STOCK: "info",
  CONSUMABLE: "warning",
  RENTAL_PLUS_CONSUMPTION: "success",
  PACKAGE: "danger",
  SALE: "neutral",
};

const SalesReport = () => {
  const [rows] = useState<SaleLineRecord[]>(mockSaleLines);

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [customerFilter, setCustomerFilter] = useState("ALL");
  const [itemFilter, setItemFilter] = useState("ALL");
  const [itemTypeFilter, setItemTypeFilter] = useState<SaleItemType | "ALL">("ALL");
  const [createdByFilter, setCreatedByFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const customerOptions = useMemo(() => {
    const map = new Map<string, string>();
    rows.forEach((r) => {
      const key = r.customerId ?? "WALK_IN";
      map.set(key, r.customerName);
    });
    return Array.from(map.entries()).map(([value, label]) => ({ value, label }));
  }, [rows]);

  const itemOptions = useMemo(() => {
    const map = new Map<string, string>();
    rows.forEach((r) => map.set(r.itemId, r.itemName));
    return Array.from(map.entries()).map(([value, label]) => ({ value, label }));
  }, [rows]);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      const customerKey = r.customerId ?? "WALK_IN";
      const matchesDateFrom = !dateFrom || r.date >= dateFrom;
      const matchesDateTo = !dateTo || r.date <= dateTo;
      const matchesCustomer = customerFilter === "ALL" || customerKey === customerFilter;
      const matchesItem = itemFilter === "ALL" || r.itemId === itemFilter;
      const matchesItemType = itemTypeFilter === "ALL" || r.itemType === itemTypeFilter;
      const matchesCreatedBy = createdByFilter === "ALL" || r.createdBy === createdByFilter;
      const matchesSearch =
        !q ||
        r.billNumber.toLowerCase().includes(q) ||
        r.itemName.toLowerCase().includes(q) ||
        r.customerName.toLowerCase().includes(q);
      return (
        matchesDateFrom &&
        matchesDateTo &&
        matchesCustomer &&
        matchesItem &&
        matchesItemType &&
        matchesCreatedBy &&
        matchesSearch
      );
    });
  }, [rows, dateFrom, dateTo, customerFilter, itemFilter, itemTypeFilter, createdByFilter, search]);

  const summary = useMemo(() => {
    const totalRevenue = filteredRows.reduce((s, r) => s + r.amount, 0);
    const totalDiscount = filteredRows.reduce((s, r) => s + r.discount, 0);
    const orderCount = new Set(filteredRows.map((r) => r.orderId)).size;
    const avgOrderValue = orderCount > 0 ? totalRevenue / orderCount : 0;
    return { totalRevenue, totalDiscount, orderCount, avgOrderValue };
  }, [filteredRows]);

  const byItemType = useMemo(() => {
    const map = new Map<SaleItemType, number>();
    filteredRows.forEach((r) => map.set(r.itemType, (map.get(r.itemType) ?? 0) + r.amount));
    return Array.from(map.entries())
      .map(([type, value]) => ({ label: itemTypeLabel(type), value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredRows]);

  const topItems = useMemo(() => {
    const map = new Map<string, number>();
    filteredRows.forEach((r) => map.set(r.itemName, (map.get(r.itemName) ?? 0) + r.amount));
    return Array.from(map.entries())
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [filteredRows]);

  const topCustomers = useMemo(() => {
    const map = new Map<string, number>();
    filteredRows.forEach((r) => map.set(r.customerName, (map.get(r.customerName) ?? 0) + r.amount));
    return Array.from(map.entries())
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [filteredRows]);

  const clearFilters = () => {
    setDateFrom("");
    setDateTo("");
    setCustomerFilter("ALL");
    setItemFilter("ALL");
    setItemTypeFilter("ALL");
    setCreatedByFilter("ALL");
    setSearch("");
  };

  const columns: Column<SaleLineRecord>[] = [
    { key: "date", header: "Date", sortable: true },
    { key: "billNumber", header: "Bill No" },
    { key: "customerName", header: "Customer" },
    { key: "itemName", header: "Item" },
    {
      key: "itemType",
      header: "Type",
      render: (row) => <Badge variant={itemTypeVariant[row.itemType]}>{itemTypeLabel(row.itemType)}</Badge>,
    },
    { key: "quantity", header: "Qty", render: (row) => `${row.quantity} ${row.unit}` },
    { key: "rate", header: "Rate", render: (row) => row.rate.toLocaleString(undefined, { minimumFractionDigits: 2 }) },
    {
      key: "discount",
      header: "Discount",
      render: (row) => (row.discount ? row.discount.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "—"),
    },
    {
      key: "amount",
      header: "Amount",
      render: (row) => (
        <span className="font-medium text-secondary">{row.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
      ),
    },
    { key: "createdBy", header: "Created By" },
  ];

  return (
    <PageContainer
      title="Sales Report"
      subtitle="Full picture of rental and sale transactions"
      breadcrumbs={[{ label: "Reports" }, { label: "Sales Report" }]}
      icon={<TrendingUp className="h-5 w-5" />}
    >
      {/* Filters */}
      <div className="mb-4 rounded-xl border border-border bg-surface p-4">
        <div className="mb-3 flex items-center gap-1.5 text-sm font-medium text-secondary">
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <Input label="From Date" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          <Input label="To Date" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          <Select
            label="Customer"
            value={customerFilter}
            options={[{ label: "All Customers", value: "ALL" }, ...customerOptions]}
            onChange={(e) => setCustomerFilter(e.target.value)}
          />
          <Select
            label="Item"
            value={itemFilter}
            options={[{ label: "All Items", value: "ALL" }, ...itemOptions]}
            onChange={(e) => setItemFilter(e.target.value)}
          />
          <Select
            label="Item Type"
            value={itemTypeFilter}
            options={itemTypeOptions}
            onChange={(e) => setItemTypeFilter(e.target.value as SaleItemType | "ALL")}
          />
          <Select
            label="Created By"
            value={createdByFilter}
            options={[{ label: "All Users", value: "ALL" }, ...mockCreatedByUsers.map((u) => ({ label: u, value: u }))]}
            onChange={(e) => setCreatedByFilter(e.target.value)}
          />
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="max-w-xs flex-1">
            <Input
              placeholder="Search bill no, item, customer..."
              icon={<Search className="h-4 w-4" />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button onClick={clearFilters} className="text-xs font-medium text-primary-dark hover:underline">
            Clear filters
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs text-text-muted">Total Revenue</p>
          <p className="mt-1 text-lg font-semibold text-primary-dark">
            {summary.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs text-text-muted">Orders</p>
          <p className="mt-1 text-lg font-semibold text-secondary">{summary.orderCount}</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs text-text-muted">Avg. Order Value</p>
          <p className="mt-1 text-lg font-semibold text-secondary">
            {summary.avgOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs text-text-muted">Total Discount Given</p>
          <p className="mt-1 text-lg font-semibold text-accent-coral">
            {summary.totalDiscount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-surface p-4 lg:col-span-2">
          <div className="mb-3 flex items-center gap-1.5 text-sm font-medium text-secondary">
            <LineChart className="h-4 w-4" /> Revenue Trend
          </div>
          <SalesTrendChart rows={filteredRows} />
        </div>

        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="mb-3 text-sm font-medium text-secondary">Revenue by Item Type</p>
          <BreakdownBarList data={byItemType} formatValue={(v) => v.toLocaleString(undefined, { maximumFractionDigits: 0 })} />
        </div>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="mb-3 text-sm font-medium text-secondary">Top Items by Revenue</p>
          <BreakdownBarList data={topItems} formatValue={(v) => v.toLocaleString(undefined, { maximumFractionDigits: 0 })} />
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="mb-3 text-sm font-medium text-secondary">Top Customers by Revenue</p>
          <BreakdownBarList data={topCustomers} formatValue={(v) => v.toLocaleString(undefined, { maximumFractionDigits: 0 })} />
        </div>
      </div>

      {/* Detail table */}
      <DataTable columns={columns} data={filteredRows} rowKey="id" pageSize={10} loading={false} />
    </PageContainer>
  );
};

export default SalesReport;