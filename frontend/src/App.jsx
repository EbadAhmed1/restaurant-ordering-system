import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import Pages
import Home from './pages/public/Home.jsx';
import Login from './pages/public/Login.jsx';
import Register from './pages/public/Register.jsx';
import Menu from './pages/public/Menu.jsx';
import Cart from './pages/public/Cart.jsx';
import Checkout from './pages/public/Checkout.jsx';
// Import Admin Pages (will be created later)
import AdminDashboard from './pages/admin/AdminDashboard.jsx';

// Components for Protected Routes
import PrivateRoute from './components/security/PrivateRoute.jsx';
import AdminRoute from './components/security/AdminRoute.jsx';
import PublicLayout from './components/layouts/PublicLayout.jsx';

const App = () => {
    return (
        <Routes>
            {/* --- Public Routes with Public Layout --- */}
            <Route path="/" element={<PublicLayout />}>
                {/* ... (Public route definitions: home, menu, cart, login, register) */}
            </Route>

            {/* --- Protected Customer/Admin Routes --- */}
            {/* Example: Any logged-in user can reach checkout/history */}
            <Route element={<PrivateRoute allowedRoles={['customer', 'admin']} />}>
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/orders/history" element={<OrderHistory />} /> {/* Example History route */}
            </Route>
            
            {/* --- Protected Admin Routes (Explicitly checks for 'admin' role) --- */}
            <Route element={<AdminRoute />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/manage-menu" element={<ManageMenu />} />
                <Route path="/admin/manage-orders" element={<ManageOrders />} />
            </Route>

            {/* Catch-all for 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default App;