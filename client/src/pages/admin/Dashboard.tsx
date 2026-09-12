import { useState } from "react";
import IconSidebar from "../../components/dashboard/IconSidebar";
import SecondarySidebar from "../../components/dashboard/SecondarySidebar";
import DashboardTopBar from "../../components/dashboard/DashboardTopBar";
import KpiStatRow from "../../components/dashboard/KpiStatRow";
import AttentionAndGlanceWidgets from "../../components/dashboard/AttentionAndGlanceWidgets";
import RevenueExpensesChartCard from "../../components/dashboard/RevenueExpensesChartCard";
import BarChartCard from "../../components/dashboard/BarChartCard";
import DonutChartCard from "../../components/dashboard/DonutChartCard";
import RecentTransactionsCard from "../../components/dashboard/RecentTransactionsCard";
import CountryListCard from "../../components/dashboard/CountryListCard";

export default function Dashboard() {
  const [secondarySidebarCollapsed, setSecondarySidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState("main");
  const [selectedPeriod, setSelectedPeriod] = useState("Last 30 days");

  const handleSelectIconSection = (sectionId: string) => {
    setActiveSection(sectionId);
    // Expand secondary sidebar when clicking an icon in Icon Sidebar
    if (secondarySidebarCollapsed) {
      setSecondarySidebarCollapsed(false);
    }
  };

  const toggleSecondarySidebar = () => {
    setSecondarySidebarCollapsed(!secondarySidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-[#f0f0f3] dark:bg-[#0f172a] text-[#1a1a2e] dark:text-slate-100 font-sans antialiased transition-colors duration-200">
      <div className="flex min-h-screen relative overflow-x-hidden">
        {/* 1. NARROW ICON SIDEBAR (72px, visible when SecondarySidebar is hidden) */}
        <IconSidebar
          collapsed={!secondarySidebarCollapsed}
          activeSection={activeSection}
          onSelectSection={handleSelectIconSection}
          onLogoClick={toggleSecondarySidebar}
        />

        {/* 2. SECONDARY SIDEBAR (260px wide, visible at left-0 when open) */}
        <SecondarySidebar
          collapsed={secondarySidebarCollapsed}
          onHideClick={toggleSecondarySidebar}
          activeSection={activeSection}
          isStandalone={true}
        />

        {/* Mobile backdrop overlay */}
        {!secondarySidebarCollapsed && (
          <div
            onClick={toggleSecondarySidebar}
            className="fixed inset-0 z-10 bg-black/30 backdrop-blur-xs lg:hidden"
          />
        )}

        {/* MAIN CONTENT AREA */}
        <div
          className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
            secondarySidebarCollapsed
              ? "ml-[72px]"
              : "ml-0 lg:ml-[260px]"
          }`}
        >
          {/* 3. TOP BAR */}
          <DashboardTopBar
            title="Dashboard"
            selectedPeriod={selectedPeriod}
            onPeriodChange={(period) => setSelectedPeriod(period)}
          />

          {/* DASHBOARD BODY CONTENT */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] w-full mx-auto">
            {/* 4. KPI STAT CARDS ROW */}
            <section>
              <KpiStatRow
                onAddDataClick={() =>
                  alert("Add Data dialog — custom metric configuration.")
                }
              />
            </section>

            {/* 5. OPERATIONS & ATTENTION FEED */}
            <section>
              <AttentionAndGlanceWidgets />
            </section>

            {/* 6. CHARTS ROW 1: REVENUE & EXPENSES + ITEM CATEGORIES */}
            <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <RevenueExpensesChartCard />
              </div>
              <div>
                <DonutChartCard />
              </div>
            </section>

            {/* 7. CHARTS ROW 2: SALES VS RENTALS + RECENT TRANSACTIONS */}
            <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <BarChartCard />
              </div>
              <div>
                <RecentTransactionsCard />
              </div>
            </section>

            {/* 8. RANKED LIST CARD (Sales by countries) */}
            <section>
              <CountryListCard />
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}