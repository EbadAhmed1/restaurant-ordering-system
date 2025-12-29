import React, { useEffect, useState } from 'react';
import apiClient from '../../api/api';
import { FaShoppingBag, FaDollarSign, FaUsers, FaChartLine } from 'react-icons/fa';
import './AdminPages.css';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        totalUsers: 0,
        avgOrderValue: 0
    });

    const [recentOrders, setRecentOrders] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const ordersRes = await apiClient.get('/admin/orders');
                const orders = ordersRes.data;
                const revenue = orders.reduce((acc, order) => acc + parseFloat(order.totalAmount), 0);
                const usersRes = await apiClient.get('/admin/users');
                
                setStats({
                    totalOrders: orders.length,
                    totalRevenue: revenue,
                    totalUsers: usersRes.data.length,
                    avgOrderValue: orders.length > 0 ? revenue / orders.length : 0
                });

                setRecentOrders(orders.slice(0, 4));
            } catch (error) {
                console.error("Error loading dashboard stats", error);
            }
        };
        fetchData();
    }, []);

    const statCards = [
        {
            title: 'Total Orders',
            value: stats.totalOrders.toLocaleString(),
            icon: <FaShoppingBag />,
            color: '#e74c3c',
            bgColor: '#ffe5e5',
            change: '+12.5%'
        },
        {
            title: 'Revenue',
            value: `$${stats.totalRevenue.toLocaleString()}`,
            icon: <FaDollarSign />,
            color: '#e74c3c',
            bgColor: '#ffe5e5',
            change: '+8.2%'
        },
        {
            title: 'Customers',
            value: stats.totalUsers.toLocaleString(),
            icon: <FaUsers />,
            color: '#e74c3c',
            bgColor: '#ffe5e5',
            change: '+5.3%'
        },
        {
            title: 'Avg Order',
            value: `$${stats.avgOrderValue.toFixed(2)}`,
            icon: <FaChartLine />,
            color: '#e74c3c',
            bgColor: '#ffe5e5',
            change: '-4.1%'
        }
    ];

    return (
        <div className="admin-page">
            <div className="page-header">
                <div>
                    <h1>Dashboard Overview</h1>
                    <p className="page-subtitle">Welcome back, here's what's happening today</p>
                </div>
                <button className="export-btn">Export Report</button>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                {statCards.map((stat, index) => (
                    <div key={index} className="stat-card">
                        <div className="stat-icon" style={{ background: stat.bgColor, color: stat.color }}>
                            {stat.icon}
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">{stat.title}</p>
                            <h2 className="stat-value">{stat.value}</h2>
                            <span className={`stat-change ${stat.change.startsWith('+') ? 'positive' : 'negative'}`}>
                                {stat.change}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="charts-section">
                <div className="chart-card large">
                    <div className="card-header">
                        <h3>Revenue Overview</h3>
                        <select className="chart-filter">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                            <option>Last 3 Months</option>
                        </select>
                    </div>
                    <div className="chart-placeholder">
                        <div className="line-chart-mock">
                            <svg viewBox="0 0 600 200" className="chart-svg">
                                <polyline
                                    fill="none"
                                    stroke="#e74c3c"
                                    strokeWidth="3"
                                    points="0,150 100,120 200,140 300,80 400,100 500,60 600,70"
                                />
                                <polyline
                                    fill="none"
                                    stroke="#3498db"
                                    strokeWidth="3"
                                    strokeDasharray="5,5"
                                    points="0,160 100,140 200,150 300,100 400,120 500,80 600,90"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="chart-card">
                    <div className="card-header">
                        <h3>Order Status</h3>
                    </div>
                    <div className="pie-chart-mock">
                        <div className="pie-segment" style={{ background: '#27ae60' }}>
                            <span>Completed<br/>65%</span>
                        </div>
                        <div className="pie-segment" style={{ background: '#f39c12' }}>
                            <span>Pending<br/>20%</span>
                        </div>
                        <div className="pie-segment" style={{ background: '#3498db' }}>
                            <span>Processing<br/>10%</span>
                        </div>
                        <div className="pie-segment" style={{ background: '#e74c3c' }}>
                            <span>Cancelled<br/>5%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Popular Items & Recent Orders */}
            <div className="bottom-section">
                <div className="popular-items-card">
                    <h3>Popular Items</h3>
                    <div className="popular-items-list">
                        {['Burger', 'Pizza', 'Chicken', 'Fries', 'Wings'].map((item, idx) => (
                            <div key={idx} className="popular-item">
                                <span className="item-name">{item}</span>
                                <div className="item-bar">
                                    <div className="item-bar-fill" style={{ width: `${100 - idx * 15}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="recent-orders-card">
                    <h3>Recent Orders</h3>
                    <div className="orders-list">
                        {recentOrders.map((order) => (
                            <div key={order.id} className="order-item">
                                <div className="order-info">
                                    <span className="order-id">#{order.id}</span>
                                    <span className="order-customer">John Doe</span>
                                </div>
                                <div className="order-details">
                                    <span className="order-amount">${order.totalAmount}</span>
                                    <span className={`order-status status-${order.status.toLowerCase()}`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
