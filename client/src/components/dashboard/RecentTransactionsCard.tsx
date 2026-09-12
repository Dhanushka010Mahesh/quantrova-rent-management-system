import { useNavigate } from "react-router-dom";
import { ArrowRight, Receipt } from "lucide-react";

interface Transaction {
  id: string;
  customer: string;
  type: string;
  amount: string;
  status: "Paid" | "Pending" | "Overdue";
}

const recentTransactionsData: Transaction[] = [
  { id: "INV-1042", customer: "Sunil Perera", type: "Sale", amount: "Rs. 24,500", status: "Paid" },
  { id: "INV-1041", customer: "Kamal Fernando", type: "Rental", amount: "Rs. 8,200", status: "Pending" },
  { id: "INV-1040", customer: "Nadeesha Silva", type: "Sale", amount: "Rs. 15,750", status: "Paid" },
  { id: "INV-1039", customer: "Ruwan Jayasuriya", type: "Rental", amount: "Rs. 11,300", status: "Overdue" },
  { id: "INV-1038", customer: "Chathurika Perera", type: "Sale", amount: "Rs. 6,900", status: "Paid" },
];

const statusStyles: Record<Transaction["status"], string> = {
  Paid: "bg-[#e6f4ea] dark:bg-emerald-950/60 text-[#059669] dark:text-emerald-400 border-[#059669]/20",
  Pending: "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/50",
  Overdue: "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900/50",
};

export default function RecentTransactionsCard() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-between rounded-xl border border-[#e2e6ea] dark:border-slate-800 bg-white dark:bg-[#1e293b] p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] sm:p-6">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#e6f4ea] dark:bg-emerald-950/60 text-[#059669] dark:text-emerald-400">
              <Receipt className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1a1a2e] dark:text-slate-100">
                Recent Transactions
              </h2>
              <p className="text-xs text-[#8b8b9e] dark:text-slate-400">
                Latest 5 customer invoices
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/admin/reports/sales")}
            className="flex items-center space-x-1 text-xs font-bold text-[#059669] dark:text-emerald-400 hover:underline"
          >
            <span>View all</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {/* Transactions List */}
        <div className="divide-y divide-[#f0f0f3] dark:divide-slate-800">
          {recentTransactionsData.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between py-3 transition-colors hover:bg-[#f7f8fa] dark:hover:bg-slate-800/80 px-2 rounded-lg"
            >
              <div className="min-w-0 pr-2">
                <p className="truncate text-xs font-bold text-[#1a1a2e] dark:text-slate-100">
                  {tx.customer}
                </p>
                <p className="text-[11px] font-medium text-[#8b8b9e] dark:text-slate-400">
                  {tx.id} · <span className="text-[#1a1a2e] dark:text-slate-200 font-semibold">{tx.type}</span>
                </p>
              </div>

              <div className="flex shrink-0 flex-col items-end space-y-1">
                <span className="text-xs font-extrabold text-[#1a1a2e] dark:text-slate-100">
                  {tx.amount}
                </span>
                <span
                  className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${
                    statusStyles[tx.status]
                  }`}
                >
                  {tx.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
