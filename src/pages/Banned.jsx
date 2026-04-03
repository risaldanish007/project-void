const Banned = () => (
  <div className="h-screen bg-black flex flex-col items-center justify-center p-10 text-center">
    <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mb-8 animate-pulse">
      <span className="text-red-500 text-4xl font-black">!</span>
    </div>
    <h1 className="text-white text-3xl font-black uppercase italic tracking-tighter mb-4">Uplink_Severed</h1>
    <p className="text-white/40 font-mono text-xs uppercase tracking-widest max-w-md leading-relaxed">
      Your authorization has been revoked by VOID_CORP logistics. Access to the mainframe is permanently restricted.
    </p>
    <button 
      onClick={() => window.location.href = '/'} 
      className="mt-10 text-[10px] font-mono text-white/20 hover:text-white uppercase tracking-[0.5em] transition-colors"
    >
      ← Return_to_Shadows
    </button>
  </div>
);

export default Banned;