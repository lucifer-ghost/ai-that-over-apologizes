import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Snowflakes: React.FC = () => {
  const [flakes, setFlakes] = useState<any[]>([]);

  useEffect(() => {
    // Generate snowflakes on mount
    const count = 40;
    const newFlakes = Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage
      delay: Math.random() * 10,
      duration: 10 + Math.random() * 10, // Slow fall
      size: 4 + Math.random() * 8,
      opacity: 0.3 + Math.random() * 0.5
    }));
    setFlakes(newFlakes);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {flakes.map((flake) => (
        <motion.div
          key={flake.id}
          initial={{ 
            y: -20, 
            x: `${flake.x}vw`, 
            opacity: 0 
          }}
          animate={{ 
            y: '110vh', 
            opacity: [0, flake.opacity, 0],
            rotate: 360
          }}
          transition={{ 
            duration: flake.duration, 
            delay: flake.delay, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute bg-white rounded-full blur-[1px]"
          style={{ width: flake.size, height: flake.size }}
        />
      ))}
    </div>
  );
};

export default Snowflakes;