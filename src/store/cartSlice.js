import { createSlice , createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../api/apiClient";

export const syncCartToDB = createAsyncThunk(
    "cart/syncToDB",
    async ({userId , cartState},{rejectWithValue}) => {
        try{
        const response = await apiClient.patch(`/users/${userId}`,{
            cart: cartState
        });
        return response.data.cart;
    }catch(err){
            return rejectWithValue(err.message);
            }

    }
)

const cartSlice = createSlice({
    name: 'cart',
    initialState:{
        items:[],
        totalQuantity:0,
        totalPrice:0,
    },
    reducers:{
        addToCart:(state, action)=>{
            const newItem = action.payload;
            const existingItem = state.items.find((item)=>item.id === newItem.id);

            state.totalQuantity++;

            if(!existingItem){
                state.items.push({
                    id: newItem.id,
                    name: newItem.name,
                    price: newItem.price,
                    quantity:1,
                    totalItemPrice: newItem.price,
                    image: newItem.image
                });
            }else{
                existingItem.quantity++;
                existingItem.totalItemPrice += newItem.price
            }
            state.totalPrice += newItem.price;
        },
        removeFromCart: (state, action) => {
            const id = action.payload;
            const existingItem = state.items.find(item => item.id === id);

            if (!existingItem) return;

            if (existingItem.quantity === 1) {
                return
            } else {
                existingItem.quantity--;
                existingItem.totalItemPrice -= existingItem.price;

                state.totalQuantity--;
                state.totalPrice -= existingItem.price;
            }
        },
        clearItem:(state,action)=>{
            const id = action.payload;
            const existingItem =state.items.find(item => item.id === id);
            if(existingItem){
                state.totalQuantity -= existingItem.quantity;
                state.totalPrice -= existingItem.totalItemPrice;
                state.items =state.items.filter(item => item.id !== id);
            }
        },
        clearCart: (state) => {
            state.items = [];
            state.totalQuantity = 0;
            state.totalPrice = 0;
        },
        replaceCart: (state, action) => {
            state.items = action.payload.items || [];
            state.totalQuantity = action.payload.totalQuantity || 0;
            state.totalPrice = action.payload.totalPrice || 0;
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
        console.log("VOID: Cart purged following operative logout.");
    });
    }
})

export const {addToCart, removeFromCart, clearItem, clearCart, replaceCart} = cartSlice.actions;

export default cartSlice.reducer;