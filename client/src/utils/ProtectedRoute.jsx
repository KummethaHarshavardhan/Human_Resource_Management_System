import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const normalizedRole = user?.role?.toString().toLowerCase() || "";
  const normalizedAllowed = Array.isArray(allowedRoles)
    ? allowedRoles.map((role) => role.toString().toLowerCase())
    : [];

  if (allowedRoles && normalizedAllowed.length && !normalizedAllowed.includes(normalizedRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
