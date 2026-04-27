import { Menu, X, Search, UtensilsCrossed, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavigationProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  onContributeClick: () => void;
  onThaalPlannerClick: () => void;
  onSpicesClick: () => void;
  onTraditionClick: () => void;
  onAboutClick: () => void;
  onHomeClick: () => void;
}

export function Navigation({ 
  searchQuery, 
  setSearchQuery, 
  isMobileMenuOpen, 
  setIsMobileMenuOpen, 
  onContributeClick,
  onThaalPlannerClick,
  onSpicesClick,
  onTraditionClick,
  onAboutClick,
  onHomeClick
}: NavigationProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[200] glass-nav">
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
        <div 
          className="flex flex-col cursor-pointer group"
          onClick={() => {
            onHomeClick();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <span className="text-xl md:text-2xl tracking-[0.2em] md:tracking-widest uppercase font-bold text-brand-gold group-hover:text-brand-cream transition-colors">The Thaal</span>
          <span className="text-[10px] uppercase tracking-[0.3em] font-sans opacity-60 hidden sm:block">Traditional Bohra Culinary Arts</span>
        </div>

        <div className="hidden md:flex items-center gap-10 text-[10px] uppercase tracking-[0.2em] font-sans">
          {['Recipes', 'The Tradition', 'Spices'].map((item) => (
            <button 
              key={item} 
              onClick={() => {
                if (item === 'Recipes') {
                  onHomeClick();
                  setTimeout(() => {
                    document.getElementById('discovery-section')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }
                if (item === 'The Tradition') onTraditionClick();
                if (item === 'Spices') onSpicesClick();
              }}
              className={`transition-colors hover:text-brand-gold opacity-80 hover:opacity-100 uppercase tracking-widest`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
            <input 
              type="text"
              placeholder="FIND RECIPES..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-sm text-[10px] tracking-widest outline-none focus:border-brand-gold transition-all w-40 md:w-56 uppercase"
            />
          </div>
          <button 
            onClick={onThaalPlannerClick}
            className="hidden lg:flex items-center gap-2 px-4 py-2 border border-brand-gold/30 text-brand-gold text-[10px] tracking-widest font-bold uppercase transition-all hover:bg-brand-gold/10"
          >
            <Sparkles className="w-3.5 h-3.5" /> Orchestrator
          </button>
          <button 
            onClick={onContributeClick}
            className="hidden sm:flex items-center gap-2 px-4 py-2 border border-brand-gold/30 text-brand-gold text-[10px] tracking-widest font-bold uppercase transition-all hover:bg-brand-gold/10"
          >
            <UtensilsCrossed className="w-3.5 h-3.5" /> Contribute
          </button>
          <button 
            onClick={onAboutClick}
            className="hidden xl:block transition-colors hover:text-brand-gold opacity-80 hover:opacity-100 uppercase tracking-widest text-[10px] font-sans ml-4"
          >
            About Us
          </button>
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
            {['Recipes', 'The Tradition', 'Spices', 'About Us'].map((item) => (
              <button 
                key={item} 
                onClick={() => {
                  if (item === 'Recipes') {
                    onHomeClick();
                    setTimeout(() => {
                      document.getElementById('discovery-section')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }
                  if (item === 'The Tradition') onTraditionClick();
                  if (item === 'Spices') onSpicesClick();
                  if (item === 'About Us') onAboutClick();
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left text-sm uppercase tracking-widest font-bold text-white/70 hover:text-brand-gold"
              >
                {item}
              </button>
            ))}
            <div className="pt-6 border-t border-white/5 space-y-4">
              <button 
                onClick={() => { onThaalPlannerClick(); setIsMobileMenuOpen(false); }}
                className="flex items-center gap-2 text-brand-gold text-sm tracking-widest font-bold uppercase"
              >
                <Sparkles className="w-4 h-4" /> Orchestrator
              </button>
              <button 
                onClick={() => { onContributeClick(); setIsMobileMenuOpen(false); }}
                className="flex items-center gap-2 text-brand-gold text-sm tracking-widest font-bold uppercase"
              >
                <UtensilsCrossed className="w-4 h-4" /> Contribute
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
