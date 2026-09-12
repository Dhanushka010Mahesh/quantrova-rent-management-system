import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Users,
  PackagePlus,
  Receipt,
  UserPlus,
  ScrollText,
  CalendarCheck,
  AlertTriangle,
  Clock,
  ArrowRight,
  Boxes,
  ChevronRight,
} from "lucide-react";
import StatCard from "../../components/dashboard/StatCard";
import ChartCard from "../../components/dashboard/ChartCard";
import PageContainer from "../../layout/PageContainer";
import Badge from "../../components/ui/others/Badge";

// ---- Mock data (replace with API calls) ----

const revenueTrend = [
  { month: "Mar", revenue: 42000, expenses: 28000 },
  { month: "Apr", revenue: 51000, expenses: 31000 },
  { month: "May", revenue: 47500, expenses: 29500 },
  { month: "Jun", revenue: 58000, expenses: 33000 },
  { month: "Jul", revenue: 63500, expenses: 35500 },
  { month: "Aug", revenue: 71000, expenses: 38000 },
];

const salesVsRentals = [
  { month: "Mar", sales: 120, rentals: 84 },
  { month: "Apr", sales: 138, rentals: 92 },
  { month: "May", sales: 129, rentals: 101 },
  { month: "Jun", sales: 154, rentals: 96 },
  { month: "Jul", sales: 167, rentals: 112 },
  { month: "Aug", sales: 181, rentals: 124 },
];

const itemCategories = [
  { name: "Machinery", value: 38 },
  { name: "Tools", value: 27 },
  { name: "Furniture", value: 18 },
  { name: "Electronics", value: 12 },
  { name: "Other", value: 5 },
];

const recentTransactions = [
  { id: "INV-1042", customer: "Sunil Perera", type: "Sale", amount: "Rs. 24,500", status: "Paid" },
  { id: "INV-1041", customer: "Kamal Fernando", type: "Rental", amount: "Rs. 8,200", status: "Pending" },
  { id: "INV-1040", customer: "Nadeesha Silva", type: "Sale", amount: "Rs. 15,750", status: "Paid" },
  { id: "INV-1039", customer: "Ruwan Jayasuriya", type: "Rental", amount: "Rs. 11,300", status: "Overdue" },
  { id: "INV-1038", customer: "Chathurika Perera", type: "Sale", amount: "Rs. 6,900", status: "Paid" },
];

// TODO: replace with real API calls — this should be an aggregated "attention needed" feed
// pulling counts from Rental Orders (pending), Salary (pending), Liabilities (pending approval),
// Attendance (pending), and low-stock items.
const attentionItems = [
  { id: "A1", label: "3 rental orders awaiting processing", module: "Rental Orders", path: "/admin/rental-orders", icon: PackagePlus, urgency: "warning" as const },
  { id: "A2", label: "2 salary records pending approval", module: "Salary", path: "/admin/salary", icon: Wallet, urgency: "warning" as const },
  { id: "A3", label: "1 liability awaiting approval", module: "Liabilities", path: "/admin/liabilities", icon: ScrollText, urgency: "danger" as const },
  { id: "A4", label: "Cutting Disc 4in — low stock (12 left)", module: "Items Movement", path: "/admin/items-movement", icon: Boxes, urgency: "danger" as const },
  { id: "A5", label: "5 attendance records pending approval", module: "Attendance", path: "/admin/attendance", icon: CalendarCheck, urgency: "info" as const },
];

const quickActions = [ 
  { label: "New Rental / Sale", path: "/admin/rental", icon: PackagePlus, accent: "bg-primary/15 text-primary-dark" },
  { label: "Add Expense", path: "/admin/financials/expenses", icon: Receipt, accent: "bg-danger/10 text-danger" },
  { label: "Add Employee", path: "/admin/employees", icon: UserPlus, accent: "bg-success/10 text-success" },
  { label: "Mark Attendance", path: "/admin/attendance", icon: CalendarCheck, accent: "bg-accent-teal/10 text-accent-teal" },
];

const PIE_COLORS = [
  "var(--color-primary)",
  "var(--color-accent-teal)",
  "var(--color-secondary-light)",
  "var(--color-accent-coral)",
  "var(--color-border-dark)",
];

const statusStyles: Record<string, string> = {
  Paid: "bg-success/15 text-success",
  Pending: "bg-warning/15 text-warning",
  Overdue: "bg-danger/15 text-danger",
};

const urgencyDot: Record<string, string> = {
  danger: "bg-danger",
  warning: "bg-warning",
  info: "bg-info",
};

// ---- Icons (inline, no extra dependency) ----

const RevenueIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const RentalIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="2" />
    <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" />
  </svg>
);
const CustomerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
    <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const InvoiceIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M6 2h9l3 3v17H6z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <path d="M9 10h6M9 14h6M9 18h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function Dashboard() {
  const navigate = useNavigate();

  const today = useMemo(
    () => new Date().toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
    []
  );

  const netProfit = revenueTrend[revenueTrend.length - 1].revenue - revenueTrend[revenueTrend.length - 1].expenses;

  return (
    <PageContainer title="Dashboard" subtitle="Business overview and performance at a glance">
      {/* Welcome banner */}
      <div className="relative mb-5 overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-secondary to-secondary-dark p-5 text-white sm:p-6">
        <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 left-1/3 h-40 w-40 rounded-full bg-accent-teal/20 blur-3xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium text-white/70">{today}</p>
            <h2 className="mt-1 text-2xl font-semibold sm:text-3xl">{getGreeting()}</h2>
            <p className="mt-1 text-sm text-white/80">
              Here's what's happening across your business today — {attentionItems.length} items need your attention.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  onClick={() => navigate(action.path)}
                  className="flex items-center gap-2 rounded-xl bg-white/10 px-3.5 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                >
                  <Icon className="h-4 w-4" /> {action.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Revenue" value="Rs. 71,000" change={{ value: "12.4%", trend: "up" }} icon={<RevenueIcon />} accent="primary" />
        <StatCard
          label="Net Profit"
          value={`Rs. ${netProfit.toLocaleString()}`}
          change={{ value: "9.8%", trend: "up" }}
          icon={netProfit >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
          accent="teal"
        />
        <StatCard label="Active Rentals" value="124" change={{ value: "8.1%", trend: "up" }} icon={<RentalIcon />} accent="info" />
        <StatCard label="Total Customers" value="892" change={{ value: "3.2%", trend: "up" }} icon={<CustomerIcon />} accent="coral" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Pending Invoices" value="27" change={{ value: "5.6%", trend: "down" }} icon={<InvoiceIcon />} accent="primary" />
        <StatCard label="Pending Liabilities" value="Rs. 178,500" icon={<ScrollText className="h-5 w-5" />} accent="coral" />
        <StatCard label="Employees" value="14" icon={<Users className="h-5 w-5" />} accent="info" />
        <StatCard label="Owned Assets" value="9" icon={<Boxes className="h-5 w-5" />} accent="teal" />
      </div>

      {/* Attention needed + quick actions */}
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="rounded-xl border border-border bg-surface p-4 xl:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-secondary">
              <AlertTriangle className="h-4 w-4 text-warning" /> Needs Your Attention
            </div>
            <Badge variant="warning">{attentionItems.length} items</Badge>
          </div>

          <div className="flex flex-col divide-y divide-border">
            {attentionItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className="flex w-full items-center justify-between gap-3 py-2.5 text-left first:pt-0 last:pb-0 hover:bg-background/60"
                >
                  <div className="flex items-center gap-3">
                    <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${urgencyDot[item.urgency]}`} />
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-background text-text-muted">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm text-text">{item.label}</p>
                      <p className="text-xs text-text-muted">{item.module}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-text-muted" />
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-secondary">
            <Clock className="h-4 w-4" /> Today at a Glance
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between rounded-lg bg-background px-3 py-2.5">
              <span className="text-sm text-text-muted">New Orders Today</span>
              <span className="text-sm font-semibold text-secondary">6</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-background px-3 py-2.5">
              <span className="text-sm text-text-muted">Items Out on Rent</span>
              <span className="text-sm font-semibold text-secondary">37</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-background px-3 py-2.5">
              <span className="text-sm text-text-muted">Cash Collected Today</span>
              <span className="text-sm font-semibold text-success">Rs. 42,300</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-background px-3 py-2.5">
              <span className="text-sm text-text-muted">Expected Returns Today</span>
              <span className="text-sm font-semibold text-secondary">4</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts row 1 */}
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <ChartCard title="Revenue & Expenses" subtitle="Last 6 months" className="xl:col-span-2">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={revenueTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip
                contentStyle={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="revenue" name="Revenue" stroke="var(--color-primary-dark)" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="expenses" name="Expenses" stroke="var(--color-accent-coral)" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Item Categories" subtitle="By stock share">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={itemCategories} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
                {itemCategories.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} layout="vertical" verticalAlign="middle" align="right" />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Charts row 2 */}
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <ChartCard title="Sales vs Rentals" subtitle="Monthly transaction count" className="xl:col-span-2">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={salesVsRentals}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="month" stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                cursor={{ fill: "var(--color-background)" }}
                contentStyle={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="sales" name="Sales" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="rentals" name="Rentals" fill="var(--color-accent-teal)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Recent transactions */}
        <ChartCard
          title="Recent Transactions"
          subtitle="Latest 5 records"
          action={
            <button
              onClick={() => navigate("/admin/sales-report")}
              className="flex items-center gap-1 text-xs font-medium text-primary-dark hover:underline"
            >
              View all <ArrowRight className="h-3 w-3" />
            </button>
          }
        >
          <div className="flex flex-col divide-y divide-border">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-text">{tx.customer}</p>
                  <p className="text-xs text-text-muted">
                    {tx.id} · {tx.type}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className="text-sm font-semibold text-secondary">{tx.amount}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${statusStyles[tx.status]}`}>{tx.status}</span>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </PageContainer>
  );
}