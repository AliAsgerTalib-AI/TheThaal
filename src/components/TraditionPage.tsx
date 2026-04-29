import React from 'react';
import { motion } from 'motion/react';
import { Scroll, Users, Sparkles, Utensils, Hash, Star } from 'lucide-react';

interface TraditionPageProps {
  onClose: () => void;
}

export function TraditionPage({ onClose }: TraditionPageProps) {
  const principles = [
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Communal Thaal',
      desc: 'The meal is served in a large circular tray (Thaal) where eight people eat together, fostering unity and equality.'
    },
    {
      icon: <Hash className="w-6 h-6" />,
      title: 'Salt Ritual',
      desc: 'Beginning and ending the meal with a pinch of salt is a Sunnah, believed to cleanse the palate and aid digestion.'
    },
    {
      icon: <Utensils className="w-6 h-6" />,
      title: 'No Wastage',
      desc: 'Respect for sustenance is paramount. Not a single grain of rice is left on the Thaal, as food is considered a divine blessing.'
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: 'Sequence of Courses',
      desc: 'The meal traditionally alternates between sweet (Meethas) and savory (Kharaas) courses to balance the palate.'
    }
  ];

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
      <header className="mb-24 text-center">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="inline-flex items-center gap-2 px-4 py-2 border border-brand-gold/30 text-brand-gold text-[10px] tracking-[0.3em] font-bold uppercase mb-8"
        >
          <Sparkles className="w-3.5 h-3.5" /> Adab of the Thaal
        </motion.div>
        <h1 className="font-serif text-6xl md:text-8xl text-brand-cream leading-tight mb-8">
          A Symphony of <br /><span className="text-brand-gold italic font-light">Etiquette</span>
        </h1>
        <p className="max-w-2xl mx-auto text-brand-cream/60 leading-relaxed font-sans text-lg">
          Bohra dining is not just about the food; it is a spiritual orchestration of rituals that protect the dignity of the meal and the community.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-32">
        {principles.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex gap-8 p-10 border border-white/5 bg-[#1A1816]/30 hover:bg-[#1A1816]/50 transition-all hover:border-brand-gold/20"
          >
            <div className="flex-shrink-0 w-14 h-14 rounded-full border border-brand-gold/20 flex items-center justify-center text-brand-gold bg-brand-gold/5">
              {p.icon}
            </div>
            <div>
              <h3 className="font-serif text-2xl text-brand-cream mb-4">{p.title}</h3>
              <p className="text-brand-cream/50 leading-relaxed font-sans text-sm">{p.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <section className="relative py-24 border-y border-white/5 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]">
          <Scroll className="w-full h-full rotate-[-15deg] scale-125" />
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-16 relative z-10">
          <div className="md:w-1/2">
            <h2 className="font-serif text-4xl md:text-5xl text-brand-gold leading-tight mb-8">The Philosophy of Selection</h2>
            <p className="text-brand-cream/70 leading-relaxed font-sans mb-6">
              A balanced Thaal is a masterpiece of nutritional and sensory engineering. The transition from one course to another is timed to allow the body to process information effectively.
            </p>
            <p className="text-brand-cream/70 leading-relaxed font-sans">
              "When we eat together, we share more than food. We share time, space, and a common destiny. The Thaal is where the family is built."
            </p>
          </div>
          <div className="md:w-1/2 grid grid-cols-2 gap-4">
            <div className="aspect-[4/5] overflow-hidden border border-white/10 group">
              <img src="https://images.unsplash.com/photo-1594179047519-f347310d3322?q=80&w=2670&auto=format&fit=crop" className="w-full h-full object-cover grayscale transition-all group-hover:grayscale-0 duration-700" alt="Tradition" />
            </div>
            <div className="aspect-[4/5] overflow-hidden border border-white/10 mt-12 group">
              <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2670&auto=format&fit=crop" className="w-full h-full object-cover grayscale transition-all group-hover:grayscale-0 duration-700" alt="Thaal" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
