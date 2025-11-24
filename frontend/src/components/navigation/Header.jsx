import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom'; // Keep both imports
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/authSlice';

const Header = () => {
    const { isAuthenticated, user } = useSelector(state => state.auth);
    const { totalQuantity } = useSelector(state => state.cart); 
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    // Custom style for interactive links
    const navLinkStyle = ({ isActive }) => ({
        transition: 'color 0.3s ease',
        color: isActive ? '#ffc107' : 'rgba(255,255,255,0.8)', 
        fontWeight: isActive ? 'bold' : 'normal'
    });

    return (
        <header className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow">
            <div className="container-fluid px-4">
                <Link className="navbar-brand fw-bold fs-3 text-white" to="/" style={{ letterSpacing: '1px' }}>
                    OrderHub
                </Link>
                
                <button 
                    className="navbar-toggler" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarContent" 
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                
                <div className="collapse navbar-collapse" id="navbarContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/menu" style={navLinkStyle}>Menu</NavLink>
                        </li>
                        {user?.role === 'admin' && (
                            <li className="nav-item">
                                <NavLink className="nav-link text-warning" to="/admin/dashboard" style={{fontWeight: 'bold'}}>Admin Panel</NavLink>
                            </li>
                        )}
                    </ul>

                    <ul className="navbar-nav ms-auto align-items-center">
                        <li className="nav-item me-4">
                            <NavLink className="nav-link position-relative d-flex align-items-center" to="/cart" style={navLinkStyle}>
                                <div className="position-relative me-2">
                                    <i className="fa-solid fa-cart-shopping fa-lg"></i>
                                    {totalQuantity > 0 && (
                                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem', border: '2px solid #343a40' }}>
                                            {totalQuantity}
                                        </span>
                                    )}
                                </div>
                                <span>Cart</span>
                            </NavLink>
                        </li>
                        
                        {isAuthenticated ? (
                            <>
                                <li className="nav-item me-3 d-flex align-items-center">
                                    <span className="nav-link text-light" style={{ cursor: 'default' }}>
                                        Hello, <strong>{user?.username}</strong>
                                    </span>
                                </li>
                                <li className="nav-item me-3">
                                    <NavLink className="nav-link" to="/orders/history" style={navLinkStyle}>My Orders</NavLink>
                                </li>
                                <li className="nav-item">
                                    <button 
                                        className="btn btn-sm btn-outline-danger px-3 rounded-pill" 
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                {/* --- FIXED: Changed Link to NavLink here --- */}
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/login" style={navLinkStyle}>Login</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/register" style={navLinkStyle}>Register</NavLink>
                                </li>
                                {/* ----------------------------------------- */}
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </header>
    );
};

export default Header;