// src/types/customer.ts
export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  address: string;
  nic?: string;
  description?: string;
  creditBalance: number; // positive = customer owes us from before
  active?: boolean;
  createdAt?: string;
}
