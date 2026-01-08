import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { STORIES } from '../constants';
import * as Icons from './Icons';

export const ProductMockup: React.FC = () => {
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const isMobile = windowWidth < 768;
  const isSmallMobile = windowWidth < 400;
  
  const rotation = useMotionValue(0);
  const springRotation = useSpring(rotation, { 
    stiffness: 30, 
    damping: 25,
    restDelta: 0.001
  });
  
  const isDragging = useRef(false);
  const autoRotateRef = useRef<number | null>(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    const animate = () => {
      if (!isDragging.current) {
        rotation.set(rotation.get() - 0.06);
      }
      autoRotateRef.current = requestAnimationFrame(animate);
    };
    
    autoRotateRef.current = requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (autoRotateRef.current) cancelAnimationFrame(autoRotateRef.current);
    };
  }, [rotation]);

  const total = STORIES.length;
  const radius = isSmallMobile ? 180 : isMobile ? 260 : 550;
  const cardWidth = isSmallMobile ? 120 : isMobile ? 160 : 320;

  return (
    <div className="relative h-[600px] md:h-[900px] w-full flex items-center justify-center overflow-visible select-none">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[900px] md:h-[900px] bg-indigo-500/10 rounded-full blur-[150px] -z-10" />

      {/* Dragging Area */}
      <div 
        className="absolute inset-0 z-50 cursor-grab active:cursor-grabbing"
        onMouseDown={() => { isDragging.current = true; }}
        onMouseUp={() => { isDragging.current = false; }}
        onMouseLeave={() => { isDragging.current = false; }}
        onTouchStart={() => { isDragging.current = true; }}
        onTouchEnd={() => { isDragging.current = false; }}
      >
        <motion.div 
          className="w-full h-full"
          onPan={(e, info) => {
            const currentRotation = rotation.get();
            rotation.set(currentRotation + info.delta.x * 0.12);
          }}
        />
      </div>

      <div 
        className="relative flex items-center justify-center"
        style={{ 
          perspective: '4000px',
          width: '100%',
          height: '100%'
        }}
      >
        <motion.div
          style={{ 
            rotateY: springRotation,
            transformStyle: "preserve-3d",
          }}
          className="relative flex items-center justify-center w-0 h-0"
        >
          {STORIES.map((story, index) => {
            const angle = (index / total) * 360;
            return (
              <div
                key={story.id}
                style={{
                  position: 'absolute',
                  transformStyle: "preserve-3d",
                  transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                  backfaceVisibility: 'hidden',
                  zIndex: 10
                }}
              >
                <div className="relative group" style={{ minWidth: cardWidth }}>
                  <div 
                    style={{ width: cardWidth }}
                    className="aspect-[3/4] rounded-2xl md:rounded-[4rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.6)] border-[4px] md:border-[12px] border-white/5 bg-indigo-950 relative transition-all duration-700 group-hover:scale-105 group-hover:border-indigo-500/30"
                  >
                    <img 
                      src={story.imageUrl} 
                      alt={story.title} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/10 pointer-events-none" />
                    
                    {/* Brilho de Borda Interna */}
                    <div className="absolute inset-0 border border-white/10 rounded-[inherit] pointer-events-none" />
                  </div>
                  
                  {/* Título Flutuante */}
                  <div className="mt-8 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <h5 className="text-white font-black text-xs md:text-lg uppercase tracking-widest">{story.title}</h5>
                  </div>

                  {/* Sombra de Contato */}
                  <div 
                    className="absolute -bottom-10 md:-bottom-20 left-1/2 -translate-x-1/2 w-[90%] h-8 md:h-16 bg-indigo-900/40 blur-[50px] md:blur-[80px] rounded-full"
                    style={{ transform: 'rotateX(90deg)' }}
                  />
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Floating Indicators */}
      <div className="absolute bottom-4 md:bottom-20 flex flex-col items-center gap-4 z-40 pointer-events-none">
        <div className="flex gap-2">
          {[...Array(total)].map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-indigo-500/20" />
          ))}
        </div>
        <p className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.4em] animate-pulse">Gire para Navegar</p>
      </div>
    </div>
  );
};