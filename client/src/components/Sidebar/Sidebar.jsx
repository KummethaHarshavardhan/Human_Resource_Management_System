import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { canAccessFeature } from "../../utils/permission.js";
import "./Sidebar.css";

const menuItems = [
  { label: "Dashboard", to: "/dashboard", feature: "dashboard", icon: "📊" },
  { label: "Profile", to: "/profile", feature: "profile", icon: "👤" },
  { label: "Directory", to: "/employee", feature: "employee", icon: "👥" },
  { label: "Attendance", to: "/attendance-dashboard", feature: "attendance", icon: "⏰" },
  { label: "Leave Management", to: "/leave", feature: "leave", icon: "📅" },
  { label: "Payroll", to: "/payroll", feature: "payroll", icon: "💳" },
  { label: "Reports", to: "/reports", feature: "reports", icon: "📈" },
  { label: "Settings", to: "/settings", feature: "settings", icon: "⚙️" },
];

export default function Sidebar() {
  const { user } = useAuth();
  const role = user?.role || "";

  const visibleItems = menuItems.filter((item) =>
    canAccessFeature(role, item.feature)
  );

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div>
          <strong>Infinetra</strong>
          <small>HR Portal</small>
        </div>
      </div>

      {user && (
        <div className="sidebar-user-card">
          <div className="sidebar-user-avatar">
            {user.name?.charAt(0).toUpperCase() || "U"}
          </div>

          <div>
            <div className="sidebar-user-name">
              {user.name}
            </div>

            <div className="sidebar-user-role">
              {user.role}
            </div>
          </div>
        </div>
      )}

      <nav className="sidebar-nav">
        {visibleItems.length === 0 ? (
          <div className="sidebar-no-items">
            No menu items available for this role.
          </div>
        ) : (
          visibleItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))
        )}
      </nav>
    </aside>
  );
}