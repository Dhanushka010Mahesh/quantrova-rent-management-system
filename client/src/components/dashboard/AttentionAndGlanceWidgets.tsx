import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  PackagePlus,
  Wallet,
  ScrollText,
  Boxes,
  CalendarCheck,
  ChevronRight,
  Clock,
} from "lucide-react";

export interface AttentionItem {
  id: string;
  label: string;
  module: string;
  path: string;
  icon: React.ElementType;
  urgency: "warning" | "danger" | "info";
}

const attentionItemsData: AttentionItem[] = [
  {
    id: "A1",
    label: "3 rental orders awaiting processing",
    module: "Rental Orders",
    path: "/admin/rental-orders",
    icon: PackagePlus,
    urgency: "warning",
  },
  {
    id: "A2",
    label: "2 salary records pending approval",
    module: "Salary",
    path: "/admin/salary",
    icon: Wallet,
    urgency: "warning",
  },
  {
    id: "A3",
    label: "1 liability awaiting approval",
    module: "Liabilities",
    path: "/admin/financial/liability",
    icon: ScrollText,
    urgency: "danger",
  },
  {
    id: "A4",
    label: "Cutting Disc 4in — low stock (12 left)",
    module: "Items Movement",
    path: "/admin/items/movement",
    icon: Boxes,
    urgency: "danger",
  },
  {
    id: "A5",
    label: "5 attendance records pending approval",
    module: "Attendance",
    path: "/admin/attendance",
    icon: CalendarCheck,
    urgency: "info",
  },
];

const urgencyStyles = {
  danger: "bg-rose-500",
  warning: "bg-amber-500",
  info: "bg-blue-500",
};

export default function AttentionAndGlanceWidgets() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Needs Your Attention Card */}
      <div className="flex flex-col justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs lg:col-span-2">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-300">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Needs Your Attention
              </h2>
            </div>
            <span className="rounded-full bg-amber-50 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800/60 px-2.5 py-0.5 text-xs font-bold text-amber-700 dark:text-amber-300">
              {attentionItemsData.length} items
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {attentionItemsData.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className="group flex w-full items-center justify-between py-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/70 px-2 rounded-lg"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <span
                      className={`h-2 w-2 shrink-0 rounded-full ${
                        urgencyStyles[item.urgency]
                      }`}
                    />
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/60 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-slate-900 dark:text-white">
                        {item.label}
                      </p>
                      <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        {item.module}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white transition-transform group-hover:translate-x-0.5" />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Today at a Glance Card */}
      <div className="flex flex-col justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
        <div>
          <div className="mb-4 flex items-center space-x-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-300">
              <Clock className="h-4 w-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Today at a Glance
            </h2>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-3">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                New Orders Today
              </span>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                6
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-3">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Items Out on Rent
              </span>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                37
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-emerald-200/60 dark:border-emerald-800/60 bg-emerald-50/60 dark:bg-emerald-950/40 p-3">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                Cash Collected Today
              </span>
              <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                Rs. 42,300
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-3">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Expected Returns Today
              </span>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                4
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 border-t border-slate-100 dark:border-slate-800 pt-3 text-center">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            Real-time operations synchronized
          </span>
        </div>
      </div>
    </div>
  );
}
