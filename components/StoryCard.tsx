
import React from 'react';
import { motion } from 'framer-motion';
import { Story } from '../types';
import { SparklesIcon, StarIcon } from './Icons';

interface StoryCardProps {
  story: Story;
}

export const StoryCard: React.FC<StoryCardProps> = ({ story }) => {
  const imageUrl = story.imageUrl || `https://picsum.photos/seed/story-${story.id}/400/533`;

  return (
    <motion.div 
      whileHover={{ y: -15, scale: 1.03 }}
      className="bg-white rounded-[2.5rem] p-4 md:p-6 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.05)] border border-indigo-50 group flex flex-col h-full relative"
    >
      <div className="absolute top-4 right-4 bg-amber-400 text-white p-3 rounded-full shadow-xl z-20 rotate-12 scale-90 group-hover:scale-100 group-hover:rotate-0 transition-all duration-500">
        <StarIcon className="w-5 h-5" />
      </div>
      
      <div className="relative aspect-[3/4] mb-8 overflow-hidden rounded-[2rem] bg-slate-100 shadow-inner group-hover:shadow-2xl transition-all duration-500">
        <img 
          src={imageUrl} 
          alt={story.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="flex-grow flex flex-col px-4 text-center">
        <h3 className="text-xl md:text-2xl font-display font-black text-indigo-950 mb-4 leading-tight">
          {story.title}
        </h3>
        <p className="text-slate-500 font-medium text-sm md:text-base leading-relaxed mb-6 opacity-80">
          {story.description}
        </p>
      </div>

      <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-center gap-3 text-indigo-300 font-black text-[10px] uppercase tracking-[0.2em] opacity-40 group-hover:opacity-100 transition-opacity">
        <SparklesIcon className="w-4 h-4 text-amber-400" />
        ACALMA EM MINUTOS
      </div>
    </motion.div>
  );
};
