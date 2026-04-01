import { createSlice , createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../api/apiClient";

const savedCart = JSON.parse(localStorage.getItem('void_cart'));

const initialState = {
    items : savedCart?.items || [],
    totalQuantity: savedCart?.totalQuantity || 0,
    totalPrice: savedCart?.totalPrice || 0,
};

export const syncCartToDB = createAsyncThunk(
    "cart/syncToDB",
    async ({userId , cartState},{rejectWithValue}) => {
        try{
        const response = await apiClient.patch(`/users/${userId}`,{
            cart: cartState // Syncing the full object {items, totalQuantity, totalPrice}
        });
        return response.data.cart;
    }catch(err){
            return rejectWithValue(err.message);
            }
    }
)

const cartSlice = createSlice({
    name: 'cart',
    initialState,
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
                    image: newItem.image,
                    
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
            localStorage.removeItem('void_cart')
        },
        replaceCart: (state, action) => {
            state.items = action.payload.items || [];
            state.totalQuantity = action.payload.totalQuantity || 0;
            state.totalPrice = action.payload.totalPrice || 0;
            localStorage.removeItem('void_cart')
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
        localStorage.removeItem('void_cart') //wipe on logout
        console.log("VOID: Cart purged following operative logout.");
    });
    }
})

export const {addToCart, removeFromCart, clearItem, clearCart, replaceCart} = cartSlice.actions;

export default cartSlice.reducer;