import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, clearError } from '../../features/auth/authSlice';
import { toast } from 'react-toastify';

const Register = () => {
    // Local state for form fields
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const { username, email, password, confirmPassword } = formData;

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, status, error } = useSelector((state) => state.auth);

    // Redirect if already logged in
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
        // Dispatch the register action
        dispatch(registerUser({ username, email, password }));
    };

    return (
        <div className="wrapper">
             <div id="formContent" className="p-4">
                <h2 className="active">Sign Up</h2>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-3">
                        <input 
                            type="text" 
                            className="form-control" 
                            name="username" 
                            value={username} 
                            onChange={onChange} 
                            placeholder="Username" 
                            required 
                        />
                    </div>
                    <div className="form-group mb-3">
                        <input 
                            type="email" 
                            className="form-control" 
                            name="email" 
                            value={email} 
                            onChange={onChange} 
                            placeholder="Email Address" 
                            required 
                        />
                    </div>
                    <div className="form-group mb-3">
                        <input 
                            type="password" 
                            className="form-control" 
                            name="password" 
                            value={password} 
                            onChange={onChange} 
                            placeholder="Password (min 6 chars)" 
                            required 
                        />
                    </div>
                    <div className="form-group mb-4">
                        <input 
                            type="password" 
                            className="form-control" 
                            name="confirmPassword" 
                            value={confirmPassword} 
                            onChange={onChange} 
                            placeholder="Confirm Password" 
                            required 
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="btn btn-primary btn-block" 
                        disabled={status === 'loading'}
                    >
                        {status === 'loading' ? 'Registering...' : 'Register'}
                    </button>
                </form>

                <div id="formFooter">
                    <p>Already have an account? <Link to="/login" className="text-primary">Log In</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register; // This Default Export is critical!