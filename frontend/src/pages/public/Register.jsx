import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, clearError } from '../../features/auth/authSlice';
import { toast } from 'react-toastify';
import { FaUtensils, FaUser, FaEnvelope, FaLock, FaGoogle, FaFacebook } from 'react-icons/fa';
import foodImage from '../../assets/images/slider_2_1920_600.jpg';
import './Auth.css';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [agreeTerms, setAgreeTerms] = useState(false);

    const { username, email, password, confirmPassword } = formData;

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, status, error } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/menu');
        }
        if (status === 'failed' && error) {
            toast.error(error);
            dispatch(clearError());
        }
    }, [isAuthenticated, status, error, navigate, dispatch]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        if (!agreeTerms) {
            toast.error("Please agree to the Terms & Conditions");
            return;
        }
        dispatch(registerUser({ username, email, password }));
    };

    return (
        <div className="auth-container">
            <div className="auth-left">
                <img src={foodImage} alt="Delicious food" />
                <div className="auth-overlay">
                    <h1>Hello, Friend!</h1>
                    <p>Create an account and start ordering delicious food</p>
                </div>
            </div>
            
            <div className="auth-right">
                <div className="auth-form-wrapper">
                    <div className="auth-logo">
                        <FaUtensils className="logo-icon" />
                        <h2>OrderHub</h2>
                    </div>
                    
                    <div className="auth-header">
                        <h3>Create Account</h3>
                        <p>Sign up to get started</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label>Username</label>
                            <div className="input-with-icon">
                                <FaUser className="input-icon" />
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="username"
                                    value={username}
                                    onChange={onChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <div className="input-with-icon">
                                <FaEnvelope className="input-icon" />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="you-email@domain.com"
                                    value={email}
                                    onChange={onChange}
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
                                    name="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={onChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Confirm Password</label>
                            <div className="input-with-icon">
                                <FaLock className="input-icon" />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={onChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-options">
                            <label className="remember-me">
                                <input
                                    type="checkbox"
                                    checked={agreeTerms}
                                    onChange={(e) => setAgreeTerms(e.target.checked)}
                                />
                                <span>I agree to the Terms & Conditions</span>
                            </label>
                        </div>

                        <button 
                            type="submit" 
                            className="auth-submit-btn" 
                            disabled={status === 'loading'}
                        >
                            {status === 'loading' ? 'Creating Account...' : 'CREATE ACCOUNT'}
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
                        <p>Already have an account? <Link to="/login">Login</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;