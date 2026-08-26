import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { canAccessFeature, normalizeRole } from "../../utils/permission.js";
import {
  FiGrid,
  FiUser,
  FiUsers,
  FiClock,
  FiCalendar,
  FiDollarSign,
  FiBarChart2,
  FiShield,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

import "./Sidebar.css";

const menuItems = [
  { label: "Dashboard", to: "/dashboard", feature: "dashboard", icon: <FiGrid size={18} /> },
  { label: "Profile", to: "/profile", feature: "profile", icon: <FiUser size={18} /> },
  { label: "Directory", to: "/directory", feature: "employee", icon: <FiUsers size={18} /> },
  { label: "Attendance", to: "/attendance-dashboard", feature: "attendance", icon: <FiClock size={18} /> },
  { label: "Leave Management", to: "/leave", feature: "leave", icon: <FiCalendar size={18} /> },
  { label: "Payroll", to: "/payroll", feature: "payroll", icon: <FiDollarSign size={18} /> },
  { label: "Reports", to: "/reports", feature: "reports", icon: <FiBarChart2 size={18} /> },
  { label: "Users", to: "/users", feature: "users", icon: <FiShield size={18} /> },
  { label: "Settings", to: "/settings", feature: "settings", icon: <FiSettings size={18} /> },
];

export default function Sidebar({
  isCollapsed = true,
  isMobileOpen = false,
  onToggleSidebar,
  onCloseMobile,
}) {
  const { user, logout } = useAuth();
  const role = user?.role || "";

  const displayRole = (() => {
    const norm = normalizeRole(role);
    if (norm === "admin") return "Admin";
    if (norm === "hr_manager") return "HR Manager";
    if (norm === "employee") return "Employee";
    return role;
  })();

  const visibleItems = menuItems.filter((item) =>
    canAccessFeature(role, item.feature)
  );

  const handleLinkClick = () => {
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const sidebarClasses = [
    "sidebar",
    isCollapsed ? "collapsed" : "",
    isMobileOpen ? "mobile-open" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <aside className={sidebarClasses}>
      <div className="sidebar-top">
        {user && (
          <div className="sidebar-user-card" title={`${user.name} (${displayRole})`}>
            <div className="sidebar-user-avatar">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </div>

            {!isCollapsed && (
              <div className="sidebar-user-details">
                <div className="sidebar-user-name">{user.name}</div>
                <div className="sidebar-user-role">{displayRole}</div>
              </div>
            )}
          </div>
        )}

        <nav className="sidebar-nav" aria-label="Main Navigation">
          {visibleItems.length === 0 ? (
            <div className="sidebar-no-items">
              {!isCollapsed && "No menu items available."}
            </div>
          ) : (
            visibleItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={handleLinkClick}
                title={isCollapsed ? item.label : undefined}
                aria-label={item.label}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
              >
                <span className="sidebar-icon">{item.icon}</span>
                {!isCollapsed && <span className="sidebar-label">{item.label}</span>}
              </NavLink>
            ))
          )}
        </nav>
      </div>

      <div className="sidebar-footer">
        <button
          type="button"
          onClick={logout}
          className="sidebar-logout-btn"
          title="Logout"
          aria-label="Logout"
        >
          <span className="sidebar-icon">
            <FiLogOut size={18} />
          </span>
          {!isCollapsed && <span className="sidebar-label">Logout</span>}
        </button>
      </div>
    </aside>
  );
}