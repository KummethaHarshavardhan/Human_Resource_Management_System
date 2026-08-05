import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { canAccessFeature } from "../../utils/permission.js";
import "./Sidebar.css";

const menuItems = [
  { label: "Dashboard", to: "/dashboard", feature: "dashboard" },
  { label: "Profile", to: "/profile", feature: "profile" },
  { label: "Directory", to: "/employee", feature: "employee" },
  { label: "Attendance", to: "/attendance-dashboard", feature: "attendance" },
  { label: "Leave Management", to: "/leave", feature: "leave" },
  { label: "Payroll", to: "/payroll", feature: "payroll" },
  { label: "Reports", to: "/reports", feature: "reports" },
  { label: "Settings", to: "/settings", feature: "settings" },
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
            {user.name?.charAt(0) || ""}
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
          <div
            style={{
              padding: "12px 16px",
              color: "#6b7280",
              fontSize: "14px",
            }}
          >
            No menu items available for this role.
          </div>
        ) : (

          visibleItems.map((item) => (

            <NavLink
              key={item.to}
              to={item.to}
              className={({isActive}) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <span>{item.label}</span>
            </NavLink>

          ))

        )}

      </nav>

    </aside>
  );
}