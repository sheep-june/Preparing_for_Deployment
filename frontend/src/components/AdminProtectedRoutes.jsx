import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminProtectedRoutes = () => {
    const token = localStorage.getItem("adminToken");
    return token ? <Outlet /> : <Navigate to="/admin/login" />;
};

export default AdminProtectedRoutes;
