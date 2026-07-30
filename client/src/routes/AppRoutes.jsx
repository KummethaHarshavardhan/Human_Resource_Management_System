import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";

import Dashboard from "../pages/Dashboard/Dashboard";
import Employee from "../pages/Employee/Employee";
import Attendance from "../pages/Attendance/Attendance";
import Leave from "../pages/Leave/Leave";
import Payroll from "../pages/Payroll/Payroll";
import Reports from "../pages/Reports/Reports";
import Profile from "../pages/Profile/Profile";
import Settings from "../pages/Settings/Settings";
import Login from "../pages/Login/Login";

const AppRoutes = () => {
  return (
    <Routes>

      {/* Login */}

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Dashboard */}

      <Route element={<MainLayout />}>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/employees" element={<Employee />} />

        <Route path="/attendance" element={<Attendance />} />

        <Route path="/leave" element={<Leave />} />

        <Route path="/payroll" element={<Payroll />} />

        <Route path="/reports" element={<Reports />} />

        <Route path="/profile" element={<Profile />} />

        <Route path="/settings" element={<Settings />} />

      </Route>

    </Routes>
  );
};

export default AppRoutes;