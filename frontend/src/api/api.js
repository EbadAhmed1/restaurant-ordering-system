import axios from 'axios';
import store from '../store'; // Removed curly braces based on previous fix
import { logout } from '../features/auth/authSlice';

const apiClient = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

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

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // CHANGED: Check if error.response exists before accessing properties
        if (error.response) {
            const { status } = error.response;
            if (status === 401 || status === 403) {
                store.dispatch(logout()); 
            }
        } else {
            // Network error or Server down (no response received)
            console.error("Network Error or Server is down:", error.message);
        }
        return Promise.reject(error);
    }
);

export default apiClient;