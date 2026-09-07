import { useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import { useAuth } from "./context/AuthContext";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import ProtectedRoute from "./utils/ProtectedRoute";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import VerifyOTP from "./pages/VerifyOTP/VerifyOTP";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import ChangePassword from "./pages/ChangePassword/ChangePassword";
import ReviewQueuePage from "./pages/TaskMonitoring/Reviews/ReviewQueuePage";

/* ================= SUPER ADMIN ================= */

import SuperAdminDashboard from "./pages/SuperAdmin/SuperAdminDashboard";
import Organizations from "./pages/SuperAdmin/Organizations";
import HRManagement from "./pages/SuperAdmin/HRManagement";
import OrganizationUsage from "./pages/SuperAdmin/OrganizationUsage";

/* ================= EXISTING PAGES ================= */

import Dashboard from "./pages/Dashboard/Dashboard";
import Profile from "./pages/Profile/Profile";

import AttendanceDashboard from "./pages/Attendance/AttendanceDashboard";

import PayrollRoutes from "./routes/PayrollRoutes";
import ReportsRoutes from "./routes/ReportsRoutes";
import Settings from "./pages/Settings/Settings";
import Users from "./pages/Users/Users";

import EmployeeList from "./pages/Employee/EmployeeList";
import AddEmployee from "./pages/Employee/AddEmployee";
import EditEmployee from "./pages/Employee/EditEmployee";
import EmployeeDetails from "./pages/Employee/EmployeeDetails";
import EmployeeProfile from "./pages/Employee/EmployeeProfile";

import DepartmentList from "./pages/Employee/departments/DepartmentList";
import AddDepartment from "./pages/Employee/departments/AddDepartment";
import EditDepartment from "./pages/Employee/departments/EditDepartment";

import RoleList from "./pages/Employee/roles/RoleList";
import AddRole from "./pages/Employee/roles/AddRole";
import EditRole from "./pages/Employee/roles/EditRole";

import LeaveDashboard from "./pages/Leave/LeaveDashboard";

/* ================= TASK MONITORING ================= */

import CandidateListPage from "./pages/TaskMonitoring/Candidates/CandidateListPage";
import CandidateDetailsPage from "./pages/TaskMonitoring/Candidates/CandidateDetailsPage";
import TaskListPage from "./pages/TaskMonitoring/Tasks/TaskListPage";
import CreateTaskPage from "./pages/TaskMonitoring/Tasks/CreateTaskPage";
import TaskDetailsPage from "./pages/TaskMonitoring/Tasks/TaskDetailsPage";
import SubmissionListPage from "./pages/TaskMonitoring/Submissions/SubmissionListPage";


function ProtectedLayout() {
  const { isAuthenticated } = useAuth();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleToggleSidebar = () => {
    if (window.innerWidth <= 1024) {
      setIsMobileOpen((prev) => !prev);
    } else {
      setIsSidebarCollapsed((prev) => !prev);
    }
  };

  return (
    <div
      className={`app-layout ${
        isSidebarCollapsed ? "sidebar-collapsed" : ""
      }`}
    >
      {isMobileOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <Sidebar
        isCollapsed={isSidebarCollapsed}
        isMobileOpen={isMobileOpen}
        onToggleSidebar={handleToggleSidebar}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      <div className="app-main-wrapper">
        <Header onToggleSidebar={handleToggleSidebar} />

        <main className="app-main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}


function AppRoutes() {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  const isSuperAdmin = user?.role === "super_admin";

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

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route path="/verify-otp" element={<VerifyOTP />} />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />
      </Routes>
    );
  }

  return (
    <Routes>

      {/* ================= LOGIN ================= */}

      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate
              to={
                isSuperAdmin
                  ? "/super-admin/dashboard"
                  : "/dashboard"
              }
              replace
            />
          ) : (
            <Login />
          )
        }
      />

      {/* ================= REGISTER ================= */}

      <Route
        path="/register"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Register />
          )
        }
      />

      {/* ================= PASSWORD ROUTES ================= */}

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/verify-otp"
        element={<VerifyOTP />}
      />

      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />


      {/* ================= PROTECTED LAYOUT ================= */}

      <Route
        element={
          <ProtectedRoute>
            <ProtectedLayout />
          </ProtectedRoute>
        }
      >

        {/* ================= DEFAULT ROUTE ================= */}

        <Route
          path="/"
          element={
            <Navigate
              to={
                isSuperAdmin
                  ? "/super-admin/dashboard"
                  : "/dashboard"
              }
              replace
            />
          }
        />


        {/* ================================================= */}
        {/* SUPER ADMIN ROUTES */}
        {/* ================================================= */}

        {/* 1. Super Admin Dashboard */}

        <Route
          path="/super-admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["super_admin"]}>
              <SuperAdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* 2. Organizations */}

        <Route
          path="/super-admin/organizations"
          element={
            <ProtectedRoute allowedRoles={["super_admin"]}>
              <Organizations />
            </ProtectedRoute>
          }
        />

        {/* 3. HR Management */}

        <Route
          path="/super-admin/hr-management"
          element={
            <ProtectedRoute allowedRoles={["super_admin"]}>
              <HRManagement />
            </ProtectedRoute>
          }
        />

        {/* 4. Organization Usage */}

        <Route
          path="/super-admin/usage-limits"
          element={
            <ProtectedRoute allowedRoles={["super_admin"]}>
              <OrganizationUsage />
            </ProtectedRoute>
          }
        />


        {/* ================================================= */}
        {/* DASHBOARD */}
        {/* ================================================= */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              allowedRoles={[
                "Admin",
                "HR Manager",
                "Employee",
              ]}
            >
              <Dashboard />
            </ProtectedRoute>
          }
        />


        {/* ================================================= */}
        {/* PROFILE */}
        {/* ================================================= */}

        <Route
          path="/profile"
          element={
            <ProtectedRoute
              allowedRoles={[
                "Admin",
                "HR Manager",
                "Employee",
              ]}
            >
              <Profile />
            </ProtectedRoute>
          }
        />


        {/* ================================================= */}
        {/* EMPLOYEE DIRECTORY */}
        {/* ================================================= */}

        <Route
          path="/directory"
          element={
            <ProtectedRoute
              allowedRoles={["Admin", "HR Manager"]}
            >
              <EmployeeList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee"
          element={
            <ProtectedRoute
              allowedRoles={["Admin", "HR Manager"]}
            >
              <EmployeeList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee/add"
          element={
            <ProtectedRoute
              allowedRoles={["Admin", "HR Manager"]}
            >
              <AddEmployee />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee/profile"
          element={
            <ProtectedRoute
              allowedRoles={[
                "Admin",
                "HR Manager",
                "Employee",
              ]}
            >
              <EmployeeProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee/:id"
          element={
            <ProtectedRoute
              allowedRoles={["Admin", "HR Manager"]}
            >
              <EmployeeDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee/:id/edit"
          element={
            <ProtectedRoute
              allowedRoles={["Admin", "HR Manager"]}
            >
              <EditEmployee />
            </ProtectedRoute>
          }
        />


        {/* ================================================= */}
        {/* DEPARTMENTS */}
        {/* ================================================= */}

        <Route
          path="/employee/departments"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <DepartmentList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee/departments/add"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AddDepartment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee/departments/edit/:id"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <EditDepartment />
            </ProtectedRoute>
          }
        />


        {/* ================================================= */}
        {/* ROLES */}
        {/* ================================================= */}

        <Route
          path="/employee/roles"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <RoleList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee/roles/add"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AddRole />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee/roles/edit/:id"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <EditRole />
            </ProtectedRoute>
          }
        />


        {/* ================================================= */}
        {/* ATTENDANCE */}
        {/* ================================================= */}

        <Route
          path="/attendance-dashboard"
          element={
            <ProtectedRoute
              allowedRoles={[
                "Admin",
                "HR Manager",
                "Employee",
              ]}
            >
              <AttendanceDashboard />
            </ProtectedRoute>
          }
        />


        {/* ================================================= */}
        {/* LEAVE */}
        {/* ================================================= */}

        <Route
          path="/leave"
          element={
            <ProtectedRoute
              allowedRoles={[
                "Admin",
                "HR Manager",
                "Employee",
              ]}
            >
              <LeaveDashboard />
            </ProtectedRoute>
          }
        />


        {/* ================================================= */}
        {/* PAYROLL */}
        {/* ================================================= */}

        <Route
          path="/payroll/*"
          element={
            <ProtectedRoute
              allowedRoles={[
                "Admin",
                "HR Manager",
              ]}
            >
              <PayrollRoutes />
            </ProtectedRoute>
          }
        />


        {/* ================================================= */}
        {/* REPORTS */}
        {/* ================================================= */}

        <Route
          path="/reports/*"
          element={
            <ProtectedRoute
              allowedRoles={[
                "Admin",
                "HR Manager",
              ]}
            >
              <ReportsRoutes />
            </ProtectedRoute>
          }
        />


        {/* ================================================= */}
        {/* SETTINGS */}
        {/* ================================================= */}

        <Route
          path="/settings"
          element={
            <ProtectedRoute
              allowedRoles={[
                "Admin",
                "HR Manager",
                "Employee",
              ]}
            >
              <Settings />
            </ProtectedRoute>
          }
        />


        {/* ================================================= */}
        {/* USERS */}
        {/* ================================================= */}

        <Route
          path="/users"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <Users />
            </ProtectedRoute>
          }
        />


        {/* ================================================= */}
        {/* CHANGE PASSWORD */}
        {/* ================================================= */}

        <Route
          path="/change-password"
          element={
            <ProtectedRoute
              allowedRoles={[
                "Admin",
                "HR Manager",
                "Employee",
              ]}
            >
              <ChangePassword />
            </ProtectedRoute>
          }
        />


        {/* ================================================= */}
        {/* TASK MONITORING - CANDIDATES */}
        {/* ================================================= */}

        <Route
          path="/hr/candidates"
          element={
            <ProtectedRoute
              allowedRoles={["HR Manager", "Admin"]}
            >
              <CandidateListPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/hr/candidates/:id"
          element={
            <ProtectedRoute
              allowedRoles={["HR Manager", "Admin"]}
            >
              <CandidateDetailsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/candidates"
          element={
            <Navigate to="/hr/candidates" replace />
          }
        />


        {/* ================================================= */}
        {/* TASK MONITORING - TASKS */}
        {/* ================================================= */}

        <Route
          path="/hr/tasks"
          element={
            <ProtectedRoute
              allowedRoles={["HR Manager", "Admin"]}
            >
              <TaskListPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/hr/tasks/create"
          element={
            <ProtectedRoute
              allowedRoles={["HR Manager", "Admin"]}
            >
              <CreateTaskPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/hr/tasks/:id"
          element={
            <ProtectedRoute
              allowedRoles={["HR Manager", "Admin"]}
            >
              <TaskDetailsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/hr/task-allocation"
          element={
            <Navigate to="/hr/tasks" replace />
          }
        />

      </Route>

        <Route
          path="/hr/submissions"
          element={
            <ProtectedRoute allowedRoles={["Admin", "HR Manager", "HR"]}>
              <SubmissionListPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/hr/reviews"
          element={
            <ProtectedRoute allowedRoles={["Admin", "HR Manager", "HR"]}>
              <ReviewQueuePage />
            </ProtectedRoute>
          }
        />


      {/* ================================================= */}
      {/* FALLBACK */}
      {/* ================================================= */}

      <Route
        path="*"
        element={
          <Navigate
            to={
              isAuthenticated
                ? isSuperAdmin
                  ? "/super-admin/dashboard"
                  : "/dashboard"
                : "/login"
            }
            replace
          />
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
