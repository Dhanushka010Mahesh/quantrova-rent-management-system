import { Wallet, Truck, ScrollText } from "lucide-react";
import type { PaymentMethod } from "../../types/payment";
import type { PaymentCategory } from "../../types/paymentTransaction";

export interface PaymentCategoryConfig {
  key: PaymentCategory;
  label: string; // tab label
  entityLabel: string; // e.g. "Employee", "Supplier", "Liability"
  icon: React.ElementType;
  allowedMethods: PaymentMethod[];
}

export const paymentCategoryConfig: PaymentCategoryConfig[] = [
  {
    key: "SALARY",
    label: "Salary Payment",
    entityLabel: "Employee",
    icon: Wallet,
    allowedMethods: ["CASH", "BANK"],
  },
  {
    key: "SUPPLIER",
    label: "Supplier Payment",
    entityLabel: "Supplier",
    icon: Truck,
    allowedMethods: ["CASH", "BANK", "CHEQUE", "EXISTING_CHEQUE"],
  },
  {
    key: "LIABILITY",
    label: "Liability Payment",
    entityLabel: "Liability",
    icon: ScrollText,
    allowedMethods: ["CASH", "BANK", "CHEQUE"],
  },
  // To add another payment type later:
  // {
  //   key: "TAX",
  //   label: "Tax Payment",
  //   entityLabel: "Tax Item",
  //   icon: Landmark,
  //   allowedMethods: ["CASH", "BANK", "CHEQUE"],
  // },
];