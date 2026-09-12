import { Outlet } from "react-router-dom";
import { useDashboardShortcut } from "../hooks/useDashboardShortcut";
import FullscreenResumeBanner from "./FullscreenResumeBanner";

function DashboardLayout() {
  useDashboardShortcut();
  return (
    <div className="min-h-screen bg-background font-sans">
      <main>
        <Outlet />
      </main>

      <FullscreenResumeBanner />
    </div>
  );
}

export default DashboardLayout;