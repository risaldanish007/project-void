import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

const AdminLink = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Security Check: If not an admin, this component is invisible
  if (!isAuthenticated || user?.role !== 'admin') return null;

  return (
    <NavLink 
      to="/admin" 
      className="group flex items-center gap-2 px-4 py-2 border border-green-500/20 rounded-full bg-green-500/5 hover:bg-green-500/10 transition-all duration-300"
    >
      {/* Small pulsing indicator to show "Live" admin session */}
      <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></span>
      
      <span className="text-[10px] font-mono text-green-500 uppercase tracking-[0.2em] group-hover:text-white transition-colors">
        Admin_Panel
      </span>
    </NavLink>
  );
};

export default AdminLink;