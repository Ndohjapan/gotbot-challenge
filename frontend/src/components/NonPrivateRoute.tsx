import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";

const NotPrivateRoute = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? <Navigate to="/dashboard" /> : <Outlet />;
};

export default NotPrivateRoute;
