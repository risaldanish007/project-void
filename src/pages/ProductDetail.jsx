import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../api/apiClient";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/cartSlice";
import { toast } from "react-toastify";

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const response = await apiClient.get(`/products/${id}`);
      return response.data;
    },
  });

  if (isLoading) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white font-black tracking-widest uppercase animate-pulse">
      Synchronizing Void...
    </div>
  );
  
  if (isError || !product) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-red-500 font-black uppercase">
      Product Not Found.
    </div>
  );

  const handleAddToCart = () => {
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
  };

  return (
    <div 
      className="product-page-wrapper"
      style={{ backgroundImage: `url(${product.imageBg})` }}
    >
      <div className="absolute inset-0 bg-black/10"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-10 w-full flex justify-end">
        
        {/* ULTRA-MINIMAL GLASS PANEL */}
        <div className=" mt-25 text-white max-w-md p-8 bg-white/[0.02] backdrop-blur-md rounded-xl border border-white/5 shadow-2xl">
          
          <p className="text-green-500 font-bold uppercase tracking-[0.4em] text-[9px] mb-2">
            {product.category}
          </p>

          <h1 className="text-5xl font-black uppercase mb-4 tracking-tighter">
            {product.name}
          </h1>

          <p className="text-gray-400 text-sm leading-relaxed mb-8">
            {product.description}
          </p>

          {/* MINIMAL INGREDIENTS */}
          <div className="mb-10 grid grid-cols-2 gap-4 border-y border-white/5 py-6">
            {product.ingredients?.map((item, index) => (
              <div key={index} className="flex flex-col">
                <span className="text-white font-bold text-[11px] uppercase tracking-wide">
                  {item.name}
                </span>
                {/* We can keep or remove the benefit here; removing it is more minimal */}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-3xl font-black">${product.price}</span>
            <button 
              onClick={handleAddToCart}
              
              className="bg-white text-black px-8 py-3 rounded-lg font-black uppercase text-xs tracking-widest hover:bg-green-500 hover:text-white transition-colors active:scale-95"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;