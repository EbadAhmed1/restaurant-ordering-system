import React, { useEffect, useState } from 'react';
import apiClient from '../../api/api';
import { Link } from 'react-router-dom';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await apiClient.get('/orders/history');
                setOrders(res.data);
            } catch (error) {
                console.error("Error fetching history:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    if (loading) return <div className="container py-5">Loading your orders...</div>;

    if (orders.length === 0) {
        return (
            <div className="container py-5 text-center">
                <h3>No orders found.</h3>
                <Link to="/menu" className="btn btn-primary mt-3">Order Something Tasty!</Link>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <h2 className="mb-4">Your Order History</h2>
            <div className="table-responsive shadow-sm">
                <table className="table table-hover border">
                    <thead className="thead-light">
                        <tr>
                            <th>Order ID</th>
                            <th>Date</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td>#{order.id}</td>
                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <ul className="list-unstyled mb-0 small">
                                        {/* If your backend returns included items, mapping them here */}
                                        {order.items && order.items.map((item, index) => (
                                            <li key={index}>
                                                {item.quantity}x {item.menuItem?.name || "Item"}
                                            </li>
                                        ))}
                                        {!order.items && <span>View details</span>}
                                    </ul>
                                </td>
                                <td>
                                    <strong>€{order.totalAmount}</strong>
                                </td>
                                <td>
                                    <span className={`badge ${
                                        order.status === 'Delivered' ? 'bg-success' : 
                                        order.status === 'Cancelled' ? 'bg-danger' : 
                                        order.status === 'Processing' ? 'bg-info' : 
                                        'bg-warning text-dark'
                                    }`}>
                                        {order.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderHistory;