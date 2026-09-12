export type AttendanceStatus = "Pending" | "Approved" | "Rejected";

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  designation: string;
  month: string; // "YYYY-MM"
  presentDays: number; // mase awa dawas gana
  expectedDays: number; // mase wada karanna thibba dawas gana
  otDays: number; // ot wada karapu dawas gana
  leaveDays: number; // leaves dawas gana
  status: AttendanceStatus;
  createdAt: string;
}