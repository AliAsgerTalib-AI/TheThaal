import React from 'react';
import { Recipe } from '../types';
import { Clock, Users, ChevronRight, Sparkles, Library } from 'lucide-react';
import { motion } from 'motion/react';

interface RecipeCardProps {
  recipe: Recipe;
  index: number;
  onClick: (recipe: Recipe) => void;
  onArchive?: (recipe: Recipe) => void;
  isArchived?: boolean;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, index, onClick, onArchive, isArchived }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      onClick={() => onClick(recipe)}
      className="group relative cursor-pointer overflow-hidden border border-white/5 bg-[#1A1816]/50 transition-all hover:border-brand-gold/30"
    >
      <div className="aspect-[16/10] overflow-hidden relative">
        <img 
          src={recipe.image} 
          alt={recipe.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#12100E] via-transparent to-transparent opacity-60" />
        
        {onArchive && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onArchive(recipe);
            }}
            className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md border transition-all ${
              isArchived 
                ? 'bg-brand-gold border-brand-gold text-brand-bg opacity-100' 
                : 'bg-black/40 border-white/10 text-brand-gold opacity-0 group-hover:opacity-100'
            }`}
          >
            <Library className="w-4 h-4" />
          </button>
        )}
      </div>
      
      <div className="p-6">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-[0.2em] text-brand-gold/80 font-bold">
            {recipe.category}
          </span>
          {recipe.verified && (
            <div className="flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-brand-gold" />
              <span className="text-[8px] uppercase tracking-widest text-brand-gold">Verified</span>
            </div>
          )}
        </div>
        
        <h3 className="mb-2 font-serif text-xl text-brand-cream group-hover:text-brand-gold transition-colors">
          {recipe.title}
        </h3>
        
        <p className="mb-6 line-clamp-2 text-sm text-brand-cream/60 font-sans leading-relaxed">
          {recipe.description}
        </p>
        
        <div className="flex items-center justify-between border-t border-white/5 pt-4">
          <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest text-brand-cream/40">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3 w-3" />
              {recipe.time}
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-3 w-3" />
              {recipe.servings}
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-brand-gold opacity-0 transition-all -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0" />
        </div>
      </div>
    </motion.div>
  );
};
