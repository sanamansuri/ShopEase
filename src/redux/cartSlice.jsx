import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
    name: 'cart',
    initialState: [],
    reducers: {
        addToCart: (state, action) => {
            const itemIndex = state.findIndex(
                item => item.id === action.payload.id && item.size === action.payload.size
            );
            if (itemIndex >= 0) {
                state[itemIndex].quantity += action.payload.quantity;
            } else {
                state.push(action.payload);
            }
        },
        deleteFromCart: (state, action) => {
            return state.filter(item => item.id !== action.payload.id || item.size !== action.payload.size);
        },
        incrementQuantity: (state, action) => {
            const item = state.find(item => item.id === action.payload.id && item.size === action.payload.size);
            if (item) item.quantity += 1;
        },
        decrementQuantity: (state, action) => {
            const item = state.find(item => item.id === action.payload.id && item.size === action.payload.size);
            if (item && item.quantity > 1) item.quantity -= 1;
        },
    },
});

export const { addToCart, deleteFromCart, incrementQuantity, decrementQuantity } = cartSlice.actions;
export default cartSlice.reducer;
