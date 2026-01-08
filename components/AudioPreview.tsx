
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ttsService } from '../services/ttsService';
import * as Icons from './Icons';

export const AudioPreview: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);

  const sampleText = "E então, o Pequeno Astronauta fechou os olhos, sentindo o peso suave de sua coberta estelar, enquanto o foguete do sono flutuava mansinho pelo vale dos sonhos...";

  const handlePlay = async () => {
    if (loading) return;
    setLoading(true);
    const audioData = await ttsService.generateSampleAudio(sampleText);
    if (audioData) {
      await ttsService.playAudio(audioData);
      setIsPlaying(true);
      setTimeout(() => setIsPlaying(false), 8000); // Estimativa de duração
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-[2rem] max-w-sm mx-auto">
      <div className="flex items-center gap-4">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handlePlay}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${loading ? 'bg-slate-700' : 'bg-amber-400 text-indigo-950 shadow-lg shadow-amber-400/20'}`}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-indigo-950 border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            <Icons.SparklesIcon className="w-6 h-6 animate-pulse" />
          ) : (
            <Icons.PlayIcon className="w-6 h-6 ml-1" />
          )}
        </motion.button>
        <div className="text-left">
          <p className="text-white font-black text-xs uppercase tracking-widest">Ouça uma Amostra</p>
          <p className="text-indigo-200/60 text-[10px] font-medium italic">O tom de voz ideal para o sono</p>
        </div>
      </div>
      
      {isPlaying && (
        <motion.div 
          initial={{ opacity: 0, y: 5 }} 
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-1 items-center h-4"
        >
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ height: [4, 12, 4] }}
              transition={{ repeat: Infinity, duration: 0.5 + Math.random(), ease: "easeInOut" }}
              className="w-1 bg-amber-400 rounded-full"
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};
