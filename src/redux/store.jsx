// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import wishlistReducer from './wishlistSlice'; // Import wishlistSlice

export const store = configureStore({
  reducer: {
    cart: cartReducer,        // Cart slice
    wishlist: wishlistReducer, // Wishlist slice
  },
  devTools: true, // Enable Redux DevTools
});

export default store;
