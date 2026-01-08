import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import * as Icons from './Icons';

interface ExitIntentModalProps {
  onAccept: () => void;
}

export const ExitIntentModal: React.FC<ExitIntentModalProps> = ({ onAccept }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [wasShown, setWasShown] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(59);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !wasShown) {
        triggerModal();
      }
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = lastScrollY.current - currentScrollY;
      if (currentScrollY < 1000 && scrollDelta > 25 && !wasShown) {
        triggerModal();
      }
      lastScrollY.current = currentScrollY;
    };

    const triggerModal = () => {
      setTimeout(() => {
        setIsOpen(true);
        setWasShown(true);
        document.body.style.overflow = 'hidden';
      }, 100);
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [wasShown]);

  useEffect(() => {
    if (isOpen && secondsLeft > 0) {
      const timer = setInterval(() => setSecondsLeft(s => s - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [isOpen, secondsLeft]);

  const handleClose = () => {
    setIsOpen(false);
    document.body.style.overflow = 'unset';
  };

  const handleStay = () => {
    setIsOpen(false);
    document.body.style.overflow = 'unset';
    onAccept();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 bg-indigo-950/95 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="relative bg-white rounded-[2.5rem] md:rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.5)] max-w-xl w-full overflow-hidden border-2 border-amber-400 p-8 md:p-12 text-center z-10"
          >
            {/* Botão Fechar */}
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-300 hover:text-red-500 transition-colors"
            >
              <Icons.XIcon className="w-5 h-5" />
            </button>

            {/* Badge de Urgência */}
            <motion.div 
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-6"
            >
              <Icons.AlertIcon className="w-4 h-4" /> OFERTA QUASE EXPIRADA!
            </motion.div>

            <h3 className="font-display text-3xl md:text-5xl font-black text-indigo-950 mb-4 leading-tight">
              Não deixe para <span className="text-red-600">amanhã</span> a noite de sono que você pode ter <span className="text-indigo-600">hoje.</span>
            </h3>

            <p className="text-slate-500 text-sm md:text-lg font-medium mb-8 leading-relaxed px-2">
              Você está a um passo de transformar a rotina do seu filho. O desconto exclusivo está ativo por apenas mais alguns segundos.
            </p>

            {/* Cronômetro Compacto */}
            <div className="bg-indigo-50 rounded-2xl p-6 mb-8 border border-indigo-100 flex flex-col items-center">
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-3">O PREÇO SOBE EM:</span>
              <div className="flex items-center gap-2 text-4xl md:text-5xl font-mono font-black text-indigo-950 tabular-nums">
                <span>00</span>
                <span className="text-amber-400 animate-pulse">:</span>
                <span>{secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button 
                pulse 
                variant="secondary" 
                onClick={handleStay}
                className="w-full py-6 md:py-8 text-lg md:text-2xl rounded-2xl shadow-xl"
              >
                APROVEITAR AGORA
              </Button>
              <button 
                onClick={handleClose}
                className="text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-red-500 transition-colors py-2"
              >
                Não, prefiro continuar com noites difíceis
              </button>
            </div>

            {/* Elementos Decorativos de Fundo */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-amber-400/5 rounded-full blur-2xl -z-10" />
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl -z-10" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};