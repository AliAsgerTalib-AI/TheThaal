import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, ChevronLeft, Check, ChefHat, Clock, Users, Activity, Printer, Mic, MicOff } from 'lucide-react';
import { Recipe } from '../types';

interface KitchenModeProps {
  recipe: Recipe;
  onClose: () => void;
}

const escapeHtml = (s: unknown): string =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');

const CEREMONY_PRINT_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@400;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Inter', sans-serif;
    background: #F5F0E8;
    color: #2C1810;
    padding: 48px;
    max-width: 820px;
    margin: 0 auto;
    line-height: 1.65;
  }
  .header {
    text-align: center;
    border-bottom: 3px solid #DAA520;
    padding-bottom: 24px;
    margin-bottom: 32px;
  }
  .eyebrow {
    font-family: 'Inter', sans-serif;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: #8B4513;
    margin-bottom: 10px;
  }
  h1 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 42px;
    font-weight: 600;
    color: #2C1810;
    line-height: 1.15;
    margin-bottom: 8px;
  }
  .meta {
    font-size: 11px;
    color: #8B6914;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }
  h2 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px;
    font-weight: 600;
    color: #8B4513;
    border-left: 4px solid #DAA520;
    padding-left: 14px;
    margin: 36px 0 16px;
  }
  .ingredient-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px 32px;
    margin-bottom: 24px;
  }
  .ingredient {
    font-size: 13px;
    padding: 4px 0;
    border-bottom: 1px solid #DAA52022;
    color: #3D2010;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .ingredient::before { content: '◆'; color: #DAA520; font-size: 6px; }
  ol { padding-left: 20px; margin-top: 8px; }
  ol li {
    font-size: 13px;
    color: #3D2010;
    margin-bottom: 12px;
    padding-left: 6px;
    line-height: 1.6;
  }
  ol li::marker { color: #DAA520; font-weight: 700; }
  .heritage-block {
    background: #EDE5D4;
    border: 1px solid #DAA52066;
    border-left: 4px solid #DAA520;
    padding: 16px 20px;
    margin-top: 32px;
    border-radius: 2px;
  }
  .heritage-block p { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 15px; color: #4A2C10; line-height: 1.7; }
  .footer {
    margin-top: 48px;
    padding-top: 16px;
    border-top: 1px solid #DAA52040;
    text-align: center;
    font-size: 9px;
    color: #A08040;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
  @media print {
    body { padding: 28px; background: #F5F0E8; }
    .footer { position: fixed; bottom: 20px; width: 100%; }
  }
`;

export function KitchenMode({ recipe, onClose }: KitchenModeProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const totalSteps = recipe.instructions.length;

  const nextStep = () => { if (currentStep < totalSteps - 1) setCurrentStep(p => p + 1); };
  const prevStep = () => { if (currentStep > 0) setCurrentStep(p => p - 1); };
  const toggleStepCompleted = (index: number) => {
    setCompletedSteps(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const toggleVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice recognition is not supported in this browser.');
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
      if (transcript.includes('next')) nextStep();
      else if (transcript.includes('back') || transcript.includes('previous')) prevStep();
      else if (transcript.includes('done') || transcript.includes('complete') || transcript.includes('mark')) {
        setCurrentStep(cur => { toggleStepCompleted(cur); return cur; });
      }
    };

    recognition.onerror = () => { setIsListening(false); recognitionRef.current = null; };
    recognition.onend = () => { setIsListening(false); recognitionRef.current = null; };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  useEffect(() => {
    return () => { if (recognitionRef.current) recognitionRef.current.stop(); };
  }, []);

  const printRecipe = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) { alert("Please allow popups to print your recipe."); return; }

    printWindow.document.write(`
      <html>
        <head>
          <title>${escapeHtml(recipe.title)} — Ceremony Card</title>
          <style>${CEREMONY_PRINT_CSS}</style>
        </head>
        <body>
          <div class="header">
            <div class="eyebrow">Dawoodi Bohra Culinary Heritage</div>
            <h1>${escapeHtml(recipe.title)}</h1>
            <div class="meta">${escapeHtml(recipe.time)} &nbsp;·&nbsp; Serves ${escapeHtml(recipe.servings)} &nbsp;·&nbsp; ${escapeHtml(recipe.difficulty)}</div>
          </div>

          <h2>Ingredients</h2>
          <div class="ingredient-grid">
            ${recipe.ingredients.map(ing => `<div class="ingredient">${escapeHtml(ing)}</div>`).join('')}
          </div>

          <h2>Method</h2>
          <ol>
            ${recipe.instructions.map(step => `<li>${escapeHtml(step)}</li>`).join('')}
          </ol>

          <div class="heritage-block">
            <p>"${escapeHtml(recipe.heritage)}"</p>
          </div>

          <div class="footer">Generated by Thaal Traditions Orchestrator &nbsp;·&nbsp; Copyright Ali Asger Talib / Noore Sara A Talib</div>
          <script>window.onload = function() { window.print(); };<\/script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 bg-black z-[500] flex flex-col font-sans overflow-hidden">
      <header className="bg-zinc-900 p-8 md:p-12 border-b-4 border-brand-gold flex items-center justify-between">
        <div className="flex items-center gap-10">
          <button
            onClick={onClose}
            className="w-20 h-20 bg-brand-gold text-brand-bg flex items-center justify-center rounded-full hover:scale-105 active:scale-95 transition-all shadow-2xl"
            title="Exit Kitchen Mode"
          >
            <X className="w-10 h-10" />
          </button>
          <div>
            <h2 className="text-brand-gold uppercase text-xs tracking-mega font-black mb-2 opacity-80">Mission Critical Command</h2>
            <h3 className="text-3xl md:text-5xl font-serif text-white font-bold leading-tight">{recipe.title}</h3>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={printRecipe}
            className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-full text-white/60 hover:bg-white hover:text-black transition-all text-xs font-bold uppercase tracking-widest"
          >
            <Printer className="w-4 h-4" /> Print Card
          </button>
          <div className="hidden lg:flex items-center gap-12 py-4 px-10 bg-black/40 rounded-3xl border border-white/10">
            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase font-black text-brand-gold mb-1">Time Command</span>
              <span className="text-2xl font-mono text-white">{recipe.time}</span>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase font-black text-brand-gold mb-1">Thaal Density</span>
              <span className="text-2xl font-mono text-white">{recipe.servings} Guests</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-80 bg-zinc-900/50 border-r-4 border-brand-gold/30 overflow-y-auto no-scrollbar hidden md:block">
          <div className="p-8 space-y-4">
            <h4 className="text-[10px] uppercase font-black text-brand-gold mb-8 tracking-widest text-center border-b border-brand-gold/20 pb-4">Culinary Timeline</h4>
            {recipe.instructions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentStep(i)}
                className={`w-full p-6 rounded-2xl flex items-center gap-6 transition-all border-2 ${
                  currentStep === i
                    ? 'bg-brand-gold border-brand-gold text-brand-bg scale-105 shadow-xl'
                    : completedSteps.includes(i)
                    ? 'bg-green-600 border-green-500 text-black'
                    : 'bg-black/40 border-white/5 text-white/40 hover:border-brand-gold/50'
                }`}
              >
                <span className="text-2xl font-black font-mono">{String(i + 1).padStart(2, '0')}</span>
                {completedSteps.includes(i) && <Check className="w-6 h-6 ml-auto" />}
              </button>
            ))}
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-12 md:p-24 flex flex-col items-center justify-center bg-black">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="max-w-5xl w-full space-y-12"
            >
              <div className="inline-block px-8 py-3 bg-brand-gold/10 border-2 border-brand-gold text-brand-gold rounded-full text-sm font-black uppercase tracking-mega mb-8">
                Execution Stage 0{currentStep + 1}
              </div>

              <h1 className="text-5xl md:text-8xl font-serif text-white font-bold leading-[1.1] text-balance">
                {recipe.instructions[currentStep]}
              </h1>

              <div className="pt-16 flex flex-wrap gap-8">
                <button
                  onClick={() => toggleStepCompleted(currentStep)}
                  className={`flex items-center gap-6 px-16 py-10 rounded-[2.5rem] border-4 transition-all scale-100 hover:scale-105 active:scale-95 ${
                    completedSteps.includes(currentStep)
                      ? 'bg-green-600 border-green-400 text-black'
                      : 'bg-black border-white text-white hover:border-brand-gold hover:text-brand-gold'
                  }`}
                >
                  {completedSteps.includes(currentStep) ? (
                    <><Check className="w-12 h-12" /><span className="uppercase text-xl font-black tracking-widest">Ritual Verified</span></>
                  ) : (
                    <><div className="w-12 h-12 rounded-full border-4 border-current" /><span className="uppercase text-xl font-black tracking-widest">Execute Ritual</span></>
                  )}
                </button>

                <div className="flex-1 bg-zinc-900 border-2 border-white/10 rounded-[2.5rem] p-10 flex items-center gap-8">
                  <div className="w-16 h-16 rounded-2xl bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                    <ChefHat className="w-10 h-10" />
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] uppercase font-black text-brand-gold tracking-widest block mb-2">Technique Guidance</span>
                    <p className="text-lg text-white/50 leading-relaxed font-light italic">
                      Follow the sequence. Precision in timing is the difference between a meal and a dawat.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Controls bar */}
      <div className="bg-zinc-900 border-t-4 border-brand-gold p-8 relative flex items-center gap-10">
        <div className="flex items-center gap-4 shrink-0">
          <Activity className="w-6 h-6 text-brand-gold animate-pulse" />
          <span className="text-xs uppercase font-black text-brand-gold tracking-widest">Zubaan-ni-Chatas PINNED</span>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {['Gol-nu-Achar', 'Lasan-ni-Chutney', 'Kachumber'].map((item, i) => (
            <div key={i} className="px-8 py-4 bg-brand-gold/10 border-2 border-brand-gold/40 rounded-2xl text-[11px] font-bold text-white whitespace-nowrap">
              {item} <span className="opacity-40 ml-2">ALWAYS SERVED</span>
            </div>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-4">
          {/* Voice navigation toggle */}
          <button
            onClick={toggleVoice}
            title={isListening ? 'Stop voice navigation' : 'Voice navigation: say "next", "back", or "done"'}
            className={`w-16 h-16 rounded-full border-4 flex items-center justify-center transition-all ${
              isListening
                ? 'bg-red-600 border-red-400 text-white animate-pulse'
                : 'border-white/10 text-white/40 hover:border-brand-gold hover:text-brand-gold'
            }`}
          >
            {isListening ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
          </button>
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`w-20 h-20 rounded-full border-4 border-white/10 flex items-center justify-center text-white transition-all ${
              currentStep === 0 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-white hover:text-black hover:border-white'
            }`}
          >
            <ChevronLeft className="w-10 h-10" />
          </button>
          <button
            onClick={nextStep}
            disabled={currentStep === totalSteps - 1}
            className={`w-20 h-20 rounded-full border-4 border-white/10 flex items-center justify-center text-white transition-all ${
              currentStep === totalSteps - 1 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-white hover:text-black hover:border-white'
            }`}
          >
            <ChevronRight className="w-10 h-10" />
          </button>
        </div>
      </div>
    </div>
  );
}
