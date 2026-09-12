import { Outlet } from "react-router-dom";
import { menuItems } from "../config/menuConfig";
import FloatingSidebarMenu from "../components/menu_bar/FloatingSidebarMenu";
import { useDashboardShortcut } from "../hooks/useDashboardShortcut";
import FullscreenResumeBanner from "./FullscreenResumeBanner";

function DashboardLayout() {
  useDashboardShortcut();
  return (
    <div className="min-h-screen bg-background">
      <FloatingSidebarMenu items={menuItems} />

      <main>
        <Outlet />
      </main>

      <FullscreenResumeBanner />
    </div>
  );
}

export default DashboardLayout; 