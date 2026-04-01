import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/apiClient';
import { Link } from 'react-router-dom';

const Variants = () => {
  // Fetching all products
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await apiClient.get('/products');
      return response.data;
    }
  });

  // Filter out VOID Zero so we only show the new variants
  const variants = products?.filter(p => p.id !== 'p1') || [];

  if (isLoading) return <div className="min-h-screen pt-32 text-center text-cyan-500 animate-pulse font-mono">SCANNING VARIANTS...</div>;

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 max-w-7xl mx-auto text-white">
      {/* Collection Header */}
      <div className="text-center mb-20">
        <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-6">
          The <span className="text-cyan-400">Trinity</span> Protocol
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto font-mono text-sm uppercase tracking-[0.2em] leading-relaxed">
          Three distinct formulas. Three paths to optimization. Choose your operative state: Flow for cognitive fluidity, Form for physical architecture, or Rite for absolute focus.
        </p>
      </div>

      {/* Variants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {variants.map((variant) => (
          <Link to={`/product/${variant.id}`} key={variant.id} className="group block">
            <div className="bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-8 hover:border-cyan-500/50 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden h-full flex flex-col">
              
              {/* Background Glow Effect on Hover */}
              <div className="absolute inset-0 bg-cyan-500/0 group-hover:bg-cyan-500/5 transition-colors duration-500"></div>

              <div className="h-64 bg-white/5 rounded-2xl mb-8 overflow-hidden flex items-center justify-center border border-white/5 group-hover:border-cyan-500/20 transition-all relative">
              {/* The Actual Product Image */}
              <img 
                src={variant.image} 
                alt={variant.name} 
                className="w-full h-full object-contain p-8 group-hover:scale-110 transition-transform duration-500"
              />
              
              {/* Optional: Subtle Overlay Shadow for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </div>
              
              <h2 className="text-3xl font-black uppercase italic tracking-tight mb-3">
                {variant.name}
              </h2>
              
              <p className="text-gray-500 text-sm mb-8 flex-grow">
                {variant.description}
              </p>
              
              <div className="flex items-center justify-between border-t border-white/10 pt-6 mt-auto">
                <span className="text-2xl font-black italic text-white">${variant.price}</span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-500 group-hover:text-cyan-400 transition-colors">
                  Initialize →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Variants;