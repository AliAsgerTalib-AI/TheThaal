import React from 'react';
import { motion } from 'motion/react';
import { X, Heart, Globe, Utensils, History, MapPin } from 'lucide-react';

interface AboutPageProps {
  onClose: () => void;
}

export function AboutPage({ onClose }: AboutPageProps) {
  return (
    <div className="fixed inset-0 z-[400] overflow-y-auto bg-brand-bg select-none">
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-8 bg-brand-bg/80 backdrop-blur-md border-b border-white/5"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 border-2 border-brand-gold flex items-center justify-center font-serif text-brand-gold rotate-45 group hover:bg-brand-gold hover:text-brand-bg transition-all">
            <span className="-rotate-45 font-bold">T</span>
          </div>
          <span className="text-xs uppercase tracking-[0.4em] font-bold text-brand-gold">About Us</span>
        </div>
        <button 
          onClick={onClose}
          className="p-3 text-brand-gold hover:bg-brand-gold/10 transition-all rounded-full"
        >
          <X className="w-6 h-6" />
        </button>
      </motion.nav>

      <main className="max-w-4xl mx-auto pt-44 pb-32 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="font-serif text-5xl md:text-7xl text-brand-cream leading-tight mb-12">
            Preserving a <span className="text-brand-gold italic font-light">Legacy</span> of Taste.
          </h1>
          
          <div className="grid md:grid-cols-2 gap-16 mb-24">
            <div className="space-y-8">
              <p className="text-xl text-brand-cream/80 leading-relaxed font-sans font-light">
                Thaal Traditions is more than a digital cookbook. It is a digital sanctuary for the ancestral culinary arts of the Dawoodi Bohra community.
              </p>
              <p className="text-brand-cream/60 leading-relaxed font-sans">
                For generations, our recipes have been whispered in ears, taught by hand, and shared in the communal Thaal. Today, we bridge the gap between ancient tradition and modern convenience, ensuring that the Barakat of our cuisine continues to flourish in the hearts and homes of the next generation.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square bg-brand-gold/5 border border-brand-gold/10 p-6 flex flex-col justify-end">
                <History className="w-8 h-8 text-brand-gold mb-4" />
                <h3 className="text-[10px] uppercase tracking-widest font-bold text-brand-gold">Centuries of</h3>
                <p className="text-lg font-serif">Heritage</p>
              </div>
              <div className="aspect-square bg-white/5 border border-white/10 p-6 flex flex-col justify-end">
                <Globe className="w-8 h-8 text-brand-cream/40 mb-4" />
                <h3 className="text-[10px] uppercase tracking-widest font-bold text-brand-cream/40">Global</h3>
                <p className="text-lg font-serif">Community</p>
              </div>
            </div>
          </div>

          <section className="space-y-24">
            <div className="border-t border-white/5 pt-16">
              <div className="flex flex-col md:flex-row gap-12">
                <div className="md:w-1/3">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-8 h-8 rounded-full bg-brand-gold/10 flex items-center justify-center">
                      <Heart className="w-4 h-4 text-brand-gold" />
                    </div>
                    <h2 className="text-xs uppercase tracking-[0.3em] font-bold text-brand-gold">Our Mission</h2>
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="font-serif text-3xl text-brand-cream mb-6 leading-tight">To Document the undocumented and celebrate the celebrated.</h3>
                  <p className="text-brand-cream/50 leading-relaxed italic">
                    "Every family has a secret, and every secret has a flavor. We believe that by documenting these nuances, we keep the spirit of the Dawoodi Bohra community alive, one Thaal at a time."
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-white/5 pt-16">
              <div className="flex flex-col md:flex-row gap-12">
                <div className="md:w-1/3">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-8 h-8 rounded-full bg-brand-gold/10 flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-brand-gold" />
                    </div>
                    <h2 className="text-xs uppercase tracking-[0.3em] font-bold text-brand-gold">Our Roots</h2>
                  </div>
                </div>
                <div className="md:w-2/3">
                  <div className="prose prose-invert max-w-none">
                    <p className="text-brand-cream/70 leading-relaxed mb-6">
                      Originating from the vibrant spice markets of Surat and the ancestral homes of Gujarat, Bohra cuisine is a masterpiece of cultural integration. It blends Yemeni influences with Indian spices, resulting in a unique repertoire that is both sophisticated and deeply familiar.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-8 mt-12">
                      <div className="p-6 border border-white/10 bg-[#1A1816]">
                        <Utensils className="w-6 h-6 text-brand-gold mb-4" />
                        <h4 className="font-serif text-xl mb-2">Authenticity First</h4>
                        <p className="text-sm text-brand-cream/40 leading-relaxed">Every recipe is vetted by grandmothers and master chefs of the community.</p>
                      </div>
                      <div className="p-6 border border-brand-gold/20 bg-brand-gold/5">
                        <Heart className="w-6 h-6 text-brand-gold mb-4" />
                        <h4 className="font-serif text-xl mb-2">Made with Love</h4>
                        <p className="text-sm text-brand-cream/40 leading-relaxed">Designed for families who want to keep their kitchen traditions alive.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <footer className="mt-32 pt-16 border-t border-white/5 text-center space-y-8">
            <div className="space-y-4">
              <p className="text-[10px] uppercase tracking-[0.4em] text-brand-gold font-bold">Join the Tradition</p>
              <div className="flex justify-center gap-8">
                <a href="#" className="text-brand-cream/40 hover:text-brand-gold transition-colors text-xs uppercase tracking-widest font-bold">Instagram</a>
                <a href="#" className="text-brand-cream/40 hover:text-brand-gold transition-colors text-xs uppercase tracking-widest font-bold">Pinterest</a>
                <a href="mailto:aliasgertalib@gmail.com" className="text-brand-cream/40 hover:text-brand-gold transition-colors text-xs uppercase tracking-widest font-bold">Email</a>
              </div>
            </div>

            <div className="pt-16 border-t border-white/5 space-y-4">
              <p className="text-[10px] text-white/20 uppercase tracking-widest max-w-2xl mx-auto leading-relaxed">
                Legal Disclaimer: The recipes and cultural information provided on this platform are for educational and heritage preservation purposes. Culinary results may vary based on ingredients and equipment. Please observe all food safety protocols.
              </p>
              <p className="text-xs text-brand-gold/60 font-serif">
                © Copyright Ali Asger Talib / Noore Sara A Talib. All rights reserved.
              </p>
              <p className="text-[10px] text-white/40">
                Contact us: <a href="mailto:aliasgertalib@gmail.com" className="hover:text-brand-gold transition-colors">aliasgertalib@gmail.com</a>
              </p>
            </div>
          </footer>
        </motion.div>
      </main>
    </div>
  );
}
