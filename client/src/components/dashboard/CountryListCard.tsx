import { Globe, ArrowUpRight } from "lucide-react";

interface CountryRankItem {
  id: string;
  country: string;
  code: string;
  percentage: number;
  revenue: string;
  color: string;
}

const countryRankings: CountryRankItem[] = [
  {
    id: "us",
    country: "United States",
    code: "US",
    percentage: 38.6,
    revenue: "$49,580",
    color: "#059669", // Mint green
  },
  {
    id: "ca",
    country: "Canada",
    code: "CA",
    percentage: 22.4,
    revenue: "$28,770",
    color: "#2563eb", // Blue
  },
  {
    id: "de",
    country: "Germany",
    code: "DE",
    percentage: 15.8,
    revenue: "$20,290",
    color: "#f59e0b", // Amber
  },
  {
    id: "uk",
    country: "United Kingdom",
    code: "UK",
    percentage: 12.1,
    revenue: "$15,540",
    color: "#ec4899", // Pink
  },
  {
    id: "au",
    country: "Australia",
    code: "AU",
    percentage: 11.1,
    revenue: "$14,270",
    color: "#8b5cf6", // Purple
  },
];

export default function CountryListCard() {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-[#e2e6ea] dark:border-slate-800 bg-white dark:bg-[#1e293b] p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] sm:p-6">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-[#1a1a2e] dark:text-slate-100">
            Sales by countries
          </h2>
          <p className="text-xs text-[#8b8b9e] dark:text-slate-400">
            Geographic distribution of global recurring orders
          </p>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#e6f4ea] dark:bg-emerald-950/60 text-[#059669] dark:text-emerald-400">
          <Globe className="h-4 w-4" />
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
        {/* Ranked list rows */}
        <div className="space-y-3 lg:col-span-7">
          {countryRankings.map((item) => (
            <div key={item.id} className="group space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center space-x-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-[#1a1a2e] dark:text-slate-200 group-hover:text-[#059669] dark:group-hover:text-emerald-400 transition-colors">
                    {item.country}
                  </span>
                  <span className="rounded bg-[#f0f0f3] dark:bg-slate-800 px-1.5 py-0.2 text-[10px] font-bold text-[#8b8b9e] dark:text-slate-400">
                    {item.code}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[#8b8b9e] dark:text-slate-400 font-normal">
                    {item.revenue}
                  </span>
                  <span className="font-extrabold text-[#1a1a2e] dark:text-slate-100">
                    {item.percentage}%
                  </span>
                </div>
              </div>

              {/* Progress bar line */}
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#f0f0f3] dark:bg-slate-800">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Small decorative SVG map graphic with highlighted regions */}
        <div className="relative flex flex-col items-center justify-center rounded-xl border border-[#e2e6ea] dark:border-slate-800 bg-[#f7f8fa] dark:bg-slate-800/50 p-4 lg:col-span-5">
          <div className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider text-[#8b8b9e] dark:text-slate-400">
            Global Regions
          </div>

          <svg
            viewBox="0 0 400 200"
            className="w-full h-auto max-h-[160px] opacity-80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M50 40 Q80 20 120 40 T100 90 T40 70 Z"
              fill="#cbd2d9"
              opacity="0.5"
            />
            <path
              d="M90 100 Q120 100 110 160 T80 150 Z"
              fill="#cbd2d9"
              opacity="0.4"
            />
            <path
              d="M180 30 Q220 20 230 50 T190 60 Z"
              fill="#cbd2d9"
              opacity="0.5"
            />
            <path
              d="M180 70 Q220 70 210 130 T170 110 Z"
              fill="#cbd2d9"
              opacity="0.4"
            />
            <path
              d="M240 30 Q330 20 340 80 T260 80 Z"
              fill="#cbd2d9"
              opacity="0.5"
            />
            <path
              d="M300 120 Q340 120 330 160 T290 150 Z"
              fill="#cbd2d9"
              opacity="0.5"
            />

            <circle cx="80" cy="50" r="10" fill="#059669" fillOpacity="0.2" />
            <circle cx="80" cy="50" r="5" fill="#059669" />

            <circle cx="95" cy="35" r="8" fill="#2563eb" fillOpacity="0.2" />
            <circle cx="95" cy="35" r="4" fill="#2563eb" />

            <circle cx="205" cy="42" r="7" fill="#f59e0b" fillOpacity="0.2" />
            <circle cx="205" cy="42" r="3.5" fill="#f59e0b" />

            <circle cx="315" cy="140" r="8" fill="#8b5cf6" fillOpacity="0.2" />
            <circle cx="315" cy="140" r="4" fill="#8b5cf6" />
          </svg>

          <div className="mt-2 flex items-center space-x-1 text-[11px] font-semibold text-[#059669] dark:text-emerald-400">
            <span>5 Active Regional Hubs</span>
            <ArrowUpRight className="h-3 w-3" />
          </div>
        </div>
      </div>
    </div>
  );
}
