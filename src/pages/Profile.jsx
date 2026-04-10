import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom"; 
import apiClient from "../api/apiClient";

const Profile = () => {
  const { user: authUser } = useSelector((state) => state.auth);
  const navigate = useNavigate(); 

  // Data Pipeline: Retrieving user-specific order history
  const { data: orders, isLoading } = useQuery({
    queryKey: ["userOrders", authUser?.id],
    queryFn: async () => {
      const response = await apiClient.get(`/orders?userId=${authUser.id}`);
      
      // FIX: We reverse the array first so the newest database insertions sit at the top.
      // THEN we sort by date. This acts as a flawless tie-breaker for same-day orders.
      return response.data.reverse().sort((a, b) => new Date(b.date) - new Date(a.date));
    },
    enabled: !!authUser?.id,
  });

  const orderHistory = orders || [];

  const getStatusStyles = (status) => {
    const s = status?.toLowerCase();
    if (s === 'delivered') return 'text-green-500 border-green-500/40 bg-green-500/10';
    if (s === 'shipped' || s === 'deployed') return 'text-cyan-400 border-cyan-400/40 bg-cyan-400/10';
    if (s === 'cancelled') return 'text-red-500 border-red-500/40 bg-red-500/10';
    return 'text-yellow-500 border-yellow-500/40 bg-yellow-500/10';
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-4xl mx-auto text-white animate-in fade-in duration-1000">
      
      {/* Account Header Section */}
      <div className="flex items-center gap-6 mb-12 p-6 bg-white/5 border border-white/20 rounded-[2rem] backdrop-blur-md relative overflow-hidden">
        <div className="w-20 h-20 bg-cyan-500/20 border border-cyan-500/40 rounded-full flex items-center justify-center text-3xl font-black text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
          {authUser?.name?.charAt(0)}
        </div>
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-cyan-500/70 font-bold">Authorized Account</span>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter mt-1">{authUser?.name}</h1>
          <p className="font-mono text-xs text-white/80 font-bold tracking-widest mt-1 uppercase">{authUser?.email}</p>
        </div>
      </div>

      {/* History Header */}
      <h2 className="text-xl font-black uppercase italic mb-8 tracking-widest flex items-center gap-3 border-b border-white/5 pb-5">
        <span className="w-8 h-[1px] bg-cyan-500"></span>
        Order History
      </h2>

      {isLoading && (
        <p className="animate-pulse font-mono text-cyan-400 text-sm font-bold tracking-widest py-10 text-center uppercase">
          Synchronizing Data...
        </p>
      )}
      
      {orderHistory.length === 0 && !isLoading && (
        <div className="p-16 border border-dashed border-white/20 rounded-3xl text-center">
          <p className="text-white/60 font-mono uppercase text-xs font-bold tracking-widest">No transaction records found.</p>
        </div>
      )}

      {/* Order List */}
      <div className="space-y-4">
        {orderHistory.map((order) => (
          <div key={order.id} className="group bg-[#0a0a0a] border border-white/10 p-6 rounded-2xl hover:border-cyan-500/30 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
            <div className="flex items-center gap-8">
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[10px] text-white bg-white/10 border border-white/10 px-3 py-1 rounded font-bold tracking-tight">
                  ORDER_ID: {order.id}
                </span>
                <p className="text-[11px] text-white/70 font-mono uppercase font-bold tracking-widest">
                    Date: {order.date}
                </p>
              </div>

              <div className="hidden md:block h-10 w-[1px] bg-white/20"></div>

              <div>
                <p className="font-bold text-sm uppercase tracking-tight text-white/90">
                   {order.items.length} {order.items.length === 1 ? 'Item' : 'Items'} Purchased
                </p>
              </div>
            </div>

            <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/10 pt-4 md:pt-0">
              <div className="text-right">
                <p className="text-2xl font-black italic text-white mb-1">${order.total}</p>
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-lg border shadow-sm ${getStatusStyles(order.status)}`}>
                    {order.status || 'Processing'}
                </span>
              </div>
              <button 
                onClick={() => navigate(`/order/${order.id}`)}
                className="bg-white/5 border border-white/20 hover:bg-white hover:text-black px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all tracking-widest shadow-lg active:scale-95"
              >
                Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;