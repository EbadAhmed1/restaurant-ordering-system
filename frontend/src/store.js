import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import cartReducer from './features/cart/cartSlice';
import menuReducer from './features/menu/menuSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartReducer, 
        menu: menuReducer, 
    },
});

export default store;