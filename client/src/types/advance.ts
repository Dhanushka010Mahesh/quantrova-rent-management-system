export interface AdvanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  designation: string;
  amount: number;
  reason: string;
  date: string; // "YYYY-MM-DD" — date advance was given
  createdAt: string;
}

export const mockAdvances: AdvanceRecord[] = [
  {
    id: "A001",
    employeeId: "E01",
    employeeName: "Sunil Perera",
    designation: "Store Manager",
    amount: 10000,
    reason: "Medical emergency",
    date: "2026-06-05",
    createdAt: "2026-06-05",
  },
  {
    id: "A002",
    employeeId: "E01",
    employeeName: "Sunil Perera",
    designation: "Store Manager",
    amount: 5000,
    reason: "Personal — school fees",
    date: "2026-07-20",
    createdAt: "2026-07-20",
  },
  {
    id: "A003",
    employeeId: "E03",
    employeeName: "Nadeesha Silva",
    designation: "Warehouse Staff",
    amount: 3000,
    reason: "Advance request",
    date: "2026-08-10",
    createdAt: "2026-08-10",
  },
];