import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/apiClient';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const Variants = () => {
  const dispatch = useDispatch();
  
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await apiClient.get('/products');
      return response.data;
    }
  });

  const variants = products?.filter(p => p.id !== 'p1') || [];

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart(product));
    toast.success(`${product.name} // LOCKED`, {
      position: "bottom-right",
      autoClose: 1000,
      theme: "dark",
      hideProgressBar: true,
    });
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-black font-mono text-[9px] text-white/40 tracking-[0.5em] animate-pulse">SYNCHRONIZING_VARIANTS...</div>;

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-20 px-6 font-light">
      
      {/* Tightened Container */}
      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Minimal Header */}
        <header className="mb-12 border-l border-white/10 pl-6">
          <span className="text-green-500 font-mono text-[9px] tracking-[0.4em] uppercase block mb-2">
            Protocol_Series // Trinity
          </span>
          <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-white">
            Variant <span className="text-white/20 font-thin not-italic">Matrix</span>
          </h1>
        </header>

        {/* Compact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {variants.map((variant, index) => (
            <motion.div
              key={variant.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <Link to={`/product/${variant.id}`} className="block">
                <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 hover:border-green-500/40 hover:bg-white/[0.05] transition-all duration-300">
                  
                  {/* Top Identifier */}
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-white/20 font-mono text-[9px] tracking-widest">
                      TRINITY_V{index + 1}
                    </span>
                    <span className="text-[9px] font-mono text-green-500/40 uppercase">Active</span>
                  </div>

                  {/* Compact Image footprint */}
                  <div className="h-44 mb-6 flex items-center justify-center relative">
                    <img 
                      src={variant.image} 
                      alt={variant.name} 
                      className="h-full w-auto object-contain grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500 ease-out"
                    />
                  </div>

                  {/* Scaled-down Typography */}
                  <div className="mb-6">
                    <h2 className="text-xl font-black uppercase italic tracking-tight text-white mb-2">
                      {variant.name}
                    </h2>
                    <p className="text-gray-500 text-[10px] font-mono uppercase tracking-wider leading-relaxed line-clamp-2">
                      {variant.description}
                    </p>
                  </div>

                  {/* Action Bar */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <span className="text-lg font-thin tracking-tighter text-white/70">${variant.price}</span>
                    
                    <button 
                      onClick={(e) => handleAddToCart(e, variant)}
                      className="bg-white text-black h-9 px-5 rounded-full font-bold text-[9px] uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all active:scale-95"
                    >
                      Acquire
                    </button>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Footer Status */}
        <footer className="mt-16 text-center">
          <p className="text-[8px] font-mono text-white/5 uppercase tracking-[1em]">
            Deployment_Ready // 002-004
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Variants;