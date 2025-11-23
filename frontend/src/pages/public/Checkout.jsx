import React, { useEffect, useState } from 'react';
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

    // State to control the Confirmation Modal
    const [showModal, setShowModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('COD'); // Default to Cash on Delivery

    // Handle Order Success/Failure
    useEffect(() => {
        if (status === 'succeeded' && currentOrder) {
            setShowModal(false); // Close modal
            toast.success('Payment Verified! Order placed successfully.');
            navigate('/'); 
            dispatch(resetOrderStatus());
        }

        if (status === 'failed') {
            setShowModal(false);
            toast.error(error || 'Failed to place order');
        }
    }, [status, error, currentOrder, navigate, dispatch]);

    // Step 1: Open the Modal instead of dispatching immediately
    const handleProceed = () => {
        if (cartItems.length === 0) {
            toast.warning("Your cart is empty!");
            return;
        }
        setShowModal(true);
    };

    // Step 2: Actually place the order (called from Modal)
    const handleConfirmPayment = () => {
        const orderPayload = {
            items: cartItems.map(item => ({
                menuId: item.id,
                quantity: item.quantity
            }))
        };
        // In a real app, you might send 'paymentMethod' to the backend here too
        dispatch(placeOrder(orderPayload));
    };

    return (
        <div className="container py-5">
            <h2 className="mb-4">Checkout</h2>
            <div className="row">
                {/* Order Summary Column */}
                <div className="col-md-7">
                    <div className="card mb-4 shadow-sm">
                        <div className="card-header bg-white">
                            <h5 className="mb-0">Order Summary</h5>
                        </div>
                        <div className="card-body p-0">
                            <ul className="list-group list-group-flush">
                                {cartItems.map(item => (
                                    <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <span className="badge badge-primary badge-pill mr-3">{item.quantity}x</span>
                                            {item.name}
                                        </div>
                                        <span>Rs. {(item.price * item.quantity).toFixed(2)}</span>
                                    </li>
                                ))}
                                <li className="list-group-item d-flex justify-content-between align-items-center bg-light">
                                    <strong>Total Amount</strong>
                                    <strong className="text-success" style={{ fontSize: '1.2rem' }}>
                                        Rs. {totalAmount.toFixed(2)}
                                    </strong>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Payment Details Column */}
                <div className="col-md-5">
                    <div className="card shadow-sm">
                        <div className="card-header bg-white">
                            <h5 className="mb-0">Payment Details</h5>
                        </div>
                        <div className="card-body">
                            <div className="form-group mb-3">
                                <label className="text-muted">Customer Name</label>
                                <input type="text" className="form-control" value={user?.username || ''} disabled />
                            </div>
                            
                            <div className="form-group mb-4">
                                <label className="text-muted">Payment Method</label>
                                <div className="border rounded p-3">
                                    <div className="custom-control custom-radio mb-2">
                                        <input 
                                            type="radio" 
                                            id="cod" 
                                            name="paymentMethod" 
                                            className="custom-control-input" 
                                            checked={paymentMethod === 'COD'} 
                                            onChange={() => setPaymentMethod('COD')}
                                        />
                                        <label className="custom-control-label" htmlFor="cod">Cash on Delivery</label>
                                    </div>
                                    <div className="custom-control custom-radio">
                                        <input 
                                            type="radio" 
                                            id="card" 
                                            name="paymentMethod" 
                                            className="custom-control-input" 
                                            disabled 
                                        />
                                        <label className="custom-control-label text-muted" htmlFor="card">Credit Card (Coming Soon)</label>
                                    </div>
                                </div>
                            </div>
                            
                            <button 
                                onClick={handleProceed}
                                className="btn btn-primary btn-block btn-lg w-100"
                                disabled={status === 'loading' || cartItems.length === 0}
                            >
                                Proceed to Verification
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Verification Modal (Custom React Implementation) --- */}
            {showModal && (
                <>
                    {/* Backdrop */}
                    <div className="modal-backdrop fade show"></div>
                    {/* Modal */}
                    <div className="modal fade show d-block" tabIndex="-1" role="dialog">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Verify Payment</h5>
                                    <button type="button" className="close" onClick={() => setShowModal(false)}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body text-center">
                                    <div className="mb-3">
                                        <i className="fa fa-check-circle text-success" style={{ fontSize: '3rem' }}></i>
                                    </div>
                                    <h5>Confirm Your Order?</h5>
                                    <p className="text-muted mb-1">You are about to place an order via <strong>{paymentMethod}</strong>.</p>
                                    <h3 className="text-primary my-3">Rs. {totalAmount.toFixed(2)}</h3>
                                    <p className="small text-muted">Please have the exact amount ready upon delivery.</p>
                                </div>
                                <div className="modal-footer">
                                    <button 
                                        type="button" 
                                        className="btn btn-secondary" 
                                        onClick={() => setShowModal(false)}
                                        disabled={status === 'loading'}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn btn-success px-4" 
                                        onClick={handleConfirmPayment}
                                        disabled={status === 'loading'}
                                    >
                                        {status === 'loading' ? (
                                            <span><span className="spinner-border spinner-border-sm mr-2"></span>Processing...</span>
                                        ) : (
                                            'Confirm & Place Order'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Checkout;