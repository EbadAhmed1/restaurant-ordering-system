import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import Pages
import Home from './pages/public/Home.jsx';
import Login from './pages/public/Login.jsx';
import Register from './pages/public/Register.jsx';
import Menu from './pages/public/Menu.jsx';
import Cart from './pages/public/Cart.jsx';
import Checkout from './pages/public/Checkout.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import ManageMenu from './pages/admin/ManageMenu.jsx';
import ManageOrders from './pages/admin/ManageOrders.jsx';
import OrderHistory from './pages/public/OrderHistory.jsx';
import ManageUsers from './pages/admin/ManageUsers.jsx';

// Components for Protected Routes
import PrivateRoute from './components/security/PrivateRoute.jsx';
// import AdminRoute from './components/security/AdminRoute.jsx'; // Comment out if not using yet
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
                 {/* Checkout is already imported, so this is fine */}
                <Route path="/checkout" element={<Checkout />} />
                {/* <Route path="/orders/history" element={<OrderHistory />} />  <-- COMMENT THIS OUT */}
                <Route path="/orders/history" element={<OrderHistory />} />
            </Route>
            
            {/* --- Protected Admin Routes --- */}
            <Route element={<PrivateRoute allowedRoles={['admin']} />}>
                {<Route path="/admin/dashboard" element={<AdminDashboard />} />   }
                {<Route path="/admin/manage-menu" element={<ManageMenu />} />     }
                {<Route path="/admin/manage-orders" element={<ManageOrders />} /> }
                <Route path="/admin/users" element={<ManageUsers />} />
            </Route>

            {/* Catch-all for 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default App;