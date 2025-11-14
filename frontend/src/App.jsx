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
                <Route index element={<Home />} />
                <Route path="menu" element={<Menu />} />
                <Route path="cart" element={<Cart />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
            </Route>

            {/* --- Protected Customer Routes --- */}
            <Route element={<PrivateRoute allowedRoles={['customer', 'admin']} />}>
                <Route path="/checkout" element={<Checkout />} />
            </Route>
            
            {/* --- Protected Admin Routes --- */}
            <Route element={<AdminRoute allowedRoles={['admin']} />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                {/* Add other admin routes here (Manage Menu, Orders, etc.) */}
            </Route>

            {/* Catch-all for 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default App;