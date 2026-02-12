import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isLogin = JSON.parse(localStorage.getItem("KeepLogin"));

  if (!isLogin) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
