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
  const baseStyles = "px-10 py-5 rounded-2xl font-black transition-all duration-300 flex items-center justify-center gap-3 font-display tracking-[0.05em] uppercase text-center relative overflow-hidden group";
  
  const variants = {
    primary: "bg-indigo-600 text-white shadow-[0_20px_40px_-10px_rgba(79,70,229,0.5)] border-t border-white/20",
    secondary: "bg-amber-400 text-indigo-950 shadow-[0_20px_40px_-10px_rgba(251,191,36,0.5)] border-t border-white/40",
    outline: "border-2 border-white/10 text-white backdrop-blur-md hover:bg-white/5"
  };

  return (
    <motion.button 
      type={type}
      onClick={onClick} 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      animate={pulse ? {
        scale: [1, 1.02, 1],
        boxShadow: variant === 'secondary' 
          ? ["0 15px 30px -10px rgba(251,191,36,0.4)", "0 25px 50px -5px rgba(251,191,36,0.6)", "0 15px 30px -10px rgba(251,191,36,0.4)"]
          : ["0 15px 30px -10px rgba(79,70,229,0.4)", "0 25px 50px -5px rgba(79,70,229,0.6)", "0 15px 30px -10px rgba(79,70,229,0.4)"]
      } : {}}
      transition={pulse ? {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      } : {}}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
    </motion.button>
  );
};