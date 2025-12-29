import React, { useEffect, useState } from 'react';
import apiClient from '../../api/api';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addItemToCart } from '../../features/cart/cartSlice';
import { toast } from 'react-toastify';
import { FaBox, FaShoppingBag, FaTimes, FaMapMarkerAlt, FaCreditCard } from 'react-icons/fa';
import Header from '../../components/navigation/Header';
import './OrderHistory.css';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

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

    const getImageUrl = (imagePath) => {
        if (!imagePath) return 'https://placehold.co/80x80?text=Food';
        let cleanPath = imagePath.replace(/\\/g, '/');
        if (!cleanPath.startsWith('/')) cleanPath = `/${cleanPath}`;
        if (!cleanPath.startsWith('/public')) cleanPath = `/public${cleanPath}`;
        return `http://localhost:4500${cleanPath}`;
    };

    const filteredOrders = orders.filter(order => {
        if (activeTab === 'All') return true;
        if (activeTab === 'Pending') return order.status === 'Pending';
        if (activeTab === 'Delivered') return order.status === 'Delivered';
        if (activeTab === 'Cancelled') return order.status === 'Cancelled';
        return true;
    });

    const tabs = ['All', 'Pending', 'Delivered', 'Cancelled'];

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedOrder(null);
    };

    const handleReorder = (order) => {
        if (!order.items || order.items.length === 0) {
            toast.error('No items to reorder');
            return;
        }

        // Add all items from the order to cart
        order.items.forEach(item => {
            if (item.menuItem) {
                // Use the current menu item price, not the historical priceAtOrder
                const currentPrice = parseFloat(item.menuItem.price) || parseFloat(item.priceAtOrder) || 0;
                
                dispatch(addItemToCart({
                    id: item.menuItem.id || item.menuId,
                    name: item.menuItem.name,
                    price: currentPrice,
                    imageUrl: item.menuItem.imageUrl,
                    quantity: item.quantity
                }));
            }
        });

        toast.success('Items added to cart!');
        navigate('/cart');
    };

    if (loading) {
        return (
            <>
                <Header />
                <div className="order-history-page">
                    <div className="container">
                        <div className="loading-state">Loading your orders...</div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="order-history-page">
                <div className="container">
                    <h1 className="page-title">Your Orders</h1>

                {/* Tabs */}
                <div className="order-tabs">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                    <div className="empty-state">
                        <FaBox className="empty-icon" />
                        <h3>No orders found</h3>
                        <p>Start ordering delicious food!</p>
                        <Link to="/menu" className="browse-menu-btn">Browse Menu</Link>
                    </div>
                ) : (
                    <div className="orders-list">
                        {filteredOrders.map(order => (
                            <div key={order.id} className="order-card">
                                <div className="order-header">
                                    <div className="order-info">
                                        <h3>Order #{order.id}</h3>
                                        <p className="order-date">
                                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                    <span className={`order-status status-${order.status.toLowerCase()}`}>
                                        {order.status}
                                    </span>
                                </div>

                                <div className="order-items">
                                    {order.items && order.items.length > 0 ? (
                                        order.items.slice(0, 3).map((item, index) => (
                                            <div key={index} className="order-item-image">
                                                <img 
                                                    src={getImageUrl(item.menuItem?.imageUrl)} 
                                                    alt={item.menuItem?.name || 'Food item'}
                                                />
                                            </div>
                                        ))
                                    ) : (
                                        <div className="order-item-placeholder">
                                            <FaShoppingBag />
                                        </div>
                                    )}
                                    {order.items && order.items.length > 3 && (
                                        <div className="more-items">+{order.items.length - 3}</div>
                                    )}
                                </div>

                                <div className="order-footer">
                                    <div className="order-total">
                                        <span className="total-label">Total</span>
                                        <span className="total-amount">${(parseFloat(order.totalAmount) || 0).toFixed(2)}</span>
                                    </div>
                                    <div className="order-actions">
                                        <button 
                                            className="view-details-btn"
                                            onClick={() => handleViewDetails(order)}
                                        >
                                            View Details
                                        </button>
                                        {order.status === 'Delivered' && (
                                            <button 
                                                className="reorder-btn"
                                                onClick={() => handleReorder(order)}
                                            >
                                                Reorder
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Order Details Modal */}
                {showModal && selectedOrder && (
                    <div className="modal-overlay" onClick={handleCloseModal}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <button className="modal-close" onClick={handleCloseModal}>
                                <FaTimes />
                            </button>

                            <h2 className="modal-title">Order Details</h2>

                            <div className="modal-section">
                                <div className="detail-row">
                                    <span className="detail-label">Order Number:</span>
                                    <span className="detail-value">#{selectedOrder.id}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Order Date:</span>
                                    <span className="detail-value">
                                        {new Date(selectedOrder.createdAt).toLocaleString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Status:</span>
                                    <span className={`order-status status-${selectedOrder.status.toLowerCase()}`}>
                                        {selectedOrder.status}
                                    </span>
                                </div>
                            </div>

                            <div className="modal-section">
                                <h3 className="section-title">Order Items</h3>
                                <div className="modal-items-list">
                                    {selectedOrder.items && selectedOrder.items.length > 0 ? (
                                        selectedOrder.items.map((item, index) => (
                                            <div key={index} className="modal-item">
                                                <img 
                                                    src={getImageUrl(item.menuItem?.imageUrl)} 
                                                    alt={item.menuItem?.name || 'Food item'}
                                                    className="modal-item-image"
                                                />
                                                <div className="modal-item-info">
                                                    <h4>{item.menuItem?.name || 'Item'}</h4>
                                                    <p className="item-quantity">Quantity: {item.quantity}</p>
                                                </div>
                                                <div className="modal-item-price">
                                                    ${(() => {
                                                        // Use priceAtOrder first, then fall back to menuItem price
                                                        const price = parseFloat(item.priceAtOrder) || parseFloat(item.menuItem?.price) || 0;
                                                        return (price * item.quantity).toFixed(2);
                                                    })()}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="no-items">No items found</p>
                                    )}
                                </div>
                            </div>

                            <div className="modal-section">
                                <h3 className="section-title">Delivery Information</h3>
                                <div className="delivery-info">
                                    <div className="info-row">
                                        <FaMapMarkerAlt className="info-icon" />
                                        <div>
                                            <p className="info-label">Delivery Address</p>
                                            <p className="info-value">
                                                {selectedOrder.deliveryAddress || '123 Main Street, Apt 4B, New York, NY 10001'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="info-row">
                                        <FaCreditCard className="info-icon" />
                                        <div>
                                            <p className="info-label">Payment Method</p>
                                            <p className="info-value">
                                                {selectedOrder.paymentMethod || 'Credit Card'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-section">
                                <div className="order-summary">
                                    <div className="summary-row">
                                        <span>Subtotal:</span>
                                        <span>${(parseFloat(selectedOrder.totalAmount) || 0).toFixed(2)}</span>
                                    </div>
                                    <div className="summary-row">
                                        <span>Delivery Fee:</span>
                                        <span>$2.99</span>
                                    </div>
                                    <div className="summary-row">
                                        <span>Tax:</span>
                                        <span>${((parseFloat(selectedOrder.totalAmount) || 0) * 0.08).toFixed(2)}</span>
                                    </div>
                                    <div className="summary-row total-row">
                                        <span>Total:</span>
                                        <span>${((parseFloat(selectedOrder.totalAmount) || 0) + 2.99 + (parseFloat(selectedOrder.totalAmount) || 0) * 0.08).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-actions">
                                {selectedOrder.status === 'Delivered' && (
                                    <button 
                                        className="modal-reorder-btn"
                                        onClick={() => {
                                            handleReorder(selectedOrder);
                                            handleCloseModal();
                                        }}
                                    >
                                        Reorder
                                    </button>
                                )}
                                <button className="modal-close-btn" onClick={handleCloseModal}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
        </>
    );
};

export default OrderHistory;
