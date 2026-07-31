import {
  FaBars,
  FaBell,
  FaSearch,
  FaUserCircle
} from "react-icons/fa";

import "../../styles/navbar.css";

const Navbar = ({ toggleSidebar }) => {
  return (
    <header className="navbar">

      <div className="navbar-left">

        <button className="menu-btn" onClick={toggleSidebar}>
          <FaBars />
        </button>

        <div className="search-box">

          <FaSearch className="search-icon"/>

          <input
            type="text"
            placeholder="Search..."
          />

        </div>

      </div>

      <div className="navbar-right">

        <div className="notification">

          <FaBell />

          <span className="badge">3</span>

        </div>

        <div className="profile">

          <FaUserCircle className="profile-icon"/>

          <div>

            <h4>Admin</h4>

            <small>Administrator</small>

          </div>

        </div>

      </div>

    </header>
  );
};

export default Navbar;