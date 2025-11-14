import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * Component to protect routes. Renders child routes (Outlet) if the user is authenticated.
 * If not, redirects to the login page.
 * * Note: Role checking is performed inside AdminRoute or by checking user.role directly.
 */
const PrivateRoute = ({ allowedRoles }) => {
    const { isAuthenticated, user, status } = useSelector(state => state.auth);

    // 1. Loading State Check (Wait for token check/re-hydration)
    if (status === 'loading') {
        // You would typically render a Spinner component here
        return <div>Loading user session...</div>; 
    }

    // 2. Authentication Check
    if (!isAuthenticated) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" replace />;
    }

    // 3. Authorization Check (Check if the user role is in the allowedRoles array)
    if (user && allowedRoles.includes(user.role)) {
        // User is authenticated and has the correct role. Proceed to child route.
        return <Outlet />;
    }
    
    // 4. Fallback for unauthorized but logged-in user
    // e.g., A customer trying to access an Admin route without being explicitly denied by AdminRoute
    // You might redirect them to their profile or home.
    return <Navigate to="/" replace />; 
};

export default PrivateRoute;