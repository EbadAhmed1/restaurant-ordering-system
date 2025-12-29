import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMenu } from '../../features/menu/menuSlice';
import { addItemToCart } from '../../features/cart/cartSlice';
import { toast } from 'react-toastify';
import { FaSearch, FaStar, FaHeart } from 'react-icons/fa';
import './Menu.css';

const PLACEHOLDER_IMAGE = 'https://placehold.co/600x400?text=No+Image';

const Menu = () => {
    const dispatch = useDispatch();
    const { items, status, error } = useSelector((state) => state.menu);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Items');
    const [priceRange, setPriceRange] = useState([0, 100]);
    const [selectedRating, setSelectedRating] = useState('All Ratings');
    const [dietaryFilter, setDietaryFilter] = useState([]);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchMenu());
        }
    }, [status, dispatch]);

    const getImageUrl = (imagePath) => {
        if (!imagePath) return PLACEHOLDER_IMAGE;
        let cleanPath = imagePath.replace(/\\/g, '/');
        if (!cleanPath.startsWith('/')) cleanPath = `/${cleanPath}`;
        if (!cleanPath.startsWith('/public')) cleanPath = `/public${cleanPath}`;
        return `http://localhost:4500${cleanPath}`;
    };

    const handleAddToCart = (item) => {
        dispatch(addItemToCart(item));
        toast.success(`${item.name} added to cart!`);
    };

    const categories = ['All Items', 'Pizza', 'Burger', 'Pasta', 'Salad', 'Sides', 'Drinks', 'Dessert'];
    const ratings = ['All Ratings', '4+ Stars', '3+ Stars'];
    const dietaryOptions = ['Vegetarian', 'Gluten Free', 'Dairy Free', 'Vegan'];

    const filteredItems = items.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All Items' || item.category === selectedCategory;
        const matchesPrice = parseFloat(item.price) >= priceRange[0] && parseFloat(item.price) <= priceRange[1];
        return matchesSearch && matchesCategory && matchesPrice;
    });

    if (status === 'loading') {
        return (
            <div className="menu-page">
                <div className="container">
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading delicious items...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (status === 'failed') {
        return (
            <div className="menu-page">
                <div className="container">
                    <div className="error-state">Error: {error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="menu-page">
            <div className="container">
                {/* Search Bar */}
                <div className="search-section">
                    <div className="search-bar">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search for dishes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Category Tabs */}
                <div className="category-tabs">
                    {categories.map(category => (
                        <button
                            key={category}
                            className={`category-tab ${selectedCategory === category ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                <div className="menu-layout">
                    {/* Filters Sidebar */}
                    <aside className="filters-sidebar">
                        <h3>Filters</h3>

                        {/* Price Range */}
                        <div className="filter-section">
                            <h4>Price Range</h4>
                            <div className="price-range">
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={priceRange[1]}
                                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                                    className="range-slider"
                                />
                                <div className="price-labels">
                                    <span>${priceRange[0]}</span>
                                    <span>${priceRange[1]}</span>
                                </div>
                            </div>
                        </div>

                        {/* Dietary */}
                        <div className="filter-section">
                            <h4>Dietary</h4>
                            {dietaryOptions.map(option => (
                                <label key={option} className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={dietaryFilter.includes(option)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setDietaryFilter([...dietaryFilter, option]);
                                            } else {
                                                setDietaryFilter(dietaryFilter.filter(f => f !== option));
                                            }
                                        }}
                                    />
                                    <span>{option}</span>
                                </label>
                            ))}
                        </div>

                        {/* Rating */}
                        <div className="filter-section">
                            <h4>Rating</h4>
                            {ratings.map(rating => (
                                <label key={rating} className="radio-label">
                                    <input
                                        type="radio"
                                        name="rating"
                                        checked={selectedRating === rating}
                                        onChange={() => setSelectedRating(rating)}
                                    />
                                    <span>{rating}</span>
                                </label>
                            ))}
                        </div>

                        <button className="clear-filters-btn">Clear Filters</button>
                    </aside>

                    {/* Menu Grid */}
                    <div className="menu-content">
                        <div className="menu-header">
                            <p className="results-count">Showing {filteredItems.length} items</p>
                        </div>

                        {filteredItems.length === 0 ? (
                            <div className="no-results">
                                <p>No items found matching your criteria</p>
                            </div>
                        ) : (
                            <div className="menu-grid">
                                {filteredItems.map(item => (
                                    <div key={item.id} className="menu-item-card">
                                        <div className="item-image-wrapper">
                                            <img
                                                src={getImageUrl(item.imageUrl)}
                                                alt={item.name}
                                                className="item-image"
                                                referrerPolicy="no-referrer"
                                                crossOrigin="anonymous"
                                            />
                                            <button className="favorite-btn">
                                                <FaHeart />
                                            </button>
                                            {!item.isAvailable && (
                                                <span className="sold-out-badge">Sold Out</span>
                                            )}
                                            {item.isAvailable && Math.random() > 0.7 && (
                                                <span className="popular-badge">Popular</span>
                                            )}
                                        </div>
                                        <div className="item-content">
                                            <div className="item-header">
                                                <span className="item-category">{item.category}</span>
                                            </div>
                                            <h3 className="item-name">{item.name}</h3>
                                            <div className="item-rating">
                                                <FaStar className="star" />
                                                <span>4.{Math.floor(Math.random() * 9)}</span>
                                                <span className="reviews">({Math.floor(Math.random() * 500) + 50} reviews)</span>
                                            </div>
                                            <div className="item-footer">
                                                <span className="item-price">${(parseFloat(item.price) || 0).toFixed(2)}</span>
                                                <button
                                                    className="add-to-cart-btn"
                                                    onClick={() => handleAddToCart(item)}
                                                    disabled={!item.isAvailable}
                                                >
                                                    Add
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Menu;
