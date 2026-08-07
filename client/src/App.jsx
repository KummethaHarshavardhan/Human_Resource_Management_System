import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import ProtectedRoute from "./utils/ProtectedRoute";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import VerifyOTP from "./pages/VerifyOTP/VerifyOTP";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import ChangePassword from "./pages/ChangePassword/ChangePassword";

import Dashboard from "./pages/Dashboard/Dashboard";
import Profile from "./pages/Profile/Profile";

import AttendanceDashboard from "./pages/Attendance/AttendanceDashboard";

import PayrollRoutes from "./routes/PayrollRoutes";
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


import LeaveDashboard from "./pages/Leave/LeaveDashboard";

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
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
        }
      />

      <Route
        path="/register"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />
        }
      />

      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route
        element={
          <ProtectedRoute>
            <ProtectedLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="/employee" element={<EmployeeList />} />

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
        <Route path="/employee/departments/add" element={<AddDepartment />} />
        <Route
          path="/employee/departments/edit/:id"
          element={<EditDepartment />}
        />

        <Route path="/employee/roles" element={<RoleList />} />
        <Route path="/employee/roles/add" element={<AddRole />} />
        <Route path="/employee/roles/edit/:id" element={<EditRole />} />


      <Route
          path="/attendance-dashboard"
          element={
            <ProtectedRoute allowedRoles={["Employee", "HR", "Admin"]}>
              <AttendanceDashboard />
            </ProtectedRoute>
          }
        />
        

        <Route
          path="/leave"
          element={
            <ProtectedRoute allowedRoles={["Employee", "HR", "Admin"]}>
              <LeaveDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/payroll/*" element={<PayrollRoutes />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/change-password" element={<ChangePassword />} />
      </Route>

      <Route
        path="*"
        element={
          <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
