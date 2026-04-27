import { motion } from 'motion/react';
import { X, Target, History, Globe } from 'lucide-react';

interface AboutPageProps {
  onClose: () => void;
}

export function AboutPage({ onClose }: AboutPageProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-brand-bg relative"
    >
      <div className="fixed inset-0 bg-[#0a0a0a]" />
      
      <div className="relative max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-24">
        <section className="text-center mb-32 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
             <span className="text-brand-gold uppercase tracking-[0.4em] font-black text-[10px]">Our Story</span>
             <h1 className="text-6xl md:text-9xl font-serif text-brand-cream leading-tight">
               Thaali <span className="italic text-brand-gold">Traditions</span>
             </h1>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-white/40 font-light max-w-3xl mx-auto leading-relaxed italic"
          >
            "Preserving the architectural beauty of the Bohra communal dining experience for the digital age."
          </motion.p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-32">
          <div className="p-12 glass-card border-brand-gold/10 rounded-[3rem] space-y-6">
            <Target className="w-10 h-10 text-brand-gold" />
            <h3 className="text-2xl font-serif text-brand-cream">Our Mission</h3>
            <p className="text-white/50 leading-relaxed font-light">
              We aim to bridge the gap between ancestral wisdom and modern technology, ensuring that the intricate orchestration 
              of the Bohra Thaal is never lost to time.
            </p>
          </div>

          <div className="p-12 glass-card border-brand-gold/10 rounded-[3rem] space-y-6">
            <History className="w-10 h-10 text-brand-gold" />
            <h3 className="text-2xl font-serif text-brand-cream">Our History</h3>
            <p className="text-white/50 leading-relaxed font-light">
              Born from a desire to document the ephemeral rituals of our elders, this project started as a digital archive 
              of family recipes and transformed into a global platform for culinary heritage.
            </p>
          </div>

          <div className="p-12 glass-card border-brand-gold/10 rounded-[3rem] space-y-6">
            <Globe className="w-10 h-10 text-brand-gold" />
            <h3 className="text-2xl font-serif text-brand-cream">Global Reach</h3>
            <p className="text-white/50 leading-relaxed font-light">
              From Mumbai to London, Mombasa to Chicago, we connect the global Bohra diaspora through the universal language 
              of shared salt and communal joy.
            </p>
          </div>
        </div>

        <section className="max-w-4xl mx-auto text-center space-y-12">
          <h2 className="text-4xl font-serif text-brand-cream">The Digital Safra</h2>
          <p className="text-lg text-white/60 leading-relaxed">
            Thaali Traditions is not just a recipe site. It is a tool for orchestration. We believe the 'how' is as important 
            as the 'what'. By providing detailed cooking timelines and host rituals, we enable the next generation 
            to host their first Thaal with the confidence of a veteran.
          </p>
          <div className="w-24 h-px bg-brand-gold mx-auto" />
        </section>
      </div>
    </motion.div>
  );
}
