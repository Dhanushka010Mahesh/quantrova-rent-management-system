import type { PaymentData } from "./payment";

// Add new categories here — the page reads this list, no other code changes needed
export type PaymentCategory = "SALARY" | "SUPPLIER" | "LIABILITY";

export interface PayableEntity {
  id: string;
  name: string;
  subtitle?: string; // e.g. designation, supplier type, liability description
  amountDue: number;
}

export interface PaymentTransaction {
  id: string;
  category: PaymentCategory;
  entityId: string;
  entityName: string;
  entitySubtitle?: string;
  amount: number;
  date: string; // "YYYY-MM-DD"
  payment: PaymentData;
  createdAt: string;
}

// TODO: replace with real API calls per category, e.g.
//  GET /api/payables/salary, GET /api/payables/suppliers, GET /api/payables/liabilities
export const mockPayables: Record<PaymentCategory, PayableEntity[]> = {
  SALARY: [
    { id: "E01", name: "Sunil Perera", subtitle: "Store Manager", amountDue: 69000 },
    { id: "E02", name: "Kamal Fernando", subtitle: "Sales Executive", amountDue: 55000 },
    { id: "E03", name: "Nadeesha Silva", subtitle: "Warehouse Staff", amountDue: 46900 },
  ],
  SUPPLIER: [
    { id: "S01", name: "ABC Traders", subtitle: "Raw Materials", amountDue: 125000 },
    { id: "S02", name: "Lanka Hardware Supplies", subtitle: "Hardware", amountDue: 42500 },
    { id: "S03", name: "Ceylon Packaging Co.", subtitle: "Packaging", amountDue: 18750 },
  ],
  LIABILITY: [
    { id: "L01", name: "Bank Loan - Equipment", subtitle: "Monthly installment", amountDue: 35000 },
    { id: "L02", name: "Leasing - Delivery Van", subtitle: "Monthly installment", amountDue: 22000 },
  ],
};