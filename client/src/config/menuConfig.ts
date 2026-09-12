import type { MenuItem } from "../types/menu";

// Max ~10 top-level items, max ~5 sub-items per parent (recommended)
export const menuItems: MenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
  },
  {
    id: "users",
    label: "Users",
    children: [
      { id: "users-all", label: "All Users", path: "/admin/users" },
      { id: "users-permissions", label: "User Permissions", path: "/admin/users/permissions" },
    ],
  },
  {
    id: "customers",
    label: "Customers",
    children: [
      { id: "customers-all", label: "All Customers", path: "/admin/customers" },
      { id: "payments", label: "Payments", path: "/admin/customer-payments" },
    ],
  },
  {
    id: "items",
    label: "Items",
    children: [
      { id: "items-all", label: "All Items", path: "/admin/items" },
      { id: "items-movement", label: "Item Movement", path: "/admin/items/movement" },
    ],
  },
  {
    id: "rent module",
    label: "Rent Management",
    children: [
      { id: "rental", label: "Rental", path: "/admin/rental" },
      { id: "rental-orders", label: "Rental Orders", path: "/admin/rental-orders" },
    ],
  },
  {
    id: "Employee module",
    label: "Employee module",
    children: [
      { id: "employees", label: "Employees", path: "/admin/employees" },
      { id: "attendance", label: "Attendance", path: "/admin/attendance" },
      { id: "salary", label: "Salary", path: "/admin/salary" },
      { id: "Advances", label: "Advances", path: "/admin/advances" },
    ],
  },
  {
    id: "purchasing",
    label: "Purchasing",
    children: [
      { id: "suppliers", label: "Suppliers", path: "/admin/suppliers" },
      { id: "purchase-orders", label: "Purchase Orders", path: "/admin/purchasing/orders" },
    ],
  },
  {
    id: "financials",
    label: "Financials",
    children: [
      { id: "accounts", label: "Accounts", path: "/admin/financials/accounts" },
      { id: "expenses", label: "Expenses", path: "/admin/financials/expenses" },
      { id: "income", label: "Income", path: "/admin/financials/income" },
      { id: "asstes", label: "Asstes", path: "/admin/financial/asstes" },
      { id: "liabilities", label: "Liabilities", path: "/admin/financial/liability" },
      { id: "fund-transfer", label: "Fund Transfer", path: "/admin/financials/fund-transfer" },
      { id: "payments", label: "Payments", path: "/admin/financials/payments" },
    ],
  },
  {
    id: "reports",
    label: "Reports",
    children: [
      { id: "reports-customers", label: "Customer Report", path: "/admin/reports/customer" },
      { id: "reports-items", label: "Item Report", path: "/admin/reports/item" },
      { id: "reports-employees", label: "Employee Report", path: "/admin/reports/employee" },
      { id: "reports-suppliers", label: "Supplier Report", path: "/admin/reports/supplier" },
      { id: "reports-general-ledger", label: "General Ledger", path: "/admin/reports/general-ledger" },
      { id: "reports-sales", label: "Sales Report", path: "/admin/reports/sales" },
      { id: "reports-profit-loss", label: "Profit & Loss", path: "/admin/reports/profit-loss" },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    children: [
      { id: "user-profile", label: "User Profile", path: "/admin/settings/profile" },
      { id: "logout", label: "Logout", path: "/" },
    ],
  },
];