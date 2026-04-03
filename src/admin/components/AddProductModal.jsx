import React, { useState, useEffect } from 'react';

const AddProductModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    imageBg: '/imagesBg/void-prod-bg.png',
    category: 'Energy',
    series: 'VOID FLOW',
    stock: '100',
    ingredients: [{ name: '', benefit: '' }]
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '', description: '', price: '', image: '',
        imageBg: '/imagesBg/void-prod-bg.png', category: 'Energy',
        series: 'VOID FLOW', stock: '100', 
        ingredients: [{ name: '', benefit: '' }]
      });
    }
  }, [initialData, isOpen]);

  // --- Composition Logic ---
  const addIngredient = () => {
    setFormData({ ...formData, ingredients: [...formData.ingredients, { name: '', benefit: '' }] });
  };

  const updateIngredient = (index, field, value) => {
    const updated = formData.ingredients.map((ing, i) => 
      i === index ? { ...ing, [field]: value } : ing
    );
    setFormData({ ...formData, ingredients: updated });
  };

  const removeIngredient = (index) => {
    setFormData({ ...formData, ingredients: formData.ingredients.filter((_, i) => i !== index) });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-[#121212] to-[#080808] border border-white/10 border-t-white/20 border-l-white/20 w-full max-w-4xl rounded-[2.5rem] p-10 shadow-2xl my-8">
        
        <header className="mb-10 border-b border-white/5 pb-6 flex justify-between items-end">
          <div>
            <span className="text-green-500 font-mono text-[9px] tracking-[0.5em] uppercase block mb-2">Protocol // {initialData ? 'Modification' : 'Initialization'}</span>
            <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white">{initialData ? 'Modify_Variant' : 'New_Variant'}</h2>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest">Target_ID</p>
            <p className="text-[10px] font-mono text-white/60 uppercase">{initialData?.id || 'Pending_Assignment'}</p>
          </div>
        </header>

        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* COLUMN 1: NARRATIVE & ASSETS */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="admin-label">Variant_Identity</label>
                <input required value={formData.name} placeholder="VARIANT NAME" className="admin-input" onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>

              <div className="space-y-2">
                <label className="admin-label">Narrative_Description</label>
                <textarea required value={formData.description} placeholder="NARRATIVE_LOG" className="admin-input h-32 resize-none py-4" onChange={(e) => setFormData({...formData, description: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="admin-label">Primary_Asset</label>
                  <input required value={formData.image} placeholder="/images/render.png" className="admin-input" onChange={(e) => setFormData({...formData, image: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="admin-label">Background_Asset</label>
                  <input required value={formData.imageBg} placeholder="/images/bg.png" className="admin-input" onChange={(e) => setFormData({...formData, imageBg: e.target.value})} />
                </div>
              </div>
            </div>

            {/* COLUMN 2: LOGISTICS & COMPOSITION */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="admin-label">Credits_Value</label>
                  <input type="number" required value={formData.price} placeholder="0.00" className="admin-input" onChange={(e) => setFormData({...formData, price: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="admin-label">Inventory_Level</label>
                  <input type="number" required value={formData.stock} placeholder="QTY" className="admin-input" onChange={(e) => setFormData({...formData, stock: e.target.value})} />
                </div>
              </div>

 
            <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {formData.ingredients.map((ing, index) => (
                <div key={index} className="flex gap-2">
                  <input 
                    required 
                    value={ing.name} 
                    placeholder="Element (e.g. L-Theanine)" 
                    className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2 text-white font-mono text-[10px] outline-none focus:border-green-500 transition-all placeholder:text-white/20" 
                    onChange={(e) => updateIngredient(index, 'name', e.target.value)} 
                  />
                  <input 
                    required 
                    value={ing.benefit} 
                    placeholder="Effect (e.g. Focus)" 
                    className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2 text-white font-mono text-[10px] outline-none focus:border-green-500 transition-all placeholder:text-white/20" 
                    onChange={(e) => updateIngredient(index, 'benefit', e.target.value)} 
                  />
                  {formData.ingredients.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeIngredient(index)} 
                      className="text-white/20 hover:text-red-500 px-2 transition-colors text-lg"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>


            <div className="space-y-2">
              <label className="text-[9px] font-mono uppercase text-white/30 ml-2 block">Series_Class</label>
              <select 
                value={formData.series} 
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-5 py-3 text-white font-mono text-sm outline-none appearance-none focus:border-green-500 cursor-pointer" 
                onChange={(e) => setFormData({...formData, series: e.target.value})}
              >
                <option className="bg-[#0a0a0a] text-white" value="VOID FLOW">VOID FLOW</option>
                <option className="bg-[#0a0a0a] text-white" value="VOID ZERO">VOID ZERO</option>
                <option className="bg-[#0a0a0a] text-white" value="VOID RITE">VOID RITE</option>
                <option className="bg-[#0a0a0a] text-white" value="VOID FORM">VOID FORM</option>
              </select>
            </div>

              {/* DYNAMIC INGREDIENTS SUB-FORM */}
              <div className="space-y-4 pt-4">
                <div className="flex justify-between items-center">
                  <label className="admin-label">Molecular_Composition</label>
                  <button type="button" onClick={addIngredient} className="text-[9px] text-green-500 font-bold uppercase tracking-widest hover:text-white transition-colors">+ Add_Element</button>
                </div>
                <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {formData.ingredients.map((ing, index) => (
                    <div key={index} className="flex gap-2 group/ing">
                      <input required value={ing.name} placeholder="Element" className="flex-1 admin-input text-[11px] py-2" onChange={(e) => updateIngredient(index, 'name', e.target.value)} />
                      <input required value={ing.benefit} placeholder="Effect" className="flex-1 admin-input text-[11px] py-2" onChange={(e) => updateIngredient(index, 'benefit', e.target.value)} />
                      {formData.ingredients.length > 1 && (
                        <button type="button" onClick={() => removeIngredient(index)} className="text-white/10 hover:text-red-500 px-1 transition-colors">×</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <footer className="flex gap-4 pt-8 border-t border-white/5">
            <button type="button" onClick={onClose} className="flex-1 text-[10px] font-mono uppercase text-white/20 hover:text-white">Abort_Sequence</button>
            <button type="submit" className="flex-2 bg-white text-black py-5 px-12 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-green-500 transition-all shadow-[0_10px_30px_rgba(255,255,255,0.05)]">
              {initialData ? 'Update_Sequence' : 'Confirm_Injection'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

// --- CSS HELPERS (Add to your index.css) ---
/* .admin-label { @apply text-[9px] font-mono uppercase text-white/30 ml-2 block; }
.admin-input { @apply w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white font-mono text-sm outline-none focus:border-green-500 transition-all placeholder:text-white/5; }
*/

export default AddProductModal;