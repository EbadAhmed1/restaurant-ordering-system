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
            fetchOrders(); // Refresh list
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    // Helper to determine badge color
    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'Delivered': return 'badge badge-success'; // Green
            case 'Cancelled': return 'badge badge-danger';  // Red
            case 'Processing': return 'badge badge-info text-white';   // Blue
            case 'Pending': return 'badge badge-warning text-dark'; // Yellow
            default: return 'badge badge-secondary';        // Grey
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
                                <td>€{order.totalAmount}</td> {/* Using Euro symbol */}
                                <td>
                                    {/* Apply dynamic class function here */}
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