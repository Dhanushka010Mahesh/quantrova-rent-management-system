import { useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  CalendarDays,
  CircleDollarSign,
  CreditCard,
  FileText,
  History,
  IndianRupee,
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

// import PageContainer from "../../layout/PageContainer";
// import Select from "../../components/ui/select/Select";
// import Badge from "../../components/ui/others/Badge";

import {
  employeeAdvanceRecords,
  employeeAttendanceRecords,
  employeeDesignationRecords,
  employeePaymentRecords,
  employeeReportData,
  employeeSalaryRecords,
} from "./reportData";
import PageContainer from "../../../layout/PageContainer";
import Select from "../../../components/ui/select/Select";
import Badge from "../../../components/ui/others/Badge";
import type { TableCellProps } from "../../../types/menu";

const formatMoney = (value: number) =>
  value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const formatMonth = (month: string) => {
  const [year, monthNumber] = month.split("-");
  return new Date(Number(year), Number(monthNumber) - 1).toLocaleDateString(
    undefined,
    {
      month: "short",
      year: "numeric",
    },
  );
};

const EmployeeReport = () => {
  const [employeeId, setEmployeeId] = useState(employeeReportData[0]?.id ?? "");

  const selectedEmployee = useMemo(
    () => employeeReportData.find((employee) => employee.id === employeeId),
    [employeeId],
  );

  const salaryRecords = useMemo(
    () =>
      employeeSalaryRecords
        .filter((record) => record.employeeId === employeeId)
        .sort((a, b) => b.month.localeCompare(a.month)),
    [employeeId],
  );

  const paymentRecords = useMemo(
    () =>
      employeePaymentRecords
        .filter((record) => record.employeeId === employeeId)
        .sort((a, b) => b.date.localeCompare(a.date)),
    [employeeId],
  );

  const advanceRecords = useMemo(
    () =>
      employeeAdvanceRecords
        .filter((record) => record.employeeId === employeeId)
        .sort((a, b) => b.date.localeCompare(a.date)),
    [employeeId],
  );

  const attendanceRecords = useMemo(
    () =>
      employeeAttendanceRecords
        .filter((record) => record.employeeId === employeeId)
        .sort((a, b) => a.month.localeCompare(b.month)),
    [employeeId],
  );

  const designationRecords = useMemo(
    () =>
      employeeDesignationRecords
        .filter((record) => record.employeeId === employeeId)
        .sort((a, b) => b.effectiveDate.localeCompare(a.effectiveDate)),
    [employeeId],
  );

  const totalSalaryPaid = useMemo(
    () => salaryRecords.reduce((sum, item) => sum + item.paidAmount, 0),
    [salaryRecords],
  );

  const totalSalaryDue = useMemo(
    () => salaryRecords.reduce((sum, item) => sum + item.balance, 0),
    [salaryRecords],
  );

  const totalAdvance = useMemo(
    () => advanceRecords.reduce((sum, item) => sum + item.amount, 0),
    [advanceRecords],
  );

  const outstandingAdvance = useMemo(
    () => advanceRecords.reduce((sum, item) => sum + item.balance, 0),
    [advanceRecords],
  );

  if (!selectedEmployee) {
    return (
      <PageContainer
        title="Employee Report"
        subtitle="View employee salary, attendance and payment history"
        breadcrumbs={[{ label: "Employees" }, { label: "Employee Report" }]}
        icon={<UserRound className="h-5 w-5" />}
      >
        <div className="rounded-xl border border-border bg-surface p-6">
          No employee found.
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Employee Report"
      subtitle="Employee profile, salary, attendance and payment overview"
      breadcrumbs={[{ label: "Employees" }, { label: "Employee Report" }]}
      icon={<UserRound className="h-5 w-5" />}
    >
      <div className="flex flex-col gap-4">
        {/* Employee selector */}
        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="w-full md:max-w-md">
              <Select
                label="Select Employee"
                value={employeeId}
                options={employeeReportData.map((employee) => ({
                  label: `${employee.employeeCode} — ${employee.name}`,
                  value: employee.id,
                }))}
                onChange={(e) => setEmployeeId(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant={
                  selectedEmployee.status === "ACTIVE" ? "success" : "warning"
                }
              >
                {selectedEmployee.status}
              </Badge>

              <Badge variant="neutral">
                {selectedEmployee.employmentType.replace("_", " ")}
              </Badge>
            </div>
          </div>
        </div>

        {/* Employee profile */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          <div className="rounded-xl border border-border bg-surface p-5 xl:col-span-8">
            <div className="flex flex-col gap-5 md:flex-row">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary-dark">
                <UserRound className="h-9 w-9" />
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-semibold text-secondary">
                    {selectedEmployee.name}
                  </h2>

                  <Badge variant="success">
                    {selectedEmployee.designation}
                  </Badge>
                </div>

                <p className="mt-1 text-sm text-text-muted">
                  {selectedEmployee.employeeCode} ·{" "}
                  {selectedEmployee.department}
                </p>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <ProfileField
                    icon={<BriefcaseBusiness className="h-4 w-4" />}
                    label="Designation"
                    value={selectedEmployee.designation}
                  />

                  <ProfileField
                    icon={<CalendarDays className="h-4 w-4" />}
                    label="Joined Date"
                    value={selectedEmployee.joinedDate}
                  />

                  <ProfileField
                    icon={<UserRound className="h-4 w-4" />}
                    label="NIC"
                    value={selectedEmployee.nic}
                  />

                  <ProfileField
                    icon={<CreditCard className="h-4 w-4" />}
                    label="Phone"
                    value={selectedEmployee.phone}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface p-5 xl:col-span-4">
            <p className="text-sm font-semibold text-secondary">
              Current Salary
            </p>

            <p className="mt-2 text-2xl font-bold text-primary-dark">
              Rs. {formatMoney(selectedEmployee.netSalary)}
            </p>

            <div className="mt-4 space-y-2 text-sm">
              <SummaryRow
                label="Basic Salary"
                value={`Rs. ${formatMoney(selectedEmployee.basicSalary)}`}
              />

              <SummaryRow
                label="Allowances"
                value={`Rs. ${formatMoney(selectedEmployee.allowances)}`}
              />

              <SummaryRow
                label="Deductions"
                value={`Rs. ${formatMoney(selectedEmployee.deductions)}`}
              />
            </div>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard
            title="Salary Paid"
            value={`Rs. ${formatMoney(totalSalaryPaid)}`}
            icon={<CircleDollarSign className="h-5 w-5" />}
          />

          <StatCard
            title="Salary Due"
            value={`Rs. ${formatMoney(totalSalaryDue)}`}
            icon={<Wallet className="h-5 w-5" />}
            highlight
          />

          <StatCard
            title="Advance Taken"
            value={`Rs. ${formatMoney(totalAdvance)}`}
            icon={<IndianRupee className="h-5 w-5" />}
          />

          <StatCard
            title="Advance Balance"
            value={`Rs. ${formatMoney(outstandingAdvance)}`}
            icon={<CreditCard className="h-5 w-5" />}
            highlight
          />

          <StatCard
            title="Attendance"
            value={`${selectedEmployee.attendanceRate}%`}
            icon={<CalendarDays className="h-5 w-5" />}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {/* Salary chart */}
          <div className="rounded-xl border border-border bg-surface p-4">
            <div className="mb-4">
              <p className="text-sm font-semibold text-secondary">
                Salary & Payment Trend
              </p>
              <p className="text-xs text-text-muted">
                Monthly salary amount compared with actual payments
              </p>
            </div>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[...salaryRecords].reverse().map((item) => ({
                    month: formatMonth(item.month),
                    salary: item.netSalary,
                    paid: item.paidAmount,
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => `Rs. ${formatMoney(Number(value))}`}
                  />
                  <Legend />
                  <Bar dataKey="salary" name="Net Salary" />
                  <Bar dataKey="paid" name="Paid" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Attendance chart */}
          <div className="rounded-xl border border-border bg-surface p-4">
            <div className="mb-4">
              <p className="text-sm font-semibold text-secondary">
                Attendance Trend
              </p>
              <p className="text-xs text-text-muted">
                Monthly attendance percentage
              </p>
            </div>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={attendanceRecords.map((item) => ({
                    month: formatMonth(item.month),
                    attendance: item.attendanceRate,
                    absent: item.absentDays,
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="attendance"
                    name="Attendance %"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="absent"
                    name="Absent Days"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Salary details */}
        <section className="rounded-xl border border-border bg-surface">
          <SectionHeader
            icon={<FileText className="h-4 w-4" />}
            title="Salary Details"
            subtitle="Monthly salary calculation and outstanding amounts"
          />

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-sm">
              <thead className="border-b border-border bg-background text-left">
                <tr>
                  <TableHead>Month</TableHead>
                  <TableHead>Basic</TableHead>
                  <TableHead>Allowance</TableHead>
                  <TableHead>Deduction</TableHead>
                  <TableHead>Net Salary</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Status</TableHead>
                </tr>
              </thead>

              <tbody>
                {salaryRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="border-b border-border last:border-0"
                  >
                    <TableCell>{formatMonth(record.month)}</TableCell>
                    <TableCell>Rs. {formatMoney(record.basicSalary)}</TableCell>
                    <TableCell>Rs. {formatMoney(record.allowances)}</TableCell>
                    <TableCell>Rs. {formatMoney(record.deductions)}</TableCell>
                    <TableCell className="font-medium">
                      Rs. {formatMoney(record.netSalary)}
                    </TableCell>
                    <TableCell>Rs. {formatMoney(record.paidAmount)}</TableCell>
                    <TableCell className="font-medium">
                      Rs. {formatMoney(record.balance)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          record.status === "PAID"
                            ? "success"
                            : record.status === "PARTIAL"
                              ? "warning"
                              : "danger"
                        }
                      >
                        {record.status}
                      </Badge>
                    </TableCell>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Payment + Advance */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <section className="rounded-xl border border-border bg-surface">
            <SectionHeader
              icon={<Wallet className="h-4 w-4" />}
              title="Payment History"
              subtitle="Salary and other employee payments"
            />

            <div className="divide-y divide-border">
              {paymentRecords.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between gap-4 p-4"
                >
                  <div>
                    <p className="text-sm font-medium text-secondary">
                      {payment.reference}
                    </p>

                    <p className="mt-0.5 text-xs text-text-muted">
                      {payment.date} · {payment.type} · {payment.paymentMethod}
                    </p>

                    {payment.note && (
                      <p className="mt-1 text-xs text-text-muted">
                        {payment.note}
                      </p>
                    )}
                  </div>

                  <p className="whitespace-nowrap text-sm font-semibold text-secondary">
                    Rs. {formatMoney(payment.amount)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-border bg-surface">
            <SectionHeader
              icon={<CreditCard className="h-4 w-4" />}
              title="Advance Details"
              subtitle="Employee advances and outstanding balances"
            />

            <div className="divide-y divide-border">
              {advanceRecords.map((advance) => (
                <div key={advance.id} className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-secondary">
                        {advance.date}
                      </p>

                      <p className="mt-1 text-xs text-text-muted">
                        {advance.note || "Employee advance"}
                      </p>
                    </div>

                    <Badge
                      variant={
                        advance.status === "SETTLED"
                          ? "success"
                          : advance.status === "PARTIAL"
                            ? "warning"
                            : "danger"
                      }
                    >
                      {advance.status}
                    </Badge>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-3 text-xs">
                    <AmountMini label="Advance" value={advance.amount} />
                    <AmountMini label="Paid" value={advance.paidAmount} />
                    <AmountMini label="Balance" value={advance.balance} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Attendance */}
        <section className="rounded-xl border border-border bg-surface">
          <SectionHeader
            icon={<CalendarDays className="h-4 w-4" />}
            title="Attendance Details"
            subtitle="Monthly attendance record"
          />

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-sm">
              <thead className="border-b border-border bg-background text-left">
                <tr>
                  <TableHead>Month</TableHead>
                  <TableHead>Working Days</TableHead>
                  <TableHead>Present</TableHead>
                  <TableHead>Absent</TableHead>
                  <TableHead>Leave</TableHead>
                  <TableHead>Late</TableHead>
                  <TableHead>Rate</TableHead>
                </tr>
              </thead>

              <tbody>
                {attendanceRecords
                  .slice()
                  .reverse()
                  .map((record) => (
                    <tr
                      key={record.id}
                      className="border-b border-border last:border-0"
                    >
                      <TableCell>{formatMonth(record.month)}</TableCell>
                      <TableCell>{record.workingDays}</TableCell>
                      <TableCell>{record.presentDays}</TableCell>
                      <TableCell>{record.absentDays}</TableCell>
                      <TableCell>{record.leaveDays}</TableCell>
                      <TableCell>{record.lateDays}</TableCell>
                      <TableCell className="font-semibold">
                        {record.attendanceRate}%
                      </TableCell>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Designation history */}
        <section className="rounded-xl border border-border bg-surface">
          <SectionHeader
            icon={<History className="h-4 w-4" />}
            title="Designation & Salary History"
            subtitle="Employee position changes and salary revisions"
          />

          <div className="divide-y divide-border">
            {designationRecords.map((record) => (
              <div
                key={record.id}
                className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background">
                    <History className="h-4 w-4 text-text-muted" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-secondary">
                      {record.designation}
                    </p>

                    <p className="mt-0.5 text-xs text-text-muted">
                      {record.department} · Effective {record.effectiveDate}
                    </p>

                    {record.note && (
                      <p className="mt-1 text-xs text-text-muted">
                        {record.note}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-left md:text-right">
                  <p className="text-xs text-text-muted">Basic Salary</p>
                  <p className="text-sm font-semibold text-secondary">
                    Rs. {formatMoney(record.basicSalary)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PageContainer>
  );
};

/* -------------------------------------------------------
   Small reusable UI components
------------------------------------------------------- */

const ProfileField = ({
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

const SummaryRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between border-b border-border pb-2 last:border-0">
    <span className="text-text-muted">{label}</span>
    <span className="font-medium text-secondary">{value}</span>
  </div>
);

const StatCard = ({
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

const SectionHeader = ({
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

const TableHead = ({ children }: { children: React.ReactNode }) => (
  <th className="px-4 py-3 text-xs font-semibold text-text-muted">
    {children}
  </th>
);

const TableCell = ({ children, className = "" }: TableCellProps) => (
  <td className={`px-4 py-3 text-xs text-secondary ${className}`}>
    {children}
  </td>
);

const AmountMini = ({ label, value }: { label: string; value: number }) => (
  <div className="rounded-lg bg-background p-2.5">
    <p className="text-[10px] text-text-muted">{label}</p>
    <p className="mt-1 font-semibold text-secondary">
      Rs. {formatMoney(value)}
    </p>
  </div>
);

export default EmployeeReport;
