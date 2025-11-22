import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { addItemToCart, removeItemFromCart, deleteItem } from '../../features/cart/cartSlice';

const Cart = () => {
    const { cartItems, totalAmount } = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();

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
                <table className="table table-bordered table-hover">
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
                                        {/* Use placeholder if image missing */}
                                        {item.imageUrl && (
                                            <img src={item.imageUrl} alt={item.name} style={{width: '50px', marginRight: '10px'}} />
                                        )}
                                        <span>{item.name}</span>
                                    </div>
                                </td>
                                <td>Rs. {parseFloat(item.price).toFixed(2)}</td>
                                <td>
                                    <div className="btn-group" role="group">
                                        <button className="btn btn-sm btn-outline-secondary" onClick={() => dispatch(removeItemFromCart(item.id))}>-</button>
                                        <span className="btn btn-sm btn-light disabled">{item.quantity}</span>
                                        <button className="btn btn-sm btn-outline-secondary" onClick={() => dispatch(addItemToCart(item))}>+</button>
                                    </div>
                                </td>
                                <td>Rs. {(item.price * item.quantity).toFixed(2)}</td>
                                <td>
                                    <button className="btn btn-danger btn-sm" onClick={() => dispatch(deleteItem(item.id))}>
                                        <i className="fa fa-trash"></i> Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="d-flex justify-content-end align-items-center mt-3">
                <h4 className="me-4">Total: Rs. {totalAmount.toFixed(2)}</h4>
                <button onClick={() => navigate('/checkout')} className="btn btn-success btn-lg">
                    Proceed to Checkout
                </button>
            </div>
        </div>
    );
};

export default Cart;