import { useMemo, useState } from "react";
import {
  Building2,
  CreditCard,
  FileText,
  Landmark,
  Phone,
  ReceiptText,
  TrendingDown,
  TrendingUp,
  UserRound,
  Wallet,
} from "lucide-react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  supplierPaymentRecords,
  supplierPurchaseRecords,
  supplierReportData,
  supplierTransactionRecords,
} from "./reportData";
import PageContainer from "../../../layout/PageContainer";
import Select from "../../../components/ui/select/Select";
import Badge from "../../../components/ui/others/Badge";
import type { TdProps } from "../../../types/menu";

const money = (value: number) =>
  value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const SupplierReport = () => {
  const [supplierId, setSupplierId] = useState(supplierReportData[0]?.id ?? "");

  const supplier = supplierReportData.find((item) => item.id === supplierId);

  const purchases = useMemo(
    () =>
      supplierPurchaseRecords
        .filter((item) => item.supplierId === supplierId)
        .sort((a, b) => b.date.localeCompare(a.date)),
    [supplierId],
  );

  const transactions = useMemo(
    () =>
      supplierTransactionRecords
        .filter((item) => item.supplierId === supplierId)
        .sort((a, b) => b.date.localeCompare(a.date)),
    [supplierId],
  );

  const payments = useMemo(
    () =>
      supplierPaymentRecords
        .filter((item) => item.supplierId === supplierId)
        .sort((a, b) => b.date.localeCompare(a.date)),
    [supplierId],
  );

  const purchaseChart = useMemo(
    () =>
      [...purchases].reverse().map((item) => ({
        month: item.date.slice(0, 7),
        purchase: item.netAmount,
        paid: item.paidAmount,
        balance: item.balance,
      })),
    [purchases],
  );

  const creditDebitChart = useMemo(() => {
    const grouped: Record<
      string,
      { period: string; credit: number; debit: number }
    > = {};

    transactions.forEach((item) => {
      const period = item.date.slice(0, 7);

      if (!grouped[period]) {
        grouped[period] = {
          period,
          credit: 0,
          debit: 0,
        };
      }

      if (item.type === "CREDIT") {
        grouped[period].credit += item.amount;
      } else {
        grouped[period].debit += item.amount;
      }
    });

    return Object.values(grouped).sort((a, b) =>
      a.period.localeCompare(b.period),
    );
  }, [transactions]);

  if (!supplier) {
    return (
      <PageContainer
        title="Supplier Report"
        subtitle="Supplier purchase and payment overview"
        breadcrumbs={[{ label: "Suppliers" }, { label: "Supplier Report" }]}
        icon={<Building2 className="h-5 w-5" />}
      >
        <div className="rounded-xl border border-border bg-surface p-6">
          Supplier not found.
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Supplier Report"
      subtitle="Supplier profile, purchases, payments and account balance"
      breadcrumbs={[{ label: "Suppliers" }, { label: "Supplier Report" }]}
      icon={<Building2 className="h-5 w-5" />}
    >
      <div className="flex flex-col gap-4">
        {/* Supplier selector */}
        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="w-full md:max-w-lg">
              <Select
                label="Select Supplier"
                value={supplierId}
                options={supplierReportData.map((item) => ({
                  label: `${item.supplierCode} — ${item.companyName}`,
                  value: item.id,
                }))}
                onChange={(e) => setSupplierId(e.target.value)}
              />
            </div>

            <Badge
              variant={supplier.status === "ACTIVE" ? "success" : "warning"}
            >
              {supplier.status}
            </Badge>
          </div>
        </div>

        {/* Profile */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          <div className="rounded-xl border border-border bg-surface p-5 xl:col-span-8">
            <div className="flex gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary-dark">
                <Building2 className="h-8 w-8" />
              </div>

              <div className="flex-1">
                <h2 className="text-xl font-semibold text-secondary">
                  {supplier.companyName}
                </h2>

                <p className="mt-1 text-sm text-text-muted">
                  {supplier.supplierCode} · {supplier.name}
                </p>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Info
                    icon={<Phone className="h-4 w-4" />}
                    label="Phone"
                    value={supplier.phone}
                  />

                  <Info
                    icon={<UserRound className="h-4 w-4" />}
                    label="Contact Person"
                    value={supplier.name}
                  />

                  <Info
                    icon={<Landmark className="h-4 w-4" />}
                    label="Registration No"
                    value={supplier.registrationNo}
                  />

                  <Info
                    icon={<Building2 className="h-4 w-4" />}
                    label="Address"
                    value={supplier.address}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Outstanding */}
          <div className="rounded-xl border border-border bg-surface p-5 xl:col-span-4">
            <p className="text-sm font-semibold text-secondary">
              Outstanding Balance
            </p>

            <p className="mt-2 text-2xl font-bold text-primary-dark">
              Rs. {money(supplier.outstandingBalance)}
            </p>

            <div className="mt-4">
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-text-muted">Credit Limit</span>
                <span className="font-medium text-secondary">
                  Rs. {money(supplier.creditLimit)}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-background">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{
                    width: `${Math.min(
                      (supplier.outstandingBalance / supplier.creditLimit) *
                        100,
                      100,
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <Stat
            title="Total Purchases"
            value={`Rs. ${money(supplier.totalPurchases)}`}
            icon={<ReceiptText className="h-5 w-5" />}
          />

          <Stat
            title="Total Paid"
            value={`Rs. ${money(supplier.totalPaid)}`}
            icon={<Wallet className="h-5 w-5" />}
          />

          <Stat
            title="Credit"
            value={`Rs. ${money(supplier.totalCredit)}`}
            icon={<TrendingUp className="h-5 w-5" />}
          />

          <Stat
            title="Debit"
            value={`Rs. ${money(supplier.totalDebit)}`}
            icon={<TrendingDown className="h-5 w-5" />}
          />

          <Stat
            title="Outstanding"
            value={`Rs. ${money(supplier.outstandingBalance)}`}
            icon={<CreditCard className="h-5 w-5" />}
            highlight
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {/* Purchase trend */}
          <div className="rounded-xl border border-border bg-surface p-4">
            <div className="mb-4">
              <p className="text-sm font-semibold text-secondary">
                Purchase & Payment Trend
              </p>

              <p className="text-xs text-text-muted">
                Compare purchases, payments and outstanding amounts
              </p>
            </div>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={purchaseChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => `Rs. ${money(Number(value))}`}
                  />
                  <Legend />

                  <Bar dataKey="purchase" name="Purchase" />

                  <Bar dataKey="paid" name="Paid" />

                  <Bar dataKey="balance" name="Balance" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Credit debit */}
          <div className="rounded-xl border border-border bg-surface p-4">
            <div className="mb-4">
              <p className="text-sm font-semibold text-secondary">
                Supplier Account Movement
              </p>

              <p className="text-xs text-text-muted">
                Monthly credit and debit activity
              </p>
            </div>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={creditDebitChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => `Rs. ${money(Number(value))}`}
                  />
                  <Legend />

                  <Line
                    type="monotone"
                    dataKey="credit"
                    name="Credit"
                    strokeWidth={2}
                  />

                  <Line
                    type="monotone"
                    dataKey="debit"
                    name="Debit"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Purchase Orders */}
        <section className="rounded-xl border border-border bg-surface">
          <Header
            icon={<ReceiptText className="h-4 w-4" />}
            title="Purchase Orders"
            subtitle="Purchases made from this supplier"
          />

          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-sm">
              <thead className="border-b border-border bg-background text-left">
                <tr>
                  <Th>PO Number</Th>
                  <Th>Invoice</Th>
                  <Th>Date</Th>
                  <Th>Items</Th>
                  <Th>Net Amount</Th>
                  <Th>Paid</Th>
                  <Th>Balance</Th>
                  <Th>Status</Th>
                </tr>
              </thead>

              <tbody>
                {purchases.map((purchase) => (
                  <tr
                    key={purchase.id}
                    className="border-b border-border last:border-0"
                  >
                    <Td>{purchase.poNumber}</Td>
                    <Td>{purchase.invoiceNumber}</Td>
                    <Td>{purchase.date}</Td>
                    <Td>{purchase.itemCount}</Td>
                    <Td>Rs. {money(purchase.netAmount)}</Td>
                    <Td>Rs. {money(purchase.paidAmount)}</Td>
                    <Td className="font-semibold">
                      Rs. {money(purchase.balance)}
                    </Td>
                    <Td>
                      <Badge
                        variant={
                          purchase.status === "PAID"
                            ? "success"
                            : purchase.status === "CANCELLED"
                              ? "danger"
                              : "warning"
                        }
                      >
                        {purchase.status}
                      </Badge>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Payment history */}
        <section className="rounded-xl border border-border bg-surface">
          <Header
            icon={<Wallet className="h-4 w-4" />}
            title="Payment Details"
            subtitle="Payments made to this supplier"
          />

          <div className="divide-y divide-border">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-secondary">
                    {payment.reference}
                  </p>

                  <p className="mt-1 text-xs text-text-muted">
                    {payment.date} · {payment.method}
                  </p>

                  {payment.note && (
                    <p className="mt-1 text-xs text-text-muted">
                      {payment.note}
                    </p>
                  )}
                </div>

                <p className="text-sm font-semibold text-secondary">
                  Rs. {money(payment.amount)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Credit / Debit ledger */}
        <section className="rounded-xl border border-border bg-surface">
          <Header
            icon={<FileText className="h-4 w-4" />}
            title="Credit & Debit Details"
            subtitle="Supplier account transaction history"
          />

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-sm">
              <thead className="border-b border-border bg-background text-left">
                <tr>
                  <Th>Date</Th>
                  <Th>Reference</Th>
                  <Th>Description</Th>
                  <Th>Type</Th>
                  <Th>Amount</Th>
                </tr>
              </thead>

              <tbody>
                {transactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-b border-border last:border-0"
                  >
                    <Td>{transaction.date}</Td>
                    <Td>{transaction.reference}</Td>
                    <Td>{transaction.description}</Td>
                    <Td>
                      <Badge
                        variant={
                          transaction.type === "CREDIT" ? "warning" : "success"
                        }
                      >
                        {transaction.type}
                      </Badge>
                    </Td>
                    <Td className="font-semibold">
                      Rs. {money(transaction.amount)}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </PageContainer>
  );
};

/* =====================================================
   Small Components
===================================================== */

const Info = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-center gap-2">
    <div className="text-text-muted">{icon}</div>

    <div>
      <p className="text-[11px] text-text-muted">{label}</p>
      <p className="text-sm font-medium text-secondary">{value}</p>
    </div>
  </div>
);

const Stat = ({
  title,
  value,
  icon,
  highlight = false,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  highlight?: boolean;
}) => (
  <div
    className={`rounded-xl border p-4 ${
      highlight ? "border-primary/30 bg-primary/5" : "border-border bg-surface"
    }`}
  >
    <div className="flex items-center justify-between">
      <p className="text-xs text-text-muted">{title}</p>
      <div className="text-primary-dark">{icon}</div>
    </div>

    <p className="mt-2 text-lg font-bold text-secondary">{value}</p>
  </div>
);

const Header = ({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) => (
  <div className="flex items-center gap-3 border-b border-border p-4">
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-background text-primary-dark">
      {icon}
    </div>

    <div>
      <p className="text-sm font-semibold text-secondary">{title}</p>
      <p className="text-xs text-text-muted">{subtitle}</p>
    </div>
  </div>
);

const Th = ({ children }: { children: React.ReactNode }) => (
  <th className="px-4 py-3 text-xs font-semibold text-text-muted">
    {children}
  </th>
);

const Td = ({ children, className = "" }: TdProps) => (
  <td className={`px-4 py-3 text-xs text-secondary ${className}`}>
    {children}
  </td>
);

export default SupplierReport;
