import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronRight, Star, History, Info, X } from 'lucide-react';

interface DishItem {
  id: string;
  title: string;
  category: 'Meethas' | 'Khaaras' | 'Jaaman';
  description: string;
  significance: string;
  complexity: 'Simple' | 'Refined' | 'Exalted';
}

const MEETHAS: DishItem[] = [
  {
    id: 'm1',
    title: 'Kalamra',
    category: 'Meethas',
    description: 'A divine curd-based rice pudding with pomegranate and nuts.',
    significance: 'Served on Eid-ul-Fitr and major Urs, symbolizing Barakat.',
    complexity: 'Refined'
  },
  {
    id: 'm2',
    title: 'Sodanna',
    category: 'Meethas',
    description: 'Sugared rice served at the very beginning of a Thaal.',
    significance: 'Traditional start to a formal dawat, often taken with a pinch of salt.',
    complexity: 'Simple'
  },
  {
    id: 'm3',
    title: 'Malida',
    category: 'Meethas',
    description: 'A rich, crumbly sweet made of whole wheat, ghee, and jaggery.',
    significance: 'Often associated with religious milestones and celebratory gatherings.',
    complexity: 'Exalted'
  },
  {
    id: 'm4',
    title: 'Dudhi no Halwo',
    category: 'Meethas',
    description: 'Bottle gourd sautéed in ghee and milk, flavored with cardamom.',
    significance: 'A household favorite for its lightness and cooling properties.',
    complexity: 'Refined'
  },
  {
    id: 'm5',
    title: 'Lapsi',
    category: 'Meethas',
    description: 'Broken wheat cooked with jaggery and ghee.',
    significance: 'A traditional sweet for the 1st of Muharram and new beginnings.',
    complexity: 'Simple'
  },
  {
    id: 'm6',
    title: 'Sheer Khurma',
    category: 'Meethas',
    description: 'A vermicelli pudding with milk, dates, and a variety of dry fruits.',
    significance: 'The soul of Eid mornings in every Bohra household.',
    complexity: 'Refined'
  },
  {
    id: 'm7',
    title: 'Pineapple Halwa',
    category: 'Meethas',
    description: 'A vibrant, tangy halwa made with fresh pineapple chunks and mawa.',
    significance: 'A modern favorite in multi-course thaals for its refreshing contrast.',
    complexity: 'Refined'
  },
  {
    id: 'm8',
    title: 'Gol Papdi',
    category: 'Meethas',
    description: 'Traditional wheat and jaggery blocks topped with poppy seeds.',
    significance: 'A travel-stable sweet often given to Hujjaj (pilgrims).',
    complexity: 'Simple'
  },
  {
    id: 'm9',
    title: 'Sutarfeni',
    category: 'Meethas',
    description: 'Fine, shredded dough sweet scented with rose and saffron.',
    significance: 'A delicate masterpiece requiring immense skill in thread-work.',
    complexity: 'Exalted'
  },
  {
    id: 'm10',
    title: 'Khajoor no Halwo',
    category: 'Meethas',
    description: 'Slow-cooked date halwa rich in vitamins and iron.',
    significance: 'Often served in winter months for its thermal properties.',
    complexity: 'Refined'
  },
  {
    id: 'm11',
    title: 'Anjir Halwa',
    category: 'Meethas',
    description: 'Fig-based delicacy with a grainy texture and subtle sweetness.',
    significance: 'Considered a premium sweet for high-profile Nikah ceremonies.',
    complexity: 'Exalted'
  }
];

const KHAARAS: DishItem[] = [
  {
    id: 'k1',
    title: 'Keema Samosa',
    category: 'Khaaras',
    description: 'Crispy, thin-crusted samosas filled with spiked minced meat.',
    significance: 'The signature starter of any Bohra Thaal.',
    complexity: 'Exalted'
  },
  {
    id: 'k2',
    title: 'Nargisi Kofta',
    category: 'Khaaras',
    description: 'Scotch eggs reimagined with rich Mughlai spices.',
    significance: 'A celebratory dish requiring precision and patience.',
    complexity: 'Exalted'
  },
  {
    id: 'k3',
    title: 'Russian Cutlets',
    category: 'Khaaras',
    description: 'Creamy chicken and vegetable patties with a vermicelli crust.',
    significance: 'A colonially influenced dish that has become a staple.',
    complexity: 'Refined'
  },
  {
    id: 'k4',
    title: 'Bohra Fried Fish',
    category: 'Khaaras',
    description: 'Fish marinated in a unique green masala and shallow fried.',
    significance: 'Celebrated for its fresh, vibrant flavor profile.',
    complexity: 'Simple'
  },
  {
    id: 'k5',
    title: 'Chicken Drumsticks',
    category: 'Khaaras',
    description: 'Tender chicken leg pieces coated in a spicy red batter.',
    significance: 'A popular bazaar-style dish adapted for home feasts.',
    complexity: 'Simple'
  },
  {
    id: 'k6',
    title: 'Khichda',
    category: 'Khaaras',
    description: 'A slow-cooked wholesome mix of meat, broken wheat, and lentils.',
    significance: 'Especially significant during the first 10 days of Muharram.',
    complexity: 'Exalted'
  },
  {
    id: 'k7',
    title: 'Lasanyo',
    category: 'Khaaras',
    description: 'Minced meat cooked with an abundance of fresh garlic and topped with eggs.',
    significance: 'A winter specialty prized for its warming ingredients.',
    complexity: 'Refined'
  },
  {
    id: 'k8',
    title: 'Dabba Gosht',
    category: 'Khaaras',
    description: 'A creamy meat and pasta dish topped with beaten eggs and ghee.',
    significance: 'A community favorite, often the highlight of casual gatherings.',
    complexity: 'Refined'
  },
  {
    id: 'k9',
    title: 'Lagan nu Bhon',
    category: 'Khaaras',
    description: 'Traditional wedding-style meat preparation with complex spice layering.',
    significance: 'The ultimate test of a chef\'s mastery over spice tempering.',
    complexity: 'Exalted'
  },
  {
    id: 'k10',
    title: 'Baida Roti',
    category: 'Khaaras',
    description: 'Pan-fried envelopes of thin dough filled with spiced meat and egg.',
    significance: 'A versatile snack, often prepared during Ramazan.',
    complexity: 'Refined'
  }
];

const JAAMAN: DishItem[] = [
  {
    id: 'j1',
    title: 'Bohra Biryani',
    category: 'Jaaman',
    description: 'Fragrant long-grain rice layered with marinated meat, potatoes, and prunes.',
    significance: 'The undisputed centerpiece of any grand celebratory Thaal.',
    complexity: 'Exalted'
  },
  {
    id: 'j2',
    title: 'Dal Chawal Palidu (DCP)',
    category: 'Jaaman',
    description: 'Basmati rice with tuvar dal, served with a tangy drumstick soup (Palidu).',
    significance: 'A spiritual staple served on solemn occasions and Fridays.',
    complexity: 'Refined'
  },
  {
    id: 'j3',
    title: 'Kari Chawal',
    category: 'Jaaman',
    description: 'Slow-cooked mutton or chicken in a rich, spiced coconut milk base served with rice.',
    significance: 'A fragrant, nostalgic dish that represents the community\'s coastal ties.',
    complexity: 'Exalted'
  },
  {
    id: 'j4',
    title: 'Yakhni Pulao',
    category: 'Jaaman',
    description: 'Meat cooked in its own broth with subtle spices and Basmati rice.',
    significance: 'Celebrated for its refined, aromatic simplicity.',
    complexity: 'Refined'
  },
  {
    id: 'j5',
    title: 'Kheema Khichdi',
    category: 'Jaaman',
    description: 'Smoky spiced minced meat combined with yellow lentils and rice.',
    significance: 'A nourishing, hearty comfort food often served during communal gatherings.',
    complexity: 'Simple'
  },
  {
    id: 'j6',
    title: 'Masoor Pulao',
    category: 'Jaaman',
    description: 'Brown lentil pulao with layers of fragrant masala-coated rice.',
    significance: 'A traditional household favorite often paired with fried fish.',
    complexity: 'Simple'
  },
  {
    id: 'j7',
    title: 'Safed Biryani',
    category: 'Jaaman',
    description: 'A sophisticated white biryani made without turmeric or red chili, focusing on white spices and aromatics.',
    significance: 'Served at high-profile Nikahs for its elegant aesthetic and subtle flavor.',
    complexity: 'Exalted'
  },
  {
    id: 'j8',
    title: 'Akhni',
    category: 'Jaaman',
    description: 'A robust one-pot meat and rice dish where the meat is tenderized in a spiced yogurt base.',
    significance: 'The ultimate comfort meal for community weekend lunches.',
    complexity: 'Refined'
  },
  {
    id: 'j9',
    title: 'Dal Gosht',
    category: 'Jaaman',
    description: 'Succulent mutton slow-cooked with chana dal and a medley of warm spices.',
    significance: 'A soul-warming dish often paired with Baghara Chawal (tempered rice).',
    complexity: 'Refined'
  },
  {
    id: 'j10',
    title: 'Kheema Palidu',
    category: 'Jaaman',
    description: 'A unique combination of spiced minced meat served alongside the traditional tangy Palidu soup.',
    significance: 'A creative variation of the classic DCP, offering a richer protein profile.',
    complexity: 'Refined'
  },
  {
    id: 'j11',
    title: 'Mutton Korma',
    category: 'Jaaman',
    description: 'A velvety gravy made with fried onions, yogurt, and a specialized nut paste.',
    significance: 'A royal addition to the Thaal, usually served with handmade roomali rotis.',
    complexity: 'Exalted'
  }
];

export function MasterListPage({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'Meethas' | 'Khaaras' | 'Jaaman'>('Meethas');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDish, setSelectedDish] = useState<DishItem | null>(null);

  const getDishes = () => {
    switch (activeTab) {
      case 'Meethas': return MEETHAS;
      case 'Khaaras': return KHAARAS;
      case 'Jaaman': return JAAMAN;
      default: return [];
    }
  };

  const filteredDishes = getDishes().filter(dish =>
    dish.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dish.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen relative">
      <div className="mb-16">
        <div className="inline-flex items-center gap-2 mb-4">
          <span className="h-px w-12 bg-brand-gold/50" />
          <span className="text-[10px] uppercase tracking-[0.4em] text-brand-gold font-bold">The Great Archive</span>
        </div>
        <h1 className="font-serif text-5xl md:text-7xl text-brand-cream leading-tight mb-8">
          Master List of <span className="text-brand-gold italic font-light">Heritage Dishes</span>
        </h1>
        
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-end justify-between border-b border-white/10 pb-8">
          <div className="flex gap-12">
            {[
              { id: 'Meethas', icon: <Star className="w-4 h-4" /> },
              { id: 'Khaaras', icon: <History className="w-4 h-4" /> },
              { id: 'Jaaman', icon: <History className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`relative pb-8 text-[11px] uppercase tracking-mega font-black transition-all ${
                  activeTab === tab.id ? 'text-brand-gold' : 'text-white/30 hover:text-white/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  {tab.icon}
                  {tab.id}
                </div>
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="activeTab" 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-gold" 
                  />
                )}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-brand-gold transition-colors" />
            <input
              type="text"
              placeholder={`Search ${activeTab.toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 py-4 pl-12 pr-6 text-xs text-brand-cream focus:outline-none focus:border-brand-gold/50 transition-all placeholder:text-white/20 uppercase tracking-widest"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredDishes.map((dish, idx) => (
            <motion.div
              key={dish.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => setSelectedDish(dish)}
              className="group cursor-pointer bg-white/[0.02] border border-white/10 p-8 hover:border-brand-gold/50 transition-all duration-500 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 rounded-full border border-brand-gold/30 flex items-center justify-center">
                  <ChevronRight className="w-4 h-4 text-brand-gold" />
                </div>
              </div>

              <div className="mb-8">
                <div className="text-[9px] uppercase tracking-widest text-brand-gold font-black mb-2 opacity-60">
                  {dish.complexity} Architecture
                </div>
                <h3 className="text-2xl font-serif text-brand-cream group-hover:text-brand-gold transition-colors">{dish.title}</h3>
              </div>

              <p className="text-xs text-white/40 font-light leading-relaxed mb-8 line-clamp-3">
                {dish.description}
              </p>

              <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-2 h-2 rounded-full bg-brand-gold/20 border border-brand-gold/40" />
                  ))}
                </div>
                <span className="text-[8px] uppercase tracking-widest text-white/20 font-bold group-hover:text-brand-gold/40 transition-colors">Heritage Graded</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredDishes.length === 0 && (
        <div className="py-32 text-center border border-dashed border-white/10">
          <p className="text-white/20 italic font-light">No heritage items found matching your search.</p>
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedDish && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 md:p-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDish(null)}
              className="absolute inset-0 bg-brand-bg/95 backdrop-blur-xl"
            />
            
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-[#1A1816] border border-white/10 overflow-hidden shadow-2xl"
            >
              <button 
                onClick={() => setSelectedDish(null)}
                className="absolute top-8 right-8 z-10 p-2 text-white/40 hover:text-brand-gold hover:rotate-90 transition-all"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="p-12 space-y-10">
                <div className="text-center space-y-4">
                  <div className="flex justify-center gap-3">
                    <span className="px-3 py-1 bg-brand-gold/10 text-brand-gold text-[10px] font-black uppercase tracking-widest rounded-full border border-brand-gold/20">
                      {selectedDish.complexity}
                    </span>
                    <span className="text-[10px] uppercase font-black tracking-mega text-white/30 self-center">Heritage Grade</span>
                  </div>
                  <h2 className="text-5xl md:text-6xl font-serif text-brand-cream">{selectedDish.title}</h2>
                  <div className="h-px w-24 bg-brand-gold/30 mx-auto" />
                </div>

                <div className="space-y-8 max-h-[60vh] overflow-y-auto px-4 custom-scrollbar">
                  <div className="space-y-3">
                    <h4 className="text-[10px] uppercase tracking-widest text-brand-gold font-bold flex items-center justify-center gap-2">
                      <Info className="w-3 h-3" /> Core Identity
                    </h4>
                    <p className="text-base text-white/70 leading-relaxed italic text-center font-light">{selectedDish.description}</p>
                  </div>

                  <div className="space-y-4 p-8 bg-white/[0.02] border border-white/5 relative">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 bg-[#1A1816] text-[8px] uppercase tracking-widest text-brand-gold font-black">
                      Tradition & Significance
                    </div>
                    <p className="text-sm text-brand-cream/90 leading-relaxed font-light text-center">{selectedDish.significance}</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedDish(null)}
                  className="w-full py-5 bg-brand-gold/5 border border-brand-gold/20 text-[10px] uppercase tracking-mega font-black text-brand-gold hover:bg-brand-gold hover:text-black transition-all"
                >
                  Close Archive Entry
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
