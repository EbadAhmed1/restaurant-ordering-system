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