import { useState, useMemo } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Recipe } from './types';
import { Navigation } from './components/Navigation';
import { PantrySection } from './components/PantrySection';
import { AIGeneratedRecipe } from './components/AIGeneratedRecipe';
import { RecipeCard } from './components/RecipeCard';
import { RecipeModal } from './components/RecipeModal';
import { RecipeFormModal } from './components/RecipeFormModal';
import { FLAVOR_PROFILES } from './constants';
import { AnimatePresence } from 'motion/react';

const RECIPES: Recipe[] = [];

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
  const [aiGeneratedRecipe, setAiGeneratedRecipe] = useState<Recipe | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const [selectedPantry, setSelectedPantry] = useState<string[]>([]);
  const [userIngredients, setUserIngredients] = useState<string[]>([]);
  const [selectedServings, setSelectedServings] = useState<number | null>(null);
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
    setSelectedServings(null);
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
    const allRecipes = [...RECIPES, ...userRecipes];
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
      />

      <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-32">
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
        />

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

      <RecipeModal 
        recipe={selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
      />

      <RecipeFormModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleAddUserRecipe}
      />
    </div>
  );
}
