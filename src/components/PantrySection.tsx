import React from 'react';
import { COMMON_INGREDIENTS } from '../constants';
import { ChefHat, Sparkles, X } from 'lucide-react';
import { motion } from 'motion/react';

interface PantrySectionProps {
  selectedIngredients: string[];
  onToggleIngredient: (ingredient: string) => void;
  onCook: () => void;
  isGenerating: boolean;
}

export function PantrySection({
  selectedIngredients,
  onToggleIngredient,
  onCook,
  isGenerating
}: PantrySectionProps) {
  return (
    <section className="bg-[#1A1816] border border-white/5 p-8 md:p-12 mb-20 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-4">
            <ChefHat className="h-5 w-5 text-brand-gold" />
            <h2 className="text-xs uppercase tracking-[0.3em] font-bold text-brand-gold">The Virtual Pantry</h2>
          </div>
          <h3 className="font-serif text-3xl text-brand-cream mb-4 tracking-tight leading-tight">
            What's in your <span className="text-brand-gold italic">kitchen</span> today?
          </h3>
          <p className="text-brand-cream/40 text-sm leading-relaxed font-sans">
            Select the ingredients you have available, and let the Orchestrator synthesize an authentic Bohra recipe for you.
          </p>
        </div>

        <button 
          onClick={onCook}
          disabled={selectedIngredients.length === 0 || isGenerating}
          className="relative group overflow-hidden bg-brand-gold px-12 py-6 text-brand-bg font-bold uppercase tracking-[0.2em] text-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30 disabled:grayscale disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {isGenerating ? (
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 border-2 border-brand-bg/30 border-t-brand-bg rounded-full animate-spin" />
              <span>Synthesizing...</span>
            </div>
          ) : (
            <>
              <Sparkles className="h-5 w-5 animate-pulse" />
              <span>Orchestrate Recipe</span>
            </>
          )}
        </button>
      </div>

      <div className="mt-12 flex flex-wrap gap-3">
        {COMMON_INGREDIENTS.map(ingredient => (
          <button
            key={ingredient}
            onClick={() => onToggleIngredient(ingredient)}
            className={`px-5 py-3 text-[10px] uppercase tracking-widest font-bold transition-all border ${
              selectedIngredients.includes(ingredient)
                ? 'bg-brand-gold border-brand-gold text-brand-bg'
                : 'bg-white/5 border-white/5 text-brand-cream/50 hover:border-brand-gold/30 hover:text-brand-cream'
            }`}
          >
            {ingredient}
          </button>
        ))}
        {selectedIngredients.length > 0 && (
          <button 
            onClick={() => selectedIngredients.forEach(i => onToggleIngredient(i))}
            className="px-5 py-3 text-[10px] uppercase tracking-widest font-bold text-brand-gold/60 hover:text-brand-gold flex items-center gap-2"
          >
            <X className="h-3 w-3" /> Clear All
          </button>
        )}
      </div>
    </section>
  );
}
