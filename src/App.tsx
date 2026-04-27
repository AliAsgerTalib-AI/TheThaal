import { useState, useMemo } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Recipe } from './types';
import { Navigation } from './components/Navigation';
import { PantrySection } from './components/PantrySection';
import { AIGeneratedRecipe } from './components/AIGeneratedRecipe';
import { RecipeCard } from './components/RecipeCard';
import { RecipeModal } from './components/RecipeModal';
import { RecipeFormModal } from './components/RecipeFormModal';
import { KitchenMode } from './components/KitchenMode';
import { ThaalPlanner } from './components/ThaalPlanner';
import { SpicesPage } from './components/SpicesPage';
import { TraditionPage } from './components/TraditionPage';
import { AboutPage } from './components/AboutPage';
import { FLAVOR_PROFILES } from './constants';
import { VERIFIED_RECIPES } from './data/verifiedRecipes';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Search, ChefHat } from 'lucide-react';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isThaalPlannerOpen, setIsThaalPlannerOpen] = useState(false);
  const [isSpicesPageOpen, setIsSpicesPageOpen] = useState(false);
  const [isTraditionPageOpen, setIsTraditionPageOpen] = useState(false);
  const [isAboutPageOpen, setIsAboutPageOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
  const [aiGeneratedRecipe, setAiGeneratedRecipe] = useState<Recipe | null>(null);
  const [recipeInKitchen, setRecipeInKitchen] = useState<Recipe | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [recipeView, setRecipeView] = useState<'all' | 'verified' | 'user'>('all');

  const [selectedPantry, setSelectedPantry] = useState<string[]>([]);
  const [userIngredients, setUserIngredients] = useState<string[]>([]);
  const [selectedServings, setSelectedServings] = useState<number | null>(2);
  const [selectedFlavor, setSelectedFlavor] = useState<string | null>(null);
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>('Traditional');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>('Medium');

  const ai = useMemo(() => new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }), []);

  const toggleIngredient = (ing: string) => {
    if (ing === '') {
      setSelectedPantry([]);
      return;
    }
    setSelectedPantry(prev => 
      prev.includes(ing) ? prev.filter(i => i !== ing) : [...prev, ing]
    );
  };

  const handleAddUserRecipe = (recipe: Recipe) => {
    setUserRecipes(prev => [recipe, ...prev]);
    setIsCreateModalOpen(false);
  };

  const handleResetFilters = () => {
    setSelectedServings(2);
    setSelectedFlavor(null);
    setSelectedDifficulty('Medium');
    setSelectedPantry([]);
    setSelectedCuisine('Traditional');
  };

  const generateAIDish = async () => {
    if (selectedPantry.length === 0) return;

    setIsGenerating(true);
    try {
      const flavorDesc = FLAVOR_PROFILES.find(f => f.name === selectedFlavor)?.desc || "Traditional Bohra flavors";
      const prompt = `Act as a 30 year experienced Bohra cuisine and cook expert. Create a ${selectedCuisine === 'Fusion' ? 'modern Bohra Fusion' : 'Traditional Dawoodi Bohra'} dish recipe based on these specific criteria:
        Ingredients available: ${selectedPantry.join(', ')}
        Group Capacity: ${selectedServings || 4} guests
        Culinary Direction: ${selectedCuisine || 'Traditional'} (Note: If Fusion, blend Bohra techniques/flavors with another global cuisine)
        Bohra Flavor Profile: ${selectedFlavor || 'Zaikedaar'} (${flavorDesc})
        Complexity Level: ${selectedDifficulty || 'Medium'}

        Requirements:
        - The dish must feel authentic to Bohra culture or be a smart Bohra fusion.
        - 'ingredients': Each item MUST include precise quantities (e.g., "500g mutton", "2 tbsp Ghee").
        - 'heritage': A detailed, soulful narrative about the dish's historical roots, its significance in the Bohra "Thaal", or specific cultural anecdotes and family traditions associated with it. Aim for a "living history" feel.
        - RETURN ONLY VALID JSON. DO NOT INCLUDE ANY MARKDOWN WRAPPERS OR EXTRA TEXT.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              time: { type: Type.STRING },
              servings: { type: Type.STRING },
              ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
              instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
              heritage: { type: Type.STRING },
            },
            required: ["title", "description", "time", "servings", "ingredients", "instructions", "heritage"]
          }
        }
      });

      const data = JSON.parse(response.text || '{}');
      const newRecipe: Recipe = {
        ...data,
        id: `ai-${Date.now()}`,
        category: 'Main',
        image: '',
        servingCount: selectedServings || 4,
        flavorProfile: (selectedFlavor as any) || 'Zaikedaar',
        cuisineType: (selectedCuisine as any) || 'Traditional',
        difficulty: (selectedDifficulty as any) || 'Medium',
      };
      
      setAiGeneratedRecipe(newRecipe);
    } catch (error) {
      console.error("AI Generation Error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredRecipes = useMemo(() => {
    let allRecipes = [...VERIFIED_RECIPES, ...userRecipes];
    
    if (recipeView === 'verified') {
      allRecipes = VERIFIED_RECIPES;
    } else if (recipeView === 'user') {
      allRecipes = userRecipes;
    }

    return allRecipes.filter(recipe => {
      const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           recipe.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const recipeIngsLower = recipe.ingredients.map(i => i.toLowerCase());
      const matchesPantry = selectedPantry.length === 0 || 
                           selectedPantry.some(p => recipeIngsLower.some(ri => ri.includes(p.toLowerCase())));

      const matchesServings = selectedServings === null || recipe.servingCount === selectedServings;
      const matchesFlavor = selectedFlavor === null || recipe.flavorProfile === selectedFlavor;
      const matchesCuisine = selectedCuisine === null || recipe.cuisineType === selectedCuisine;
      const matchesDifficulty = selectedDifficulty === null || recipe.difficulty === selectedDifficulty;

      return matchesSearch && matchesPantry && matchesServings && matchesFlavor && matchesCuisine && matchesDifficulty;
    });
  }, [searchQuery, selectedPantry, selectedServings, selectedFlavor, selectedCuisine, selectedDifficulty, userRecipes]);

  return (
    <div className="min-h-screen bg-brand-bg text-brand-cream selection:bg-brand-gold/30">
      <div className="fixed inset-0 immersive-gradient opacity-20 pointer-events-none z-0" />

      <Navigation 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        onContributeClick={() => setIsCreateModalOpen(true)}
        onThaalPlannerClick={() => setIsThaalPlannerOpen(true)}
        onSpicesClick={() => {
          setIsSpicesPageOpen(true);
          setIsTraditionPageOpen(false);
          setIsAboutPageOpen(false);
          setIsThaalPlannerOpen(false);
          setIsCreateModalOpen(false);
          window.scrollTo(0, 0);
        }}
        onTraditionClick={() => {
          setIsTraditionPageOpen(true);
          setIsSpicesPageOpen(false);
          setIsAboutPageOpen(false);
          setIsThaalPlannerOpen(false);
          setIsCreateModalOpen(false);
          window.scrollTo(0, 0);
        }}
        onAboutClick={() => {
          setIsAboutPageOpen(true);
          setIsSpicesPageOpen(false);
          setIsTraditionPageOpen(false);
          setIsThaalPlannerOpen(false);
          setIsCreateModalOpen(false);
          window.scrollTo(0, 0);
        }}
        onHomeClick={() => {
          setIsSpicesPageOpen(false);
          setIsTraditionPageOpen(false);
          setIsAboutPageOpen(false);
          setIsThaalPlannerOpen(false);
          setIsCreateModalOpen(false);
          window.scrollTo(0, 0);
        }}
      />

      <AnimatePresence mode="wait">
        {isThaalPlannerOpen ? (
          <motion.div
            key="planner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ThaalPlanner 
              onClose={() => setIsThaalPlannerOpen(false)}
              onStartKitchenMode={(recipe) => {
                setRecipeInKitchen(recipe);
                setIsThaalPlannerOpen(false);
              }}
            />
          </motion.div>
        ) : isSpicesPageOpen ? (
          <motion.div
            key="spices"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <SpicesPage onClose={() => setIsSpicesPageOpen(false)} />
          </motion.div>
        ) : isTraditionPageOpen ? (
          <motion.div
            key="tradition"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <TraditionPage onClose={() => setIsTraditionPageOpen(false)} />
          </motion.div>
        ) : isAboutPageOpen ? (
          <motion.div
            key="about"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AboutPage onClose={() => setIsAboutPageOpen(false)} />
          </motion.div>
        ) : isCreateModalOpen ? (
          <motion.div
            key="contribute"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
             <RecipeFormModal 
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleAddUserRecipe}
              />
          </motion.div>
        ) : selectedRecipe ? (
          <motion.div
            key="recipe-detail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <RecipeModal 
              recipe={selectedRecipe}
              onClose={() => setSelectedRecipe(null)}
              onStartKitchenMode={(recipe) => {
                setRecipeInKitchen(recipe);
                setSelectedRecipe(null);
                window.scrollTo(0, 0);
              }}
            />
          </motion.div>
        ) : recipeInKitchen ? (
          <motion.div
            key="kitchen-mode"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <KitchenMode 
              recipe={recipeInKitchen}
              onClose={() => setRecipeInKitchen(null)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Hero Orchestrator Section */}
            <section className="relative h-[80vh] flex items-center justify-center overflow-hidden mb-20">
              <div className="absolute inset-0 z-0">
                <img 
                  src="https://images.unsplash.com/photo-1514326640560-7d063ef2aed5?auto=format&fit=crop&q=80" 
                  className="w-full h-full object-cover opacity-20 scale-105"
                  alt="Bohra Heritage"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-brand-bg/60 via-brand-bg/80 to-brand-bg" />
              </div>

              <div className="relative z-10 text-center max-w-4xl px-6 space-y-10">
                <div className="space-y-6">
                  <div className="flex justify-center mb-8">
                    <ChefHat className="w-12 h-12 text-brand-gold opacity-50" />
                  </div>
                  <span className="text-brand-gold uppercase tracking-mega font-bold text-[10px] block mb-2">Heritage Intelligence</span>
                  <h1 className="text-5xl md:text-8xl font-serif leading-tight tracking-tight text-brand-cream">
                    Orchestrate <span className="italic text-brand-gold">The Thaal</span>
                  </h1>
                  <p className="text-lg md:text-xl text-white/50 font-light max-w-2xl mx-auto leading-relaxed">
                    Management of 5 courses. Synchronized prep timelines. Traditional sequence preservation. 
                    Move beyond the recipe — manage the symphony.
                  </p>
                </div>
                
                <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                  <button 
                    onClick={() => setIsThaalPlannerOpen(true)}
                    className="group relative px-12 py-6 overflow-hidden bg-brand-gold"
                  >
                    <span className="relative z-10 text-brand-bg text-[10px] uppercase font-bold tracking-mega flex items-center gap-3">
                      Launch Thaal Orchestrator
                    </span>
                  </button>
                </div>
              </div>
            </section>

            <main id="discovery-section" className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-32">
              <PantrySection 
                selectedPantry={selectedPantry}
                toggleIngredient={toggleIngredient}
                userIngredients={userIngredients}
                addCustomIngredient={(ing) => {
                  setUserIngredients(prev => [...prev, ing]);
                  setSelectedPantry(prev => [...prev, ing]);
                }}
                selectedServings={selectedServings}
                setSelectedServings={setSelectedServings}
                selectedCuisine={selectedCuisine}
                setSelectedCuisine={setSelectedCuisine}
                selectedFlavor={selectedFlavor}
                setSelectedFlavor={setSelectedFlavor}
                selectedDifficulty={selectedDifficulty}
                setSelectedDifficulty={setSelectedDifficulty}
                isGenerating={isGenerating}
                onGenerate={generateAIDish}
                onReset={handleResetFilters}
              />

              <AIGeneratedRecipe 
                recipe={aiGeneratedRecipe} 
                onClose={() => setAiGeneratedRecipe(null)}
                isSaved={aiGeneratedRecipe ? userRecipes.some(r => r.id === aiGeneratedRecipe.id) : false}
                onSave={() => {
                  if (aiGeneratedRecipe) {
                    handleAddUserRecipe(aiGeneratedRecipe);
                  }
                }}
                onStartKitchenMode={(recipe) => {
                  setRecipeInKitchen(recipe);
                  setAiGeneratedRecipe(null);
                }}
              />

              <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16 pb-8 border-b border-white/5">
                <div className="flex bg-white/5 p-1.5 rounded-full border border-white/5">
                  {[
                    { id: 'all', label: 'Complete Thaal' },
                    { id: 'verified', label: 'Verified Archives' },
                    { id: 'user', label: 'My Kitchen' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setRecipeView(tab.id as any)}
                      className={`px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                        recipeView === tab.id 
                        ? 'bg-brand-gold text-brand-bg shadow-lg shadow-brand-gold/20' 
                        : 'text-white/40 hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                
                <div className="text-[10px] uppercase tracking-mega font-bold text-white/20">
                  DISCOVERING {filteredRecipes.length} MASTERPIECES
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                  {filteredRecipes.map((recipe, index) => (
                    <RecipeCard 
                      key={recipe.id}
                      recipe={recipe}
                      index={index}
                      onClick={() => setSelectedRecipe(recipe)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
