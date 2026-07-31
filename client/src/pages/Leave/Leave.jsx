import "../../styles/leave.css";

import {
  FaPlus,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const leaves = [
  {
    id: 1,
    employee: "John Smith",
    type: "Casual Leave",
    from: "10 Aug 2026",
    to: "12 Aug 2026",
    status: "Approved",
  },
  {
    id: 2,
    employee: "Emma Watson",
    type: "Sick Leave",
    from: "14 Aug 2026",
    to: "15 Aug 2026",
    status: "Pending",
  },
  {
    id: 3,
    employee: "Alex Johnson",
    type: "Annual Leave",
    from: "20 Aug 2026",
    to: "25 Aug 2026",
    status: "Rejected",
  },
];

const Leave = () => {
  return (
    <div className="leave-page">

      <div className="leave-header">

        <div>
          <h2>Leave Management</h2>
          <p>Manage employee leave requests</p>
        </div>

        <button className="apply-btn">
          <FaPlus />
          Apply Leave
        </button>

      </div>

      <div className="leave-summary">

        <div className="summary-card">
          <FaCalendarAlt className="summary-icon blue" />
          <h3>28</h3>
          <p>Total Requests</p>
        </div>

        <div className="summary-card">
          <FaCheckCircle className="summary-icon green" />
          <h3>20</h3>
          <p>Approved</p>
        </div>

        <div className="summary-card">
          <FaTimesCircle className="summary-icon red" />
          <h3>8</h3>
          <p>Pending / Rejected</p>
        </div>

      </div>

      <table className="leave-table">

        <thead>
          <tr>
            <th>Employee</th>
            <th>Leave Type</th>
            <th>From</th>
            <th>To</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>

          {leaves.map((leave) => (

            <tr key={leave.id}>

              <td>{leave.employee}</td>

              <td>{leave.type}</td>

              <td>{leave.from}</td>

              <td>{leave.to}</td>

              <td>

                <span className={leave.status.toLowerCase()}>
                  {leave.status}
                </span>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
};

export default Leave;