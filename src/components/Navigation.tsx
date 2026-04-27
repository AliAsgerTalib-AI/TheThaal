import { Menu, X, Search, UtensilsCrossed, Sparkles } from 'lucide-react';

interface NavigationProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  onContributeClick: () => void;
  onThaalPlannerClick: () => void;
}

export function Navigation({ 
  searchQuery, 
  setSearchQuery, 
  isMobileMenuOpen, 
  setIsMobileMenuOpen, 
  onContributeClick,
  onThaalPlannerClick
}: NavigationProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xl md:text-2xl tracking-[0.2em] md:tracking-widest uppercase font-bold text-brand-gold">The Thaal</span>
          <span className="text-[10px] uppercase tracking-[0.3em] font-sans opacity-60 hidden sm:block">Traditional Bohra Culinary Arts</span>
        </div>

        <div className="hidden md:flex items-center gap-10 text-[10px] uppercase tracking-[0.2em] font-sans">
          {['Home', 'Recipes', 'The Tradition', 'Spices'].map((item) => (
            <button key={item} className={`transition-colors ${item === 'Home' ? 'text-brand-gold border-b border-brand-gold' : 'hover:text-brand-gold opacity-80 hover:opacity-100'}`}>
              {item}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-6">
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
            className="md:hidden p-2 text-brand-gold"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </nav>
  );
}
