import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../api/apiClient";
import AddProductModal from "../components/AddProductModal";
import { toast } from 'react-toastify';

const InventoryManager = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null); 
  
  // --- FILTER STATES ---
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [stockFilter, setStockFilter] = useState("All");

  const queryClient = useQueryClient();

  const { data: products, isLoading } = useQuery({
    queryKey: ["adminProducts"],
    queryFn: async () => {
      const response = await apiClient.get("/products");
      return response.data;
    },
  });

  // --- FILTRATION LOGIC ---
  const categories = ["All", ...new Set(products?.map(p => p.series || p.category))];

  const filteredProducts = products?.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "All" || product.series === categoryFilter || product.category === categoryFilter;

    const stock = Number(product.stock || 0);
    const matchesStock = 
      stockFilter === "All" ? true :
      stockFilter === "Low Stock" ? (stock > 0 && stock <= 10) :
      stockFilter === "Out of Stock" ? (stock === 0) : true;

    return matchesSearch && matchesCategory && matchesStock;
  });

  const saveMutation = useMutation({
    mutationFn: (data) => selectedProduct 
      ? apiClient.put(`/products/${selectedProduct.id}`, data) 
      : apiClient.post("/products", data),
    onSuccess: () => {
      queryClient.invalidateQueries(["adminProducts"]);
      queryClient.invalidateQueries(["products"]);
      toast.success(selectedProduct ? "SYSTEM_UPDATE: Variant modified." : "SYSTEM_UPDATE: New variant injected.");
      handleCloseModal();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => apiClient.delete(`/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["adminProducts"]);
      queryClient.invalidateQueries(["products"]);
      toast.warn("SYSTEM_ALERT: Variant decommissioned.");
      setProductToDelete(null);
    }
  });

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  if (isLoading) return <div className="text-green-500 font-mono animate-pulse p-10 uppercase tracking-widest text-xs text-center font-bold">Syncing_Mainframe...</div>;

  return (
    <div className="animate-in fade-in duration-700 relative pb-20">
      {/* --- CUSTOM DECOMMISSION ALERT --- */}
      {productToDelete && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/95 backdrop-blur-xl p-6">
          <div className="bg-[#0a0a0a] border border-red-500/30 w-full max-w-md rounded-[2.5rem] p-10 shadow-[0_0_50px_rgba(239,68,68,0.15)] text-center">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-red-500 text-2xl font-black">!</span>
            </div>
            <span className="text-red-500 font-mono text-[10px] tracking-[0.5em] uppercase block mb-2 font-bold">Critical // Decommission_Sequence</span>
            <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white mb-4">Wipe Variant?</h2>
            <p className="text-white/60 text-[12px] font-mono leading-relaxed mb-8">
              Target: <span className="text-white font-bold">{productToDelete.name}</span>. This action will permanently remove the asset from the grid.
            </p>
            <div className="flex gap-4">
              <button onClick={() => setProductToDelete(null)} className="flex-1 text-[11px] font-mono uppercase text-white/50 hover:text-white transition-colors font-bold">Abort</button>
              <button onClick={() => deleteMutation.mutate(productToDelete.id)} className="flex-1 bg-red-600 text-white py-4 rounded-xl text-[10px] font-black uppercase hover:bg-red-500 transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)]">Confirm_Wipe</button>
            </div>
          </div>
        </div>
      )}

      {/* --- MAIN HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
            <h2 className="text-2xl font-bold uppercase italic tracking-[0.2em] text-white/60">Active_Inventory</h2>
            <p className="text-[10px] font-mono text-white/50 uppercase tracking-widest mt-1 font-bold">Uplink Status: {filteredProducts?.length} Variants detected</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-white text-black px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all shadow-xl">
          + Initialize New Variant
        </button>
      </div>

      {/* --- FILTER BAR --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <input 
            type="text" 
            placeholder="SEARCH_BY_NAME_OR_ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-[10px] font-mono text-white outline-none focus:border-green-500/50 placeholder:text-white/30 italic"
        />

        <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-[10px] font-mono text-white/70 outline-none focus:border-green-500/50 cursor-pointer uppercase"
        >
            {categories.map(cat => <option key={cat} value={cat} className="bg-black">{cat} SERIES</option>)}
        </select>

        <select 
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-[10px] font-mono text-white/70 outline-none focus:border-green-500/50 cursor-pointer uppercase"
        >
            <option value="All" className="bg-black">All Availability</option>
            <option value="Low Stock" className="bg-black">Low Stock (Critical)</option>
            <option value="Out of Stock" className="bg-black">Out of Stock (Wiped)</option>
        </select>
      </div>

      {/* --- TABLE CONTENT --- */}
      <div className="overflow-hidden border border-white/10 rounded-3xl bg-[#0a0a0a]/60 backdrop-blur-md shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-[10px] font-mono text-white/60 uppercase tracking-[0.3em] bg-white/[0.03]">
              <th className="p-6">Variant</th>
              <th className="p-6">Stock Status</th>
              <th className="p-6">Price</th>
              <th className="p-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-[12px] font-mono uppercase">
            {filteredProducts?.length > 0 ? filteredProducts.map((product) => {
              const stock = Number(product.stock || 0);
              const isLow = stock > 0 && stock <= 10;
              const isEmpty = stock === 0;

              return (
                <tr key={product.id} className="border-b border-white/[0.05] hover:bg-white/[0.03] transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className={`absolute inset-0 blur-lg rounded-full opacity-0 group-hover:opacity-20 transition-opacity ${isEmpty ? 'bg-red-500' : 'bg-green-500'}`} />
                        <img src={product.image} alt="" className="w-12 h-12 object-contain grayscale group-hover:grayscale-0 transition-all duration-500 relative z-10" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white font-black italic tracking-tighter text-sm">{product.name}</span>
                        <span className="text-[10px] text-white/50 tracking-widest font-bold">UID: {product.id}</span>
                      </div>
                    </div>
                  </td>
                  
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-black italic ${isEmpty ? 'text-red-500' : isLow ? 'text-yellow-500' : 'text-white'}`}>
                        {stock} Units
                      </span>
                      {isEmpty && <span className="text-[9px] px-3 py-1 bg-red-500/20 text-red-500 border border-red-500/30 rounded-full animate-pulse font-bold tracking-tighter">EMPTY</span>}
                      {isLow && <span className="text-[9px] px-3 py-1 bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 rounded-full font-bold tracking-tighter">LOW_STOCK</span>}
                    </div>
                  </td>

                  <td className="p-6 text-green-500 font-bold tracking-tighter text-base">${product.price}</td>
                  
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-6">
                      <button 
                        onClick={() => { setSelectedProduct(product); setIsModalOpen(true); }} 
                        className="text-white/60 hover:text-white transition-colors uppercase font-black text-[10px] tracking-widest border border-white/10 px-4 py-2 rounded-lg"
                      >
                        Modify
                      </button>
                      <button 
                        onClick={() => setProductToDelete(product)} 
                        className="text-red-500/60 hover:text-red-500 transition-colors uppercase font-black text-[10px] tracking-widest border border-red-500/20 px-4 py-2 rounded-lg"
                      >
                        Wipe
                      </button>
                    </div>
                  </td>
                </tr>
              );
            }) : (
                <tr>
                    <td colSpan="4" className="p-20 text-center text-white/20 font-mono text-[10px] uppercase tracking-[0.5em]">No_Variants_Matching_Criteria</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      <AddProductModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onSave={(data) => saveMutation.mutate(data)} 
        initialData={selectedProduct} 
      />
    </div>
  );
};

export default InventoryManager;