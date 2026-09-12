import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import IconSidebar from "../components/dashboard/IconSidebar";
import SecondarySidebar from "../components/dashboard/SecondarySidebar";
import DashboardTopBar from "../components/dashboard/DashboardTopBar";
import { useDashboardShortcut } from "../hooks/useDashboardShortcut";
import FullscreenResumeBanner from "./FullscreenResumeBanner";

// Helper title lookup map for all admin pages
const routeTitleMap: Record<string, string> = {
  "/admin/dashboard": "Dashboard Overview",
  "/admin/rental": "New Rental Order",
  "/admin/rental-orders": "All Rental Orders",
  "/admin/items": "Item Catalog & Inventory",
  "/admin/items/movement": "Stock Movements Log",
  "/admin/customers": "Customer Directory",
  "/admin/customer-payments": "Customer Payments Log",
  "/admin/employees": "Staff Directory",
  "/admin/attendance": "Daily Attendance",
  "/admin/salary": "Salary Records",
  "/admin/advances": "Salary Advances",
  "/admin/suppliers": "Suppliers List",
  "/admin/purchasing/orders": "GRN Purchase Orders",
  "/admin/financials/accounts": "Bank Accounts",
  "/admin/financials/expenses": "Expenses Log",
  "/admin/financials/income": "Income Stream",
  "/admin/financial/asstes": "Company Assets",
  "/admin/financial/liability": "Company Liabilities",
  "/admin/financials/fund-transfer": "Fund Transfers",
  "/admin/reports/sales": "Sales Analytics",
  "/admin/reports/profit-loss": "Profit & Loss Statement",
  "/admin/reports/general-ledger": "General Ledger",
  "/admin/reports/customer": "Customer Profile & Reports",
  "/admin/reports/item": "Item Reports",
  "/admin/reports/employee": "Employee Reports",
  "/admin/reports/supplier": "Supplier Reports",
  "/admin/users": "System Users Directory",
  "/admin/users/permissions": "Role & Permissions Setup",
  "/admin/settings/profile": "User Profile Settings",
};

// Subtitle / description for each page shown under the top bar title
const routeSubtitleMap: Record<string, string> = {
  "/admin/dashboard": "Overview of metrics, analytics & real-time store performance",
  "/admin/rental": "Create and submit a new rental order for a customer",
  "/admin/rental-orders": "Browse, filter and manage all rental orders",
  "/admin/items": "View and manage your full item catalog and stock levels",
  "/admin/items/movement": "Track all stock-in and stock-out movement records",
  "/admin/customers": "Manage customer accounts, contacts and credit balances",
  "/admin/customer-payments": "View and record payments received from customers",
  "/admin/employees": "Manage employee profiles and staff information",
  "/admin/attendance": "Mark and review employee daily attendance records",
  "/admin/salary": "Create and manage employee salary payment records",
  "/admin/advances": "Track and manage salary advance requests",
  "/admin/suppliers": "Manage supplier contacts and purchase relationships",
  "/admin/purchasing/orders": "Create and track goods received note (GRN) orders",
  "/admin/financials/accounts": "Manage company bank accounts and balances",
  "/admin/financials/expenses": "Record and categorize business expenses",
  "/admin/financials/income": "Track and manage all income entries",
  "/admin/financial/asstes": "Register and manage company-owned assets",
  "/admin/financial/liability": "Track outstanding liabilities and pending dues",
  "/admin/financials/fund-transfer": "Transfer funds between company bank accounts",
  "/admin/reports/sales": "Analyse sales trends, totals and product performance",
  "/admin/reports/profit-loss": "View net profit, loss and margin breakdown",
  "/admin/reports/general-ledger": "Complete double-entry ledger view for all accounts",
  "/admin/reports/customer": "Detailed report of customer activity and balances",
  "/admin/reports/item": "Item-wise movement, stock and sales report",
  "/admin/reports/employee": "Employee performance and salary summary report",
  "/admin/reports/supplier": "Supplier-wise purchase and payment history report",
  "/admin/users": "Manage system user accounts and access roles",
  "/admin/users/permissions": "Configure roles and module-level permissions",
  "/admin/settings/profile": "Update your personal profile and account settings",
};

// Map path prefix to active icon section in IconSidebar
function getActiveSectionFromPath(pathname: string): string {
  if (pathname.includes("/rental")) return "rent";
  if (pathname.includes("/items")) return "items";
  if (
    pathname.includes("/customer") ||
    pathname.includes("/employee") ||
    pathname.includes("/attendance") ||
    pathname.includes("/salary") ||
    pathname.includes("/advances")
  )
    return "customers";
  if (pathname.includes("/supplier") || pathname.includes("/purchasing"))
    return "purchasing";
  if (pathname.includes("/financial")) return "financials";
  if (pathname.includes("/reports")) return "reports";
  if (pathname.includes("/users") || pathname.includes("/settings"))
    return "settings";
  return "main";
}

function DashboardLayout() {
  useDashboardShortcut();
  const location = useLocation();

  // Dual sidebar state: Secondary Sidebar is open by default
  const [secondarySidebarCollapsed, setSecondarySidebarCollapsed] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("Last 30 days");

  const activeSection = getActiveSectionFromPath(location.pathname);
  const currentTitle = routeTitleMap[location.pathname] || "RentPro Admin";
  const currentSubtitle = routeSubtitleMap[location.pathname] || "Manage your business operations";

  const handleSelectIconSection = (_sectionId: string) => {
    // Expand secondary sidebar when clicking an icon in Icon Sidebar
    if (secondarySidebarCollapsed) {
      setSecondarySidebarCollapsed(false);
    }
  };

  const toggleSecondarySidebar = () => {
    setSecondarySidebarCollapsed((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-[#f0f0f3] dark:bg-[#0f172a] text-[#1a1a2e] dark:text-slate-100 font-sans antialiased transition-colors duration-200">
      <div className="flex min-h-screen relative overflow-x-hidden">
        {/* 1. NARROW ICON SIDEBAR (72px, visible when SecondarySidebar is hidden) */}
        <IconSidebar
          collapsed={!secondarySidebarCollapsed}
          activeSection={activeSection}
          onSelectSection={handleSelectIconSection}
          onLogoClick={toggleSecondarySidebar}
        />

        {/* 2. SECONDARY SIDEBAR (260px wide, visible at left-0 when open) */}
        <SecondarySidebar
          collapsed={secondarySidebarCollapsed}
          onHideClick={toggleSecondarySidebar}
          activeSection={activeSection}
          isStandalone={true}
        />

        {/* Mobile backdrop overlay */}
        {!secondarySidebarCollapsed && (
          <div
            onClick={toggleSecondarySidebar}
            className="fixed inset-0 z-10 bg-black/30 backdrop-blur-xs lg:hidden"
          />
        )}

        {/* MAIN CONTENT AREA FOR ALL WEB APPLICATION PAGES */}
        <div
          className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
            secondarySidebarCollapsed
              ? "ml-[72px]"
              : "ml-0 lg:ml-[260px]"
          }`}
        >
          {/* 3. DASHBOARD TOP BAR */}
          <DashboardTopBar
            title={currentTitle}
            subtitle={currentSubtitle}
            selectedPeriod={selectedPeriod}
            onPeriodChange={(period) => setSelectedPeriod(period)}
          />

          {/* DYNAMIC PAGE ROUTE OUTLET */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] w-full mx-auto">
            <Outlet />
          </main>
        </div>
      </div>

      <FullscreenResumeBanner />
    </div>
  );
}

export default DashboardLayout;