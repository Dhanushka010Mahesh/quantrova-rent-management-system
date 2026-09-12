import type { PaymentData } from "./payment";

export type LiabilityStatus = "PENDING" | "APPROVED" | "SETTLED";
export type LiabilitySource = "MANUAL" | "ASSET_PURCHASE";

export interface LiabilityPaymentRecord {
  id: string;
  date: string; // "YYYY-MM-DD"
  amount: number;
  payment: PaymentData;
}

export interface Liability {
  id: string;
  name: string;
  description: string;
  totalAmount: number;
  paidAmount: number;
  status: LiabilityStatus;
  sourceType: LiabilitySource;
  assetId: string | null; // set when this liability came from a partial asset purchase
  dueDate: string | null;
  payments: LiabilityPaymentRecord[];
  createdAt: string;
}

export function liabilityBalance(l: Liability): number {
  return l.totalAmount - l.paidAmount;
}

// TODO: replace with real API call e.g. GET /api/liabilities
export const mockLiabilities: Liability[] = [
  {
    id: "LB01",
    name: "Bank Loan - Equipment",
    description: "5-year equipment financing loan",
    totalAmount: 500000,
    paidAmount: 175000,
    status: "APPROVED",
    sourceType: "MANUAL",
    assetId: null,
    dueDate: "2028-01-15",
    payments: [
      { id: "P1", date: "2026-06-15", amount: 35000, payment: { method: "BANK", bank_account_id: 1, payee_name: "Commercial Bank", payer_name: null } },
      { id: "P2", date: "2026-07-15", amount: 35000, payment: { method: "BANK", bank_account_id: 1, payee_name: "Commercial Bank", payer_name: null } },
      { id: "P3", date: "2026-08-15", amount: 105000, payment: { method: "BANK", bank_account_id: 1, payee_name: "Commercial Bank", payer_name: null } },
    ],
    createdAt: "2026-01-15",
  },
  {
    id: "LB02",
    name: "Leasing - Delivery Van",
    description: "Vehicle lease balance",
    totalAmount: 22000,
    paidAmount: 22000,
    status: "SETTLED",
    sourceType: "MANUAL",
    assetId: null,
    dueDate: "2026-08-01",
    payments: [{ id: "P4", date: "2026-08-01", amount: 22000, payment: { method: "CASH", cash_id: 1 } }],
    createdAt: "2026-05-01",
  },
];