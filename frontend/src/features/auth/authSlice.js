import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// --- Configuration ---
// Base URL for your Node/Express API authentication routes
const API_URL = 'http://localhost:8000/api/auth/';

// Check localStorage for persisted user/token on app startup
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));

// Initial State
const initialState = {
    token: token ? token : null,
    user: user ? user : null,
    isAuthenticated: !!token, // True if token exists
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
};

// --- Async Thunks (API Interaction) ---

// Async Thunk for User Registration
export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (userData, thunkAPI) => {
        try {
            const response = await axios.post(API_URL + 'register', userData);
            // Backend returns { token, user } on success
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message || error.toString();
            // Reject the thunk with the error message
            return thunkAPI.rejectWithValue(message); 
        }
    }
);

// Async Thunk for User Login
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials, thunkAPI) => {
        try {
            const response = await axios.post(API_URL + 'login', credentials);
            // Backend returns { token, user } on success
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// --- Auth Slice ---

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Reducer to handle logout (clears state and local storage)
        logout: (state) => {
            state.token = null;
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            state.status = 'idle';
            state.error = null;
        },
        // Reducer to clear any previous errors manually
        clearError: (state) => {
            state.error = null;
            state.status = 'idle';
        },
    },
    extraReducers: (builder) => {
        builder
            // --- Register Cases ---
            .addCase(registerUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.token = action.payload.token;
                state.user = action.payload.user;
                state.isAuthenticated = true;
                // Persist token and user profile to local storage
                localStorage.setItem('token', action.payload.token);
                localStorage.setItem('user', JSON.stringify(action.payload.user));
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Registration failed';
                state.token = null;
                state.user = null;
                state.isAuthenticated = false;
            })
            // --- Login Cases ---
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.token = action.payload.token;
                state.user = action.payload.user;
                state.isAuthenticated = true;
                // Persist token and user profile to local storage
                localStorage.setItem('token', action.payload.token);
                localStorage.setItem('user', JSON.stringify(action.payload.user));
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Login failed';
                state.token = null;
                state.user = null;
                state.isAuthenticated = false;
            });
    },
});

export const { logout, clearError } = authSlice.actions;

export default authSlice.reducer;