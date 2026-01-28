import React, { createContext, useContext, useEffect, useState } from "react";

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("adminToken"));

  const isAuthenticated = Boolean(token);

  /* Login */
  const login = (newToken) => {
    localStorage.setItem("adminToken", newToken);
    setToken(newToken);
  };

  /* Logout */
  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("dashboardPage");
    setToken(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        token,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

/* Custom hook */
export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  }
  return ctx;
};
