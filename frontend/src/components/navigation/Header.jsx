import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/authSlice';

const Header = () => {
    const { isAuthenticated, user } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <header className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">
                    Luigi's Pizzeria
                </Link>
                
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link" to="/menu">Menu</Link>
                        </li>
                        {user?.role === 'admin' && (
                            <li className="nav-item">
                                <Link className="nav-link text-warning" to="/admin/dashboard">Admin Panel</Link>
                            </li>
                        )}
                    </ul>

                    {/* Right-aligned Navigation (Auth and Cart) */}
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/cart">
                                <i className="fa fa-shopping-cart me-2"></i>
                                Cart (0) {/* Dynamically update cart count later */}
                            </Link>
                        </li>
                        
                        {isAuthenticated ? (
                            <>
                                <li className="nav-item">
                                    <span className="nav-link text-white">
                                        Welcome, {user?.username || 'User'}
                                    </span>
                                </li>
                                <li className="nav-item">
                                    <button 
                                        className="btn btn-outline-danger btn-sm" 
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/register">Register</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </header>
    );
};

export default Header;