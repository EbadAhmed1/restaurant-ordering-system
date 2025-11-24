import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { placeOrder, resetOrderStatus } from '../../features/orders/orderSlice';
import { toast } from 'react-toastify';

// Fallback image
const PLACEHOLDER_IMAGE = 'https://placehold.co/600x400?text=No+Image';

const Checkout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const { cartItems, totalAmount } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);
    const { status, error, currentOrder } = useSelector((state) => state.orders);

    const [showModal, setShowModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [cardDetails, setCardDetails] = useState({
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: ''
    });
    const [isProcessing, setIsProcessing] = useState(false);

    // --- HELPER FOR IMAGES ---
    const getImageUrl = (imagePath) => {
        if (!imagePath) return PLACEHOLDER_IMAGE;
        let cleanPath = imagePath.replace(/\\/g, '/');
        if (!cleanPath.startsWith('/')) cleanPath = `/${cleanPath}`;
        if (!cleanPath.startsWith('/public')) cleanPath = `/public${cleanPath}`;
        return `http://localhost:4500${cleanPath}`;
    };
    // -------------------------

    useEffect(() => {
        if (status === 'succeeded' && currentOrder) {
            setShowModal(false);
            toast.success('Payment Verified! Order placed successfully.');
            navigate('/'); 
            dispatch(resetOrderStatus());
        }

        if (status === 'failed') {
            setShowModal(false);
            toast.error(error || 'Failed to place order');
        }
    }, [status, error, currentOrder, navigate, dispatch]);

    const handleProceed = () => {
        if (cartItems.length === 0) {
            toast.warning("Your cart is empty!");
            return;
        }
        setShowModal(true);
    };

    const handleConfirmPayment = () => {
        if (paymentMethod === 'Card') {
            // Simulate card processing
            setIsProcessing(true);
            setTimeout(() => {
                setIsProcessing(false);
                const orderPayload = {
                    items: cartItems.map(item => ({
                        menuId: item.id,
                        quantity: item.quantity
                    }))
                };
                dispatch(placeOrder(orderPayload));
            }, 2000); // 2 second delay to simulate payment processing
        } else {
            const orderPayload = {
                items: cartItems.map(item => ({
                    menuId: item.id,
                    quantity: item.quantity
                }))
            };
            dispatch(placeOrder(orderPayload));
        }
    };

    const handleCardInputChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        // Format card number with spaces
        if (name === 'cardNumber') {
            formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
            if (formattedValue.length > 19) return;
        }

        // Format expiry date
        if (name === 'expiryDate') {
            formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
            if (formattedValue.length > 5) return;
        }

        // Limit CVV to 3 digits
        if (name === 'cvv') {
            formattedValue = value.replace(/\D/g, '');
            if (formattedValue.length > 3) return;
        }

        setCardDetails({ ...cardDetails, [name]: formattedValue });
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
                                            {/* ADDED IMAGE HERE */}
                                            <img 
                                                src={getImageUrl(item.imageUrl)} 
                                                alt={item.name} 
                                                style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '15px', borderRadius: '4px' }}
                                                onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
                                                referrerPolicy="no-referrer"
                                                crossOrigin="anonymous"
                                            />
                                            <div>
                                                <span className="badge bg-primary rounded-pill me-2">{item.quantity}x</span>
                                                {item.name}
                                            </div>
                                        </div>
                                        <span>€{(item.price * item.quantity).toFixed(2)}</span>
                                    </li>
                                ))}
                                <li className="list-group-item d-flex justify-content-between align-items-center bg-light">
                                    <strong>Total Amount</strong>
                                    <strong className="text-success" style={{ fontSize: '1.2rem' }}>
                                        €{totalAmount.toFixed(2)}
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
                                    <div className="form-check mb-2">
                                        <input 
                                            className="form-check-input" 
                                            type="radio" 
                                            name="paymentMethod" 
                                            id="cod" 
                                            checked={paymentMethod === 'COD'} 
                                            onChange={() => setPaymentMethod('COD')} 
                                        />
                                        <label className="form-check-label" htmlFor="cod">
                                            <i className="fa-solid fa-money-bill-wave me-2"></i>
                                            Cash on Delivery
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input 
                                            className="form-check-input" 
                                            type="radio" 
                                            name="paymentMethod" 
                                            id="card" 
                                            checked={paymentMethod === 'Card'}
                                            onChange={() => setPaymentMethod('Card')} 
                                        />
                                        <label className="form-check-label" htmlFor="card">
                                            <i className="fa-solid fa-credit-card me-2"></i>
                                            Credit Card
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Credit Card Form */}
                            {paymentMethod === 'Card' && (
                                <div className="card bg-light mb-4">
                                    <div className="card-body">
                                        <h6 className="mb-3">Card Details</h6>
                                        <div className="form-group mb-3">
                                            <label className="form-label small">Card Number</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                name="cardNumber"
                                                placeholder="1234 5678 9012 3456"
                                                value={cardDetails.cardNumber}
                                                onChange={handleCardInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group mb-3">
                                            <label className="form-label small">Cardholder Name</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                name="cardName"
                                                placeholder="John Doe"
                                                value={cardDetails.cardName}
                                                onChange={handleCardInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="row">
                                            <div className="col-6">
                                                <div className="form-group mb-3">
                                                    <label className="form-label small">Expiry Date</label>
                                                    <input 
                                                        type="text" 
                                                        className="form-control" 
                                                        name="expiryDate"
                                                        placeholder="MM/YY"
                                                        value={cardDetails.expiryDate}
                                                        onChange={handleCardInputChange}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="form-group mb-3">
                                                    <label className="form-label small">CVV</label>
                                                    <input 
                                                        type="text" 
                                                        className="form-control" 
                                                        name="cvv"
                                                        placeholder="123"
                                                        value={cardDetails.cvv}
                                                        onChange={handleCardInputChange}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            <button 
                                onClick={handleProceed}
                                className="btn btn-primary btn-block w-100 btn-lg"
                                disabled={status === 'loading' || cartItems.length === 0}
                            >
                                Proceed to Verification
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Verification Modal */}
            {showModal && (
                <>
                    <div className="modal-backdrop fade show"></div>
                    <div className="modal fade show d-block" tabIndex="-1" role="dialog">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Verify Payment</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                                </div>
                                <div className="modal-body text-center">
                                    {isProcessing ? (
                                        <div className="py-4">
                                            <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                                                <span className="visually-hidden">Processing...</span>
                                            </div>
                                            <h5>Processing Payment...</h5>
                                            <p className="text-muted">Please wait while we process your card payment.</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="mb-3">
                                                <div style={{ fontSize: '3rem', color: '#28a745' }}>✓</div>
                                            </div>
                                            <h5>Confirm Your Order?</h5>
                                            <p className="text-muted mb-1">
                                                You are about to place an order via <strong>{paymentMethod === 'Card' ? 'Credit Card' : 'Cash on Delivery'}</strong>.
                                            </p>
                                            <h3 className="text-primary my-3">€{totalAmount.toFixed(2)}</h3>
                                            {paymentMethod === 'COD' ? (
                                                <p className="small text-muted">Please have the exact amount ready upon delivery.</p>
                                            ) : (
                                                <p className="small text-muted">Your card ending in {cardDetails.cardNumber.slice(-4)} will be charged.</p>
                                            )}
                                        </>
                                    )}
                                </div>
                                <div className="modal-footer">
                                    <button 
                                        type="button" 
                                        className="btn btn-secondary" 
                                        onClick={() => setShowModal(false)}
                                        disabled={status === 'loading' || isProcessing}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn btn-success px-4" 
                                        onClick={handleConfirmPayment}
                                        disabled={status === 'loading' || isProcessing}
                                    >
                                        {isProcessing ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Processing...
                                            </>
                                        ) : status === 'loading' ? (
                                            'Processing...'
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