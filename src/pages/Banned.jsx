import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { logout } from '../store/authSlice'; // Keep if you plan to add a logout button later

const Banned = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appealMessage, setAppealMessage] = useState('');

  // If a normal, active user types /banned, kick them to Home
  useEffect(() => {
    if (!isAuthenticated || user?.status !== 'Banned') {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, user?.status, navigate]);

  const handleTransmit = (e) => {
    e.preventDefault();
    if (!appealMessage.trim()) return;
    
    // Simulate sending the message to your backend
    toast.info("SECURE_TRANSMISSION: Appeal has been logged for review.", {
        theme: "dark",
        icon: "📡"
    });
    
    setAppealMessage('');
    setIsModalOpen(false);
  };

  // If Redux is still loading the ban, show a black screen so it doesn't flash
  if (!isAuthenticated || user?.status !== 'Banned') {
    return <div className="min-h-screen bg-black" />;
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-10 font-mono relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-red-600/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Main Lockout UI */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-20 h-20 border border-red-500/50 rounded-full flex items-center justify-center mb-8 animate-pulse shadow-[0_0_30px_rgba(239,68,68,0.2)]">
          <span className="text-red-500 text-4xl font-black">!</span>
        </div>
        
        <h1 className="text-white text-3xl font-black uppercase italic tracking-tighter mb-4">
          Access_Revoked
        </h1>
        
        <div className="max-w-md text-center space-y-4 mb-10">
          <p className="text-white/40 text-xs leading-relaxed uppercase tracking-[0.2em]">
            Your identity has been decommissioned from the <span className="text-white">VOID ENERGY</span> grid.
          </p>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />
          <p className="text-red-500/50 text-[10px] uppercase tracking-widest font-bold">
            Further notice will be transmitted
          </p>
        </div>

        <div className="flex flex-col gap-4 w-full max-w-xs">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full text-white border border-white/10 px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all"
          >
            Appeal Suspension
          </button>
        </div>
      </div>

      {/* --- IN-PAGE CONTACT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/95 backdrop-blur-xl p-6">
          <div className="bg-[#0a0a0a] border border-red-500/30 w-full max-w-md rounded-[2.5rem] p-8 shadow-[0_0_60px_rgba(239,68,68,0.1)] relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            
            <header className="mb-8">
                <span className="text-red-500 font-mono text-[10px] tracking-[0.5em] uppercase block mb-2 font-black">Secure // Channel</span>
                <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">Submit Appeal</h2>
            </header>

            <form onSubmit={handleTransmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] font-mono uppercase text-white/30 tracking-widest font-black block ml-2">Registered_Identity</label>
                <input 
                  type="text" 
                  readOnly 
                  value={user?.email || 'UNKNOWN_ENTITY'} 
                  className="w-full bg-white/5 border border-white/5 rounded-xl px-5 py-3 text-white/40 font-mono text-[10px] outline-none cursor-not-allowed"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-mono uppercase text-white/30 tracking-widest font-black block ml-2">Statement_of_Appeal</label>
                <textarea 
                  required
                  value={appealMessage}
                  onChange={(e) => setAppealMessage(e.target.value)}
                  placeholder="Detail the error in your decommissioning..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white font-mono text-[11px] outline-none focus:border-red-500/50 transition-all placeholder:text-white/20 h-32 resize-none custom-scrollbar"
                />
              </div>

              <div className="flex gap-4 pt-6 border-t border-white/5">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 text-[10px] font-mono uppercase text-white/40 hover:text-white transition-colors font-black tracking-widest"
                >
                  Abort
                </button>
                <button 
                  type="submit"
                  className="flex-[2] bg-red-600/10 text-red-500 border border-red-500/20 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-red-500 hover:text-white transition-all shadow-lg"
                >
                  Transmit
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default Banned;