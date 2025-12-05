
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AvatarProps {
  isPanicMode: boolean;
  isHolidayMode: boolean;
  isApologizing: boolean;
}

const Avatar: React.FC<AvatarProps> = ({ isPanicMode, isHolidayMode, isApologizing }) => {
  const [blink, setBlink] = useState(false);
  const [lookDirection, setLookDirection] = useState({ x: 0, y: 0 });

  // Blinking logic
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 200);
    }, 4000);
    return () => clearInterval(blinkInterval);
  }, []);

  // Nervous looking around (Idle animation)
  useEffect(() => {
    if (isPanicMode || isApologizing) return;
    
    const moveEyes = () => {
      setLookDirection({
        x: (Math.random() - 0.5) * 6,
        y: (Math.random() - 0.5) * 4
      });
      setTimeout(() => setLookDirection({ x: 0, y: 0 }), 800);
    };

    const lookInterval = setInterval(moveEyes, 3000);
    return () => clearInterval(lookInterval);
  }, [isPanicMode, isApologizing]);

  const baseColor = isPanicMode ? 'bg-red-600' : isHolidayMode ? 'bg-emerald-600' : 'bg-indigo-500';
  const glowColor = isPanicMode ? 'shadow-red-500/50' : isHolidayMode ? 'shadow-emerald-500/50' : 'shadow-indigo-500/50';
  const eyeColor = isPanicMode ? 'bg-yellow-300' : 'bg-white';

  return (
    <motion.div
      className={`fixed top-6 left-4 md:top-8 md:left-8 z-50 w-16 h-16 md:w-24 md:h-24 ${isPanicMode ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, type: 'spring' }}
    >
      {/* Speech Bubble (Optional Reaction) */}
      <AnimatePresence>
        {isApologizing && (
          <motion.div
            initial={{ opacity: 0, x: -10, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`absolute left-full ml-4 top-1/2 -translate-y-1/2 whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-bold border shadow-sm z-50
              ${isPanicMode 
                ? 'bg-red-950 border-red-500 text-red-200' 
                : 'bg-white border-slate-200 text-slate-600'
              }
            `}
          >
            {isPanicMode ? "AAAAAAHH!!" : "I'm so sorry!"}
            {/* Arrow pointing Left */}
            <div className={`absolute left-[-5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rotate-45 border-b border-l
              ${isPanicMode 
                ? 'bg-red-950 border-red-500' 
                : 'bg-white border-slate-200'
              }`} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Body */}
      <motion.div
        className={`w-full h-full rounded-2xl md:rounded-3xl ${baseColor} shadow-lg ${glowColor} relative flex items-center justify-center border-[3px] border-white/20`}
        animate={
          isPanicMode 
          ? { 
              x: [-2, 3, -2, 1, -1], 
              y: [-1, 2, -2, 1], 
              rotate: [-2, 2, -2] 
            } 
          : isApologizing 
            ? { 
                y: [0, 8, 0], 
                scaleY: [1, 0.9, 1], 
                scaleX: [1, 1.05, 1],
                rotate: [0, -3, 3, 0]
              }
            : { 
                y: [0, -6, 0] 
              }
        }
        transition={
          isPanicMode 
          ? { duration: 0.15, repeat: Infinity } 
          : isApologizing 
            ? { duration: 0.4, repeat: 1, type: "spring" } 
            : { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }
      >
        {/* Holiday Hat */}
        {isHolidayMode && !isPanicMode && (
           <motion.div 
             className="absolute -top-6 -left-2 md:-top-8 md:-left-4 w-14 h-14 md:w-20 md:h-20 pointer-events-none"
             initial={{ rotate: -10 }}
             animate={{ rotate: isApologizing ? -20 : -10 }}
           >
             <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
               {/* Hat Body */}
               <path d="M20 80 C 30 20, 70 20, 80 80" fill="#ef4444" />
               {/* Pom Pom */}
               <circle cx="50" cy="20" r="10" fill="white" />
               {/* Brim */}
               <rect x="15" y="75" width="70" height="15" rx="8" fill="white" />
             </svg>
           </motion.div>
        )}

        {/* Sweat Drop (Nervous Twitch) */}
        {!isPanicMode && (
          <motion.div 
            className="absolute top-2 right-3 md:top-3 md:right-5 w-1.5 h-2 md:w-2 md:h-3 bg-blue-200 rounded-full opacity-0"
            animate={
              isApologizing 
              ? { opacity: [0, 1, 0], y: [0, 8] } 
              : { opacity: [0, 0, 0, 1, 0], y: [0, 0, 0, 5, 8] }
            }
            transition={
              isApologizing 
              ? { duration: 0.6 }
              : { repeat: Infinity, repeatDelay: 5, duration: 1.5 }
            }
          />
        )}

        {/* Face Container */}
        <div className="relative w-12 h-8 md:w-16 md:h-12 flex flex-col items-center justify-center gap-1.5 md:gap-2 z-10">
          {/* Eyes Row */}
          <div className="flex gap-2 md:gap-3">
            {/* Left Eye */}
            <motion.div 
              className={`w-2.5 h-3.5 md:w-3.5 md:h-4.5 rounded-full ${eyeColor}`}
              animate={{
                scaleY: blink ? 0.1 : 1,
                x: isApologizing ? 0 : lookDirection.x,
                y: isApologizing ? 5 : lookDirection.y, // Look down in shame
                height: isPanicMode ? [14, 10, 14] : undefined
              }}
              transition={{ duration: 0.2 }} // Smooth eye movement
            />
            {/* Right Eye */}
            <motion.div 
              className={`w-2.5 h-3.5 md:w-3.5 md:h-4.5 rounded-full ${eyeColor}`}
              animate={{
                scaleY: blink ? 0.1 : 1,
                x: isApologizing ? 0 : lookDirection.x,
                y: isApologizing ? 5 : lookDirection.y,
                height: isPanicMode ? [14, 10, 14] : undefined
              }}
              transition={{ duration: 0.2 }}
            />
          </div>

          {/* Mouth */}
          <motion.div 
            className={`w-4 h-1 md:w-5 md:h-1.5 rounded-full ${isPanicMode ? 'bg-red-950' : 'bg-white/80'}`}
            animate={
              isPanicMode 
              ? { scaleX: [0.8, 1.2, 0.8], rotate: [0, 10, -10, 0], borderRadius: "20%" }
              : isApologizing 
                ? { width: 6, height: 3, borderRadius: "50%" } // "O" mouth for oops
                : { width: 12, height: 3, borderRadius: "20px" }
            }
          />
        </div>
      </motion.div>
      
      {/* Shadow */}
      <motion.div 
        className="absolute -bottom-2 md:-bottom-3 left-1/2 -translate-x-1/2 w-12 h-3 md:w-16 md:h-4 bg-black/20 blur-md rounded-full" 
        animate={isApologizing ? { scale: 1.2, opacity: 0.4 } : { scale: 1, opacity: 0.2 }}
      />
    </motion.div>
  );
};

export default Avatar;
