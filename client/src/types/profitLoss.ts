export interface RevenueEntry {
  id: string;
  date: string; // "YYYY-MM-DD"
  category: string; // e.g. "Rental Income", "Sales Income"
  description: string;
  amount: number;
}

export interface ExpenseEntry {
  id: string;
  date: string;
  category: string; // e.g. "Salary", "Utilities", "Transport"
  description: string;
  amount: number;
}

export interface PLSummary {
  totalRevenue: number;
  totalExpense: number;
  netProfit: number;
  profitMargin: number; // percentage
}

export function calculatePLSummary(revenue: RevenueEntry[], expenses: ExpenseEntry[]): PLSummary {
  const totalRevenue = revenue.reduce((s, r) => s + r.amount, 0);
  const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);
  const netProfit = totalRevenue - totalExpense;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
  return { totalRevenue, totalExpense, netProfit, profitMargin };
}

export function groupByCategory(entries: (RevenueEntry | ExpenseEntry)[]): { category: string; amount: number }[] {
  const map = new Map<string, number>();
  entries.forEach((e) => map.set(e.category, (map.get(e.category) ?? 0) + e.amount));
  return Array.from(map.entries())
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
}

export function groupByMonth(entries: (RevenueEntry | ExpenseEntry)[]): { month: string; amount: number }[] {
  const map = new Map<string, number>();
  entries.forEach((e) => {
    const month = e.date.slice(0, 7); // "YYYY-MM"
    map.set(month, (map.get(month) ?? 0) + e.amount);
  });
  return Array.from(map.entries())
    .map(([month, amount]) => ({ month, amount }))
    .sort((a, b) => (a.month < b.month ? -1 : 1));
}

// TODO: replace with real API calls — these should be derived from Sales/Income and Expenses/Salary modules
// e.g. GET /api/reports/revenue?from=&to=, GET /api/reports/expenses?from=&to=
export const mockRevenueEntries: RevenueEntry[] = [
  { id: "RV001", date: "2026-06-05", category: "Rental Income", description: "Generator & equipment rentals", amount: 145000 },
  { id: "RV002", date: "2026-06-18", category: "Sales Income", description: "Item sales - retail", amount: 68000 },
  { id: "RV003", date: "2026-06-25", category: "Package Income", description: "Wedding packages", amount: 85000 },
  { id: "RV004", date: "2026-07-03", category: "Rental Income", description: "Generator & equipment rentals", amount: 162000 },
  { id: "RV005", date: "2026-07-14", category: "Sales Income", description: "Item sales - retail", amount: 74500 },
  { id: "RV006", date: "2026-07-22", category: "Consumable Income", description: "Consumable package sales", amount: 21000 },
  { id: "RV007", date: "2026-07-28", category: "Package Income", description: "Event packages", amount: 92000 },
  { id: "RV008", date: "2026-08-02", category: "Rental Income", description: "Generator & equipment rentals", amount: 178500 },
  { id: "RV009", date: "2026-08-09", category: "Sales Income", description: "Item sales - retail", amount: 81200 },
  { id: "RV010", date: "2026-08-16", category: "Package Income", description: "Wedding packages", amount: 85000 },
  { id: "RV011", date: "2026-08-22", category: "Consumable Income", description: "Consumable package sales", amount: 18500 },
  { id: "RV012", date: "2026-08-27", category: "Rental Income", description: "Generator & equipment rentals", amount: 96000 },
];

export const mockExpenseEntries: ExpenseEntry[] = [
  { id: "EX001", date: "2026-06-05", category: "Salary", description: "Monthly salary payments", amount: 285000 },
  { id: "EX002", date: "2026-06-10", category: "Utilities", description: "Electricity & water", amount: 22000 },
  { id: "EX003", date: "2026-06-15", category: "Transport", description: "Fuel & vehicle maintenance", amount: 18500 },
  { id: "EX004", date: "2026-06-20", category: "Maintenance", description: "Equipment repairs", amount: 15000 },
  { id: "EX005", date: "2026-07-05", category: "Salary", description: "Monthly salary payments", amount: 292000 },
  { id: "EX006", date: "2026-07-10", category: "Utilities", description: "Electricity & water", amount: 24500 },
  { id: "EX007", date: "2026-07-15", category: "Transport", description: "Fuel & vehicle maintenance", amount: 21000 },
  { id: "EX008", date: "2026-07-18", category: "Office Supplies", description: "Stationery & consumables", amount: 6500 },
  { id: "EX009", date: "2026-07-25", category: "Maintenance", description: "Equipment repairs", amount: 32000 },
  { id: "EX010", date: "2026-08-05", category: "Salary", description: "Monthly salary payments", amount: 298000 },
  { id: "EX011", date: "2026-08-10", category: "Utilities", description: "Electricity & water", amount: 23800 },
  { id: "EX012", date: "2026-08-15", category: "Transport", description: "Fuel & vehicle maintenance", amount: 19500 },
  { id: "EX013", date: "2026-08-20", category: "Maintenance", description: "Equipment repairs", amount: 12000 },
  { id: "EX014", date: "2026-08-25", category: "Office Supplies", description: "Stationery & consumables", amount: 4200 },
];