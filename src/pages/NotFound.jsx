// src/pages/NotFound.jsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 overflow-hidden relative">
      
      {/* Glitchy Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#111_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-red-500/20 blur-sm animate-pulse" />

      <div className="relative z-10 text-center">
        {/* The Error Code with Flicker */}
        <motion.h1 
          animate={{ 
            opacity: [1, 0.8, 1, 0.5, 1],
            x: [0, -2, 2, -1, 0] 
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 0.2, 
            repeatDelay: 2 
          }}
          className="text-[10rem] md:text-[15rem] font-black italic uppercase tracking-tighter text-white/10 leading-none select-none"
        >
          404
        </motion.h1>

        {/* Tactical Error Message */}
        <div className="mt-[-2rem] md:mt-[-4rem]">
          <span className="text-red-500 font-mono text-[10px] tracking-[0.8em] uppercase block mb-4">
            Critical_Error // Signal_Lost
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter mb-8">
            Out of <span className="text-white/20">Bounds</span>
          </h2>
          
          <p className="max-w-md mx-auto text-gray-500 font-mono text-[10px] uppercase tracking-widest leading-loose mb-12">
            You have attempted to access a non-existent directory in the VOID mainframe. 
            The operative state is currently unmapped.
          </p>

          {/* Recovery Button */}
          <Link to="/">
            <button className="group relative px-12 py-4 border border-white/10 overflow-hidden transition-all hover:border-red-500/50">
              <span className="relative z-10 text-[10px] font-mono tracking-[0.5em] uppercase text-white/40 group-hover:text-white transition-colors">
                Return-Home
              </span>
              <div className="absolute inset-0 bg-red-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </button>
          </Link>
        </div>
      </div>

      {/* Decorative Terminal Lines */}
      <div className="absolute bottom-10 left-10 hidden md:block">
        <p className="text-[8px] font-mono text-white/5 uppercase tracking-[0.5em]">
          Err_Code: 0x000404 <br />
          Status: Terminal_Failure <br />
          Location: Unknown_Sector
        </p>
      </div>
    </div>
  );
};

export default NotFound;