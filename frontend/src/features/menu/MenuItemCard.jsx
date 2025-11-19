import React from 'react';
import { useDispatch } from 'react-redux';
import { addItemToCart } from '../cart/cartSlice';
import { toast } from 'react-toastify';

// Fallback image if the product doesn't have one
// You can place a real image at src/assets/images/default.jpg
const PLACEHOLDER_IMAGE = 'https://placehold.co/600x400?text=Delicious+Food'; 

const MenuItemCard = ({ item }) => {
    const dispatch = useDispatch();

    // Helper to construct the full image URL from the backend
    const getImageUrl = (imagePath) => {
        if (!imagePath) return PLACEHOLDER_IMAGE;
        // If the path in DB is like "/uploads/...", prepend backend URL
        // Adjust 'http://localhost:8000' if your port is different
        return `http://localhost:8000${imagePath}`;
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
                    onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }} // Fallback on error
                />
                <div className="card-body d-flex flex-column">
                    <h5 className="card-title text-center">{item.name}</h5>
                    <p className="card-text text-muted flex-grow-1">
                        {/* Show description or default text */}
                        {item.description ? item.description.substring(0, 70) + '...' : 'Tasty and fresh!'}
                    </p>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                        {/* Display Price */}
                        <h4 className="text-success mb-0">
                            Rs. {parseFloat(item.price).toFixed(2)}
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