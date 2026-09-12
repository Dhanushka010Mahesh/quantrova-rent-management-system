import { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  ChevronRight,
  ChevronsLeft,
  LayoutDashboard,
  Users,
  Package,
  Layers,
  ShoppingBag,
  CreditCard,
  FileBarChart2,
  Settings,
  LogOut,
  Circle,
  Search,
  X,
  Filter,
  Sparkles,
} from "lucide-react";

interface SecondarySidebarProps {
  collapsed?: boolean;
  onHideClick?: () => void;
  activeSection?: string;
  isStandalone?: boolean;
}

interface NavSubItem {
  id: string;
  label: string;
  path: string;
  badge?: string;
  badgeColor?: string;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  children?: NavSubItem[];
  path?: string;
  badge?: string;
  badgeColor?: string;
}

interface NavSection {
  id: string;
  title: string;
  items: NavItem[];
}

const allSections: NavSection[] = [
  {
    id: "main",
    title: "DASHBOARD & OVERVIEW",
    items: [
      {
        id: "dashboard",
        label: "Dashboard Overview",
        icon: LayoutDashboard,
        path: "/admin/dashboard",
        badge: "Live",
        badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      },
    ],
  },
  {
    id: "rent",
    title: "RENT MANAGEMENT",
    items: [
      {
        id: "rentals",
        label: "Rent Orders",
        icon: Layers,
        badge: "124",
        badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        children: [
          { id: "rental-create", label: "New Rental Order", path: "/admin/rental", badge: "New" },
          { id: "rental-orders", label: "All Rental Orders", path: "/admin/rental-orders", badge: "124" },
        ],
      },
    ],
  },
  {
    id: "items",
    title: "ITEMS & INVENTORY",
    items: [
      {
        id: "inventory",
        label: "Inventory Hub",
        icon: Package,
        badge: "Stock",
        badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
        children: [
          { id: "items-all", label: "Item Catalog", path: "/admin/items" },
          { id: "items-movement", label: "Stock Movements", path: "/admin/items/movement", badge: "Live" },
        ],
      },
    ],
  },
  {
    id: "customers",
    title: "CUSTOMERS & STAFF",
    items: [
      {
        id: "customers-module",
        label: "Customers",
        icon: Users,
        badge: "892",
        badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
        children: [
          { id: "customers-all", label: "Customer List", path: "/admin/customers", badge: "892" },
          { id: "customer-payments", label: "Payments Received", path: "/admin/customer-payments" },
        ],
      },
      {
        id: "employee-module",
        label: "Employee Hub",
        icon: Users,
        badge: "14 staff",
        badgeColor: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
        children: [
          { id: "employees-all", label: "Staff Directory", path: "/admin/employees", badge: "14" },
          { id: "attendance", label: "Daily Attendance", path: "/admin/attendance", badge: "Today" },
          { id: "salary", label: "Salary Records", path: "/admin/salary" },
          { id: "advances", label: "Salary Advances", path: "/admin/advances" },
        ],
      },
    ],
  },
  {
    id: "purchasing",
    title: "PURCHASING & ORDERS",
    items: [
      {
        id: "purchasing-module",
        label: "Purchasing",
        icon: ShoppingBag,
        badge: "GRN",
        badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
        children: [
          { id: "suppliers", label: "Suppliers List", path: "/admin/suppliers" },
          { id: "purchase-orders", label: "GRN Orders", path: "/admin/purchasing/orders", badge: "PO" },
        ],
      },
    ],
  },
  {
    id: "financials",
    title: "FINANCIAL ACCOUNTS",
    items: [
      {
        id: "financials-module",
        label: "Financial Accounts",
        icon: CreditCard,
        badge: "Accounts",
        badgeColor: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
        children: [
          { id: "accounts", label: "Bank Accounts", path: "/admin/financials/accounts" },
          { id: "expenses", label: "Expenses Log", path: "/admin/financials/expenses" },
          { id: "income", label: "Income Stream", path: "/admin/financials/income" },
          { id: "assets", label: "Company Assets", path: "/admin/financial/asstes" },
          { id: "liabilities", label: "Liabilities", path: "/admin/financial/liability", badge: "Rs.178k" },
          { id: "fund-transfer", label: "Fund Transfers", path: "/admin/financials/fund-transfer" },
        ],
      },
    ],
  },
  {
    id: "reports",
    title: "REPORTS & ANALYTICS",
    items: [
      {
        id: "reports-module",
        label: "Reports & Analytics",
        icon: FileBarChart2,
        badge: "Pro",
        badgeColor: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
        children: [
          { id: "reports-sales", label: "Sales Analytics", path: "/admin/reports/sales" },
          { id: "reports-profit", label: "Profit & Loss", path: "/admin/reports/profit-loss", badge: "P&L" },
          { id: "reports-ledger", label: "General Ledger", path: "/admin/reports/general-ledger" },
          { id: "reports-customer", label: "Customer Report", path: "/admin/reports/customer" },
          { id: "reports-item", label: "Item Report", path: "/admin/reports/item" },
          { id: "reports-employee", label: "Employee Report", path: "/admin/reports/employee" },
          { id: "reports-supplier", label: "Supplier Report", path: "/admin/reports/supplier" },
        ],
      },
    ],
  },
  {
    id: "settings",
    title: "SYSTEM SETTINGS",
    items: [
      {
        id: "system-module",
        label: "System Settings",
        icon: Settings,
        badge: "Admin",
        badgeColor: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
        children: [
          { id: "users-all", label: "System Users", path: "/admin/users" },
          { id: "permissions", label: "Permissions", path: "/admin/users/permissions", badge: "Role" },
          { id: "profile", label: "My Profile", path: "/admin/settings/profile" },
        ],
      },
    ],
  },
];

export default function SecondarySidebar({
  collapsed = false,
  onHideClick,
  activeSection = "main",
  isStandalone = false,
}: SecondarySidebarProps) {
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<"all" | "active">("all");

  // Track expanded parent dropdown items
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    rentals: true,
    inventory: true,
    "customers-module": true,
    "employee-module": true,
    "purchasing-module": true,
    "financials-module": true,
    "reports-module": true,
    "system-module": true,
  });

  // Automatically expand dropdown if current route matches any child
  useEffect(() => {
    const newExpandedState = { ...expandedItems };
    let hasChanges = false;

    allSections.forEach((section) => {
      section.items.forEach((item) => {
        if (item.children) {
          const isChildActive = item.children.some(
            (child) => child.path === location.pathname
          );
          if (isChildActive && !newExpandedState[item.id]) {
            newExpandedState[item.id] = true;
            hasChanges = true;
          }
        }
      });
    });

    if (hasChanges) {
      setExpandedItems(newExpandedState);
    }
  }, [location.pathname]);

  // When activeSection prop changes, ensure that section's parent items are expanded
  useEffect(() => {
    if (activeSection && activeSection !== "main") {
      const targetSection = allSections.find((s) => s.id === activeSection);
      if (targetSection) {
        setExpandedItems((prev) => {
          const next = { ...prev };
          targetSection.items.forEach((item) => {
            next[item.id] = true;
          });
          return next;
        });

        // Scroll target section into view inside sidebar container
        const el = document.getElementById(`section-${activeSection}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }
    }
  }, [activeSection]);

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Determine sections based on filterMode and searchQuery
  const displayedSections = allSections
    .map((section) => {
      // If filterMode is active, only include matching section
      if (filterMode === "active" && activeSection !== "main" && section.id !== activeSection) {
        return null;
      }

      if (!searchQuery.trim()) {
        return section;
      }

      const q = searchQuery.toLowerCase();
      const sectionMatches = section.title.toLowerCase().includes(q);

      const matchingItems = section.items
        .map((item) => {
          const itemMatches = item.label.toLowerCase().includes(q);
          const matchingChildren = item.children?.filter((child) =>
            child.label.toLowerCase().includes(q)
          );

          if (itemMatches || (matchingChildren && matchingChildren.length > 0) || sectionMatches) {
            return {
              ...item,
              children: sectionMatches ? item.children : matchingChildren || item.children,
            };
          }
          return null;
        })
        .filter(Boolean) as NavItem[];

      if (matchingItems.length > 0 || sectionMatches) {
        return {
          ...section,
          items: matchingItems.length > 0 ? matchingItems : section.items,
        };
      }
      return null;
    })
    .filter(Boolean) as NavSection[];

  return (
    <aside
      className={`fixed top-0 bottom-0 z-20 flex w-[260px] flex-col border-r border-[#e2e6ea] dark:border-slate-800 bg-white dark:bg-[#1e293b] shadow-xs transition-all duration-300 ${
        isStandalone ? "left-0" : "left-[72px]"
      } ${
        collapsed
          ? "-translate-x-[360px] opacity-0 pointer-events-none"
          : "translate-x-0 opacity-100"
      }`}
    >
      {/* Top Header: Logo Badge + Title + Hide Toggle */}
      <div className="flex h-16 items-center justify-between border-b border-[#f0f0f3] dark:border-slate-800 px-4 shrink-0 bg-white dark:bg-[#1e293b]">
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 dark:bg-slate-800 ring-1 ring-slate-800 p-1 shrink-0">
            <img
              src="/rentpro-logo.png"
              alt="RentPro Logo"
              className="h-full w-full object-contain"
            />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-bold text-[#1a1a2e] dark:text-slate-100 leading-none truncate flex items-center gap-1.5">
              RentPro System
              <Sparkles className="h-3 w-3 text-amber-500 shrink-0" />
            </h1>
            <p className="text-[10px] text-[#8b8b9e] dark:text-slate-400 font-medium tracking-wide mt-1 truncate">
              {filterMode === "all" ? "ENTERPRISE MODULES" : "SELECTED MODULE"}
            </p>
          </div>
        </div>

        {/* Hide Button */}
        {onHideClick && (
          <button
            onClick={onHideClick}
            className="flex h-8 items-center space-x-1 rounded-lg border border-[#e2e6ea] dark:border-slate-700 bg-[#f7f8fa] dark:bg-slate-800 px-2 text-xs font-semibold text-[#8b8b9e] dark:text-slate-300 hover:border-[#059669] hover:bg-[#e6f4ea] hover:text-[#059669] dark:hover:bg-emerald-950/60 dark:hover:text-emerald-400 transition-all cursor-pointer shrink-0"
            title="Hide panel & show Icon Sidebar"
          >
            <ChevronsLeft className="h-3.5 w-3.5" />
            <span className="text-[10px] font-bold">Hide</span>
          </button>
        )}
      </div>

      {/* Quick Search & Filter Controls Bar */}
      <div className="p-3 border-b border-[#f0f0f3] dark:border-slate-800 space-y-2 bg-[#f8fafc]/50 dark:bg-slate-900/30 shrink-0">
        {/* Live Search Input */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Quick menu search..."
            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 py-1.5 pl-8 pr-7 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-emerald-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Category View Mode Switcher */}
        <div className="flex items-center justify-between rounded-lg bg-slate-100 dark:bg-slate-800/80 p-0.5 text-[11px] font-semibold">
          <button
            onClick={() => setFilterMode("all")}
            className={`flex-1 rounded-md py-1 text-center transition-all ${
              filterMode === "all"
                ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-2xs font-bold"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            All Modules ({allSections.length})
          </button>
          <button
            onClick={() => setFilterMode("active")}
            className={`flex-1 rounded-md py-1 text-center transition-all ${
              filterMode === "active"
                ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-2xs font-bold"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            Focused
          </button>
        </div>
      </div>

      {/* Main Navigation Scroll Area */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-none"
      >
        {displayedSections.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            <Filter className="h-8 w-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
            <p className="font-semibold text-slate-600 dark:text-slate-400">No matching items</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Try a different search term</p>
          </div>
        ) : (
          displayedSections.map((section) => {
            const isSectionActive = activeSection === section.id;
            return (
              <div
                key={section.id}
                id={`section-${section.id}`}
                className={`space-y-1.5 transition-all duration-200 ${
                  isSectionActive
                    ? "rounded-xl p-1 bg-emerald-500/5 dark:bg-emerald-950/20 ring-1 ring-emerald-500/20"
                    : ""
                }`}
              >
                {/* Category Title Header */}
                <div className="flex items-center justify-between px-2 pt-1">
                  <h2 className="text-[10px] font-extrabold text-[#8b8b9e] dark:text-slate-400 tracking-widest uppercase flex items-center gap-1.5">
                    {section.title}
                    {isSectionActive && (
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    )}
                  </h2>
                  <span className="text-[9px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-full">
                    {section.items.length}
                  </span>
                </div>

                <div className="space-y-1 pt-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isExpanded = !!expandedItems[item.id] || searchQuery.length > 0;
                    const hasChildren = item.children && item.children.length > 0;

                    // Direct Leaf Item
                    if (!hasChildren && item.path) {
                      return (
                        <NavLink
                          key={item.id}
                          to={item.path}
                          className={({ isActive }) =>
                            `group flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-150 ${
                              isActive
                                ? "bg-[#e6f4ea] dark:bg-emerald-950/70 text-[#059669] dark:text-emerald-400 font-bold shadow-2xs border border-emerald-500/20"
                                : "text-[#1a1a2e] dark:text-slate-200 hover:bg-[#f7f8fa] dark:hover:bg-slate-800 hover:text-[#059669] dark:hover:text-emerald-400"
                            }`
                          }
                        >
                          {({ isActive }) => (
                            <>
                              <div className="flex items-center space-x-2.5 min-w-0">
                                <Icon
                                  className={`h-4 w-4 shrink-0 transition-colors ${
                                    isActive
                                      ? "text-[#059669] dark:text-emerald-400"
                                      : "text-[#8b8b9e] dark:text-slate-400 group-hover:text-[#059669] dark:group-hover:text-emerald-400"
                                  }`}
                                />
                                <span className="truncate">{item.label}</span>
                              </div>
                              {item.badge && (
                                <span
                                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${
                                    item.badgeColor ||
                                    "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                                  }`}
                                >
                                  {item.badge}
                                </span>
                              )}
                            </>
                          )}
                        </NavLink>
                      );
                    }

                    // Dropdown Accordion Item
                    return (
                      <div key={item.id} className="space-y-1">
                        <button
                          onClick={() => toggleExpand(item.id)}
                          className={`group flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-150 ${
                            isExpanded
                              ? "text-[#059669] dark:text-emerald-400 bg-[#f7f8fa] dark:bg-slate-800/60"
                              : "text-[#1a1a2e] dark:text-slate-200 hover:bg-[#f7f8fa] dark:hover:bg-slate-800 hover:text-[#059669] dark:hover:text-emerald-400"
                          }`}
                        >
                          <div className="flex items-center space-x-2.5 min-w-0">
                            <Icon className="h-4 w-4 shrink-0 text-[#8b8b9e] dark:text-slate-400 group-hover:text-[#059669] dark:group-hover:text-emerald-400 transition-colors" />
                            <span className="truncate">{item.label}</span>
                          </div>

                          <div className="flex items-center space-x-1.5">
                            {item.badge && (
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${
                                  item.badgeColor ||
                                  "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                            <ChevronRight
                              className={`h-3.5 w-3.5 text-[#8b8b9e] dark:text-slate-400 group-hover:text-[#1a1a2e] dark:group-hover:text-slate-100 transition-transform duration-200 ${
                                isExpanded ? "rotate-90 text-[#059669] dark:text-emerald-400" : ""
                              }`}
                            />
                          </div>
                        </button>

                        {/* Animated Dropdown Submenu Container */}
                        <div
                          className={`grid transition-[grid-template-rows] duration-200 ease-in-out ${
                            isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                          }`}
                        >
                          <div className="overflow-hidden">
                            <div className="ml-3.5 border-l-2 border-[#e6f4ea] dark:border-emerald-950/80 pl-2 space-y-1 py-1">
                              {item.children?.map((sub) => (
                                <NavLink
                                  key={sub.id}
                                  to={sub.path}
                                  className={({ isActive }) =>
                                    `flex items-center justify-between w-full rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors ${
                                      isActive
                                        ? "text-[#059669] dark:text-emerald-400 font-bold bg-[#e6f4ea] dark:bg-emerald-950/60 shadow-2xs border border-emerald-500/20"
                                        : "text-[#8b8b9e] dark:text-slate-400 font-medium hover:text-[#1a1a2e] dark:hover:text-slate-100 hover:bg-[#f7f8fa] dark:hover:bg-slate-800"
                                    }`
                                  }
                                >
                                  {({ isActive }) => (
                                    <>
                                      <div className="flex items-center space-x-2 min-w-0">
                                        <Circle
                                          className={`h-1.5 w-1.5 shrink-0 ${
                                            isActive
                                              ? "fill-[#059669] text-[#059669] dark:fill-emerald-400 dark:text-emerald-400"
                                              : "fill-transparent text-[#cbd2d9] dark:text-slate-600"
                                          }`}
                                        />
                                        <span className="truncate">{sub.label}</span>
                                      </div>
                                      {sub.badge && (
                                        <span className="text-[9px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.2 rounded-full border border-emerald-500/20">
                                          {sub.badge}
                                        </span>
                                      )}
                                    </>
                                  )}
                                </NavLink>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom User Profile Card */}
      <div className="border-t border-[#f0f0f3] dark:border-slate-800 bg-[#f7f8fa]/80 dark:bg-slate-900/60 p-3 shrink-0">
        <div className="flex items-center justify-between rounded-xl bg-white dark:bg-[#1e293b] p-2.5 shadow-xs border border-[#e2e6ea] dark:border-slate-800">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="relative shrink-0">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"
                alt="Admin Account"
                className="h-9 w-9 rounded-full object-cover ring-2 ring-[#e6f4ea] dark:ring-slate-700"
              />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-[#1a1a2e] dark:text-slate-100">
                Administrator
              </p>
              <p className="truncate text-[10px] text-[#8b8b9e] dark:text-slate-400 font-medium">
                RentPro Manager
              </p>
            </div>
          </div>

          <a
            href="/login"
            title="Log out"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#8b8b9e] dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </aside>
  );
}
