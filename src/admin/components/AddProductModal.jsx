import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

// --- DROPZONE COMPONENT (With Compression Protocol) ---
const FileUploadZone = ({ label, value, onChange, error, id }) => {
  const [isDragging, setIsDragging] = useState(false);

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const onFileChange = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  const processFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // --- COMPRESSION ENGINE ---
        // Downscales massive images so json-server doesn't crash on a 500 error
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 500; // Safe width for database payload
          let width = img.width;
          let height = img.height;

          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Compress to WebP to drastically reduce base64 string length
          const compressedData = canvas.toDataURL('image/webp', 0.7);
          onChange(compressedData);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("INVALID_FORMAT: Image asset required.");
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <label className="admin-label m-0">{label}</label>
        {error && <span className="text-red-500 font-mono text-[8px] uppercase font-black">{error}</span>}
      </div>
      
      <label 
        htmlFor={id}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`flex flex-col items-center justify-center h-28 border-2 border-dashed rounded-xl cursor-pointer transition-all group overflow-hidden relative
          ${error 
            ? 'border-red-500/50 bg-red-500/5 shadow-[0_0_15px_rgba(239,68,68,0.1)]' 
            : isDragging 
              ? 'border-green-500 bg-green-500/10' 
              : 'border-white/10 bg-white/[0.02] hover:border-green-500/50 hover:bg-white/[0.05]'}`}
      >
        {value && value.length > 50 ? (
          <div className="relative w-full h-full flex items-center justify-center p-2 bg-black/40">
            <img src={value} alt="Asset Preview" className="max-h-full max-w-full object-contain" />
            <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white/80 font-mono text-[10px] uppercase font-black tracking-widest">Replace_Asset</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-4">
            <svg className={`w-5 h-5 mb-2 transition-colors ${isDragging ? 'text-green-500' : 'text-white/20 group-hover:text-green-500/60'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest font-black">
              {isDragging ? 'Initialize_Upload' : 'Drop_Asset_Here'}
            </span>
          </div>
        )}
        <input id={id} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
      </label>
      
      {/* Manual Override Input */}
      <input 
        type="text" 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        placeholder="...or paste exact URL path" 
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white font-mono text-[9px] outline-none focus:border-green-500 transition-all placeholder:text-white/20"
      />
    </div>
  );
};

// --- MAIN COMPONENT ---
const AddProductModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    imageBg: '/imagesBg/void-prod-bg.png',
    category: 'Energy',
    series: 'FLOW',
    stock: '100',
    ingredients: [{ name: '', benefit: '' }]
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '', description: '', price: '', image: '',
        imageBg: '/imagesBg/void-prod-bg.png', category: 'Energy',
        series: 'FLOW', stock: '100', 
        ingredients: [{ name: '', benefit: '' }]
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  // --- Validation Protocol ---
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name?.trim()) newErrors.name = "Identity_Required";
    if (!formData.description?.trim()) newErrors.description = "Narrative_Log_Empty";
    
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = "Invalid_Value";
    }

    if (formData.stock === '' || parseInt(formData.stock) < 0) {
      newErrors.stock = "Invalid_Inventory";
    }

    if (!formData.image) {
      newErrors.image = "Asset_Required";
    }

    let hasAtLeastOneValidIngredient = false;

    formData.ingredients.forEach((ing) => {
      const hasName = ing.name?.trim();
      const hasBenefit = ing.benefit?.trim();
      
      if ((hasName && !hasBenefit) || (!hasName && hasBenefit)) {
        newErrors.ingredients = "Molecular_Incomplete";
      }
      if (hasName && hasBenefit) {
        hasAtLeastOneValidIngredient = true;
      }
    });

    if (!hasAtLeastOneValidIngredient && !newErrors.ingredients) {
      newErrors.ingredients = "Elements_Required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

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
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 overflow-y-auto">
      <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-4xl rounded-[3rem] p-10 shadow-2xl my-8">
        
        <header className="mb-10 border-b border-white/5 pb-8 flex justify-between items-end">
          <div>
            <span className={`font-mono text-[10px] tracking-[0.5em] uppercase block mb-2 font-black ${Object.keys(errors).length > 0 ? 'text-red-500' : 'text-green-500'}`}>
              Protocol // {Object.keys(errors).length > 0 ? 'Validation_Breach' : (initialData ? 'Modification' : 'Initialization')}
            </span>
            <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white">{initialData ? 'Modify_Variant' : 'New_Variant'}</h2>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest font-black">Target_ID</p>
            <p className="text-[10px] font-mono text-white/80 uppercase font-black">{initialData?.id || 'Pending_Assignment'}</p>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* COLUMN 1: NARRATIVE & ASSETS */}
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="admin-label">Variant_Identity</label>
                  {errors.name && <span className="text-red-500 font-mono text-[9px] uppercase font-black">{errors.name}</span>}
                </div>
                <input 
                  value={formData.name} 
                  placeholder="VARIANT NAME" 
                  className={`admin-input ${errors.name ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : ''}`} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="admin-label">Narrative_Description</label>
                  {errors.description && <span className="text-red-500 font-mono text-[9px] uppercase font-black">{errors.description}</span>}
                </div>
                <textarea 
                  value={formData.description} 
                  placeholder="NARRATIVE_LOG" 
                  className={`admin-input h-32 resize-none py-4 ${errors.description ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : ''}`} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})} 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FileUploadZone 
                  id="primary-asset"
                  label="Primary_Asset" 
                  value={formData.image} 
                  error={errors.image}
                  onChange={(val) => setFormData({...formData, image: val})} 
                />
                <FileUploadZone 
                  id="bg-asset"
                  label="Background_Asset" 
                  value={formData.imageBg} 
                  onChange={(val) => setFormData({...formData, imageBg: val})} 
                />
              </div>
            </div>

            {/* COLUMN 2: LOGISTICS & COMPOSITION */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="admin-label">Credits_Value ($)</label>
                    {errors.price && <span className="text-red-500 font-mono text-[9px] uppercase font-black">{errors.price}</span>}
                  </div>
                  <input 
                    type="number" 
                    step="0.01"
                    value={formData.price} 
                    placeholder="0.00" 
                    className={`admin-input ${errors.price ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : ''}`} 
                    onChange={(e) => setFormData({...formData, price: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="admin-label">Inventory_Level</label>
                    {errors.stock && <span className="text-red-500 font-mono text-[9px] uppercase font-black">{errors.stock}</span>}
                  </div>
                  <input 
                    type="number" 
                    value={formData.stock} 
                    placeholder="QTY" 
                    className={`admin-input ${errors.stock ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : ''}`} 
                    onChange={(e) => setFormData({...formData, stock: e.target.value})} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="admin-label">Series_Class</label>
                <select 
                  value={formData.series} 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white font-mono text-[11px] uppercase tracking-widest outline-none focus:border-green-500 cursor-pointer appearance-none" 
                  onChange={(e) => setFormData({...formData, series: e.target.value})}
                >
                  <option className="bg-[#0a0a0a]" value="FLOW">VOID FLOW</option>
                  <option className="bg-[#0a0a0a]" value="ZERO">VOID ZERO</option>
                  <option className="bg-[#0a0a0a]" value="RITE">VOID RITE</option>
                  <option className="bg-[#0a0a0a]" value="FORM">VOID FORM</option>
                </select>
              </div>

              {/* DYNAMIC INGREDIENTS SUB-FORM */}
              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <label className="admin-label m-0">Molecular_Composition</label>
                    {errors.ingredients && <span className="text-red-500 font-mono text-[8px] uppercase animate-pulse font-black">{errors.ingredients}</span>}
                  </div>
                  <button type="button" onClick={addIngredient} className="text-[10px] text-green-500 font-black uppercase tracking-widest hover:text-white transition-colors">+ Add_Element</button>
                </div>
                
                <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {formData.ingredients.map((ing, index) => (
                    <div key={index} className="flex gap-2 group/ing animate-in slide-in-from-right-2">
                      <input 
                        value={ing.name} 
                        placeholder="Element" 
                        className={`flex-1 admin-input text-[11px] py-2.5 ${errors.ingredients && !ing.name?.trim() ? 'border-red-500/30' : ''}`} 
                        onChange={(e) => updateIngredient(index, 'name', e.target.value)} 
                      />
                      <input 
                        value={ing.benefit} 
                        placeholder="Effect" 
                        className={`flex-1 admin-input text-[11px] py-2.5 ${errors.ingredients && !ing.benefit?.trim() ? 'border-red-500/30' : ''}`} 
                        onChange={(e) => updateIngredient(index, 'benefit', e.target.value)} 
                      />
                      {formData.ingredients.length > 1 && (
                        <button type="button" onClick={() => removeIngredient(index)} className="text-white/20 hover:text-red-500 px-1 transition-colors text-xl">×</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <footer className="flex gap-6 pt-10 border-t border-white/5 items-center">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 text-[10px] font-mono uppercase text-white/40 hover:text-white font-black tracking-widest transition-colors"
            >
              Abort_Sequence
            </button>
            <button 
              type="submit" 
              className={`flex-[2] py-5 px-12 rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] transition-all shadow-xl
                ${Object.keys(errors).length > 0 
                  ? 'bg-red-600/20 text-red-500 border border-red-500/20' 
                  : 'bg-white text-black hover:bg-green-500 hover:text-white'}`}
            >
              {initialData ? 'Update_Sequence' : 'Confirm_Injection'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;