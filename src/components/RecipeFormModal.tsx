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
      category: formData.get('category') as any,
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
    <div className="min-h-screen bg-brand-bg relative pt-32 pb-20">
      <div className="fixed inset-0 immersive-gradient opacity-10 pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-12">
          <span className="text-brand-gold uppercase tracking-mega font-bold text-[10px]">Registry</span>
          <h1 className="text-5xl font-serif text-brand-cream mt-2">Share a <span className="italic text-brand-gold">Legacy</span></h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12 bg-white/[0.02] border border-white/5 p-8 md:p-16 rounded-[2.5rem]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-brand-cream">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold opacity-40">Recipe Title</label>
              <input name="title" required placeholder="e.g., Grandma's Hand-Stirred Kheema" className="w-full bg-white/5 border border-white/10 p-4 text-sm outline-none focus:border-brand-gold transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold opacity-40">Category</label>
              <select name="category" required className="w-full bg-[#1A1816] border border-white/10 p-4 text-sm outline-none focus:border-brand-gold transition-colors">
                <option value="Meethas" className="bg-[#1A1816]">Meethas</option>
                <option value="Kharaas" className="bg-[#1A1816]">Kharaas</option>
                <option value="Jamaan" className="bg-[#1A1816]">Jamaan</option>
                <option value="Salad" className="bg-[#1A1816]">Salad</option>
              </select>
            </div>
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
          </div>

          <div className="space-y-2 text-brand-cream">
            <label className="text-[10px] uppercase tracking-widest font-bold opacity-40">Short Description</label>
            <textarea name="description" required rows={2} placeholder="A brief essence of the dish..." className="w-full bg-white/5 border border-white/10 p-4 text-sm outline-none focus:border-brand-gold transition-colors resize-none" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-brand-cream">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold opacity-40">Guests</label>
              <input name="servings" type="number" min="1" max="8" required placeholder="4" className="w-full bg-white/5 border border-white/10 p-4 text-sm outline-none focus:border-brand-gold transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold opacity-40">Flavor Profile</label>
              <select name="flavor" required className="w-full bg-[#1A1816] border border-white/10 p-4 text-sm outline-none focus:border-brand-gold transition-colors">
                {FLAVOR_PROFILES.map(f => <option key={f.name} value={f.name} className="bg-[#1A1816]">{f.name}</option>)}
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

          <div className="flex gap-4 pt-8">
            <button type="submit" className="flex-1 bg-brand-gold text-brand-bg py-5 uppercase font-bold tracking-widest text-xs hover:bg-[#B8860B] transition-all">
              Share Tradition
            </button>
            <button type="button" onClick={onClose} className="px-10 py-5 border border-white/10 text-white/50 uppercase font-bold tracking-widest text-xs hover:bg-white/5 transition-all">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
