import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../api/apiClient";
import AddProductModal from "../components/AddProductModal";
import { toast } from 'react-toastify';

const InventoryManager = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null); // Custom Alert State
  const queryClient = useQueryClient();

  const { data: products, isLoading } = useQuery({
    queryKey: ["adminProducts"],
    queryFn: async () => {
      const response = await apiClient.get("/products");
      return response.data;
    },
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

  if (isLoading) return <div className="text-green-500 font-mono animate-pulse p-10 uppercase tracking-widest text-xs">Syncing_Mainframe...</div>;

  return (
    <div className="animate-in fade-in duration-700 relative">
      {/* --- CUSTOM DECOMMISSION ALERT --- */}
      {productToDelete && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 backdrop-blur-xl p-6">
          <div className="bg-[#0a0a0a] border border-red-500/20 w-full max-w-md rounded-[2.5rem] p-10 shadow-[0_0_50px_rgba(239,68,68,0.1)] text-center">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-red-500 text-2xl font-black">!</span>
            </div>
            <span className="text-red-500 font-mono text-[9px] tracking-[0.5em] uppercase block mb-2">Critical // Decommission_Sequence</span>
            <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white mb-4">Wipe Variant?</h2>
            <p className="text-white/40 text-[11px] font-mono leading-relaxed mb-8">
              Target: <span className="text-white font-bold">{productToDelete.name}</span>. This action will permanently purge the variant from the active grid.
            </p>
            <div className="flex gap-4">
              <button onClick={() => setProductToDelete(null)} className="flex-1 text-[10px] font-mono uppercase text-white/20 hover:text-white transition-colors">Abort</button>
              <button onClick={() => deleteMutation.mutate(productToDelete.id)} className="flex-1 bg-red-600 text-white py-4 rounded-xl text-[10px] font-black uppercase hover:bg-red-500 transition-all shadow-[0_0_20px_rgba(220,38,38,0.2)]">Confirm_Wipe</button>
            </div>
          </div>
        </div>
      )}

      {/* --- MAIN HEADER --- */}
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-xl font-bold uppercase italic tracking-[0.2em] text-white/40">Active_Inventory</h2>
        <button onClick={() => setIsModalOpen(true)} className="bg-white text-black px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-green-500 transition-all">
          + Initialize New Variant
        </button>
      </div>

      {/* --- TABLE CONTENT --- */}
      <div className="overflow-hidden border border-white/5 rounded-3xl bg-[#0a0a0a]/50 backdrop-blur-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 text-[9px] font-mono text-gray-500 uppercase tracking-[0.3em] bg-white/[0.01]">
              <th className="p-6">Variant</th>
              <th className="p-6 text-center">Protocol_ID</th>
              <th className="p-6">Price</th>
              <th className="p-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-[11px] font-mono uppercase">
            {products?.map((product) => (
              <tr key={product.id} className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors group">
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <img src={product.image} alt="" className="w-8 h-8 object-contain grayscale group-hover:grayscale-0 transition-all" />
                    <span className="text-white font-black italic tracking-tighter">{product.name}</span>
                  </div>
                </td>
                <td className="p-6 text-center text-white/20">{product.id}</td>
                <td className="p-6 text-green-500/80 tracking-tighter">${product.price}</td>
                <td className="p-6 text-right">
                  <div className="flex justify-end gap-6">
                    <button onClick={() => { setSelectedProduct(product); setIsModalOpen(true); }} className="text-white/30 hover:text-white transition-colors">Edit</button>
                    <button onClick={() => setProductToDelete(product)} className="text-red-500/30 hover:text-red-500 transition-colors">Decommission</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddProductModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={(data) => saveMutation.mutate(data)} initialData={selectedProduct} />
    </div>
  );
};

export default InventoryManager;