import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

/**
 * Component to protect routes, specifically enforcing the 'admin' role.
 * Redirects non-authenticated users to login and non-admin users to the home page.
 */
const AdminRoute = () => {
    const { isAuthenticated, user, status } = useSelector(state => state.auth);

    // 1. Loading State Check (Optional: Render a loading spinner here)
    if (status === 'loading') {
        return <div>Loading session...</div>; 
    }
    
    // Check if user object exists and role is 'admin'
    const isAdmin = isAuthenticated && user && user.role === 'admin';

    // 2. Authorization Check
    if (isAdmin) {
        // User is authenticated and is an admin. Proceed to child route.
        return <Outlet />;
    }
    
    // 3. Redirection for Unauthorized Users
    if (isAuthenticated && user?.role !== 'admin') {
        // User is logged in but is NOT an admin (e.g., customer)
        toast.error("Access denied. Admin rights required.");
        return <Navigate to="/" replace />;
    } 

    // 4. Redirection for Non-Authenticated Users
    // User is not logged in.
    return <Navigate to="/login" replace />;
};

export default AdminRoute;