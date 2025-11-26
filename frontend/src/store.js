import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import cartReducer from './features/cart/cartSlice';
import menuReducer from './features/menu/menuSlice';
import orderReducer from './features/orders/orderSlice';
import reservationReducer from './features/reservations/reservationSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartReducer, 
        menu: menuReducer, 
        orders: orderReducer,
        reservations: reservationReducer,
    },
});

export default store;