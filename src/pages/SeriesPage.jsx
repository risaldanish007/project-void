import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/apiClient';
import { COLLECTIONS } from '../utils/constants';
import { addToCart } from '../store/cartSlice';
import { useDispatch } from 'react-redux'; // Added dispatch
import { toast } from 'react-toastify';

const SeriesPage = () => {
  const { seriesId } = useParams();
  const dispatch = useDispatch(); // Initialize dispatch
  const currentCollection = COLLECTIONS.find(c => c.id === seriesId);

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await apiClient.get('/products');
      return response.data;
    }
  });

  const seriesProducts = products?.filter(product => product.series === seriesId) || [];

  if (isLoading) return <div className="min-h-screen bg-black flex items-center justify-center font-mono text-xs text-white/20 tracking-widest uppercase">Syncing...</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-32 px-6">      
      {/* --- BREADCRUMBS & HEADER --- */}
      <header className="max-w-7xl mx-auto mb-16">
        <nav className="flex items-center gap-2 mb-6 font-mono text-[10px] uppercase tracking-widest text-white/30">
          <Link to="/" className="hover:text-white transition-colors">Hub</Link>
          <span>/</span>
          <span className="text-white/60">{seriesId}</span>
        </nav>
        
        <h1 className="text-5xl font-black uppercase italic tracking-tighter">
          {currentCollection?.title}
        </h1>
        <p className="mt-4 max-w-xl text-gray-500 text-sm leading-relaxed uppercase tracking-tight">
          {currentCollection?.description}
        </p>
      </header>

      {/* --- STANDARD 3-COLUMN GRID --- */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {seriesProducts.map((product) => (
          <Link 
            to={`/product/${product.id}`} 
            key={product.id} 
            className="group flex flex-col bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300"
          >
            {/* 16:9 Image Container */}
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-black flex items-center justify-center">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Subtle Overlay on Hover */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Content Area */}
            <div className="p-8 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-black uppercase italic tracking-tight text-white/90">
                  {product.name}
                </h3>
                <span className="font-mono text-sm text-white/40">
                  ${product.price}
                </span>
              </div>
              
              <p className="text-gray-500 text-xs leading-relaxed mb-8 flex-grow">
                {product.description}
              </p>

              {/* Action Buttons */}
              <div className="mt-auto pt-6 border-t border-white/5 flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-white group-hover:underline">
                  View Data →
                </span>

                {/* Minimal Add to Cart Button */}
                <button 
                  onClick={(e) => {
                    e.preventDefault(); // Stop navigation to product page
                    dispatch(addToCart(product));
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
                  className="text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:text-emerald-400 transition-colors"
                >
                  + add to cart
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SeriesPage;