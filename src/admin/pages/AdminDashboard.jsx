import React from 'react';
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../api/apiClient";
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip, BarChart, Bar } from 'recharts';

const AdminDashboard = () => {
  // --- DATA ACQUISITION ---
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: () => apiClient.get("/users").then(res => res.data),
  });

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["adminOrders"],
    queryFn: () => apiClient.get("/orders").then(res => res.data),
  });

  if (usersLoading || ordersLoading) return (
    <div className="text-green-500 font-mono animate-pulse p-10 text-xs text-center uppercase tracking-[0.5em] font-black">
      Synchronizing_System_Analytics...
    </div>
  );

  // --- ANALYTICS ENGINE ---
  const allOrders = orders || [];
  const allItems = allOrders.flatMap(o => o.items || []);

  // Top Sellers Logic
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
    .slice(0, 4); 

  const totalRevenue = allOrders.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);

  // 1. Area Chart Logic (Total Revenue over time)
  const salesByDate = allOrders.reduce((acc, order) => {
    acc[order.date] = (acc[order.date] || 0) + (Number(order.total) || 0);
    return acc;
  }, {});

  const chartData = Object.keys(salesByDate).map(date => ({
    date: date.split('-').slice(1).join('/'), // Formats to MM/DD for X-Axis
    fullDate: date, // Keeps YYYY-MM-DD for bulletproof sorting
    amount: salesByDate[date]
  })).sort((a, b) => new Date(a.fullDate) - new Date(b.fullDate));

  // 2. Bar Chart Logic (Individual Payments)
  // FIX: Sorts strictly Oldest to Newest, then takes the last 15 elements.
  // This guarantees the absolute latest transaction is plotted on the far right.
  const recentPaymentsData = [...allOrders]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-15)
    .map(order => ({
      id: `...${order.id.slice(-4)}`, 
      amount: Number(order.total) || 0
    }));

  return (
    <div className="space-y-10 animate-in fade-in duration-1000 pb-20">
      
      {/* SECTION 1: REVENUE HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Transaction Performance Matrix (Area Chart) */}
        <div className="lg:col-span-2 p-8 bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          <header className="mb-10 flex justify-between items-center">
            <h3 className="text-2xl font-black italic uppercase text-white tracking-tighter">Transaction Performance</h3>
            <span className="text-[10px] font-mono text-white/70 uppercase tracking-widest font-black">[ Market_Data_USD ]</span>
          </header>
          
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  stroke="#ffffff60" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  dy={10}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: '1px solid #ffffff20', borderRadius: '16px', fontSize: '11px', fontWeight: 'bold' }}
                  itemStyle={{ color: '#22c55e' }}
                  formatter={(value) => [`$${value}`, "Revenue"]}
                  cursor={{ stroke: '#ffffff10', strokeWidth: 2 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#22c55e" 
                  fill="url(#colorSales)" 
                  strokeWidth={3} 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Capital Revenue Indicators */}
        <div className="p-8 bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] flex flex-col justify-between shadow-2xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-500/5 blur-3xl rounded-full" />
          
          <div>
            <h4 className="text-3xl font-black uppercase italic tracking-tighter text-white">Financials</h4>
            
            <div className="mt-8 space-y-6">
              <div className="flex justify-between border-b border-white/10 pb-4">
                <span className="text-[11px] font-mono uppercase text-white/70 tracking-widest font-black">Gross Revenue</span>
                <span className="text-xl font-black text-green-500 tracking-tighter italic">
                  ${totalRevenue.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between border-b border-white/10 pb-4">
                <span className="text-[11px] font-mono uppercase text-white/70 tracking-widest font-black">Total Users</span>
                <span className="text-xl font-black text-white tracking-tighter italic">
                  {users?.length || 0}
                </span>
              </div>
              
              <div className="flex justify-between border-b border-white/10 pb-4">
                <span className="text-[11px] font-mono uppercase text-white/70 tracking-widest font-black">Deployments</span>
                <span className="text-xl font-black text-cyan-400 tracking-tighter italic">
                  {allOrders.length}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_15px_#22c55e]"></div>
            <span className="text-[10px] font-mono uppercase text-white/60 tracking-[0.4em] font-black">Network_Link_Active</span>
          </div>
        </div>
      </div>

      {/* SECTION 2: INDIVIDUAL PAYMENTS (BAR CHART) */}
      <div className="p-8 bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        <header className="mb-10 flex justify-between items-center">
          <h3 className="text-2xl font-black italic uppercase text-white tracking-tighter">Individual Payment Streams</h3>
          <span className="text-[10px] font-mono text-white/70 uppercase tracking-widest font-black">[ Recent_Transactions ]</span>
        </header>
        
        <div className="h-[200px] w-full">
          {recentPaymentsData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={recentPaymentsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis 
                  dataKey="id" 
                  stroke="#ffffff60" 
                  fontSize={9} 
                  tickLine={false} 
                  axisLine={false} 
                  dy={10}
                />
                <Tooltip 
                  cursor={{ fill: '#ffffff05' }}
                  contentStyle={{ backgroundColor: '#000', border: '1px solid #ffffff20', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}
                  itemStyle={{ color: '#06b6d4' }}
                  formatter={(value) => [`$${value}`, "Payment Amount"]}
                />
                <Bar 
                  dataKey="amount" 
                  fill="#06b6d4" 
                  radius={[6, 6, 0, 0]} 
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-white/20 font-mono text-xs uppercase tracking-[0.5em] border border-dashed border-white/5 rounded-3xl">
              Zero_Signals_Detected
            </div>
          )}
        </div>
      </div>

      {/* SECTION 3: TOP VARIANTS */}
      <div className="p-8 bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] shadow-xl">
        <header className="mb-8 flex items-center gap-6">
          <h3 className="text-2xl font-black italic uppercase text-white tracking-tighter">Top Sellers</h3>
          <div className="flex-1 h-[1px] bg-white/10" />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.length > 0 ? bestSellers.map((item, index) => (
            <div key={item.name} className="p-6 border border-white/10 rounded-3xl bg-white/[0.02] hover:bg-white/[0.05] hover:border-green-500/30 transition-all group">
              <div className="flex justify-between items-start mb-6">
                <span className="text-[10px] font-mono text-green-500 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-lg font-black tracking-widest uppercase">Rank_0{index + 1}</span>
                <span className="text-[11px] font-mono text-white/80 font-black tracking-tight uppercase">{item.qty} Sold</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-black rounded-xl p-2 border border-white/5">
                    <img src={item.img} className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-700" alt="" />
                </div>
                <div>
                  <h5 className="text-sm font-black uppercase italic text-white tracking-tight leading-none">{item.name}</h5>
                  <p className="text-green-500 font-mono text-xs mt-2 font-black italic">${item.revenue.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-4 py-24 text-center text-white/20 font-mono text-xs uppercase tracking-[0.5em] border border-dashed border-white/10 rounded-[2rem]">
              Waiting_For_Market_Data...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;