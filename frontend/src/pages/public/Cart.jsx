import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { addItemToCart, removeItemFromCart, deleteItem } from '../../features/cart/cartSlice';
import { FaShoppingCart, FaTrash, FaArrowLeft } from 'react-icons/fa';
import './Cart.css';

const PLACEHOLDER_IMAGE = 'https://placehold.co/600x400?text=No+Image';

const Cart = () => {
    const { cartItems, totalAmount } = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const getImageUrl = (imagePath) => {
        if (!imagePath) return PLACEHOLDER_IMAGE;
        let cleanPath = imagePath.replace(/\\/g, '/');
        if (!cleanPath.startsWith('/')) cleanPath = `/${cleanPath}`;
        if (!cleanPath.startsWith('/public')) cleanPath = `/public${cleanPath}`;
        return `http://localhost:4500${cleanPath}`;
    };

    const deliveryFee = 3.00;
    const tax = totalAmount * 0.08;
    const total = totalAmount + deliveryFee + tax;

    if (cartItems.length === 0) {
        return (
            <div className="cart-page">
                <div className="container">
                    <div className="empty-cart">
                        <FaShoppingCart className="empty-cart-icon" />
                        <h2>Your cart is empty</h2>
                        <p>Add some delicious items to get started!</p>
                        <Link to="/menu" className="browse-menu-btn">
                            Browse Menu
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="container">
                <div className="cart-header">
                    <Link to="/menu" className="back-link">
                        <FaArrowLeft /> Continue Shopping
                    </Link>
                    <h1>Your Cart</h1>
                </div>

                <div className="cart-layout">
                    {/* Cart Items */}
                    <div className="cart-items-section">
                        {cartItems.map((item) => (
                            <div key={item.id} className="cart-item-card">
                                <img 
                                    src={getImageUrl(item.imageUrl)} 
                                    alt={item.name}
                                    className="cart-item-image"
                                    onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
                                    referrerPolicy="no-referrer"
                                    crossOrigin="anonymous"
                                />
                                <div className="cart-item-details">
                                    <h3>{item.name}</h3>
                                    <p className="item-price">${(parseFloat(item.price) || 0).toFixed(2)}</p>
                                </div>
                                <div className="cart-item-actions">
                                    <div className="quantity-controls">
                                        <button 
                                            className="qty-btn"
                                            onClick={() => dispatch(removeItemFromCart(item.id))}
                                        >
                                            -
                                        </button>
                                        <span className="quantity">{item.quantity}</span>
                                        <button 
                                            className="qty-btn"
                                            onClick={() => dispatch(addItemToCart(item))}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <p className="item-subtotal">
                                        ${((parseFloat(item.price) || 0) * item.quantity).toFixed(2)}
                                    </p>
                                    <button 
                                        className="remove-btn"
                                        onClick={() => dispatch(deleteItem(item.id))}
                                        title="Remove item"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="order-summary-section">
                        <div className="order-summary-card">
                            <h3>Order Summary</h3>
                            
                            <div className="summary-items">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="summary-item">
                                        <div className="summary-item-info">
                                            <img 
                                                src={getImageUrl(item.imageUrl)} 
                                                alt={item.name}
                                                className="summary-item-image"
                                            />
                                            <div>
                                                <p className="summary-item-name">{item.name}</p>
                                                <p className="summary-item-qty">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="summary-item-price">
                                            ${((parseFloat(item.price) || 0) * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="summary-divider"></div>

                            <div className="summary-calculations">
                                <div className="summary-row">
                                    <span>Subtotal</span>
                                    <span>${(totalAmount || 0).toFixed(2)}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Tax (8%)</span>
                                    <span>${tax.toFixed(2)}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Delivery Fee</span>
                                    <span>${deliveryFee.toFixed(2)}</span>
                                </div>
                                <div className="summary-row total-row">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>

                            <button 
                                className="checkout-btn"
                                onClick={() => navigate('/checkout')}
                            >
                                Proceed to Checkout
                            </button>

                            <p className="delivery-note">
                                🚚 Free delivery on orders over $30
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
