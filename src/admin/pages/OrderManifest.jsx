import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../api/apiClient";
import { toast } from 'react-toastify';

const OrderManifest = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All"); 
  const [timeFilter, setTimeFilter] = useState("All Time"); 
  const [selectedOrder, setSelectedOrder] = useState(null); 
  const queryClient = useQueryClient();

  // --- DATA ACQUISITION ---
  const { data: orders, isLoading } = useQuery({
    queryKey: ["adminOrders"],
    queryFn: async () => {
      const response = await apiClient.get("/orders");
      // FIX: Pre-reverse the payload to handle same-day collisions, then sort descending
      return response.data.reverse().sort((a, b) => new Date(b.date) - new Date(a.date));
    },
  });

  // --- FILTERING LOGIC (Standardized Casing) ---
  const filteredOrders = orders?.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());

    // Standardizing comparison to handle both 'Pending' and 'pending'
    const currentStatus = order.status?.charAt(0).toUpperCase() + order.status?.slice(1).toLowerCase();
    const matchesStatus = statusFilter === "All" || currentStatus === statusFilter;

    const orderDate = new Date(order.date);
    const today = new Date();
    const isToday = orderDate.toDateString() === today.toDateString();
    const isThisWeek = (today - orderDate) / (1000 * 60 * 60 * 24) <= 7;

    const matchesTime = 
      timeFilter === "All Time" ? true :
      timeFilter === "Today" ? isToday :
      timeFilter === "This Week" ? isThisWeek : true;

    return matchesSearch && matchesStatus && matchesTime;
  });

  // --- STATUS MUTATION ---
  const statusMutation = useMutation({
    mutationFn: async ({ orderId, newStatus }) => {
      return apiClient.patch(`/orders/${orderId}`, { status: newStatus });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["adminOrders"]);
      toast.info("Transaction status successfully updated.");
    }
  });

  const getStatusColor = (status) => {
    const s = status?.toLowerCase();
    if (s === 'delivered') return 'text-green-500 border-green-500/20 bg-green-500/5';
    if (s === 'deployed') return 'text-cyan-400 border-cyan-400/20 bg-cyan-400/5';
    if (s === 'cancelled') return 'text-red-500 border-red-500/20 bg-red-500/5';
    return 'text-yellow-500 border-yellow-500/20 bg-yellow-500/5'; // Defaults to Pending
  };

  if (isLoading) return <div className="text-white font-sans animate-pulse p-10 text-xs text-center uppercase tracking-[0.3em] font-bold">Synchronizing Transactional Records...</div>;

  return (
    <div className="animate-in fade-in duration-700 relative pb-20 font-sans">
      
      {/* --- ORDER DETAIL MANIFEST --- */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/95 backdrop-blur-xl p-6">
          <div className="bg-[#0f0f0f] border border-white/10 w-full max-w-3xl rounded-[2rem] p-10 shadow-2xl relative">
            <div className="flex justify-between items-start mb-10 border-b border-white/5 pb-6">
              <div>
                <span className="text-cyan-400 font-bold text-[10px] tracking-[0.3em] uppercase block mb-1">Detailed Order Manifest</span>
                <h2 className="text-3xl font-bold italic tracking-tighter text-white uppercase">Invoice #{selectedOrder.id}</h2>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-white/40 hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest border border-white/10 px-4 py-2 rounded-lg">Close Manifest</button>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h4 className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold border-b border-white/5 pb-2">Customer Profile</h4>
                <div className="space-y-4">
                  <p className="text-white text-xl font-bold italic tracking-tight uppercase">{selectedOrder.customerName}</p>
                  <p className="text-white/60 text-xs font-medium lowercase">{selectedOrder.customerEmail}</p>
                  <div className="pt-4 border-t border-white/5">
                    <p className="text-[9px] text-white/30 uppercase mb-2 font-bold tracking-widest">Delivery Address</p>
                    <p className="text-white/80 text-xs leading-relaxed uppercase font-bold tracking-wider">
                      {selectedOrder.shippingAddress.address}<br/>
                      {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zip}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold border-b border-white/5 pb-2">Inventory Payload</h4>
                <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 bg-white/[0.03] p-3 rounded-xl border border-white/5">
                      <div className="w-10 h-10 bg-black rounded-lg p-1 border border-white/5">
                        <img src={item.image} alt="" className="w-full h-full object-contain grayscale" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-[10px] font-bold uppercase tracking-widest">{item.name}</p>
                        <p className="text-white/30 text-[9px] font-bold uppercase">Quantity: {item.quantity} // Rate: ${item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-6 border-t border-white/5 flex justify-between items-end">
                    <span className="text-white/30 text-[10px] uppercase tracking-[0.2em] font-bold">Total Liability</span>
                    <span className="text-3xl font-bold italic text-white tracking-tighter">${selectedOrder.total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- HEADER & FILTERS --- */}
      <header className="mb-10 flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold uppercase italic tracking-tighter text-white/80 leading-none">Order Administration</h2>
            <p className="text-[11px] text-white/40 mt-3 uppercase tracking-widest font-bold">
              Found {filteredOrders?.length} Total Records.
            </p>
          </div>
          <input 
            type="text"
            placeholder="Search by ID or Customer Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-80 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs text-white focus:border-white/30 outline-none transition-all placeholder:text-white/20 italic"
          />
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap gap-4 border-t border-white/5 pt-8">
            <div className="flex gap-2">
                {["All", "Pending", "Deployed", "Delivered", "Cancelled"].map((status) => (
                    <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border 
                            ${statusFilter === status ? 'bg-white border-white text-black shadow-lg' : 'bg-white/5 border-white/10 text-white/50 hover:text-white'}`}
                    >
                        {status}
                    </button>
                ))}
            </div>
            <div className="w-[1px] h-8 bg-white/10 hidden md:block" />
            <div className="flex gap-2">
                {["All Time", "Today", "This Week"].map((time) => (
                    <button
                        key={time}
                        onClick={() => setTimeFilter(time)}
                        className={`px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border 
                            ${timeFilter === time ? 'bg-white border-white text-black' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'}`}
                    >
                        {time}
                    </button>
                ))}
            </div>
        </div>
      </header>

      {/* --- ORDER TABLE --- */}
      <div className="overflow-hidden border border-white/10 rounded-[2rem] bg-[#0f0f0f]/60 backdrop-blur-md shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-[10px] text-white/40 uppercase tracking-[0.2em] bg-white/[0.02]">
              <th className="p-7 font-bold">Transaction ID</th>
              <th className="p-7 font-bold">Customer Profile</th>
              <th className="p-7 font-bold">Gross Amount</th>
              <th className="p-7 font-bold">Fulfillment Status</th>
              <th className="p-7 text-right font-bold">Administrative Options</th>
            </tr>
          </thead>
          <tbody className="text-xs uppercase">
            {filteredOrders?.map((order) => (
              <tr key={order.id} className="border-b border-white/[0.05] hover:bg-white/[0.03] transition-all group">
                <td className="p-7 text-white font-bold italic tracking-tighter text-base">#{order.id}</td>
                <td className="p-7">
                  <div className="flex flex-col">
                    <span className="text-white font-bold tracking-tight">{order.customerName}</span>
                    <span className="text-[10px] text-white/40 font-medium lowercase mt-1">{order.customerEmail}</span>
                  </div>
                </td>
                <td className="p-7 text-white font-bold italic text-sm">${order.total}</td>
                <td className="p-7">
                  <span className={`px-4 py-1.5 rounded-lg text-[9px] font-bold tracking-widest border transition-colors ${getStatusColor(order.status)}`}>
                    {order.status || 'Pending'}
                  </span>
                </td>
                <td className="p-7 text-right">
                  <div className="flex justify-end gap-3">
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="text-[10px] font-bold uppercase tracking-widest border border-white/10 px-5 py-3 rounded-xl text-white/60 hover:bg-white hover:text-black transition-all"
                    >
                      Manifest
                    </button>
                    <select 
                      value={order.status || 'Pending'}
                      onChange={(e) => statusMutation.mutate({ orderId: order.id, newStatus: e.target.value })}
                      className="bg-[#111] border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl px-4 py-3 outline-none focus:border-white/30 cursor-pointer hover:bg-white/5 transition-all"
                    >
                      {/* FIX: Forced Dark Background on Options */}
                      <option value="Pending" className="bg-[#0a0a0a] text-white">Pending</option>
                      <option value="Deployed" className="bg-[#0a0a0a] text-white">Deployed</option>
                      <option value="Delivered" className="bg-[#0a0a0a] text-white">Delivered</option>
                      <option value="Cancelled" className="bg-[#0a0a0a] text-white">Cancelled</option>
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManifest;