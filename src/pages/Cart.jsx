import { useSelector, useDispatch } from "react-redux";
import { addToCart, removeFromCart, clearItem } from "../store/cartSlice";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const { items, totalPrice } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
        <div className="w-24 h-24 border-2 border-dashed border-white/20 rounded-full flex items-center justify-center animate-spin-slow">
           <span className="text-4xl opacity-20">VOID</span>
        </div>
        <h2 className="text-3xl font-black uppercase tracking-[0.2em] text-white/40">Manifest Empty</h2>
        <Link to="/" className="bg-white text-black px-8 py-3 rounded-full font-black uppercase hover:bg-cyan-400 transition-all">
          Reacquire Signal
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 max-w-7xl mx-auto text-white">
      {/* Header */}
      <div className="flex items-end gap-4 mb-12 border-b border-white/10 pb-6">
        <h1 className="text-6xl font-black uppercase italic tracking-tighter leading-none">Cart</h1>
        <span className="text-cyan-400 font-mono text-sm pb-1">[{items.length} SPECIMENS]</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* LEFT: Item List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="group relative bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-6 hover:bg-white/10 transition-all">
              {/* Product Image with Glow */}
              <div className="w-24 h-24 bg-black rounded-xl overflow-hidden flex-shrink-0 border border-white/5 relative">
                <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt={item.name} />
              </div>

              {/* Product Info */}
              <div className="flex-grow">
                <h3 className="text-xl font-black uppercase tracking-tight">{item.name}</h3>
                <p className="text-cyan-500 font-mono text-xs mb-4">Unit Price: ${item.price}</p>
                
                {/* Quantity Controls - Compact & Sleek */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-black rounded-lg border border-white/10 overflow-hidden">
                    <button onClick={() => dispatch(removeFromCart(item.id))} className="px-3 py-1 hover:bg-red-500/20 hover:text-red-400 transition-colors">-</button>
                    <span className="px-4 font-mono font-bold border-x border-white/5">{item.quantity}</span>
                    <button onClick={() => dispatch(addToCart(item))} className="px-3 py-1 hover:bg-green-500/20 hover:text-green-400 transition-colors">+</button>
                  </div>
                  <button onClick={() => dispatch(clearItem(item.id))} className="text-[10px] uppercase font-black text-gray-500 hover:text-red-500 tracking-widest transition-colors">
                    Dispose
                  </button>
                </div>
              </div>

              {/* Individual Total */}
              <div className="text-right">
                <p className="text-2xl font-black italic">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT: Summary Manifest (Sticky) */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-cyan-500 text-black p-8 rounded-3xl shadow-[0_20px_50px_rgba(34,211,238,0.2)]">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-6 border-b border-black/20 pb-2">Order Manifest</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between font-bold uppercase text-sm">
                <span>Subtotal</span>
                <span>${totalPrice}</span>
              </div>
              <div className="flex justify-between font-bold uppercase text-sm">
                <span>Encryption/Shipping</span>
                <span className="italic">FREE</span>
              </div>
            </div>

            <div className="border-t-2 border-black/20 pt-4 mb-8">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Total Amount</p>
              <h2 className="text-5xl font-black italic tracking-tighter">${totalPrice}</h2>
            </div>

            <button 
              onClick={() => navigate("/checkout")}
              className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group"
            >
              Initiate Checkout
              <span className="group-hover:translate-x-2 transition-transform">→</span>
            </button>
            
            <p className="text-[9px] font-mono uppercase mt-6 opacity-60 leading-tight">
              By initiating checkout, you agree to enter the VOID. All signals are encrypted.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Cart;