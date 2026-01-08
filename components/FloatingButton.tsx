import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { STORIES } from '../constants';
import * as Icons from './Icons';

interface FloatingButtonProps {
  onClick: () => void;
}

export const FloatingButton: React.FC<FloatingButtonProps> = ({ onClick }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) setIsVisible(true);
      else setIsVisible(false);
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed bottom-0 left-0 right-0 z-[120] md:bottom-8 md:px-6 pointer-events-none flex justify-center">
          <motion.div
            initial={{ y: 150, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 150, opacity: 0 }}
            className="pointer-events-auto w-full max-w-2xl bg-white/95 backdrop-blur-3xl border-t md:border border-indigo-100 p-3 md:rounded-[3rem] shadow-[0_-15px_50px_rgba(0,0,0,0.1),0_30px_60px_rgba(79,70,229,0.25)] flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4 pl-2 md:pl-6">
              <div className="flex -space-x-6 md:-space-x-8">
                {STORIES.slice(0, 4).map((img, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ rotate: -15 }}
                    animate={{ rotate: (i - 1.5) * 8 }}
                    className="w-10 h-14 md:w-14 md:h-20 rounded-lg border-2 border-white overflow-hidden shadow-xl bg-indigo-900 z-10"
                  >
                    <img src={img.imageUrl} className="w-full h-full object-cover" alt="Capa" />
                  </motion.div>
                ))}
              </div>
              
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-amber-400 text-indigo-950 text-[8px] md:text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">OFERTA ATIVA</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[9px] md:text-xs line-through font-bold">R$ 27,00</span>
                  <p className="text-indigo-950 font-black text-sm md:text-2xl leading-none">R$ 2,00</p>
                </div>
              </div>
            </div>

            <motion.button
              onClick={onClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-indigo-600 text-white pl-6 pr-5 py-4 md:py-6 rounded-2xl md:rounded-[2rem] font-display font-black text-xs md:text-lg uppercase tracking-[0.05em] flex items-center gap-3 group shadow-lg"
            >
              <span className="hidden sm:inline">QUERO O MEU AGORA</span>
              <span className="sm:hidden">LIBERAR AGORA</span>
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Icons.ChevronDownIcon className="w-5 h-5 -rotate-90" />
              </div>
            </motion.button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};