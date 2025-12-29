import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { FaShoppingCart, FaUser, FaUtensils, FaTachometerAlt, FaShoppingBag, FaCalendarAlt, FaSignOutAlt } from 'react-icons/fa';
import './Header.css';

const Header = () => {
    const { isAuthenticated, user } = useSelector(state => state.auth);
    const { totalQuantity } = useSelector(state => state.cart); 
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    return (
        <header className="main-header">
            <div className="header-container">
                {/* Logo */}
                <Link className="header-logo" to="/">
                    <FaUtensils className="logo-icon" />
                    <span className="logo-text">OrderHub</span>
                </Link>
                
                {/* Navigation */}
                <nav className="header-nav">
                    <NavLink to="/" className="nav-link">Home</NavLink>
                    <NavLink to="/menu" className="nav-link">Menu</NavLink>
                    <NavLink to="/reservations" className="nav-link">Reservations</NavLink>
                    <NavLink to="/orders/history" className="nav-link">Orders</NavLink>
                </nav>

                {/* Right Side Actions */}
                <div className="header-actions">
                    <NavLink to="/cart" className="cart-link">
                        <FaShoppingCart />
                        {totalQuantity > 0 && (
                            <span className="cart-badge">{totalQuantity}</span>
                        )}
                    </NavLink>
                    
                    {isAuthenticated ? (
                        <div className="user-menu">
                            <button className="user-btn">
                                <FaUser />
                            </button>
                            <div className="user-dropdown">
                                <div className="dropdown-header">
                                    <p className="user-name">{user?.username}</p>
                                    <p className="user-email">{user?.email}</p>
                                </div>
                                {user?.role === 'admin' && (
                                    <Link to="/admin/dashboard" className="dropdown-item">
                                        <FaTachometerAlt />
                                        <span>Admin Panel</span>
                                    </Link>
                                )}
                                <Link to="/orders/history" className="dropdown-item">
                                    <FaShoppingBag />
                                    <span>My Orders</span>
                                </Link>
                                <Link to="/reservations" className="dropdown-item">
                                    <FaCalendarAlt />
                                    <span>My Reservations</span>
                                </Link>
                                <button onClick={handleLogout} className="dropdown-item logout">
                                    <FaSignOutAlt />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <Link to="/login" className="login-btn">
                            <FaUser />
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;