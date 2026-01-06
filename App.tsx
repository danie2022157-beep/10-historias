
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './components/Button';
import { Modal } from './components/Modal';
import { FloatingButton } from './components/FloatingButton';
import { ProductMockup } from './components/ProductMockup';
import { TestimonialCarousel } from './components/TestimonialCarousel';
import { MiniVSL } from './components/MiniVSL';
import { ExitIntentModal } from './components/ExitIntentModal';
import { FAQS, PAIN_POINTS, BONUSES } from './constants';
import * as Icons from './components/Icons';

const BackgroundParticles = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {[...Array(20)].map((_, i) => (
      <div 
        key={i} 
        className="sparkle" 
        style={{ 
          top: `${Math.random() * 100}%`, 
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${3 + Math.random() * 4}s`
        }} 
      />
    ))}
  </div>
);

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1200);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen flex flex-col relative selection:bg-indigo-500 selection:text-white overflow-x-hidden bg-white">
      <FloatingButton onClick={() => setIsModalOpen(true)} />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <ExitIntentModal onAccept={() => setIsModalOpen(true)} />

      {/* Top Countdown Banner */}
      <motion.div className="sticky top-0 z-[100] bg-indigo-950/90 backdrop-blur-lg text-white py-3 px-4 text-center font-black text-[10px] md:text-sm flex items-center justify-center gap-3 border-b border-white/10 shadow-xl">
        <Icons.SparklesIcon className="w-4 h-4 text-amber-400 animate-pulse" />
        <span className="tracking-widest">OFERTA ESPECIAL EXPIRA EM: <span className="text-amber-300 font-mono text-xs md:text-lg">{formatTime(timeLeft)}</span></span>
        <Icons.SparklesIcon className="w-4 h-4 text-amber-400 animate-pulse" />
      </motion.div>

      {/* Hero Section - Soft Night & Pastel Theme */}
      <section className="relative pt-24 md:pt-40 pb-32 md:pb-60 px-4 text-center overflow-hidden" 
               style={{ background: 'radial-gradient(circle at 50% 0%, #eef2ff 0%, #e0e7ff 40%, #c7d2fe 100%)' }}>
        
        {/* Camadas de cor Azul Noturno Suave */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" 
             style={{ background: 'radial-gradient(circle at 100% 100%, #4f46e5 0%, transparent 50%)' }} />
        
        <BackgroundParticles />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2.5 bg-white/60 backdrop-blur-md text-indigo-900 px-8 py-3 rounded-full text-xs md:text-base font-black mb-12 border border-white shadow-sm"
          >
            <Icons.StarIcon className="w-4 h-4 text-amber-500" /> +5.000 FAMÍLIAS DORMINDO MELHOR
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-5xl sm:text-7xl md:text-9xl lg:text-[10rem] font-black text-indigo-950 leading-[0.9] mb-10 tracking-tighter"
          >
            Deixe as Telas de Lado <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-400 to-indigo-800 text-glow">e Crie Já.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-3xl text-indigo-900/70 mb-20 max-w-4xl mx-auto font-medium leading-relaxed"
          >
            Transforme o caos da hora de dormir em um momento de conexão pura. <br className="hidden md:block" />
            Recupere suas noites com o <span className="font-black text-indigo-700 underline decoration-amber-400 underline-offset-8">Método de Neuro-Encantamento.</span>
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-32 shadow-[0_60px_120px_-30px_rgba(79,70,229,0.2)] rounded-[4rem] overflow-hidden border-8 border-white bg-indigo-950"
          >
            <MiniVSL onPlay={() => setIsModalOpen(true)} />
          </motion.div>

          <div className="flex flex-col items-center">
            <Button 
              pulse 
              onClick={() => setIsModalOpen(true)}
              variant="secondary"
              className="text-2xl md:text-5xl px-16 md:px-32 py-10 md:py-16 rounded-[2.5rem] md:rounded-full shadow-2xl"
            >
              SIM! QUERO ESSA BIBLIOTECA
            </Button>
            <p className="mt-8 text-indigo-400 font-bold text-sm uppercase tracking-widest flex items-center gap-2">
              <Icons.ShieldIcon className="w-4 h-4" /> Pagamento 100% Seguro & Acesso Imediato
            </p>
          </div>
        </div>
      </section>

      {/* Pain Section */}
      <section className="py-40 md:py-64 mesh-dark text-white px-4 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div>
              <motion.span className="text-red-500 font-black uppercase tracking-[0.6em] text-xs mb-8 block">O Alerta que Ninguém Te Dá</motion.span>
              <h2 className="text-5xl md:text-8xl font-display font-black mb-12 leading-tight">Você está perdendo o que há <br/> <span className="text-red-500">de mais precioso.</span></h2>
              <div className="space-y-8">
                {PAIN_POINTS.map((point, i) => (
                  <div key={i} className="flex gap-8 p-8 md:p-10 glass rounded-[3rem] border border-white/5 hover:border-red-500/20 transition-all duration-500">
                    <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
                      {point.icon === 'alert' && <Icons.AlertIcon className="w-10 h-10" />}
                      {point.icon === 'broken-heart' && <Icons.BrokenHeartIcon className="w-10 h-10" />}
                      {point.icon === 'battery' && <Icons.BatteryIcon className="w-10 h-10" />}
                    </div>
                    <div>
                      <h4 className="text-2xl font-black mb-3 text-white uppercase tracking-tight">{point.title}</h4>
                      <p className="text-slate-400 text-base md:text-xl leading-relaxed font-medium">{point.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} className="glass border border-white/10 p-16 md:p-24 rounded-[5rem] shadow-2xl text-center relative z-10 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 to-pink-500" />
                <Icons.SparklesIcon className="w-20 h-20 text-amber-400 mx-auto mb-12" />
                <h3 className="text-4xl md:text-6xl font-display font-black text-amber-300 mb-12">A Ciência do Encantamento</h3>
                <p className="text-indigo-50 text-2xl md:text-3xl font-medium leading-relaxed italic mb-16 opacity-80">"O sono não é um interruptor que você desliga, é um jardim que você cultiva."</p>
                <Button onClick={() => setIsModalOpen(true)} variant="secondary" className="w-full py-10 text-2xl rounded-3xl">MUDAR MINHA REALIDADE</Button>
              </motion.div>
              <div className="absolute -inset-10 bg-indigo-500/20 blur-[150px] -z-10 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section className="py-40 md:py-64 bg-white px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <motion.span className="text-indigo-600 font-black uppercase tracking-[0.5em] text-xs mb-8 block">Sua Nova Rotina Mágica</motion.span>
            <h2 className="text-5xl md:text-9xl font-display font-black text-indigo-950 mb-12 leading-[0.85]">Explore a sua <br/> <span className="text-indigo-600">Biblioteca Mágica.</span></h2>
            <p className="text-slate-500 max-w-4xl mx-auto text-xl md:text-3xl font-medium">Gire a coleção e descubra o poder das histórias desenhadas para o sono profundo.</p>
          </div>
          
          <ProductMockup />
          
          <div className="text-center mt-40">
             <Button onClick={() => setIsModalOpen(true)} className="text-2xl md:text-4xl px-20 py-10 rounded-full">QUERO TODAS AS HISTÓRIAS</Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-40 md:py-64 bg-indigo-50/50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
           <h2 className="text-5xl md:text-8xl font-display font-black text-indigo-950 mb-20 leading-tight">Milhares de Mães <br/> <span className="text-indigo-600">Descansadas e Felizes</span></h2>
           <TestimonialCarousel />
        </div>
      </section>

      {/* Bonus Section */}
      <section className="py-40 md:py-64 bg-white px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-indigo-950 rounded-[5rem] p-16 md:p-32 text-white relative overflow-hidden shadow-2xl">
            <h2 className="text-4xl md:text-7xl font-display font-black mb-20 relative z-10 leading-tight">Garantindo HOJE você <br/> <span className="text-amber-400">leva 2 presentes exclusivos:</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
              {BONUSES.map((bonus, i) => (
                <div key={i} className="glass border border-white/10 p-12 rounded-[4rem] hover:bg-white/10 transition-colors duration-500">
                  <div className="w-20 h-20 bg-amber-400 text-indigo-950 rounded-3xl flex items-center justify-center mb-10 shadow-2xl">
                    {bonus.icon === 'moon' ? <Icons.MoonIcon className="w-12 h-12" /> : <Icons.PaletteIcon className="w-12 h-12" />}
                  </div>
                  <h3 className="text-3xl font-black mb-6 uppercase tracking-tight">{bonus.title}</h3>
                  <p className="text-indigo-100 text-lg md:text-2xl mb-12 font-medium leading-relaxed opacity-80">{bonus.description}</p>
                  <div className="flex items-center gap-6">
                    <span className="text-white/30 line-through text-xl font-bold">Valor: {bonus.value}</span>
                    <span className="bg-amber-400 text-indigo-950 text-xs font-black px-6 py-2.5 rounded-full shadow-lg">GRÁTIS HOJE</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-pink-500/10 rounded-full blur-[100px]" />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-40 md:py-64 bg-white px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-display font-black text-center mb-24 text-indigo-950">Dúvidas Frequentes</h2>
          <div className="space-y-8 mb-40">
            {FAQS.map((faq, index) => (
              <div key={index} className="rounded-[3rem] bg-slate-50 overflow-hidden border-2 border-slate-100 transition-all hover:border-indigo-200">
                <button 
                  onClick={() => setOpenFaq(openFaq === index ? null : index)} 
                  className="w-full p-10 md:p-12 text-left flex justify-between items-center group gap-8"
                >
                  <span className="font-black text-xl md:text-3xl text-indigo-950 leading-tight">{faq.question}</span>
                  <Icons.ChevronDownIcon className={`w-8 h-8 text-slate-400 transition-transform duration-500 ${openFaq === index ? 'rotate-180 text-indigo-600' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }} 
                      animate={{ height: 'auto', opacity: 1 }} 
                      exit={{ height: 0, opacity: 0 }} 
                      className="px-10 md:px-12 pb-12 text-slate-500 text-lg md:text-2xl font-medium leading-relaxed"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className="text-center p-16 md:p-32 bg-gradient-to-br from-indigo-700 to-indigo-950 rounded-[5rem] text-white shadow-2xl relative overflow-hidden">
             <h3 className="text-4xl md:text-7xl font-display font-black mb-10 leading-tight">Pronta para sua primeira <br/> noite de paz profunda?</h3>
             <p className="text-indigo-100 text-xl md:text-3xl mb-16 font-medium">Acesso vitalício imediato e garantia total de 7 dias.</p>
             <Button 
               variant="secondary" 
               pulse 
               onClick={() => setIsModalOpen(true)} 
               className="w-full text-3xl md:text-5xl py-12 md:py-16 rounded-full"
             >
               SIM! QUERO COMEÇAR HOJE
             </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-40 bg-[#020617] text-slate-400 text-center text-sm px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-center gap-12 mb-16 opacity-40 font-black uppercase tracking-[0.3em] text-[10px] md:text-xs">
            <a href="#" className="hover:text-white transition-colors">Segurança</a>
            <a href="#" className="hover:text-white transition-colors">Privacidade</a>
            <a href="#" className="hover:text-white transition-colors">Termos</a>
          </div>
          <p className="mb-8 text-lg">© 2024 10 Histórias para Sonhar. Momentos Mágicos em Família.</p>
          <p className="opacity-30 italic max-w-2xl mx-auto leading-relaxed">Este produto é um recurso educativo para apoio à rotina familiar. Resultados podem variar. Consulte sempre um profissional de saúde se necessário.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
