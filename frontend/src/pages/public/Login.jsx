import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, clearError } from '../../features/auth/authSlice';
import { toast } from 'react-toastify';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { isAuthenticated, status, error, user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            // Redirect based on role after successful login
            if (user && user.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/menu');
            }
        }

        if (status === 'failed' && error) {
            toast.error(error);
            dispatch(clearError());
        }
    }, [isAuthenticated, status, error, navigate, dispatch, user]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser({ email, password }));
    };

    return (
        <div className="wrapper">
            <div id="formContent" className="p-4">
                <h2 className="active">Log In</h2>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-4">
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group mb-4">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className="btn btn-primary btn-block" 
                        disabled={status === 'loading'}
                    >
                        {status === 'loading' ? 'Logging in...' : 'Log In'}
                    </button>
                </form>

                <div id="formFooter">
                    <p>Don't have an account? <Link to="/register" className="text-primary">Sign Up</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;