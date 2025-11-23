import React, { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import apiClient from '../../api/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        totalUsers: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch Orders to calculate Revenue and Counts
                const ordersRes = await apiClient.get('/admin/orders');
                const orders = ordersRes.data;

                const revenue = orders.reduce((acc, order) => acc + parseFloat(order.totalAmount), 0);
                const pending = orders.filter(o => o.status === 'Pending').length;

                // 2. Fetch Users to count them
                const usersRes = await apiClient.get('/admin/users');
                
                setStats({
                    totalOrders: orders.length,
                    totalRevenue: revenue,
                    pendingOrders: pending,
                    totalUsers: usersRes.data.length
                });
            } catch (error) {
                console.error("Error loading dashboard stats", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="container py-5">
            <h2 className="mb-4 fw-bold">Admin Dashboard</h2>
            
            {/* --- TOP ROW: ACTION CARDS --- */}
            <div className="row mb-5">
                {/* Manage Menu */}
                <div className="col-md-4 mb-3">
                    <div className="card text-white h-100 shadow border-0" style={{ backgroundColor: '#0d6efd', borderRadius: '15px' }}>
                        <div className="card-body d-flex flex-column justify-content-center align-items-center p-4">
                            <div className="mb-3 p-3 rounded-circle bg-white bg-opacity-25">
                                <i className="fa-solid fa-utensils fa-2x"></i>
                            </div>
                            <h4 className="card-title fw-bold">Manage Menu</h4>
                            <p className="card-text text-center opacity-75">Add, edit, or delete items.</p>
                            <Link to="/admin/manage-menu" className="btn btn-light rounded-pill px-4 fw-bold text-primary mt-2">Go to Menu</Link>
                        </div>
                    </div>
                </div>

                {/* Manage Orders */}
                <div className="col-md-4 mb-3">
                    <div className="card text-white h-100 shadow border-0" style={{ backgroundColor: '#198754', borderRadius: '15px' }}>
                        <div className="card-body d-flex flex-column justify-content-center align-items-center p-4">
                            <div className="mb-3 p-3 rounded-circle bg-white bg-opacity-25">
                                <i className="fa-solid fa-shopping-bag fa-2x"></i>
                            </div>
                            <h4 className="card-title fw-bold">Manage Orders</h4>
                            <p className="card-text text-center opacity-75">View and update order status.</p>
                            <Link to="/admin/manage-orders" className="btn btn-light rounded-pill px-4 fw-bold text-success mt-2">Go to Orders</Link>
                        </div>
                    </div>
                </div>

                {/* User Management */}
                <div className="col-md-4 mb-3">
                    <div className="card text-white h-100 shadow border-0" style={{ backgroundColor: '#0dcaf0', borderRadius: '15px' }}>
                        <div className="card-body d-flex flex-column justify-content-center align-items-center p-4">
                            <div className="mb-3 p-3 rounded-circle bg-white bg-opacity-25">
                                <i className="fa-solid fa-users fa-2x"></i>
                            </div>
                            <h4 className="card-title fw-bold">User Management</h4>
                            <p className="card-text text-center opacity-75">View registered users.</p>
                            <button className="btn btn-light rounded-pill px-4 fw-bold text-info mt-2 disabled">Coming Soon</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MIDDLE ROW: STATS OVERVIEW --- */}
            <div className="row mb-5">
                {/* Total Orders */}
                <div className="col-md-3 mb-3">
                    <div className="card border-0 shadow-sm p-3 h-100" style={{ borderRadius: '12px' }}>
                        <div className="d-flex align-items-center mb-2">
                            <div className="bg-primary bg-opacity-10 p-2 rounded me-3 text-primary">
                                <i className="fa-solid fa-bag-shopping"></i>
                            </div>
                            <h6 className="text-muted mb-0">Total Orders</h6>
                        </div>
                        <h3 className="fw-bold mb-0">{stats.totalOrders}</h3>
                    </div>
                </div>

                {/* Revenue */}
                <div className="col-md-3 mb-3">
                    <div className="card border-0 shadow-sm p-3 h-100" style={{ borderRadius: '12px' }}>
                        <div className="d-flex align-items-center mb-2">
                            <div className="bg-success bg-opacity-10 p-2 rounded me-3 text-success">
                                <i className="fa-solid fa-euro-sign"></i>
                            </div>
                            <h6 className="text-muted mb-0">Revenue</h6>
                        </div>
                        <h3 className="fw-bold mb-0">€{stats.totalRevenue.toFixed(2)}</h3>
                    </div>
                </div>

                {/* Active Users */}
                <div className="col-md-3 mb-3">
                    <div className="card border-0 shadow-sm p-3 h-100" style={{ borderRadius: '12px' }}>
                        <div className="d-flex align-items-center mb-2">
                            <div className="bg-warning bg-opacity-10 p-2 rounded me-3 text-warning">
                                <i className="fa-solid fa-user-check"></i>
                            </div>
                            <h6 className="text-muted mb-0">Total Users</h6>
                        </div>
                        <h3 className="fw-bold mb-0">{stats.totalUsers}</h3>
                    </div>
                </div>

                {/* Pending Orders */}
                <div className="col-md-3 mb-3">
                    <div className="card border-0 shadow-sm p-3 h-100" style={{ borderRadius: '12px' }}>
                        <div className="d-flex align-items-center mb-2">
                            <div className="bg-danger bg-opacity-10 p-2 rounded me-3 text-danger">
                                <i className="fa-regular fa-clock"></i>
                            </div>
                            <h6 className="text-muted mb-0">Pending Orders</h6>
                        </div>
                        <h3 className="fw-bold mb-0">{stats.pendingOrders}</h3>
                        <small className="text-danger" style={{ fontSize: '0.8rem' }}>Requires Action</small>
                    </div>
                </div>
            </div>

            {/* --- BOTTOM ROW: RECENT ACTIVITY (Visual Placeholder) --- */}
            <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                <div className="card-body p-4">
                    <h5 className="fw-bold mb-4">Recent Activity</h5>
                    
                    <div className="d-flex align-items-center mb-4">
                        <div className="bg-light p-3 rounded-circle me-3 text-primary">
                            <i className="fa-solid fa-receipt"></i>
                        </div>
                        <div>
                            <p className="mb-0 fw-bold">New order placed</p>
                            <small className="text-muted">2 minutes ago</small>
                        </div>
                    </div>

                    <div className="d-flex align-items-center mb-4">
                        <div className="bg-light p-3 rounded-circle me-3 text-success">
                            <i className="fa-solid fa-check"></i>
                        </div>
                        <div>
                            <p className="mb-0 fw-bold">Order #5 Delivered</p>
                            <small className="text-muted">15 minutes ago</small>
                        </div>
                    </div>

                    <div className="d-flex align-items-center">
                        <div className="bg-light p-3 rounded-circle me-3 text-info">
                            <i className="fa-solid fa-user-plus"></i>
                        </div>
                        <div>
                            <p className="mb-0 fw-bold">New User Registered</p>
                            <small className="text-muted">1 hour ago</small>
                        </div>
                    </div>
                </div>
            </div>
            
            <Outlet />
        </div>
    );
};

export default AdminDashboard;