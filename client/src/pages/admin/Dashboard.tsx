import KpiStatRow from "../../components/dashboard/KpiStatRow";
import AttentionAndGlanceWidgets from "../../components/dashboard/AttentionAndGlanceWidgets";
import RevenueExpensesChartCard from "../../components/dashboard/RevenueExpensesChartCard";
import BarChartCard from "../../components/dashboard/BarChartCard";
import DonutChartCard from "../../components/dashboard/DonutChartCard";
import RecentTransactionsCard from "../../components/dashboard/RecentTransactionsCard";
import CountryListCard from "../../components/dashboard/CountryListCard";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* 1. KPI STAT CARDS ROW */}
      <section>
        <KpiStatRow
          onAddDataClick={() =>
            alert("Add Data dialog — custom metric configuration.")
          }
        />
      </section>

      {/* 2. OPERATIONS & ATTENTION FEED */}
      <section>
        <AttentionAndGlanceWidgets />
      </section>

      {/* 3. CHARTS ROW 1: REVENUE & EXPENSES + ITEM CATEGORIES */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueExpensesChartCard />
        </div>
        <div>
          <DonutChartCard />
        </div>
      </section>

      {/* 4. CHARTS ROW 2: SALES VS RENTALS + RECENT TRANSACTIONS */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <BarChartCard />
        </div>
        <div>
          <RecentTransactionsCard />
        </div>
      </section>

      {/* 5. RANKED LIST CARD (Sales by countries) */}
      <section>
        <CountryListCard />
      </section>
    </div>
  );
}