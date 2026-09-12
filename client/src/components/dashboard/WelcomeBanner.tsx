import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PackagePlus, Receipt, UserPlus, CalendarCheck } from "lucide-react";

interface WelcomeBannerProps {
  dateText?: string;
  greetingText?: string;
  attentionCount?: number;
}

export default function WelcomeBanner({
  dateText = "Saturday, September 12, 2026",
  greetingText = "Good afternoon",
  attentionCount = 5,
}: WelcomeBannerProps) {
  const navigate = useNavigate();

  const quickActions = useMemo(
    () => [
      {
        label: "New Rental / Sale",
        path: "/admin/rental",
        icon: PackagePlus,
      },
      {
        label: "Add Expense",
        path: "/admin/financials/expenses",
        icon: Receipt,
      },
      {
        label: "Add Employee",
        path: "/admin/employees",
        icon: UserPlus,
      },
      {
        label: "Mark Attendance",
        path: "/admin/attendance",
        icon: CalendarCheck,
      },
    ],
    []
  );

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#e2e6ea] bg-gradient-to-br from-[#17324d] via-[#1a1a2e] to-[#0f2438] p-6 text-white shadow-md">
      {/* Decorative gradient blur highlights */}
      <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-[#059669]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 left-1/3 h-48 w-48 rounded-full bg-blue-500/20 blur-3xl" />

      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <span className="inline-block rounded-md bg-white/10 px-2.5 py-1 text-xs font-semibold text-emerald-300 backdrop-blur-md">
            {dateText}
          </span>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {greetingText} 👋
          </h1>
          <p className="mt-1 text-xs text-slate-300 sm:text-sm">
            Here's what's happening across your business today —{" "}
            <span className="font-semibold text-emerald-400">
              {attentionCount} items
            </span>{" "}
            need your attention.
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={() => navigate(action.path)}
                className="flex items-center space-x-2 rounded-xl bg-white/10 px-3.5 py-2.5 text-xs font-semibold text-white backdrop-blur-md transition-all duration-150 hover:bg-white/20 hover:scale-[1.02] active:scale-95"
              >
                <Icon className="h-4 w-4 text-emerald-400" />
                <span>{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
