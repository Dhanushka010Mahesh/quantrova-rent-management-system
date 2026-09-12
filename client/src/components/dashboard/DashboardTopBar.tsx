import { useState, useRef, useEffect } from "react";
import { ChevronDown, Calendar, Bell, Search, Filter } from "lucide-react";

interface DashboardTopBarProps {
  title?: string;
  selectedPeriod?: string;
  onPeriodChange?: (period: string) => void;
}

const timePeriods = [
  "Last 7 days",
  "Last 30 days",
  "This Month",
  "Last Quarter",
  "This Year",
];

export default function DashboardTopBar({
  title = "Dashboard",
  selectedPeriod = "Last 30 days",
  onPeriodChange,
}: DashboardTopBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b border-[#e2e6ea] dark:border-slate-800 bg-white dark:bg-[#1e293b] px-4 sm:px-6 transition-colors">
      {/* Left side: Large bold page title */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-[#1a1a2e] dark:text-slate-100 sm:text-2xl">
          {title}
        </h1>
        <p className="hidden text-xs text-[#8b8b9e] dark:text-slate-400 sm:block">
          Overview of metrics, analytics & real-time store performance
        </p>
      </div>

      {/* Right side: Search bar, Notifications & Time period filter dropdown */}
      <div className="flex items-center space-x-3">
        {/* Search input (desktop) */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8b8b9e] dark:text-slate-400" />
          <input
            type="text"
            placeholder="Search reports or metrics..."
            className="h-9 w-52 rounded-xl border border-[#e2e6ea] dark:border-slate-700 bg-[#f7f8fa] dark:bg-slate-800/80 pl-9 pr-3 text-xs text-[#1a1a2e] dark:text-slate-100 placeholder-[#8b8b9e] dark:placeholder-slate-400 focus:border-[#059669] dark:focus:border-emerald-400 focus:bg-white dark:focus:bg-slate-800 focus:outline-none transition-all"
          />
        </div>

        {/* Notifications Icon */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[#e2e6ea] dark:border-slate-700 text-[#8b8b9e] dark:text-slate-400 hover:bg-[#f7f8fa] dark:hover:bg-slate-800 hover:text-[#1a1a2e] dark:hover:text-slate-100 transition-colors">
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#10b981]" />
        </button>

        {/* Time period filter dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-9 items-center space-x-2 rounded-xl border border-[#e2e6ea] dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-xs font-semibold text-[#1a1a2e] dark:text-slate-100 shadow-xs hover:border-[#059669] dark:hover:border-emerald-400 hover:bg-[#f7f8fa] dark:hover:bg-slate-700 transition-all"
          >
            <Calendar className="h-3.5 w-3.5 text-[#059669] dark:text-emerald-400" />
            <span>{selectedPeriod}</span>
            <ChevronDown
              className={`h-3.5 w-3.5 text-[#8b8b9e] dark:text-slate-400 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute right-0 mt-1.5 w-44 rounded-xl border border-[#e2e6ea] dark:border-slate-700 bg-white dark:bg-slate-800 py-1 shadow-lg ring-1 ring-black/5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1.5 border-b border-[#f0f0f3] dark:border-slate-700 flex items-center space-x-1.5 text-[10px] font-bold text-[#8b8b9e] dark:text-slate-400 uppercase">
                <Filter className="h-3 w-3" />
                <span>Filter Period</span>
              </div>
              {timePeriods.map((period) => {
                const isSelected = selectedPeriod === period;
                return (
                  <button
                    key={period}
                    onClick={() => {
                      onPeriodChange?.(period);
                      setIsOpen(false);
                    }}
                    className={`flex w-full items-center justify-between px-3 py-2 text-left text-xs font-medium transition-colors ${
                      isSelected
                        ? "bg-[#e6f4ea] dark:bg-emerald-950/60 text-[#059669] dark:text-emerald-400 font-bold"
                        : "text-[#1a1a2e] dark:text-slate-200 hover:bg-[#f7f8fa] dark:hover:bg-slate-700"
                    }`}
                  >
                    <span>{period}</span>
                    {isSelected && (
                      <span className="h-1.5 w-1.5 rounded-full bg-[#059669] dark:bg-emerald-400" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
