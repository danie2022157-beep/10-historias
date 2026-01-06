
import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  pulse?: boolean;
  type?: 'button' | 'submit';
}

export const Button: React.FC<ButtonProps> = ({ children, onClick, className = '', variant = 'primary', pulse = false, type = 'button' }) => {
  const baseStyles = "px-10 py-6 rounded-full font-black transition-all duration-300 flex items-center justify-center gap-3 font-display tracking-widest uppercase text-center relative overflow-hidden active:scale-95";
  
  const variants = {
    primary: "bg-indigo-600 text-white shadow-[0_15px_30px_-10px_rgba(79,70,229,0.5)] hover:shadow-[0_25px_50px_-12px_rgba(79,70,229,0.5)]",
    secondary: "bg-gradient-to-r from-amber-400 to-amber-500 text-indigo-950 shadow-[0_15px_30px_-10px_rgba(251,191,36,0.5)] hover:shadow-[0_25px_50px_-12px_rgba(251,191,36,0.5)]",
    outline: "border-4 border-indigo-600 text-indigo-600 bg-white hover:bg-indigo-50"
  };

  const glowColor = variant === 'secondary' ? 'rgba(251, 191, 36, 0.4)' : 'rgba(79, 70, 229, 0.4)';

  return (
    <motion.button 
      type={type}
      onClick={onClick} 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      animate={pulse ? {
        boxShadow: [
          `0 10px 20px -10px ${glowColor}`,
          `0 25px 60px 0px ${glowColor}`,
          `0 10px 20px -10px ${glowColor}`
        ]
      } : {}}
      transition={pulse ? {
        duration: 2.5,
        repeat: Infinity,
        ease: "easeInOut"
      } : {}}
      whileHover={{ scale: 1.05 }}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full hover:translate-x-full transition-transform duration-1000" />
    </motion.button>
  );
};
