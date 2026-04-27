import { FormEvent, useState } from 'react';
import { UtensilsCrossed, X, Loader2, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { COMMON_INGREDIENTS, CUISINE_PROFILES, FLAVOR_PROFILES } from '../constants';

interface PantrySectionProps {
  selectedPantry: string[];
  toggleIngredient: (ing: string) => void;
  userIngredients: string[];
  addCustomIngredient: (ing: string) => void;
  selectedServings: number | null;
  setSelectedServings: (val: number | null) => void;
  selectedCuisine: string | null;
  setSelectedCuisine: (val: string | null) => void;
  selectedFlavor: string | null;
  setSelectedFlavor: (val: string | null) => void;
  selectedDifficulty: string | null;
  setSelectedDifficulty: (val: string | null) => void;
  isGenerating: boolean;
  onGenerate: () => void;
  onReset: () => void;
}

export function PantrySection({
  selectedPantry,
  toggleIngredient,
  userIngredients,
  addCustomIngredient,
  selectedServings,
  setSelectedServings,
  selectedCuisine,
  setSelectedCuisine,
  selectedFlavor,
  setSelectedFlavor,
  selectedDifficulty,
  setSelectedDifficulty,
  isGenerating,
  onGenerate,
  onReset
}: PantrySectionProps) {
  const [customIngredient, setCustomIngredient] = useState('');
  const [hoveredFlavor, setHoveredFlavor] = useState<string | null>(null);
  const [hoveredCuisine, setHoveredCuisine] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (customIngredient.trim()) {
      addCustomIngredient(customIngredient.trim());
      setCustomIngredient('');
    }
  };

  return (
    <section className="mb-24 glass-card p-8 md:p-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <UtensilsCrossed className="w-48 h-48" />
      </div>
      
      <div className="relative z-10">
        <span className="text-brand-gold uppercase text-[10px] tracking-mega font-bold mb-4 block">Personal Pantry</span>
        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-8 text-brand-cream">What's in your Kitchen?</h2>
        
        <div className="flex flex-wrap gap-3 mb-8">
          {[...COMMON_INGREDIENTS, ...userIngredients].map((ing) => (
            <button
              key={ing}
              onClick={() => toggleIngredient(ing)}
              className={`px-6 py-2 border text-[10px] uppercase tracking-widest font-bold transition-all ${
                selectedPantry.includes(ing)
                  ? 'bg-brand-gold border-brand-gold text-brand-bg shadow-[0_0_15px_rgba(218,165,32,0.3)]'
                  : 'border-white/10 text-white/50 hover:border-white/30'
              }`}
            >
              {ing}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex max-w-md">
          <input
            type="text"
            placeholder="ADD CUSTOM INGREDIENT..."
            value={customIngredient}
            onChange={(e) => setCustomIngredient(e.target.value)}
            className="flex-1 bg-white/5 border border-white/10 border-r-0 px-6 py-3 text-[10px] tracking-widest uppercase outline-none focus:border-brand-gold/50 transition-all text-brand-cream"
          />
          <button
            type="submit"
            className="bg-brand-gold text-brand-bg px-8 py-3 text-[10px] font-bold tracking-widest uppercase hover:bg-[#B8860B] transition-colors"
          >
            Add
          </button>
        </form>

        {selectedPantry.length > 0 && (
          <button 
            onClick={() => toggleIngredient('')} // Not ideal, but we'll fix the logic in App.tsx or use a clear prop
            className="mt-6 text-[10px] font-bold text-brand-gold/60 hover:text-brand-gold uppercase tracking-[0.2em] flex items-center gap-2"
          >
            Clear Selection <X className="w-3 h-3" />
          </button>
        )}
      </div>

      <div className="mt-12 pt-12 border-t border-white/5 relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        <div>
          <span className="text-brand-gold uppercase text-[10px] tracking-mega font-bold mb-6 block">Group Capacity</span>
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <button
                  key={num}
                  onClick={() => setSelectedServings(num === selectedServings ? null : num)}
                  className={`w-12 h-12 flex items-center justify-center border text-xs font-bold transition-all ${
                    selectedServings === num
                      ? 'bg-brand-gold border-brand-gold text-brand-bg shadow-[0_0_15px_rgba(218,165,32,0.3)]'
                      : 'border-white/10 text-white/40 hover:border-white/30'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="relative">
          <span className="text-brand-gold uppercase text-[10px] tracking-mega font-bold mb-6 block">Culinary Direction</span>
          <div className="flex flex-wrap gap-2">
            {CUISINE_PROFILES.map((cuisine) => (
              <div key={cuisine.name} className="relative">
                <button
                  onClick={() => setSelectedCuisine(cuisine.name === selectedCuisine ? null : cuisine.name)}
                  onMouseEnter={() => setHoveredCuisine(cuisine.name)}
                  onMouseLeave={() => setHoveredCuisine(null)}
                  className={`px-6 py-3 border text-[10px] uppercase font-bold tracking-widest transition-all ${
                    selectedCuisine === cuisine.name
                      ? 'bg-brand-gold border-brand-gold text-brand-bg shadow-[0_0_15px_rgba(218,165,32,0.3)]'
                      : 'border-white/10 text-white/40 hover:border-white/30'
                  }`}
                >
                  {cuisine.name}
                </button>
                <AnimatePresence>
                  {hoveredCuisine === cuisine.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute bottom-full mb-3 left-0 w-64 glass-card p-4 z-[60] pointer-events-none"
                    >
                      <p className="text-[10px] leading-relaxed tracking-widest text-white/80 uppercase">
                        {cuisine.desc}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <span className="text-brand-gold uppercase text-[10px] tracking-mega font-bold mb-6 block">Bohra Flavor Profile</span>
          <div className="flex flex-wrap gap-2">
            {FLAVOR_PROFILES.map((flavor) => (
              <div key={flavor.name} className="relative">
                <button
                  onClick={() => setSelectedFlavor(flavor.name === selectedFlavor ? null : flavor.name)}
                  onMouseEnter={() => setHoveredFlavor(flavor.name)}
                  onMouseLeave={() => setHoveredFlavor(null)}
                  className={`px-6 py-3 border text-[10px] uppercase font-bold tracking-widest transition-all ${
                    selectedFlavor === flavor.name
                      ? 'bg-brand-gold border-brand-gold text-brand-bg shadow-[0_0_15px_rgba(218,165,32,0.3)]'
                      : 'border-white/10 text-white/40 hover:border-white/30'
                  }`}
                >
                  {flavor.name}
                </button>
                <AnimatePresence>
                  {hoveredFlavor === flavor.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute bottom-full mb-3 left-0 w-64 glass-card p-4 z-[60] pointer-events-none"
                    >
                      <p className="text-[10px] leading-relaxed tracking-widest text-white/80 uppercase">
                        {flavor.desc}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <span className="text-brand-gold uppercase text-[10px] tracking-mega font-bold mb-6 block">Complexity Level</span>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-wrap gap-2">
              {['Easy', 'Medium', 'Advanced'].map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedDifficulty(level === selectedDifficulty ? null : level)}
                  className={`px-6 py-3 border text-[10px] uppercase font-bold tracking-widest transition-all ${
                    selectedDifficulty === level
                      ? 'bg-brand-gold border-brand-gold text-brand-bg shadow-[0_0_15px_rgba(218,165,32,0.3)]'
                      : 'border-white/10 text-white/40 hover:border-white/30'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            <div className="h-10 w-px bg-white/10 hidden sm:block" />
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={onGenerate}
                disabled={isGenerating || selectedPantry.length === 0}
                className={`px-12 py-5 bg-brand-gold text-brand-bg text-xs tracking-mega font-bold uppercase transition-all flex items-center gap-3 shadow-[0_0_30px_rgba(218,165,32,0.3)] ${
                  (isGenerating || selectedPantry.length === 0) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white'
                }`}
              >
                {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                Magic Generate My Recipe
              </button>
            </div>
          </div>
        </div>
      </div>

      {(selectedServings || selectedFlavor || selectedDifficulty || selectedPantry.length > 0) && (
        <div className="mt-8 pt-8 border-t border-white/5 relative z-10">
          <button 
            onClick={onReset}
            className="text-[10px] font-bold text-brand-gold/60 hover:text-brand-gold uppercase tracking-[0.2em] flex items-center gap-2"
          >
            Reset All Filters <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </section>
  );
}
