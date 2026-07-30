import {
  FaTachometerAlt,
  FaUsers,
  FaCalendarCheck,
  FaCalendarAlt,
  FaMoneyCheckAlt,
  FaChartBar,
  FaUserCircle,
  FaCog,
} from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = ({ isOpen }) => {
  return (
    <aside className={`sidebar ${isOpen ? "show" : ""}`}>

      <div className="sidebar-logo">
        <h2>HRMS</h2>
      </div>

      <ul className="sidebar-menu">

        <li className="active">
          <FaTachometerAlt />
          <span>Dashboard</span>
        </li>

        <li>
          <FaUsers />
          <span>Employees</span>
        </li>

        <li>
          <FaCalendarCheck />
          <span>Attendance</span>
        </li>

        <li>
          <FaCalendarAlt />
          <span>Leave</span>
        </li>

        <li>
          <FaMoneyCheckAlt />
          <span>Payroll</span>
        </li>

        <li>
          <FaChartBar />
          <span>Reports</span>
        </li>

        <li>
          <FaUserCircle />
          <span>Profile</span>
        </li>

        <li>
          <FaCog />
          <span>Settings</span>
        </li>

      </ul>

    </aside>
  );
};

export default Sidebar;