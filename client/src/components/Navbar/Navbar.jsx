import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";
import "./Navbar.css";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const isDirectory = location.pathname.startsWith("/employee");

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button
          type="button"
          className="navbar-hamburger-btn"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open navigation menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>

        <div className="navbar-brand">
          <strong>Infinetra HRMS</strong>
        </div>

        <nav className={`navbar-links ${mobileMenuOpen ? "mobile-open" : ""}`}>
          <Link
            to="/employee"
            className={isDirectory ? "active" : ""}
            onClick={() => setMobileMenuOpen(false)}
          >
            Directory
          </Link>
          <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
            Benefits
          </Link>
          <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
            Policies
          </Link>
        </nav>
      </div>

      {user && (
        <div className="navbar-right">
          <div className="navbar-user">
            <div className="navbar-avatar">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="navbar-user-info">
              <span className="navbar-user-name">{user.name}</span>
              <span className="navbar-user-role">{user.role}</span>
            </div>
          </div>
          <button 
            onClick={logout} 
            className="navbar-button" 
            title="Logout"
            aria-label="Logout"
            type="button"
          >
            <FiLogOut size={16} />
          </button>
        </div>
      )}
    </header>
  );
}