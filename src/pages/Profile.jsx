import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../api/apiClient";

const Profile = () => {
  const { user: authUser } = useSelector((state) => state.auth);

  // Fetch the fresh user object to get the latest nested orders
  const { data: userData, isLoading } = useQuery({
    queryKey: ["userProfile", authUser?.id],
    queryFn: async () => {
      const response = await apiClient.get(`/users/${authUser.id}`);
      return response.data;
    },
    enabled: !!authUser?.id,
  });

  // Extract orders from the nested user data
  const orders = userData?.orders || [];

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 max-w-5xl mx-auto text-white">
      {/* User Header Section */}
      <div className="flex items-center gap-6 mb-12 p-8 bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-md">
        <div className="w-20 h-20 bg-cyan-500/20 border border-cyan-500/40 rounded-full flex items-center justify-center text-3xl font-black shadow-[0_0_20px_rgba(34,211,238,0.2)]">
          {authUser?.name?.charAt(0)}
        </div>
        <div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter">{authUser?.name}</h1>
          <p className="font-mono text-xs text-cyan-500 opacity-70">{authUser?.email}</p>
        </div>
      </div>

      <h2 className="text-xl font-black uppercase italic mb-6 tracking-widest flex items-center gap-3">
        <span className="w-8 h-[1px] bg-cyan-500"></span>
        Signal History
      </h2>

      {isLoading && <p className="animate-pulse font-mono text-cyan-500">SCANNING DATABASE...</p>}
      
      {orders.length === 0 && !isLoading && (
        <div className="p-10 border border-dashed border-white/10 rounded-3xl text-center">
          <p className="text-gray-500 font-mono uppercase text-sm">No signals deployed yet.</p>
        </div>
      )}

      <div className="space-y-4">
        {/* [...orders].reverse() ensures the newest orders appear at the top */}
        {[...orders].reverse().map((order) => (
          <div key={order.id} className="group bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl hover:border-cyan-500/30 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-6">
              <div className="font-mono text-[10px] text-gray-600 bg-white/5 px-2 py-1 rounded">
                ID: {order.paymentId?.slice(-8) || order.id}
              </div>
              <div>
                <p className="font-bold text-sm uppercase tracking-tight">
                   {order.items.length} Specimens Deployed
                </p>
                <p className="text-[10px] text-gray-500 font-mono uppercase">{order.date}</p>
              </div>
            </div>

            <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
              <div className="text-right">
                <p className="text-2xl font-black italic">${order.total}</p>
                <span className={`text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full border
                      ${order.status === 'Deployed' ? 'text-cyan-400 border-cyan-500/30 bg-cyan-500/5' : 
                        order.status === 'In Transit' ? 'text-yellow-500 border-yellow-500/30 bg-yellow-500/5' : 
                        'text-green-500 border-green-500/30 bg-green-500/5'}`}>
                      {order.status}
                </span>
              </div>
              <button className="bg-white/5 hover:bg-white hover:text-black px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all">
                View Manifest
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;