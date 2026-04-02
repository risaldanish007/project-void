const AdminDashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="p-8 bg-white/5 border border-white/5 rounded-3xl">
        <p className="text-white/20 font-mono text-[10px] uppercase tracking-widest mb-2">Total_Deployments</p>
        <h3 className="text-4xl font-black italic tracking-tighter text-white">00</h3>
      </div>
      <div className="p-8 bg-white/5 border border-white/5 rounded-3xl">
        <p className="text-white/20 font-mono text-[10px] uppercase tracking-widest mb-2">Active_Operatives</p>
        <h3 className="text-4xl font-black italic tracking-tighter text-white">00</h3>
      </div>
      <div className="p-8 bg-white/5 border border-white/5 rounded-3xl">
        <p className="text-white/20 font-mono text-[10px] uppercase tracking-widest mb-2">System_Integrity</p>
        <h3 className="text-4xl font-black italic tracking-tighter text-green-500 text-green-500">100%</h3>
      </div>
    </div>
  );
};

export default AdminDashboard;