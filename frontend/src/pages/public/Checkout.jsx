import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { placeOrder, resetOrderStatus } from '../../features/orders/orderSlice';
import { toast } from 'react-toastify';

const Checkout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const { cartItems, totalAmount } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);
    const { status, error, currentOrder } = useSelector((state) => state.orders);

    // Handle Order Success/Failure
    useEffect(() => {
        if (status === 'succeeded' && currentOrder) {
            toast.success('Order placed successfully!');
            // Redirect to a success page or home
            navigate('/'); 
            dispatch(resetOrderStatus());
        }

        if (status === 'failed') {
            toast.error(error || 'Failed to place order');
        }
    }, [status, error, currentOrder, navigate, dispatch]);

    const handlePlaceOrder = () => {
        if (cartItems.length === 0) {
            toast.warning("Your cart is empty!");
            return;
        }

        // Format data for backend: { items: [{ menuId, quantity }] }
        // Your backend 'orderController.js' expects exactly this structure.
        const orderPayload = {
            items: cartItems.map(item => ({
                menuId: item.id,
                quantity: item.quantity
            }))
        };

        dispatch(placeOrder(orderPayload));
    };

    return (
        <div className="container py-5">
            <div className="row">
                <div className="col-md-8">
                    <div className="card mb-4">
                        <div className="card-header">
                            <h4>Order Summary</h4>
                        </div>
                        <div className="card-body">
                            <ul className="list-group list-group-flush">
                                {cartItems.map(item => (
                                    <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                                        <div>
                                            <strong>{item.name}</strong> x {item.quantity}
                                        </div>
                                        <span>Rs. {(item.price * item.quantity).toFixed(2)}</span>
                                    </li>
                                ))}
                                <li className="list-group-item d-flex justify-content-between align-items-center bg-light">
                                    <strong>Total Amount</strong>
                                    <strong>Rs. {totalAmount.toFixed(2)}</strong>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card">
                        <div className="card-header">
                            <h4>Customer Details</h4>
                        </div>
                        <div className="card-body">
                            <p><strong>Name:</strong> {user?.username}</p>
                            <p><strong>Email:</strong> {user?.email}</p>
                            <p className="text-muted small">
                                * Payment is Cash on Delivery. 
                                <br /> 
                                * Order updates will be sent to your email.
                            </p>
                            
                            <button 
                                onClick={handlePlaceOrder}
                                className="btn btn-primary btn-block w-100"
                                disabled={status === 'loading' || cartItems.length === 0}
                            >
                                {status === 'loading' ? 'Processing...' : 'Confirm Order'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;