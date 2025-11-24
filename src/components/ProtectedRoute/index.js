import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const { user } = useSelector((state) => state.global);

    if (!user || user.isAdmin) {
        return <Navigate to="/account/login" replace />;
    }
    return <Outlet />;
};

export default ProtectedRoute;
