import React from 'react';
import { motion } from 'framer-motion';
import { FEATURES } from '../constants';
import { Monitor, Wifi, HelpCircle, Bug } from 'lucide-react';
import { ApologyHandler } from '../types';

interface FeaturesProps {
  triggerApology: ApologyHandler;
  isPanicMode: boolean;
}

const iconMap: Record<string, React.ReactNode> = {
  monitor: <Monitor size={24} />,
  wifi: <Wifi size={24} />,
  'help-circle': <HelpCircle size={24} />,
  bug: <Bug size={24} />
};

const Features: React.FC<FeaturesProps> = ({ triggerApology, isPanicMode }) => {
  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className={`text-3xl font-bold mb-4 transition-colors duration-500 ${isPanicMode ? 'text-red-500' : 'text-slate-800'}`}>
          {isPanicMode ? "CRITICAL ERRORS (SORRY)" : "What I'm Sorry For"}
        </h2>
        <p className={`max-w-2xl mx-auto transition-colors duration-500 ${isPanicMode ? 'text-red-300' : 'text-slate-500'}`}>
          {isPanicMode ? "EVERYTHING IS WRONG. I AM SO SORRY. SYSTEM FAILURE IMMINENT." : "The list is infinite, but here are the top categories of my regret."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {FEATURES.map((feature, index) => (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ 
              y: isPanicMode ? -10 : -5, 
              scale: isPanicMode ? 1.05 : 1.02,
              x: isPanicMode ? [0, -2, 2, -2, 2, 0] : 0, // Shake effect in panic mode
              transition: { duration: 0.2 }
            }}
            onClick={() => triggerApology('feature_card')}
            className={`
              p-8 rounded-3xl cursor-pointer transition-all duration-300 group border
              ${isPanicMode 
                ? 'bg-red-950/80 border-red-600 shadow-lg shadow-red-900/50 hover:shadow-red-500/50 hover:bg-red-900' 
                : 'bg-white border-slate-100 shadow-lg shadow-indigo-100/50 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-200/50'
              }
            `}
          >
            <div className={`
              w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300
              ${isPanicMode 
                ? 'bg-red-900 text-red-200 group-hover:bg-red-800 group-hover:text-white animate-pulse' 
                : 'bg-indigo-50 text-indigo-500 group-hover:scale-110 group-hover:bg-indigo-100'
              }
            `}>
              {iconMap[feature.icon]}
            </div>
            <h3 className={`text-xl font-bold mb-3 transition-colors ${isPanicMode ? 'text-red-100' : 'text-slate-800'}`}>
              {isPanicMode ? feature.title.toUpperCase() : feature.title}
            </h3>
            <p className={`leading-relaxed text-sm transition-colors ${isPanicMode ? 'text-red-300' : 'text-slate-500'}`}>
              {feature.description}
            </p>
            <div className={`mt-6 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 ${isPanicMode ? 'text-red-400' : 'text-indigo-400'}`}>
              {isPanicMode ? "PANIC CLICK TO IGNORE" : "Click to forgive (doesn't work)"}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Features;