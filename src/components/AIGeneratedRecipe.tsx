import React from 'react';
import { Recipe } from '../types';
import { Sparkles, Save, X, ChefHat, History, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AIGeneratedRecipeProps {
  recipe: Recipe;
  onClose: () => void;
  onSave: (recipe: Recipe) => void;
  onStartKitchenMode: (recipe: Recipe) => void;
  isSaved: boolean;
}

export function AIGeneratedRecipe({ recipe, onClose, onSave, onStartKitchenMode, isSaved }: AIGeneratedRecipeProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      className="bg-[#1A1816] border border-brand-gold/30 p-8 md:p-12 mb-20 relative shadow-[0_0_50px_-12px_rgba(202,171,114,0.15)]"
    >
      <div className="absolute top-0 right-0 p-6 flex gap-4">
        <button 
          onClick={onClose}
          className="p-2 text-brand-cream/30 hover:text-brand-gold transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="lg:w-1/3">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="h-4 w-4 text-brand-gold" />
            <span className="text-[10px] uppercase tracking-[0.4em] text-brand-gold font-bold">AI Synthesis Result</span>
          </div>
          <h2 className="font-serif text-4xl text-brand-cream mb-6 tracking-tight leading-tight italic">
            "{recipe.title}"
          </h2>
          <div className="aspect-square overflow-hidden border border-brand-gold/10 mb-8">
            <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          
          <div className="space-y-4">
            <button 
              onClick={() => onStartKitchenMode(recipe)}
              className="w-full py-4 bg-brand-gold text-brand-bg font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-brand-gold/90 transition-all"
            >
              <ChefHat className="h-4 w-4" /> Start Cooking
            </button>
            <button 
              onClick={() => onSave(recipe)}
              disabled={isSaved}
              className="w-full py-4 border border-brand-gold/20 text-brand-gold font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-brand-gold/5 transition-all disabled:opacity-50 disabled:grayscale"
            >
              <Save className="h-4 w-4" /> {isSaved ? 'Recipe Saved' : 'Save to Archive'}
            </button>
          </div>
        </div>

        <div className="lg:w-2/3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-8 border-y border-white/5 mb-8">
            <div>
              <p className="text-[8px] uppercase tracking-widest text-brand-cream/30 mb-1">Time</p>
              <p className="font-bold text-xs">{recipe.time}</p>
            </div>
            <div>
              <p className="text-[8px] uppercase tracking-widest text-brand-cream/30 mb-1">Flavor</p>
              <p className="font-bold text-xs">{recipe.flavorProfile}</p>
            </div>
            <div>
              <p className="text-[8px] uppercase tracking-widest text-brand-cream/30 mb-1">Cuisine</p>
              <p className="font-bold text-xs">AI Synthesis</p>
            </div>
            <div>
              <p className="text-[8px] uppercase tracking-widest text-brand-cream/30 mb-1">Guest Scale</p>
              <p className="font-bold text-xs">{recipe.servingCount} Guests</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <section>
              <h3 className="text-[10px] uppercase tracking-widest font-bold text-brand-gold mb-4 flex items-center gap-2">
                <Info className="h-3 w-3" /> Synthesis Rationale
              </h3>
              <p className="text-sm text-brand-cream/60 leading-relaxed font-sans italic">
                {recipe.description}
              </p>
              <div className="mt-8 p-6 bg-brand-gold/5 border border-brand-gold/10">
                <h4 className="text-[9px] uppercase tracking-widest font-bold text-brand-gold mb-3 flex items-center gap-2">
                  <History className="h-3 w-3" /> Historical Context
                </h4>
                <p className="text-xs text-brand-cream/50 leading-relaxed font-sans">
                  {recipe.heritage}
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-[10px] uppercase tracking-widest font-bold text-brand-gold mb-4">Required Ingredients</h3>
              <div className="space-y-3">
                {recipe.ingredients.map((ing, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs text-brand-cream/70 border-b border-white/5 pb-2">
                    <div className="w-1 h-1 bg-brand-gold rounded-full" />
                    {ing}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
