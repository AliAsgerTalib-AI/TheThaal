import { motion } from 'motion/react';
import { X, Heart, Users, ShieldCheck, Star, Anchor } from 'lucide-react';

interface TraditionPillar {
  title: string;
  description: string;
  icon: any;
}

const PILLARS: TraditionPillar[] = [
  {
    title: "The Safra & Thaal",
    description: "Eating together on a Safra (cloth) around a circular Thaal (metal plate) symbolizes equality, unity, and the shared blessing of sustenance.",
    icon: Users
  },
  {
    title: "Purity & Hygiene",
    description: "The ritual of washing hands (Chelam-chi Lota) and the insistence on 'Halal' and 'Tayyib' (Pure) ingredients are non-negotiable foundations.",
    icon: ShieldCheck
  },
  {
    title: "Zero Waste (Zulm)",
    description: "Wasting food is considered a sin. Every morsel in the Thaal must be consumed, teaching respect for the labor and divine gift of food.",
    icon: Heart
  }
];

interface TraditionPageProps {
  onClose: () => void;
}

export function TraditionPage({ onClose }: TraditionPageProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-brand-bg relative"
    >
      <div className="fixed inset-0 bg-[#0a0a0a]" />
      <div className="fixed inset-white/5 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #d4af37 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      <div className="relative max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-24">
        <section className="text-center mb-32 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
             <span className="text-brand-gold uppercase tracking-[0.4em] font-black text-[10px]">Al-Barakat</span>
             <h1 className="text-6xl md:text-9xl font-serif text-brand-cream leading-tight">
               The <span className="italic">Heritage</span> <br />of the <span className="text-brand-gold">Thaal</span>
             </h1>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl text-white/40 font-light max-w-3xl mx-auto leading-relaxed italic"
          >
            "A plate that binds a community, a sequence that balances the soul, and a ritual that honors the creator."
          </motion.p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-40">
          {PILLARS.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="p-12 glass-card border-brand-gold/10 rounded-[3rem] hover:border-brand-gold/40 transition-all duration-700"
            >
              <pillar.icon className="w-12 h-12 text-brand-gold mb-8" />
              <h3 className="text-2xl font-serif text-brand-cream mb-6">{pillar.title}</h3>
              <p className="text-white/50 leading-relaxed font-light">{pillar.description}</p>
            </motion.div>
          ))}
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-40">
           <div className="space-y-8">
             <div className="flex items-center gap-4">
               <Anchor className="w-6 h-6 text-brand-gold" />
               <span className="text-xs uppercase tracking-widest font-bold text-brand-gold">Global Diaspora</span>
             </div>
             <h2 className="text-4xl md:text-6xl font-serif text-brand-cream leading-tight">
               From Yemen to Zanzibar to the World
             </h2>
             <p className="text-lg text-white/60 leading-relaxed font-light">
               The Bohra community's culinary journey is a map of global trade. From the spice markets of East Africa 
                to the coastal towns of Gujarat, every migration added a layer to our palette. Yet, the core remains 
                anchored in the Fatimi traditions of Yemen and Egypt.
             </p>
             <div className="pt-8 grid grid-cols-2 gap-12 border-t border-white/5">
                <div className="space-y-2">
                  <span className="text-3xl font-mono font-bold text-brand-gold">1000+</span>
                  <p className="text-[10px] uppercase font-bold tracking-mega text-white/30">Years of History</p>
                </div>
                <div className="space-y-2">
                  <span className="text-3xl font-mono font-bold text-brand-gold">Global</span>
                  <p className="text-[10px] uppercase font-bold tracking-mega text-white/30">Diaspora Presence</p>
                </div>
             </div>
           </div>
           
           <div className="relative">
             <div className="aspect-[4/5] rounded-[4rem] bg-gradient-to-br from-brand-gold/20 to-transparent border border-brand-gold/30 flex items-center justify-center p-12 text-center">
                <div className="space-y-8">
                  <Star className="w-16 h-16 text-brand-gold mx-auto opacity-40 animate-pulse" />
                  <p className="text-2xl font-serif italic text-brand-cream leading-relaxed">
                    "The Thaal is a circle. In a circle, there is no head, no tail, No king, no commoner. 
                    Only brothers and sisters breaking bread."
                  </p>
                </div>
             </div>
           </div>
        </section>

        <footer className="text-center py-20 border-t border-white/5">
          <p className="text-[10px] uppercase tracking-mega font-bold text-white/20">
            Heritage Preserved &bull; Future Orchestrated
          </p>
        </footer>
      </div>
    </motion.div>
  );
}
