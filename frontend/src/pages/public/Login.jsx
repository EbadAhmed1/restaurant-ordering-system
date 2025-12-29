import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, clearError } from '../../features/auth/authSlice';
import { toast } from 'react-toastify';
import { FaUtensils, FaEnvelope, FaLock, FaGoogle, FaFacebook } from 'react-icons/fa';
import foodImage from '../../assets/images/slider_1_1920_1200.jpg';
import './Auth.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { isAuthenticated, status, error } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/'); 
        }

        if (status === 'failed' && error) {
            toast.error(error);
            dispatch(clearError());
        }
    }, [isAuthenticated, status, error, navigate, dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser({ email, password }));
    };

    return (
        <div className="auth-container">
            <div className="auth-left">
                <img src={foodImage} alt="Delicious food" />
                <div className="auth-overlay">
                    <h1>Welcome Back!</h1>
                    <p>Login to access your favorite meals</p>
                </div>
            </div>
            
            <div className="auth-right">
                <div className="auth-form-wrapper">
                    <div className="auth-logo">
                        <FaUtensils className="logo-icon" />
                        <h2>OrderHub</h2>
                    </div>
                    
                    <div className="auth-header">
                        <h3>Welcome Back!</h3>
                        <p>Login to your account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label>Email</label>
                            <div className="input-with-icon">
                                <FaEnvelope className="input-icon" />
                                <input
                                    type="email"
                                    placeholder="you-email@domain.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <div className="input-with-icon">
                                <FaLock className="input-icon" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-options">
                            <label className="remember-me">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <span>Remember me</span>
                            </label>
                            <Link to="/forgot-password" className="forgot-link">
                                Forgot Password?
                            </Link>
                        </div>

                        <button 
                            type="submit" 
                            className="auth-submit-btn" 
                            disabled={status === 'loading'}
                        >
                            {status === 'loading' ? 'Logging in...' : 'LOGIN'}
                        </button>
                    </form>

                    <div className="auth-divider">
                        <span>Or</span>
                    </div>

                    <div className="social-login">
                        <button className="social-btn google-btn">
                            <FaGoogle /> Continue with Google
                        </button>
                        <button className="social-btn facebook-btn">
                            <FaFacebook /> Continue with Facebook
                        </button>
                    </div>

                    <div className="auth-footer">
                        <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;