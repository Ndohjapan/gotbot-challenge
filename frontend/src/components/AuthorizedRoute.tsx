import { Outlet, Navigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";

export default function AuthorizedRoute() {
  const { profileComplete } = useAppSelector((state) => state.auth);

  /**
   * From the login flow, a sucessful sign-in stores the authToken to localStorage.
   * (authenticatedSlice)
   *
   * if there's no authToken, it means the user hasn't attempted sign in then.
   */
  const isAuthenticated = localStorage.getItem("authToken");

  if (isAuthenticated) {
    if (profileComplete) return <Navigate to="/dashboard" />;
    return <Outlet />;
  }

  return <Navigate to="/login" />;
}
