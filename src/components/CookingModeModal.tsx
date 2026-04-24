import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Play, Pause, RotateCcw, Timer, CheckCircle2 } from 'lucide-react';
import { Recipe } from '../types';

interface CookingModeModalProps {
  recipe: Recipe;
  onClose: () => void;
}

export function CookingModeModal({ recipe, onClose }: CookingModeModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [customMinutes, setCustomMinutes] = useState(5);
  const [timerSeconds, setTimerSeconds] = useState(5 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const isFinished = currentStep === recipe.instructions.length;

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning]);

  const resetTimer = (mins = customMinutes) => {
    setIsRunning(false);
    setTimerSeconds(mins * 60);
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
    setIsRunning(false);
    setTimerSeconds(customMinutes * 60);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const totalTime = customMinutes * 60;
  const timerProgress = totalTime > 0 ? timerSeconds / totalTime : 1;
  const circumference = 2 * Math.PI * 40;

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
        className="glass-card w-full max-w-2xl p-8 md:p-12 relative my-auto"
      >
        <button onClick={onClose} className="absolute top-6 right-6 p-2 glass-card text-brand-gold/50 hover:text-brand-gold rounded-full transition-colors">
          <X className="w-5 h-5" />
        </button>

        <span className="text-brand-gold uppercase text-[10px] tracking-mega font-bold mb-1 block">Start Cooking</span>
        <h3 className="text-2xl font-serif font-bold mb-8 text-brand-cream">{recipe.title}</h3>

        {/* Step progress bar */}
        <div className="flex gap-1.5 mb-8">
          {recipe.instructions.map((_, i) => (
            <button
              key={i}
              onClick={() => goToStep(i)}
              className={`h-1 flex-1 transition-all ${
                i < currentStep ? 'bg-brand-gold/50' :
                i === currentStep ? 'bg-brand-gold' :
                'bg-white/10'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {isFinished ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="text-center py-8"
            >
              <CheckCircle2 className="w-16 h-16 text-brand-gold mx-auto mb-6" />
              <h4 className="text-3xl font-serif font-bold text-brand-cream mb-3">Mubarak ho!</h4>
              <p className="text-white/50 text-sm uppercase tracking-widest">Your dish is ready to be served on the Thaal.</p>
              <button
                onClick={onClose}
                className="mt-8 px-10 py-4 bg-brand-gold text-brand-bg text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-colors"
              >
                Finish
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {/* Step text */}
              <div className="mb-8">
                <span className="text-white/30 text-[10px] uppercase tracking-widest font-bold">
                  Step {currentStep + 1} of {recipe.instructions.length}
                </span>
                <p className="text-lg text-brand-cream font-light leading-relaxed mt-3 uppercase tracking-wider">
                  {recipe.instructions[currentStep]}
                </p>
              </div>

              {/* Timer */}
              <div className="glass-card p-6 mb-8">
                <div className="flex items-start gap-6">
                  {/* Circular timer */}
                  <div className="relative flex-shrink-0">
                    <svg width="96" height="96" className="-rotate-90">
                      <circle cx="48" cy="48" r="40" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
                      <circle
                        cx="48" cy="48" r="40" fill="none"
                        stroke={timerSeconds === 0 ? '#ef4444' : '#DAA520'}
                        strokeWidth="4"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference * (1 - timerProgress)}
                        strokeLinecap="round"
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`text-sm font-mono font-bold ${timerSeconds === 0 ? 'text-red-400' : 'text-brand-gold'}`}>
                        {formatTime(timerSeconds)}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-4">
                      <Timer className="w-3 h-3 text-brand-gold" />
                      <span className="text-[10px] uppercase tracking-widest font-bold text-brand-gold">Step Timer</span>
                    </div>
                    {timerSeconds === 0 && (
                      <p className="text-red-400 text-[10px] uppercase tracking-widest font-bold mb-3">Time's up!</p>
                    )}
                    <div className="flex items-center gap-2 mb-4">
                      <input
                        type="number"
                        min="1"
                        max="120"
                        value={customMinutes}
                        onChange={(e) => {
                          const mins = Math.max(1, parseInt(e.target.value) || 1);
                          setCustomMinutes(mins);
                          if (!isRunning) setTimerSeconds(mins * 60);
                        }}
                        className="w-14 bg-white/5 border border-white/10 px-2 py-1.5 text-center text-xs text-brand-cream outline-none focus:border-brand-gold/50"
                      />
                      <span className="text-[10px] uppercase tracking-widest text-white/40">min</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsRunning(!isRunning)}
                        className="px-5 py-2.5 bg-brand-gold text-brand-bg text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 hover:bg-white transition-colors"
                      >
                        {isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                        {isRunning ? 'Pause' : 'Start'}
                      </button>
                      <button
                        onClick={() => resetTimer()}
                        className="px-5 py-2.5 glass-card text-brand-gold text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 hover:border-brand-gold/50 transition-all"
                      >
                        <RotateCcw className="w-3 h-3" /> Reset
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between">
                <button
                  onClick={() => goToStep(currentStep - 1)}
                  disabled={currentStep === 0}
                  className="px-6 py-3 glass-card text-brand-gold text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:border-brand-gold/50 transition-all disabled:opacity-25 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>
                <button
                  onClick={() => goToStep(currentStep + 1)}
                  className="px-6 py-3 bg-brand-gold text-brand-bg text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-white transition-colors"
                >
                  {currentStep < recipe.instructions.length - 1 ? 'Next Step' : 'Finish'} <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
