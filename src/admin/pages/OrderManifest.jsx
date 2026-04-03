import React, { useState } from 'react'; // Added useState
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../api/apiClient";
import { toast } from 'react-toastify';

const OrderManifest = () => {
  const [searchTerm, setSearchTerm] = useState(""); // THE SEARCH STATE
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: async () => {
      const response = await apiClient.get("/users");
      return response.data;
    },
  });

  // 1. FLATTEN THE DATA
  const allOrders = users?.flatMap(user => 
    user.orders.map(order => ({
      ...order,
      customerName: user.name,
      customerEmail: user.email,
      parentUserId: user.id
    }))
  ).sort((a, b) => new Date(b.date) - new Date(a.date));

  // 2. FILTER THE DATA: The Search Engine
  const filteredOrders = allOrders?.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusMutation = useMutation({
    mutationFn: async ({ userId, orderId, newStatus }) => {
      const userRes = await apiClient.get(`/users/${userId}`);
      const user = userRes.data;
      const updatedOrders = user.orders.map(o => 
        o.id === orderId ? { ...o, status: newStatus } : o
      );
      return apiClient.patch(`/users/${userId}`, { orders: updatedOrders });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["adminUsers"]);
      toast.info("LOGISTICS_SYNC: Deployment status updated.");
    }
  });

  // Helper for Status Badge Styling
  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20';
      case 'Deployed': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'Cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'; // Pending
    }
  };

  if (isLoading) return <div className="text-cyan-500 font-mono animate-pulse p-10 text-xs uppercase tracking-widest text-center">Scanning_Global_Uplink...</div>;

  return (
    <div className="animate-in fade-in duration-700">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-xl font-bold uppercase italic tracking-[0.2em] text-white/40">Orders</h2>
          <p className="text-[10px] font-mono text-white/30 mt-2 uppercase tracking-widest">
            {filteredOrders?.length} Matches found in active memory.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <input 
            type="text"
            placeholder="SEARCH_BY_ID_OR_EMAIL..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-[10px] font-mono text-white focus:border-cyan-500 outline-none transition-all placeholder:text-white/10 italic"
          />
          <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-white/20 pointer-events-none">
            [SYS_FIND]
          </div>
        </div>
      </header>

      <div className="overflow-hidden border border-white/5 rounded-3xl bg-[#0a0a0a]/50 backdrop-blur-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 text-[9px] font-mono text-gray-500 uppercase tracking-[0.3em] bg-white/[0.0]">
              <th className="p-6">ID</th>
              <th className="p-6">Recipient</th>
              <th className="p-6">Value</th>
              <th className="p-6">Status</th>
              <th className="p-6 text-right">Protocol</th>
            </tr>
          </thead>
          <tbody className="text-[11px] font-mono uppercase">
            {filteredOrders?.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-white/[0.02] hover:bg-white/[0.03] transition-all group">
                  <td className="p-6 text-white font-bold tracking-tighter">#{order.id}</td>
                  <td className="p-6">
                    <div className="flex flex-col">
                      <span className="text-white/80">{order.customerName}</span>
                      <span className="text-[9px] text-white/20 tracking-widest">{order.customerEmail}</span>
                    </div>
                  </td>
                  <td className="p-6 text-cyan-500/80 font-black">${order.total}</td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-bold tracking-widest border transition-colors ${getStatusColor(order.status)}`}>
                      {order.status || 'Pending'}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <select 
                      value={order.status || 'Pending'}
                      onChange={(e) => statusMutation.mutate({ 
                        userId: order.parentUserId, 
                        orderId: order.id, 
                        newStatus: e.target.value 
                      })}
                      className="bg-[#111] border border-white/10 text-white/40 text-[9px] font-bold uppercase tracking-widest rounded-lg px-3 py-2 outline-none focus:border-white/30 cursor-pointer hover:text-white transition-all"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Deployed">Deployed</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-20 text-center text-white/10 font-mono text-[10px] tracking-[0.5em] uppercase">
                  Zero_Matches_Found_In_Database
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManifest;