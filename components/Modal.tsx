
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import * as Icons from './Icons';

interface ModalProps { isOpen: boolean; onClose: () => void; }

type Step = 'info' | 'payment' | 'processing' | 'pix_display' | 'success';
type PaymentMethod = 'credit_card' | 'pix';

interface PixData {
  payment_id: string;
  status: string;
  qr_code: string;
  qr_code_base64: string;
  expires_at: string;
}

declare global {
  interface Window {
    MercadoPago: any;
  }
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<Step>('info');
  const [loadingMessage, setLoadingMessage] = useState<string>('Processando...');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
  const [pixData, setPixData] = useState<PixData | null>(null);
  const [copied, setCopied] = useState(false);
  const [pixTimeRemaining, setPixTimeRemaining] = useState<string>('00:00');
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const [isSecure, setIsSecure] = useState(true);
  
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');

  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [installments, setInstallments] = useState(1);

  const BASE_VALUE = 2.00;
  const MONTHLY_INTEREST_RATE = 0.0299; 
  const PUBLIC_KEY = "APP_USR-370b4da9-36ad-4ad0-a010-8309870727d8"; 
  const WEBHOOK_URL = "https://webhook.onethy.com/webhook/lowtickt";

  // Verifica segurança da conexão (Requisito Mercado Pago)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isHttps = window.location.protocol === 'https:';
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      setIsSecure(isHttps || isLocal);
      
      if (!isHttps && !isLocal) {
        setPaymentMethod('pix');
      }
    }
  }, []);

  const maskCPF = (v: string) => v.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})/, '$1-$2').substring(0, 14);
  const maskPhone = (v: string) => v.replace(/\D/g, '').replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2').substring(0, 15);
  const maskCard = (v: string) => v.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').trim().substring(0, 19);
  const maskExpiry = (v: string) => v.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').substring(0, 5);

  const validateCPF = (cpfValue: string) => {
    const cleanCpf = cpfValue.replace(/[^\d]+/g, '');
    if (cleanCpf.length !== 11 || !!cleanCpf.match(/(\d)\1{10}/)) return false;
    let add = 0;
    for (let i = 0; i < 9; i++) add += parseInt(cleanCpf.charAt(i)) * (10 - i);
    let rev = 11 - (add % 11);
    if (rev === 10 || rev === 11) rev = 0;
    if (rev !== parseInt(cleanCpf.charAt(9))) return false;
    add = 0;
    for (let i = 0; i < 10; i++) add += parseInt(cleanCpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev === 10 || rev === 11) rev = 0;
    if (rev !== parseInt(cleanCpf.charAt(10))) return false;
    return true;
  };

  const mp = useMemo(() => {
    if (typeof window !== 'undefined' && window.MercadoPago && isOpen) {
      try {
        // Inicializa o SDK. Se não for seguro, o próprio SDK pode disparar o erro que você viu.
        return new window.MercadoPago(PUBLIC_KEY, { locale: 'pt-BR' });
      } catch (e) { 
        console.error("Erro ao inicializar Mercado Pago:", e);
        return null; 
      }
    }
    return null;
  }, [isOpen]);

  const checkPaymentStatus = useCallback(async (isManual = false) => {
    if (!pixData?.payment_id || (isCheckingPayment && !isManual)) return;
    if (isManual) setIsCheckingPayment(true);
    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'check_status',
          payment_id: pixData.payment_id,
          email: email.trim().toLowerCase()
        }),
      });
      if (response.ok) {
        const data = await response.json();
        const finalData = Array.isArray(data) ? data[0] : data;
        if (finalData && (finalData.status?.toLowerCase() === 'approved' || finalData.status?.toLowerCase() === 'authorized')) {
          setStep('success');
        }
      }
    } catch (error) { console.warn("Polling status..."); }
    finally { if (isManual) setIsCheckingPayment(false); }
  }, [pixData, email, isCheckingPayment]);

  useEffect(() => {
    let timerId: number;
    let pollingId: number;
    if (step === 'pix_display' && pixData) {
      const updateTimer = () => {
        const now = new Date().getTime();
        const expiration = new Date(pixData.expires_at).getTime();
        const diff = expiration - now;
        if (diff <= 0) setPixTimeRemaining('Expirado');
        else {
          const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const s = Math.floor((diff % (1000 * 60)) / 1000);
          setPixTimeRemaining(`${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
        }
      };
      updateTimer();
      timerId = window.setInterval(updateTimer, 1000);
      pollingId = window.setInterval(() => checkPaymentStatus(false), 5000);
    }
    return () => { clearInterval(timerId); clearInterval(pollingId); };
  }, [step, pixData, checkPaymentStatus]);

  const installmentOptions = useMemo(() => {
    const options = [];
    for (let n = 1; n <= 12; n++) {
      let pmt: number;
      if (n === 1) pmt = BASE_VALUE;
      else {
        const factor = Math.pow(1 + MONTHLY_INTEREST_RATE, n);
        pmt = (BASE_VALUE * MONTHLY_INTEREST_RATE * factor) / (factor - 1);
      }
      const roundedPmt = Math.round(pmt * 100) / 100;
      const total = parseFloat((roundedPmt * n).toFixed(2));
      options.push({ n, value: roundedPmt, total, label: `${n}x de R$ ${roundedPmt.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` });
    }
    return options;
  }, [BASE_VALUE]);

  const selectedInstallment = installmentOptions.find(opt => opt.n === installments) || installmentOptions[0];

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCPF(cpf)) {
      setPaymentError("CPF INVÁLIDO. POR FAVOR, CORRIJA.");
      return;
    }
    setPaymentError(null);
    setStep('payment');
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError(null);
    
    if (paymentMethod === 'credit_card') {
      if (!isSecure) {
        setPaymentError("ERRO: O MERCADO PAGO EXIGE HTTPS (SSL) PARA PAGAMENTOS COM CARTÃO.");
        return;
      }
      if (!cardNumber || !cardHolder || !expiry || !cvc) {
        setPaymentError("PREENCHA TODOS OS CAMPOS DO CARTÃO.");
        return;
      }
    }

    setStep('processing');
    setLoadingMessage(paymentMethod === 'pix' ? "Gerando PIX..." : "Criptografando dados do cartão...");

    let cardToken = null;
    if (paymentMethod === 'credit_card') {
      if (!mp) {
        setPaymentError("ERRO: O PROCESSADOR DE PAGAMENTOS NÃO FOI CARREGADO.");
        setStep('payment');
        return;
      }
      try {
        const parts = expiry.split('/');
        const month = parts[0]?.trim();
        let year = parts[1]?.trim();
        if (!month || !year) throw new Error("VALIDADE INVÁLIDA.");
        if (year.length === 2) year = "20" + year;

        // Gerando o token de segurança
        const tokenResponse = await mp.createCardToken({
          cardNumber: cardNumber.replace(/\D/g, ''),
          cardholderName: String(cardHolder || '').trim().toUpperCase(),
          cardExpirationMonth: month,
          cardExpirationYear: year,
          securityCode: cvc.replace(/\D/g, ''),
          identificationType: "CPF",
          identificationNumber: cpf.replace(/\D/g, ''),
        });

        if (tokenResponse.error || !tokenResponse.id) {
          throw new Error(tokenResponse.error?.message || "FALHA AO VALIDAR CARTÃO.");
        }
        
        cardToken = tokenResponse.id;

      } catch (err: any) {
        setPaymentError(err.message?.toUpperCase() || "ERRO AO PROCESSAR CARTÃO.");
        setStep('payment');
        return;
      }
    }

    // Montagem do Payload para o Webhook
    const payload = {
      customer: { 
        name: name.trim(), 
        email: email.trim().toLowerCase(), 
        phone: phone.replace(/\D/g, ''), 
        cpf: cpf.replace(/\D/g, '') 
      },
      payment: { 
        method: paymentMethod, 
        token: cardToken, 
        installments: paymentMethod === 'credit_card' ? installments : 1, 
        total_amount: paymentMethod === 'credit_card' ? selectedInstallment.total : BASE_VALUE 
      }
    };

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      const data = await response.json();
      const finalData = Array.isArray(data) ? data[0] : data;

      if (finalData?.status === 'approved' || finalData?.status === 'authorized') {
        setStep('success');
      } else if (paymentMethod === 'pix') {
        const qrCode = finalData?.point_of_interaction?.transaction_data?.qr_code || finalData?.qr_code;
        const qrCodeBase64 = finalData?.point_of_interaction?.transaction_data?.qr_code_base64 || finalData?.qr_code_base64;
        const paymentId = finalData?.id || finalData?.payment_id;
        const expiresAt = finalData?.date_of_expiration || finalData?.expires_at;

        if (qrCode || qrCodeBase64) {
          setPixData({
            payment_id: String(paymentId),
            status: finalData.status,
            qr_code: qrCode,
            qr_code_base64: qrCodeBase64,
            expires_at: expiresAt || new Date(Date.now() + 30 * 60000).toISOString()
          });
          setStep('pix_display');
        } else {
          throw new Error("ERRO AO GERAR QR CODE PIX.");
        }
      } else {
        throw new Error(finalData?.message || finalData?.status_detail || "PAGAMENTO RECUSADO.");
      }
    } catch (err: any) {
      setPaymentError(err.message?.toUpperCase() || "FALHA NA COMUNICAÇÃO COM O SERVIDOR.");
      setStep('payment');
    }
  };

  const copyPix = () => {
    if (pixData) {
      navigator.clipboard.writeText(pixData.qr_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#020617]/95 backdrop-blur-xl p-4 md:p-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0" />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 40 }} 
            animate={{ scale: 1, opacity: 1, y: 0 }} 
            exit={{ scale: 0.9, opacity: 0, y: 40 }} 
            className="relative bg-white w-full max-w-lg rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)] z-10"
          >
            
            {step !== 'success' && step !== 'processing' && (
              <div className="bg-white border-b border-slate-50 p-6 md:p-10 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">PRODUTO DIGITAL</span>
                  <h4 className="text-indigo-950 font-black text-lg md:text-xl uppercase tracking-tight">10 Histórias para Sonhar</h4>
                </div>
                <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-50 transition-colors">
                  <Icons.XIcon className="w-6 h-6 text-slate-300" />
                </button>
              </div>
            )}

            <div className="p-8 md:p-10">
              {step === 'info' && (
                <form onSubmit={handleNext} className="space-y-5">
                  <input required autoComplete="name" placeholder="Nome Completo" value={name} onChange={e => setName(e.target.value)} className="w-full px-7 py-5 rounded-2xl bg-slate-50 border border-slate-100 text-indigo-950 font-bold focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300" />
                  <input required autoComplete="email" type="email" placeholder="Seu E-mail" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-7 py-5 rounded-2xl bg-slate-50 border border-slate-100 text-indigo-950 font-bold focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300" />
                  <div className="grid grid-cols-2 gap-4">
                    <input required placeholder="CPF" value={cpf} onChange={e => setCpf(maskCPF(e.target.value))} className="w-full px-7 py-5 rounded-2xl bg-slate-50 border border-slate-100 text-indigo-950 font-bold focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300" />
                    <input required autoComplete="tel" placeholder="WhatsApp" value={phone} onChange={e => setPhone(maskPhone(e.target.value))} className="w-full px-7 py-5 rounded-2xl bg-slate-50 border border-slate-100 text-indigo-950 font-bold focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300" />
                  </div>
                  <Button type="submit" variant="secondary" className="w-full py-7 text-xl rounded-2xl !bg-[#fbbd23]">IR PARA O PAGAMENTO</Button>
                </form>
              )}

              {step === 'payment' && (
                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                  <div className="flex p-1.5 bg-slate-100 rounded-[1.5rem] mb-8">
                    <button type="button" onClick={() => setPaymentMethod('credit_card')} className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-sm transition-all ${paymentMethod === 'credit_card' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}>
                      Cartão
                    </button>
                    <button type="button" onClick={() => setPaymentMethod('pix')} className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-sm transition-all ${paymentMethod === 'pix' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}>
                      PIX
                    </button>
                  </div>

                  {paymentError && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black uppercase text-center border border-red-100 tracking-wider">
                      {paymentError}
                    </motion.div>
                  )}

                  {!isSecure && paymentMethod === 'credit_card' && (
                    <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 flex flex-col items-center gap-3 text-center">
                       <Icons.ShieldIcon className="w-10 h-10 text-amber-500" />
                       <p className="text-amber-800 text-xs font-bold leading-relaxed">
                         O pagamento via cartão está desabilitado pois sua conexão não é segura (HTTPS). 
                         <br /><span className="text-[10px] opacity-70">Em produção, com SSL ativo, funcionará normalmente.</span>
                       </p>
                       <Button onClick={() => setPaymentMethod('pix')} variant="outline" className="w-full border-amber-200 text-amber-700 bg-white py-3">USAR PIX NO LUGAR</Button>
                    </div>
                  )}

                  {paymentMethod === 'credit_card' && isSecure && (
                    <div className="space-y-4">
                      <input required placeholder="Número do Cartão" value={cardNumber} onChange={e => setCardNumber(maskCard(e.target.value))} className="w-full px-7 py-5 rounded-2xl bg-slate-50 border border-slate-100 text-indigo-950 font-bold focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300" />
                      <input required placeholder="Nome Impresso" value={cardHolder} onChange={e => setCardHolder(e.target.value)} className="w-full px-7 py-5 rounded-2xl bg-slate-50 border border-slate-100 text-indigo-950 font-bold focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300" />
                      <div className="grid grid-cols-2 gap-4">
                        <input required placeholder="Validade (MM/AA)" value={expiry} onChange={e => setExpiry(maskExpiry(e.target.value))} className="w-full px-7 py-5 rounded-2xl bg-slate-50 border border-slate-100 text-indigo-950 font-bold focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300" />
                        <input required placeholder="CVC" value={cvc} onChange={e => setCvc(e.target.value.replace(/\D/g, '').substring(0, 4))} className="w-full px-7 py-5 rounded-2xl bg-slate-50 border border-slate-100 text-indigo-950 font-bold focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300" />
                      </div>
                      <div className="relative">
                        <select value={installments} onChange={e => setInstallments(Number(e.target.value))} className="w-full px-7 py-5 rounded-2xl bg-slate-50 border border-slate-100 text-indigo-950 font-bold focus:border-indigo-500 outline-none appearance-none cursor-pointer">
                          {installmentOptions.map(opt => <option key={opt.n} value={opt.n}>{opt.label}</option>)}
                        </select>
                        <Icons.ChevronDownIcon className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 pointer-events-none" />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'pix' && (
                    <div className="text-center py-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 border-dashed">
                      <Icons.ZapIcon className="w-14 h-14 text-indigo-600 mx-auto mb-5" />
                      <p className="text-slate-500 font-bold text-sm px-10">O eBook será liberado imediatamente após a confirmação do PIX.</p>
                    </div>
                  )}
                  
                  <Button 
                    type="submit" 
                    variant="secondary" 
                    disabled={paymentMethod === 'credit_card' && !isSecure}
                    className={`w-full py-7 text-xl rounded-2xl !bg-[#fbbd23] shadow-[0_15px_30px_rgba(251,189,35,0.3)] ${paymentMethod === 'credit_card' && !isSecure ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    PAGAR R$ {paymentMethod === 'credit_card' ? selectedInstallment.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : BASE_VALUE.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </Button>
                  
                  <div className="flex items-center justify-center gap-2 opacity-40">
                    <Icons.ShieldIcon className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Pagamento 100% Seguro</span>
                  </div>
                </form>
              )}

              {step === 'processing' && (
                <div className="text-center py-16">
                  <div className="w-16 h-16 border-[5px] border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-8" />
                  <p className="text-indigo-950 font-black uppercase tracking-[0.2em] text-sm">{loadingMessage}</p>
                </div>
              )}

              {step === 'pix_display' && pixData && (
                <div className="text-center space-y-8">
                  <div className="bg-emerald-50 text-emerald-600 py-3 rounded-full text-[10px] font-black uppercase tracking-widest">Aguardando Pagamento</div>
                  {pixData.qr_code_base64 && (
                    <div className="p-5 bg-white rounded-[2.5rem] inline-block border border-slate-100 shadow-sm overflow-hidden">
                      <img 
                        src={pixData.qr_code_base64.startsWith('data:') ? pixData.qr_code_base64 : `data:image/png;base64,${pixData.qr_code_base64}`} 
                        alt="QR Code PIX" 
                        className="w-56 h-56" 
                      />
                    </div>
                  )}
                  <div className="space-y-4">
                    <Button onClick={copyPix} variant="outline" className="w-full border-indigo-100 text-indigo-600 bg-indigo-50 hover:bg-indigo-100">
                      {copied ? 'CÓDIGO COPIADO!' : 'COPIAR CÓDIGO PIX'}
                    </Button>
                    <p className="text-slate-400 font-bold text-xs">Expira em: <span className="text-indigo-600 font-black">{pixTimeRemaining}</span></p>
                  </div>
                  <Button onClick={() => checkPaymentStatus(true)} className="w-full py-4 bg-transparent text-slate-300 border-none shadow-none text-xs hover:text-indigo-600 transition-colors">
                    {isCheckingPayment ? 'VERIFICANDO...' : 'JÁ FIZ O PAGAMENTO'}
                  </Button>
                </div>
              )}

              {step === 'success' && (
                <div className="text-center py-16 space-y-8">
                  <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-10 shadow-[0_20px_40px_rgba(16,185,129,0.2)]">
                    <Icons.CheckIcon className="w-12 h-12" />
                  </div>
                  <h3 className="font-display text-4xl font-black text-indigo-950">Pagamento Aprovado!</h3>
                  <p className="text-slate-500 font-medium text-lg leading-relaxed px-4">
                    O acesso às histórias foi enviado agora mesmo para o seu e-mail: <span className="text-indigo-600 font-black">{email}</span>.
                  </p>
                  <Button onClick={onClose} variant="secondary" className="w-full py-7 mt-10 !bg-[#fbbd23]">COMEÇAR A LER</Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
