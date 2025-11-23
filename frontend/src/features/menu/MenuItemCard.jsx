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

        // 4. Return full URL with correct Backend Port (5000)
        return `http://localhost:5000${cleanPath}`;
    };

    const handleAddToCart = () => {
        dispatch(addItemToCart(item));
        toast.success(`${item.name} added to cart!`);
    };

    return (
        <div className="col-lg-4 col-md-6 mb-4">
            <div className="card h-100 shadow-sm">
                <img 
                    className="card-img-top" 
                    src={getImageUrl(item.imageUrl)} 
                    alt={item.name} 
                    style={{ height: '200px', objectFit: 'cover' }}
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    // onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }} 
                />
                <div className="card-body d-flex flex-column">
                    <h5 className="card-title text-center">{item.name}</h5>
                    <p className="card-text text-muted flex-grow-1">
                        {item.description ? item.description.substring(0, 70) + '...' : 'Fresh and delicious!'}
                    </p>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                        <h4 className="text-success mb-0">
                            €{parseFloat(item.price).toFixed(2)}
                        </h4>
                        <button 
                            className="btn btn-primary btn-sm"
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