import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

import { ThemeProvider } from "./context/ThemeContext";

import "./styles/variables.css";
import "./styles/global.css";
import "./styles/theme.css";
import "./styles/layout.css";
import "./styles/components.css";
import "./styles/animations.css";
import "./styles/utilities.css";
import "./styles/navbar.css";
import "./styles/sidebar.css";
import "./styles/dashboard.css";
import "./styles/employee.css";
import "./styles/attendance.css";
import "./styles/leave.css";
import "./styles/payroll.css";
import "./styles/reports.css";
import "./styles/profile.css";
import "./styles/settings.css";
import "./styles/responsive.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);