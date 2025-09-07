
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface RequireAuthProps {
    children: JSX.Element;
    allowedRoles?: string[];
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ children, allowedRoles }) => {
    const { token, user } = useAuthStore();
    const location = useLocation();

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    
    if (allowedRoles && user && !allowedRoles.includes(user.userType)) {
      return <Navigate to="/unauthorized" replace />;
    }

    return children;
};
