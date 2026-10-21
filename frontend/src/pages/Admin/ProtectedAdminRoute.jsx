
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAdminAuth } from "../../Context/AdminAuthContext";

const ProtectedAdminRoute = () => {
  const { isAdminLoggedIn, loading } = useAdminAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="admin-auth-loading">
        <p>Verifying admin session...</p>
      </div>
    );
  }

  if (!isAdminLoggedIn) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
};

export default ProtectedAdminRoute;
