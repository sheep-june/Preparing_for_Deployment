import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoutes = ({ isAuth }) => {
    const location = useLocation();

    if (!isAuth) {
        sessionStorage.setItem("redirectAfterLogin", location.pathname);
        return <Navigate to="/auth" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoutes;
