import React from 'react';
import { motion } from 'framer-motion';
import { TESTIMONIALS } from '../constants';
import { StarIcon } from './Icons';

export const TestimonialCarousel: React.FC = () => {
  const carouselItems = [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <div className="w-full overflow-hidden py-10 md:py-20 relative bg-indigo-50/30">
      <div className="absolute inset-y-0 left-0 w-12 md:w-60 bg-gradient-to-r from-white/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-12 md:w-60 bg-gradient-to-l from-white/80 to-transparent z-10 pointer-events-none" />
      
      <motion.div 
        className="flex gap-5 md:gap-10 px-5"
        animate={{ x: ["0%", "-33.33%"] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        whileHover={{ animationPlayState: 'paused' }}
      >
        {carouselItems.map((item, i) => (
          <div 
            key={`${item.name}-${i}`}
            className="flex-shrink-0 w-[260px] md:w-[450px] bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-xl border border-indigo-100/50 flex flex-col items-center text-center"
          >
            <div className="flex gap-1 mb-5 md:mb-6">
              {[...Array(5)].map((_, idx) => (
                <StarIcon key={idx} className="w-3.5 h-3.5 md:w-5 md:h-5 text-amber-400" />
              ))}
            </div>
            
            <p className="text-xs md:text-xl font-medium text-slate-600 italic leading-relaxed mb-8 md:mb-12 flex-grow">
              "{item.text}"
            </p>
            
            <div className="flex flex-col items-center gap-3 mt-auto">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-indigo-100 shadow-sm shrink-0">
                <img 
                  src={item.avatar} 
                  alt={item.name} 
                  className="w-full h-full object-cover" 
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div>
                <h4 className="text-sm md:text-lg font-black text-indigo-950 leading-tight">{item.name}</h4>
                <p className="text-[10px] md:text-xs font-bold text-indigo-400 uppercase tracking-widest mt-0.5">{item.role}</p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};
