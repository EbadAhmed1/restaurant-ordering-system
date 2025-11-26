import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/public/Home.jsx';
import Login from './pages/public/Login.jsx';
import Register from './pages/public/Register.jsx';
import Menu from './pages/public/Menu.jsx';
import Cart from './pages/public/Cart.jsx';
import Checkout from './pages/public/Checkout.jsx';
import Reservations from './pages/public/Reservations.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import ManageMenu from './pages/admin/ManageMenu.jsx';
import ManageOrders from './pages/admin/ManageOrders.jsx';
import ManageReservations from './pages/admin/ManageReservations.jsx';
import OrderHistory from './pages/public/OrderHistory.jsx';
import ManageUsers from './pages/admin/ManageUsers.jsx';

import PrivateRoute from './components/security/PrivateRoute.jsx';
import PublicLayout from './components/layouts/PublicLayout.jsx';

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<PublicLayout />}>
                <Route index element={<Home />} />
                <Route path="menu" element={<Menu />} />
                <Route path="cart" element={<Cart />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
            </Route>

            <Route element={<PrivateRoute allowedRoles={['customer', 'admin']} />}>
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/orders/history" element={<OrderHistory />} />
                <Route path="/reservations" element={<Reservations />} />
            </Route>
            
            <Route element={<PrivateRoute allowedRoles={['admin']} />}>
                {<Route path="/admin/dashboard" element={<AdminDashboard />} />   }
                {<Route path="/admin/manage-menu" element={<ManageMenu />} />     }
                {<Route path="/admin/manage-orders" element={<ManageOrders />} /> }
                <Route path="/admin/manage-reservations" element={<ManageReservations />} />
                <Route path="/admin/users" element={<ManageUsers />} />
            </Route>

            {/* Catch-all for 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default App;