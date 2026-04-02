// src/pages/About.jsx
import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.215, 0.61, 0.355, 1] } }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={container}
      className="min-h-screen bg-[#050505] text-white pt-32 pb-40 px-6 font-extralight tracking-tight selection:bg-green-500 selection:text-black"
    >
      {/* Dynamic Background Grid */}
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header: Core Identity */}
        <motion.header variants={item} className="mb-32 flex flex-col md:flex-row justify-between items-end gap-8 border-b border-white/5 pb-12">
          <div>
            <span className="text-green-500 font-mono text-[9px] tracking-[0.6em] uppercase block mb-4">
              Protocol_Origin // v.2.6
            </span>
            <h1 className="text-7xl md:text-9xl font-black uppercase italic tracking-tighter leading-none">
              VOID<span className="text-white/10 italic font-thin">CORP</span>
            </h1>
          </div>
          <div className="text-right max-w-xs">
            <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest leading-loose">
              Biological hardware optimization. Engineered for the digital operative.
            </p>
          </div>
        </motion.header>

        {/* Section 1: The Philosophy (The Why) */}
        <motion.section variants={item} className="grid md:grid-cols-12 gap-12 mb-48">
          <div className="md:col-span-5 italic text-white/20 font-mono text-[10px] uppercase tracking-[0.4em]">
            // 01_us
          </div>
          <div className="md:col-span-7">
            <h2 className="text-3xl md:text-5xl font-light leading-tight mb-8">
              Optimization is not an option. <br />
              <span className="text-white/40 italic">It is a requirement.</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-6">
              VOID was architected to eliminate the cognitive latency inherent in standard human performance. In an industry built on synthetic spikes and glycemic crashes, we engineered a stabilizer. 
            </p>
            <p className="text-gray-500 text-sm font-mono uppercase tracking-widest leading-loose">
              Signal over noise. Baseline focus. Infinite uptime.
            </p>
          </div>
        </motion.section>

        {/* Section 2: Product Taxonomy (The How) */}
        <motion.section variants={item} className="mb-48">
          <div className="flex items-center gap-6 mb-16">
            <h3 className="italic text-white/20 font-mono text-[10px] uppercase tracking-[0.4em] whitespace-nowrap">
              02_braches_
            </h3>
            <div className="h-[1px] w-full bg-white/5" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-white/5 border border-white/5">
            {[
              { 
                id: 'ZERO', 
                role: 'Baseline Focus', 
                spec: 'Zero Sugar. Pure cognitive clarity.' 
              },
              { 
                id: 'FLOW', 
                role: 'Immersion', 
                spec: 'Creative synchronization. Featuring IO [Yuzu], ZEN [Lotus], and AXIS [Pomelo].' 
              },
              { 
                id: 'FORM', 
                role: 'Peak Output', 
                spec: 'Physical synchronization for high-intensity deployment.' 
              },
              { 
                id: 'RITE', 
                role: 'Recalibration', 
                spec: 'Evening system cooling. Melatonin-free recovery.' 
              }
            ].map((variant) => (
              <div key={variant.id} className="bg-[#050505] p-8 flex flex-col h-full group hover:bg-white/[0.02] transition-colors">
                <span className="text-[10px] font-mono text-green-500 mb-6 tracking-widest uppercase">
                  Active_series
                </span>
                <h4 className="text-3xl font-black italic uppercase tracking-tighter mb-4 group-hover:translate-x-2 transition-transform duration-300">
                  {variant.id}
                </h4>
                <p className="text-white/40 text-[10px] uppercase tracking-widest mb-4">
                  {variant.role}
                </p>
                <div className="mt-auto pt-6 border-t border-white/5">
                  <p className="text-gray-600 text-[10px] leading-relaxed uppercase tracking-wider">
                    {variant.spec}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Section 3: Technical Specs (The Details) */}
        <motion.section variants={item} className="grid md:grid-cols-12 gap-12 mb-40">
          <div className="md:col-span-5 italic text-white/20 font-mono text-[10px] uppercase tracking-[0.4em]">
            // 03_Schematics
          </div>
          <div className="md:col-span-7 grid grid-cols-2 gap-x-12 gap-y-12">
            {[
              { label: "Sugar Content", value: "0.00g" },
              { label: "Neural Latency", value: "-12%" },
              { label: "Caffeine Matrix", value: "200mg" },
              { label: "Active Nootropics", value: "L-Theanine+" },
            ].map((stat) => (
              <div key={stat.label} className="border-l border-white/10 pl-6">
                <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest mb-2">{stat.label}</p>
                <p className="text-2xl font-thin tracking-tighter text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
};

export default About;