import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux"; // MISSING IMPORT ADDED
import apiClient from "../api/apiClient";
import { toast } from "react-toastify";

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // 1. GET AUTH USER: Required for the security check
  const { user: authUser } = useSelector((state) => state.auth);

  // 2. DATA PIPELINE
  const { data: order, isLoading, isError } = useQuery({
    queryKey: ["orderDetail", id],
    queryFn: async () => {
      const response = await apiClient.get(`/orders/${id}`);
      return response.data;
    },
  });

  // 3. CANCELLATION MUTATION
  const cancelMutation = useMutation({
    mutationFn: async () => {
      return apiClient.patch(`/orders/${id}`, { status: "Cancelled" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["orderDetail", id]);
      toast.warn("ORDER_CANCELLED: Transaction has been terminated.");
    }
  });

  const getStatusStyles = (status) => {
    const s = status?.toLowerCase();
    if (s === 'delivered') return 'text-green-500 border-green-500/50 bg-green-500/10';
    if (s === 'shipped' || s === 'deployed') return 'text-cyan-400 border-cyan-400/50 bg-cyan-400/10';
    if (s === 'cancelled') return 'text-red-500 border-red-500/50 bg-red-500/10';
    return 'text-yellow-500 border-yellow-500/50 bg-yellow-500/10';
  };

  // --- LOGIC GATES ---

  // A. Loading State
  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-black text-cyan-500 font-mono text-xs uppercase tracking-[0.5em] animate-pulse font-black">
      Retrieving_Data...
    </div>
  );

  // B. Error State
  if (isError || !order) return (
    <div className="min-h-screen flex items-center justify-center bg-black text-red-500 font-mono text-xs uppercase font-black">
      Error: Order_Not_Found
    </div>
  );

  // C. SECURITY GATE: Verify ownership or admin clearance
  // Moved AFTER loading check so 'order' is guaranteed to exist
  if (order.userId !== authUser?.id && authUser?.role !== 'admin') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-red-500 p-10 text-center">
        <h2 className="text-2xl font-black italic mb-4 uppercase tracking-tighter">Access_Denied_Terminal</h2>
        <p className="font-mono text-xs text-white/40 uppercase tracking-widest">Unauthorized Signal Intercept Detected.</p>
        <button onClick={() => navigate('/profile')} className="mt-8 border border-red-500/30 px-6 py-2 text-[10px] font-black uppercase text-red-500 hover:bg-red-500 hover:text-white transition-all">Return to Profile</button>
      </div>
    );
  }

  const isFinalized = order.status === 'Delivered' || order.status === 'Cancelled';
  const canCancel = order.status?.toLowerCase() === 'pending';

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-4xl mx-auto text-white animate-in fade-in duration-700">
      
      {/* Back Navigation */}
      <button 
        onClick={() => navigate(-1)}
        className="mb-10 flex items-center gap-2 text-white/70 hover:text-white transition-all font-mono text-[11px] uppercase tracking-widest font-black"
      >
        <span>[</span> Back to Profile <span>]</span>
      </button>

      {/* Header Summary */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-white/10 pb-10 gap-6">
        <div>
          <span className="text-cyan-500 font-mono text-[12px] tracking-[0.4em] uppercase block mb-2 font-black">Official_Invoice</span>
          <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none">{order.id}</h1>
          <p className="text-white/80 font-mono text-[11px] mt-4 font-black uppercase tracking-widest">Confirmed: {order.date}</p>
        </div>
        <div className="flex flex-col items-end gap-3">
            <div className={`text-[12px] font-black uppercase tracking-[0.3em] px-6 py-2.5 rounded-xl border shadow-xl ${getStatusStyles(order.status)}`}>
                {order.status || 'Processing'}
            </div>
            {isFinalized && (
                <span className="text-[10px] font-mono text-white/50 uppercase tracking-[0.2em] font-bold italic">Transaction_Finalized</span>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <section className="space-y-12">
          <div>
            <h3 className="text-[12px] font-mono text-white/70 uppercase tracking-[0.5em] border-b border-white/10 pb-3 mb-6 font-black">Shipping_Address</h3>
            <div className="text-white/90 text-sm leading-relaxed uppercase font-bold tracking-wider space-y-1">
              <p className="text-xl font-black text-white italic">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
              <p className="text-white/80 font-black">{order.shippingAddress.address}</p>
              <p className="text-white/80 font-black">{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zip}</p>
              <div className="mt-8 p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-xl inline-block">
                <p className="text-cyan-400 font-mono text-[11px] font-black tracking-widest uppercase">Phone: {order.shippingAddress.phone}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-[12px] font-mono text-white/70 uppercase tracking-[0.5em] border-b border-white/10 pb-3 mb-6 font-black">Payment_Information</h3>
            <div className="text-white/70 text-[11px] font-mono uppercase font-black tracking-widest leading-loose">
                <p>Provider: Razorpay_Secure</p>
                <p className="text-white/40">Reference_ID: {order.paymentId}</p>
            </div>
          </div>

          <div className="pt-6">
            <button 
              onClick={() => cancelMutation.mutate()}
              disabled={!canCancel || isFinalized}
              className={`px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] transition-all border 
                ${!canCancel || isFinalized 
                  ? 'bg-transparent border-white/5 text-white/20 cursor-not-allowed' 
                  : 'text-red-500 border-red-500/20 hover:border-red-500 hover:bg-red-500/5'}`}
            >
                {isFinalized ? 'Order_Finalized' : !canCancel ? 'Cancellation_Disabled' : 'Cancel_Order'}
            </button>
          </div>
        </section>

        <section>
          <h3 className="text-[12px] font-mono text-white/70 uppercase tracking-[0.5em] border-b border-white/10 pb-3 mb-6 font-black">Order_Summary</h3>
          
          {/* UPDATED: Scrollable container for payload items */}
          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-3 custom-scrollbar">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between items-center bg-white/[0.03] p-5 rounded-2xl border border-white/10 group">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-black/40 border border-white/10 rounded-xl p-2">
                    <img src={item.image} alt="" className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-black uppercase tracking-tight italic leading-none">{item.name}</p>
                    <p className="text-white/60 text-[11px] font-black mt-2 uppercase tracking-widest font-mono">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="text-white font-black text-base tracking-tighter italic">${item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-10 border-t-2 border-white/10 flex justify-between items-end">
            <div>
                <p className="text-[12px] font-mono text-white/50 uppercase tracking-[0.4em] font-black">Total_Amount</p>
                <p className="text-[10px] text-cyan-500/50 uppercase font-mono mt-2 font-bold tracking-tighter font-black">Transaction_Verified</p>
            </div>
            <p className="text-5xl font-black italic text-cyan-400 tracking-tighter">${order.total}</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default OrderDetail;