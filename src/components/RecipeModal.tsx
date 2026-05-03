import React, { useState, useMemo } from 'react';
import { Recipe } from '../types';
import { X, Clock, Users, ChefHat, BookOpen, ScrollText, Library, Wand2, Loader2, Minus, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";

function parseFraction(s: string): number {
  if (s.includes('/')) {
    const [n, d] = s.split('/').map(Number);
    return n / d;
  }
  return parseFloat(s);
}

const FRACS: [number, string][] = [
  [0.125, '⅛'], [0.25, '¼'], [0.333, '⅓'], [0.375, '⅜'],
  [0.5, '½'], [0.625, '⅝'], [0.667, '⅔'], [0.75, '¾'], [0.875, '⅞']
];

function scaleIngredient(ing: string, ratio: number): string {
  if (Math.abs(ratio - 1) < 0.01) return ing;
  return ing.replace(/\b(\d+\/\d+|\d+(?:\.\d+)?)\b/g, (match) => {
    const num = parseFraction(match);
    const scaled = num * ratio;
    const whole = Math.floor(scaled);
    const dec = scaled - whole;
    const frac = FRACS.find(([v]) => Math.abs(dec - v) < 0.05);
    if (dec < 0.04) return whole > 0 ? String(whole) : '0';
    const fracStr = frac ? frac[1] : dec.toFixed(1);
    return whole > 0 ? `${whole} ${fracStr}` : fracStr;
  });
}

interface RecipeModalProps {
  recipe: Recipe;
  onClose: () => void;
  onStartKitchenMode: (recipe: Recipe) => void;
  onArchive: (recipe: Recipe) => void;
  isArchived?: boolean;
}

export function RecipeModal({ recipe, onClose, onStartKitchenMode, onArchive, isArchived }: RecipeModalProps) {
  const baseServings = recipe.servingCount || 4;
  const [scaledCount, setScaledCount] = useState(baseServings);
  const ratio = scaledCount / baseServings;

  const [subIngredient, setSubIngredient] = useState<string | null>(null);
  const [subResult, setSubResult] = useState<string | null>(null);
  const [isSubbing, setIsSubbing] = useState(false);

  const ai = useMemo(() => new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! }), []);

  const getSubstitution = async (ingredient: string) => {
    if (subIngredient === ingredient && subResult) {
      setSubIngredient(null);
      setSubResult(null);
      return;
    }
    setSubIngredient(ingredient);
    setSubResult(null);
    setIsSubbing(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: [{ role: "user", parts: [{ text: `For the Bohra dish "${recipe.title}", suggest a tradition-aware substitution for "${ingredient}". State what to use, the ratio, and how it affects the dish. Max 60 words.` }] }]
      });
      setSubResult(response.text || "The Master has no substitute — this ingredient is irreplaceable.");
    } catch {
      setSubResult("Unable to reach the Master's kitchen. Try again.");
    } finally {
      setIsSubbing(false);
    }
  };

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
        className="relative w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden border border-white/10 bg-[#1A1816] shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 p-2 text-brand-cream/60 hover:text-brand-gold transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="p-8 md:p-12">
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

            {/* Meta + Scaling */}
            <div className="mb-10 grid grid-cols-4 gap-6 border-y border-white/5 py-8">
              <div className="text-center">
                <Clock className="mx-auto mb-2 h-5 w-5 text-brand-gold/60" />
                <p className="text-[10px] uppercase tracking-widest text-brand-cream/40 mb-1">Time</p>
                <p className="font-bold text-sm tracking-wide">{recipe.time}</p>
              </div>
              <div className="text-center border-x border-white/5">
                <Users className="mx-auto mb-2 h-5 w-5 text-brand-gold/60" />
                <p className="text-[10px] uppercase tracking-widest text-brand-cream/40 mb-1">Base Serves</p>
                <p className="font-bold text-sm tracking-wide">{recipe.servings}</p>
              </div>
              <div className="text-center border-r border-white/5">
                <ChefHat className="mx-auto mb-2 h-5 w-5 text-brand-gold/60" />
                <p className="text-[10px] uppercase tracking-widest text-brand-cream/40 mb-1">Difficulty</p>
                <p className="font-bold text-sm tracking-wide">{recipe.difficulty}</p>
              </div>
              <div className="text-center">
                <div className="text-[10px] uppercase tracking-widest text-brand-cream/40 mb-2">Scale To</div>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setScaledCount(Math.max(1, scaledCount - 1))}
                    className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:border-brand-gold hover:text-brand-gold transition-all"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="font-bold text-sm w-8 text-center text-brand-gold">{scaledCount}</span>
                  <button
                    onClick={() => setScaledCount(scaledCount + 1)}
                    className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:border-brand-gold hover:text-brand-gold transition-all"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                {Math.abs(ratio - 1) > 0.01 && (
                  <div className="text-[9px] text-brand-gold/60 mt-1">×{ratio.toFixed(2)}</div>
                )}
              </div>
            </div>

            <div className="mb-12 space-y-10">
              {/* Ingredients with scaling + substitution */}
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-brand-gold" />
                    <h3 className="text-sm uppercase tracking-[0.2em] font-bold text-brand-cream/90">Ingredients</h3>
                    {Math.abs(ratio - 1) > 0.01 && (
                      <span className="text-[9px] bg-brand-gold/20 text-brand-gold px-2 py-0.5 rounded font-bold uppercase tracking-widest">
                        ×{ratio.toFixed(1)} Scale
                      </span>
                    )}
                  </div>
                  <span className="text-[9px] text-white/30 uppercase tracking-widest italic">click any ingredient to substitute</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1 gap-x-8">
                  {recipe.ingredients.map((ingredient, i) => (
                    <button
                      key={i}
                      onClick={() => getSubstitution(ingredient)}
                      className={`flex items-center gap-3 text-sm text-left px-2 py-1.5 rounded transition-all group w-full ${
                        subIngredient === ingredient
                          ? 'bg-brand-gold/10 border border-brand-gold/30 text-brand-gold'
                          : 'text-brand-cream/60 hover:text-brand-cream hover:bg-white/5'
                      }`}
                    >
                      <div className="h-1 w-1 rounded-full bg-brand-gold/40 shrink-0" />
                      <span className="flex-1">{scaleIngredient(ingredient, ratio)}</span>
                      <Wand2 className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity shrink-0" />
                    </button>
                  ))}
                </div>

                <AnimatePresence>
                  {subIngredient && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 overflow-hidden"
                    >
                      <div className="p-5 bg-brand-gold/5 border border-brand-gold/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2 text-[9px] uppercase font-bold text-brand-gold tracking-widest">
                          <Wand2 className="w-3 h-3" /> Substitution — {subIngredient}
                        </div>
                        {isSubbing ? (
                          <div className="flex items-center gap-3 text-white/40">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-xs">Consulting the Master's knowledge...</span>
                          </div>
                        ) : (
                          <p className="text-sm text-brand-cream/80 leading-relaxed italic">{subResult}</p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
                      <p className="text-sm text-brand-cream/70 leading-relaxed pt-1">{step}</p>
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
