import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { token, user } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (
    allowedRoles &&
    (!user || !allowedRoles.includes(user.role))
  ) {
    if (user?.role === "recruiter") {
      return <Navigate to="/recruiter-dashboard" replace />;
    }

    return <Navigate to="/candidate-dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;

