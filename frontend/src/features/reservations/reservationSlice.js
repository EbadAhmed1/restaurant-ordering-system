import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/api';

export const createReservation = createAsyncThunk(
    'reservations/create',
    async (reservationData, { rejectWithValue }) => {
        try {
            const response = await apiClient.post('/reservations', reservationData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create reservation');
        }
    }
);

export const fetchMyReservations = createAsyncThunk(
    'reservations/fetchMy',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get('/reservations/my-reservations');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch reservations');
        }
    }
);

export const fetchAllReservations = createAsyncThunk(
    'reservations/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get('/reservations/all');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch reservations');
        }
    }
);

export const cancelReservation = createAsyncThunk(
    'reservations/cancel',
    async (id, { rejectWithValue }) => {
        try {
            await apiClient.delete(`/reservations/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to cancel reservation');
        }
    }
);

export const updateReservationStatus = createAsyncThunk(
    'reservations/updateStatus',
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const response = await apiClient.put(`/reservations/${id}/status`, { status });
            return response.data.reservation;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update status');
        }
    }
);

const reservationSlice = createSlice({
    name: 'reservations',
    initialState: {
        reservations: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createReservation.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createReservation.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.reservations.unshift(action.payload.reservation);
            })
            .addCase(createReservation.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(fetchMyReservations.fulfilled, (state, action) => {
                state.reservations = action.payload;
                state.status = 'succeeded';
            })
            .addCase(fetchAllReservations.fulfilled, (state, action) => {
                state.reservations = action.payload;
                state.status = 'succeeded';
            })
            .addCase(cancelReservation.fulfilled, (state, action) => {
                const reservation = state.reservations.find(r => r.id === action.payload);
                if (reservation) {
                    reservation.status = 'Cancelled';
                }
            })
            .addCase(updateReservationStatus.fulfilled, (state, action) => {
                const index = state.reservations.findIndex(r => r.id === action.payload.id);
                if (index !== -1) {
                    state.reservations[index] = action.payload;
                }
            });
    },
});

export default reservationSlice.reducer;
