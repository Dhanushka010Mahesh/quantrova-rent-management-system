export type SalaryType = "basic" | "day";
// To add another salary type later, extend this union, e.g. "basic" | "day" | "hourly"

export interface SalaryLineItem {
  id: string;
  label: string;
  amount: number;
}

export type SalaryStatus = "Pending" | "Approved" | "Rejected";

export interface SalaryRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  designation: string;
  month: string; // "YYYY-MM"
  salaryType: SalaryType;
  basicSalary: number; // used when salaryType === "basic"
  dayRate: number; // used when salaryType === "day"
  attendedDays: number;
  attendedHours: number;
  advance: number;
  allowances: SalaryLineItem[];
  deductions: SalaryLineItem[];
  grossAmount: number;
  netAmount: number;
  status: SalaryStatus;
  createdAt: string;
}