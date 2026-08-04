import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AttendanceDashboard from "./pages/Attendance/AttendanceDashboard";

import LeaveDashboard from "./pages/Leave/LeaveDashboard";
import ApplyLeave from "./pages/Leave/ApplyLeave";
import LeaveHistory from "./pages/Leave/LeaveHistory";
import LeaveApproval from "./pages/Leave/LeaveApproval";
import LeaveCalendar from "./pages/Leave/LeaveCalendar";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default Route */}
        <Route
          path="/"
          element={<Navigate to="/leave-dashboard" replace />}
        />

        {/* Attendance */}
        <Route
          path="/attendance-dashboard"
          element={<AttendanceDashboard />}
        />

        {/* Leave */}
        <Route
          path="/leave-dashboard"
          element={<LeaveDashboard />}
        />

        <Route
          path="/apply-leave"
          element={<ApplyLeave />}
        />

        <Route
          path="/leave-history"
          element={<LeaveHistory />}
        />

        <Route
          path="/leave-approval"
          element={<LeaveApproval />}
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