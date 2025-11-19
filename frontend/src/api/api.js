import axios from 'axios';
import store from '../store';
import { logout } from '../features/auth/authSlice';

// Create a configured Axios instance
const apiClient = axios.create({
    // Since React app and Express API run on different ports (e.g., 3000 and 8000), 
    // we use the backend port for the base URL.
    baseURL: 'http://localhost:8000/api', 
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach JWT token to headers for protected routes
apiClient.interceptors.request.use(
    (config) => {
        const token = store.getState().auth.token;
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle 401 (Unauthorized) errors globally
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const { status } = error.response;
        if (status === 401 || status === 403) {
            // If the token is invalid, expired, or user is unauthorized (403), log them out
            store.dispatch(logout()); 
            // Optional: Add a toast notification here later
        }
        return Promise.reject(error);
    }
);

export default apiClient;