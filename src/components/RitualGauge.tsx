import React from 'react';
import { motion } from 'motion/react';

interface RitualGaugeProps {
  currentStage: number; // 1-8 (courses)
  stageName: string;
}

const COURSES = [
  "Meethas (1)",
  "Kharaas (2)",
  "Meethas (3)",
  "Kharaas (4)",
  "Jaman (5)",
  "Pehlow (6)",
  "Zubaan-ni-Chatas (7)",
  "Mukhwas (8)"
];

export function RitualGauge({ currentStage, stageName }: RitualGaugeProps) {
  const percentage = (currentStage / 8) * 100;

  return (
    <div className="flex items-center gap-6 px-8 py-3 bg-brand-bg/80 backdrop-blur-xl border border-brand-gold/20 rounded-full shadow-2xl">
      <div className="relative w-12 h-12">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="currentColor"
            strokeWidth="3"
            fill="transparent"
            className="text-white/5"
          />
          <motion.circle
            cx="24"
            cy="24"
            r="20"
            stroke="currentColor"
            strokeWidth="3"
            fill="transparent"
            strokeDasharray="125.6"
            initial={{ strokeDashoffset: 125.6 }}
            animate={{ strokeDashoffset: 125.6 - (125.6 * percentage) / 100 }}
            className="text-brand-gold"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-brand-gold">
          {currentStage}/8
        </div>
      </div>
      
      <div className="flex flex-col">
        <span className="text-[8px] uppercase tracking-mega font-bold text-white/30">Course Progression</span>
        <div className="flex items-center gap-2">
           <span className="text-xs font-serif font-bold text-brand-cream whitespace-nowrap">{stageName || COURSES[currentStage - 1]}</span>
           <div className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" />
        </div>
      </div>
    </div>
  );
}
