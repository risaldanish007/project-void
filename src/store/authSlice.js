import {createSlice} from "@reduxjs/toolkit";

const userFromStorage = JSON.parse(localStorage.getItem('void_user'));

const authSlice = createSlice({
    name: 'auth',
    initialState:{
        user: userFromStorage || null,
        isAuthenticated: !!userFromStorage,
    },
    reducers:{
        setCredentials:(state,action)=>{
            // state.user = action.payload;
            // state.isAuthenticated = true;
            // localStorage.setItem('void_user', JSON.stringify(action.payload));
            const {password, ...safeUser} = action.payload;

            state.user = safeUser;
            state.isAuthenticated = true

            localStorage.setItem('void_user', JSON.stringify(safeUser));
        },
        logout: (state)=>{
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem('void_user');
        },
    },
})

export const {setCredentials, logout} =authSlice.actions;
export default authSlice.reducer