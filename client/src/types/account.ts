export type AccountStatus = "Active" | "Inactive";

export interface CashAccount {
  id: string;
  name: string;
  holder: string; // who manages this cash account
  openingBalance: number;
  currentBalance: number;
  status: AccountStatus;
  notes: string;
  createdAt: string;
}

export interface BankAccount {
  id: string;
  accountName: string;
  bankName: string;
  branch: string;
  accountNumber: string;
  openingBalance: number;
  currentBalance: number;
  status: AccountStatus;
  createdAt: string;
}
