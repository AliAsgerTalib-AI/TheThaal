import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Flame, Sparkles, Wind, Droplets, Info } from 'lucide-react';
import { FLAVOR_PROFILES } from '../constants';

interface SpicesPageProps {
  onClose: () => void;
}

export function SpicesPage({ onClose }: SpicesPageProps) {
  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
      <header className="mb-20">
        <div className="flex items-center gap-3 mb-6">
          <span className="h-px w-12 bg-brand-gold" />
          <span className="text-[10px] uppercase tracking-[0.4em] text-brand-gold font-bold">The Science of Aroma</span>
        </div>
        <h1 className="font-serif text-5xl md:text-8xl text-brand-cream leading-tight">
          Bohra <span className="text-brand-gold italic font-light">Spices</span> & Alchemy
        </h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {FLAVOR_PROFILES.map((profile, index) => (
          <motion.div
            key={profile.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group relative p-10 border border-white/5 bg-[#1A1816]/50 hover:border-brand-gold/30 transition-all overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
              <Flame className="w-32 h-32 text-brand-gold rotate-12" />
            </div>
            
            <div className="relative z-10">
              <span className="text-[10px] uppercase tracking-[0.3em] text-brand-gold font-bold mb-4 block">
                Profile 0{index + 1}
              </span>
              <h3 className="font-serif text-3xl text-brand-cream mb-6 leading-none">
                {profile.name}
              </h3>
              <p className="text-brand-cream/60 leading-relaxed font-sans text-sm mb-8">
                {profile.desc}
              </p>
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-brand-gold/80 font-bold">
                <Info className="w-3 h-3" /> Essential Technique
              </div>
            </div>
            
            <div className="absolute bottom-0 left-0 h-1 w-0 bg-brand-gold group-hover:w-full transition-all duration-500" />
          </motion.div>
        ))}
      </div>

      <section className="mt-32 p-12 md:p-20 border border-brand-gold/20 bg-brand-gold/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-[0.05]">
          <Wind className="w-full h-full text-brand-gold" />
        </div>
        
        <div className="max-w-2xl relative z-10">
          <h2 className="font-serif text-4xl text-brand-cream mb-8">The "Lazzat-e-Taam" Secret</h2>
          <p className="text-lg text-brand-cream/70 leading-relaxed mb-8 font-sans">
            At the heart of every great Bohra kitchen is a proprietary blend of spices known as Lazzat-e-Taam. While every family has its own proportions, it always features stone-pounded stone flower (Dagad Phool), nagkesar, and rare aromatics.
          </p>
          <div className="flex flex-wrap gap-4">
            {['Star Anise', 'Dagad Phool', 'Green Cardamom', 'Nagkesar', 'Cinnamon'].map(spice => (
              <span key={spice} className="px-4 py-2 border border-brand-gold/10 text-[10px] uppercase tracking-widest font-bold text-brand-gold bg-brand-gold/5">
                {spice}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
