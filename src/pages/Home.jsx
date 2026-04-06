import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/apiClient';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import CanViewer from '../components/layout/CanModel';
import { COLLECTIONS } from '../utils/constants';
import { toast } from 'react-toastify';

const Home = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const { data: products, isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await apiClient.get('/products');
      return response.data;
    }
  });

  const handleAddToCart = (product) => {
    const itemInCart = cartItems.find(item => item.id === product.id);
    const currentQty = itemInCart ? itemInCart.quantity : 0;
    const availableStock = Number(product.countInStock ?? product.stock ?? 0);

    // Rule: Unique ID prevents toast stacking/spam
    const TOAST_ID = "void-cart-signal";

    if (availableStock <= 0 || currentQty >= availableStock) {
      toast.error("LIMIT_REACHED", {
        toastId: TOAST_ID,
        icon: false,
        className: 'bg-black border border-red-500/40 rounded-none font-mono text-[10px] text-red-500 tracking-[0.3em] px-6'
      });
      return;
    }

    dispatch(addToCart(product));

    toast.success("SIGNAL_ACQUIRED", {
      toastId: TOAST_ID,
      icon: false,
      className: 'bg-black border border-white/10 rounded-none font-mono text-[10px] text-white tracking-[0.3em] px-6',
      progressClassName: 'bg-green-500'
    });
  };

  if (isLoading) return <div className="flex justify-center mt-20 text-white animate-pulse font-mono uppercase tracking-widest text-xs">Scanning the VOID...</div>;
  if (isError) return <div className="text-center mt-20 text-red-500 font-mono uppercase tracking-widest text-xs">Signal lost.</div>;

  return (
    <div className="home-page-wrapper bg-black">
      
      {/* SECTION 1: STICKY HERO */}
      <section className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden z-0">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat" 
          style={{ 
            backgroundImage: "url('/images/void-bg-vin.png')",
            filter: "brightness(0.7)"
          }}
        />
        <div className="text-center z-10 pointer-events-none mb-32">
          <h1 className="text-7xl md:text-[8rem] font-black tracking-tighter text-white/30 uppercase italic leading-none drop-shadow-2xl">
            Pure Signal.
          </h1>
        </div>
        <div className="w-full h-full absolute inset-0 z-11"> 
          <CanViewer />
        </div>
      </section>

      {/* SECTION 2: THE MANIFESTO */}
      <div className="relative z-30 bg-[#050505] shadow-[0_-20px_50px_rgba(0,0,0,1)]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

        <section className="relative py-32 border-t border-white/5 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid lg:grid-cols-12 gap-12 items-end mb-32">
              <div className="lg:col-span-7">
                <span className="text-green-500 font-mono text-[10px] tracking-[0.4em] uppercase mb-8 block">System Architecture</span>
                <h2 className="text-5xl md:text-7xl font-black text-white uppercase italic leading-[0.85] tracking-tighter">
                  Zero Sugar.<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-500">Infinite Focus.</span>
                </h2>
                <div className="h-1 w-24 bg-gradient-to-r from-green-500 to-transparent mt-12"></div>
              </div>
              <div className="lg:col-span-5 flex flex-col justify-end border-l border-white/10 pl-8">
                <p className="text-gray-400 text-lg font-light mb-8">VOID is a cognitive performance layer engineered for high-output builders.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 border-y border-white/5">
              {[
                { name: "VOID ZERO", function: "Deep Work Baseline" },
                { name: "FLOW IO", function: "Creative Immersion" },
                { name: "FORM PEAK", function: "Physical High-Output" },
                { name: "RITE NOX", function: "Evening Decompression" }
              ].map((item, index) => (
                <div key={item.name} className="p-8 md:p-12 group hover:bg-white/[0.02] transition-colors border-r border-white/5 last:border-r-0">
                  <span className="text-white/20 font-mono text-[9px] uppercase block mb-8 group-hover:text-green-500">0{index + 1} // Protocol</span>
                  <h4 className="text-white font-black uppercase italic text-xl mb-2">{item.name}</h4>
                  <p className="text-gray-500 text-[10px] uppercase tracking-widest">{item.function}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3: SIGNATURE SPOTLIGHT */}
        {products && (() => {
          const voidZero = products.find(p => p.name.toLowerCase().includes("void zero"));
          if (!voidZero) return null;

          const stockVal = Number(voidZero.countInStock ?? voidZero.stock ?? 0);
          const isOutOfStock = stockVal <= 0;

          return (
            <section className="relative py-32 bg-[#020202] border-t border-white/5 overflow-hidden">
              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] blur-[150px] rounded-full pointer-events-none transition-colors duration-1000 ${isOutOfStock ? 'bg-red-500/5' : 'bg-green-500/5'}`} />

              <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-16 lg:gap-32">
                <div className="w-full md:w-1/2 relative group flex justify-center">
                  <div className={`absolute inset-0 blur-3xl rounded-full scale-75 transition-all duration-700 ${isOutOfStock ? 'bg-red-500/10' : 'bg-green-500/20 group-hover:scale-90'}`} />
                  <img
                    src={voidZero.image}
                    alt={voidZero.name}
                    className={`relative z-10 w-full max-w-sm object-contain transition-all duration-700 ${isOutOfStock ? 'grayscale opacity-30 scale-95' : 'hover:-translate-y-4'}`}
                  />
                </div>

                <div className="w-full md:w-1/2 text-left">
                  <span className="text-green-500 border border-green-500/30 px-3 py-1 rounded-full font-mono text-[9px] tracking-[0.3em] uppercase mb-8 inline-block">Signature Variant</span>
                  <h3 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter mb-6">{voidZero.name}</h3>
                  <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl mb-10 max-w-lg">
                    <p className="text-gray-400 text-sm font-light">{voidZero.description}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-8">
                    <span className={`text-4xl font-black font-mono tracking-tighter ${isOutOfStock ? 'text-gray-700 line-through' : 'text-white'}`}>
                      ${voidZero.price}
                    </span>
                    <button
                      disabled={isOutOfStock}
                      onClick={() => handleAddToCart(voidZero)}
                      className={`px-10 py-4 rounded-full font-black uppercase text-[10px] tracking-widest transition-all active:scale-95 
                        ${isOutOfStock 
                          ? 'bg-gray-900 text-gray-600 cursor-not-allowed border border-white/5 opacity-50' 
                          : 'bg-white text-black hover:bg-green-500 hover:text-white shadow-[0_0_20px_rgba(255,255,255,0.1)]'}`}
                    >
                      {isOutOfStock ? 'Signal Lost' : 'Acquire Signal'}
                    </button>
                    <Link to={`/product/${voidZero.id}`} className="text-[10px] font-mono text-gray-500 hover:text-green-500 uppercase tracking-widest transition-colors">View Specs →</Link>
                  </div>
                </div>
              </div>
            </section>
          );
        })()}

        {/* SECTION 4: VARIANTS */}
        <section id="variants" className="py-32 bg-[#050505] border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 text-center">
             <div className="grid md:grid-cols-2 gap-6">
              {COLLECTIONS.map((collection) => (
                <Link to={`/series/${collection.id}`} key={collection.id} className="group block relative h-[280px] rounded-3xl overflow-hidden border border-white/10 bg-[#0a0a0a]">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent group-hover:from-cyan-500/10 transition-colors duration-500" />
                  <div className="relative z-10 h-full p-10 flex flex-col justify-between text-left">
                    <span className="font-mono text-[9px] uppercase text-cyan-500 border border-cyan-500/20 px-3 py-1 rounded-full w-fit">{collection.subtitle}</span>
                    <h3 className="text-4xl font-black uppercase italic text-white group-hover:translate-x-2 transition-transform">{collection.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;