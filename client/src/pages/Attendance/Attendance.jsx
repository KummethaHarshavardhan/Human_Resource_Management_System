import "../../styles/attendance.css";

import {
  FaSignInAlt,
  FaSignOutAlt,
  FaCalendarCheck,
} from "react-icons/fa";

const attendance = [
  {
    id: 1,
    name: "John Smith",
    checkIn: "09:05 AM",
    checkOut: "06:10 PM",
    status: "Present",
  },
  {
    id: 2,
    name: "Emma Watson",
    checkIn: "09:20 AM",
    checkOut: "06:00 PM",
    status: "Present",
  },
  {
    id: 3,
    name: "Alex Johnson",
    checkIn: "--",
    checkOut: "--",
    status: "Absent",
  },
];

const Attendance = () => {
  return (
    <div className="attendance-page">

      <div className="attendance-header">
        <div>
          <h2>Attendance</h2>
          <p>Daily attendance overview</p>
        </div>
      </div>

      <div className="attendance-cards">

        <div className="attendance-card">
          <FaCalendarCheck className="card-icon blue" />
          <h3>245</h3>
          <p>Total Employees</p>
        </div>

        <div className="attendance-card">
          <FaSignInAlt className="card-icon green" />
          <h3>228</h3>
          <p>Present Today</p>
        </div>

        <div className="attendance-card">
          <FaSignOutAlt className="card-icon red" />
          <h3>17</h3>
          <p>Absent</p>
        </div>

      </div>

      <table className="attendance-table">

        <thead>
          <tr>
            <th>Name</th>
            <th>Check In</th>
            <th>Check Out</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>

          {attendance.map((item) => (

            <tr key={item.id}>

              <td>{item.name}</td>

              <td>{item.checkIn}</td>

              <td>{item.checkOut}</td>

              <td>

                <span
                  className={
                    item.status === "Present"
                      ? "present"
                      : "absent"
                  }
                >
                  {item.status}
                </span>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
};

export default Attendance;