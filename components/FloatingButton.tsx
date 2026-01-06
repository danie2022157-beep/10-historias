
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { STORIES } from '../constants';

interface FloatingButtonProps {
  onClick: () => void;
}

export const FloatingButton: React.FC<FloatingButtonProps> = ({ onClick }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Pegamos as 3 primeiras capas para criar um efeito de "coleção"
  const previewImages = [STORIES[0].imageUrl, STORIES[1].imageUrl, STORIES[2].imageUrl];

  useEffect(() => {
    const toggleVisibility = () => {
      // Aparece após rolar 500px
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center w-full px-6 md:w-auto">
          
          {/* Pilha de Livros (Preview do Produto) */}
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.8 }}
            className="mb-[-15px] flex items-center justify-center relative h-16 md:h-24 w-32 md:w-40"
          >
            {previewImages.map((img, idx) => (
              <motion.div
                key={idx}
                initial={{ rotate: 0 }}
                animate={{ 
                  rotate: idx === 0 ? -12 : idx === 1 ? 0 : 12,
                  x: idx === 0 ? -25 : idx === 1 ? 0 : 25,
                  z: idx === 1 ? 10 : 0
                }}
                className="absolute w-12 md:w-16 aspect-[3/4] rounded-lg overflow-hidden shadow-2xl border-2 border-white bg-white"
                style={{ zIndex: idx === 1 ? 20 : 10 }}
              >
                <img src={img} alt="Product Preview" className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </motion.div>
            ))}
          </motion.div>

          {/* Botão Principal */}
          <motion.button
            initial={{ y: 50, opacity: 0 }}
            animate={{ 
              y: 0, 
              opacity: 1,
              scale: [1, 1.03, 1],
            }}
            exit={{ y: 50, opacity: 0 }}
            transition={{
              scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className="w-full sm:w-auto bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 text-indigo-950 px-6 md:px-12 py-4 md:py-6 rounded-2xl md:rounded-full border-2 border-white shadow-[0_20px_50px_rgba(251,191,36,0.4)] flex items-center justify-center gap-3 relative z-30"
          >
            <div className="flex flex-col items-start leading-none text-left">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">Acesso Imediato</span>
              <span className="text-sm md:text-xl font-display font-black tracking-wider uppercase">
                QUERO A BIBLIOTECA
              </span>
            </div>
            <div className="h-10 w-[1px] bg-indigo-950/10 mx-1 hidden md:block" />
            <div className="bg-indigo-950 text-white text-[10px] md:text-xs font-black px-3 py-1.5 rounded-lg shadow-inner">
              R$ 19,90
            </div>
          </motion.button>
          
          {/* Detalhe de brilho atrás do botão */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-48 h-12 bg-amber-400/20 blur-3xl -z-10 rounded-full" />
        </div>
      )}
    </AnimatePresence>
  );
};
