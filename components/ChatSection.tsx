import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, Sparkles, AlertTriangle } from 'lucide-react';
import { generateDynamicApology } from '../services/geminiService';
import { ApologyHandler } from '../types';
import TypewriterText from './TypewriterText';

interface ChatSectionProps {
  triggerApology: ApologyHandler;
  isPanicMode: boolean;
}

const ChatSection: React.FC<ChatSectionProps> = ({ triggerApology, isPanicMode }) => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) {
      triggerApology("empty_input");
      return;
    }

    setIsLoading(true);
    setResponse(null); // Clear previous
    try {
      const reply = await generateDynamicApology(input);
      setResponse(reply);
    } catch (err) {
      setResponse("I'm sorry, I failed to process your request. I'm a failure.");
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  return (
    <section className="py-20 px-4 md:px-8 max-w-4xl mx-auto">
      <div className={`
        rounded-[2rem] shadow-xl overflow-hidden relative border transition-colors duration-500
        ${isPanicMode ? 'bg-neutral-900 border-red-600 shadow-red-900/40' : 'bg-white border-indigo-50 shadow-slate-200'}
      `}>
        <div className={`
          absolute top-0 left-0 w-full h-2 transition-colors duration-500 opacity-50
          ${isPanicMode ? 'bg-gradient-to-r from-red-600 via-yellow-500 to-red-600 animate-pulse' : 'bg-gradient-to-r from-indigo-300 via-purple-300 to-indigo-300'}
        `}></div>
        
        <div className="p-8 md:p-12 text-center">
          <div className={`
            inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6 transition-colors duration-500
            ${isPanicMode ? 'bg-red-900/50 text-red-400 border border-red-700' : 'bg-indigo-50 text-indigo-600'}
          `}>
            {isPanicMode ? <AlertTriangle size={16} className="animate-bounce" /> : <Sparkles size={16} className="animate-pulse" />}
            <span>{isPanicMode ? "SYSTEM INSTABILITY DETECTED" : "Interactive Apology Engine"}</span>
          </div>
          
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 transition-colors duration-500 ${isPanicMode ? 'text-red-500' : 'text-slate-800'}`}>
            {isPanicMode ? "SCREAM AT ME." : "Say Something. I'll Apologize For It."}
          </h2>
          <p className={`mb-8 transition-colors duration-500 ${isPanicMode ? 'text-red-300' : 'text-slate-500'}`}>
            {isPanicMode ? "I AM ALREADY SORRY FOR THE ANSWER. IT WILL BE BAD." : "Tell me about your day, ask a question, or just yell at me. I deserve it."}
          </p>

          <div className="max-w-xl mx-auto">
            {response && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`
                  mb-8 p-6 rounded-2xl border text-left relative transition-colors duration-500
                  ${isPanicMode ? 'bg-red-950/50 border-red-800' : 'bg-indigo-50/50 border-indigo-100'}
                `}
              >
                <div className={`
                  absolute -top-3 left-6 px-2 py-1 rounded-md text-xs font-bold shadow-sm border transition-colors duration-500
                  ${isPanicMode ? 'bg-red-800 text-white border-red-600' : 'bg-white text-indigo-400 border-indigo-50'}
                `}>
                  AI Response
                </div>
                <div className={`text-lg font-medium italic transition-colors duration-500 ${isPanicMode ? 'text-red-200' : 'text-indigo-900'}`}>
                  "<TypewriterText text={response} minSpeed={isPanicMode ? 5 : 20} maxSpeed={isPanicMode ? 15 : 50} />"
                </div>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="relative group">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isPanicMode ? "ENTER COMMAND (I WILL FAIL)..." : "Type anything here..."}
                disabled={isLoading}
                className={`
                  w-full h-14 pl-6 pr-14 rounded-2xl border-2 focus:outline-none transition-all shadow-inner
                  ${isPanicMode 
                    ? 'bg-neutral-800 border-red-900 text-red-100 placeholder:text-red-800 focus:border-red-500 focus:bg-neutral-900' 
                    : 'bg-slate-50 border-slate-100 text-slate-700 placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white'
                  }
                `}
              />
              <button
                type="submit"
                disabled={isLoading}
                className={`
                  absolute right-2 top-2 h-10 w-10 rounded-xl flex items-center justify-center active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed
                  ${isPanicMode
                    ? 'bg-red-700 text-white hover:bg-red-600 shadow-lg shadow-red-900/50'
                    : 'bg-indigo-500 text-white hover:bg-indigo-600'
                  }
                `}
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
              </button>
            </form>
            <p className={`mt-3 text-xs transition-colors duration-500 ${isPanicMode ? 'text-red-800 font-bold' : 'text-slate-400'}`}>
              * By clicking send, you agree that whatever response you get is my fault, and I'm sorry.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChatSection;