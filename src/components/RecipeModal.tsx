import React from 'react';
import { Recipe } from '../types';
import { X, Clock, Users, ChefHat, BookOpen, ScrollText, Library } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RecipeModalProps {
  recipe: Recipe;
  onClose: () => void;
  onStartKitchenMode: (recipe: Recipe) => void;
  onArchive: (recipe: Recipe) => void;
  isArchived?: boolean;
}

export function RecipeModal({ recipe, onClose, onStartKitchenMode, onArchive, isArchived }: RecipeModalProps) {
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-brand-bg/95 backdrop-blur-md"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden border border-white/10 bg-[#1A1816] shadow-2xl"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-10 p-2 text-brand-cream/60 hover:text-brand-gold transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="flex flex-col h-full overflow-y-auto">
          <div className="p-8 md:p-12 overflow-y-auto custom-scrollbar">
            <div className="mb-8">
              <div className="mb-4 flex items-center gap-3">
                <span className="text-xs uppercase tracking-[0.3em] text-brand-gold font-bold">
                  {recipe.category}
                </span>
                <span className="h-px w-8 bg-brand-gold/30" />
                <span className="text-xs uppercase tracking-[0.2em] text-brand-cream/40 font-medium">
                  {recipe.cuisineType}
                </span>
              </div>
              <h2 className="mb-4 font-serif text-4xl md:text-5xl text-brand-cream leading-tight">
                {recipe.title}
              </h2>
              <p className="text-lg text-brand-cream/70 font-sans leading-relaxed italic">
                {recipe.description}
              </p>
            </div>

            <div className="mb-10 grid grid-cols-3 gap-6 border-y border-white/5 py-8">
              <div className="text-center">
                <Clock className="mx-auto mb-2 h-5 w-5 text-brand-gold/60" />
                <p className="text-[10px] uppercase tracking-widest text-brand-cream/40 mb-1">Time</p>
                <p className="font-bold text-sm tracking-wide">{recipe.time}</p>
              </div>
              <div className="text-center border-x border-white/5">
                <Users className="mx-auto mb-2 h-5 w-5 text-brand-gold/60" />
                <p className="text-[10px] uppercase tracking-widest text-brand-cream/40 mb-1">Serves</p>
                <p className="font-bold text-sm tracking-wide">{recipe.servings}</p>
              </div>
              <div className="text-center">
                <ChefHat className="mx-auto mb-2 h-5 w-5 text-brand-gold/60" />
                <p className="text-[10px] uppercase tracking-widest text-brand-cream/40 mb-1">Difficulty</p>
                <p className="font-bold text-sm tracking-wide">{recipe.difficulty}</p>
              </div>
            </div>

            <div className="mb-12 space-y-10">
              <section>
                <div className="mb-6 flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-brand-gold" />
                  <h3 className="text-sm uppercase tracking-[0.2em] font-bold text-brand-cream/90">Ingredients</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8">
                  {recipe.ingredients.map((ingredient, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-brand-cream/60">
                      <div className="h-1 w-1 rounded-full bg-brand-gold/40" />
                      {ingredient}
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <div className="mb-6 flex items-center gap-3">
                  <ScrollText className="h-5 w-5 text-brand-gold" />
                  <h3 className="text-sm uppercase tracking-[0.2em] font-bold text-brand-cream/90">Instructions</h3>
                </div>
                <div className="space-y-6">
                  {recipe.instructions.map((step, i) => (
                    <div key={i} className="flex gap-4">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-brand-gold/30 text-[10px] font-bold text-brand-gold">
                        {i + 1}
                      </span>
                      <p className="text-sm text-brand-cream/70 leading-relaxed pt-1">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-lg bg-brand-gold/5 p-8 border border-brand-gold/10">
                <h3 className="mb-4 text-xs uppercase tracking-widest font-bold text-brand-gold">Heritage & Tradition</h3>
                <p className="text-sm text-brand-cream/80 leading-relaxed font-sans italic">
                  "{recipe.heritage}"
                </p>
              </section>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => onArchive(recipe)}
                disabled={isArchived}
                className={`flex-1 py-5 border border-brand-gold/30 text-brand-gold font-bold uppercase tracking-[0.2em] text-sm hover:bg-brand-gold/10 transition-all flex items-center justify-center gap-3 active:scale-[0.98] ${isArchived ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Library className="h-5 w-5" />
                {isArchived ? 'Recipe Saved' : '+ Archive'}
              </button>
              <button 
                onClick={() => onStartKitchenMode(recipe)}
                className="flex-[2] py-5 bg-brand-gold text-brand-bg font-bold uppercase tracking-[0.2em] text-sm hover:bg-brand-gold/90 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
              >
                <ChefHat className="h-5 w-5" />
                Enter Kitchen Mode
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
