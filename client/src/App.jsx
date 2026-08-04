import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AttendanceDashboard from "./pages/Attendance/AttendanceDashboard";

import Dashboard from "./pages/Dashboard/Dashboard";
import Profile from "./pages/Profile/Profile";

import Attendance from "./pages/Attendance/Attendance";
import Leave from "./pages/Leave/Leave";
import Payroll from "./pages/Payroll/Payroll";
import Reports from "./pages/Reports/Reports";
import Settings from "./pages/Settings/Settings";

import EmployeeList from "./pages/employee/EmployeeList";
import AddEmployee from "./pages/employee/AddEmployee";
import EditEmployee from "./pages/employee/EditEmployee";
import EmployeeDetails from "./pages/employee/EmployeeDetails";
import EmployeeProfile from "./pages/employee/EmployeeProfile";

import DepartmentList from "./pages/Employee/departments/DepartmentList";
import AddDepartment from "./pages/Employee/departments/AddDepartment";
import EditDepartment from "./pages/Employee/departments/EditDepartment";

import RoleList from "./pages/Employee/roles/RoleList";
import AddRole from "./pages/Employee/roles/AddRole";
import EditRole from "./pages/Employee/roles/EditRole";

function ProtectedLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f6f7fb" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />
        <main style={{ flex: 1, padding: "24px" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const publicPaths = [
    "/login",
    "/register",
    "/forgot-password",
    "/verify-otp",
    "/reset-password",
  ];

  if (!isAuthenticated && publicPaths.includes(location.pathname)) {
    return (
      <Routes>

        <Route
          path="/attendance-dashboard"
          element={<AttendanceDashboard />}
        />

        <Route
          path="/leave-dashboard"
          element={<LeaveDashboard />}
        />

        <Route
          path="/employee/add"
          element={
            <ProtectedRoute allowedRoles={["Admin", "HR"]}>
              <AddEmployee />
            </ProtectedRoute>
          }
        />

        <Route path="/employee/profile" element={<EmployeeProfile />} />
        <Route path="/employee/:id" element={<EmployeeDetails />} />

        <Route
          path="/employee/:id/edit"
          element={
            <ProtectedRoute allowedRoles={["Admin", "HR"]}>
              <EditEmployee />
            </ProtectedRoute>
          }
        />

        <Route path="/employee/departments" element={<DepartmentList />} />
        <Route
          path="/employee/departments/add"
          element={<AddDepartment />}
        />
        <Route
          path="/leave-calendar"
          element={<LeaveCalendar />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;