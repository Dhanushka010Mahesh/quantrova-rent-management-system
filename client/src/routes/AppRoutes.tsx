import { Routes, Route, Navigate } from "react-router-dom";

import AdminRoutes from "./AdminRoutes";
import NotFound from "../pages/error/NotFound";
import Loginpage from "../pages/LoginPage";
import Unauthorized from "../pages/error/Unauthorized";
import DashboardLayout from "../layout/DashboardLayout";

function AppRoutes() {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/login" element={<Loginpage />} />

      {/* Dashboard Routes */}
      <Route element={<DashboardLayout />}>
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Route>

      {/* Default */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />

      {/* Unauthorized */}
      <Route path="/unauthorized" element={<Unauthorized />} />
    </Routes>
  );
}

export default AppRoutes;
