export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  avatarUrl: string | null;
  joinedDate: string; // "YYYY-MM-DD"
  lastLogin: string; // ISO datetime
}


// TODO: replace with real API call e.g. GET /api/auth/me
export const mockCurrentUser: UserProfile = {
  id: "U01",
  name: "Sunil Perera",
  email: "sunil@company.lk",
  phone: "0771234567",
  role: "Admin",
  avatarUrl: null,
  joinedDate: "2023-04-10",
  lastLogin: "2026-08-29T08:15:00",
};