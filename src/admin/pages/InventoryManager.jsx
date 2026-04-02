import { useQuery } from "@tanstack/react-query";
import apiClient from "../../api/apiClient";

const InventoryManager = () => {
  // Fetch all products from the database
  const { data: products, isLoading } = useQuery({
    queryKey: ["adminProducts"],
    queryFn: async () => {
      const response = await apiClient.get("/products");
      return response.data;
    },
  });

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <p className="font-mono text-xs text-green-500 animate-pulse tracking-[0.5em]">REQUIRING_INVENTORY_DATA...</p>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-700">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-xl font-bold uppercase italic tracking-[0.2em] text-white/40">
          Active_Inventory
        </h2>
        <button className="bg-white text-black px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-green-500 hover:scale-105 transition-all">
          + Initialize New Variant
        </button>
      </div>

      <div className="overflow-hidden border border-white/5 rounded-3xl bg-[#0a0a0a]/50 backdrop-blur-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 text-[9px] font-mono text-gray-500 uppercase tracking-[0.3em]">
              <th className="p-6">Variant_Name</th>
              <th className="p-6">Series</th>
              <th className="p-6">Unit_Price</th>
              <th className="p-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {products?.map((product) => (
              <tr key={product.id} className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors group">
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center p-2 border border-white/5">
                        <img src={product.image} alt="" className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500" />
                    </div>
                    <div>
                        <p className="font-black uppercase italic tracking-tighter text-lg">{product.name}</p>
                        <p className="font-mono text-[9px] text-white/20 uppercase tracking-widest">{product.id}</p>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full font-mono text-[9px] uppercase tracking-widest text-gray-400">
                    {product.series}
                  </span>
                </td>
                <td className="p-6 font-mono text-green-500/80 tracking-tighter">
                  ${product.price?.toFixed(2)}
                </td>
                <td className="p-6 text-right">
                  <div className="flex justify-end gap-4">
                    <button className="text-[10px] font-mono text-white/30 hover:text-white uppercase tracking-widest transition-colors">
                      Edit
                    </button>
                    <button className="text-[10px] font-mono text-red-500/30 hover:text-red-500 uppercase tracking-widest transition-colors">
                      Decommission
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryManager;