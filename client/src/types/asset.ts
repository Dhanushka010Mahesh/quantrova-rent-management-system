import type { PaymentData } from "./payment";

export type AssetStatus = "OWNED" | "SOLD";

export interface AssetSalePaymentRecord {
  id: string;
  date: string;
  amount: number;
  payment: PaymentData;
  note: string;
}

export interface Asset {
  id: string;
  name: string;
  category: string;
  purchaseDate: string;
  purchaseAmount: number;
  paidAtPurchase: number; // amount actually paid via cash/bank/cheque when bought
  liabilityId: string | null; // linked liability if paidAtPurchase < purchaseAmount
  status: AssetStatus;
  saleDate: string | null;
  saleAmount: number | null;
  saleCustomerName: string | null;
  salePayments: AssetSalePaymentRecord[]; // advance + later installments received from the buyer
  createdAt: string;
}

export function assetOutstandingLiabilityAmount(asset: Asset): number {
  return Math.max(asset.purchaseAmount - asset.paidAtPurchase, 0);
}

export function assetSaleReceived(asset: Asset): number {
  return asset.salePayments.reduce((s, p) => s + p.amount, 0);
}

export function assetSaleBalance(asset: Asset): number {
  if (!asset.saleAmount) return 0;
  return asset.saleAmount - assetSaleReceived(asset);
}

// TODO: replace with real API call e.g. GET /api/assets
export const mockAssets: Asset[] = [
  {
    id: "AS01",
    name: "Toyota Dyna Delivery Truck",
    category: "Vehicle",
    purchaseDate: "2026-01-10",
    purchaseAmount: 3200000,
    paidAtPurchase: 3200000,
    liabilityId: null,
    status: "OWNED",
    saleDate: null,
    saleAmount: null,
    saleCustomerName: null,
    salePayments: [],
    createdAt: "2026-01-10",
  },
  {
    id: "AS02",
    name: "Generator 20kVA (Backup)",
    category: "Equipment",
    purchaseDate: "2026-05-01",
    purchaseAmount: 500000,
    paidAtPurchase: 0, // fully financed — see LB01 in mockLiabilities
    liabilityId: "LB01",
    status: "OWNED",
    saleDate: null,
    saleAmount: null,
    saleCustomerName: null,
    salePayments: [],
    createdAt: "2026-01-15",
  },
  {
    id: "AS03",
    name: "Old Office Printer",
    category: "Office Equipment",
    purchaseDate: "2024-03-01",
    purchaseAmount: 45000,
    paidAtPurchase: 45000,
    liabilityId: null,
    status: "SOLD",
    saleDate: "2026-07-01",
    saleAmount: 18000,
    saleCustomerName: "Ruwan Jayasuriya",
    salePayments: [
      { id: "SP1", date: "2026-07-01", amount: 10000, payment: { method: "CASH", cash_id: 1 }, note: "Advance" },
      { id: "SP2", date: "2026-07-20", amount: 8000, payment: { method: "BANK", bank_account_id: 1, payee_name: "", payer_name: "Ruwan Jayasuriya" }, note: "Final installment" },
    ],
    createdAt: "2024-03-01",
  },
];