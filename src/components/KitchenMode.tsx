import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, ChevronLeft, Check, ChefHat, Clock, Users } from 'lucide-react';
import { Recipe } from '../types';

interface KitchenModeProps {
  recipe: Recipe;
  onClose: () => void;
}

export function KitchenMode({ recipe, onClose }: KitchenModeProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const totalSteps = recipe.instructions.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const toggleStepCompleted = (index: number) => {
    setCompletedSteps(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg relative pt-32 flex flex-col">
      <div className="fixed inset-0 immersive-gradient opacity-10 pointer-events-none" />
      
      {/* Header */}
      <header className="p-6 md:p-10 border-b border-white/10 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-6">
          <button 
            onClick={onClose}
            className="p-4 glass-card text-white/50 hover:text-brand-gold transition-colors rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="hidden md:block">
            <h2 className="text-brand-gold uppercase text-[10px] tracking-mega font-bold mb-1">Now Cooking</h2>
            <h3 className="text-xl font-serif text-brand-cream">{recipe.title}</h3>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="hidden lg:flex items-center gap-6 text-white/40">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-gold/50" />
              <span className="text-[10px] uppercase tracking-widest font-bold">{recipe.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-brand-gold/50" />
              <span className="text-[10px] uppercase tracking-widest font-bold">{recipe.servings}</span>
            </div>
          </div>
          <div className="px-6 py-2 glass-card rounded-full flex items-center gap-3">
             <span className="text-[10px] font-bold text-brand-gold">STEP {currentStep + 1} / {totalSteps}</span>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-white/5">
        <motion.div 
          className="h-full bg-brand-gold"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row relative z-10">
        {/* Step Display Area */}
        <div className="flex-1 p-10 md:p-24 flex items-center justify-center relative">
          <div className="max-w-4xl w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-12"
              >
                <div className="flex items-center gap-6 mb-8">
                  <span className="font-serif text-8xl md:text-[12rem] leading-none text-brand-gold/10 font-bold">
                    0{currentStep + 1}
                  </span>
                  <div className="h-[2px] flex-1 bg-brand-gold/10" />
                </div>
                
                <p className="text-4xl md:text-6xl font-light leading-snug text-brand-cream tracking-tight max-w-5xl">
                  {recipe.instructions[currentStep]}
                </p>

                <div className="pt-12">
                   <button 
                     onClick={() => toggleStepCompleted(currentStep)}
                     className={`flex items-center gap-4 px-10 py-5 rounded-full border transition-all ${
                       completedSteps.includes(currentStep)
                       ? 'bg-green-600/20 border-green-500/30 text-green-500'
                       : 'border-white/10 text-white/40 hover:border-brand-gold hover:text-brand-gold'
                     }`}
                   >
                     {completedSteps.includes(currentStep) ? (
                       <>
                         <Check className="w-6 h-6" />
                         <span className="uppercase text-xs font-bold tracking-widest text-[11px]">Step Completed</span>
                       </>
                     ) : (
                       <>
                         <div className="w-6 h-6 rounded-full border-2 border-current" />
                         <span className="uppercase text-xs font-bold tracking-widest text-[11px]">Mark as Ready</span>
                       </>
                     )}
                   </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Ingredients Sidebar (Simplified for Focus) */}
        <div className="w-full lg:w-[400px] bg-white/3 border-l border-white/5 p-10">
          <h4 className="text-[10px] uppercase tracking-mega font-bold text-brand-gold mb-12 flex items-center gap-3">
             < ChefHat className="w-4 h-4" /> The Pantry Required
          </h4>
          <ul className="space-y-8">
            {recipe.ingredients.map((ing, i) => (
              <li key={i} className="group flex items-start gap-4 transition-all hover:translate-x-2">
                <div className="w-2 h-2 rounded-full border border-brand-gold/50 mt-1.5 flex-shrink-0 group-hover:bg-brand-gold" />
                <span className="text-sm font-light text-white/60 leading-relaxed uppercase tracking-widest group-hover:text-brand-cream">
                  {ing}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer Controls */}
      <footer className="p-8 md:p-12 border-t border-white/5 flex items-center justify-between bg-brand-bg/50 backdrop-blur-xl">
        <button 
           onClick={prevStep}
           disabled={currentStep === 0}
           className={`flex items-center gap-4 px-8 py-5 text-sm uppercase tracking-widest font-bold transition-all ${
             currentStep === 0 ? 'opacity-20 cursor-not-allowed' : 'text-white/40 hover:text-brand-gold'
           }`}
        >
          <ChevronLeft className="w-6 h-6" /> Previous Step
        </button>

        <div className="flex gap-4">
          {currentStep === totalSteps - 1 ? (
             <button 
               onClick={onClose}
               className="bg-brand-gold text-brand-bg px-12 py-5 uppercase font-bold tracking-widest text-[11px] hover:bg-white shadow-xl shadow-brand-gold/20 flex items-center gap-3"
             >
               <Check className="w-5 h-5" /> Finish Cook
             </button>
          ) : (
            <button 
               onClick={nextStep}
               className="bg-brand-gold text-brand-bg px-12 py-5 uppercase font-bold tracking-widest text-[11px] hover:bg-white shadow-xl shadow-brand-gold/20 flex items-center gap-3 transition-all"
            >
              Next Step <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
