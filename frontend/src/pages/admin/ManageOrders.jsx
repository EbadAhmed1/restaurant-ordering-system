import React, { useEffect, useState } from 'react';
import apiClient from '../../api/api';
import { toast } from 'react-toastify';

const ManageOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

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

    // --- FIXED: Updated for Bootstrap 5 classes (bg-*) ---
    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'Delivered': return 'badge bg-success'; // Green background
            case 'Cancelled': return 'badge bg-danger';  // Red background
            case 'Processing': return 'badge bg-info text-dark';   // Blue background (dark text for readability)
            case 'Pending': return 'badge bg-warning text-dark'; // Yellow background
            default: return 'badge bg-secondary';        // Grey background
        }
    };

    if (loading) return <div className="container py-5">Loading Orders...</div>;

    return (
        <div className="container py-5">
            <h2>Manage Orders</h2>
            <div className="table-responsive mt-4">
                <table className="table table-striped">
                    <thead className="thead-dark">
                        <tr>
                            <th>ID</th>
                            <th>Date</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td>#{order.id}</td>
                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td>€{order.totalAmount}</td>
                                <td>
                                    {/* The span now uses the correct bg- classes */}
                                    <span className={`p-2 ${getStatusBadgeClass(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td>
                                    <select 
                                        className="form-control form-control-sm"
                                        value={order.status}
                                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                        style={{ width: '150px' }}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Processing">Processing</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageOrders;