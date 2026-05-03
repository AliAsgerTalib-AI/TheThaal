import { useState, useMemo, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Recipe, ThaalPlan } from './types';
import { Navigation } from './components/Navigation';
import { KitchenMode } from './components/KitchenMode';
import { ThaalPlanner } from './components/ThaalPlanner';
import { SpicesPage } from './components/SpicesPage';
import { TraditionPage } from './components/TraditionPage';
import { AboutPage } from './components/AboutPage';
import { RecipesPage } from './components/RecipesPage';
import { MasterListPage } from './components/MasterListPage';
import { ArchivePage } from './components/ArchivePage';
import { RecipeFormModal } from './components/RecipeFormModal';
import { motion, AnimatePresence } from 'motion/react';
import { ChefHat, Sparkles } from 'lucide-react';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isThaalPlannerOpen, setIsThaalPlannerOpen] = useState(false);
  const [isSpicesPageOpen, setIsSpicesPageOpen] = useState(false);
  const [isTraditionPageOpen, setIsTraditionPageOpen] = useState(false);
  const [isAboutPageOpen, setIsAboutPageOpen] = useState(false);
  const [isRecipesPageOpen, setIsRecipesPageOpen] = useState(false);
  const [isMasterListPageOpen, setIsMasterListPageOpen] = useState(false);
  const [isArchivePageOpen, setIsArchivePageOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
  const [archivedRecipes, setArchivedRecipes] = useState<Recipe[]>(() => {
    try {
      const saved = localStorage.getItem('archivedRecipes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [archivedPlans, setArchivedPlans] = useState<ThaalPlan[]>(() => {
    try {
      const saved = localStorage.getItem('archivedPlans');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Restore a shared plan from URL hash on first load
  useEffect(() => {
    const hash = window.location.hash;
    const match = hash.match(/^#plan=(.+)$/);
    if (!match) return;
    try {
      const decoded = JSON.parse(decodeURIComponent(atob(match[1])));
      if (decoded && decoded.id && decoded.dishes) {
        setThaalPlan(decoded);
        setThaalCount(Math.round((decoded.guestCount || 8) / 8));
        setIsThaalPlannerOpen(true);
        window.history.replaceState(null, '', window.location.pathname);
      }
    } catch {
      // malformed hash — ignore silently
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('archivedRecipes', JSON.stringify(archivedRecipes));
    } catch {
      console.warn('localStorage quota exceeded — archived recipes not persisted.');
    }
  }, [archivedRecipes]);

  useEffect(() => {
    try {
      localStorage.setItem('archivedPlans', JSON.stringify(archivedPlans));
    } catch {
      console.warn('localStorage quota exceeded — archived plans not persisted.');
    }
  }, [archivedPlans]);

  const [recipeInKitchen, setRecipeInKitchen] = useState<Recipe | null>(null);
  const [activePlanStage, setActivePlanStage] = useState<number>(0); 
  const [thaalPlan, setThaalPlan] = useState<ThaalPlan | null>(null);
  const [thaalCount, setThaalCount] = useState(1);

  const handleAddUserRecipe = (recipe: Recipe) => {
    setUserRecipes(prev => [recipe, ...prev]);
    setIsCreateModalOpen(false);
  };

  const closeAllPages = () => {
    setIsThaalPlannerOpen(false);
    setIsSpicesPageOpen(false);
    setIsTraditionPageOpen(false);
    setIsAboutPageOpen(false);
    setIsRecipesPageOpen(false);
    setIsMasterListPageOpen(false);
    setIsArchivePageOpen(false);
    setIsCreateModalOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleArchiveRecipe = (recipe: Recipe) => {
    setArchivedRecipes(prev => {
      if (prev.some(r => r.id === recipe.id)) return prev;
      return [recipe, ...prev];
    });
  };

  const handleArchivePlan = (plan: ThaalPlan) => {
    setArchivedPlans(prev => {
      if (prev.some(p => p.id === plan.id)) return prev;
      return [plan, ...prev];
    });
  };

  const handleRemoveRecipe = (id: string) => {
    setArchivedRecipes(prev => prev.filter(r => r.id !== id));
  };

  const handleRemovePlan = (id: string) => {
    setArchivedPlans(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-cream selection:bg-brand-gold/30">
      <div className="fixed inset-0 immersive-gradient opacity-20 pointer-events-none z-0" />

      <Navigation 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        onContributeClick={() => setIsCreateModalOpen(true)}
        onThaalPlannerClick={() => {
          if (!isThaalPlannerOpen) {
            closeAllPages();
            setIsThaalPlannerOpen(true);
          } else {
            setIsThaalPlannerOpen(false);
          }
        }}
        onSpicesClick={() => {
          closeAllPages();
          setIsSpicesPageOpen(true);
          window.scrollTo(0, 0);
        }}
        onTraditionClick={() => {
          closeAllPages();
          setIsTraditionPageOpen(true);
          window.scrollTo(0, 0);
        }}
        onAboutClick={() => {
          closeAllPages();
          setIsAboutPageOpen(true);
          window.scrollTo(0, 0);
        }}
        onRecipesClick={() => {
          closeAllPages();
          setIsRecipesPageOpen(true);
          window.scrollTo(0, 0);
        }}
        onMasterListClick={() => {
          closeAllPages();
          setIsMasterListPageOpen(true);
          window.scrollTo(0, 0);
        }}
        onHomeClick={() => {
          closeAllPages();
          window.scrollTo(0, 0);
        }}
        onArchiveClick={() => {
          closeAllPages();
          setIsArchivePageOpen(true);
          window.scrollTo(0, 0);
        }}
        activePlanStage={activePlanStage}
      />

      <AnimatePresence mode="wait">
        {recipeInKitchen ? (
          <motion.div
            key={`kitchen-${recipeInKitchen.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <KitchenMode 
              recipe={recipeInKitchen}
              onClose={() => setRecipeInKitchen(null)}
            />
          </motion.div>
        ) : isThaalPlannerOpen ? (
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
              }}
              onStageChange={setActivePlanStage}
              currentStage={activePlanStage}
              plan={thaalPlan}
              setPlan={(plan) => {
                setThaalPlan(plan);
                if (!plan) {
                  setActivePlanStage(0);
                }
              }}
              thaalCount={thaalCount}
              setThaalCount={setThaalCount}
              onSavePlan={handleArchivePlan}
              onSaveRecipe={handleArchiveRecipe}
              isArchived={thaalPlan ? archivedPlans.some(p => p.id === thaalPlan.id) : false}
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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
          >
            <AboutPage onClose={() => setIsAboutPageOpen(false)} />
          </motion.div>
        ) : isRecipesPageOpen ? (
          <motion.div
            key="recipes"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <RecipesPage 
              userRecipes={userRecipes}
              onAddUserRecipe={handleAddUserRecipe}
              onArchiveRecipe={handleArchiveRecipe}
              archivedRecipes={archivedRecipes}
              onStartKitchenMode={(recipe) => {
                setRecipeInKitchen(recipe);
              }}
              searchQuery={searchQuery}
            />
          </motion.div>
        ) : isMasterListPageOpen ? (
          <motion.div
            key="master-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <MasterListPage onClose={() => setIsMasterListPageOpen(false)} />
          </motion.div>
        ) : isArchivePageOpen ? (
          <motion.div
            key="archive"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ArchivePage 
              onClose={() => setIsArchivePageOpen(false)}
              recipes={archivedRecipes}
              plans={archivedPlans}
              onRemoveRecipe={handleRemoveRecipe}
              onRemovePlan={handleRemovePlan}
              onStartKitchenMode={(recipe) => {
                setRecipeInKitchen(recipe);
              }}
              onPlanSelect={(plan) => {
                setThaalPlan(plan);
                setThaalCount(plan.guestCount / 8);
                setIsArchivePageOpen(false);
                setIsThaalPlannerOpen(true);
              }}
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
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
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
                
                <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                  <button 
                    onClick={() => {
                        closeAllPages();
                        setIsThaalPlannerOpen(true);
                    }}
                    className="group relative px-16 py-8 overflow-hidden bg-brand-gold hover:scale-105 active:scale-95 transition-all shadow-2xl"
                  >
                    <span className="relative z-10 text-brand-bg text-[11px] uppercase font-serif font-black tracking-mega flex items-center gap-4">
                      Orchestrate the Symphony <Sparkles className="w-4 h-4" />
                    </span>
                  </button>
                </div>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCreateModalOpen && (
          <RecipeFormModal 
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSubmit={handleAddUserRecipe}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
