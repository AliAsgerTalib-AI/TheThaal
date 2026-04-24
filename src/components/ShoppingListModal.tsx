import { useState } from 'react';
import { motion } from 'motion/react';
import { X, FileDown, ShoppingCart, Check } from 'lucide-react';
import { Recipe } from '../types';

interface ShoppingListModalProps {
  recipe: Recipe;
  onClose: () => void;
}

export function ShoppingListModal({ recipe, onClose }: ShoppingListModalProps) {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const handlePrint = () => {
    const win = window.open('', '_blank', 'width=600,height=700');
    if (!win) return;
    win.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${recipe.title} – Shopping List</title>
  <style>
    body { font-family: Georgia, serif; padding: 48px; background: #fff; color: #111; }
    h1 { font-size: 2em; margin-bottom: 4px; }
    h2 { font-size: 0.7em; text-transform: uppercase; letter-spacing: 0.35em; color: #888; margin-bottom: 2em; border-bottom: 1px solid #eee; padding-bottom: 1em; }
    ul { list-style: none; padding: 0; margin: 0; }
    li { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 0.95em; }
    .checkbox { width: 18px; height: 18px; border: 2px solid #ccc; flex-shrink: 0; }
  </style>
</head>
<body>
  <h1>${recipe.title}</h1>
  <h2>Shopping List &middot; Serves ${recipe.servings}</h2>
  <ul>
    ${recipe.ingredients.map(ing => `<li><div class="checkbox"></div>${ing}</li>`).join('\n    ')}
  </ul>
  <script>window.onload = function() { window.print(); }<\/script>
</body>
</html>`);
    win.document.close();
  };

  const remaining = recipe.ingredients.length - checked.size;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto"
      style={{ background: 'rgba(0,0,0,0.92)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.92, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 24 }}
        className="glass-card w-full max-w-lg p-8 md:p-10 relative my-auto"
      >
        <button onClick={onClose} className="absolute top-6 right-6 p-2 glass-card text-brand-gold/50 hover:text-brand-gold rounded-full transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-1">
          <ShoppingCart className="w-4 h-4 text-brand-gold" />
          <span className="text-brand-gold uppercase text-[10px] tracking-mega font-bold">Shopping List</span>
        </div>
        <h3 className="text-2xl font-serif font-bold mb-1 text-brand-cream">{recipe.title}</h3>
        <p className="text-[10px] uppercase tracking-widest text-white/30 mb-8">Serves {recipe.servings}</p>

        <ul className="space-y-2 mb-8 max-h-[50vh] overflow-y-auto pr-1">
          {recipe.ingredients.map((ing, i) => (
            <li key={i}>
              <button
                onClick={() => toggleItem(i)}
                className={`w-full flex items-center gap-4 py-3 px-4 border transition-all text-left ${
                  checked.has(i)
                    ? 'border-white/5 bg-white/3 text-white/25'
                    : 'border-white/10 hover:border-brand-gold/30 text-white/70 hover:text-white/90'
                }`}
              >
                <div className={`w-5 h-5 flex-shrink-0 border flex items-center justify-center transition-all ${
                  checked.has(i) ? 'border-brand-gold bg-brand-gold' : 'border-white/20'
                }`}>
                  {checked.has(i) && <Check className="w-3 h-3 text-brand-bg" />}
                </div>
                <span className={`text-[11px] uppercase tracking-widest font-bold transition-all ${checked.has(i) ? 'line-through' : ''}`}>
                  {ing}
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between pt-6 border-t border-white/5">
          <span className="text-[10px] uppercase tracking-widest text-white/30">
            {remaining > 0 ? `${remaining} item${remaining !== 1 ? 's' : ''} remaining` : 'All items collected!'}
          </span>
          <button
            onClick={handlePrint}
            className="px-6 py-3 glass-card text-brand-gold text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:border-brand-gold/50 transition-all"
          >
            <FileDown className="w-4 h-4" /> Print List
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
