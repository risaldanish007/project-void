import React from 'react';

const VoidLoader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center w-screen h-screen bg-[#050507] overflow-hidden animate-[voidFadeOut_2.5s_ease-in-out_forwards]">
      
      <div className="relative flex items-center justify-center w-24 h-24 mb-6">
        <div className="absolute w-1.5 h-1.5 bg-zinc-100 rounded-full"></div>
        <div className="absolute w-12 h-12 border border-zinc-700/50 rounded-full animate-[voidPulse_2.5s_ease-in-out_infinite]"></div>
        <div className="absolute w-12 h-12 border border-zinc-300 rounded-full animate-ping opacity-70"></div>
      </div>

      <div className="flex flex-col items-center gap-1.5 font-mono">
        <span className="text-zinc-500 text-[9px] uppercase tracking-[0.6em]">
          INITIALIZING
        </span>
        <span className="text-zinc-100 text-[10px] uppercase tracking-[0.8em] font-light">
          VOID SYSTEMS
        </span>
      </div>

      <style>{`
        @keyframes voidPulse {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.1); opacity: 0.6; }
        }
        
        @keyframes voidFadeOut {
          0%, 80% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default VoidLoader;