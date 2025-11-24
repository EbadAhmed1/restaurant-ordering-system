import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { addItemToCart, removeItemFromCart, deleteItem } from '../../features/cart/cartSlice';

// Fallback image
const PLACEHOLDER_IMAGE = 'https://placehold.co/600x400?text=No+Image';

const Cart = () => {
    const { cartItems, totalAmount } = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Navigate to menu when last item is removed
    React.useEffect(() => {
        if (cartItems.length === 0) {
            navigate('/menu');
        }
    }, [cartItems.length, navigate]);

    // --- HELPER FUNCTION FOR IMAGES (Same as in Menu) ---
    const getImageUrl = (imagePath) => {
        if (!imagePath) return PLACEHOLDER_IMAGE;

        // 1. Clean up Windows slashes
        let cleanPath = imagePath.replace(/\\/g, '/');

        // 2. Ensure it starts with a slash
        if (!cleanPath.startsWith('/')) {
            cleanPath = `/${cleanPath}`;
        }

        // 3. Prepend '/public' if missing
        if (!cleanPath.startsWith('/public')) {
            cleanPath = `/public${cleanPath}`;
        }

        // 4. Return full URL with Backend Port
        return `http://localhost:4500${cleanPath}`;
    };
    // ----------------------------------------------------

    if (cartItems.length === 0) {
        return (
            <div className="container text-center mt-5">
                <h2>Your Cart is Empty</h2>
                <Link to="/menu" className="btn btn-primary mt-3">Browse Menu</Link>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <h2 className="mb-4">Your Cart</h2>
            <div className="table-responsive">
                <table className="table table-bordered table-hover align-middle">
                    <thead className="thead-light">
                        <tr>
                            <th>Item</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Subtotal</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartItems.map((item) => (
                            <tr key={item.id}>
                                <td>
                                    <div className="d-flex align-items-center">
                                        {/* UPDATED IMAGE TAG */}
                                        <img 
                                            src={getImageUrl(item.imageUrl)} 
                                            alt={item.name} 
                                            style={{ width: '60px', height: '60px', objectFit: 'cover', marginRight: '15px', borderRadius: '5px' }} 
                                            onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
                                            referrerPolicy="no-referrer"
                                            crossOrigin="anonymous"
                                        />
                                        <span className="h6 mb-0">{item.name}</span>
                                    </div>
                                </td>
                                <td>€{parseFloat(item.price).toFixed(2)}</td>
                                <td>
                                    <div className="btn-group" role="group">
                                        <button className="btn btn-sm btn-outline-secondary" onClick={() => dispatch(removeItemFromCart(item.id))}>-</button>
                                        <span className="btn btn-sm btn-light disabled px-3">{item.quantity}</span>
                                        <button className="btn btn-sm btn-outline-secondary" onClick={() => dispatch(addItemToCart(item))}>+</button>
                                    </div>
                                </td>
                                <td>€{(item.price * item.quantity).toFixed(2)}</td>
                                <td>
                                    <button className="btn btn-danger btn-sm" onClick={() => dispatch(deleteItem(item.id))}>
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="d-flex justify-content-end align-items-center mt-4 p-3 bg-light rounded">
                <h4 className="me-4 mb-0">Total: <span className="text-success">€{totalAmount.toFixed(2)}</span></h4>
                <button onClick={() => navigate('/checkout')} className="btn btn-success btn-lg">
                    Proceed to Checkout
                </button>
            </div>
        </div>
    );
};

export default Cart;