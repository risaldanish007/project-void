import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { syncCartToDB } from "../store/cartSlice";

export const useCartSync = () => {
    const cart = useSelector((state)=> state.cart);
    const {user} = useSelector((state)=> state.auth);
    const dispatch = useDispatch();

    useEffect(()=>{
        if(user?.id){
            const timeoutId = setTimeout(()=>{
                dispatch(syncCartToDB({userId: user.id, cartState: cart}));
            }, 500);
            return () => clearTimeout(timeoutId)
        }
    },[cart, user?.id, dispatch])
}