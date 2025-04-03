import React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
    children: React.ReactNode;
}

const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    return isAuthenticated() ? <>{children}</> : <Navigate to="/login" />;
};

export default PrivateRoute;
