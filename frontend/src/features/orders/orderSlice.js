import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/api';
import { clearCart } from '../cart/cartSlice'; // To clear cart after success

const initialState = {
    orders: [],
    currentOrder: null,
    status: 'idle',
    error: null,
};

// Async Thunk to Place Order
export const placeOrder = createAsyncThunk(
    'orders/placeOrder',
    async (orderData, { rejectWithValue, dispatch }) => {
        try {
            // Backend expects: { items: [{ menuId, quantity }] }
            const response = await apiClient.post('/orders', orderData);
            
            // If successful, clear the local cart
            dispatch(clearCart());
            
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return rejectWithValue(message);
        }
    }
);

const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        resetOrderStatus: (state) => {
            state.status = 'idle';
            state.error = null;
            state.currentOrder = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(placeOrder.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(placeOrder.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentOrder = action.payload.order;
            })
            .addCase(placeOrder.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export const { resetOrderStatus } = orderSlice.actions;
export default orderSlice.reducer;