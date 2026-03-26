import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { clearCart } from "../store/cartSlice";
import { useDispatch } from "react-redux";

const Success = () => {
    const [dots, setDots] = useState("")
    const dispatch = useDispatch()

    useEffect(()=>{
        dispatch(clearCart());
    },[dispatch])

    useEffect(()=>{
        const interval = setInterval(()=>{
            setDots((prev)=>(prev.length < 3 ? prev + "." : ""));
        }, 500)
        return ()=> clearInterval(interval);
    },[])
    return (
    <div className="min-h-screen pt-32 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full bg-[#0a0a0a] border border-cyan-500/30 rounded-[2.5rem] p-12 text-center shadow-[0_0_50px_rgba(34,211,238,0.1)] relative overflow-hidden">
        
        {/* Scanning Line Effect */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-500/50 shadow-[0_0_15px_cyan] animate-scan"></div>

        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-2 border-cyan-500 text-cyan-500 text-4xl animate-pulse">
            ✓
          </div>
        </div>

        <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-4 text-white">
          Transmission <span className="text-cyan-400">Complete</span>
        </h1>
        
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-8 space-y-1">
          <p>Status: Signal Deployed</p>
          <p>Packet ID: VOID-{Math.floor(100000 + Math.random() * 900000)}</p>
          <p>Destination: Verified</p>
        </div>

        <p className="text-gray-400 text-sm mb-10 leading-relaxed">
          Your order has been encrypted and added to the deployment queue{dots}
        </p>

        <Link 
          to="/" 
          className="block w-full bg-white text-black py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-cyan-400 transition-all active:scale-95"
        >
          Return to Terminal
        </Link>
      </div>
    </div>
  );
}
export default Success;