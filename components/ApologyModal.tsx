import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Frown, AlertOctagon } from 'lucide-react';
import TypewriterText from './TypewriterText';

interface ApologyModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  isPanicMode: boolean;
}

const ApologyModal: React.FC<ApologyModalProps> = ({ isOpen, onClose, message, isPanicMode }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4 transition-colors duration-500 ${isPanicMode ? 'bg-red-950/80' : 'bg-slate-900/40'}`}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{ 
              scale: 1, 
              y: 0, 
              opacity: 1,
              x: isPanicMode ? [0, -5, 5, -5, 5, 0] : 0,
            }}
            transition={{
                x: { duration: 0.4, repeat: isPanicMode ? Infinity : 0, repeatDelay: 2 }
            }}
            exit={{ scale: 0.9, y: 50, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className={`
              rounded-3xl shadow-2xl p-8 max-w-md w-full relative border transition-colors duration-500
              ${isPanicMode 
                ? 'bg-neutral-900 border-red-500 shadow-red-900/80' 
                : 'bg-white border-indigo-100 shadow-slate-900/20'
              }
            `}
          >
            <button
              onClick={onClose}
              className={`absolute top-4 right-4 transition-colors ${isPanicMode ? 'text-red-700 hover:text-red-500' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <X size={20} />
            </button>
            
            <div className="flex flex-col items-center text-center">
              <div className={`
                w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-colors duration-500
                ${isPanicMode ? 'bg-red-950 text-red-500 animate-ping' : 'bg-indigo-50 text-indigo-500'}
              `}>
                {isPanicMode ? <AlertOctagon size={32} /> : <Frown size={32} />}
              </div>
              <h3 className={`text-xl font-bold mb-2 transition-colors ${isPanicMode ? 'text-red-500' : 'text-slate-800'}`}>
                {isPanicMode ? "CRITICAL REGRET" : "I'm Terrible."}
              </h3>
              <div className={`mb-8 leading-relaxed min-h-[60px] flex items-center justify-center transition-colors ${isPanicMode ? 'text-red-200 font-mono' : 'text-slate-600'}`}>
                {/* Re-mount component when message changes to trigger typing effect */}
                <TypewriterText key={message} text={`"${message.toUpperCase()}"`} minSpeed={isPanicMode ? 5 : undefined} maxSpeed={isPanicMode ? 20 : undefined} />
              </div>
              
              <div className="flex gap-3 w-full">
                <button
                  onClick={onClose}
                  className={`
                    flex-1 py-3 px-4 font-medium rounded-xl transition-colors text-sm
                    ${isPanicMode 
                      ? 'bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-900/50' 
                      : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                    }
                  `}
                >
                  {isPanicMode ? "ACKNOWLEDGE FAILURE" : "It's Okay..."}
                </button>
                <button
                  onClick={onClose}
                  className={`
                    flex-1 py-3 px-4 font-medium rounded-xl transition-colors text-sm
                    ${isPanicMode 
                      ? 'bg-neutral-800 text-red-400 hover:bg-neutral-700 border border-red-900' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }
                  `}
                >
                  {isPanicMode ? "ABORT" : "Please Stop"}
                </button>
              </div>
              <p className={`mt-4 text-xs ${isPanicMode ? 'text-red-900' : 'text-slate-400'}`}>
                (Clicking these buttons will probably make me apologize again. Sorry.)
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ApologyModal;