import "../../styles/reports.css";

import {
  FaChartLine,
  FaUsers,
  FaMoneyBillWave,
  FaCalendarCheck,
  FaDownload,
} from "react-icons/fa";

const Reports = () => {
  return (
    <div className="reports-page">

      <div className="reports-header">

        <div>
          <h2>Reports & Analytics</h2>
          <p>Monitor HR performance and business insights</p>
        </div>

        <button className="download-report-btn">
          <FaDownload />
          Export Report
        </button>

      </div>

      <div className="report-cards">

        <div className="report-card">
          <FaUsers className="report-icon blue" />
          <h3>245</h3>
          <p>Total Employees</p>
        </div>

        <div className="report-card">
          <FaCalendarCheck className="report-icon green" />
          <h3>93%</h3>
          <p>Attendance Rate</p>
        </div>

        <div className="report-card">
          <FaMoneyBillWave className="report-icon orange" />
          <h3>$128K</h3>
          <p>Monthly Payroll</p>
        </div>

        <div className="report-card">
          <FaChartLine className="report-icon purple" />
          <h3>18%</h3>
          <p>Performance Growth</p>
        </div>

      </div>

      <div className="analytics-section">

        <div className="analytics-card">

          <h3>Monthly Analytics</h3>

          <div className="chart-placeholder">
            📈 Analytics Chart (Recharts will be added later)
          </div>

        </div>

        <div className="analytics-card">

          <h3>Recent Reports</h3>

          <ul className="report-list">

            <li>Employee Performance Report</li>

            <li>Attendance Summary</li>

            <li>Payroll Report</li>

            <li>Department Analysis</li>

            <li>Leave Statistics</li>

          </ul>

        </div>

      </div>

    </div>
  );
};

export default Reports;