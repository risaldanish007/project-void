import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-12">
        <header className="mb-12 border-b border-white/5 pb-8 flex justify-between items-end">
          <div>
            <span className="text-green-500 font-mono text-[9px] tracking-[0.6em] uppercase animate-pulse">System_Active</span>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter mt-2 text-white">
              ADMIN <span className="text-white/10 font-thin not-italic">panel</span>
            </h1>
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;