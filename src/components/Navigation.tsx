import { Menu, X, Library } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { RitualGauge } from './RitualGauge';

interface NavigationProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  onThaalPlannerClick: () => void;
  onSpicesClick: () => void;
  onTraditionClick: () => void;
  onAboutClick: () => void;
  onHomeClick: () => void;
  onRecipesClick: () => void;
  onArchiveClick: () => void;
  activePlanStage?: number;
}

export function Navigation({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  onThaalPlannerClick,
  onSpicesClick,
  onTraditionClick,
  onAboutClick,
  onHomeClick,
  onRecipesClick,
  onArchiveClick,
  activePlanStage = 0
}: NavigationProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[1000] glass-nav">
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <div 
            className="flex flex-col cursor-pointer group shrink-0"
            onClick={() => {
              onHomeClick();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <span className="text-xl md:text-2xl tracking-[0.2em] md:tracking-widest uppercase font-bold text-brand-gold group-hover:text-brand-cream transition-colors leading-none">The Thaal</span>
            <span className="text-[10px] uppercase tracking-[0.3em] font-sans opacity-80 hidden sm:block mt-1">Traditional Bohra Culinary Arts</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-10 text-[10px] uppercase tracking-[0.2em] font-sans">
            <button
              onClick={onAboutClick}
              className="transition-colors hover:text-brand-gold opacity-80 hover:opacity-100 uppercase tracking-widest text-brand-cream font-bold"
            >
              About Us
            </button>
            <button
              onClick={onArchiveClick}
              className="px-4 py-2 bg-brand-gold/10 border border-brand-gold/20 rounded-full text-brand-gold hover:bg-brand-gold/20 transition-all uppercase tracking-widest font-black flex items-center gap-2"
            >
              <Library className="w-3 h-3" /> Archive
            </button>
          </div>

          <button 
            className="md:hidden p-2 text-brand-gold"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-20 left-0 right-0 bg-brand-bg border-b border-white/10 p-8 space-y-6 z-[190] glass-nav"
          >
            
            {['About Us', 'Archive'].map((item) => (
              <button
                key={item}
                onClick={() => {
                  if (item === 'About Us') onAboutClick();
                  if (item === 'Archive') onArchiveClick();
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left text-sm uppercase tracking-widest font-bold text-white/70 hover:text-brand-gold"
              >
                {item}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
