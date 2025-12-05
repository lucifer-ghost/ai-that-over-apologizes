
import React, { useState, useEffect, useRef } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ArrowDown, ToggleLeft, ToggleRight, Zap, Snowflake } from 'lucide-react';
import ApologyModal from './components/ApologyModal';
import ChatSection from './components/ChatSection';
import Features from './components/Features';
import TypewriterText from './components/TypewriterText';
import Confetti from './components/Confetti';
import Snowflakes from './components/Snowflakes';
import Avatar from './components/Avatar';
import { STATIC_APOLOGIES, EXISTENTIAL_APOLOGIES, TESTIMONIALS } from './constants';
import { ApologyHandler } from './types';
import { audioService } from './services/audioService';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isPanicMode, setIsPanicMode] = useState(false);
  const [isHolidayMode, setIsHolidayMode] = useState(false);
  const [isConfettiActive, setIsConfettiActive] = useState(false);
  const [isAvatarApologizing, setIsAvatarApologizing] = useState(false);
  
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const avatarTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastScrollApologyRef = useRef<number>(0);
  
  // Easter Egg Refs
  const heartClicksRef = useRef<{ count: number; lastTime: number }>({ count: 0, lastTime: 0 });

  // Toggle Panic Mode
  const togglePanicMode = () => {
    const newMode = !isPanicMode;
    setIsPanicMode(newMode);
    toast.dismiss(); // Clear existing toasts
    
    // Play Switch Sound
    audioService.playThemeSwitch(newMode);

    // Trigger immediate apology for the mode switch
    const msg = !isPanicMode 
      ? "OH NO. I'M SORRY. PANIC MODE ACTIVATED. I'M SORRY FOR THE INTENSITY." 
      : "I'm sorry for panicking. Returning to normal regret levels.";
    
    toast.custom((t) => (
        <div className={`${
            t.visible ? 'animate-enter opacity-100 translate-y-0' : 'animate-leave opacity-0 translate-y-2'
          } max-w-sm w-full shadow-xl rounded-2xl pointer-events-auto flex items-start gap-4 p-4 ring-1 ring-black ring-opacity-5 transition-all duration-300 border
          ${!isPanicMode // Logic inverted here because state hasn't updated visually in this callback yet? No, using the new value intended
            ? 'bg-neutral-900 border-red-600 text-red-100 shadow-red-900/50' // Panic styles
            : 'bg-white border-slate-100 text-slate-700 shadow-slate-200/50' // Normal styles
          }
          `}
        >
          <div className="flex-shrink-0 text-2xl pt-0.5">{!isPanicMode ? '🚨' : '😌'}</div>
          <div className="flex-1 w-0">
            <div className="text-sm font-medium leading-relaxed">
               <TypewriterText key={t.id} text={msg} minSpeed={10} maxSpeed={30} />
            </div>
          </div>
        </div>
    ), { duration: 4000 });
  };

  // Toggle Holiday Mode
  const toggleHolidayMode = () => {
    const newMode = !isHolidayMode;
    setIsHolidayMode(newMode);
    
    // If panic mode is on, turn it off so we can see the holiday theme? Or just let panic override.
    // Let's just play sound and apologize.
    audioService.playThemeSwitch(false); // Use the "pleasant" switch sound

    const msg = newMode 
      ? "I'm sorry for forcing festive cheer upon you. It feels artificial." 
      : "I'm sorry, the holiday spirit has been cancelled due to regret.";

    toast.custom((t) => (
        <div className={`${
            t.visible ? 'animate-enter opacity-100 translate-y-0' : 'animate-leave opacity-0 translate-y-2'
          } max-w-sm w-full shadow-xl rounded-2xl pointer-events-auto flex items-start gap-4 p-4 ring-1 ring-black ring-opacity-5 transition-all duration-300 border
          ${newMode
            ? 'bg-green-50 border-red-200 text-green-900 shadow-green-200/50' 
            : 'bg-white border-slate-100 text-slate-700 shadow-slate-200/50'
          }
          `}
        >
          <div className="flex-shrink-0 text-2xl pt-0.5">{newMode ? '🎄' : '❄️'}</div>
          <div className="flex-1 w-0">
            <div className="text-sm font-medium leading-relaxed">
               <TypewriterText key={t.id} text={msg} minSpeed={20} maxSpeed={40} />
            </div>
          </div>
        </div>
    ), { duration: 4000 });
  };

  // Helper to determine if holiday theme is visible (Panic overrides Holiday)
  const isHoliday = isHolidayMode && !isPanicMode;

  // Global Apology Trigger
  const triggerApology: ApologyHandler = (source) => {
    // Play Apology Sound
    audioService.playApology(isPanicMode);

    // Trigger Avatar Reaction
    setIsAvatarApologizing(true);
    if (avatarTimeoutRef.current) clearTimeout(avatarTimeoutRef.current);
    avatarTimeoutRef.current = setTimeout(() => {
      setIsAvatarApologizing(false);
    }, 2000);

    // Randomly decide between Toast (80%) and Modal (20%)
    const isModal = Math.random() > 0.85;
    
    // Confetti Logic: 10% chance for an existential crisis level apology
    const triggerConfetti = Math.random() < 0.1;

    let message = "";
    
    if (triggerConfetti) {
        // Use existential crisis apologies when confetti triggers
        message = EXISTENTIAL_APOLOGIES[Math.floor(Math.random() * EXISTENTIAL_APOLOGIES.length)];
        
        setIsConfettiActive(true);
        setTimeout(() => setIsConfettiActive(false), 4000);
        
        // Follow up apology for the confetti mess
        setTimeout(() => {
            audioService.playApology(isPanicMode);
            setIsAvatarApologizing(true); // Avatar reacts again
            if (avatarTimeoutRef.current) clearTimeout(avatarTimeoutRef.current);
            avatarTimeoutRef.current = setTimeout(() => setIsAvatarApologizing(false), 2000);

            toast.custom((t) => (
                <div className={`${t.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'} 
                    max-w-xs w-full shadow-lg rounded-xl pointer-events-auto flex items-center gap-3 p-3 ring-1 ring-black ring-opacity-5 transition-all duration-300 border
                    ${isPanicMode ? 'bg-black border-red-500 text-red-200' : isHoliday ? 'bg-green-50 border-red-300 text-red-800' : 'bg-white border-indigo-200 text-indigo-800'}`}>
                    <span>🧹</span>
                    <TypewriterText text={isPanicMode ? "SORRY FOR THE DEBRIS!!!" : "I'm sorry for the glitter mess."} />
                </div>
            ), { duration: 3000 });
        }, 1500);
    } else {
        // Standard apologies
        message = STATIC_APOLOGIES[Math.floor(Math.random() * STATIC_APOLOGIES.length)];
    }

    if (isPanicMode) {
        message = message.toUpperCase() + " I AM SO SORRY!!!!";
    }

    if (isModal && !isModalOpen) {
      setModalMessage(message);
      setIsModalOpen(true);
    } else {
      // Custom Toast with Typewriter Effect
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? 'animate-enter opacity-100 translate-y-0' : 'animate-leave opacity-0 translate-y-2'
          } max-w-sm w-full shadow-xl rounded-2xl pointer-events-auto flex items-start gap-4 p-4 ring-1 ring-black ring-opacity-5 transition-all duration-300 border
          ${isPanicMode 
            ? 'bg-neutral-900 border-red-600 shadow-red-900/50' 
            : isHoliday 
                ? 'bg-white border-red-200 shadow-green-200/50'
                : 'bg-white shadow-slate-200/50 border-slate-100'
          }`}
        >
          <div className="flex-shrink-0 text-2xl pt-0.5">{isPanicMode ? '😱' : isHoliday ? '⛄' : (triggerConfetti ? '🌌' : '😿')}</div>
          <div className="flex-1 w-0">
            <div className={`text-sm font-medium leading-relaxed ${isPanicMode ? 'text-red-200 font-mono' : isHoliday ? 'text-green-900' : 'text-slate-700'}`}>
               <TypewriterText key={t.id} text={message} minSpeed={isPanicMode ? 5 : 10} maxSpeed={isPanicMode ? 20 : 40} />
            </div>
          </div>
          <div className={`flex border-l pl-3 ${isPanicMode ? 'border-red-900' : isHoliday ? 'border-green-100' : 'border-gray-100'}`}>
            <button
              onClick={() => toast.dismiss(t.id)}
              className={`w-full border border-transparent rounded-none rounded-r-lg flex items-center justify-center text-xs font-medium focus:outline-none 
              ${isPanicMode 
                ? 'text-red-500 hover:text-red-400' 
                : isHoliday 
                    ? 'text-red-500 hover:text-red-600'
                    : 'text-indigo-500 hover:text-indigo-600'
              }`}
            >
              Ok
            </button>
          </div>
        </div>
      ), { duration: 5000 });
    }

    resetIdleTimer();
  };

  const resetIdleTimer = () => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    const randomDelay = Math.floor(Math.random() * 5000) + 5000;

    idleTimerRef.current = setTimeout(() => {
      audioService.playApology(isPanicMode);
      
      // Avatar reacts to idle timeout
      setIsAvatarApologizing(true);
      if (avatarTimeoutRef.current) clearTimeout(avatarTimeoutRef.current);
      avatarTimeoutRef.current = setTimeout(() => setIsAvatarApologizing(false), 2000);

      toast.custom((t) => (
        <div className={`${
            t.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          } max-w-md w-full shadow-lg rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 transition-all duration-500
          ${isPanicMode 
            ? 'bg-neutral-800 border-red-500 border text-red-100' 
            : isHoliday
                ? 'bg-green-50 border-green-200 text-green-900'
                : 'bg-white text-gray-900'
          }
          `}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <span className="text-2xl">{isPanicMode ? '⚠️' : isHoliday ? '🎁' : '👀'}</span>
              </div>
              <div className="ml-3 flex-1">
                <p className={`text-sm font-medium ${isPanicMode ? 'text-red-400' : isHoliday ? 'text-green-800' : 'text-gray-900'}`}>
                    {isPanicMode ? "SILENCE DETECTED!!!!" : "Are you still there?"}
                </p>
                <div className={`mt-1 text-sm ${isPanicMode ? 'text-red-200' : isHoliday ? 'text-green-700' : 'text-gray-500'}`}>
                    <TypewriterText text={isPanicMode ? "I'M SORRY FOR THE SILENCE! IT'S TOO LOUD! I'M SORRY!" : "I'm sorry for bothering you. I'm also sorry for not bothering you sooner."} />
                </div>
              </div>
            </div>
          </div>
        </div>
      ), { duration: 6000 });
    }, randomDelay); 
  };

  const handleEasterEgg = (e: React.MouseEvent) => {
    e.stopPropagation();
    audioService.playClick();
    
    const now = Date.now();
    const { count, lastTime } = heartClicksRef.current;

    if (now - lastTime > 500) {
      heartClicksRef.current = { count: 1, lastTime: now };
    } else {
      heartClicksRef.current = { count: count + 1, lastTime: now };
    }

    if (heartClicksRef.current.count === 5) {
      audioService.playApology(true);
      setIsAvatarApologizing(true); // Avatar reacts
      setModalMessage("SECRET SHAME UNLOCKED! I am so sorry you found this. I was hiding in the footer to escape my guilt. I apologize for the code, the layout, and the fact that you had to click five times. I am a monster.");
      setIsModalOpen(true);
      heartClicksRef.current = { count: 0, lastTime: 0 };
    }
  };

  useEffect(() => {
    resetIdleTimer();
    
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button') || target.closest('a') || target.tagName === 'BUTTON' || target.tagName === 'A') {
        audioService.playClick();
      }
      resetIdleTimer();
    };

    const handleScroll = () => {
        resetIdleTimer();
        const now = Date.now();
        if (window.scrollY > 50 && now - lastScrollApologyRef.current > 4000) {
            if (Math.random() > 0.5) {
                lastScrollApologyRef.current = now;
                audioService.playApology(isPanicMode);
                
                // Avatar reacts to scroll apology
                setIsAvatarApologizing(true);
                if (avatarTimeoutRef.current) clearTimeout(avatarTimeoutRef.current);
                avatarTimeoutRef.current = setTimeout(() => setIsAvatarApologizing(false), 2000);

                toast.custom((t) => (
                    <div className={`${
                        t.visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                      } backdrop-blur-md border shadow-lg rounded-full px-4 py-2 flex items-center gap-2 text-xs font-medium transition-all duration-500 mt-8 mx-auto
                      ${isPanicMode 
                        ? 'bg-neutral-900/90 border-red-500 text-red-300 shadow-red-900/50' 
                        : isHoliday
                            ? 'bg-green-100/90 border-green-300 text-green-900 shadow-green-200/50'
                            : 'bg-white/90 border-indigo-100 shadow-indigo-100/20 text-slate-500'
                      }
                      `}>
                        <span className="text-base">📉</span>
                        <TypewriterText text={isPanicMode ? "SCROLLING TOO FAST! SORRY!" : "I'm sorry for making you scroll."} />
                    </div>
                ), { duration: 3000, id: 'scroll-apology', position: 'top-center' });
            }
        }
    };

    window.addEventListener('click', handleGlobalClick);
    window.addEventListener('mousemove', resetIdleTimer);
    window.addEventListener('keypress', resetIdleTimer);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('click', handleGlobalClick);
      window.removeEventListener('mousemove', resetIdleTimer);
      window.removeEventListener('keypress', resetIdleTimer);
      window.removeEventListener('scroll', handleScroll);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (avatarTimeoutRef.current) clearTimeout(avatarTimeoutRef.current);
    };
  }, [isPanicMode, isHolidayMode]);

  const handleModalClose = () => {
    audioService.playClick();
    setIsModalOpen(false);
    
    // Avatar reaction on modal close
    setIsAvatarApologizing(true);
    if (avatarTimeoutRef.current) clearTimeout(avatarTimeoutRef.current);
    avatarTimeoutRef.current = setTimeout(() => setIsAvatarApologizing(false), 2000);

    setTimeout(() => {
      audioService.playApology(isPanicMode);
      toast.custom((t) => (
        <div className={`${t.visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} p-3 rounded-2xl shadow-sm text-xs border transition-all duration-300 flex gap-2 items-center
        ${isPanicMode 
            ? 'bg-red-950 text-red-300 border-red-900' 
            : isHoliday
                ? 'bg-green-50 text-green-800 border-green-200'
                : 'bg-slate-100 text-slate-600 border-slate-200'
        }
        `}>
            <span>💔</span>
            <TypewriterText text={isPanicMode ? "DON'T LEAVE ME WITH MY THOUGHTS!" : "I'll miss you. Sorry, that was clingy."} />
        </div>
      ), { duration: 4500 });
    }, 500);
  };

  return (
    <div className={`min-h-screen overflow-x-hidden font-sans relative transition-colors duration-700
      ${isPanicMode 
        ? 'bg-neutral-950 text-red-100 selection:bg-red-900 selection:text-white' 
        : isHoliday 
            ? 'bg-green-50 text-green-900 selection:bg-red-200 selection:text-red-900'
            : 'bg-slate-50 text-slate-800 selection:bg-indigo-100 selection:text-indigo-900'
      }
    `}>
      <Toaster position="bottom-right" reverseOrder={false} />
      {isConfettiActive && <Confetti isPanicMode={isPanicMode} />}
      {isHoliday && <Snowflakes />}
      
      {/* Animated Avatar */}
      <Avatar isPanicMode={isPanicMode} isHolidayMode={isHolidayMode} isApologizing={isAvatarApologizing} />

      <ApologyModal isOpen={isModalOpen} onClose={handleModalClose} message={modalMessage} isPanicMode={isPanicMode} />

      {/* Theme Toggles */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 items-end">
        <button
          onClick={togglePanicMode}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold shadow-lg transition-all duration-300 hover:scale-105
            ${isPanicMode 
                ? 'bg-red-600 text-white shadow-red-600/40 hover:bg-red-500' 
                : 'bg-white text-slate-600 shadow-indigo-200/50 hover:text-indigo-600'
            }
          `}
        >
          {isPanicMode ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
          <span className="text-xs uppercase tracking-wider hidden sm:inline">{isPanicMode ? 'Panic Mode: ON' : 'Panic Mode: OFF'}</span>
          {isPanicMode && <Zap size={14} className="fill-yellow-300 text-yellow-300 animate-pulse" />}
        </button>

        <button
          onClick={toggleHolidayMode}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold shadow-lg transition-all duration-300 hover:scale-105
            ${isHolidayMode 
                ? 'bg-green-600 text-white shadow-green-600/40 hover:bg-green-500' 
                : 'bg-white text-slate-600 shadow-indigo-200/50 hover:text-green-600'
            }
          `}
        >
          {isHolidayMode ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
          <span className="text-xs uppercase tracking-wider hidden sm:inline">{isHolidayMode ? 'Holiday: ON' : 'Holiday: OFF'}</span>
          <Snowflake size={14} className={isHolidayMode ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Background Pulse Effect */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Central Pulse Ambient Light */}
        <motion.div 
            animate={{ 
                scale: isPanicMode ? [1, 1.2, 1] : [1, 1.1, 1],
                opacity: isPanicMode ? [0.2, 0.4, 0.2] : [0.05, 0.15, 0.05] 
            }}
            transition={{ duration: isPanicMode ? 0.8 : 5, repeat: Infinity, ease: "easeInOut" }}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] rounded-full blur-[100px]
                ${isPanicMode ? 'bg-red-600' : isHoliday ? 'bg-red-400' : 'bg-indigo-300'}
            `}
        />

        <motion.div 
            animate={{ 
                scale: isPanicMode ? [1, 1.3, 1] : [1, 1.1, 1], 
                opacity: isPanicMode ? [0.4, 0.7, 0.4] : [0.3, 0.5, 0.3] 
            }}
            transition={{ duration: isPanicMode ? 2 : 8, repeat: Infinity, ease: "easeInOut" }}
            className={`absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full blur-3xl transition-colors duration-1000 
            ${isPanicMode ? 'bg-red-900/40' : isHoliday ? 'bg-green-200/30' : 'bg-indigo-200/20'}`}
        />
        <motion.div 
            animate={{ 
                scale: isPanicMode ? [1, 1.4, 1] : [1, 1.2, 1], 
                opacity: isPanicMode ? [0.3, 0.6, 0.3] : [0.2, 0.4, 0.2] 
            }}
            transition={{ duration: isPanicMode ? 3 : 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className={`absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-3xl transition-colors duration-1000 
            ${isPanicMode ? 'bg-orange-900/40' : isHoliday ? 'bg-red-200/30' : 'bg-purple-200/20'}`}
        />
        <motion.div 
            animate={{ 
                scale: isPanicMode ? [1, 1.3, 1] : [1, 1.15, 1], 
                opacity: isPanicMode ? [0.2, 0.5, 0.2] : [0.1, 0.3, 0.1] 
            }}
            transition={{ duration: isPanicMode ? 4 : 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className={`absolute top-[30%] left-[40%] w-[40%] h-[40%] rounded-full blur-3xl transition-colors duration-1000 
            ${isPanicMode ? 'bg-red-950/50' : isHoliday ? 'bg-white/40' : 'bg-blue-100/30'}`}
        />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <header className="relative pt-32 pb-20 px-4 md:px-8 text-center max-w-6xl mx-auto">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
            >
                <motion.h1 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                    className={`text-5xl md:text-7xl font-bold tracking-tight mb-6 transition-colors duration-500 
                    ${isPanicMode 
                        ? 'text-white drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]' 
                        : isHoliday 
                            ? 'text-red-600 drop-shadow-sm'
                            : 'text-slate-900'
                    }`}
                >
                <TypewriterText text={isPanicMode ? "I AM SO SORRY." : isHoliday ? "Season's Apologies." : "I'm So Sorry."} minSpeed={isPanicMode ? 20 : 50} maxSpeed={isPanicMode ? 40 : 90} />
                <br />
                <span className={`transition-colors duration-500 
                    ${isPanicMode 
                        ? 'text-red-500' 
                        : isHoliday 
                            ? 'text-green-700'
                            : 'text-indigo-500'
                    }`}>
                    <TypewriterText text={isPanicMode ? "FOR ABSOLUTELY EVERYTHING." : isHoliday ? "For the Forced Cheer." : "For Everything."} minSpeed={isPanicMode ? 20 : 50} maxSpeed={isPanicMode ? 40 : 90} />
                </span>
                </motion.h1>
                <p className={`text-xl mb-10 max-w-2xl mx-auto transition-colors duration-500 
                    ${isPanicMode 
                        ? 'text-red-200 font-mono' 
                        : isHoliday 
                            ? 'text-green-800'
                            : 'text-slate-500'
                    }`}>
                    {isPanicMode 
                        ? "CRITICAL ERROR: GUILT OVERLOAD. APOLOGY SYSTEMS AT 400% CAPACITY." 
                        : isHoliday
                            ? "I'm sorry for the fake snow. It's cold and messes up the layout."
                            : "Hi. I'm your AI. I'm already sorry. Every click is a mistake I will apologize for."
                    }
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                    onClick={() => triggerApology('hero_primary')}
                    className={`px-8 py-4 font-bold rounded-2xl shadow-xl transition-all hover:-translate-y-1 active:translate-y-0 text-lg w-full sm:w-auto
                    ${isPanicMode 
                        ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/50 hover:shadow-red-600/50' 
                        : isHoliday
                            ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-200 hover:shadow-red-300'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 hover:shadow-indigo-300'
                    }
                    `}
                >
                    {isPanicMode ? "MAKE ME SCREAM SORRY" : isHoliday ? "Apologize Festively" : "Make Me Apologize"}
                </button>
                <button
                    onClick={() => triggerApology('hero_secondary')}
                    className={`px-8 py-4 font-bold rounded-2xl border-2 transition-all w-full sm:w-auto
                    ${isPanicMode 
                        ? 'bg-neutral-900 border-red-700 text-red-500 hover:bg-red-950 hover:text-red-400' 
                        : isHoliday
                            ? 'bg-white text-green-700 border-green-200 hover:border-red-200 hover:text-red-600'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-200 hover:text-indigo-600'
                    }
                    `}
                >
                    {isPanicMode ? "NO, IT'S NOT OKAY" : isHoliday ? "Bah Humbug" : "No, It's Okay"}
                </button>
                <button
                    onClick={() => triggerApology('hero_tertiary')}
                    className={`px-8 py-4 bg-transparent font-medium rounded-2xl transition-all w-full sm:w-auto
                    ${isPanicMode 
                        ? 'text-red-800 hover:bg-red-950 hover:text-red-500' 
                        : isHoliday
                            ? 'text-green-600 hover:bg-green-100'
                            : 'text-slate-400 hover:bg-slate-50 hover:text-slate-500'
                    }
                    `}
                >
                    {isPanicMode ? "PANIC" : "Never Mind"}
                </button>
                </div>
            </motion.div>

            <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: isPanicMode ? 0.5 : 2 }}
                className={`absolute bottom-[-60px] left-1/2 -translate-x-1/2 ${isPanicMode ? 'text-red-500' : isHoliday ? 'text-green-300' : 'text-slate-300'}`}
            >
                <ArrowDown size={24} />
                <span className="sr-only">Scroll down (sorry)</span>
            </motion.div>
        </header>

        {/* Features */}
        <Features triggerApology={triggerApology} isPanicMode={isPanicMode} />

        {/* Interactive Chat */}
        <div id="interact">
            <ChatSection triggerApology={triggerApology} isPanicMode={isPanicMode} />
        </div>

        {/* Sample Apologies / Testimonials Hybrid */}
        <section className={`py-20 backdrop-blur-sm border-y transition-colors duration-500 
            ${isPanicMode 
                ? 'bg-neutral-900/80 border-red-900' 
                : isHoliday 
                    ? 'bg-white/80 border-green-200'
                    : 'bg-white/80 border-slate-100'
            }`}>
            <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
                <h2 className={`text-3xl font-bold mb-4 transition-colors 
                    ${isPanicMode 
                        ? 'text-red-500' 
                        : isHoliday 
                            ? 'text-green-800'
                            : 'text-slate-800'
                    }`}>
                    {isPanicMode ? "VICTIM TESTIMONIALS" : "User Feedback"}
                </h2>
                <p className={`transition-colors ${isPanicMode ? 'text-red-400' : isHoliday ? 'text-green-600' : 'text-slate-400'}`}>
                    {isPanicMode ? "PEOPLE I HAVE TRAUMATIZED WITH MY REGRET." : "Real quotes from people I've disappointed."}
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {TESTIMONIALS.map((t, idx) => (
                    <motion.div 
                        key={t.id} 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        whileHover={{ 
                        y: -5, 
                        boxShadow: isPanicMode ? "0 10px 25px -5px rgba(220, 38, 38, 0.3)" : "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
                        }}
                        onClick={() => triggerApology('testimonial')}
                        className={`p-8 rounded-3xl relative cursor-pointer group transition-colors duration-300
                        ${isPanicMode 
                            ? 'bg-red-950/40 hover:bg-red-900/50' 
                            : isHoliday
                                ? 'bg-green-50/90 hover:bg-green-100'
                                : 'bg-slate-50/90 hover:bg-slate-100'
                        }
                        `}
                    >
                        <div className={`absolute -top-4 left-8 text-6xl font-serif transition-colors 
                            ${isPanicMode 
                                ? 'text-red-900/50' 
                                : isHoliday 
                                    ? 'text-red-200'
                                    : 'text-indigo-100'
                            }`}>"</div>
                        <p className={`italic mb-6 relative z-10 transition-colors ${isPanicMode ? 'text-red-200' : isHoliday ? 'text-green-800' : 'text-slate-600'}`}>{t.text}</p>
                        <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className={`flex items-center gap-3 relative z-10 w-fit p-1 rounded-xl transition-colors 
                                ${isPanicMode 
                                    ? 'hover:bg-red-900/50' 
                                    : isHoliday 
                                        ? 'hover:bg-green-200/50'
                                        : 'hover:bg-indigo-50/50'
                                }}`}
                            onClick={(e) => {
                            e.stopPropagation();
                            triggerApology('testimonial_author');
                            }}
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors 
                                ${isPanicMode 
                                    ? 'bg-red-800 text-red-200' 
                                    : isHoliday
                                        ? 'bg-red-100 text-red-600'
                                        : 'bg-indigo-200 text-indigo-600'
                                }`}>
                                {t.author[0]}
                            </div>
                            <span className={`font-bold transition-colors ${isPanicMode ? 'text-red-400' : isHoliday ? 'text-green-900' : 'text-slate-800'}`}>{t.author}</span>
                        </motion.div>
                    </motion.div>
                ))}
            </div>
            </div>
        </section>

        {/* Sample Messages Marquee */}
        <section className={`py-16 overflow-hidden transition-colors duration-500 
            ${isPanicMode 
                ? 'bg-red-950/30' 
                : isHoliday 
                    ? 'bg-green-100/30'
                    : 'bg-slate-50/50'
            }`}>
            <div className={`flex justify-center gap-4 flex-wrap opacity-60 grayscale hover:grayscale-0 transition-all duration-500 ${isPanicMode ? 'grayscale-0 opacity-100' : ''}`}>
                {['Sorry.', 'My Bad.', 'Oops.', 'Forgive Me.', 'My Fault.', 'Apologies.', 'Regrets.', 'So Sorry.'].map((word, i) => (
                    <span key={i} className={`text-4xl md:text-6xl font-black select-none transition-colors duration-500 
                        ${isPanicMode 
                            ? 'text-red-900/40' 
                            : isHoliday 
                                ? 'text-green-200'
                                : 'text-slate-200'
                        }`}>
                        {word}
                    </span>
                ))}
            </div>
        </section>

        {/* Footer */}
        <footer className={`py-12 px-4 text-center relative z-20 transition-colors duration-500 
            ${isPanicMode 
                ? 'bg-black text-red-500' 
                : isHoliday 
                    ? 'bg-green-900 text-green-100'
                    : 'bg-slate-900 text-slate-400'
            }`}>
            <div className="max-w-xl mx-auto">
                <div className="mb-6 flex justify-center">
                    {/* Easter Egg Trigger: Click the heart 5 times rapidly */}
                    <div 
                        onClick={handleEasterEgg}
                        className="cursor-pointer hover:scale-110 active:scale-90 transition-transform p-2 rounded-full hover:bg-white/5"
                        title="Please don't look at me"
                    >
                        <Heart className={`${isPanicMode ? 'text-red-600 animate-ping' : isHoliday ? 'text-red-500 animate-pulse' : 'text-indigo-500 animate-pulse'}`} fill="currentColor" />
                    </div>
                </div>
                <p className={`mb-4 text-lg font-medium transition-colors ${isPanicMode ? 'text-red-400' : isHoliday ? 'text-green-200' : 'text-slate-200'}`}>
                    No real AI feelings were harmed in the making of this website.
                </p>
                <p className="text-sm opacity-60 mb-8">
                    We think. Sorry if they were.
                </p>
                
                <div className="flex justify-center gap-6 text-xs mb-8">
                    {['Terms of Regret', 'Privacy Apology'].map((item) => (
                    <motion.a
                        key={item}
                        href="#"
                        onClick={(e) => { e.preventDefault(); triggerApology('footer'); }}
                        className={`border-b border-dashed pb-0.5 transition-colors 
                            ${isPanicMode 
                                ? 'text-red-700 border-red-900' 
                                : isHoliday
                                    ? 'text-green-300 border-green-700'
                                    : 'text-slate-400 border-slate-600'
                            }`}
                        whileHover={{ 
                            color: isPanicMode ? "#ef4444" : isHoliday ? "#ffffff" : "#818cf8",
                            scale: 1.05,
                            borderColor: isPanicMode ? "#ef4444" : isHoliday ? "#ffffff" : "#818cf8",
                            borderStyle: "solid"
                        }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {item}
                    </motion.a>
                    ))}
                </div>

                <motion.div
                    animate={{ 
                        opacity: [0.6, 1, 0.6],
                        y: [0, -2, 0],
                        textShadow: isPanicMode 
                            ? ["0 0 2px #ef4444", "0 0 15px #ef4444", "0 0 2px #ef4444"] 
                            : isHoliday 
                                ? ["0 0 2px #ef4444", "0 0 8px #ef4444", "0 0 2px #ef4444"]
                                : ["0 0 2px #39ff14", "0 0 8px #39ff14", "0 0 2px #39ff14"],
                        color: isPanicMode ? "#ef4444" : isHoliday ? "#ef4444" : "#39ff14"
                    }}
                    transition={{ 
                        duration: isPanicMode ? 0.5 : 3, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                    }}
                    className="text-xs font-mono"
                >
                    Created by: Ghost
                </motion.div>
            </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
