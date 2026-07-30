import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LeaveDashboard from "./pages/leave/LeaveDashboard";
import ApplyLeave from "./pages/leave/ApplyLeave";
import LeaveHistory from "./pages/leave/LeaveHistory";
import LeaveApproval from "./pages/leave/LeaveApproval";
import LeaveCalendar from "./pages/leave/LeaveCalendar";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
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