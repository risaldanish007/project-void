import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../api/apiClient";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/cartSlice";

const ProductDetail = () => {

    const {id} = useParams();//grabs p1 p2 ... from the url
    const dispatch = useDispatch()

    const {data: product, isloading} =useQuery({
        queryKey:['product', id],
        queryFn: async () => {
            const response = await apiClient.get(`/products/${id}`);
            return response.data;
        }
    })
    if (isloading)return<div className="text-white mt-20 text-center">loading products specs...</div>

    const handleAddToCart = () =>{
      dispatch(addToCart(product));
      alert(`${product.name} added to cart!`)
    }
return (
    <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-12">
      {/* Left: Image */}
      <div className="rounded-3xl overflow-hidden border border-white/10">
        <img src={product?.image}
             alt={product?.name}
        className="w-full h-full object-cover" />
      </div>

      {/* Right: Info */}
      <div className="flex flex-col justify-center">
        <span className="text-green-500 font-bold uppercase tracking-widest text-sm mb-2">
          {product?.category}
        </span>
        <h1 className="text-5xl font-black text-white uppercase mb-4">{product?.name}</h1>
        <p className="text-gray-400 text-lg leading-relaxed mb-8">{product?.description}</p>
        
        <div className="flex items-center gap-6">
          <span className="text-4xl font-black text-white">${product?.price}</span>
          <button onClick={handleAddToCart} className="flex-1 bg-white text-black py-4 rounded-xl font-black uppercase hover:bg-green-500 hover:text-white transition-all">
            Add to VOID Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;