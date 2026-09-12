export type AccountType = "ASSET" | "LIABILITY" | "EQUITY" | "REVENUE" | "EXPENSE";
export type NormalBalance = "DEBIT" | "CREDIT";
export type AccountStatus = "ACTIVE" | "INACTIVE";
export type JournalStatus = "DRAFT" | "POSTED" | "REVERSED";

export interface LedgerAccount {
  id: number;
  account_code: string;
  account_name: string;
  account_type: AccountType;
  parent_id: number | null;
  normal_balance: NormalBalance;
  is_control_account: boolean;
  is_system_account: boolean;
  status: AccountStatus;
}

export interface JournalEntryLine {
  id: number;
  journal_entry_id: number;
  account_id: number;
  description: string | null;
  debit: number;
  credit: number;
}

export interface JournalEntry {
  id: number;
  financial_year_id: number | null;
  journal_no: string;
  journal_date: string; // "YYYY-MM-DD"
  reference_type: string | null;
  reference_id: number | null;
  source_module: string | null;
  description: string | null;
  total_debit: number;
  total_credit: number;
  status: JournalStatus;
  lines: JournalEntryLine[];
}

// Flattened row — one per (journal entry line), joined with account + entry info, used for the GL table
export interface GLRow {
  journalEntryId: number;
  lineId: number;
  journalNo: string;
  journalDate: string;
  accountId: number;
  accountCode: string;
  accountName: string;
  description: string | null;
  debit: number;
  credit: number;
  status: JournalStatus;
  sourceModule: string | null;
  entryBalanced: boolean; // false if this journal entry's total debit != total credit
  balance?: number; // present only when filtered to a single account (running balance)
}

export function flattenToGLRows(entries: JournalEntry[], accounts: LedgerAccount[]): GLRow[] {
  const accountMap = new Map(accounts.map((a) => [a.id, a]));
  const rows: GLRow[] = [];

  for (const entry of entries) {
    const debitSum = entry.lines.reduce((s, l) => s + l.debit, 0);
    const creditSum = entry.lines.reduce((s, l) => s + l.credit, 0);
    const balanced = Math.abs(debitSum - creditSum) < 0.01;

    for (const line of entry.lines) {
      const acc = accountMap.get(line.account_id);
      rows.push({
        journalEntryId: entry.id,
        lineId: line.id,
        journalNo: entry.journal_no,
        journalDate: entry.journal_date,
        accountId: line.account_id,
        accountCode: acc?.account_code ?? "—",
        accountName: acc?.account_name ?? "Unknown Account",
        description: line.description ?? entry.description,
        debit: line.debit,
        credit: line.credit,
        status: entry.status,
        sourceModule: entry.source_module,
        entryBalanced: balanced,
      });
    }
  }
  return rows;
}

// Running balance for a single account, in normal-balance direction, over rows sorted ascending by date
export function withRunningBalance(rows: GLRow[], account: LedgerAccount): GLRow[] {
  let balance = 0;
  return rows.map((row) => {
    const delta = account.normal_balance === "DEBIT" ? row.debit - row.credit : row.credit - row.debit;
    balance += delta;
    return { ...row, balance };
  });
}

// TODO: replace with real API call e.g. GET /api/accounting/accounts
export const mockLedgerAccounts: LedgerAccount[] = [
  { id: 1, account_code: "1000", account_name: "Cash in Hand", account_type: "ASSET", parent_id: null, normal_balance: "DEBIT", is_control_account: false, is_system_account: true, status: "ACTIVE" },
  { id: 2, account_code: "1010", account_name: "Bank - Commercial Bank", account_type: "ASSET", parent_id: null, normal_balance: "DEBIT", is_control_account: false, is_system_account: true, status: "ACTIVE" },
  { id: 3, account_code: "1100", account_name: "Accounts Receivable", account_type: "ASSET", parent_id: null, normal_balance: "DEBIT", is_control_account: true, is_system_account: true, status: "ACTIVE" },
  { id: 4, account_code: "2000", account_name: "Accounts Payable", account_type: "LIABILITY", parent_id: null, normal_balance: "CREDIT", is_control_account: true, is_system_account: true, status: "ACTIVE" },
  { id: 5, account_code: "3000", account_name: "Owner's Equity", account_type: "EQUITY", parent_id: null, normal_balance: "CREDIT", is_control_account: false, is_system_account: false, status: "ACTIVE" },
  { id: 6, account_code: "4000", account_name: "Sales Revenue", account_type: "REVENUE", parent_id: null, normal_balance: "CREDIT", is_control_account: false, is_system_account: false, status: "ACTIVE" },
  { id: 7, account_code: "4100", account_name: "Rental Income", account_type: "REVENUE", parent_id: null, normal_balance: "CREDIT", is_control_account: false, is_system_account: false, status: "ACTIVE" },
  { id: 8, account_code: "5000", account_name: "Salary Expense", account_type: "EXPENSE", parent_id: null, normal_balance: "DEBIT", is_control_account: false, is_system_account: false, status: "ACTIVE" },
  { id: 9, account_code: "5100", account_name: "Utilities Expense", account_type: "EXPENSE", parent_id: null, normal_balance: "DEBIT", is_control_account: false, is_system_account: false, status: "ACTIVE" },
  { id: 10, account_code: "5900", account_name: "Adjustments / Suspense", account_type: "EXPENSE", parent_id: null, normal_balance: "DEBIT", is_control_account: false, is_system_account: true, status: "ACTIVE" },
];

// TODO: replace with real API call e.g. GET /api/accounting/journal-entries?include=lines
export const mockJournalEntries: JournalEntry[] = [
  {
    id: 101,
    financial_year_id: 1,
    journal_no: "JV-2026-0801",
    journal_date: "2026-08-01",
    reference_type: "SALE",
    reference_id: 5501,
    source_module: "Sales",
    description: "Cash sale - counter",
    total_debit: 3200,
    total_credit: 3200,
    status: "POSTED",
    lines: [
      { id: 1001, journal_entry_id: 101, account_id: 1, description: "Cash received", debit: 3200, credit: 0 },
      { id: 1002, journal_entry_id: 101, account_id: 6, description: "Sales revenue", debit: 0, credit: 3200 },
    ],
  },
  {
    id: 102,
    financial_year_id: 1,
    journal_no: "JV-2026-0802",
    journal_date: "2026-08-05",
    reference_type: "SALARY",
    reference_id: 220,
    source_module: "Payroll",
    description: "Salary payment - Sunil Perera",
    total_debit: 69000,
    total_credit: 69000,
    status: "POSTED",
    lines: [
      { id: 1003, journal_entry_id: 102, account_id: 8, description: "Salary expense", debit: 69000, credit: 0 },
      { id: 1004, journal_entry_id: 102, account_id: 2, description: "Bank payment", debit: 0, credit: 69000 },
    ],
  },
  {
    id: 103,
    financial_year_id: 1,
    journal_no: "JV-2026-0803",
    journal_date: "2026-08-10",
    reference_type: "RENTAL",
    reference_id: 88,
    source_module: "Rental",
    description: "Generator rental - 3 days",
    total_debit: 10500,
    total_credit: 10500,
    status: "POSTED",
    lines: [
      { id: 1005, journal_entry_id: 103, account_id: 3, description: "Receivable from customer", debit: 10500, credit: 0 },
      { id: 1006, journal_entry_id: 103, account_id: 7, description: "Rental income", debit: 0, credit: 10500 },
    ],
  },
  {
    id: 104,
    financial_year_id: 1,
    journal_no: "JV-2026-0804",
    journal_date: "2026-08-15",
    reference_type: "EXPENSE",
    reference_id: 340,
    source_module: "Expenses",
    description: "Electricity bill - August",
    total_debit: 18500,
    total_credit: 18500,
    status: "POSTED",
    lines: [
      { id: 1007, journal_entry_id: 104, account_id: 9, description: "Utilities expense", debit: 18500, credit: 0 },
      { id: 1008, journal_entry_id: 104, account_id: 2, description: "Bank payment", debit: 0, credit: 18500 },
    ],
  },
  {
    id: 105,
    financial_year_id: 1,
    journal_no: "JV-2026-0805",
    journal_date: "2026-08-20",
    reference_type: "SUPPLIER",
    reference_id: 77,
    source_module: "Purchasing",
    description: "Supplier payment - ABC Traders",
    total_debit: 40000,
    total_credit: 42000, // intentionally imbalanced — demonstrates mismatch detection
    status: "POSTED",
    lines: [
      { id: 1009, journal_entry_id: 105, account_id: 4, description: "Accounts payable settled", debit: 40000, credit: 0 },
      { id: 1010, journal_entry_id: 105, account_id: 2, description: "Bank payment", debit: 0, credit: 42000 },
    ],
  },
  {
    id: 106,
    financial_year_id: 1,
    journal_no: "JV-2026-0806",
    journal_date: "2026-08-24",
    reference_type: null,
    reference_id: null,
    source_module: "Manual",
    description: "Draft entry - pending review",
    total_debit: 5000,
    total_credit: 5000,
    status: "DRAFT",
    lines: [
      { id: 1011, journal_entry_id: 106, account_id: 1, description: "Cash", debit: 5000, credit: 0 },
      { id: 1012, journal_entry_id: 106, account_id: 6, description: "Sales", debit: 0, credit: 5000 },
    ],
  },
];