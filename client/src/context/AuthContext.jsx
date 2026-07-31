import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);
const STORAGE_KEY = "hrms-auth";

const DEFAULT_USER = {
  name: "Vamsi",
  role: "admin",
  email: "vamsi@company.com",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        return data.user || DEFAULT_USER;
      }
    } catch (e) {
      /* ignore */
    }
    return DEFAULT_USER;
  });

  const [token, setToken] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        return data.token || "dev-token";
      }
    } catch (e) {
      /* ignore */
    }
    return "dev-token";
  });

  const [loading, setLoading] = useState(false);

  const persistAuth = (nextUser, nextToken) => {
    setUser(nextUser);
    setToken(nextToken);
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ user: nextUser, token: nextToken })
      );
    } catch (e) {
      /* ignore */
    }
  };

  const login = ({ user: nextUser, token: nextToken }) => {
    persistAuth(nextUser, nextToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      /* ignore */
    }
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(user && token),
      login,
      logout,
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
