import { useState, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  Layers,
  CreditCard,
  FileBarChart2,
  Settings,
  Moon,
  Sun,
  LogOut,
  ShoppingBag,
  ChevronRight,
} from "lucide-react";
import { useDarkMode } from "../../hooks/useDarkMode";

interface IconSidebarProps {
  collapsed?: boolean;
  activeSection?: string;
  onSelectSection?: (sectionId: string) => void;
  onLogoClick?: () => void;
}

interface SubMenuItem {
  id: string;
  label: string;
  path: string;
}

interface MenuItem {
  id: string;
  title: string;
  icon: React.ElementType;
  subItems: SubMenuItem[];
}

const menuItems: MenuItem[] = [
  {
    id: "main",
    title: "Dashboard Overview",
    icon: LayoutDashboard,
    subItems: [
      { id: "overview", label: "Overview Analytics", path: "/admin/dashboard" },
    ],
  },
  {
    id: "rent",
    title: "Rent Management",
    icon: Layers,
    subItems: [
      { id: "rental-create", label: "New Rental Order", path: "/admin/rental" },
      { id: "rental-orders", label: "All Rental Orders", path: "/admin/rental-orders" },
    ],
  },
  {
    id: "items",
    title: "Items & Inventory",
    icon: Package,
    subItems: [
      { id: "items-all", label: "Item Catalog", path: "/admin/items" },
      { id: "items-movement", label: "Stock Movements", path: "/admin/items/movement" },
    ],
  },
  {
    id: "customers",
    title: "Customers & Staff",
    icon: Users,
    subItems: [
      { id: "customers-all", label: "Customer List", path: "/admin/customers" },
      { id: "customer-payments", label: "Payments Received", path: "/admin/customer-payments" },
      { id: "employees-all", label: "Staff Directory", path: "/admin/employees" },
      { id: "attendance", label: "Daily Attendance", path: "/admin/attendance" },
      { id: "salary", label: "Salary Records", path: "/admin/salary" },
      { id: "advances", label: "Salary Advances", path: "/admin/advances" },
    ],
  },
  {
    id: "purchasing",
    title: "Purchasing & Orders",
    icon: ShoppingBag,
    subItems: [
      { id: "suppliers", label: "Suppliers List", path: "/admin/suppliers" },
      { id: "purchase-orders", label: "GRN Orders", path: "/admin/purchasing/orders" },
    ],
  },
  {
    id: "financials",
    title: "Financial Accounts",
    icon: CreditCard,
    subItems: [
      { id: "accounts", label: "Bank Accounts", path: "/admin/financials/accounts" },
      { id: "expenses", label: "Expenses Log", path: "/admin/financials/expenses" },
      { id: "income", label: "Income Stream", path: "/admin/financials/income" },
      { id: "assets", label: "Company Assets", path: "/admin/financial/asstes" },
      { id: "liabilities", label: "Liabilities", path: "/admin/financial/liability" },
      { id: "fund-transfer", label: "Fund Transfers", path: "/admin/financials/fund-transfer" },
    ],
  },
  {
    id: "reports",
    title: "Reports & Analytics",
    icon: FileBarChart2,
    subItems: [
      { id: "reports-sales", label: "Sales Analytics", path: "/admin/reports/sales" },
      { id: "reports-[#profit]", label: "Profit & Loss", path: "/admin/reports/profit-loss" },
      { id: "reports-ledger", label: "General Ledger", path: "/admin/reports/general-ledger" },
      { id: "reports-customer", label: "Customer Report", path: "/admin/reports/customer" },
      { id: "reports-item", label: "Item Report", path: "/admin/reports/item" },
      { id: "reports-employee", label: "Employee Report", path: "/admin/reports/employee" },
      { id: "reports-supplier", label: "Supplier Report", path: "/admin/reports/supplier" },
    ],
  },
  {
    id: "settings",
    title: "System Settings",
    icon: Settings,
    subItems: [
      { id: "users-all", label: "System Users", path: "/admin/users" },
      { id: "permissions", label: "Permissions", path: "/admin/users/permissions" },
      { id: "profile", label: "My Profile", path: "/admin/settings/profile" },
    ],
  },
];

export default function IconSidebar({
  collapsed = false,
  activeSection = "main",
  onSelectSection,
  onLogoClick,
}: IconSidebarProps) {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const location = useLocation();

  const [hoveredFlyout, setHoveredFlyout] = useState<string | null>(null);
  const [flyoutTop, setFlyoutTop] = useState<number>(72);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
  };

  const handleMouseEnter = (itemId: string, event: React.MouseEvent<HTMLButtonElement>) => {
    clearTimer();
    const rect = event.currentTarget.getBoundingClientRect();
    setFlyoutTop(rect.top);
    setHoveredFlyout(itemId);
  };

  const handleMouseLeave = () => {
    clearTimer();
    hoverTimer.current = setTimeout(() => {
      setHoveredFlyout(null);
    }, 250);
  };

  const hoveredMenuItem = menuItems.find((m) => m.id === hoveredFlyout);

  return (
    <div
      className="relative z-40"
      onMouseEnter={clearTimer}
      onMouseLeave={handleMouseLeave}
    >
      {/* NARROW ICON SIDEBAR CONTAINER */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex w-[72px] flex-col border-r border-[#e2e6ea] dark:border-slate-800 bg-[#0f172a] text-slate-100 shadow-xl transition-all duration-300 ${
          collapsed
            ? "-translate-x-full opacity-0 pointer-events-none"
            : "translate-x-0 opacity-100"
        }`}
      >
        {/* Top Logo Badge */}
        <div className="flex h-16 items-center justify-center border-b border-slate-800 px-3">
          <button
            type="button"
            onClick={onLogoClick}
            className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-slate-800 p-1 ring-1 ring-slate-700 hover:ring-emerald-500 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title="Toggle / Show Secondary Sidebar"
          >
            <img
              src="/rentpro-logo.png"
              alt="RentPro Logo"
              className="h-full w-full object-contain"
            />
          </button>
        </div>

        {/* Vertical Stack of Line Icons */}
        <div className="flex-1 overflow-y-auto py-5 px-2.5 space-y-3 scrollbar-none flex flex-col items-center">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isSelected = activeSection === item.id;
            const isChildRouteActive = item.subItems.some(
              (sub) => sub.path === location.pathname
            );

            return (
              <div key={item.id} className="relative group w-full flex justify-center">
                <button
                  onClick={() => onSelectSection?.(item.id)}
                  onMouseEnter={(e) => handleMouseEnter(item.id, e)}
                  title={item.title}
                  className={`relative flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-200 ${
                    isSelected || isChildRouteActive
                      ? "bg-emerald-600 text-white shadow-md scale-105"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {(isSelected || isChildRouteActive) && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-emerald-400 rounded-r-full" />
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Bottom Avatar & Theme Controls */}
        <div className="flex flex-col items-center border-t border-slate-800 p-2.5 space-y-3 bg-[#0f172a]">
          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

          {/* User Avatar Box */}
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 ring-1 ring-slate-700 p-0.5">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"
              alt="User Profile"
              className="h-full w-full rounded-lg object-cover"
            />
          </div>

          {/* Logout button */}
          <a
            href="/login"
            title="Log out"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-950/60 hover:text-rose-400 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </a>
        </div>
      </aside>

      {/* FLYOUT POPOVER PANEL (Positioned directly beside the hovered button) */}
      {hoveredMenuItem && !collapsed && (
        <div
          onMouseEnter={() => {
            clearTimer();
            setHoveredFlyout(hoveredMenuItem.id);
          }}
          onMouseLeave={handleMouseLeave}
          className="fixed left-[78px] z-50 w-56 rounded-2xl border border-slate-700 bg-[#0f172a]/95 text-white p-4 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150"
          style={{
            top: `${Math.max(16, Math.min(flyoutTop - 12, window.innerHeight - 260))}px`,
          }}
        >
          {/* Flyout Category Header */}
          <div className="mb-3 border-b border-slate-800 pb-2 flex items-center justify-between">
            <h3 className="text-xs font-bold tracking-tight text-white uppercase">
              {hoveredMenuItem.title}
            </h3>
            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/60">
              Quick Menu
            </span>
          </div>

          {/* Flyout Submenu Links List */}
          <div className="space-y-1">
            {hoveredMenuItem.subItems.map((sub) => {
              const isSubActive = location.pathname === sub.path;
              return (
                <NavLink
                  key={sub.id}
                  to={sub.path}
                  onClick={() => setHoveredFlyout(null)}
                  className={`group flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-150 ${
                    isSubActive
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <span className="truncate">{sub.label}</span>
                  <ChevronRight
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${
                      isSubActive
                        ? "text-white"
                        : "text-slate-500 group-hover:text-white group-hover:translate-x-0.5"
                    }`}
                  />
                </NavLink>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
