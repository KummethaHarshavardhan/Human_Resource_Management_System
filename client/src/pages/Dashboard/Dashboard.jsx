import DashboardCards from "./DashboardCards";
import "../../styles/dashboard.css";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
} from "recharts";

const data = [
  { month: "Jan", employees: 45 },
  { month: "Feb", employees: 60 },
  { month: "Mar", employees: 70 },
  { month: "Apr", employees: 82 },
  { month: "May", employees: 90 },
  { month: "Jun", employees: 95 },
];

const Dashboard = () => {
  return (
    <div className="dashboard">

      <div className="dashboard-top">

        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, Admin 👋</p>
        </div>

      </div>

      <DashboardCards />

      <div className="dashboard-grid">

        <div className="chart-card">

          <h3>Employee Growth</h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <XAxis dataKey="month" />
              <Tooltip />
              <Bar dataKey="employees" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>

        </div>

        <div className="activity-card">

          <h3>Recent Activity</h3>

          <ul>

            <li>✔ John checked in</li>

            <li>✔ Emma applied for leave</li>

            <li>✔ Payroll generated</li>

            <li>✔ New employee added</li>

          </ul>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;