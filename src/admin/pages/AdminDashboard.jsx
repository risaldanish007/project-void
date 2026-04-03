import React from 'react';
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../api/apiClient";
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip, CartesianGrid } from 'recharts';

const AdminDashboard = () => {
  const { data: users, isLoading } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: async () => {
      const response = await apiClient.get("/users");
      return response.data;
    },
  });

  if (isLoading) return <div className="text-green-500 font-mono animate-pulse p-10 text-xs">CALCULATING_INTEL...</div>;

  // --- ANALYTICS ENGINE ---
  const allOrders = users?.flatMap(u => u.orders) || [];
  const allItems = allOrders.flatMap(o => o.items) || [];

  // Grouping Sales by Product
  const salesByProduct = allItems.reduce((acc, item) => {
    if (!acc[item.id]) {
      acc[item.id] = { 
        name: item.name, 
        qty: 0, 
        revenue: 0, 
        img: item.image 
      };
    }
    acc[item.id].qty += item.quantity;
    acc[item.id].revenue += (item.quantity * item.price);
    return acc;
  }, {});

  const bestSellers = Object.values(salesByProduct)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 4); // Top 4 variants

  const totalRevenue = allOrders.reduce((acc, curr) => acc + curr.total, 0);

  // Chart Logic (Same as before)
  const salesByDate = allOrders.reduce((acc, order) => {
    acc[order.date] = (acc[order.date] || 0) + order.total;
    return acc;
  }, {});
  const chartData = Object.keys(salesByDate).map(date => ({
    date: date.split('-').slice(1).join('/'),
    amount: salesByDate[date]
  })).sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="space-y-10 animate-in fade-in duration-1000 pb-20">
      {/* SECTION 1: VISUAL HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-8 bg-[#0a0a0a] border border-white/5 rounded-[2.5rem]">
          <header className="mb-10">
            <h3 className="text-2xl font-black italic uppercase text-white tracking-tighter">sales chart</h3>
          </header>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: '1px solid #ffffff10', borderRadius: '12px', fontSize: '10px' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#22c55e" fill="url(#colorSales)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      <div className="p-8 bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] flex flex-col justify-between shadow-2xl">
  <div>
    <h4 className="text-3xl font-black uppercase italic tracking-tighter text-white">Financials</h4>
    
    <div className="mt-8 space-y-4">
      {/* Gross Intake Row */}
      <div className="flex justify-between border-b border-white/5 pb-2">
        <span className="text-[10px] font-mono uppercase text-white/40 tracking-widest">Gross_Intake</span>
        <span className="text-[11px] font-mono font-bold text-green-500 tracking-tighter">
          ${totalRevenue.toLocaleString()}
        </span>
      </div>

      {/* Current Users Row */}
      <div className="flex justify-between border-b border-white/5 pb-2">
        <span className="text-[10px] font-mono uppercase text-white/40 tracking-widest">Current_Users</span>
        <span className="text-[11px] font-mono font-bold text-white">
          {users?.length || 0}
        </span>
      </div>
    </div>
  </div>

  {/* Optional: Add a subtle status indicator at the bottom */}
  <div className="mt-8 pt-4 flex items-center gap-2">
    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
    <span className="text-[8px] font-mono uppercase text-white/20 tracking-[0.3em]">System_Secure</span>
  </div>
</div>
      </div>

      {/* SECTION 2: TOP VARIANTS TABLE */}
      <div className="p-8 bg-[#0a0a0a] border border-white/5 rounded-[2.5rem]">
        <header className="mb-8">
          <h3 className="text-xl font-black italic uppercase text-white tracking-tighter">Top sellers</h3>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((item, index) => (
            <div key={item.name} className="p-6 border border-white/5 rounded-3xl bg-white/[0.01] hover:bg-white/[0.03] transition-all">
              <div className="flex justify-between items-start mb-6">
                <span className="text-[9px] font-mono text-green-500 bg-green-500/10 px-2 py-1 rounded">RANK_0{index + 1}</span>
                <span className="text-[10px] font-mono text-white/20">QTY: {item.qty}</span>
              </div>
              <div className="flex items-center gap-4">
                <img src={item.img} className="w-12 h-12 object-contain grayscale brightness-150" alt="" />
                <div>
                  <h5 className="text-sm font-black uppercase italic text-white tracking-tighter">{item.name}</h5>
                  <p className="text-green-500 font-mono text-[10px]">${item.revenue.toFixed(2)} REV</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;