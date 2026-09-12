import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface CategoryItem {
  name: string;
  value: number;
  percentage: string;
  color: string;
}

const categoryData: CategoryItem[] = [
  { name: "Machinery", value: 38, percentage: "38%", color: "#059669" }, // Mint Green
  { name: "Tools", value: 27, percentage: "27%", color: "#2563eb" }, // Blue
  { name: "Furniture", value: 18, percentage: "18%", color: "#f59e0b" }, // Amber
  { name: "Electronics", value: 12, percentage: "12%", color: "#ec4899" }, // Pink
  { name: "Other", value: 5, percentage: "5%", color: "#8b5cf6" }, // Purple
];

export default function DonutChartCard() {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-[#e2e6ea] dark:border-slate-800 bg-white dark:bg-[#1e293b] p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] sm:p-6">
      {/* Top Header */}
      <div className="mb-4">
        <h2 className="text-base font-bold text-[#1a1a2e] dark:text-slate-100">
          Item Categories
        </h2>
        <p className="text-xs text-[#8b8b9e] dark:text-slate-400">By stock share</p>
      </div>

      {/* Main Content Row */}
      <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
        {/* Left: 2-column grid pill chips */}
        <div className="lg:col-span-7">
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {categoryData.map((cat) => (
              <div
                key={cat.name}
                className="flex items-center justify-between rounded-xl border border-[#e2e6ea] dark:border-slate-700 bg-[#f7f8fa] dark:bg-slate-800/80 p-2.5 transition-all duration-150 hover:border-[#059669] dark:hover:border-emerald-500"
              >
                <div className="flex items-center space-x-2 min-w-0">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="truncate text-xs font-semibold text-[#1a1a2e] dark:text-slate-100">
                    {cat.name}
                  </span>
                </div>
                <span className="ml-2 rounded-lg bg-white dark:bg-slate-700 px-2 py-0.5 text-xs font-extrabold text-[#1a1a2e] dark:text-slate-100 shadow-2xs">
                  {cat.percentage}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Donut Chart */}
        <div className="relative flex h-[210px] items-center justify-center lg:col-span-5">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={58}
                outerRadius={82}
                paddingAngle={3}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip
                formatter={(val: any) => `${val}% stock share`}
                contentStyle={{
                  backgroundColor: "var(--color-surface, #ffffff)",
                  borderColor: "var(--color-border, #e2e6ea)",
                  borderRadius: "12px",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "var(--color-text, #1a1a2e)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center text inside donut */}
          <div className="pointer-events-none absolute flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8b8b9e] dark:text-slate-400">
              Total
            </span>
            <span className="text-base font-extrabold text-[#1a1a2e] dark:text-slate-100">
              100%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
