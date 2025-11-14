import axios from 'axios';
import { store } from '../store';
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