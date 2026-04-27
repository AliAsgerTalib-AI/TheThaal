import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Recipe } from '../types';
import { FLAVOR_PROFILES } from '../constants';

interface RecipeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (recipe: Recipe) => void;
}

export function RecipeFormModal({ isOpen, onClose, onSubmit }: RecipeFormModalProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newRecipe: Recipe = {
      id: `user-${Date.now()}`,
      title: formData.get('title') as string,
      category: 'Main', // Default to Main for now or add field
      description: formData.get('description') as string,
      image: 'https://images.unsplash.com/photo-1541544741938-0af808b77e4c?q=80&w=800&auto=format&fit=crop',
      time: formData.get('time') as string,
      servings: `${formData.get('servings')} guests`,
      servingCount: parseInt(formData.get('servings') as string),
      flavorProfile: formData.get('flavor') as any,
      cuisineType: 'Traditional',
      difficulty: formData.get('difficulty') as any,
      ingredients: (formData.get('ingredients') as string).split('\n').filter(i => i.trim()),
      instructions: (formData.get('instructions') as string).split('\n').filter(i => i.trim()),
      heritage: formData.get('heritage') as string,
    };
    onSubmit(newRecipe);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-0 md:p-12">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-bg/95 backdrop-blur-2xl"
          />
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="relative bg-brand-bg border border-white/10 w-full max-w-4xl h-full md:h-auto md:max-h-[85vh] overflow-hidden flex flex-col shadow-2xl"
          >
            <div className="flex-1 overflow-y-auto p-8 md:p-16 relative">
              <div className="absolute inset-0 immersive-gradient opacity-10 pointer-events-none" />
              
              <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-brand-cream">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-40">Recipe Title</label>
                    <input name="title" required placeholder="e.g., Grandma's Hand-Stirred Kheema" className="w-full bg-white/5 border border-white/10 p-4 text-sm outline-none focus:border-brand-gold transition-colors" />
                  </div>
                </div>

                <div className="space-y-2 text-brand-cream">
                  <label className="text-[10px] uppercase tracking-widest font-bold opacity-40">Short Description</label>
                  <textarea name="description" required rows={2} placeholder="A brief essence of the dish..." className="w-full bg-white/5 border border-white/10 p-4 text-sm outline-none focus:border-brand-gold transition-colors resize-none" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-brand-cream">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-40">Prep/Cook Time</label>
                    <input 
                      name="time" 
                      required 
                      pattern="\d+\s*([mM]in(ute)?s?|[hH]ours?|[hH]rs?)"
                      title="Please enter a valid time format, e.g., '45 Mins' or '2 hours'"
                      placeholder="45 Mins" 
                      className="w-full bg-white/5 border border-white/10 p-4 text-sm outline-none focus:border-brand-gold transition-colors" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-40">Guests</label>
                    <input name="servings" type="number" min="1" max="8" required placeholder="4" className="w-full bg-white/5 border border-white/10 p-4 text-sm outline-none focus:border-brand-gold transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-40">Flavor Profile</label>
                    <select name="flavor" required className="w-full bg-white/5 border border-white/10 p-4 text-sm outline-none focus:border-brand-gold transition-colors">
                      {FLAVOR_PROFILES.map(f => <option key={f.name} value={f.name}>{f.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-40">Difficulty</label>
                    <select name="difficulty" required className="w-full bg-white/5 border border-white/10 p-4 text-sm outline-none focus:border-brand-gold transition-colors">
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-brand-cream">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-40">Ingredients (One per line)</label>
                    <textarea name="ingredients" required rows={6} placeholder="e.g., 500g mutton kheema" className="w-full bg-white/5 border border-white/10 p-4 text-sm outline-none focus:border-brand-gold transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-40">Instructions (One per line)</label>
                    <textarea name="instructions" required rows={6} placeholder="e.g., Sauté the onions until golden" className="w-full bg-white/5 border border-white/10 p-4 text-sm outline-none focus:border-brand-gold transition-colors" />
                  </div>
                </div>

                <div className="space-y-2 text-brand-cream">
                  <label className="text-[10px] uppercase tracking-widest font-bold opacity-40">Heritage Story</label>
                  <textarea name="heritage" required rows={4} placeholder="The soulful story of this recipe..." className="w-full bg-white/5 border border-white/10 p-4 text-sm outline-none focus:border-brand-gold transition-colors" />
                </div>

                <div className="flex gap-4">
                  <button type="submit" className="flex-1 bg-brand-gold text-brand-bg py-5 uppercase font-bold tracking-widest text-xs hover:bg-[#B8860B] transition-all">
                    Share Tradition
                  </button>
                  <button type="button" onClick={onClose} className="px-10 py-5 border border-white/10 text-white/50 uppercase font-bold tracking-widest text-xs hover:bg-white/5 transition-all">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
