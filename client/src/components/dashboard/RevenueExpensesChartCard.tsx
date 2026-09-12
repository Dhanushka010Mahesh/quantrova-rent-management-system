import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ArrowUpRight } from "lucide-react";

const revenueTrendData = [
  { month: "Mar", revenue: 42000, expenses: 28000 },
  { month: "Apr", revenue: 51000, expenses: 31000 },
  { month: "May", revenue: 47500, expenses: 29500 },
  { month: "Jun", revenue: 58000, expenses: 33000 },
  { month: "Jul", revenue: 63500, expenses: 35500 },
  { month: "Aug", revenue: 71000, expenses: 38000 },
];

function RevenueTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    const rev = payload[0]?.value;
    const exp = payload[1]?.value;
    const profit = rev - exp;

    return (
      <div className="rounded-xl border border-[#e2e6ea] dark:border-slate-700 bg-white dark:bg-slate-800 p-3 shadow-xl ring-1 ring-black/5 min-w-[170px]">
        <p className="text-xs font-bold text-[#1a1a2e] dark:text-slate-100 mb-2 border-b border-[#f0f0f3] dark:border-slate-700 pb-1">
          {label} Performance
        </p>

        <div className="flex items-center justify-between py-1">
          <div className="flex items-center space-x-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#059669]" />
            <span className="text-[11px] font-medium text-[#8b8b9e] dark:text-slate-400">
              Revenue
            </span>
          </div>
          <span className="text-xs font-extrabold text-[#1a1a2e] dark:text-slate-100">
            Rs. {rev?.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between py-1">
          <div className="flex items-center space-x-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
            <span className="text-[11px] font-medium text-[#8b8b9e] dark:text-slate-400">
              Expenses
            </span>
          </div>
          <span className="text-xs font-extrabold text-[#1a1a2e] dark:text-slate-100">
            Rs. {exp?.toLocaleString()}
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between rounded-lg bg-[#e6f4ea] dark:bg-emerald-950/60 px-2 py-1 text-[11px] font-bold text-[#059669] dark:text-emerald-400">
          <span>Net Margin</span>
          <span>Rs. {profit?.toLocaleString()}</span>
        </div>
      </div>
    );
  }
  return null;
}

export default function RevenueExpensesChartCard() {
  return (
    <div className="rounded-xl border border-[#e2e6ea] dark:border-slate-800 bg-white dark:bg-[#1e293b] p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-bold text-[#1a1a2e] dark:text-slate-100">
              Revenue & Expenses
            </h2>
            <span className="inline-flex items-center rounded-full bg-[#e6f4ea] dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] font-bold text-[#059669] dark:text-emerald-400">
              <ArrowUpRight className="mr-0.5 h-3 w-3" />
              +12.4% YoY
            </span>
          </div>
          <p className="text-xs text-[#8b8b9e] dark:text-slate-400">
            Last 6 months cash flow overview
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="h-3 w-3 rounded-full bg-[#059669]" />
            <span className="text-xs font-semibold text-[#1a1a2e] dark:text-slate-100">
              Revenue
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="h-3 w-3 rounded-full bg-rose-500" />
            <span className="text-xs font-semibold text-[#1a1a2e] dark:text-slate-100">
              Expenses
            </span>
          </div>
        </div>
      </div>

      {/* Line Chart */}
      <div className="h-[270px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={revenueTrendData}
            margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#cbd2d9" opacity={0.3} vertical={false} />
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
              tickFormatter={(val) => `${val / 1000}k`}
              dx={-8}
            />
            <Tooltip content={<RevenueTooltip />} />
            <Line
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              stroke="#059669"
              strokeWidth={3}
              dot={{ r: 4, fill: "#059669", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6, fill: "#059669" }}
            />
            <Line
              type="monotone"
              dataKey="expenses"
              name="Expenses"
              stroke="#f43f5e"
              strokeWidth={3}
              dot={{ r: 4, fill: "#f43f5e", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6, fill: "#f43f5e" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
