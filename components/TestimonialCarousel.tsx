
import React from 'react';
import { motion } from 'framer-motion';
import { TESTIMONIALS } from '../constants';
import { StarIcon } from './Icons';

export const TestimonialCarousel: React.FC = () => {
  const carouselItems = [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <div className="w-full overflow-hidden py-8 md:py-12 relative">
      <div className="absolute inset-y-0 left-0 w-16 md:w-40 bg-gradient-to-r from-white/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 md:w-40 bg-gradient-to-l from-white/80 to-transparent z-10 pointer-events-none" />
      
      <motion.div 
        className="flex gap-4 md:gap-6 px-4"
        animate={{ x: ["0%", "-33.33%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {carouselItems.map((item, i) => (
          <div 
            key={`${item.name}-${i}`}
            className="flex-shrink-0 w-[280px] md:w-[350px] bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] shadow-lg border border-indigo-50/50 flex flex-col items-center text-center"
          >
            <div className="flex gap-0.5 mb-4">
              {[...Array(5)].map((_, idx) => (
                <StarIcon key={idx} className="w-3.5 h-3.5 text-amber-400" />
              ))}
            </div>
            
            <p className="text-sm md:text-base font-medium text-slate-600 italic leading-relaxed mb-6 md:mb-8 flex-grow">
              "{item.text}"
            </p>
            
            <div className="flex flex-col items-center gap-2 mt-auto">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border border-indigo-100 shadow-sm">
                <img src={item.avatar} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="text-xs md:text-sm font-black text-indigo-950 leading-tight">{item.name}</h4>
                <p className="text-[8px] md:text-[9px] font-bold text-indigo-400 uppercase tracking-widest mt-0.5">{item.role}</p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};
