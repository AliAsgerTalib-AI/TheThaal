import { motion, AnimatePresence } from 'motion/react';
import { X, BookOpen, Clock, Users, Info, Heart, Share2 } from 'lucide-react';
import { Recipe } from '../types';

interface RecipeModalProps {
  recipe: Recipe | null;
  onClose: () => void;
}

export function RecipeModal({ recipe, onClose }: RecipeModalProps) {
  if (!recipe) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-12">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-brand-bg/95 backdrop-blur-2xl"
        />
        <motion.div
          layoutId={recipe.id}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="relative bg-brand-bg border border-white/10 w-full max-w-7xl h-full md:h-auto md:max-h-[85vh] overflow-hidden flex flex-col lg:flex-row shadow-2xl"
        >
          {recipe.image ? (
            <div className="w-full lg:w-5/12 h-80 lg:h-auto relative group">
              <img 
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-brand-bg/20" />
              <button 
                onClick={onClose}
                className="absolute top-8 left-8 p-3 glass-card rounded-full text-white lg:hidden z-20"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="w-full lg:w-3/12 bg-white/5 border-r border-white/10 flex items-center justify-center p-12">
              <div className="text-brand-gold/20 rotate-12">
                <BookOpen className="w-32 h-32" />
              </div>
            </div>
          )}
          
          <div className="flex-1 overflow-y-auto p-8 md:p-20 relative">
            <div className="absolute inset-0 immersive-gradient opacity-10 pointer-events-none" />
            
            <div className="hidden lg:flex justify-end mb-12">
              <button 
                onClick={onClose}
                className="p-4 glass-card hover:border-brand-gold/50 transition-colors text-brand-gold"
              >
                <X className="w-5 h-5 text-tracking-widest" />
              </button>
            </div>

            <div className="mb-16 relative z-10">
              <span className="text-brand-gold font-bold uppercase tracking-mega text-[10px] mb-6 block">
                {recipe.category} Tradition
              </span>
              <h2 className="text-6xl md:text-8xl font-serif font-bold mb-10 leading-none text-brand-cream">{recipe.title}</h2>
              
              <div className="mb-16 glass-card p-10 border-l-4 border-brand-gold">
                <h4 className="text-brand-gold uppercase text-[10px] tracking-mega font-bold mb-4">Legacy & Lore</h4>
                <p className="text-lg md:text-xl text-white/80 font-light leading-relaxed italic">
                  {recipe.heritage}
                </p>
              </div>
              
              <div className="flex gap-12 py-10 border-y border-white/10">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-white/30 mb-2">Duration</span>
                  <span className="text-2xl font-serif text-brand-cream">{recipe.time}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-white/30 mb-2">Serves</span>
                  <span className="text-2xl font-serif text-brand-cream">{recipe.servings}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-white/30 mb-2">Expertise</span>
                  <span className="text-2xl font-serif text-brand-gold">{recipe.difficulty}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-20 relative z-10">
              <div>
                <h4 className="text-xs uppercase font-bold tracking-mega mb-10 opacity-40">The Pantry</h4>
                <ul className="space-y-6">
                  {recipe.ingredients.map((ing, i) => (
                    <li key={i} className="flex gap-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-gold mt-1.5 flex-shrink-0" />
                      <span className="text-sm font-light text-white/70 leading-relaxed uppercase tracking-widest">{ing}</span>
                    </li>
                  ))}
                </ul>

                {recipe.substitutions && recipe.substitutions.length > 0 && (
                  <div className="mt-16 p-8 glass-card border border-brand-gold/10">
                    <div className="flex items-center gap-3 mb-6">
                      <Info className="w-4 h-4 text-brand-gold" />
                      <h5 className="text-[10px] uppercase font-bold tracking-widest text-brand-gold">Global Pantry Substitutions</h5>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {recipe.substitutions.map((sub, i) => (
                        <div key={i} className="flex flex-col gap-1">
                          <span className="text-[9px] uppercase tracking-widest text-white/30 font-bold">Instead of {sub.original}</span>
                          <span className="text-xs text-white/70 italic">Try using {sub.substitute}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div>
                <h4 className="text-xs uppercase font-bold tracking-mega mb-10 opacity-40">The Process</h4>
                <div className="space-y-16">
                  {recipe.instructions.map((step, i) => (
                    <div key={i} className="relative pl-16">
                      <span className="absolute left-0 top-0 font-serif text-5xl text-brand-gold/20 font-bold leading-none">0{i + 1}</span>
                      <p className="text-sm font-light leading-relaxed text-white/60 tracking-wider mb-4 uppercase">{step.split('.')[0]}.</p>
                      <div className="h-[1px] w-full bg-white/5" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-24 flex items-center gap-8 relative z-10">
              <button className="flex-1 bg-brand-gold text-brand-bg py-5 uppercase font-bold tracking-widest text-xs hover:bg-[#B8860B] transition-all flex items-center justify-center gap-3">
                <Heart className="w-4 h-4" /> Save to Archive
              </button>
              <button className="p-5 glass-card text-brand-gold hover:border-brand-gold/40">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
