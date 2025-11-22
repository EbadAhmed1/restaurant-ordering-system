import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// Import the centralized API client
import apiClient from '../../api/api';

const initialState = {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
};

// Async Thunk to fetch all available menu items
// Connects to GET /api/menu
export const fetchMenu = createAsyncThunk(
    'menu/fetchMenu',
    async (_, thunkAPI) => {
        try {
            // apiClient already has baseURL set to 'http://localhost:8000/api'
            const response = await apiClient.get('/menu'); 
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message || error.toString();
            return thunkAPI.rejectWithValue(message); 
        }
    }
);

export const menuSlice = createSlice({
    name: 'menu',
    initialState,
    reducers: {
        // Reducer to manually set or clear menu state if needed
        clearMenu: (state) => {
            state.items = [];
            state.status = 'idle';
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMenu.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchMenu.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchMenu.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export const { clearMenu } = menuSlice.actions;

export default menuSlice.reducer;