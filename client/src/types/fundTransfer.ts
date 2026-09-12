export type TransferDirection = "CASH_TO_BANK" | "BANK_TO_CASH";

export interface FundTransfer {
  id: string;
  direction: TransferDirection;
  cashAccountId: number;
  cashAccountName: string;
  bankAccountId: number;
  bankAccountName: string;
  amount: number;
  date: string; // "YYYY-MM-DD"
  note: string;
  createdAt: string;
}