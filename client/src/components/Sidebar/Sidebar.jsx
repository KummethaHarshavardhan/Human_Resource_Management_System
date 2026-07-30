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

import { NavLink } from "react-router-dom";

import "./Sidebar.css";

const Sidebar = ({ isOpen }) => {
  return (
    <aside className={`sidebar ${isOpen ? "show" : ""}`}>
      <div className="sidebar-logo">
        <h2>HRMS</h2>
      </div>

      <ul className="sidebar-menu">

        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FaTachometerAlt />
            <span>Dashboard</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/employees"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FaUsers />
            <span>Employees</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/attendance"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FaCalendarCheck />
            <span>Attendance</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/leave"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FaCalendarAlt />
            <span>Leave</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/payroll"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FaMoneyCheckAlt />
            <span>Payroll</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/reports"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FaChartBar />
            <span>Reports</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/profile"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FaUserCircle />
            <span>Profile</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/settings"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FaCog />
            <span>Settings</span>
          </NavLink>
        </li>

      </ul>
    </aside>
  );
};

export default Sidebar;