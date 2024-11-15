// src/redux/wishlistSlice.js
import { createSlice } from '@reduxjs/toolkit';

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: [],
  reducers: {
    addToWishlist: (state, action) => {
      const exists = state.find(item => item.id === action.payload.id);
      if (!exists) state.push(action.payload); // Add item if it doesn't exist in wishlist
    },
    removeFromWishlist: (state, action) => {
      return state.filter(item => item.id !== action.payload); // Remove item by ID
    },
    clearWishlist: () => [] // Optional: Clear all items from wishlist
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
