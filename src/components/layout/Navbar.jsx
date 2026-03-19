import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";
import Logo from "./Logo";
import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { totalQuantity } = useSelector((state) => state.cart);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    setIsMenuOpen(false);
    navigate("/login");
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="fixed top-2 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl bg-[#0a0a0a] border border-white/10 px-6 py-3 flex justify-between items-center z-[100] rounded-full shadow-2xl">
      {/* LEFT: Logo */}
      <Link to="/" onClick={closeMenu} className="z-[120]">
        <Logo />
      </Link>

      {/* RIGHT SIDE GROUP */}
      <div className="flex items-center gap-4 md:gap-8">
        
        {/* 1. Desktop Links (Hidden on mobile) */}
        <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-gray-400">
          <Link to="/" className="hover:text-white transition-colors">Shop</Link>
          <Link to="/cart" className="relative group">
            <span className="text-xl group-hover:scale-110 block transition-transform">🛒</span>
            {totalQuantity > 0 && (
              <span className="absolute -top-2 -right-2 bg-green-500 text-black text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-black">
                {totalQuantity}
              </span>
            )}
          </Link>
          {isAuthenticated ? (
            <div className="flex items-center gap-6 border-l border-white/10 pl-8">
              <Link to="/profile" className="text-white hover:text-green-500 transition-colors lowercase font-medium">
                Hi, <span className="text-green-500">{user?.name}</span>
              </Link>
              <button onClick={handleLogout} className="bg-white/5 hover:bg-red-500/20 hover:text-red-500 border border-white/10 px-5 py-2 rounded-full transition-all text-xs">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <Link to="/login" className="hover:text-white transition-colors">Login</Link>
              <Link to="/register" className="bg-white text-black px-6 py-2 rounded-full hover:bg-green-500 transition-all font-bold">
                Join
              </Link>
            </div>
          )}
        </div>

        {/* 2. Mobile Cart Icon (Always visible next to burger) */}
        <Link to="/cart" onClick={closeMenu} className="md:hidden relative z-[120] mr-2">
          <span className="text-xl">🛒</span>
          {totalQuantity > 0 && (
            <span className="absolute -top-2 -right-2 bg-green-500 text-black text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
              {totalQuantity}
            </span>
          )}
        </Link>

        {/* 3. Hamburger Toggle */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden z-[120] text-white text-2xl w-10 h-10 flex items-center justify-center"
        >
          {isMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* MOBILE MENU OVERLAY (The Background) */}
      <div className={`
        fixed top-0 left-0 w-full h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-10 transition-all duration-500 ease-in-out z-[110]
        ${isMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"}
      `}>
        {/* Background Decorative Element (Optional) */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-500/10 blur-[120px] rounded-full" />

        <Link to="/" onClick={closeMenu} className="text-3xl font-bold uppercase tracking-widest text-white hover:text-green-500">Shop</Link>
        
        <div className="h-[1px] w-12 bg-white/10" /> {/* Divider */}

        {isAuthenticated ? (
          <>
            <Link to="/profile" onClick={closeMenu} className="text-xl text-white">
              Account: <span className="text-green-500">{user?.name}</span>
            </Link>
            <button onClick={handleLogout} className="bg-red-500/10 text-red-500 border border-red-500/20 px-10 py-3 rounded-full font-bold uppercase tracking-tighter">
              Logout
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-6 w-full px-10">
            <Link to="/login" onClick={closeMenu} className="text-2xl text-white font-bold uppercase tracking-widest">Login</Link>
            <Link to="/register" onClick={closeMenu} className="w-full max-w-[250px] text-center bg-white text-black py-4 rounded-full font-black text-xl hover:bg-green-500 transition-colors">
              Join Now
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;