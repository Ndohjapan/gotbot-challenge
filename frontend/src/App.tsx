import { Route, Routes, BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useLayoutEffect } from "react";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { authActions } from "./redux/slices/authSlice";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import CreateProfile from "./pages/CreateProfile";
import DashboardHome from "./pages/Dashboard/Home";
import PrivateRoute from "./components/PrivateRoute";
import SidebarLayout from "./components/Layouts/SidebarLayout";
import NotPrivateRoute from "./components/NonPrivateRoute";
import Category from "./pages/Dashboard/Category";
import Foods from "./pages/Dashboard/Foods";
import RestaurantHome from "./pages/Restaurant/Home";
import Verify from "./pages/Verify";
import NotFound from "./pages/NotFound";
import AuthorizedRoute from "./components/AuthorizedRoute";
import Success from "./pages/Success";
import Profile from "./pages/Dashboard/Profile";
import EditBusinessDetails from "./pages/Dashboard/EditBusinessDetails";
import EditContactDetails from "./pages/Dashboard/EditUserDetails";
import EditSocials from "./pages/Dashboard/EditSocials";

function App() {
  const dispatch = useAppDispatch();
  const { profileComplete } = useAppSelector((state) => state.auth);

  useLayoutEffect(() => {
    if (localStorage.getItem("authToken") && profileComplete) {
      dispatch(authActions.authenticateUser());
    } else {
      dispatch(authActions.logout());
    }
  }, [dispatch, profileComplete]);

  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="" element={<Home />} />
          <Route path="/restaurants" element={<RestaurantHome />} />

          <Route element={<NotPrivateRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register/success" element={<Success />} />
            <Route path="/verify/:token" element={<Verify />} />
          </Route>

          <Route element={<AuthorizedRoute />}>
            <Route path="/create-profile" element={<CreateProfile />} />
          </Route>

          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<SidebarLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="categories">
                <Route index element={<Category />} />
                <Route path=":categoryId" element={<Foods />} />
              </Route>
              <Route path="profile">
                <Route index element={<Profile />} />
                <Route path="edit/business-details" element={<EditBusinessDetails />} />
                <Route path="edit/user-details" element={<EditContactDetails />} />
                <Route path="edit/socials" element={<EditSocials />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
