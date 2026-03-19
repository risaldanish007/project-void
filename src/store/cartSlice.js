import { createSlice } from "@reduxjs/toolkit";

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
        }
    }
})

export const {addToCart, removeFromCart, clearItem, clearCart} = cartSlice.actions;

export default cartSlice.reducer;