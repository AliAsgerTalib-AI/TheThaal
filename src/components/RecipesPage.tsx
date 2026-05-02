import React, { useState, useMemo } from 'react';
import { Recipe } from '../types';
import { RecipeCard } from './RecipeCard';
import { RecipeModal } from './RecipeModal';
import { PantrySection } from './PantrySection';
import { AIGeneratedRecipe } from './AIGeneratedRecipe';
import { VERIFIED_RECIPES } from '../data/verifiedRecipes';
import { Search, Filter, Plus, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CATEGORIES } from '../constants';
import { GoogleGenAI } from "@google/genai";

interface RecipesPageProps {
  userRecipes: Recipe[];
  onAddUserRecipe: (recipe: Recipe) => void;
  onArchiveRecipe: (recipe: Recipe) => void;
  archivedRecipes: Recipe[];
  onStartKitchenMode: (recipe: Recipe) => void;
  searchQuery: string;
}

export function RecipesPage({ 
  userRecipes, 
  onAddUserRecipe,
  onArchiveRecipe,
  archivedRecipes,
  onStartKitchenMode,
  searchQuery: externalSearchQuery
}: RecipesPageProps) {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [localSearchQuery, setLocalSearchQuery] = useState('');

  const ai = useMemo(() => new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! }), []);

  const allRecipes = useMemo(() => {
    return [...VERIFIED_RECIPES, ...userRecipes];
  }, [userRecipes]);

  const toggleIngredient = (ingredient: string) => {
    setSelectedIngredients(prev => 
      prev.includes(ingredient) 
        ? prev.filter(i => i !== ingredient) 
        : [...prev, ingredient]
    );
  };

  const handleGenerateRecipe = async () => {
    if (selectedIngredients.length === 0) return;
    setIsGenerating(true);
    
    const prompt = `Act as an expert Dawoodi Bohra Master Chef. Generate an authentic Bohra recipe using these ingredients: ${selectedIngredients.join(', ')}. 
    Return ONLY a JSON object matching this TypeScript interface:
    interface Recipe {
      title: string;
      category: 'Meethas' | 'Kharaas' | 'Jamaan' | 'Salad';
      description: string;
      image: string;
      time: string;
      servings: string;
      servingCount: number;
      flavorProfile: string;
      difficulty: 'Easy' | 'Medium' | 'Advanced';
      ingredients: string[];
      instructions: string[];
      heritage: string;
    }
    Ensure the heritage section explains the Bohra traditional context. Use a high-quality food image URL from Unsplash.`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
        }
      });
      
      const text = response.text || "";
      const jsonStr = text.replace(/```json|```/g, '').trim();
      const recipe = JSON.parse(jsonStr);
      
      setGeneratedRecipe({
        ...recipe,
        id: `ai-${Date.now()}`,
        cuisineType: 'Traditional',
        verified: false
      });
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredRecipes = useMemo(() => {
    const query = (externalSearchQuery || localSearchQuery).toLowerCase();
    return allRecipes.filter(recipe => {
      const matchesSearch = recipe.title.toLowerCase().includes(query) || 
                          recipe.description.toLowerCase().includes(query);
      const matchesCategory = activeCategory === 'All' || recipe.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [allRecipes, localSearchQuery, externalSearchQuery, activeCategory]);

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
      <div className="mb-16 text-center">
        <div className="inline-flex items-center gap-2 mb-4">
          <span className="h-0.5 w-12 bg-brand-gold animate-glow" />
          <span className="text-[10px] uppercase tracking-[0.4em] text-brand-gold font-bold">Culinary Archive</span>
        </div>
        <h1 className="font-serif text-5xl md:text-8xl text-brand-cream leading-none tracking-tight mb-8">
          Recipes of <span className="text-brand-gold font-light italic">Tradition</span>
        </h1>
      </div>

      <PantrySection 
        selectedIngredients={selectedIngredients}
        onToggleIngredient={toggleIngredient}
        onCook={handleGenerateRecipe}
        isGenerating={isGenerating}
      />

      <AnimatePresence>
        {generatedRecipe && (
          <AIGeneratedRecipe 
            recipe={generatedRecipe}
            onClose={() => setGeneratedRecipe(null)}
            onSave={(r) => {
              onAddUserRecipe(r);
              setGeneratedRecipe(null);
            }}
            onStartKitchenMode={(r) => {
              onStartKitchenMode(r);
              setGeneratedRecipe(null);
            }}
            isSaved={userRecipes.some(r => r.id === generatedRecipe.id || r.title === generatedRecipe.title)}
          />
        )}
      </AnimatePresence>

      <div className="mb-16 border-t border-white/5 pt-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <h2 className="font-serif text-3xl text-brand-cream">The Collection</h2>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative group flex-1 md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-cream/30 group-focus-within:text-brand-gold transition-colors" />
              <input 
                type="text" 
                placeholder="Search collection..."
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
                className="w-full bg-[#1A1816] border border-white/5 py-4 pl-12 pr-6 text-sm text-brand-cream focus:outline-none focus:border-brand-gold/50 transition-all placeholder:text-brand-cream/20 font-sans"
              />
            </div>
            
            <div className="relative group min-w-[160px]">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-gold/60" />
              <select 
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="w-full bg-[#1A1816] border border-white/5 py-4 pl-12 pr-10 text-[10px] uppercase tracking-widest font-bold text-brand-cream/80 appearance-none focus:outline-none focus:border-brand-gold/50 transition-all cursor-pointer"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat} className="bg-brand-bg uppercase">{cat}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-3 w-3 text-brand-cream/30 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredRecipes.map((recipe, index) => (
            <RecipeCard 
              key={recipe.id} 
              recipe={recipe} 
              index={index}
              onClick={setSelectedRecipe}
              onArchive={onArchiveRecipe}
              isArchived={archivedRecipes.some(r => r.id === recipe.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      {filteredRecipes.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-32 border border-dashed border-white/10 rounded-lg"
        >
          <div className="mb-6 mx-auto w-16 h-16 rounded-full bg-brand-gold/5 flex items-center justify-center">
            <Search className="w-6 h-6 text-brand-gold/40" />
          </div>
          <h3 className="text-xl font-serif text-brand-cream mb-2">No results</h3>
          <p className="text-brand-cream/40 text-sm font-sans">No archived recipes match your criteria.</p>
        </motion.div>
      )}

      <AnimatePresence>
        {selectedRecipe && (
          <RecipeModal 
            recipe={selectedRecipe}
            onClose={() => setSelectedRecipe(null)}
            onStartKitchenMode={(recipe) => {
              onStartKitchenMode(recipe);
              setSelectedRecipe(null);
            }}
            onArchive={onArchiveRecipe}
            isArchived={archivedRecipes.some(r => r.id === selectedRecipe.id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
