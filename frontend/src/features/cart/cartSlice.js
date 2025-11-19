import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    cartItems: [], // Array of { ...menuItem, quantity }
    totalQuantity: 0,
    totalAmount: 0,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItemToCart: (state, action) => {
            const newItem = action.payload;
            const existingItem = state.cartItems.find(item => item.id === newItem.id);

            if (!existingItem) {
                // Add new item with quantity 1
                state.cartItems.push({
                    id: newItem.id,
                    name: newItem.name,
                    price: newItem.price,
                    imageUrl: newItem.imageUrl,
                    quantity: 1,
                });
            } else {
                // Increment quantity if already in cart
                existingItem.quantity++;
            }
            
            state.totalQuantity++;
            state.totalAmount += parseFloat(newItem.price);
        },
        removeItemFromCart: (state, action) => {
            const id = action.payload;
            const existingItem = state.cartItems.find(item => item.id === id);

            if (existingItem) {
                state.totalQuantity--;
                state.totalAmount -= parseFloat(existingItem.price);
                
                if (existingItem.quantity === 1) {
                    state.cartItems = state.cartItems.filter(item => item.id !== id);
                } else {
                    existingItem.quantity--;
                }
            }
        },
        deleteItem: (state, action) => {
            const id = action.payload;
            const existingItem = state.cartItems.find(item => item.id === id);
            
            if (existingItem) {
                state.totalQuantity -= existingItem.quantity;
                state.totalAmount -= parseFloat(existingItem.price) * existingItem.quantity;
                state.cartItems = state.cartItems.filter(item => item.id !== id);
            }
        },
        clearCart: (state) => {
            state.cartItems = [];
            state.totalQuantity = 0;
            state.totalAmount = 0;
        }
    },
});

export const { addItemToCart, removeItemFromCart, deleteItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;