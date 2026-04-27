import { motion } from 'motion/react';
import { X, Sparkles, Wind, Flame, Droplets } from 'lucide-react';

interface Spice {
  name: string;
  gujaratiName: string;
  description: string;
  usage: string;
  flavor: string;
  icon: any;
}

const BOHRA_SPICES: Spice[] = [
  {
    name: "Mutton Masala (The Core)",
    gujaratiName: "Gosht no Masalo",
    description: "A deep red, aromatic blend representing the soul of Bohra non-vegetarian cuisine.",
    usage: "Used in Mutton Kari, Khichda, and various gravy dishes. It's often slow-roasted with Ghee.",
    flavor: "Earthy, spicy, and robust with strong coriander and cumin notes.",
    icon: Flame
  },
  {
    name: "Tea Masala (The Daily Ritual)",
    gujaratiName: "Chai no Masalo",
    description: "A secret blend that defines every Bohra morning and social gathering.",
    usage: "Added to boiling milk tea. Often customized with familial secret ratios.",
    flavor: "Sharp ginger heat balanced by sweet cardamom and peppercorn.",
    icon: Wind
  },
  {
    name: "Kari Masala",
    gujaratiName: "Kari no Masalo",
    description: "A distinctive mixture specifically for the 'Kari' — the quintessential Bohra coconut-based curry.",
    usage: "Ground with fresh coconut, garlic, and cumin. It gives the Kari its signature yellow-orange hue.",
    flavor: "Tangy from amchur (dried mango) or tamarind, with a nutty background.",
    icon: Droplets
  },
  {
    name: "East African Pilau Blend",
    gujaratiName: "Afriki Pilau Masalo",
    description: "Reflecting the deep heritage of Bohras in Zanzibar, Mombasa, and Dar es Salaam.",
    usage: "Heavily clove-forward, used for making the dark, aromatic East African style Pilau.",
    flavor: "Warm, spicy, and intensely cloves-driven with sweet cinnamon undertones.",
    icon: Sparkles
  },
  {
    name: "Garam Masala (Heritage Blend)",
    gujaratiName: "Garam Masalo",
    description: "Unlike commercial blends, the Bohra version emphasizes 'Thanda' (Cooling) aromatics like green cardamom.",
    usage: "Added at the very end of Balan (sautéing) or sprinkled over Biryani and Pulav.",
    flavor: "Floral, sweet, and highly aromatic without excessive heat.",
    icon: Wind
  },
  {
    name: "Malida Spice",
    gujaratiName: "Malida no Masalo",
    description: "Crucial for the ritualistic sweet dish served during celebrations and Milads.",
    usage: "Finely ground and mixed into crumbled rotis/wheat with jaggery and ghee.",
    flavor: "Dominant cardamom and nutmeg, creating a 'festive' sweet aroma.",
    icon: Sparkles
  },
  {
    name: "White Pepper",
    gujaratiName: "Safed Mari",
    description: "A staple in Bohra 'White' dishes like Safed Murgh or Creamy soups.",
    usage: "Essential for maintaining the pristine white color of creamy gravies while adding sharp heat.",
    flavor: "Sharp, pungent, and less complex than black pepper, focusing on heat.",
    icon: Droplets
  },
  {
    name: "Lagan nu Masalo (Wedding Blend)",
    gujaratiName: "Lagan no Masalo",
    description: "The most complex and expensive blend, reserved for the grand Thaal of a Bohra wedding.",
    usage: "Used in major dishes like 'Lagan nu Gosht'. It features expensive ingredients like saffron and mace.",
    flavor: "Royal, deeply complex, and intensely aromatic with saffron high-notes.",
    icon: Sparkles
  },
  {
    name: "Zanzibar Black Pepper",
    gujaratiName: "Zanzibari Mari",
    description: "While commonly found, the specific grade from Zanzibar is prized by African Bohras.",
    usage: "Used whole in 'Supa' (soups) or crushed coarsely for 'Boti' (meat chunks).",
    flavor: "Extremely sharp heat with a citrus-fruity finish unique to the island's soil.",
    icon: Flame
  },
  {
    name: "Dhuaan Spice (Smoked Finish)",
    gujaratiName: "Dhuaan nu Masalo",
    description: "Not a mixture itself, but the spices used during the 'Dhuaan' (charcoal smoking) ritual.",
    usage: "Cloves and ghee dropped on live charcoal to infuse smoke into Dal Chawal Palidu (DCP).",
    flavor: "Intensely smoky, woody, and primitive.",
    icon: Flame
  }
];

interface SpicesPageProps {
  onClose: () => void;
}

export function SpicesPage({ onClose }: SpicesPageProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-brand-bg relative"
    >
      <div className="fixed inset-0 immersive-gradient opacity-10 pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-20">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <span className="text-brand-gold uppercase tracking-mega font-bold text-[10px]">The Alchemical Library</span>
            <h1 className="text-5xl md:text-8xl font-serif leading-tight text-brand-cream">
              Bohra <span className="italic text-brand-gold">Masalas</span>
            </h1>
            <p className="text-lg text-white/50 font-light max-w-2xl mx-auto leading-relaxed">
              In the Bohra kitchen, spices are more than ingredients; they are the heritage of trade, 
              calculated for medicinal balance and seasonal harmony.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {BOHRA_SPICES.map((spice, idx) => (
            <motion.div
              key={spice.name}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group p-8 bg-white/[0.02] border border-white/5 rounded-[2rem] hover:border-brand-gold/30 transition-all duration-700 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <spice.icon className="w-32 h-32 text-brand-gold" />
              </div>

              <div className="relative z-10 space-y-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-brand-gold" />
                    <span className="text-[10px] uppercase font-bold tracking-widest text-brand-gold">{spice.gujaratiName}</span>
                  </div>
                  <h3 className="text-3xl font-serif text-brand-cream">{spice.name}</h3>
                </div>

                <p className="text-white/60 leading-relaxed font-light italic">
                  "{spice.description}"
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-white/5">
                  <div className="space-y-3">
                    <span className="text-[9px] uppercase font-bold tracking-widest text-white/40">Palate Profile</span>
                    <p className="text-sm font-medium text-brand-gold/80">{spice.flavor}</p>
                  </div>
                  <div className="space-y-3">
                    <span className="text-[9px] uppercase font-bold tracking-widest text-white/40">Culinary Context</span>
                    <p className="text-sm text-brand-cream/70 leading-relaxed">{spice.usage}</p>
                  </div>
                </div>

                <div className="pt-6">
                  <div className="w-full h-px bg-gradient-to-r from-brand-gold/20 to-transparent" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-32 p-12 glass-card border-brand-gold/20 rounded-[3rem] text-center space-y-8">
          <h2 className="text-3xl font-serif text-brand-gold">The "Thanda" vs "Garam" Philosophy</h2>
          <p className="text-white/60 max-w-3xl mx-auto leading-relaxed italic">
            Bohra spice blending follows the Yunani (Grecian-Persian) medicinal law of balance. 
            Heavy meats are always countered with 'thanda' aromatics like green cardamom and white poppy seeds (Khaskhas) 
             to ensure digestibility and prevent heat imbalance in the body.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
