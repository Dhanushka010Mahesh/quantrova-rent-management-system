import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  FileText,
  Image as ImageIcon,
  Mail,
  MapPin,
  Package,
  Phone,
  ShieldCheck,
  TrendingUp,
  User,
  Users,
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

// import PageContainer from "../../layout/PageContainer";
// import Select from "../../components/ui/select/Select";
// import Badge from "../../components/ui/others/Badge";

import {
  customerProfiles,
  customerRentals,
  customerPayments,
  customerGuarantors,
  customerOrderPhotos,
  customerRentalTrend,
  customerRentalStatus,
} from "./reportData";
import PageContainer from "../../../layout/PageContainer";
import Select from "../../../components/ui/select/Select";
import Badge from "../../../components/ui/others/Badge";

const CustomerProfile = () => {
  const [customerId, setCustomerId] = useState(
    customerProfiles[0]?.id ?? ""
  );

  const customer = useMemo(
    () => customerProfiles.find((item) => item.id === customerId),
    [customerId]
  );

  const rentals = useMemo(
    () =>
      customerRentals.filter(
        (rental) => rental.customerId === customerId
      ),
    [customerId]
  );

  const payments = useMemo(
    () =>
      customerPayments.filter(
        (payment) => payment.customerId === customerId
      ),
    [customerId]
  );

  const guarantors = useMemo(
    () =>
      customerGuarantors.filter(
        (guarantor) => guarantor.customerId === customerId
      ),
    [customerId]
  );

  const photos = useMemo(
    () =>
      customerOrderPhotos.filter(
        (photo) => photo.customerId === customerId
      ),
    [customerId]
  );

  const activeRentals = rentals.filter(
    (rental) => rental.status === "ACTIVE"
  );

  const overdueRentals = rentals.filter(
    (rental) => rental.status === "OVERDUE"
  );

  const totalRentalValue = rentals.reduce(
    (sum, rental) => sum + rental.total,
    0
  );

  const totalPaid = rentals.reduce(
    (sum, rental) => sum + rental.paid,
    0
  );

  const totalOutstanding = rentals.reduce(
    (sum, rental) => sum + rental.balance,
    0
  );

  const paymentProgress =
    totalRentalValue > 0
      ? Math.min((totalPaid / totalRentalValue) * 100, 100)
      : 0;

  const totalItemsRented = activeRentals.reduce(
    (sum, rental) =>
      sum +
      rental.items.reduce(
        (itemSum, item) => itemSum + item.quantity,
        0
      ),
    0
  );

  const formatMoney = (value: number) =>
    value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const getStatusVariant = (
    status: "ACTIVE" | "RETURNED" | "OVERDUE" | "CANCELLED"
  ) => {
    switch (status) {
      case "ACTIVE":
        return "success";

      case "OVERDUE":
        return "danger";

      case "CANCELLED":
        return "warning";

      case "RETURNED":
      default:
        return "neutral";
    }
  };

  if (!customer) {
    return (
      <PageContainer
        title="Customer Profile"
        subtitle="Customer information and rental overview"
        breadcrumbs={[
          { label: "Customers" },
          { label: "Customer Profile" },
        ]}
        icon={<User className="h-5 w-5" />}
      >
        <div className="rounded-xl border border-border bg-surface p-6 text-sm text-text-muted">
          Customer not found.
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Customer Profile"
      subtitle="Customer rental, payment and account overview"
      breadcrumbs={[
        { label: "Customers" },
        { label: "Customer Profile" },
      ]}
      icon={<User className="h-5 w-5" />}
    >
      <div className="flex flex-col gap-4">

        {/* =====================================================
            CUSTOMER SELECTOR
        ====================================================== */}

        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="mb-2 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-secondary">
                Customer
              </p>

              <p className="mt-0.5 text-xs text-text-muted">
                Select a customer to view their complete account
                overview
              </p>
            </div>

            <Users className="h-5 w-5 text-text-muted" />
          </div>

          <Select
            value={customerId}
            options={customerProfiles.map((item) => ({
              label: `${item.name} — ${item.phone}`,
              value: item.id,
            }))}
            onChange={(e) => setCustomerId(e.target.value)}
          />
        </div>

        {/* =====================================================
            CUSTOMER HEADER
        ====================================================== */}

        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary-dark">
                <User className="h-7 w-7" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-semibold text-secondary">
                    {customer.name}
                  </h2>

                  <Badge variant="success">
                    {customer.status}
                  </Badge>
                </div>

                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-text-muted">
                  <span className="flex items-center gap-1.5">
                    <CreditCard className="h-3.5 w-3.5" />
                    {customer.nic}
                  </span>

                  <span className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" />
                    {customer.phone}
                  </span>

                  <span className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" />
                    {customer.email}
                  </span>

                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {customer.address}
                  </span>
                </div>

                {customer.description && (
                  <p className="mt-2 text-xs text-text-muted">
                    {customer.description}
                  </p>
                )}
              </div>
            </div>

            <div className="min-w-[190px] rounded-xl border border-danger/10 bg-danger/5 p-4">
              <p className="text-xs text-text-muted">
                Outstanding Balance
              </p>

              <p className="mt-1 text-2xl font-bold text-danger">
                LKR {formatMoney(totalOutstanding)}
              </p>

              <p className="mt-1 text-xs text-text-muted">
                Credit limit: LKR{" "}
                {formatMoney(customer.creditLimit)}
              </p>
            </div>
          </div>
        </div>

        {/* =====================================================
            KPI CARDS
        ====================================================== */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            icon={<Package className="h-5 w-5" />}
            label="Total Rentals"
            value={rentals.length.toString()}
            description="All rental orders"
          />

          <SummaryCard
            icon={<CalendarDays className="h-5 w-5" />}
            label="Active Rentals"
            value={activeRentals.length.toString()}
            description={`${totalItemsRented} items currently out`}
          />

          <SummaryCard
            icon={<TrendingUp className="h-5 w-5" />}
            label="Rental Value"
            value={`LKR ${formatMoney(totalRentalValue)}`}
            description="Total billed value"
          />

          <SummaryCard
            icon={<CreditCard className="h-5 w-5" />}
            label="Outstanding"
            value={`LKR ${formatMoney(totalOutstanding)}`}
            description={
              overdueRentals.length > 0
                ? `${overdueRentals.length} overdue order(s)`
                : "No overdue orders"
            }
            danger={totalOutstanding > 0}
          />
        </div>

        {/* =====================================================
            ANALYTICS
        ====================================================== */}

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-7">

          {/* Rental Trend */}

          <div className="rounded-xl border border-border bg-surface p-4 xl:col-span-4">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-secondary">
                  Rental Performance
                </p>

                <p className="mt-0.5 text-xs text-text-muted">
                  Rental value and payments over recent months
                </p>
              </div>

              <TrendingUp className="h-4 w-4 text-primary-dark" />
            </div>

            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={customerRentalTrend}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                  />

                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    tickFormatter={(value) =>
                      `${(value / 1000).toFixed(0)}K`
                    }
                  />

                  <Tooltip
                    formatter={(value) =>
                      `LKR ${Number(value).toLocaleString()}`
                    }
                  />

                  <Legend />

                  <Line
                    type="monotone"
                    dataKey="rentalValue"
                    name="Rental Value"
                    stroke="var(--color-primary)"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />

                  <Line
                    type="monotone"
                    dataKey="paid"
                    name="Paid"
                    stroke="var(--color-secondary)"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Rental Status */}

          <div className="rounded-xl border border-border bg-surface p-4 xl:col-span-3">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-secondary">
                  Rental Status
                </p>

                <p className="mt-0.5 text-xs text-text-muted">
                  Current order distribution
                </p>
              </div>

              <Package className="h-4 w-4 text-primary-dark" />
            </div>

            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={customerRentalStatus}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="status"
                    tickLine={false}
                    axisLine={false}
                    fontSize={11}
                  />

                  <YAxis
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                  />

                  <Tooltip />

                  <Bar
                    dataKey="count"
                    name="Orders"
                    fill="var(--color-primary)"
                    radius={[5, 5, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* =====================================================
            FINANCIAL OVERVIEW
        ====================================================== */}

        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-secondary">
                Financial Overview
              </p>

              <p className="mt-0.5 text-xs text-text-muted">
                Customer billing and payment position
              </p>
            </div>

            <Banknote className="h-5 w-5 text-primary-dark" />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <FinancialCard
              label="Total Billed"
              value={`LKR ${formatMoney(totalRentalValue)}`}
              icon={<ArrowUpRight className="h-4 w-4" />}
            />

            <FinancialCard
              label="Total Paid"
              value={`LKR ${formatMoney(totalPaid)}`}
              icon={<CheckCircle2 className="h-4 w-4" />}
            />

            <FinancialCard
              label="Balance Due"
              value={`LKR ${formatMoney(totalOutstanding)}`}
              icon={<ArrowDownRight className="h-4 w-4" />}
              danger={totalOutstanding > 0}
            />
          </div>

          <div className="mt-5 border-t border-border pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary">
                  Payment Progress
                </p>

                <p className="mt-0.5 text-xs text-text-muted">
                  {formatMoney(totalPaid)} paid from{" "}
                  {formatMoney(totalRentalValue)}
                </p>
              </div>

              <p className="text-sm font-semibold text-primary-dark">
                {paymentProgress.toFixed(0)}%
              </p>
            </div>

            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-background">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{
                  width: `${paymentProgress}%`,
                }}
              />
            </div>

            <div className="mt-2 flex justify-between text-xs">
              <span className="text-success">
                Paid: LKR {formatMoney(totalPaid)}
              </span>

              <span className="text-danger">
                Due: LKR {formatMoney(totalOutstanding)}
              </span>
            </div>
          </div>
        </div>

        {/* =====================================================
            ACTIVE RENTALS + GUARANTORS
        ====================================================== */}

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-7">

          {/* Active Rentals */}

          <div className="rounded-xl border border-border bg-surface xl:col-span-4">
            <SectionHeader
              icon={<Package className="h-4 w-4" />}
              title="Currently Rented Items"
              description="Items currently with the customer"
            />

            <div className="p-4">
              {activeRentals.length === 0 ? (
                <EmptyState text="No active rentals." />
              ) : (
                <div className="space-y-3">
                  {activeRentals.map((rental) => (
                    <div
                      key={rental.id}
                      className="rounded-lg border border-border bg-background p-4"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="font-medium text-secondary">
                            {rental.billNumber}
                          </p>

                          <p className="mt-0.5 text-xs text-text-muted">
                            Out: {rental.outDate} · Expected return:{" "}
                            {rental.expectedReturnDate}
                          </p>
                        </div>

                        <Badge variant="success">ACTIVE</Badge>
                      </div>

                      <div className="mt-3 space-y-2">
                        {rental.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between rounded-md bg-surface px-3 py-2"
                          >
                            <div>
                              <p className="text-sm font-medium text-secondary">
                                {item.name}
                              </p>

                              <p className="text-xs text-text-muted">
                                Qty: {item.quantity} · {item.days} days
                              </p>
                            </div>

                            <p className="text-sm font-semibold text-secondary">
                              LKR {formatMoney(item.subtotal)}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 flex justify-between border-t border-border pt-3 text-xs">
                        <span className="text-text-muted">
                          Order Total
                        </span>

                        <span className="font-semibold text-secondary">
                          LKR {formatMoney(rental.total)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Guarantors */}

          <div className="rounded-xl border border-border bg-surface xl:col-span-3">
            <SectionHeader
              icon={<ShieldCheck className="h-4 w-4" />}
              title="Guarantors"
              description="Customer guarantor information"
            />

            <div className="p-4">
              {guarantors.length === 0 ? (
                <EmptyState text="No guarantors recorded." />
              ) : (
                <div className="space-y-3">
                  {guarantors.map((guarantor) => (
                    <div
                      key={guarantor.id}
                      className="rounded-lg border border-border bg-background p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary-dark">
                          <ShieldCheck className="h-4 w-4" />
                        </div>

                        <div>
                          <p className="text-sm font-medium text-secondary">
                            {guarantor.name}
                          </p>

                          <p className="text-xs text-text-muted">
                            {guarantor.phone}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 space-y-1 text-xs text-text-muted">
                        <p>NIC: {guarantor.nic}</p>
                        <p>Address: {guarantor.address}</p>

                        {guarantor.description && (
                          <p>{guarantor.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* =====================================================
            RENTAL HISTORY
        ====================================================== */}

        <div className="rounded-xl border border-border bg-surface">
          <SectionHeader
            icon={<FileText className="h-4 w-4" />}
            title="Rental History"
            description="Complete rental order history"
          />

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-text-muted">
                  <th className="px-4 py-3 font-medium">
                    Bill Number
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Out Date
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Return Date
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Items
                  </th>

                  <th className="px-4 py-3 text-right font-medium">
                    Total
                  </th>

                  <th className="px-4 py-3 text-right font-medium">
                    Paid
                  </th>

                  <th className="px-4 py-3 text-right font-medium">
                    Due
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {rentals.map((rental) => (
                  <tr
                    key={rental.id}
                    className="border-b border-border last:border-0 hover:bg-background/60"
                  >
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        className="font-medium text-primary-dark hover:underline"
                      >
                        {rental.billNumber}
                      </button>
                    </td>

                    <td className="px-4 py-3 text-text-muted">
                      {rental.outDate}
                    </td>

                    <td className="px-4 py-3 text-text-muted">
                      {rental.actualReturnDate ??
                        rental.expectedReturnDate}
                    </td>

                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-secondary">
                          {rental.items[0]?.name ?? "—"}
                        </p>

                        {rental.items.length > 1 && (
                          <p className="text-xs text-text-muted">
                            +{rental.items.length - 1} more item(s)
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-right">
                      LKR {formatMoney(rental.total)}
                    </td>

                    <td className="px-4 py-3 text-right text-success">
                      LKR {formatMoney(rental.paid)}
                    </td>

                    <td className="px-4 py-3 text-right font-medium text-danger">
                      LKR {formatMoney(rental.balance)}
                    </td>

                    <td className="px-4 py-3">
                      <Badge
                        variant={getStatusVariant(rental.status)}
                      >
                        {rental.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* =====================================================
            PAYMENT HISTORY
        ====================================================== */}

        <div className="rounded-xl border border-border bg-surface">
          <SectionHeader
            icon={<CreditCard className="h-4 w-4" />}
            title="Payment History"
            description="Payments received from this customer"
          />

          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-text-muted">
                  <th className="px-4 py-3 font-medium">
                    Receipt
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Date
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Bill Number
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Method
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Reference
                  </th>

                  <th className="px-4 py-3 text-right font-medium">
                    Amount
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {payments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-b border-border last:border-0 hover:bg-background/60"
                  >
                    <td className="px-4 py-3 font-medium text-primary-dark">
                      {payment.receiptNumber}
                    </td>

                    <td className="px-4 py-3 text-text-muted">
                      {payment.date}
                    </td>

                    <td className="px-4 py-3 text-secondary">
                      {payment.billNumber}
                    </td>

                    <td className="px-4 py-3">
                      <Badge variant="neutral">
                        {payment.method}
                      </Badge>
                    </td>

                    <td className="px-4 py-3 text-xs text-text-muted">
                      {payment.reference ?? "—"}
                    </td>

                    <td className="px-4 py-3 text-right font-semibold text-secondary">
                      LKR {formatMoney(payment.amount)}
                    </td>

                    <td className="px-4 py-3">
                      <Badge variant="success">
                        {payment.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* =====================================================
            PHOTOS
        ====================================================== */}

        <div className="rounded-xl border border-border bg-surface">
          <SectionHeader
            icon={<ImageIcon className="h-4 w-4" />}
            title="Rental Photos"
            description="Photos attached to customer's rental orders"
          />

          <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 lg:grid-cols-4">
            {photos.length === 0 ? (
              <EmptyState text="No rental photos available." />
            ) : (
              photos.map((photo) => (
                <div
                  key={photo.id}
                  className="group overflow-hidden rounded-lg border border-border bg-background"
                >
                  <div className="relative">
                    <img
                      src={photo.imageUrl}
                      alt={photo.caption ?? "Rental photo"}
                      className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {photo.type && (
                      <div className="absolute left-2 top-2">
                        <span className="rounded-md bg-black/60 px-2 py-1 text-[10px] font-medium text-white">
                          {photo.type}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-3">
                    <p className="text-xs font-semibold text-secondary">
                      {photo.billNumber}
                    </p>

                    <p className="mt-1 text-xs text-text-muted">
                      {photo.caption}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

/* =========================================================
   SUMMARY CARD
========================================================= */

const SummaryCard = ({
  icon,
  label,
  value,
  description,
  danger = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
  danger?: boolean;
}) => {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-text-muted">
            {label}
          </p>

          <p
            className={`mt-1 text-lg font-semibold ${
              danger ? "text-danger" : "text-secondary"
            }`}
          >
            {value}
          </p>

          <p className="mt-1 text-[11px] text-text-muted">
            {description}
          </p>
        </div>

        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
            danger
              ? "bg-danger/10 text-danger"
              : "bg-primary/10 text-primary-dark"
          }`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   FINANCIAL CARD
========================================================= */

const FinancialCard = ({
  label,
  value,
  icon,
  danger = false,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  danger?: boolean;
}) => {
  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-text-muted">
          {label}
        </p>

        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
            danger
              ? "bg-danger/10 text-danger"
              : "bg-primary/10 text-primary-dark"
          }`}
        >
          {icon}
        </div>
      </div>

      <p
        className={`mt-2 text-lg font-semibold ${
          danger ? "text-danger" : "text-secondary"
        }`}
      >
        {value}
      </p>
    </div>
  );
};

/* =========================================================
   SECTION HEADER
========================================================= */

const SectionHeader = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <div className="flex items-center justify-between border-b border-border px-4 py-3">
      <div className="flex items-center gap-2">
        <div className="text-primary-dark">
          {icon}
        </div>

        <div>
          <p className="text-sm font-semibold text-secondary">
            {title}
          </p>

          <p className="mt-0.5 text-xs text-text-muted">
            {description}
          </p>
        </div>
      </div>

      <ChevronDown className="h-4 w-4 text-text-muted" />
    </div>
  );
};

/* =========================================================
   EMPTY STATE
========================================================= */

const EmptyState = ({
  text,
}: {
  text: string;
}) => {
  return (
    <div className="flex min-h-[100px] items-center justify-center rounded-lg border border-dashed border-border bg-background px-4 text-center text-xs text-text-muted">
      {text}
    </div>
  );
};

export default CustomerProfile;