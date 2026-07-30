import DashboardCards from "./DashboardCards";
import "../../styles/Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard-container">

      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome to the Human Resource Management System</p>
      </div>

      <DashboardCards />

      <div className="dashboard-content">

        <div className="dashboard-section">
          <h2>Employee Overview</h2>

          <div className="chart-placeholder">
            Chart will be integrated later
          </div>

        </div>

        <div className="dashboard-section">
          <h2>Recent Activities</h2>

          <ul>
            <li>Employee added successfully.</li>
            <li>Attendance updated.</li>
            <li>Payroll generated.</li>
            <li>Leave request approved.</li>
          </ul>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;