import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/apiClient';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import CanViewer from '../components/layout/CanModel';
import { COLLECTIONS } from '../utils/constants';
import { toast } from 'react-toastify';
const Home = () => {
  const dispatch = useDispatch();
  const { data: products, isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await apiClient.get('/products');
      return response.data;
    }
  });

  if (isLoading) return <div className="flex justify-center mt-20 text-white animate-pulse font-mono uppercase tracking-widest text-xs">Scanning the VOID for protocols...</div>;
  if (isError) return <div className="text-center mt-20 text-red-500 font-mono uppercase tracking-widest text-xs">Signal lost. Check database connection.</div>;

  
  return (
    <div className="home-page-wrapper bg-black">
      
      {/* ========================================= */}
      {/* SECTION 1: STICKY HERO                    */}
      {/* ========================================= */}
      <section className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden z-0">
        
        {/* Background Overlay */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat" 
          style={{ 
            backgroundImage: "url('/images/void-bg-vin.png')",
            filter: "brightness(0.7)"
          }}
        />

        {/* Hero Typography */}
        <div className="text-center z-10 pointer-events-none mb-32">
          <h1 className="text-7xl md:text-[8rem] font-black tracking-tighter text-white/30 uppercase italic leading-none drop-shadow-2xl">
            Pure Signal.
          </h1>
        </div>

        {/* 3D Model */}
        <div className="w-full h-full absolute inset-0 z-11"> 
          <CanViewer />
        </div>
      </section>

      {/* ========================================= */}
      {/* SECTION 2: THE MANIFESTO (ABOUT)          */}
      {/* ========================================= */}
      <div className="relative z-30 bg-[#050505] shadow-[0_-20px_50px_rgba(0,0,0,1)]">
        
        {/* Tech Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

        <section className="relative py-32 border-t border-white/5 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            
            {/* 2-Column Asymmetric Vision Block */}
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-24 items-end mb-32">
              <div className="lg:col-span-7">
                <span className="text-green-500 font-mono text-[10px] tracking-[0.4em] uppercase mb-8 block">
                  System Architecture
                </span>
                <h2 className="text-5xl md:text-7xl font-black text-white uppercase italic leading-[0.85] tracking-tighter">
                  Zero Sugar.<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-500 drop-shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                    Infinite Focus.
                  </span>
                </h2>
                <div className="h-1 w-24 bg-gradient-to-r from-green-500 to-transparent mt-12"></div>
              </div>
              
              <div className="lg:col-span-5 flex flex-col justify-end border-l border-white/10 pl-8 md:pl-12">
                <p className="text-gray-400 text-lg md:text-xl leading-relaxed font-light mb-8">
                  VOID is a <span className="text-white font-medium">cognitive performance layer</span> engineered for builders, developers, and creatives demanding sustained mental uptime.
                </p>
                <p className="text-gray-500 text-[10px] font-mono uppercase tracking-[0.2em] leading-loose">
                  Traditional energy relies on spikes. We rely on stability. Treat your mind as biological hardware—optimized with clean fuel to eliminate latency and maintain consistent output.
                </p>
              </div>
            </div>

            {/* Protocol Grid - Tech Schematic Style */}
            <div className="grid grid-cols-2 md:grid-cols-4 border-y border-white/5">
              {[
                { name: "VOID ZERO", function: "Deep Work Baseline" },
                { name: "FLOW IO", function: "Creative Immersion" },
                { name: "FORM PEAK", function: "Physical High-Output" },
                { name: "RITE NOX", function: "Evening Decompression" }
              ].map((item, index) => (
                <div key={item.name} className={`p-8 md:p-12 group hover:bg-white/[0.02] transition-colors ${index !== 3 ? 'md:border-r border-white/5' : ''}`}>
                  <span className="text-white/20 font-mono text-[9px] tracking-[0.3em] uppercase block mb-8 transition-colors group-hover:text-green-500">
                    0{index + 1} // Protocol
                  </span>
                  <h4 className="text-white font-black uppercase italic text-xl tracking-tight mb-2">
                    {item.name}
                  </h4>
                  <p className="text-gray-500 text-[10px] uppercase tracking-widest">
                    {item.function}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ========================================= */}
        {/* SECTION 3: SIGNATURE SPOTLIGHT            */}
        {/* ========================================= */}
        {products && (() => {
          const voidZero = products.find(p => p.name.toLowerCase().includes("void zero"));
          if (!voidZero) return null;

          return (
            <section className="relative py-32 bg-[#020202] border-t border-white/5 overflow-hidden">
              {/* Soft center glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500/5 blur-[150px] rounded-full pointer-events-none" />

              <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-16 lg:gap-32">
                
                {/* Image Container */}
                <div className="w-full md:w-1/2 relative group flex justify-center">
                  <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full scale-75 group-hover:scale-90 transition-transform duration-700" />
                  <img
                    src={voidZero.image}
                    alt={voidZero.name}
                    className="relative z-10 w-full max-w-sm object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-700 hover:-translate-y-4"
                  />
                </div>

                {/* Product Data */}
                <div className="w-full md:w-1/2 text-left">
                  <span className="text-green-500 border border-green-500/30 px-3 py-1 rounded-full font-mono text-[9px] tracking-[0.3em] uppercase mb-8 inline-block">
                    Signature Variant
                  </span>
                  <h3 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter mb-6">
                    {voidZero.name}
                  </h3>
                  
                  {/* Styled Description Block */}
                  <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl mb-10 max-w-lg">
                    <p className="text-gray-400 text-sm leading-relaxed font-light">
                      {voidZero.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-8">
                    <span className="text-4xl font-black text-white font-mono tracking-tighter">
                      ${voidZero.price}
                    </span>
                    <button
                      onClick={() => {
                        dispatch(addToCart(voidZero));
                        console.log(voidZero)
                        toast.success(
                            <div className="flex items-center gap-3 px-2 py-1">
                              <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                                <span className="text-green-600 text-xs">✓</span>
                              </div>
                              <span className="text-gray-800 font-bold text-sm tracking-tight">
                                Added to cart
                              </span>
                            </div>,
                            {
                              // Custom white gradient styling
                              style: {
                                background: "linear-gradient(to bottom right, #ffffff, #f9fafb)",
                              }
                            }
                          );
                        }}
                        className="bg-white text-black px-10 py-4 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-green-500 hover:text-white transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(34,197,94,0.4)]"
                      >
                      Acquire Signal
                    </button>
                    <Link
                      to={`/product/${voidZero.id}`}
                      className="text-[10px] font-mono text-gray-500 hover:text-green-500 uppercase tracking-widest transition-colors"
                    >
                      View Specs →
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          );
        })()}

        {/* ========================================= */}
        {/* SECTION 4: ACTIVE VARIANTS (SERIES)       */}
        {/* ========================================= */}
        <section id="variants" className="py-32 bg-[#050505] border-t border-white/5 relative overflow-hidden">
          
          <div className="max-w-7xl mx-auto px-6">
            
            {/* Header */}
            <div className="flex justify-between items-end mb-16 border-b border-white/10 pb-6">
              <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-white">
                Active Variants
              </h2>
              <span className="text-cyan-500 font-mono text-[10px] tracking-[0.3em] uppercase hidden md:block">
                Select_Protocol
              </span>
            </div>

            {/* Series Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {COLLECTIONS.map((collection, index) => (
                <Link 
                  to={`/series/${collection.id}`} 
                  key={collection.id} 
                  className="group block relative h-[280px] rounded-3xl overflow-hidden border border-white/10 bg-[#0a0a0a]"
                >
                  {/* Background Hover Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent group-hover:from-cyan-500/10 transition-colors duration-500" />
                  
                  {/* Content Structure */}
                  <div className="relative z-10 h-full p-10 flex flex-col justify-between">
                    
                    {/* Top Row */}
                    <div className="flex justify-between items-start">
                      <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-cyan-500 border border-cyan-500/20 px-3 py-1 rounded-full">
                        {collection.subtitle}
                      </span>
                      <span className="text-white/20 font-mono text-xs group-hover:text-white transition-colors">
                        0{index + 1}
                      </span>
                    </div>

                    {/* Bottom Row */}
                    <div>
                      <h3 className="text-4xl font-black uppercase italic tracking-tighter text-white mb-3 group-hover:translate-x-2 transition-transform duration-300">
                        {collection.title}
                      </h3>
                      <p className="text-gray-500 text-xs font-mono uppercase tracking-widest max-w-sm line-clamp-2">
                        {collection.description}
                      </p>
                    </div>

                  </div>
                </Link>
              ))}
            </div>

            {/* Bottom System Status */}
            <div className="mt-24 border-t border-white/5 pt-8 flex justify-center">
              <p className="text-[9px] font-mono text-white/20 uppercase tracking-[0.5em] flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                System Nominal
              </p>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
};

export default Home;