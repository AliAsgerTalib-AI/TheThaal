import React, { useState } from 'react';
import { Recipe } from '../types';
import { FLAVOR_PROFILES, CATEGORIES } from '../constants';
import { X, Save, ChefHat, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RecipeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (recipe: Recipe) => void;
}

export function RecipeFormModal({ isOpen, onClose, onSubmit }: RecipeFormModalProps) {
  const [formData, setFormData] = useState<Partial<Recipe>>({
    title: '',
    description: '',
    category: 'Meethas',
    difficulty: 'Medium',
    time: '45 mins',
    servings: '8 people',
    servingCount: 8,
    ingredients: [''],
    instructions: [''],
    heritage: '',
    flavorProfile: 'Zaikedaar',
    cuisineType: 'Traditional',
    image: 'https://images.unsplash.com/photo-1596791016020-f94f57ffde10?q=80&w=2670&auto=format&fit=crop'
  });

  const handleAddIngredient = () => {
    setFormData(prev => ({ ...prev, ingredients: [...(prev.ingredients || []), ''] }));
  };

  const handleAddStep = () => {
    setFormData(prev => ({ ...prev, instructions: [...(prev.instructions || []), ''] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.description) {
      onSubmit({
        ...formData,
        id: Math.random().toString(36).substring(7),
        verified: false
      } as Recipe);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
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
        className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden border border-white/10 bg-[#1A1816]"
      >
        <div className="flex items-center justify-between p-8 border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 border border-brand-gold flex items-center justify-center text-brand-gold">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-serif text-brand-cream">Contribute to the Archive</h2>
              <p className="text-[10px] uppercase tracking-widest text-brand-gold font-bold">New Ancestral Recipe</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-brand-cream/40 hover:text-brand-gold transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto max-h-[calc(90vh-100px)] custom-scrollbar">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <section>
                <h3 className="text-xs uppercase tracking-widest font-bold text-brand-gold mb-6">General Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-brand-cream/40 mb-2 font-bold">Recipe Title</label>
                    <input 
                      required
                      type="text"
                      value={formData.title}
                      onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm text-brand-cream focus:outline-none focus:border-brand-gold/50"
                      placeholder="e.g. Traditional Smoked Mutton Biryani"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-brand-cream/40 mb-2 font-bold">Category</label>
                      <select 
                        value={formData.category}
                        onChange={e => setFormData(p => ({ ...p, category: e.target.value as any }))}
                        className="w-full bg-white/5 border border-white/10 px-4 py-3 text-xs text-brand-cream focus:outline-none focus:border-brand-gold/50"
                      >
                        {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c} className="bg-[#1A1816]">{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-brand-cream/40 mb-2 font-bold">Flavor Profile</label>
                      <select 
                        value={formData.flavorProfile}
                        onChange={e => setFormData(p => ({ ...p, flavorProfile: e.target.value as any }))}
                        className="w-full bg-white/5 border border-white/10 px-4 py-3 text-xs text-brand-cream focus:outline-none focus:border-brand-gold/50"
                      >
                        {FLAVOR_PROFILES.map(f => <option key={f.name} value={f.name} className="bg-[#1A1816]">{f.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-brand-cream/40 mb-2 font-bold">Description</label>
                    <textarea 
                      required
                      rows={3}
                      value={formData.description}
                      onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm text-brand-cream focus:outline-none focus:border-brand-gold/50 font-sans leading-relaxed"
                      placeholder="Briefly describe the soul of this dish..."
                    />
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xs uppercase tracking-widest font-bold text-brand-gold mb-6">Ingredients</h3>
                <div className="space-y-3">
                  {formData.ingredients?.map((ing, i) => (
                    <input 
                      key={i}
                      value={ing}
                      onChange={e => {
                        const newIngs = [...(formData.ingredients || [])];
                        newIngs[i] = e.target.value;
                        setFormData(p => ({ ...p, ingredients: newIngs }));
                      }}
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm text-brand-cream focus:outline-none focus:border-brand-gold/50"
                      placeholder={`Ingredient ${i + 1}`}
                    />
                  ))}
                  <button 
                    type="button"
                    onClick={handleAddIngredient}
                    className="text-[10px] uppercase tracking-widest font-bold text-brand-gold/60 hover:text-brand-gold"
                  >
                    + Add Ingredient
                  </button>
                </div>
              </section>
            </div>

            <div className="space-y-8">
              <section>
                <h3 className="text-xs uppercase tracking-widest font-bold text-brand-gold mb-6">Heritage Note</h3>
                <div className="p-6 bg-brand-gold/5 border border-brand-gold/10 relative">
                  <Info className="absolute -top-3 -right-3 w-6 h-6 text-brand-gold bg-[#1A1816] rounded-full p-1" />
                  <textarea 
                    value={formData.heritage}
                    onChange={e => setFormData(p => ({ ...p, heritage: e.target.value }))}
                    className="w-full bg-transparent border-none p-0 text-sm text-brand-cream leading-relaxed italic focus:ring-0 placeholder:text-brand-cream/20"
                    placeholder="Share the story, family secret, or historical significance of this recipe..."
                    rows={4}
                  />
                </div>
              </section>

              <section>
                <h3 className="text-xs uppercase tracking-widest font-bold text-brand-gold mb-6">Preparation Steps</h3>
                <div className="space-y-4">
                  {formData.instructions?.map((step, i) => (
                    <div key={i} className="flex gap-4">
                      <span className="text-brand-gold font-bold text-xs pt-3">{i + 1}.</span>
                      <textarea 
                        value={step}
                        onChange={e => {
                          const newSteps = [...(formData.instructions || [])];
                          newSteps[i] = e.target.value;
                          setFormData(p => ({ ...p, instructions: newSteps }));
                        }}
                        className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm text-brand-cream focus:outline-none focus:border-brand-gold/50"
                        placeholder={`Step ${i + 1}`}
                        rows={2}
                      />
                    </div>
                  ))}
                  <button 
                    type="button"
                    onClick={handleAddStep}
                    className="text-[10px] uppercase tracking-widest font-bold text-brand-gold/60 hover:text-brand-gold ml-7"
                  >
                    + Add Step
                  </button>
                </div>
              </section>
            </div>
          </div>

          <div className="mt-16 flex justify-end">
            <button 
              type="submit"
              className="px-12 py-5 bg-brand-gold text-brand-bg font-bold uppercase tracking-[0.2em] text-sm hover:bg-brand-gold/90 transition-all flex items-center gap-3 shadow-lg shadow-brand-gold/10"
            >
              <Save className="h-5 w-5" />
              Archiving Recipe
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
