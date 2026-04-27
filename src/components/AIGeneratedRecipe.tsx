import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, FileDown, Bookmark, Info, ChefHat } from 'lucide-react';
import { Recipe } from '../types';

interface AIGeneratedRecipeProps {
  recipe: Recipe | null;
  onClose: () => void;
  onSave: () => void;
  onStartKitchenMode: (recipe: Recipe) => void;
  isSaved?: boolean;
}

export function AIGeneratedRecipe({ recipe, onClose, onSave, onStartKitchenMode, isSaved }: AIGeneratedRecipeProps) {
  const [showPdfSettings, setShowPdfSettings] = useState(false);
  const [pdfOptions, setPdfOptions] = useState({
    showHeritage: true,
    fontSize: 'normal' as 'small' | 'normal' | 'large'
  });

  const handlePrint = () => {
    setShowPdfSettings(false);
    setTimeout(() => {
      try {
        window.focus();
        window.print();
      } catch (e) {
        console.error("Print failed:", e);
        alert("Please open the app in a new tab to create a PDF.");
      }
    }, 100);
  };

  const fontSizeClasses = {
    small: 'text-xs',
    normal: 'text-sm',
    large: 'text-base'
  };

  return (
    <AnimatePresence>
      {recipe && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={`mt-16 overflow-hidden print:m-0 relative z-20 ${pdfOptions.fontSize === 'small' ? 'print:text-[10px]' : pdfOptions.fontSize === 'large' ? 'print:text-[14px]' : 'print:text-[12px]'}`}
        >
          <div id="ai-recipe-container" className="glass-card p-10 md:p-20 border-brand-gold/30 bg-brand-gold/5 relative print:bg-white print:text-black print:p-8 print:border-none print:shadow-none">
            <div className="absolute top-8 right-8 print:hidden z-30 flex items-center gap-2">
              {showPdfSettings && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass-card p-4 mr-2 flex flex-col gap-4 min-w-[200px]"
                >
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={pdfOptions.showHeritage}
                      onChange={(e) => setPdfOptions(prev => ({ ...prev, showHeritage: e.target.checked }))}
                      className="w-4 h-4 rounded border-white/20 bg-white/5 text-brand-gold focus:ring-brand-gold"
                    />
                    <span className="text-[10px] uppercase font-bold tracking-widest text-white/60 group-hover:text-brand-gold transition-colors">Include Heritage</span>
                  </label>
                  
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-white/30 block">Font Size</span>
                    <div className="flex gap-2">
                      {(['small', 'normal', 'large'] as const).map(size => (
                        <button
                          key={size}
                          onClick={() => setPdfOptions(prev => ({ ...prev, fontSize: size }))}
                          className={`flex-1 py-1 text-[8px] uppercase font-bold tracking-tighter border transition-all ${
                            pdfOptions.fontSize === size 
                            ? 'bg-brand-gold text-brand-bg border-brand-gold' 
                            : 'border-white/10 text-white/40 hover:border-white/30'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={handlePrint}
                    className="w-full py-2 bg-brand-gold text-brand-bg text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-all"
                  >
                    Generate PDF
                  </button>
                </motion.div>
              )}
              
              <button 
                onClick={onClose}
                className="p-4 glass-card text-brand-gold/50 hover:text-brand-gold rounded-full transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="relative z-10">
              <span className="text-brand-gold uppercase text-xs tracking-mega font-bold mb-8 block print:text-brand-gold">Chef AI Masterpiece</span>
              <h3 className="text-5xl md:text-7xl font-serif font-bold mb-8 leading-none text-brand-cream print:text-black">{recipe.title}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12 py-10 border-y border-white/10 print:border-black/10">
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-4 print:text-black/40">The Essence</h4>
                  <p className="text-xl text-white/80 font-light italic leading-relaxed print:text-black/80">
                    {recipe.description}
                  </p>
                </div>
                {pdfOptions.showHeritage && (
                  <div>
                    <h4 className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-4 print:text-black/40">Legacy & Lore</h4>
                    <p className="text-sm text-white/60 font-light leading-relaxed print:text-black/60">
                      {recipe.heritage}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-12 mb-16">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-white/30 mb-2 font-bold print:text-black/40">Preparation</span>
                  <span className="text-2xl font-serif text-brand-gold">{recipe.time}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-white/30 mb-2 font-bold print:text-black/40">Capacity</span>
                  <span className="text-2xl font-serif text-brand-gold">{recipe.servings}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-white/30 mb-2 font-bold print:text-black/40">Flavor</span>
                  <span className="text-2xl font-serif text-brand-gold capitalize">{recipe.flavorProfile}</span>
                </div>
              </div>

              {/* Full Recipe Content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 py-16 border-t border-white/10 print:border-black/10">
                <div>
                  <h4 className="text-xs uppercase font-bold tracking-mega mb-10 opacity-40 print:text-black/40">The Pantry</h4>
                  <ul className="space-y-6">
                    {recipe.ingredients.map((ing, i) => (
                      <li key={i} className="flex gap-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-gold mt-1.5 flex-shrink-0" />
                        <span className="text-sm font-light text-white/70 leading-relaxed uppercase tracking-widest print:text-black/80">{ing}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs uppercase font-bold tracking-mega mb-10 opacity-40 print:text-black/40">The Process</h4>
                  <div className="space-y-12">
                    {recipe.instructions.map((step, i) => (
                      <div key={i} className="relative pl-16">
                        <span className="absolute left-0 top-0 font-serif text-5xl text-brand-gold/20 font-bold leading-none print:text-brand-gold/10">0{i + 1}</span>
                        <p className="text-sm font-light leading-relaxed text-white/60 tracking-wider uppercase print:text-black/70">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-8 print:hidden relative z-30">
                <button 
                  onClick={() => recipe && onStartKitchenMode(recipe)}
                  className="px-8 py-4 bg-brand-gold text-brand-bg text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-all flex items-center gap-2 shadow-lg shadow-brand-gold/10"
                >
                  <ChefHat className="w-4 h-4" /> Start Kitchen Mode
                </button>
                <button 
                  onClick={onSave}
                  disabled={isSaved}
                  className={`px-8 py-4 text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${
                    isSaved 
                    ? 'bg-green-600/20 text-green-500 border border-green-500/30 cursor-default'
                    : 'glass-card border border-white/10 text-white/50 hover:bg-white/5'
                  }`}
                >
                  {isSaved ? <Heart className="w-4 h-4 fill-current" /> : <Bookmark className="w-4 h-4" />}
                  {isSaved ? 'Saved to My Recipes' : 'Save to My Recipes'}
                </button>
                <button 
                  onClick={() => setShowPdfSettings(!showPdfSettings)}
                  className={`px-8 py-4 glass-card text-brand-gold text-[10px] font-bold uppercase tracking-widest hover:border-brand-gold/50 transition-all flex items-center gap-2 cursor-pointer ${showPdfSettings ? 'border-brand-gold bg-brand-gold/10' : ''}`}
                >
                  <FileDown className="w-4 h-4" /> PDF Settings
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
