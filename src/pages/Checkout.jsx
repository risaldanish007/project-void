import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {clearCart} from "../store/cartSlice"

const Checkout = () => {
    const {items, totalPrice} = useSelector((state)=> state.cart);
    const {user} = useSelector((state)=> state.auth);
    const dispatch = useDispatch();
    const navigate =useNavigate();

    useEffect(()=>{
        if(!items || items.length === 0){
            navigate("/cart")
        }
    },[items,navigate])

    const handleConfirmOrder = (e)=>{
        e.preventDefault();
        //in real apps you will send items and user to /order endpoint here
        alert(`ORDER RECEIVED, ${user?.name || 'Operative'}. PAYMENT IN PROCCESS`)
        dispatch(clearCart());
        navigate('/');
    }
    if(! items || items.length === 0){
        return null;
    }

return (
    <div className="max-w-2xl mx-auto p-8 bg-[#0a0a0a] border border-white/10 rounded-3xl text-white shadow-2xl">
      <h2 className="text-3xl font-black uppercase italic mb-8 tracking-tighter">
        Finalize <span className="text-green-500">Signal</span>
      </h2>

      <form onSubmit={handleConfirmOrder} className="space-y-6">
        <div className="space-y-4">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Shipping Matrix</p>
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="First Name" required className="bg-black border border-white/10 p-4 rounded-xl focus:border-green-500 outline-none transition-all" />
            <input type="text" placeholder="Last Name" required className="bg-black border border-white/10 p-4 rounded-xl focus:border-green-500 outline-none transition-all" />
          </div>
          <input type="text" placeholder="Shipping Address" required className="w-full bg-black border border-white/10 p-4 rounded-xl focus:border-green-500 outline-none transition-all" />
        </div>

        <div className="pt-8 border-t border-white/10">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-gray-500 uppercase text-[10px] font-black tracking-widest">Total Liability</p>
              <h3 className="text-4xl font-black">${totalPrice}</h3>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-xs">Items: {items.length}</p>
              <p className="text-green-500 text-xs font-bold italic">Secure Encryption Active</p>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase hover:bg-green-500 hover:text-white transition-all shadow-lg active:scale-[0.98]"
          >
            Confirm & Deploy Order
          </button>
        </div>
      </form>
    </div>
  );
}

export default Checkout;