import React from "react";
import {
  Wallet,
  TrendingUp,
  Users,
  PackageCheck,
  Receipt,
  ScrollText,
  UserCheck,
  Boxes,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
} from "lucide-react";

export interface KpiCardData {
  id: string;
  label: string;
  value: string;
  change?: {
    percentage: string;
    isPositive: boolean;
  };
  icon: React.ElementType;
  iconBgColor: string;
  iconTextColor: string;
}

const primaryKpiCards: KpiCardData[] = [
  {
    id: "total-revenue",
    label: "Total Revenue",
    value: "Rs. 71,000",
    change: { percentage: "12.4%", isPositive: true },
    icon: Wallet,
    iconBgColor: "bg-emerald-50 dark:bg-emerald-950/70",
    iconTextColor: "text-emerald-700 dark:text-emerald-300",
  },
  {
    id: "net-profit",
    label: "Net Profit",
    value: "Rs. 33,000",
    change: { percentage: "9.8%", isPositive: true },
    icon: TrendingUp,
    iconBgColor: "bg-blue-50 dark:bg-blue-950/70",
    iconTextColor: "text-blue-700 dark:text-blue-300",
  },
  {
    id: "active-rentals",
    label: "Active Rentals",
    value: "124",
    change: { percentage: "8.1%", isPositive: true },
    icon: PackageCheck,
    iconBgColor: "bg-teal-50 dark:bg-teal-950/70",
    iconTextColor: "text-teal-700 dark:text-teal-300",
  },
  {
    id: "total-customers",
    label: "Total Customers",
    value: "892",
    change: { percentage: "3.2%", isPositive: true },
    icon: Users,
    iconBgColor: "bg-purple-50 dark:bg-purple-950/70",
    iconTextColor: "text-purple-700 dark:text-purple-300",
  },
];

const secondaryKpiCards: KpiCardData[] = [
  {
    id: "pending-invoices",
    label: "Pending Invoices",
    value: "27",
    change: { percentage: "5.6%", isPositive: false },
    icon: Receipt,
    iconBgColor: "bg-amber-50 dark:bg-amber-950/70",
    iconTextColor: "text-amber-700 dark:text-amber-300",
  },
  {
    id: "pending-liabilities",
    label: "Pending Liabilities",
    value: "Rs. 178,500",
    icon: ScrollText,
    iconBgColor: "bg-rose-50 dark:bg-rose-950/70",
    iconTextColor: "text-rose-700 dark:text-rose-300",
  },
  {
    id: "employees",
    label: "Employees",
    value: "14",
    icon: UserCheck,
    iconBgColor: "bg-indigo-50 dark:bg-indigo-950/70",
    iconTextColor: "text-indigo-700 dark:text-indigo-300",
  },
  {
    id: "owned-assets",
    label: "Owned Assets",
    value: "9",
    icon: Boxes,
    iconBgColor: "bg-cyan-50 dark:bg-cyan-950/70",
    iconTextColor: "text-cyan-700 dark:text-cyan-300",
  },
];

interface KpiStatRowProps {
  onAddDataClick?: () => void;
}

export default function KpiStatRow({ onAddDataClick }: KpiStatRowProps) {
  return (
    <div className="space-y-4">
      {/* Primary KPI Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Key Performance Indicators
        </h2>
        <button
          onClick={onAddDataClick}
          className="flex items-center space-x-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Custom Metric</span>
        </button>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {primaryKpiCards.map((card) => {
          const Icon = card.icon;
          const isUp = card.change?.isPositive;

          return (
            <div
              key={card.id}
              className="group relative flex flex-col justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-emerald-500/30"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {card.label}
                </span>
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl ${card.iconBgColor} ${card.iconTextColor} transition-transform duration-200 group-hover:scale-105`}
                >
                  <Icon className="h-4 w-4" />
                </div>
              </div>

              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                  {card.value}
                </span>

                {card.change && (
                  <div
                    className={`inline-flex items-center space-x-0.5 rounded-full px-2 py-0.5 text-xs font-bold border ${
                      isUp
                        ? "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60"
                        : "bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60"
                    }`}
                  >
                    {isUp ? (
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    ) : (
                      <ArrowDownRight className="h-3.5 w-3.5" />
                    )}
                    <span>{card.change.percentage}</span>
                  </div>
                )}
              </div>
              {card.change && (
                <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">
                  vs last month
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Secondary Operational Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-1">
        {secondaryKpiCards.map((card) => {
          const Icon = card.icon;
          const hasChange = !!card.change;
          const isUp = card.change?.isPositive;

          return (
            <div
              key={card.id}
              className="group relative flex flex-col justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-emerald-500/30"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {card.label}
                </span>
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl ${card.iconBgColor} ${card.iconTextColor} transition-transform duration-200 group-hover:scale-105`}
                >
                  <Icon className="h-4 w-4" />
                </div>
              </div>

              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                  {card.value}
                </span>

                {hasChange && (
                  <div
                    className={`inline-flex items-center space-x-0.5 rounded-full px-2 py-0.5 text-xs font-bold border ${
                      isUp
                        ? "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60"
                        : "bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60"
                    }`}
                  >
                    {isUp ? (
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    ) : (
                      <ArrowDownRight className="h-3.5 w-3.5" />
                    )}
                    <span>{card.change?.percentage}</span>
                  </div>
                )}
              </div>
              {hasChange && (
                <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">
                  vs last month
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
