import { useSelector, useDispatch } from "react-redux";
import { addToCart,removeFromCart,clearItem } from "../store/cartSlice";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
    const navigate = useNavigate()
    const {items, totalPrice} =useSelector((state)=> state.cart);
    const dispatch = useDispatch();

    if(items.length === 0){
        return(
        <div className="text-center mt-20">
            <h2 className="text-2xl text-white uppercase font-black">Your Cart is a VOID.</h2>
            <Link to="/" className="text-green-500 underline mt-4 inline-block italic">Go get some signal.</Link>
        </div>
        )
    }
    return (
    <div className="max-w-4xl mx-auto p-6 bg-[#111] rounded-3xl border border-white/10 text-white">
      <h1 className="text-4xl font-black uppercase mb-8 italic tracking-tighter">Current Order</h1>
      
      <div className="space-y-6">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between border-b border-white/5 pb-6">
            <div className="flex items-center gap-4">
              <img src={item.image} className="w-20 h-20 object-cover rounded-lg" alt="" />
              <div>
                <h3 className="font-bold uppercase text-lg">{item.name}</h3>
                <p className="text-gray-500 text-sm">${item.price} per unit</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center border border-white/20 rounded-full px-3 py-1">
                <button onClick={() => dispatch(removeFromCart(item.id))} className="px-2 hover:text-green-500 text-xl">-</button>
                <span className="px-4 font-mono font-bold text-lg">{item.quantity}</span>
                <button onClick={() => dispatch(addToCart(item))} className="px-2 hover:text-green-500 text-xl">+</button>
              </div>
              <button onClick={() => dispatch(clearItem(item.id))} className="text-red-500 text-xs uppercase font-bold hover:underline">Remove</button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 pt-6 border-t border-white/20 flex justify-between items-end">
        <div>
          <p className="text-gray-500 uppercase text-xs font-bold tracking-widest">Grand Total</p>
          <h2 className="text-5xl font-black">${totalPrice}</h2>
        </div>
          <button 
            onClick={() => navigate("/checkout")}
            className="bg-white text-black px-10 py-4 rounded-xl font-black uppercase hover:bg-green-500 hover:text-white transition-all">
            Initiate Checkout
          </button>
      </div>
    </div>
  );
}
export default Cart;

