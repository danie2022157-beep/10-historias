import React from 'react';
import { motion } from 'framer-motion';
import { PlayIcon, SparklesIcon } from './Icons';

interface MiniVSLProps {
  onPlay: () => void;
}

export const MiniVSL: React.FC<MiniVSLProps> = ({ onPlay }) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-2 md:px-4 py-4 md:py-8">
      <div className="bg-slate-950 rounded-[1.5rem] md:rounded-[2.5rem] p-2 md:p-4 shadow-2xl border border-indigo-500/10 relative overflow-hidden group">
        
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-transparent pointer-events-none" />
        
        <div 
          onClick={onPlay}
          className="relative aspect-video bg-indigo-950 rounded-lg md:rounded-2xl overflow-hidden cursor-pointer border border-white/5"
        >
          <img 
            src="https://images.unsplash.com/photo-1543333995-a78ee9e53ac5?auto=format&fit=crop&q=80&w=1200" 
            className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
            alt="Miniatura do Vídeo"
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 backdrop-blur-[1px] group-hover:backdrop-blur-none transition-all">
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-16 h-16 md:w-24 md:h-24 bg-amber-400 rounded-full flex items-center justify-center shadow-2xl group-hover:bg-amber-300"
            >
              <PlayIcon className="w-8 h-8 md:w-12 md:h-12 text-indigo-950 ml-1" />
            </motion.div>
            
            <motion.div className="mt-6 bg-white/10 backdrop-blur-md border border-white/10 px-6 py-2 rounded-full">
              <p className="text-white text-[10px] md:text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <SparklesIcon className="w-3 h-3 md:w-4 md:h-4 text-amber-400" />
                Toque para assistir à explicação
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};