import { FaBars, FaBell, FaUserCircle } from "react-icons/fa";
import "./Navbar.css";

const Navbar = ({ toggleSidebar }) => {
  return (
    <header className="navbar">

      <div className="navbar-left">

        <button className="menu-btn" onClick={toggleSidebar}>
          <FaBars />
        </button>

        <h2>HRMS Dashboard</h2>

      </div>

      <div className="navbar-right">

        <button className="icon-btn">
          <FaBell />
        </button>

        <div className="profile">

          <FaUserCircle className="profile-icon" />

          <div>
            <h4>Admin</h4>
            <p>Administrator</p>
          </div>

        </div>

      </div>

    </header>
  );
};

export default Navbar;