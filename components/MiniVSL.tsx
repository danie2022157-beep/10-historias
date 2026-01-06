
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlayIcon, UsersIcon, SparklesIcon, ZapIcon } from './Icons';

interface MiniVSLProps {
  onPlay: () => void;
}

export const MiniVSL: React.FC<MiniVSLProps> = ({ onPlay }) => {
  const [viewers, setViewers] = useState(1240);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const viewersInterval = setInterval(() => {
      setViewers(prev => prev + Math.floor(Math.random() * 10) - 4);
    }, 3000);

    const progressInterval = setInterval(() => {
      setProgress(prev => (prev < 100 ? prev + 0.1 : 0));
    }, 100);

    return () => {
      clearInterval(viewersInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto px-2 md:px-4 py-6 md:py-12">
      <div className="bg-slate-950 rounded-[2rem] md:rounded-[3rem] p-3 md:p-6 shadow-[0_50px_100px_-15px_rgba(0,0,0,0.8)] border-2 md:border-4 border-indigo-500/20 relative overflow-hidden group">
        
        {/* Camada de Decoração Pulsante */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-600/10 to-transparent pointer-events-none" />
        
        {/* Status Bar Superior */}
        <div className="flex items-center justify-between mb-4 md:mb-6 px-2 md:px-4">
          <div className="flex items-center gap-2">
            <div className="bg-red-600 px-2 py-0.5 rounded text-[8px] md:text-[10px] font-black text-white flex items-center gap-1.5 animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.5)]">
              <div className="w-1.5 h-1.5 bg-white rounded-full" /> AO VIVO
            </div>
            <div className="text-white/80 text-[8px] md:text-[11px] font-black flex items-center gap-2 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
              <UsersIcon className="w-3 h-3 text-red-400" /> {viewers.toLocaleString()} PAIS CONECTADOS
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-amber-400 font-black text-[10px] uppercase tracking-widest">
            <ZapIcon className="w-4 h-4" /> Especialista em Neuro-Sono
          </div>
        </div>

        {/* Player Container */}
        <div 
          onClick={onPlay}
          className="relative aspect-video bg-indigo-950 rounded-xl md:rounded-[2rem] overflow-hidden cursor-pointer border border-white/10 ring-1 ring-white/20"
        >
          {/* Overlay de Simulação de Vídeo (Muted Preview) */}
          <img 
            src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=1200" 
            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[20s] ease-linear"
            alt="Mini VSL Auto-play"
          />

          {/* Central Play/Unmute Prompt */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-[2px] group-hover:backdrop-blur-none transition-all">
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-20 h-20 md:w-32 md:h-32 bg-amber-400 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(251,191,36,0.5)] group-hover:bg-amber-300 transition-colors z-20"
            >
              <PlayIcon className="w-10 h-10 md:w-16 md:h-16 text-indigo-950 ml-2" />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 md:mt-8 bg-white/10 backdrop-blur-md border border-white/20 px-4 md:px-8 py-2 md:py-4 rounded-full"
            >
              <p className="text-white text-xs md:text-xl font-black uppercase tracking-widest text-glow-white flex items-center gap-3">
                {/* Fixed the missing Icons namespace by using SparklesIcon directly as it is already imported */}
                <SparklesIcon className="w-4 h-4 md:w-6 md:h-6 text-amber-400" />
                Clique para Ativar o Som e Assistir
              </p>
            </motion.div>
          </div>

          {/* Video Progress Bar */}
          <div className="absolute bottom-0 left-0 w-full p-4 md:p-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
             <div className="flex items-center gap-4">
               <div className="h-1.5 flex-grow bg-white/20 rounded-full overflow-hidden">
                 <div 
                   style={{ width: `${progress}%` }}
                   className="h-full bg-amber-400 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.8)] transition-all duration-100 ease-linear"
                 />
               </div>
               <span className="text-white font-mono text-[10px] md:text-sm font-bold">01:24 / 05:30</span>
             </div>
          </div>

          {/* Legenda Dinâmica Simulada */}
          <div className="absolute bottom-16 md:bottom-24 left-0 w-full text-center px-6">
            <motion.p 
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="text-white text-sm md:text-3xl font-display font-black bg-black/50 inline-block px-4 py-1 rounded-lg"
            >
              "...o segredo não está na força, mas na técnica de ancoragem..."
            </motion.p>
          </div>
        </div>

        {/* Footer do VSL */}
        <div className="mt-4 md:mt-8 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-10">
          <div className="flex -space-x-3">
            {[1,2,3,4].map(i => (
              <img key={i} src={`https://i.pravatar.cc/100?u=${i}`} className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-slate-900 shadow-lg" alt="User" />
            ))}
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-indigo-600 border-2 border-slate-900 flex items-center justify-center text-[8px] md:text-[10px] font-black text-white">
              +5k
            </div>
          </div>
          <p className="text-indigo-200/60 text-[9px] md:text-sm font-bold uppercase tracking-widest text-center">
            Únete a mais de 5.340 famílias que já abandonaram as telas hoje
          </p>
        </div>
      </div>
    </div>
  );
};
