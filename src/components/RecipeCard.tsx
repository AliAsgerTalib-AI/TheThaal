import React from 'react';
import { motion } from 'motion/react';
import { Clock, Users } from 'lucide-react';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  index: number;
  onClick: () => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, index, onClick }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -8, borderColor: 'rgba(212, 175, 55, 0.4)' }}
      transition={{ 
        layout: { duration: 0.3 },
        opacity: { duration: 0.6, delay: index * 0.1 },
        y: { type: 'spring', stiffness: 300, damping: 20 },
        borderColor: { duration: 0.3 }
      }}
      className="group cursor-pointer glass-card p-6 border border-white/10"
      onClick={onClick}
    >
      <div className="relative aspect-[4/5] overflow-hidden mb-8 grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700">
        {recipe.image && (
          <img 
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
        )}
        <div className="absolute inset-0 bg-brand-bg/20 mix-blend-multiply" />
        <div className="absolute bottom-6 left-6 right-6">
          <span className="inline-block bg-brand-gold text-brand-bg px-3 py-1 text-[9px] font-bold uppercase tracking-widest">
            {recipe.category}
          </span>
          {recipe.verified && (
            <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md text-brand-gold px-3 py-1 text-[9px] font-bold uppercase tracking-widest ml-2 border border-brand-gold/20">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" /> Verified Archive
            </span>
          )}
        </div>
      </div>
      
      <div className="flex items-start justify-between gap-4 mb-4">
        <h3 className="text-2xl font-serif font-bold leading-tight group-hover:text-brand-gold transition-colors">
          {recipe.title}
        </h3>
        <span className="text-[10px] font-mono opacity-20 group-hover:opacity-100 transition-opacity">0{index + 1}</span>
      </div>
      
      <p className="text-white/50 text-xs font-light leading-relaxed mb-8 line-clamp-2 italic">
        {recipe.description}
      </p>
      
      <div className="flex items-center gap-6 text-[9px] font-bold uppercase tracking-[0.2em] text-white/30 group-hover:text-white/60 transition-colors pt-6 border-t border-white/10">
        <div className="flex items-center gap-2">
          <Clock className="w-3 h-3 text-brand-gold" /> {recipe.time}
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-3 h-3 text-brand-gold" /> {recipe.servings}
        </div>
      </div>
    </motion.div>
  );
}
