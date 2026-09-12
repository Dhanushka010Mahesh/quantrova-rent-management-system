import type { PaymentData } from "./payment";

export interface ExpenseCategory {
  id: string;
  name: string;
}

export type ExpenseStatus = "Approved" | "Pending" | "Cancelled";

export interface Expense {
  id: string;
  categoryId: string;
  categoryName: string;
  description: string;
  amount: number;
  date: string; // "YYYY-MM-DD"
  status: ExpenseStatus;
  payment: PaymentData | null; // null while Pending
  createdAt: string;
}