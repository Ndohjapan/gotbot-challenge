import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";

const PrivateRoute = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
