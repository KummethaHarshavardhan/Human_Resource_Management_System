import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const location = useLocation();
  const isDirectory = location.pathname.startsWith("/employee");

  return (
    <header className="navbar">
      <div className="navbar-left">
        <div className="navbar-brand">
          <strong>Infinetra HRMS</strong>
          <small>People & Payroll</small>
        </div>

        <nav className="navbar-links">
          <Link to="/employee" className={isDirectory ? "active" : ""}>Directory</Link>
          <Link to="/dashboard">Benefits</Link>
          <Link to="/dashboard">Policies</Link>
        </nav>
      </div>
    </header>
  );
}
