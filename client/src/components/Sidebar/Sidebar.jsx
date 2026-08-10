import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { canAccessFeature } from "../../utils/permission.js";
import { FaBars } from "react-icons/fa";
import "./Sidebar.css";

const menuItems = [
  { label: "Dashboard", to: "/dashboard", feature: "dashboard", icon: "🏠" },
  { label: "Profile", to: "/profile", feature: "profile", icon: "👤" },
  { label: "Directory", to: "/employee", feature: "employee", icon: "📁" },
  { label: "Attendance", to: "/attendance-dashboard", feature: "attendance", icon: "⏰" },
  { label: "Leave Management", to: "/leave", feature: "leave", icon: "📅" },
  { label: "Payroll", to: "/payroll", feature: "payroll", icon: "💰" },
  { label: "Reports", to: "/reports", feature: "reports", icon: "📊" },
  { label: "Users", to: "/users", feature: "users", icon: "👥" },
  { label: "Settings", to: "/settings", feature: "settings", icon: "⚙️" },
];

export default function Sidebar({
  isCollapsed = true,
  isMobileOpen = false,
  onToggleSidebar,
  onCloseMobile
}) {
  const { user, logout } = useAuth();
  const role = user?.role || "";

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
        {/* Top Hamburger Button - Clean 3 horizontal lines */}
        <div className="sidebar-hamburger-header">
          <button
            type="button"
            className="sidebar-hamburger-btn"
            onClick={onToggleSidebar}
            aria-label="Toggle Sidebar"
            title="Toggle Sidebar Menu"
          >
            <FaBars size={26} />
          </button>
        </div>

        {user && (
          <div className="sidebar-user-card" title={`${user.name} (${user.role})`}>
            <div className="sidebar-user-avatar">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </div>

            {!isCollapsed && (
              <div className="sidebar-user-details">
                <div className="sidebar-user-name">{user.name}</div>
                <div className="sidebar-user-role">{user.role}</div>
              </div>
            )}
          </div>
        )}

        <nav className="sidebar-nav">
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
          title={isCollapsed ? "Logout" : undefined}
        >
          <span className="sidebar-icon">🚪</span>
          {!isCollapsed && <span className="sidebar-label">Logout</span>}
        </button>
      </div>
    </aside>
  );
}