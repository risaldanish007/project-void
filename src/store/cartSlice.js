import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../api/apiClient";

const savedCart = JSON.parse(localStorage.getItem('void_cart'));

const initialState = {
    items: savedCart?.items || [],
    totalQuantity: Number(savedCart?.totalQuantity || 0),
    totalPrice: Number(savedCart?.totalPrice || 0),
};

// Helper function to keep math consistent and prevent scientific notation bugs
const recalculateTotals = (state) => {
    state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
    state.totalPrice = state.items.reduce((total, item) => total + (Number(item.price) * item.quantity), 0);
    
    // Sync to local storage whenever state changes
    localStorage.setItem('void_cart', JSON.stringify({
        items: state.items,
        totalQuantity: state.totalQuantity,
        totalPrice: state.totalPrice
    }));
};

export const syncCartToDB = createAsyncThunk(
    "cart/syncToDB",
    async ({ userId, cartState }, { rejectWithValue }) => {
        try {
            const response = await apiClient.patch(`/users/${userId}`, {
                cart: cartState 
            });
            return response.data.cart;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const newItem = action.payload;
            const existingItem = state.items.find((item) => item.id === newItem.id);

            // Keep this check for data integrity, but REMOVE the toast call
            if (existingItem && existingItem.quantity >= (newItem.countInStock || newItem.stock)) {
                return; 
            }

            if (!existingItem) {
                state.items.push({ ...newItem, quantity: 1, totalItemPrice: newItem.price });
            } else {
                existingItem.quantity++;
                existingItem.totalItemPrice += Number(newItem.price);
            }
            recalculateTotals(state);
        },
        removeFromCart: (state, action) => {
            const id = action.payload;
            const existingItem = state.items.find(item => item.id === id);

            if (!existingItem) return;

            if (existingItem.quantity === 1) {
                // Now correctly removes the item if it was the last one
                state.items = state.items.filter(item => item.id !== id);
            } else {
                existingItem.quantity--;
                existingItem.totalItemPrice -= Number(existingItem.price);
            }
            recalculateTotals(state);
        },
        clearItem: (state, action) => {
            const id = action.payload;
            state.items = state.items.filter(item => item.id !== id);
            recalculateTotals(state);
        },
        clearCart: (state) => {
            state.items = [];
            state.totalQuantity = 0;
            state.totalPrice = 0;
            localStorage.removeItem('void_cart');
        },
        replaceCart: (state, action) => {
            // We force a recalculation here to sanitize any corrupted totals from the DB
            state.items = action.payload.items || [];
            recalculateTotals(state);
        }
    },
    extraReducers: (builder) => {
        builder.addCase(syncCartToDB.rejected, (state, action) => {
            console.error("VOID SYNC FAILED:", action.payload);
        });
        builder.addCase("auth/logout", (state) => {
            state.items = [];
            state.totalQuantity = 0;
            state.totalPrice = 0;
            localStorage.removeItem('void_cart');
            console.log("VOID: Cart purged following operative logout.");
        });
    }
});

export const { addToCart, removeFromCart, clearItem, clearCart, replaceCart } = cartSlice.actions;
export default cartSlice.reducer;