
import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { STORIES } from '../constants';
import * as Icons from './Icons';

export const ProductMockup: React.FC = () => {
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const isMobile = windowWidth < 768;
  
  // Valor puro da rotação
  const rotation = useMotionValue(0);
  
  // Spring para suavizar o movimento de rotação
  const springRotation = useSpring(rotation, { 
    stiffness: 40, 
    damping: 25,
    restDelta: 0.001
  });
  
  const isDragging = useRef(false);
  const autoRotateRef = useRef<number | null>(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    // Animação de rotação automática
    const animate = () => {
      if (!isDragging.current) {
        rotation.set(rotation.get() - 0.15); // Velocidade constante
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
  // Ajuste do raio para manter as capas sempre dentro do "stage"
  const radius = isMobile ? 160 : 380;
  const cardWidth = isMobile ? 100 : 220;

  return (
    <div className="relative h-[450px] md:h-[800px] w-full flex items-center justify-center overflow-hidden select-none">
      
      {/* 1. Camada de Fundo (Blur Estático) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-indigo-500/10 rounded-full blur-[120px] -z-10" />

      {/* 2. Área de Interação (Captura o mouse/toque em toda a largura) */}
      <div 
        className="absolute inset-0 z-30 cursor-grab active:cursor-grabbing"
        onMouseDown={() => { isDragging.current = true; }}
        onMouseUp={() => { isDragging.current = false; }}
        onMouseLeave={() => { isDragging.current = false; }}
        onTouchStart={() => { isDragging.current = true; }}
        onTouchEnd={() => { isDragging.current = false; }}
      >
        <motion.div 
          className="w-full h-full"
          onPan={(e, info) => {
            // Aqui atualizamos apenas o valor da rotação baseada no movimento X
            // Sem mover o elemento fisicamente para os lados
            const currentRotation = rotation.get();
            rotation.set(currentRotation + info.delta.x * 0.3);
          }}
        />
      </div>

      {/* 3. O Carrossel 3D (Fixo no centro) */}
      <div 
        className="relative flex items-center justify-center pointer-events-none"
        style={{ 
          perspective: isMobile ? '800px' : '1500px',
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
                  backfaceVisibility: 'hidden'
                }}
              >
                {/* O Card do Livro */}
                <div className="relative group">
                  <div 
                    style={{ width: cardWidth }}
                    className="aspect-[3/4] rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] border-4 md:border-[8px] border-white bg-white relative"
                  >
                    <img 
                      src={story.imageUrl} 
                      alt={story.title} 
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Brilho e Efeito de Vidro */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/20 pointer-events-none" />
                    
                    {/* Título apenas no hover (desktop) */}
                    <div className="absolute inset-0 bg-indigo-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 md:p-8">
                       <p className="text-white text-[10px] md:text-sm font-black uppercase leading-tight">
                         {story.title}
                       </p>
                    </div>
                  </div>

                  {/* Sombra Projetada no Chão */}
                  <div 
                    className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[80%] h-6 bg-black/20 blur-xl rounded-full"
                    style={{ transform: 'rotateX(90deg)' }}
                  />
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* 4. Interface Estática de Apoio */}
      <div className="absolute bottom-6 md:bottom-12 flex flex-col items-center z-40 pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-xl border border-indigo-100 px-6 py-4 md:px-10 md:py-6 rounded-full shadow-lg flex flex-col items-center"
        >
          <div className="flex gap-1 mb-1">
            {[...Array(5)].map((_, i) => <Icons.StarIcon key={i} className="w-3 h-3 md:w-4 md:h-4 text-amber-400" />)}
          </div>
          <p className="font-display font-black text-indigo-950 text-[10px] md:text-lg uppercase tracking-tight">
            BIBLIOTECA MÁGICA
          </p>
          <div className="flex items-center gap-2 mt-1">
             <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
             <span className="text-[8px] md:text-[10px] font-black text-indigo-400 uppercase tracking-widest">Gire para descobrir</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
