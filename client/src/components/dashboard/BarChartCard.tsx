import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, ArrowUpRight } from "lucide-react";

const salesVsRentalsData = [
  { month: "Mar", sales: 120, rentals: 84 },
  { month: "Apr", sales: 138, rentals: 92 },
  { month: "May", sales: 129, rentals: 101 },
  { month: "Jun", sales: 154, rentals: 96 },
  { month: "Jul", sales: 167, rentals: 112 },
  { month: "Aug", sales: 181, rentals: 124 },
];

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    const salesVal = payload[0]?.value;
    const rentalsVal = payload[1]?.value;

    return (
      <div className="rounded-xl border border-[#e2e6ea] dark:border-slate-700 bg-white dark:bg-slate-800 p-3 shadow-xl ring-1 ring-black/5 min-w-[160px]">
        <p className="text-xs font-bold text-[#1a1a2e] dark:text-slate-100 mb-2 border-b border-[#f0f0f3] dark:border-slate-700 pb-1">
          {label} Transactions
        </p>

        <div className="flex items-center justify-between py-1">
          <div className="flex items-center space-x-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#059669]" />
            <span className="text-[11px] font-medium text-[#8b8b9e] dark:text-slate-400">
              Sales
            </span>
          </div>
          <span className="text-xs font-extrabold text-[#1a1a2e] dark:text-slate-100">
            {salesVal} orders
          </span>
        </div>

        <div className="flex items-center justify-between py-1">
          <div className="flex items-center space-x-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#2563eb]" />
            <span className="text-[11px] font-medium text-[#8b8b9e] dark:text-slate-400">
              Rentals
            </span>
          </div>
          <span className="text-xs font-extrabold text-[#1a1a2e] dark:text-slate-100">
            {rentalsVal} orders
          </span>
        </div>

        <div className="mt-2 flex items-center space-x-1 rounded-lg bg-[#e6f4ea] dark:bg-emerald-950/60 px-2 py-1 text-[10px] font-bold text-[#059669] dark:text-emerald-400">
          <ArrowUpRight className="h-3 w-3" />
          <span>+8.4% growth</span>
        </div>
      </div>
    );
  }

  return null;
}

export default function BarChartCard() {
  return (
    <div className="rounded-xl border border-[#e2e6ea] dark:border-slate-800 bg-white dark:bg-[#1e293b] p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] sm:p-6">
      {/* Top Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-bold text-[#1a1a2e] dark:text-slate-100">
              Sales vs Rentals
            </h2>
            <span className="inline-flex items-center rounded-full bg-[#e6f4ea] dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] font-bold text-[#059669] dark:text-emerald-400">
              <TrendingUp className="mr-1 h-3 w-3" />
              Volume Comparison
            </span>
          </div>
          <p className="text-xs text-[#8b8b9e] dark:text-slate-400">
            Monthly transaction count
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="h-3 w-3 rounded-full bg-[#059669]" />
            <span className="text-xs font-semibold text-[#1a1a2e] dark:text-slate-100">
              Sales
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="h-3 w-3 rounded-full bg-[#2563eb]" />
            <span className="text-xs font-semibold text-[#1a1a2e] dark:text-slate-100">
              Rentals
            </span>
          </div>
        </div>
      </div>

      {/* Bar Chart Container */}
      <div className="h-[270px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={salesVsRentalsData}
            margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
            barGap={4}
            barCategoryGap="25%"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#cbd2d9"
              opacity={0.3}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#8b8b9e", fontSize: 12, fontWeight: 500 }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#8b8b9e", fontSize: 12, fontWeight: 500 }}
              dx={-8}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(100,100,100,0.1)" }} />

            <Bar
              dataKey="sales"
              name="Sales"
              fill="#059669"
              radius={[6, 6, 0, 0]}
              maxBarSize={24}
            />
            <Bar
              dataKey="rentals"
              name="Rentals"
              fill="#2563eb"
              radius={[6, 6, 0, 0]}
              maxBarSize={24}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
