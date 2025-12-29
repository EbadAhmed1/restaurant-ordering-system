import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMenu } from '../../features/menu/menuSlice';
import { FaSearch, FaClock, FaCreditCard, FaStar, FaHeart } from 'react-icons/fa';
import './Home.css';

const Home = () => {
    const dispatch = useDispatch();
    const { items } = useSelector((state) => state.menu);

    useEffect(() => {
        dispatch(fetchMenu());
    }, [dispatch]);

    const getImageUrl = (imagePath) => {
        if (!imagePath) return 'https://placehold.co/400x300?text=No+Image';
        let cleanPath = imagePath.replace(/\\/g, '/');
        if (!cleanPath.startsWith('/')) cleanPath = `/${cleanPath}`;
        if (!cleanPath.startsWith('/public')) cleanPath = `/public${cleanPath}`;
        return `http://localhost:4500${cleanPath}`;
    };

    const popularItems = items.slice(0, 3);
    const testimonials = [
        {
            name: 'John Johnson',
            rating: 5,
            text: 'The food is always fresh and delicious! Delivery is fast too. My favorite place to order dinner.',
            avatar: 'JJ'
        },
        {
            name: 'Michael Chen',
            rating: 5,
            text: 'Amazing variety and quality is consistently excellent. The app makes ordering so easy!',
            avatar: 'MC'
        },
        {
            name: 'Emily Davis',
            rating: 5,
            text: 'Best restaurant experience! Great food, fast delivery and excellent customer service!',
            avatar: 'ED'
        }
    ];

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <h1 className="hero-title">Delicious Food, Delivered Fast</h1>
                    <p className="hero-subtitle">Order your favorite meals in minutes</p>
                    <div className="hero-buttons">
                        <Link to="/menu" className="btn-hero primary">ORDER NOW</Link>
                        <Link to="/menu" className="btn-hero secondary">VIEW MENU</Link>
                    </div>
                    <div className="hero-search">
                        <FaSearch className="search-icon" />
                        <input 
                            style={{ paddingLeft: '50px' }}
                            type="text" 
                            placeholder="Search for food..." 
                            className="search-input"
                        />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">
                                <FaSearch />
                            </div>
                            <h3>Wide Selection</h3>
                            <p>Over 100+ dishes to choose from</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">
                                <FaClock />
                            </div>
                            <h3>Fast Delivery</h3>
                            <p>Get your food in 30 minutes</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">
                                <FaCreditCard />
                            </div>
                            <h3>Secure Payment</h3>
                            <p>Multiple payment options available</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Popular Items Section */}
            <section className="popular-section">
                <div className="container">
                    <div className="section-header">
                        <h2>Popular Items</h2>
                        <p>Our customers' favorites</p>
                    </div>
                    <div className="popular-grid">
                        {popularItems.map((item) => (
                            <div key={item.id} className="food-card">
                                <div className="food-card-image-wrapper">
                                    <img 
                                        src={getImageUrl(item.imageUrl)} 
                                        alt={item.name}
                                        className="food-card-image"
                                    />
                                    <button className="favorite-btn">
                                        <FaHeart />
                                    </button>
                                    <span className="food-badge">Popular</span>
                                </div>
                                <div className="food-card-content">
                                    <span className="food-category">{item.category}</span>
                                    <h3 className="food-name">{item.name}</h3>
                                    <div className="food-rating">
                                        <FaStar className="star" />
                                        <span>4.{Math.floor(Math.random() * 9)}</span>
                                        <span className="reviews">({Math.floor(Math.random() * 500) + 100} reviews)</span>
                                    </div>
                                    <div className="food-footer">
                                        <span className="food-price">${parseFloat(item.price).toFixed(2)}</span>
                                        <button className="btn-add">Add</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="view-all-wrapper">
                        <Link to="/menu" className="btn-view-all">VIEW ALL ITEMS</Link>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works-section">
                <div className="container">
                    <div className="section-header">
                        <h2>How It Works</h2>
                        <p>Order in 4 simple steps</p>
                    </div>
                    <div className="steps-grid">
                        <div className="step-card">
                            <div className="step-number">1</div>
                            <h3>Browse Menu</h3>
                            <p>Explore our menu selections</p>
                        </div>
                        <div className="step-card">
                            <div className="step-number">2</div>
                            <h3>Add to Cart</h3>
                            <p>Choose your favorites</p>
                        </div>
                        <div className="step-card">
                            <div className="step-number">3</div>
                            <h3>Checkout</h3>
                            <p>Review your order and proceed</p>
                        </div>
                        <div className="step-card">
                            <div className="step-number">4</div>
                            <h3>Enjoy</h3>
                            <p>Track order and wait</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="testimonials-section">
                <div className="container">
                    <div className="section-header">
                        <h2>What Our Customers Say</h2>
                        <p>Real reviews from real people</p>
                    </div>
                    <div className="testimonials-grid">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="testimonial-card">
                                <div className="testimonial-header">
                                    <div className="testimonial-avatar">{testimonial.avatar}</div>
                                    <div>
                                        <h4>{testimonial.name}</h4>
                                        <div className="testimonial-rating">
                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                <FaStar key={i} className="star" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <p className="testimonial-text">{testimonial.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="home-footer">
                <div className="container">
                    <div className="footer-grid">
                        <div className="footer-col">
                            <h3>About Us</h3>
                            <p>OrderHub delivers fresh and delicious food right to your door. We're passionate about quality and service.</p>
                        </div>
                        <div className="footer-col">
                            <h3>Quick Links</h3>
                            <ul>
                                <li><Link to="/menu">Menu</Link></li>
                                <li><Link to="/reservations">Reservations</Link></li>
                                <li><Link to="/orders">Orders</Link></li>
                            </ul>
                        </div>
                        <div className="footer-col">
                            <h3>Contact</h3>
                            <p>123 Food Street, NY</p>
                            <p>(555) 123-4567</p>
                            <p>hello@orderhub.com</p>
                        </div>
                        <div className="footer-col">
                            <h3>Newsletter</h3>
                            <p>Subscribe for special offers</p>
                            <div className="newsletter-form">
                                <input type="email" placeholder="Your email" />
                                <button>Subscribe</button>
                            </div>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>© 2025 OrderHub. All rights reserved. | Privacy Policy | Terms of Service</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
