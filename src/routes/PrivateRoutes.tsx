import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoutes = () => {
  const isAuthenticated = useSelector((state: any) => state.userReducer.user);

  return isAuthenticated.user !== null ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
