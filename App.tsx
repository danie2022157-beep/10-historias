import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './components/Button';
import { FloatingButton } from './components/FloatingButton';
import { ProductMockup } from './components/ProductMockup';
import { TestimonialCarousel } from './components/TestimonialCarousel';
import { MiniVSL } from './components/MiniVSL';
import { ExitIntentModal } from './components/ExitIntentModal';
import { Modal } from './components/Modal';
import { FAQS, PAIN_POINTS, COMPARISON } from './constants';
import { AudioPreview } from './components/AudioPreview';
import * as Icons from './components/Icons';

const BackgroundStars = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
    {[...Array(80)].map((_, i) => (
      <div 
        key={i} 
        className="star" 
        style={{ 
          top: `${Math.random() * 100}%`, 
          left: `${Math.random() * 100}%`,
          width: `${Math.random() * 2 + 0.5}px`,
          height: `${Math.random() * 2 + 0.5}px`,
          opacity: Math.random() * 0.5 + 0.1,
          ['--duration' as any]: `${3 + Math.random() * 5}s`
        }} 
      />
    ))}
  </div>
);

const SectionHeader = ({ badge, title, subtitle, light = false, align = 'center' }: any) => (
  <div className={`text-${align} mb-16 md:mb-28 px-4`}>
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className={`inline-flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-[0.3em] mb-6 py-2 px-6 rounded-full ${light ? 'bg-indigo-600/10 text-indigo-600 border border-indigo-600/10' : 'bg-white/10 text-indigo-300 border border-white/10'}`}
    >
      <Icons.SparklesIcon className="w-3.5 h-3.5" /> {badge}
    </motion.div>
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`font-display text-3xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tight ${light ? 'text-indigo-950' : 'text-white'}`}
    >
      {title}
    </motion.h2>
    {subtitle && (
      <motion.p 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className={`max-w-2xl ${align === 'center' ? 'mx-auto' : ''} text-base md:text-xl font-medium leading-relaxed ${light ? 'text-slate-500' : 'text-indigo-100/60'}`}
      >
        {subtitle}
      </motion.p>
    )}
  </div>
);

const App: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(894); 
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const openCheckout = () => {
    setIsCheckoutOpen(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen flex flex-col relative selection:bg-indigo-500 selection:text-white bg-[#020617] antialiased">
      <FloatingButton onClick={openCheckout} />
      <ExitIntentModal onAccept={openCheckout} />
      <Modal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />

      {/* Header Fixo */}
      <motion.div className="sticky top-0 z-[100] bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 py-3 px-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <Icons.ShieldIcon className="w-4 h-4 text-emerald-400" />
          <span className="text-[9px] md:text-xs font-black uppercase tracking-widest opacity-80">Ambiente 100% Seguro</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/10">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="font-mono text-xs md:text-sm font-black text-white tabular-nums">{formatTime(timeLeft)}</span>
          </div>
        </div>
      </motion.div>

      {/* Hero Section */}
      <section className="relative pt-12 md:pt-28 pb-20 md:pb-40 px-6 overflow-hidden mesh-gradient">
        <BackgroundStars />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-transparent to-[#020617] z-0" />
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 glass-card px-5 py-2 rounded-full mb-10 border border-white/10 shadow-[0_0_30px_rgba(129,140,248,0.15)]"
          >
            <Icons.MoonIcon className="w-4 h-4 text-amber-300" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-200">A Hora de Dormir virou Magia</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black text-white leading-[1.05] md:leading-[0.95] mb-12 tracking-tighter text-glow"
          >
            Deixe as Telas de Lado <br className="hidden md:block" />
            e Crie <span className="text-amber-300 italic">Noites de Magia</span> <span className="text-[#c7d2fe]">e Conexão Real.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto text-base md:text-2xl text-indigo-100/70 font-medium leading-relaxed mb-16 px-4"
          >
            Transforme o caos da noite no momento mais doce do dia. Histórias desenhadas para <span className="text-white font-black">acalmar o sistema nervoso</span> e criar memórias que duram para sempre — sem luz azul, sem agitação.
          </motion.p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 items-center mb-24 max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="lg:col-span-7 relative group mx-auto w-full"
            >
              <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500/30 to-purple-400/20 rounded-[2.5rem] md:rounded-[3.5rem] blur-2xl" />
              <div className="relative bg-[#020617] rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden border border-white/10 shadow-2xl">
                <MiniVSL onPlay={openCheckout} />
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-5 flex flex-col gap-8"
            >
              <div className="glass-card p-8 md:p-10 rounded-[2.5rem] text-left border border-white/10 relative overflow-hidden flex flex-col justify-center h-full">
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => <Icons.StarIcon key={i} className="w-4 h-4 text-amber-400" />)}
                </div>
                <p className="text-indigo-100/90 text-lg md:text-xl leading-relaxed font-medium italic mb-8">
                  "Eu não acreditava que ele dormiria sem o tablet. Hoje, as histórias são o ponto alto do dia. Ele relaxa em minutos."
                </p>
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-full border-2 border-indigo-400/30 overflow-hidden shadow-lg">
                      <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop" alt="User" />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-xs font-black text-white uppercase tracking-wider">Juliana Rocha</span>
                      <span className="text-[10px] font-bold text-indigo-300 uppercase opacity-60">Mãe do Theo (4 anos)</span>
                   </div>
                </div>
              </div>
              
              <AudioPreview />
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center gap-10"
          >
            <Button onClick={openCheckout} variant="secondary" pulse className="w-full md:w-auto px-12 md:px-24 py-8 md:py-10 text-xl md:text-4xl rounded-3xl shadow-[0_0_80px_rgba(251,191,36,0.25)]">
              SIM! QUERO NOITES DE PAZ
            </Button>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
               <div className="flex items-center gap-2 text-white font-black text-[10px] uppercase tracking-widest">
                 <Icons.ShieldIcon className="w-6 h-6" /> Garantia de 7 Dias
               </div>
               <div className="flex items-center gap-2 text-white font-black text-[10px] uppercase tracking-widest">
                 <Icons.ZapIcon className="w-6 h-6" /> Acesso Imediato
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Seção de Dor: A Verdade Silenciosa */}
      <section className="py-24 md:py-40 bg-[#020617] px-6 relative border-t border-white/5 overflow-hidden">
        {/* Decorative elements for 'pain' section */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[120px] -z-0 pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <SectionHeader 
            badge="A Realidade Silenciosa" 
            title={<>Você Também Sente que a <span className="text-red-500 italic">Noite virou uma Batalha?</span></>}
            subtitle="O cansaço que você sente não é falta de sorte. É o resultado de um sistema desenhado para manter nossos filhos acordados."
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            {PAIN_POINTS.map((point, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, boxShadow: '0 0 30px rgba(239, 68, 68, 0.15)' }}
                className="glass-card p-12 rounded-[3rem] border border-white/10 hover:border-red-500/30 transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-red-500/20 group-hover:bg-red-500 transition-colors" />
                <div className="w-16 h-16 bg-red-500/10 text-red-400 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                   {point.icon === 'alert' && <Icons.AlertIcon className="w-8 h-8" />}
                   {point.icon === 'broken-heart' && <Icons.BrokenHeartIcon className="w-8 h-8" />}
                   {point.icon === 'battery' && <Icons.BatteryIcon className="w-8 h-8" />}
                </div>
                <h3 className="text-2xl font-black text-white mb-5 uppercase tracking-tight">{point.title}</h3>
                <p className="text-indigo-100/50 text-base leading-relaxed">{point.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Comparativo de Impacto */}
          <div className="glass-card rounded-[4rem] p-8 md:p-16 border border-white/5 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h3 className="text-3xl md:text-5xl font-display font-black text-white mb-8 leading-tight">
                  O Efeito no <span className="text-amber-300">Cérebro da Criança</span>
                </h3>
                <div className="space-y-6">
                  {COMPARISON.map((item, idx) => (
                    <div key={idx} className="flex flex-col gap-2 border-b border-white/5 pb-4">
                      <span className="text-indigo-400 font-black text-[10px] uppercase tracking-widest">{item.item}</span>
                      <div className="flex flex-col md:flex-row gap-4 justify-between">
                        <span className="text-red-400/70 font-medium text-sm">Telas: {item.screens}</span>
                        <span className="text-emerald-400 font-bold text-sm">Histórias: {item.method}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white/5 rounded-[3rem] p-8 md:p-12 border border-white/10 text-center relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl" />
                <Icons.AlertIcon className="w-16 h-16 text-red-500 mx-auto mb-8 opacity-40" />
                <p className="text-xl md:text-2xl text-indigo-100/80 font-medium leading-relaxed italic">
                  "O uso de telas antes de dormir não apenas agita; ele 'engana' o cérebro fazendo-o acreditar que ainda é dia."
                </p>
                <div className="mt-10 pt-10 border-t border-white/5">
                   <p className="text-indigo-400 font-black text-xs uppercase tracking-widest">A solução não é proibir, mas substituir.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Biblioteca de Histórias */}
      <section className="py-24 md:py-40 bg-[#020617] relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <SectionHeader 
            badge="O Seu Novo Ritual" 
            title="10 Jornadas de Calma e Afeto"
            subtitle="Imagine trocar o estresse do celular pela voz que seu filho mais ama no mundo: a sua."
          />
          <ProductMockup />
          <div className="mt-20">
             <Button onClick={openCheckout} variant="secondary" className="px-20 py-9 text-2xl md:text-3xl">RESERVAR MINHA CÓPIA AGORA</Button>
          </div>
        </div>
      </section>

      {/* Prova Social */}
      <section className="py-24 md:py-40 bg-white px-6">
         <div className="max-w-6xl mx-auto text-center">
            <SectionHeader 
              badge="O Que Dizem os Pais" 
              title="Famílias que Voltaram a Sonhar"
              light
            />
            <TestimonialCarousel />
         </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-white px-6 border-t border-slate-100">
        <div className="max-w-3xl mx-auto">
          <SectionHeader 
            badge="Dúvidas" 
            title="Perguntas Frequentes"
            light
          />
          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <motion.div 
                key={index}
                className="rounded-[2.5rem] bg-slate-50 border border-slate-100 overflow-hidden"
              >
                <button 
                  onClick={() => setOpenFaq(openFaq === index ? null : index)} 
                  className="w-full p-8 md:p-10 text-left flex justify-between items-center group"
                >
                  <span className="font-black text-indigo-950 text-base md:text-xl uppercase tracking-tight group-hover:text-indigo-600 transition-colors">{faq.question}</span>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${openFaq === index ? 'bg-indigo-600 text-white rotate-180' : 'bg-white text-indigo-200'}`}>
                    <Icons.ChevronDownIcon className="w-6 h-6" />
                  </div>
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }} 
                      animate={{ height: 'auto', opacity: 1 }} 
                      exit={{ height: 0, opacity: 0 }} 
                      className="px-10 pb-10 text-slate-500 font-medium text-lg"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-16 bg-[#020617] text-center border-t border-white/5">
        <div className="max-w-xl mx-auto px-6 mb-10">
          <Icons.MoonIcon className="w-10 h-10 text-indigo-500 mx-auto mb-6" />
          <p className="text-indigo-100/30 text-xs font-medium leading-relaxed">
            As histórias contidas neste material são recursos lúdicos e educativos para auxiliar no relaxamento noturno. Não substituem orientações médicas em casos de distúrbios crônicos do sono.
          </p>
        </div>
        <p className="text-[10px] text-indigo-100/20 font-black uppercase tracking-[0.6em]">
          © 2024 10 Histórias para Sonhar • Todos os Direitos Reservados
        </p>
      </footer>
    </div>
  );
};

export default App;