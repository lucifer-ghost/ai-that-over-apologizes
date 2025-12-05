import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ConfettiProps {
  isPanicMode: boolean;
}

const Confetti: React.FC<ConfettiProps> = ({ isPanicMode }) => {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    // Generate particles on mount
    const count = 50;
    const newParticles = Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 2,
      rotation: Math.random() * 360,
      scale: 0.5 + Math.random(),
      color: isPanicMode 
        ? ['bg-red-600', 'bg-black', 'bg-white', 'bg-red-900'][Math.floor(Math.random() * 4)]
        : ['bg-indigo-400', 'bg-purple-300', 'bg-pink-300', 'bg-blue-300', 'bg-yellow-200'][Math.floor(Math.random() * 5)]
    }));
    setParticles(newParticles);
  }, [isPanicMode]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ 
            y: -20, 
            x: `${p.x}vw`, 
            opacity: 1, 
            rotate: 0,
            scale: 0
          }}
          animate={{ 
            y: '120vh', 
            rotate: p.rotation + 720,
            opacity: 0,
            scale: p.scale
          }}
          transition={{ 
            duration: p.duration, 
            delay: p.delay, 
            ease: "easeOut" 
          }}
          className={`absolute w-3 h-3 rounded-sm ${p.color}`}
        />
      ))}
    </div>
  );
};

export default Confetti;