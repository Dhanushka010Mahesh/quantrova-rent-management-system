import type { SalaryType } from "./salary";

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  designation: string;
  salaryType: SalaryType;
  basicSalary: number; // used when salaryType === "basic"
  dayRate: number; // used when salaryType === "day"
  joinedDate: string; // "YYYY-MM-DD"
  active: boolean;
  createdAt: string;
}