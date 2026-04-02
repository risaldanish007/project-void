import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white py-10 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        
        {/* MAIN ROW: BRAND & NAVIGATION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 mb-10">
          
          {/* LOGO GROUP */}
          <div className="flex items-center gap-6">
            <h2 className="text-lg font-black italic uppercase tracking-tighter">
              VOID<span className="text-green-500">ENERGY</span>
            </h2>
            <div className="h-4 w-[1px] bg-white/10 hidden md:block" />
            <p className="hidden md:block text-[9px] uppercase tracking-[0.2em] text-white/30">
              pure-siginal
            </p>
          </div>

          {/* NAV LINKS - Flattened to one row */}
          <nav className="flex flex-wrap gap-x-8 gap-y-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">
            <Link to="/series/VOID" className="hover:text-white transition-colors">Void</Link>
            <Link to="/series/FLOW" className="hover:text-white transition-colors">Flow</Link>
            <Link to="/series/FORM" className="hover:text-white transition-colors">Form</Link>
            <Link to="/series/RITE" className="hover:text-white transition-colors">Rite</Link>
            <Link to="/about" className="hover:text-white transition-colors ml-4 border-l border-white/10 pl-8">About</Link>
            <Link to="/contact" className="hover:text-white transition-colors">contact</Link>
          </nav>

          {/* COMPACT NEWSLETTER */}
          <div className="relative w-full md:w-64 border-b border-white/10 pb-1">
            <input 
              type="email" 
              placeholder="JOIN_SIGNAL" 
              className="bg-transparent text-[10px] font-mono text-white placeholder:text-white/10 focus:outline-none w-full uppercase"
            />
            <button className="absolute right-0 bottom-1 text-[10px] hover:text-green-500 transition-colors">
              →
            </button>
          </div>
        </div>

        {/* BOTTOM BAR: LEGAL & STATUS */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-white/5 gap-4">
          
          <div className="flex items-center gap-6 text-[9px] font-mono text-white/20 uppercase tracking-[0.2em]">
            <span>© {currentYear} VOID_CORP</span>
            <div className="flex items-center gap-2 text-green-500/50">
              <span className="flex h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              Signal_Nominal
            </div>
          </div>

          <div className="flex gap-8">
            {["INSTAGRAM", "DISCORD", "X"].map((social) => (
              <a 
                key={social}
                href="#" 
                className="text-[9px] font-bold uppercase tracking-widest text-white/20 hover:text-white transition-colors"
              >
                {social}
              </a>
            ))}
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;