export type PaymentMethod = "CASH" | "BANK" | "CHEQUE" | "EXISTING_CHEQUE";

export interface CashPayment {
  method: "CASH";
  cash_id: number | "";
}

export interface BankPayment {
  method: "BANK";
  bank_account_id: number | "";
  payee_name: string;
  payer_name: string | null;
}

export interface ChequePayment {
  method: "CHEQUE";
  bank_account_id: number | "";
  cheque_no: string;
  cheque_date: string;
  payee_name: string;
  payer_name: string | null;
}

export interface ExistingChequePayment {
  method: "EXISTING_CHEQUE";
  cheque_id: number | "";
}

export type PaymentData = CashPayment | BankPayment | ChequePayment | ExistingChequePayment;

// TODO: replace with real API calls e.g. GET /api/cash-accounts, GET /api/bank-accounts, GET /api/cheques
// NOTE: ideally these should come from the same source as the Accounts page (Cash/Bank accounts).
// Kept as separate mock lists here since Accounts.tsx currently manages its own local state.

export const mockCashAccounts = [
  { id: 1, name: "Main Cash Drawer" },
  { id: 2, name: "Petty Cash" },
];

export const mockBankAccounts = [
  { id: 1, name: "Business Current Account - Commercial Bank" },
  { id: 2, name: "Payroll Account - Sampath Bank" },
];

export const mockExistingCheques = [
  { id: 25, chequeNo: "CHQ-000125", bankAccountName: "Business Current Account - Commercial Bank", amount: 15000, date: "2026-08-12" },
  { id: 26, chequeNo: "CHQ-000126", bankAccountName: "Payroll Account - Sampath Bank", amount: 8000, date: "2026-08-20" },
];