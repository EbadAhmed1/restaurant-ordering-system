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
                const ordersRes = await apiClient.get('/admin/orders');
                const orders = ordersRes.data;
                const revenue = orders.reduce((acc, order) => acc + parseFloat(order.totalAmount), 0);
                const pending = orders.filter(o => o.status === 'Pending').length;
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

    // Helper for card styles to reduce repetition
    const CardIcon = ({ icon, color, bg }) => (
        <div className={`d-flex align-items-center justify-content-center rounded-circle me-3`} 
             style={{ width: '50px', height: '50px', backgroundColor: bg, color: color }}>
            <i className={`${icon} fs-5`}></i>
        </div>
    );

    return (
        <div className="container py-5">
            <h2 className="mb-4 fw-bold text-dark">Admin Dashboard</h2>
            
            {/* --- ACTION BUTTONS (Top Row) --- */}
            <div className="row mb-5">
                <div className="col-md-3 mb-3">
                    <div className="card text-white h-100 shadow border-0" style={{ backgroundColor: '#0d6efd', borderRadius: '15px' }}>
                        <div className="card-body d-flex flex-column justify-content-center align-items-center p-4">
                            <div className="mb-3 p-3 rounded-circle bg-white bg-opacity-25">
                                <i className="fa-solid fa-utensils fa-2x"></i>
                            </div>
                            <h4 className="card-title fw-bold">Manage Menu</h4>
                            <Link to="/admin/manage-menu" className="btn btn-light rounded-pill px-4 fw-bold text-primary mt-2">Go to Menu</Link>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card text-white h-100 shadow border-0" style={{ backgroundColor: '#198754', borderRadius: '15px' }}>
                        <div className="card-body d-flex flex-column justify-content-center align-items-center p-4">
                            <div className="mb-3 p-3 rounded-circle bg-white bg-opacity-25">
                                <i className="fa-solid fa-shopping-bag fa-2x"></i>
                            </div>
                            <h4 className="card-title fw-bold">Manage Orders</h4>
                            <Link to="/admin/manage-orders" className="btn btn-light rounded-pill px-4 fw-bold text-success mt-2">Go to Orders</Link>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card text-white h-100 shadow border-0" style={{ backgroundColor: '#6f42c1', borderRadius: '15px' }}>
                        <div className="card-body d-flex flex-column justify-content-center align-items-center p-4">
                            <div className="mb-3 p-3 rounded-circle bg-white bg-opacity-25">
                                <i className="fa-solid fa-calendar-check fa-2x"></i>
                            </div>
                            <h4 className="card-title fw-bold">Manage Reservations</h4>
                            <Link to="/admin/manage-reservations" className="btn btn-light rounded-pill px-4 fw-bold mt-2" style={{ color: '#6f42c1' }}>Go to Reservations</Link>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card text-white h-100 shadow border-0" style={{ backgroundColor: '#0dcaf0', borderRadius: '15px' }}>
                        <div className="card-body d-flex flex-column justify-content-center align-items-center p-4">
                            <div className="mb-3 p-3 rounded-circle bg-white bg-opacity-25">
                                <i className="fa-solid fa-users fa-2x"></i>
                            </div>
                            <h4 className="card-title fw-bold">User Management</h4>
                            <p className="card-text text-center opacity-75">View registered users.</p>
                            <Link to="/admin/users" className="btn btn-light rounded-pill px-4 fw-bold text-info mt-2">Go to Users</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- STATS ROW (Matching the Design) --- */}
            <div className="row mb-5">
                {/* Total Orders */}
                <div className="col-md-3 mb-3">
                    <div className="card border-0 shadow-sm p-3 h-100" style={{ borderRadius: '12px' }}>
                        <div className="card-body">
                            <CardIcon icon="fa-solid fa-bag-shopping" color="#0d6efd" bg="#e7f1ff" />
                            <h6 className="text-muted mt-3 mb-1">Total Orders</h6>
                            <h2 className="fw-bold mb-2 text-dark">{stats.totalOrders}</h2>
                            <small className="text-success fw-bold"><i className="fa-solid fa-arrow-trend-up me-1"></i>+12.5%</small> 
                            <small className="text-muted ms-1">from last month</small>
                        </div>
                    </div>
                </div>

                {/* Revenue */}
                <div className="col-md-3 mb-3">
                    <div className="card border-0 shadow-sm p-3 h-100" style={{ borderRadius: '12px' }}>
                        <div className="card-body">
                            <CardIcon icon="fa-solid fa-euro-sign" color="#198754" bg="#d1e7dd" />
                            <h6 className="text-muted mt-3 mb-1">Revenue</h6>
                            <h2 className="fw-bold mb-2 text-dark">€{stats.totalRevenue.toLocaleString()}</h2>
                            <small className="text-success fw-bold"><i className="fa-solid fa-arrow-trend-up me-1"></i>+8.2%</small> 
                            <small className="text-muted ms-1">from last month</small>
                        </div>
                    </div>
                </div>

                {/* Active Users */}
                <div className="col-md-3 mb-3">
                    <div className="card border-0 shadow-sm p-3 h-100" style={{ borderRadius: '12px' }}>
                        <div className="card-body">
                            <CardIcon icon="fa-regular fa-user" color="#ffc107" bg="#fff3cd" />
                            <h6 className="text-muted mt-3 mb-1">Active Users</h6>
                            <h2 className="fw-bold mb-2 text-dark">{stats.totalUsers}</h2>
                            <small className="text-success fw-bold"><i className="fa-solid fa-arrow-trend-up me-1"></i>+5.3%</small> 
                            <small className="text-muted ms-1">from last month</small>
                        </div>
                    </div>
                </div>

                {/* Pending Orders */}
                <div className="col-md-3 mb-3">
                    <div className="card border-0 shadow-sm p-3 h-100" style={{ borderRadius: '12px' }}>
                        <div className="card-body">
                            <CardIcon icon="fa-regular fa-clock" color="#dc3545" bg="#f8d7da" />
                            <h6 className="text-muted mt-3 mb-1">Pending Orders</h6>
                            <h2 className="fw-bold mb-2 text-dark">{stats.pendingOrders}</h2>
                            <small className="text-danger fw-bold"><i className="fa-solid fa-arrow-trend-down me-1"></i>-3.1%</small> 
                            <small className="text-muted ms-1">from last month</small>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- RECENT ACTIVITY ROW --- */}
            <h4 className="fw-bold mb-3">Recent Activity</h4>
            <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                <div className="card-body p-0">
                    {/* Item 1: New Order */}
                    <div className="d-flex align-items-center p-4 border-bottom">
                        <CardIcon icon="fa-solid fa-bag-shopping" color="#0d6efd" bg="#e7f1ff" />
                        <div className="flex-grow-1">
                            <p className="mb-0 fw-bold text-dark">New order #{stats.totalOrders} placed by a Customer</p>
                        </div>
                        <small className="text-muted">5 minutes ago</small>
                    </div>

                    {/* Item 2: Completed Order */}
                    <div className="d-flex align-items-center p-4 border-bottom">
                        <CardIcon icon="fa-solid fa-check" color="#198754" bg="#d1e7dd" />
                        <div className="flex-grow-1">
                            <p className="mb-0 text-dark">Order #1230 completed and delivered</p>
                        </div>
                        <small className="text-muted">12 minutes ago</small>
                    </div>

                    {/* Item 3: New User */}
                    <div className="d-flex align-items-center p-4 border-bottom">
                        <CardIcon icon="fa-regular fa-user" color="#ffc107" bg="#fff3cd" />
                        <div className="flex-grow-1">
                            <p className="mb-0 text-dark">New user Sarah Johnson registered</p>
                        </div>
                        <small className="text-muted">25 minutes ago</small>
                    </div>

                    {/* Item 4: Menu Updated (Purple Icon) */}
                    <div className="d-flex align-items-center p-4 border-bottom">
                        <CardIcon icon="fa-solid fa-cube" color="#6f42c1" bg="#e0cffc" />
                        <div className="flex-grow-1">
                            <p className="mb-0 text-dark">Menu item 'Margherita Pizza' updated</p>
                        </div>
                        <small className="text-muted">1 hour ago</small>
                    </div>

                    {/* Item 5: Cancelled (Red Icon) */}
                    <div className="d-flex align-items-center p-4">
                        <CardIcon icon="fa-solid fa-trash-can" color="#dc3545" bg="#f8d7da" />
                        <div className="flex-grow-1">
                            <p className="mb-0 text-dark">Order #1228 cancelled by customer</p>
                        </div>
                        <small className="text-muted">2 hours ago</small>
                    </div>
                </div>
            </div>
            
            <Outlet />
        </div>
    );
};

export default AdminDashboard;