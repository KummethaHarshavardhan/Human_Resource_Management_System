import "../../styles/payroll.css";

import {
  FaMoneyCheckAlt,
  FaFileInvoiceDollar,
  FaDownload,
} from "react-icons/fa";

const payrollData = [
  {
    id: 1,
    employee: "John Smith",
    department: "HR",
    salary: "$4,200",
    status: "Paid",
  },
  {
    id: 2,
    employee: "Emma Watson",
    department: "IT",
    salary: "$5,100",
    status: "Paid",
  },
  {
    id: 3,
    employee: "Alex Johnson",
    department: "Finance",
    salary: "$4,800",
    status: "Pending",
  },
];

const Payroll = () => {
  return (
    <div className="payroll-page">

      <div className="payroll-header">

        <div>
          <h2>Payroll Management</h2>
          <p>Salary and Payslip Management</p>
        </div>

        <button className="generate-btn">
          <FaFileInvoiceDollar />
          Generate Payroll
        </button>

      </div>

      <div className="payroll-summary">

        <div className="summary-card">
          <FaMoneyCheckAlt className="summary-icon blue"/>
          <h3>$128,000</h3>
          <p>Total Payroll</p>
        </div>

        <div className="summary-card">
          <FaFileInvoiceDollar className="summary-icon green"/>
          <h3>245</h3>
          <p>Payslips Generated</p>
        </div>

      </div>

      <table className="payroll-table">

        <thead>

          <tr>

            <th>Employee</th>
            <th>Department</th>
            <th>Salary</th>
            <th>Status</th>
            <th>Payslip</th>

          </tr>

        </thead>

        <tbody>

          {payrollData.map((item)=>(
            <tr key={item.id}>

              <td>{item.employee}</td>

              <td>{item.department}</td>

              <td>{item.salary}</td>

              <td>

                <span
                  className={
                    item.status==="Paid"
                    ? "paid"
                    : "pending"
                  }
                >
                  {item.status}
                </span>

              </td>

              <td>

                <button className="download-btn">

                  <FaDownload />

                </button>

              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
};

export default Payroll;