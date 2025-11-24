import React from 'react';
import { useDispatch } from 'react-redux';
import { addItemToCart } from '../cart/cartSlice';
import { toast } from 'react-toastify';

// Fallback image if the product doesn't have one
const PLACEHOLDER_IMAGE = 'https://placehold.co/600x400?text=No+Image'; 

const MenuItemCard = ({ item }) => {
    const dispatch = useDispatch();

    // Helper to construct the full image URL from the backend
    const getImageUrl = (imagePath) => {
        if (!imagePath) return PLACEHOLDER_IMAGE;

        // 1. Clean up Windows slashes to forward slashes
        let cleanPath = imagePath.replace(/\\/g, '/');

        // 2. Ensure it starts with a slash
        if (!cleanPath.startsWith('/')) {
            cleanPath = `/${cleanPath}`;
        }

        // 3. Prepend '/public' if it's missing (because DB usually stores /uploads/...)
        if (!cleanPath.startsWith('/public')) {
            cleanPath = `/public${cleanPath}`;
        }

        // 4. Return full URL with correct Backend Port (4500)
        return `http://localhost:4500${cleanPath}`;
    };

    const handleAddToCart = () => {
        dispatch(addItemToCart(item));
        toast.success(`${item.name} added to cart!`);
    };

    return (
        <div className="col-lg-4 col-md-6 mb-3">
            <div className="card shadow-sm">
                <img 
                    className="card-img-top" 
                    src={getImageUrl(item.imageUrl)} 
                    alt={item.name} 
                    style={{ height: '120px', objectFit: 'cover' }}
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    // onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }} 
                />
                <div className="card-body py-2 px-3">
                    <h6 className="card-title text-center mb-1">{item.name}</h6>
                    <p className="card-text text-muted small mb-2" style={{ fontSize: '0.85rem', lineHeight: '1.3' }}>
                        {item.description ? item.description.substring(0, 35) + '...' : '121...'}
                    </p>
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="text-success mb-0" style={{ fontSize: '1.1rem' }}>
                            €{parseFloat(item.price).toFixed(2)}
                        </h5>
                        <button 
                            className="btn btn-primary btn-sm px-2 py-1"
                            style={{ fontSize: '0.85rem' }}
                            onClick={handleAddToCart}
                            disabled={!item.isAvailable}
                        >
                            {item.isAvailable ? 'Add to Cart' : 'Sold Out'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MenuItemCard;