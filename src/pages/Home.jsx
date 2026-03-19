import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/apiClient';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';


const Home = () => {
  // Fetching the goods from the VOID server
  const dispatch = useDispatch()
  const { data: products, isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await apiClient.get('/products');
      return response.data;
    }
  });

  if (isLoading) return <div className="flex justify-center mt-20 text-white animate-pulse">Scanning the VOID for products...</div>;
  if (isError) return <div className="text-center mt-20 text-red-500">Signal lost. Check your database connection.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Hero Section */}
      <header className="text-center py-16">
        <h1 className="text-6xl font-black tracking-tighter text-gray-400 uppercase italic italic">Pure Signal . No Noise .</h1>
        <p className="text-gray-400 mt-4 text-xl">The ultimate energy source for modern web builders.</p>
      </header>

      {/* Product Grid - Tailwind Magic */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 pb-20">
        {products?.map((product) => (
          <div key={product.id} className="group bg-[#111] border border-white/10 p-6 rounded-2xl hover:border-green-500 transition-all duration-300">
            <Link to={`/product/${product.id}`} key={product.id} className="group">
                <div className="overflow-hidden rounded-xl mb-6">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500" 
              />
            </div>
            </Link>
            
            <h3 className="text-2xl font-bold text-white uppercase tracking-tight">{product.name}</h3>
            <p className="text-gray-500 text-sm mt-3 line-clamp-2">{product.description}</p>
            
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/5">
              <span className="text-3xl font-black text-white">${product.price}</span>
                <button 
                    onClick={(e) => {
                        e.preventDefault(); // Stops the Link from opening the detail page
                        dispatch(addToCart(product));
                        alert(`${product.name} added to VOID Cart!`);
                    }}
                    className="bg-white text-black px-6 py-2 rounded-full font-bold uppercase text-xs hover:bg-green-500 hover:text-white transition-colors">
                Add to Cart
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;