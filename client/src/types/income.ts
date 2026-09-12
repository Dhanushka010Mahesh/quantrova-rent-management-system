import type { PaymentData } from "./payment";

export interface IncomeCategory {
  id: string;
  name: string;
}

export type IncomeStatus = "Approved" | "Pending" | "Cancelled";

export interface Income {
  id: string;
  categoryId: string;
  categoryName: string;
  description: string;
  amount: number;
  date: string; // "YYYY-MM-DD"
  status: IncomeStatus;
  payment: PaymentData | null; // null while Pending, set on approval
  createdAt: string;
}