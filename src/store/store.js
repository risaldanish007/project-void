import { configureStore } from "@reduxjs/toolkit";
import authReducer from './authSlice';
import cartReducer, { syncCartToDB } from './cartSlice'

export const store = configureStore({
    reducer: {
        auth : authReducer,
        cart : cartReducer
    },
    // cart, porducts will go here
})

// ------------------------------------
// // 1. We track the STRING version of the items to detect REAL changes
// let previousCartItems = JSON.stringify(store.getState().cart.items);

// store.subscribe(() => {
//   const state = store.getState();
//   const currentCartItems = JSON.stringify(state.cart.items);
//   const user = state.auth.user;

//   // 2. ONLY sync if the actual items inside the cart are different
//   if (user?.id && currentCartString !== previousCartString) {
//     previousCartItems = currentCartItems;
    
//     // 3. Dispatch the sync
//     store.dispatch(syncCartToDB({ 
//       userId: user.id, 
//       cartState: state.cart // Send the full state to the DB
//     }));
//   }
// });
// store.js
// 1. Initialize with the string version of the items
// let previousCartString = JSON.stringify(store.getState().cart.items);

// store.subscribe(() => {
//   const state = store.getState();
//   const currentCartString = JSON.stringify(state.cart.items);
//   const user = state.auth.user;

//   if (user?.id && currentCartString !== previousCartString) {
//     // UPDATE THIS LINE FIRST to prevent double-firing
//     previousCartString = currentCartString; 
    
//     store.dispatch(syncCartToDB({ 
//       userId: user.id, 
//       cartState: state.cart 
//     }));
//   }
// });
// store.js
// store.js
// -----------------------------------------
let previousCartString = JSON.stringify(store.getState().cart.items);

store.subscribe(() => {
  const state = store.getState();
  const cart = state.cart;
  const user = state.auth.user;
  // --- PROTOCOL 1: GUEST PERSISTENCE ---
  // This line runs EVERY time the cart changes.
  // It saves the cart to the browser so it survives a refresh.
  localStorage.setItem('void_cart', JSON.stringify(cart));

  // CRITICAL: If the cart is empty, do NOT sync to DB on refresh.
  // This prevents the empty initial state from wiping your saved data.
  if (user?.id && cart.items.length > 0) {
    const currentCartString = JSON.stringify(cart.items);

    if (currentCartString !== previousCartString) {
      previousCartString = currentCartString;
      
      store.dispatch(syncCartToDB({ 
        userId: user.id, 
        cartState: cart 
      }));
    }
  }
});