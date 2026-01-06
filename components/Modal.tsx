
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import * as Icons from './Icons';
import { STORIES } from '../constants';

interface ModalProps { isOpen: boolean; onClose: () => void; }

type Step = 'info' | 'payment' | 'processing' | 'success';
type PaymentMethod = 'credit_card' | 'debit_card' | 'pix';

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<Step>('info');
  const [loadingMessage, setLoadingMessage] = useState('Processando...');
  const [pixTimeLeft, setPixTimeLeft] = useState(1800);
  const [isCopied, setIsCopied] = useState(false);
  const [cardBrand, setCardBrand] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const mpRef = useRef<any>(null);

  // User Data
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [cpf, setCpf] = useState('');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
  const [pixCode, setPixCode] = useState<string | null>(null);
  
  // Card Data
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVC, setCardCVC] = useState('');
  const [cardHolder, setCardHolder] = useState('');

  const VALUE = "19,90";
  // Public Key real para inicialização do SDK (Exemplo)
  const PUBLIC_KEY = "APP_USR-7e47a541-0536-407b-8913-6447c20c430e";

  useEffect(() => {
    if (isOpen && (window as any).MercadoPago) {
      if (!mpRef.current) {
        mpRef.current = new (window as any).MercadoPago(PUBLIC_KEY, {
          locale: 'pt-BR'
        });
      }
    }
  }, [isOpen]);

  useEffect(() => {
    let timer: number;
    if (pixCode && pixTimeLeft > 0) {
      timer = window.setInterval(() => {
        setPixTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [pixCode, pixTimeLeft]);

  // Detector de bandeira real via Mercado Pago SDK
  useEffect(() => {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    if (cleanNumber.length >= 6 && mpRef.current) {
      mpRef.current.getPaymentMethods({ bin: cleanNumber.substring(0, 6) })
        .then((res: any) => {
          if (res && res.length > 0) {
            setCardBrand(res[0].thumbnail);
          }
        })
        .catch(() => setCardBrand(null));
    } else if (cleanNumber.length < 6) {
      setCardBrand(null);
    }
  }, [cardNumber]);

  const handleNextToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !cpf || !whatsapp) return;
    setStep('payment');
  };

  const handleCopyCode = () => {
    if (pixCode) {
      navigator.clipboard.writeText(pixCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const processPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError(null);
    setStep('processing');
    
    const messages = [
      "Criptografando dados...",
      "Validando token do cartão...",
      "Processando com o banco...",
      "Gerando seu acesso..."
    ];

    let msgIndex = 0;
    const interval = setInterval(() => {
      if (msgIndex < messages.length) {
        setLoadingMessage(messages[msgIndex]);
        msgIndex++;
      }
    }, 800);

    try {
      if (paymentMethod === 'pix') {
        // Simulação de chamada de API para gerar Pix
        await new Promise(r => setTimeout(r, 1500));
        setPixCode("00020126580014BR.GOV.BCB.PIX0136d859424d-625d-4581-9f32-057432b4b005520400005303986540519.905802BR5925SISTEMA_MAGIC6009SAO_PAULO62070503***6304E2D1");
        setStep('payment');
      } else {
        // FLUXO DE TOKENIZAÇÃO REAL (MERCADO PAGO)
        const [expirationMonth, expirationYear] = cardExpiry.split('/');
        
        try {
          const cardTokenResponse = await mpRef.current.createCardToken({
            cardNumber: cardNumber.replace(/\s/g, ''),
            cardholderName: cardHolder,
            cardExpirationMonth: expirationMonth,
            cardExpirationYear: "20" + expirationYear,
            securityCode: cardCVC,
            identificationType: "CPF",
            identificationNumber: cpf.replace(/\D/g, ''),
          });

          // Aqui você enviaria o cardTokenResponse.id para o seu BACKEND
          console.log("Token gerado:", cardTokenResponse.id);
          
          // Simulação de resposta do backend
          await new Promise(r => setTimeout(r, 2000));
          setStep('success');
        } catch (mpError: any) {
          console.error("Erro na tokenização:", mpError);
          throw new Error("Cartão inválido ou recusado. Verifique os dados.");
        }
      }
    } catch (error: any) {
      setPaymentError(error.message || "Erro ao processar pagamento.");
      setStep('payment');
    } finally {
      clearInterval(interval);
    }
  };

  const resetModal = () => {
    if (step === 'processing') return;
    onClose();
    setTimeout(() => {
      setStep('info');
      setPixCode(null);
      setPixTimeLeft(1800);
      setCardBrand(null);
      setPaymentError(null);
    }, 300);
  };

  const formatCPF = (val: string) => val.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4").substring(0, 14);
  const formatPhone = (val: string) => val.replace(/\D/g, '').replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3").substring(0, 15);
  const formatCard = (val: string) => val.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, "$1 ").substring(0, 19);

  const ProductStack = () => (
    <div className="relative h-28 md:h-44 w-full flex items-center justify-center my-6">
      {[STORIES[2].imageUrl, STORIES[1].imageUrl, STORIES[0].imageUrl].map((img, idx) => (
        <motion.div
          key={idx}
          initial={{ rotate: 0, scale: 0.8, opacity: 0 }}
          animate={{ 
            rotate: idx === 0 ? 15 : idx === 1 ? -15 : 0,
            x: idx === 0 ? 40 : idx === 1 ? -40 : 0,
            scale: idx === 2 ? 1 : 0.8,
            opacity: 1,
            y: idx === 2 ? 0 : 10
          }}
          whileHover={idx === 2 ? { 
            scale: 1.1, 
            rotate: -2,
            y: -10,
            transition: { type: "spring", stiffness: 300 } 
          } : {}}
          className="absolute w-20 md:w-32 aspect-[3/4] rounded-xl overflow-hidden shadow-2xl border-2 border-white/40 bg-indigo-900 z-10"
          style={{ zIndex: idx === 2 ? 30 : idx === 1 ? 20 : 10 }}
        >
          <img src={img} className="w-full h-full object-cover" alt="Livro" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </motion.div>
      ))}
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4 overflow-y-auto bg-indigo-950/98 backdrop-blur-3xl">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={resetModal} className="fixed inset-0" />
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 50 }}
            className="relative bg-white md:rounded-[3.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.7)] max-w-5xl w-full overflow-hidden flex flex-col min-h-screen md:min-h-0 z-10 border-t-8 border-indigo-600"
          >
            {step !== 'processing' && (
              <button onClick={resetModal} className="absolute top-5 right-5 md:top-8 md:right-8 w-12 h-12 flex items-center justify-center rounded-full bg-slate-100/80 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all z-[120] shadow-sm">
                <Icons.XIcon className="w-6 h-6" />
              </button>
            )}

            <div className="flex flex-col md:flex-row flex-grow">
              {/* Lado Esquerdo - Info do Produto (Otimizado Mobile) */}
              <div className="md:w-[35%] bg-indigo-950 p-8 md:p-14 flex flex-col items-center justify-center text-center relative overflow-hidden shrink-0">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500 via-transparent to-transparent" />
                
                <div className="relative z-10 w-full space-y-6">
                  <motion.div 
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="bg-amber-400 text-indigo-950 px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] inline-block shadow-xl"
                  >
                    Liberação Imediata
                  </motion.div>
                  
                  <h4 className="font-display font-black text-white text-2xl md:text-4xl leading-tight">Sua Biblioteca <br/><span className="text-amber-400">Encantada</span></h4>
                  
                  <ProductStack />

                  <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 max-w-[260px] mx-auto shadow-inner">
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Total:</p>
                    <div className="flex items-center justify-center gap-2">
                       <span className="text-white/20 text-lg line-through font-bold">R$ 97</span>
                       <p className="text-amber-400 text-3xl md:text-4xl font-display font-black">R$ {VALUE}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lado Direito - Checkout Real */}
              <div className="flex-grow p-8 md:p-16 bg-white overflow-y-auto">
                <AnimatePresence mode="wait">
                  {step === 'processing' ? (
                    <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full text-center py-20">
                      <div className="relative w-24 h-24 mb-10">
                        <div className="absolute inset-0 border-8 border-slate-50 rounded-full" />
                        <div className="absolute inset-0 border-8 border-indigo-600 rounded-full border-t-transparent animate-spin" />
                      </div>
                      <h3 className="text-2xl md:text-3xl font-display font-black text-indigo-950 mb-4">{loadingMessage}</h3>
                      <p className="text-slate-400 text-sm font-medium">Ambiente seguro verificado por Mercado Pago.</p>
                    </motion.div>
                  ) : step === 'info' ? (
                    <motion.form key="info" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={handleNextToPayment} className="space-y-8 max-w-lg mx-auto md:mx-0">
                      <div>
                        <h3 className="text-3xl md:text-4xl font-display font-black text-indigo-950 mb-2 tracking-tight">Onde enviamos seu acesso?</h3>
                        <p className="text-slate-400 text-sm font-medium">Você receberá o link de download por E-mail e WhatsApp.</p>
                      </div>

                      <div className="space-y-5">
                        <div className="relative">
                          <label className="absolute left-6 -top-2 bg-white px-2 text-[9px] font-black text-indigo-600 uppercase tracking-widest z-10">Nome Completo</label>
                          <input required type="text" placeholder="Como no documento" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-7 py-5 focus:border-indigo-400 focus:bg-white outline-none font-bold text-indigo-950 transition-all placeholder:text-slate-300" value={name} onChange={e => setName(e.target.value)} />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="relative">
                            <label className="absolute left-6 -top-2 bg-white px-2 text-[9px] font-black text-indigo-600 uppercase tracking-widest z-10">E-mail</label>
                            <input required type="email" placeholder="seu@email.com" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-7 py-5 focus:border-indigo-400 focus:bg-white outline-none font-bold text-indigo-950 transition-all placeholder:text-slate-300" value={email} onChange={e => setEmail(e.target.value)} />
                          </div>
                          <div className="relative">
                            <label className="absolute left-6 -top-2 bg-white px-2 text-[9px] font-black text-indigo-600 uppercase tracking-widest z-10">WhatsApp</label>
                            <input required type="tel" placeholder="(00) 00000-0000" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-7 py-5 focus:border-indigo-400 focus:bg-white outline-none font-bold text-indigo-950 transition-all placeholder:text-slate-300" value={whatsapp} onChange={e => setWhatsapp(formatPhone(e.target.value))} />
                          </div>
                        </div>

                        <div className="relative">
                          <label className="absolute left-6 -top-2 bg-white px-2 text-[9px] font-black text-indigo-600 uppercase tracking-widest z-10">CPF</label>
                          <input required type="text" placeholder="000.000.000-00" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-7 py-5 focus:border-indigo-400 focus:bg-white outline-none font-bold text-indigo-950 transition-all placeholder:text-slate-300" value={cpf} onChange={e => setCpf(formatCPF(e.target.value))} />
                        </div>
                      </div>

                      <Button type="submit" variant="secondary" pulse className="w-full py-8 rounded-[2.5rem] text-xl font-black shadow-2xl">AVANÇAR PARA O PAGAMENTO</Button>
                      
                      <div className="flex items-center justify-center gap-8 opacity-30 grayscale pt-4">
                         <img src="https://logodownload.org/wp-content/uploads/2014/07/visa-logo-1.png" className="h-4" />
                         <img src="https://logodownload.org/wp-content/uploads/2014/07/mastercard-logo-7.png" className="h-6" />
                         <img src="https://logodownload.org/wp-content/uploads/2020/02/pix-logo-1.png" className="h-5" />
                      </div>
                    </motion.form>
                  ) : step === 'payment' ? (
                    <motion.form key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={processPayment} className="space-y-8 max-w-lg mx-auto md:mx-0">
                      {pixCode ? (
                        <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500">
                           <div className="inline-flex items-center gap-3 bg-indigo-50 text-indigo-600 px-5 py-2 rounded-full font-black text-[10px] uppercase tracking-widest">
                             <Icons.TimerIcon className="w-4 h-4" /> Expira em: {Math.floor(pixTimeLeft / 60)}:{(pixTimeLeft % 60).toString().padStart(2, '0')}
                           </div>
                           
                           <div className="bg-white p-6 rounded-[3rem] border border-slate-100 shadow-3xl inline-block relative group">
                             <img 
                               src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(pixCode)}`} 
                               className="w-48 h-48 md:w-64 md:h-64"
                               alt="Pix QR Code"
                             />
                             <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-5 py-2 rounded-full text-[9px] font-black uppercase shadow-xl">Escaneie no seu Banco</div>
                           </div>

                           <div className="space-y-4">
                             <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Ou copie o código Pix abaixo</p>
                             <div 
                               onClick={handleCopyCode}
                               className={`bg-slate-50 p-6 rounded-3xl border-2 border-dashed transition-all cursor-pointer relative overflow-hidden ${isCopied ? 'border-green-400 bg-green-50' : 'border-indigo-100 hover:border-indigo-400'}`}
                             >
                               <p className="text-[10px] font-mono font-bold text-slate-500 break-all leading-relaxed">
                                 {pixCode.substring(0, 80)}...
                               </p>
                               <div className="mt-4 text-indigo-600 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                                 {isCopied ? <><Icons.ShieldIcon className="w-4 h-4 text-green-500" /> COPIADO!</> : 'CLIQUE PARA COPIAR CÓDIGO'}
                               </div>
                             </div>
                           </div>
                           
                           <div className="flex flex-col items-center gap-2 pt-4">
                             <Icons.ShieldIcon className="w-8 h-8 text-green-500" />
                             <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest">Pagamento Processado via Mercado Pago</p>
                           </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex flex-col gap-4">
                            <h3 className="text-2xl font-display font-black text-indigo-950">Escolha o método</h3>
                            <div className="grid grid-cols-3 gap-3">
                              {[
                                { id: 'credit_card', icon: <Icons.CreditCardIcon />, label: 'Crédito' },
                                { id: 'debit_card', icon: <Icons.BankIcon />, label: 'Débito' },
                                { id: 'pix', icon: <Icons.PixIcon />, label: 'Pix' }
                              ].map(method => (
                                <button
                                  key={method.id}
                                  type="button"
                                  onClick={() => { setPaymentMethod(method.id as any); setPaymentError(null); }}
                                  className={`flex flex-col items-center gap-3 p-5 rounded-[2rem] border-2 transition-all ${
                                    paymentMethod === method.id 
                                    ? 'border-indigo-600 bg-indigo-50 text-indigo-600 shadow-lg' 
                                    : 'border-slate-50 text-slate-400 hover:border-slate-100'
                                  }`}
                                >
                                  <div className={`w-6 h-6 ${paymentMethod === method.id ? 'text-indigo-600' : 'text-slate-300'}`}>{method.icon}</div>
                                  <span className="text-[9px] font-black uppercase tracking-widest">{method.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          {paymentError && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold border border-red-100 animate-pulse">
                              {paymentError}
                            </div>
                          )}

                          <div className="space-y-5">
                            {paymentMethod !== 'pix' ? (
                              <div className="space-y-5 animate-in slide-in-from-bottom-5 duration-500">
                                <div className="relative">
                                  <label className="absolute left-6 -top-2 bg-white px-2 text-[8px] font-black text-indigo-600 uppercase tracking-widest z-10">Número do Cartão</label>
                                  <div className="relative">
                                    <input required type="text" placeholder="0000 0000 0000 0000" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-7 py-5 focus:border-indigo-400 outline-none font-bold text-indigo-950 pr-16" value={cardNumber} onChange={e => setCardNumber(formatCard(e.target.value))} />
                                    {cardBrand && (
                                      <motion.img initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} src={cardBrand} className="absolute right-5 top-1/2 -translate-y-1/2 h-8 object-contain" alt="Bandeira" />
                                    )}
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                  <div className="relative">
                                    <label className="absolute left-6 -top-2 bg-white px-2 text-[8px] font-black text-indigo-600 uppercase tracking-widest z-10">Validade</label>
                                    <input required type="text" placeholder="MM/AA" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-7 py-5 focus:border-indigo-400 outline-none font-bold text-indigo-950" value={cardExpiry} onChange={e => setCardExpiry(e.target.value.replace(/\D/g, '').replace(/(\d{2})(\d{2})/, "$1/$2").substring(0, 5))} />
                                  </div>
                                  <div className="relative">
                                    <label className="absolute left-6 -top-2 bg-white px-2 text-[8px] font-black text-indigo-600 uppercase tracking-widest z-10">CVC</label>
                                    <input required type="text" placeholder="123" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-7 py-5 focus:border-indigo-400 outline-none font-bold text-indigo-950" value={cardCVC} onChange={e => setCardCVC(e.target.value.replace(/\D/g, '').substring(0, 4))} />
                                  </div>
                                </div>
                                <div className="relative">
                                  <label className="absolute left-6 -top-2 bg-white px-2 text-[8px] font-black text-indigo-600 uppercase tracking-widest z-10">Nome no Cartão</label>
                                  <input required type="text" placeholder="Como impresso no cartão" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-7 py-5 focus:border-indigo-400 outline-none font-bold text-indigo-950 uppercase" value={cardHolder} onChange={e => setCardHolder(e.target.value)} />
                                </div>
                              </div>
                            ) : (
                              <div className="bg-amber-50 rounded-[2.5rem] p-8 md:p-12 border-2 border-amber-200 border-dashed text-center">
                                <Icons.ZapIcon className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                                <h4 className="font-display font-black text-indigo-950 text-xl">Liberação Imediata</h4>
                                <p className="text-amber-800/70 text-sm font-medium leading-relaxed">O Pix é processado na hora. Você recebe seu material no seu WhatsApp e E-mail em segundos.</p>
                              </div>
                            )}
                          </div>

                          <div className="pt-4">
                            <Button type="submit" variant="secondary" pulse className="w-full py-8 rounded-[2.5rem] text-xl font-black uppercase tracking-widest shadow-3xl">
                              {paymentMethod === 'pix' ? 'GERAR QR CODE PIX' : 'FINALIZAR PAGAMENTO AGORA'}
                            </Button>
                          </div>
                        </>
                      )}
                    </motion.form>
                  ) : (
                    <motion.div key="success" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-16 flex flex-col items-center max-w-lg mx-auto">
                      <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-10 shadow-2xl border-4 border-white">
                        <Icons.ShieldIcon className="w-12 h-12" />
                      </div>
                      <h3 className="text-4xl md:text-5xl font-display font-black text-indigo-950 mb-4 tracking-tight">Sucesso!</h3>
                      <p className="text-slate-500 text-lg md:text-xl font-medium mb-12 px-4">Seu pagamento foi aprovado. Verifique seu <span className="text-indigo-600 font-bold">E-mail</span> e <span className="text-indigo-600 font-bold">WhatsApp</span> agora!</p>
                      
                      <div className="w-full space-y-4 px-4">
                        <a href="https://drive.usercontent.com/u/0/uc?id=1wd9kT1VhDpJbi4ektutSgTJiEtBpYuCj&export=download" className="block">
                          <Button variant="secondary" pulse className="w-full py-8 rounded-3xl text-2xl font-black uppercase tracking-widest">BAIXAR MEU MATERIAL</Button>
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Selo de Garantia Desktop */}
            <div className="hidden md:flex bg-slate-50 border-t border-slate-100 p-6 items-center justify-center gap-16">
               <div className="flex items-center gap-3 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
                 <Icons.ShieldIcon className="w-4 h-4 text-green-500/50" /> 100% Criptografado
               </div>
               <div className="flex items-center gap-3 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
                 <Icons.StarIcon className="w-4 h-4 text-amber-500/50" /> 7 Dias de Garantia
               </div>
               <div className="flex items-center gap-3 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
                 <Icons.ZapIcon className="w-4 h-4 text-indigo-500/50" /> Acesso Vitalício
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
