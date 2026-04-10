import React from 'react';
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

  // Filtering out the primary hero product (p1) to show alternative variants
  const variants = products?.filter(p => p.id !== 'p1') || [];

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    // Inventory Guard
    if (product.stock <= 0) {
      toast.error("ERROR: Inventory depleted.");
      return;
    }

    dispatch(addToCart(product));
    toast.success(`${product.name} // SECURED`, {
      position: "bottom-right",
      autoClose: 1000,
      theme: "dark",
      hideProgressBar: true,
    });
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-black font-mono text-[10px] text-white/60 tracking-[0.5em] animate-pulse font-black uppercase">
      Synchronizing_Product_Matrix...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-20 px-6">
      
      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Header Section */}
        <header className="mb-12 border-l-2 border-white/20 pl-6">
          <span className="text-green-500 font-mono text-[10px] tracking-[0.4em] uppercase block mb-2 font-black">
            Official_Product_Series // Trinity
          </span>
          <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-white">
            Product <span className="text-white/30 font-thin not-italic">Variants</span>
          </h1>
        </header>

        {/* Variant Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {variants.map((variant, index) => {
            const isOutOfStock = variant.stock <= 0;
            const isLowStock = variant.stock > 0 && variant.stock <= 5;

            return (
              <motion.div
                key={variant.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Link to={`/product/${variant.id}`} className="block">
                  <div className={`bg-white/[0.03] border rounded-3xl p-8 transition-all duration-500 
                    ${isOutOfStock 
                      ? 'border-white/5 opacity-60 grayscale' 
                      : 'border-white/10 hover:border-green-500/40 hover:bg-white/[0.05]'}`}>
                    
                    {/* Status Identification */}
                    <div className="flex justify-between items-center mb-8">
                      <span className="text-white/40 font-mono text-[9px] tracking-widest font-black uppercase">
                        VRSN_0{index + 1}
                      </span>
                      <span className={`text-[9px] font-mono uppercase font-black tracking-widest 
                        ${isOutOfStock ? 'text-red-500' : isLowStock ? 'text-yellow-500' : 'text-green-500'}`}>
                        {isOutOfStock ? '[ Sold_Out ]' : isLowStock ? '[ Limited ]' : '[ Available ]'}
                      </span>
                    </div>

                    {/* Image Footer Print */}
                    <div className="h-52 mb-8 flex items-center justify-center relative">
                      <img 
                        src={variant.image} 
                        alt={variant.name} 
                        className={`h-full w-auto object-contain transition-all duration-700 ease-out 
                          ${!isOutOfStock && 'group-hover:scale-110 group-hover:drop-shadow-[0_0_30px_rgba(34,211,238,0.2)]'}`}
                      />
                    </div>

                    {/* Typography */}
                    <div className="mb-8">
                      <h2 className="text-2xl font-black uppercase italic tracking-tight text-white mb-3">
                        {variant.name}
                      </h2>
                      <p className="text-white/50 text-[11px] font-mono uppercase tracking-wider leading-relaxed line-clamp-2 font-bold">
                        {variant.description}
                      </p>
                    </div>

                    {/* Commercial Actions */}
                    <div className="flex items-center justify-between pt-6 border-t border-white/10">
                      <span className="text-xl font-black tracking-tighter text-white">${variant.price}</span>
                      
                      <button 
                        disabled={isOutOfStock}
                        onClick={(e) => handleAddToCart(e, variant)}
                        className={`h-10 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95
                          ${isOutOfStock 
                            ? 'bg-white/5 text-white/20 border border-white/5 cursor-not-allowed' 
                            : 'bg-white text-black hover:bg-green-500 hover:text-white'}`}
                      >
                        {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* System Status Footer */}
        <footer className="mt-20 border-t border-white/5 pt-10 text-center">
          <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.8em] font-black">
            Inventory_Registry // Trinity_Series_Live
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Variants;