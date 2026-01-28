import { Navigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAdminAuth();
  const location = useLocation();

  // wait until auth state is known
  if (loading) return null;

  if (!isAuthenticated) {
    return (
      <Navigate to="/admin-login" replace state={{ from: location.pathname }} />
    );
  }

  return children;
};

export default PrivateRoute;
