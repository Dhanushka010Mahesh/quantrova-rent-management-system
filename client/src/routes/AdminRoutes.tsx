import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "../pages/admin/Dashboard";
import Items from "../pages/admin/items/Items";
import GRNCreate from "../pages/admin/purchasing/GRNCreate";
import SalaryCreate from "../pages/admin/employee/SalaryCreate";
import Employee from "../pages/admin/employee/Employee";
import AdvanceCreate from "../pages/admin/employee/AdvanceCreate";
import Attendance from "../pages/admin/employee/Attendance";
import ItemsMovement from "../pages/admin/items/ItemsMovement";
import RolePermissions from "../pages/admin/users/RolePermissions";
import Accounts from "../pages/admin/financial/Accounts";
import Expenses from "../pages/admin/financial/Expenses";
import Income from "../pages/admin/financial/Income";
import FundTransferPage from "../pages/admin/financial/FundTransfer";
import Payments from "../pages/admin/financial/Payments";
import RentalCreate from "../pages/admin/rental/RentalCreate";
import CustomerProfile from "../pages/admin/reports/CustomerProfile";
import ItemReport from "../pages/admin/reports/ItemReport";
import EmployeeReport from "../pages/admin/reports/EmployeeReport";
import SupplierReport from "../pages/admin/reports/SupplierReport";
import GeneralLedger from "../pages/admin/reports/GeneralLedger";
import SalesReport from "../pages/admin/reports/SalesReport";
import ProfitLossReport from "../pages/admin/reports/ProfitLossReport";
import RentalOrders from "../pages/admin/rental/RentalOrders";
import UserProfile from "../pages/admin/users/UserProfile";
import CustomerPayments from "../pages/admin/customer/CustomerPayments";
import Users from "../pages/admin/users/Users";
import Customers from "../pages/admin/customer/Customers";
import Suppliers from "../pages/admin/purchasing/Suppliers";
import Liabilities from "../pages/admin/financial/Liabilities";
import Assets from "../pages/admin/financial/Assets";

function AdminRoutes() {
  return (
    <Routes>
      {/* Dashboard */}
      <Route path="dashboard" element={<Dashboard />} />

      {/* Future Admin Routes */}
      <Route path="users" element={<Users />} />

      <Route path="customers" element={<Customers />} />

      <Route path="items" element={<Items />} />

      <Route path="suppliers" element={<Suppliers />} />

      <Route path="purchasing/orders" element={<GRNCreate />} />
      
      <Route path="salary" element={<SalaryCreate />} />
      
      <Route path="employees" element={<Employee />} />
      
      <Route path="advances" element={<AdvanceCreate />} />
      
      <Route path="attendance" element={<Attendance />} />

      <Route path="items/movement" element={<ItemsMovement />} />

      <Route path="users/permissions" element={<RolePermissions />} />
      
      <Route path="financials/accounts" element={<Accounts />} />

      <Route path="financials/expenses" element={<Expenses />} />

      <Route path="financials/income" element={<Income />} />

      <Route path="financials/fund-transfer" element={<FundTransferPage />} />

      <Route path="financials/payments" element={<Payments />} />
      
      <Route path="rental" element={<RentalCreate />} />

      <Route path="reports/customer" element={<CustomerProfile />} />

      <Route path="reports/item" element={<ItemReport />} />

      <Route path="reports/employee" element={<EmployeeReport />} />

      <Route path="reports/supplier" element={<SupplierReport />} />

      <Route path="reports/general-ledger" element={<GeneralLedger />} />

      <Route path="reports/sales" element={<SalesReport />} />

      <Route path="reports/profit-loss" element={<ProfitLossReport />} />

      <Route path="settings/profile" element={<UserProfile />} /> 

      <Route path="rental-orders" element={<RentalOrders />} />

      <Route path="customer-payments" element={<CustomerPayments />} />

      <Route path="financial/liability" element={<Liabilities />} />

      <Route path="financial/asstes" element={<Assets />} />

      {/* Admin default */}
      <Route path="" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
}

export default AdminRoutes;
