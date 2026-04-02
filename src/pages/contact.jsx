// src/pages/Contact.jsx
import React, { useState } from 'react';
import { toast } from 'react-toastify';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, we just log the data to simulate a "Transmission"
    console.log("VOID_UPLINK_DATA:", formData);
    
    toast.success("SIGNAL TRANSMITTED. OPERATIVE WILL RESPOND SHORTLY.");
    
    // Clear form after sending
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-black pt-16 pb-20 px-6 font-light">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-20 border-l-2 border-green-500 pl-8">
          <span className="text-green-500 font-mono text-[10px] tracking-[0.5em] uppercase">
            Communication Protocol // 001
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter mt-4">
            Contact void
          </h1>
        </header>

        <div className="grid md:grid-cols-2 gap-16">
          
          {/* Support Coordinates (Left Side) */}
          <div className="space-y-12">
            <div>
              <h4 className="text-white/30 font-mono text-[9px] uppercase tracking-widest mb-4">Signal_Address</h4>
              <p className="text-white text-xl font-light">support@void-energy.io</p>
            </div>
            <div>
              <h4 className="text-white/30 font-mono text-[9px] uppercase tracking-widest mb-4">Command_Center</h4>
              <p className="text-white text-xl leading-relaxed font-light">
                KOCHI<br />
                Neo-Tokyo Data District
              </p>
            </div>
            <div className="pt-8 border-t border-white/5">
              <p className="text-white/20 font-mono text-[9px] uppercase tracking-[0.3em]">
                Standard Response Latency: &lt; 24H
              </p>
            </div>
          </div>

          {/* The Contact Form (Right Side) */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="group">
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="name" 
                required
                className="w-full bg-white/5 border border-white/10 p-4 text-white font-mono text-sm outline-none focus:border-green-500/50 transition-all placeholder:text-white/10"
              />
            </div>

            <div className="group">
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email" 
                required
                className="w-full bg-white/5 border border-white/10 p-4 text-white font-mono text-sm outline-none focus:border-green-500/50 transition-all placeholder:text-white/10"
              />
            </div>

            <div className="group">
              <textarea 
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5" 
                placeholder="feedback/complaint" 
                required
                className="w-full bg-white/5 border border-white/10 p-4 text-white font-mono text-sm outline-none focus:border-green-500/50 transition-all resize-none placeholder:text-white/10"
              />
            </div>

            <button 
              type="submit"
              className="h-14 border border-white/20 text-white font-mono text-[10px] tracking-[0.5em] uppercase hover:bg-white hover:text-black hover:border-white transition-all active:scale-[0.98]"
            >
              send
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Contact;