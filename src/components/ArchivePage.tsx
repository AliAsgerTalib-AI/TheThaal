import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Library, Utensils, History, ChevronRight, Search, Clock, Trash2 } from 'lucide-react';
import { Recipe, ThaalPlan } from '../types';
import { RecipeModal } from './RecipeModal';

interface ArchivePageProps {
  onClose: () => void;
  recipes: Recipe[];
  plans: ThaalPlan[];
  onStartKitchenMode: (recipe: Recipe) => void;
  onPlanSelect: (plan: ThaalPlan) => void;
  onRemoveRecipe: (id: string) => void;
  onRemovePlan: (id: string) => void;
}

export function ArchivePage({
  onClose,
  recipes,
  plans,
  onStartKitchenMode,
  onPlanSelect,
  onRemoveRecipe,
  onRemovePlan
}: ArchivePageProps) {
  const [activeTab, setActiveTab] = useState<'recipes' | 'plans'>('recipes');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRecipes = recipes.filter(r => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPlans = plans.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.location && p.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen relative z-[200]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
        <div>
          <div className="inline-flex items-center gap-2 mb-4">
            <Library className="w-4 h-4 text-brand-gold" />
            <span className="text-[10px] uppercase tracking-[0.4em] text-brand-gold font-bold">Heritage Vault</span>
          </div>
          <h1 className="font-serif text-5xl md:text-7xl text-brand-cream leading-none tracking-tight">
            The <span className="text-brand-gold italic">Archive</span>
          </h1>
        </div>

        <button 
          onClick={onClose}
          className="p-4 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all active:scale-95"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8 mb-12 items-center justify-between">
        <div className="flex gap-4 p-1 bg-white/5 rounded-full">
          <button 
            onClick={() => setActiveTab('recipes')}
            className={`px-8 py-3 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${activeTab === 'recipes' ? 'bg-brand-gold text-brand-bg shadow-xl' : 'text-white/40 hover:text-white'}`}
          >
            Saved Recipes ({recipes.length})
          </button>
          <button 
            onClick={() => setActiveTab('plans')}
            className={`px-8 py-3 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${activeTab === 'plans' ? 'bg-brand-gold text-brand-bg shadow-xl' : 'text-white/40 hover:text-white'}`}
          >
            Thaal Experiences ({plans.length})
          </button>
        </div>

        <div className="relative group w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-cream/30 group-focus-within:text-brand-gold transition-colors" />
          <input 
            type="text" 
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1A1816]/50 backdrop-blur-sm border border-white/5 py-4 pl-12 pr-6 text-sm text-brand-cream focus:outline-none focus:border-brand-gold/50 transition-all placeholder:text-brand-cream/20 font-sans rounded-xl"
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'recipes' ? (
          <motion.div 
            key="recipes-archived"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredRecipes.length > 0 ? (
              filteredRecipes.map((recipe, idx) => (
                <div 
                  key={recipe.id}
                  className="group relative glass-card p-8 border-white/5 hover:border-brand-gold/30 transition-all duration-500"
                >
                  <div className="flex justify-between items-start mb-6">
                    <span className="px-2 py-1 bg-brand-gold/10 text-brand-gold text-[8px] font-black uppercase tracking-widest rounded-sm border border-brand-gold/20">
                      {recipe.category}
                    </span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveRecipe(recipe.id);
                      }}
                      className="p-2 bg-red-500/5 text-red-400 hover:bg-red-500/10 transition-all border border-red-500/20 rounded-full"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-2xl font-serif text-brand-cream group-hover:text-brand-gold transition-colors">{recipe.title}</h3>
                    <p className="text-xs text-white/40 line-clamp-3 italic font-light leading-relaxed">"{recipe.description}"</p>
                    
                    <div className="pt-6 flex items-center justify-between border-t border-white/5">
                      <div className="flex items-center gap-4 text-[10px] text-white/30 uppercase tracking-widest font-sans">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {recipe.time}</span>
                        <span className="h-3 w-px bg-white/10" />
                        <span className="flex items-center gap-1"><Utensils className="w-3 h-3" /> {recipe.category}</span>
                      </div>
                      <button 
                        onClick={() => setSelectedRecipe(recipe)}
                        className="text-brand-gold text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 group/btn"
                      >
                        Enrich View <ChevronRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-1" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-32 text-center border border-dashed border-white/10 rounded-2xl">
                <p className="text-white/20 italic font-light">No recipes found in your vault.</p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="plans-archived"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {filteredPlans.length > 0 ? (
              filteredPlans.map((plan, idx) => (
                <div 
                  key={plan.id}
                  onClick={() => onPlanSelect(plan)}
                  className="group glass-card p-10 border-white/10 hover:border-brand-gold/40 transition-all duration-500 cursor-pointer flex flex-col md:flex-row justify-between items-center gap-8"
                >
                  <div className="space-y-4 text-center md:text-left">
                    <div className="flex items-center gap-3 justify-center md:justify-start">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-brand-gold">{plan.month || 'Traditional'}</span>
                      <span className="h-px w-6 bg-brand-gold/30" />
                      <span className="text-[10px] uppercase tracking-widest font-bold text-white/30">{plan.guestCount} Guests</span>
                    </div>
                    <h3 className="text-3xl font-serif text-brand-cream group-hover:text-brand-gold transition-colors">{plan.title}</h3>
                    <p className="text-sm text-white/40 italic font-light max-w-xl">"{plan.pairingNotes}"</p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="flex -space-x-2">
                      {plan.dishes.slice(0, 4).map((d, i) => (
                        <div key={i} className="px-3 py-2 rounded-lg border border-brand-gold/30 bg-brand-gold/5 text-[8px] font-black uppercase text-brand-gold ring-2 ring-brand-bg">
                          {d.recipe.category?.[0] || 'D'}
                        </div>
                      ))}
                      {plan.dishes.length > 4 && (
                        <div className="px-2 py-2 rounded-lg border border-white/10 bg-zinc-900 text-[8px] font-bold text-white/40 ring-2 ring-brand-bg">
                          +{plan.dishes.length - 4}
                        </div>
                      )}
                    </div>
                    <div className="h-10 w-px bg-white/5 hidden sm:block" />
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemovePlan(plan.id);
                      }}
                      className="p-4 rounded-xl bg-red-500/5 text-red-400 hover:bg-red-500/10 transition-all border border-red-500/20"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <button className="px-8 py-4 bg-brand-gold text-brand-bg text-xs font-black uppercase tracking-widest shadow-xl group-hover:scale-105 active:scale-95 transition-all whitespace-nowrap">
                      Restore Experience
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-32 text-center border border-dashed border-white/10 rounded-2xl">
                <p className="text-white/20 italic font-light">No Thaal experiences saved yet.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedRecipe && (
          <RecipeModal 
            recipe={selectedRecipe}
            onClose={() => setSelectedRecipe(null)}
            onStartKitchenMode={(recipe) => {
              onStartKitchenMode(recipe);
              setSelectedRecipe(null);
              onClose();
            }}
            onArchive={() => {}} // Already archived
            isArchived={true}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
