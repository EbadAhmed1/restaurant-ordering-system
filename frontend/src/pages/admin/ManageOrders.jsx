import React, { useEffect, useState } from 'react';
import apiClient from '../../api/api';
import { toast } from 'react-toastify';
import { FaPhone, FaPrint } from 'react-icons/fa';
import './AdminPages.css';

const ManageOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('All');

    const fetchOrders = async () => {
        try {
            const res = await apiClient.get('/admin/orders');
            setOrders(res.data);
            setLoading(false);
        } catch (error) {
            toast.error("Failed to fetch orders");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await apiClient.put(`/admin/orders/${id}/status`, { status: newStatus });
            toast.success(`Order #${id} updated to ${newStatus}`);
            fetchOrders(); 
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const filteredOrders = orders.filter(order => 
        filterStatus === 'All' || order.status === filterStatus
    );

    const statusTabs = ['All', 'Pending', 'Processing', 'Ready', 'Delivered', 'Cancelled'];

    if (loading) {
        return (
            <div className="admin-page">
                <div style={{ textAlign: 'center', padding: '60px' }}>
                    <div className="spinner-border text-danger" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-page">
            <div className="page-header">
                <div>
                    <h1>Orders Management</h1>
                    <p className="page-subtitle">Manage and track customer orders</p>
                </div>
            </div>

            {/* Status Tabs */}
            <div style={{ 
                display: 'flex', 
                gap: '12px', 
                marginBottom: '24px',
                borderBottom: '2px solid #ecf0f1',
                paddingBottom: '0'
            }}>
                {statusTabs.map(status => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        style={{
                            padding: '12px 24px',
                            background: 'none',
                            border: 'none',
                            borderBottom: filterStatus === status ? '3px solid #e74c3c' : '3px solid transparent',
                            color: filterStatus === status ? '#e74c3c' : '#7f8c8d',
                            fontWeight: filterStatus === status ? '700' : '500',
                            cursor: 'pointer',
                            fontSize: '14px',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* Orders List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredOrders.map(order => (
                    <div key={order.id} style={{
                        background: 'white',
                        padding: '24px',
                        borderRadius: '12px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <div>
                                <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '700', color: '#2c3e50' }}>
                                    Order #{order.id}
                                </h3>
                                <p style={{ margin: '0', fontSize: '13px', color: '#7f8c8d' }}>
                                    {new Date(order.createdAt).toLocaleString()} • {Math.floor(Math.random() * 4) + 1} guests
                                </p>
                                <div style={{ marginTop: '12px' }}>
                                    <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#2c3e50' }}>
                                        <strong>Customer:</strong> John Doe
                                    </p>
                                    <p style={{ margin: '0', fontSize: '14px', color: '#2c3e50' }}>
                                        <strong>Phone:</strong> (555) 123-4567
                                    </p>
                                </div>
                            </div>
                            
                            <div style={{ textAlign: 'right' }}>
                                <span className={`order-status status-${order.status.toLowerCase()}`}>
                                    {order.status}
                                </span>
                                <p style={{ margin: '12px 0 0 0', fontSize: '20px', fontWeight: '700', color: '#e74c3c' }}>
                                    ${order.totalAmount}
                                </p>
                                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#7f8c8d' }}>
                                    <strong>Payment:</strong> Credit Card
                                </p>
                            </div>
                        </div>

                        {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                            <div style={{ 
                                marginTop: '16px', 
                                paddingTop: '16px', 
                                borderTop: '1px solid #ecf0f1',
                                display: 'flex',
                                gap: '12px'
                            }}>
                                <button 
                                    className="action-btn secondary"
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                                >
                                    <FaPhone /> Call Customer
                                </button>
                                <button 
                                    className="action-btn secondary"
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                                >
                                    <FaPrint /> Print
                                </button>
                                <select 
                                    className="action-btn primary"
                                    value={order.status}
                                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                    style={{ marginLeft: 'auto' }}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Ready">Ready</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {filteredOrders.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#7f8c8d' }}>
                    <p>No orders found</p>
                </div>
            )}
        </div>
    );
};

export default ManageOrders;
