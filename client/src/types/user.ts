// src/types/user.ts
export interface AppUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "Admin" | "Manager" | "Staff";
  active: boolean;
  createdAt: string;
}