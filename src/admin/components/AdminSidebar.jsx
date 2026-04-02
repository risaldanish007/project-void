import { NavLink } from 'react-router-dom';

const AdminSidebar = () => {
  const links = [
    { name: 'Dashboard', path: '/admin', icon: '⌬' },
    { name: 'Inventory', path: '/admin/inventory', icon: '⧉' },
  ];

  return (
    <aside className="w-64 bg-[#0a0a0a] border-r border-white/5 fixed inset-y-0 left-0 flex flex-col p-8 z-50">
      <div className="mb-16">
        <h2 className="text-2xl font-black italic tracking-tighter text-white">VOID<span className="text-green-500">CORP</span></h2>
        <span className="text-[8px] font-mono text-white/20 uppercase tracking-[0.5em]">Architect_v.2.0</span>
      </div>

      <nav className="flex-1 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            end={link.path === '/admin'}
            className={({ isActive }) => `
              flex items-center gap-4 px-5 py-3 rounded-xl transition-all font-mono text-[10px] uppercase tracking-[0.3em]
              ${isActive ? 'bg-white text-black font-bold' : 'text-gray-500 hover:text-white hover:bg-white/5'}
            `}
          >
            <span>{link.icon}</span> {link.name}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-8 border-t border-white/5">
        <NavLink to="/" className="text-white/20 hover:text-green-500 font-mono text-[9px] tracking-widest uppercase transition-colors">
          ← Exit_Console
        </NavLink>
      </div>
    </aside>
  );
};

export default AdminSidebar;