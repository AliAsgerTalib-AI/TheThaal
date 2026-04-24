import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, FileDown, Bookmark, Info } from 'lucide-react';
import { Recipe } from '../types';

interface AIGeneratedRecipeProps {
  recipe: Recipe | null;
  onClose: () => void;
  onSave: () => void;
  isSaved?: boolean;
}

export function AIGeneratedRecipe({ recipe, onClose, onSave, isSaved }: AIGeneratedRecipeProps) {
  const handlePrint = () => {
    const container = document.getElementById('ai-recipe-container');
    if (!container) return;

    const styles = Array.from(document.querySelectorAll('style'))
      .map(el => el.innerHTML).join('\n');
    const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
      .map(el => el.outerHTML).join('\n');

    const popup = window.open('', '_blank', 'width=900,height=700');
    if (!popup) {
      window.focus();
      window.print();
      return;
    }

    popup.document.open();
    popup.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${recipe?.title ?? 'Recipe'} – Thaali Traditions</title>
  ${links}
  <style>${styles}</style>
  <style>body { background: white; margin: 0; padding: 0; } #ai-recipe-container { max-width: 900px; margin: 0 auto; }</style>
</head>
<body>
  ${container.outerHTML}
  <script>window.onload = function() { window.print(); };<\/script>
</body>
</html>`);
    popup.document.close();
  };

  return (
    <AnimatePresence>
      {recipe && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="mt-16 overflow-hidden print:m-0 relative z-20"
        >
          <div id="ai-recipe-container" className="glass-card p-10 md:p-20 border-brand-gold/30 bg-brand-gold/5 relative print:bg-white print:text-black print:p-8 print:border-none print:shadow-none">
            <div className="absolute top-8 right-8 print:hidden z-30">
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
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-4 print:text-black/40">Legacy & Lore</h4>
                  <p className="text-sm text-white/60 font-light leading-relaxed print:text-black/60">
                    {recipe.heritage}
                  </p>
                </div>
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
                  onClick={onSave}
                  disabled={isSaved}
                  className={`px-8 py-4 text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${
                    isSaved 
                    ? 'bg-green-600/20 text-green-500 border border-green-500/30 cursor-default'
                    : 'bg-brand-gold text-brand-bg hover:bg-white'
                  }`}
                >
                  {isSaved ? <Heart className="w-4 h-4 fill-current" /> : <Bookmark className="w-4 h-4" />}
                  {isSaved ? 'Saved to My Recipes' : 'Save to My Recipes'}
                </button>
                <button 
                  onClick={handlePrint}
                  className="px-8 py-4 glass-card text-brand-gold text-[10px] font-bold uppercase tracking-widest hover:border-brand-gold/50 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <FileDown className="w-4 h-4" /> Create a PDF
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
