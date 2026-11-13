'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useDonation } from '@/context/DonationContext';
import { useCurrency } from '@/context/CurrencyContext';
import { CurrencyCode } from '@/types';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Phone,
  CreditCard,
  Lock,
  Download,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  Info
} from 'lucide-react';

type PaymentTab = 'mtn' | 'airtel' | 'mpesa' | 'card' | 'paypal';

export default function CheckoutModal() {
  const { activeCampaignForDonation, isDonationModalOpen, closeDonationModal, processDonation } = useDonation();
  const { currency, setCurrency, formatCurrencyAmount, currencyOptions, rates } = useCurrency();

  const [frequency, setFrequency] = useState<'one-time' | 'monthly'>('one-time');
  const [selectedPreset, setSelectedPreset] = useState<number>(100000); // base in UGX
  const [customAmount, setCustomAmount] = useState<string>('');
  const [tipPercentage, setTipPercentage] = useState<number>(0); // no added tip by default
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [donorName, setDonorName] = useState<string>('');
  const [donorEmail, setDonorEmail] = useState<string>('');
  const [donorPhone, setDonorPhone] = useState<string>('');
  const [donorMessage, setDonorMessage] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentTab>('card');
  const [paymentScreen, setPaymentScreen] = useState<'methods' | 'add-card'>('methods');
  const [receiptRequested, setReceiptRequested] = useState(true);
  const [cardNotice, setCardNotice] = useState('');


  // Processing & Simulation State
  const [isProcessing, setIsProcessing] = useState(false);
  const [simulatedStep, setSimulatedStep] = useState<'idle' | 'ussd_prompt' | 'success'>('idle');
  const [ussdCountdown, setUssdCountdown] = useState(12);
  const [completedTxRef, setCompletedTxRef] = useState<string>('');

  // Presets are displayed in the selected currency and stored internally as UGX.
  const getPresets = () => {
    const amounts = currency === 'UGX'
      ? [25000, 50000, 100000, 250000, 500000].map((amount) => ({ amount, ugx: amount }))
      : currency === 'KES'
        ? [1500, 3000, 7500, 15000].map((amount) => ({ amount, ugx: (amount / rates.KES) * rates.UGX }))
        : currency === 'USD'
          ? [15, 30, 60, 120, 250].map((amount) => ({ amount, ugx: amount * rates.UGX }))
          : [10, 25, 50, 100, 250].map((amount) => ({ amount, ugx: rates[currency] ? (amount / rates[currency]) * rates.UGX : amount * rates.UGX }));
    return amounts.map(({ ugx }) => ({ label: formatCurrencyAmount(ugx).fullString, ugx }));
  };

  const effectiveBaseUGX = customAmount
    ? parseFloat(customAmount) * (rates.UGX / (rates[currency] || rates.UGX))
    : selectedPreset;
  const tipAmountUGX = Math.round(effectiveBaseUGX * (tipPercentage / 100));
  const totalAmountUGX = effectiveBaseUGX + tipAmountUGX;

  const baseFormatted = formatCurrencyAmount(effectiveBaseUGX);
  const tipFormatted = formatCurrencyAmount(tipAmountUGX);
  const totalFormatted = formatCurrencyAmount(totalAmountUGX);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (simulatedStep === 'ussd_prompt' && ussdCountdown > 0) {
      timer = setTimeout(() => {
        setUssdCountdown((prev) => prev - 1);
      }, 1000);
    } else if (simulatedStep === 'ussd_prompt' && ussdCountdown === 0) {
      finalizeDonation();
    }
    return () => clearTimeout(timer);
  }, [simulatedStep, ussdCountdown]);

  if (!isDonationModalOpen || !activeCampaignForDonation) return null;

  const handleStartPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (effectiveBaseUGX <= 0) return;
    if (paymentMethod === 'card') {
      setPaymentScreen('add-card');
      return;
    }

    setIsProcessing(true);
    if (paymentMethod === 'mtn' || paymentMethod === 'airtel' || paymentMethod === 'mpesa') {
      setSimulatedStep('ussd_prompt');
      setUssdCountdown(10);
      setIsProcessing(false);
    } else {
      setIsProcessing(false);
    }
  };
  const finalizeDonation = async () => {
    const paymentMethodMap: Record<PaymentTab, any> = {
      mtn: 'MTN Mobile Money',
      airtel: 'Airtel Money',
      mpesa: 'M-Pesa',
      card: 'Visa / Card',
      paypal: 'PayPal',
    };

    const res = await processDonation(activeCampaignForDonation.id, {
      name: isAnonymous ? 'Anonymous' : (donorName || 'Generous Supporter'),
      amountUGX: effectiveBaseUGX,
      currencyPaid: currency,
      amountInOriginalCurrency: parseFloat(baseFormatted.value.replace(/,/g, '')),
      message: donorMessage || undefined,
      isAnonymous,
      paymentMethod: paymentMethodMap[paymentMethod],
      isRecurringMonthly: frequency === 'monthly',
    });

    setCompletedTxRef(res.txRef);
    setSimulatedStep('success');
    setIsProcessing(false);

    try {
      import('canvas-confetti').then((mod) => {
        const fire = mod.default || mod;
        fire({
          particleCount: 120,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#02A95C', '#D97706', '#E6EED8', '#1A1A1A'],
        });
      });
    } catch (e) {}
  };

  const resetAndClose = () => {
    setSimulatedStep('idle');
    setIsProcessing(false);
    setCustomAmount('');
    setDonorMessage('');
    setPaymentScreen('methods');
    setCardNotice('');
    closeDonationModal();
  };
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#171222]/55 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="rounded-[2rem] max-w-md w-full checkout-viewport-height overflow-y-auto border border-white/70 bg-[#eeebff] p-2 shadow-2xl my-3 sm:my-6 animate-fadeIn">
        
        <div className="rounded-[2rem] bg-[#eeebff] p-3 sm:p-4">
          <div className="mb-3 grid grid-cols-[36px_1fr_36px] items-center text-[#28154d]">
            <button type="button" onClick={() => paymentScreen === 'add-card' ? setPaymentScreen('methods') : resetAndClose()} className="flex h-10 w-10 items-center justify-center rounded-full text-[#873ff2] transition hover:bg-white/70" aria-label={paymentScreen === 'add-card' ? 'Back to payment methods' : 'Close payment details'}><ArrowLeft className="h-5 w-5" /></button>
            <h2 className="text-center text-lg font-bold tracking-tight">{simulatedStep === 'idle' && paymentScreen === 'add-card' ? 'Add new card' : 'Payment details'}</h2>
            <button type="button" title="Payment options for your donation" className="flex h-10 w-10 items-center justify-center justify-self-end rounded-full text-[#873ff2] transition hover:bg-white/70" aria-label="Payment information"><Info className="h-5 w-5" /></button>
          </div>
        {/* STEP 1: Payment method and card form */}
        {simulatedStep === 'idle' && (
          paymentScreen === 'methods' ? (
            <form onSubmit={handleStartPayment} className="space-y-3">
              <section className="rounded-[1.4rem] bg-white p-3 shadow-sm sm:p-4">
                <div className="mb-3 flex items-center justify-between"><h3 className="text-base font-bold text-[#2c1952]">Credit card</h3><span className="text-2xl leading-none text-[#873ff2]">âŒƒ</span></div>
                <div className="grid grid-cols-3 gap-2">{['AMEX', 'mastercard', 'VISA'].map((brand) => <div key={brand} className="flex h-14 items-center justify-center rounded-xl border border-[#d5c6ff] text-sm font-extrabold tracking-wide text-[#3b2a67]">{brand === 'mastercard' ? <span className="flex items-center gap-0.5"><i className="h-5 w-5 rounded-full bg-[#f4a51c]"/><i className="-ml-2 h-5 w-5 rounded-full bg-[#e53645]/90"/></span> : brand}</div>)}</div>
                <div className="relative mt-3 h-36 overflow-hidden rounded-2xl bg-gradient-to-br from-[#cf9b28] via-[#b97d16] to-[#e0b34a] p-4 text-[#fff3c6] shadow-[0_12px_18px_rgba(83,50,10,.24)]"><div className="absolute -right-8 -top-12 h-48 w-48 rounded-full border-[22px] border-white/10"/><div className="absolute -bottom-16 -left-8 h-48 w-48 rounded-full border-[22px] border-white/10"/><div className="relative flex h-full flex-col justify-between"><div className="flex items-center justify-between"><span className="text-xs font-extrabold tracking-[.16em]">GCC FOUNDATION</span><span className="text-[10px] font-semibold opacity-85">SUPPORTER CARD</span></div><div><span className="block text-[10px] uppercase tracking-widest opacity-80">Card number</span><span className="mt-1 block font-mono text-lg tracking-[.16em]">&bull;&bull;&bull;&bull; &nbsp; &bull;&bull;&bull;&bull; &nbsp; &bull;&bull;&bull;&bull; &nbsp; 2048</span></div><div className="flex items-end justify-between text-xs font-bold"><span>GCC SUPPORTER</span><span className="flex"><i className="h-6 w-6 rounded-full bg-[#ed343e]"/><i className="-ml-2 h-6 w-6 rounded-full bg-[#f7a51b]/95"/></span></div></div></div>
                <button type="button" onClick={() => { setPaymentMethod('card'); setPaymentScreen('add-card'); setCardNotice(''); }} className="mt-4 w-full rounded-xl py-2 text-center text-base font-bold text-[#873ff2] transition hover:bg-[#f7f3ff]">Add new card</button>
              </section>
              <section className="space-y-3">
                <button type="button" disabled className="flex w-full items-center justify-between rounded-2xl bg-white px-4 py-3 text-left text-sm font-bold text-[#321d59] shadow-sm disabled:opacity-90"><span>Google Pay <small className="ml-2 text-xs font-medium text-gray-400">Coming soon</small></span><ChevronRight className="h-5 w-5 text-[#873ff2]"/></button>
                <button type="button" onClick={() => setPaymentMethod('card')} className={`flex w-full items-center justify-between rounded-2xl bg-white px-4 py-3 text-left text-sm font-bold text-[#321d59] shadow-sm ${paymentMethod === 'card' ? 'ring-2 ring-[#9a60ff]' : 'hover:ring-1 hover:ring-[#cbb5ff]'}`}><span>Debit Card</span><ChevronRight className="h-5 w-5 text-[#873ff2]"/></button>
                <div className="overflow-hidden rounded-2xl bg-white shadow-sm"><button type="button" onClick={() => setPaymentMethod(paymentMethod === 'mtn' || paymentMethod === 'airtel' || paymentMethod === 'mpesa' ? 'card' : 'mtn')} className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-bold text-[#321d59]"><span>Mobile Banking</span><ChevronRight className={`h-5 w-5 text-[#873ff2] transition-transform ${paymentMethod === 'mtn' || paymentMethod === 'airtel' || paymentMethod === 'mpesa' ? 'rotate-90' : ''}`}/></button>{(paymentMethod === 'mtn' || paymentMethod === 'airtel' || paymentMethod === 'mpesa') && <div className="grid grid-cols-3 gap-2 px-4 pb-4">{([{ id: 'mtn', label: 'MTN MoMo' }, { id: 'airtel', label: 'Airtel Money' }, { id: 'mpesa', label: 'M-Pesa' }] as const).map((method) => <button key={method.id} type="button" onClick={() => setPaymentMethod(method.id)} className={`rounded-xl border px-2 py-2.5 text-xs font-bold ${paymentMethod === method.id ? 'border-[#8743f4] bg-[#f4efff] text-[#6430b7]' : 'border-gray-200 text-gray-600'}`}>{method.label}</button>)}</div>}</div>
              </section>
              <section className="rounded-2xl bg-white p-3 shadow-sm"><p className="mb-3 text-xs font-bold uppercase tracking-wide text-[#796b91]">Donation amount</p><div className="mb-3 flex items-center justify-between"><select aria-label="Donation currency" value={currency} onChange={(event) => setCurrency(event.target.value)} className="max-w-[190px] rounded-xl border border-[#d9c9fa] bg-[#f7f4ff] px-3 py-2 text-xs font-bold text-[#4f3d70] outline-none focus:border-[#8751ed]">{currencyOptions.map((option) => <option key={option.code} value={option.code} disabled={!rates[option.code]}>{option.code} - {option.name}{!rates[option.code] ? ' (rate unavailable)' : ''}</option>)}</select><span className="text-xs font-semibold text-[#675b7d]">{frequency === 'monthly' ? 'Monthly gift' : 'One-time gift'}</span></div><div className="grid grid-cols-3 gap-2">{getPresets().slice(0, 3).map((preset) => <button key={preset.label} type="button" onClick={() => { setSelectedPreset(preset.ugx); setCustomAmount(''); }} className={`rounded-xl border px-2 py-2 text-xs font-bold ${!customAmount && selectedPreset === preset.ugx ? 'border-[#8751ed] bg-[#f4efff] text-[#6430b7]' : 'border-[#e8e2f3] text-[#655b75]'}`}>{preset.label}</button>)}</div><div className="mt-3 flex items-center justify-between border-t border-[#eee9f5] pt-3 text-sm"><span className="text-[#675b7d]">Total donation</span><strong className="text-sm text-[#321d59]">{totalFormatted.fullString}</strong></div><p className="mt-2 text-[10px] text-[#817792]">Daily reference rates by <a href="https://www.exchangerate-api.com" target="_blank" rel="noreferrer" className="underline">ExchangeRate-API</a></p></section>
              <label className="flex items-center gap-3 px-1 text-sm text-[#454051]"><input type="checkbox" checked={receiptRequested} onChange={(event) => setReceiptRequested(event.target.checked)} className="h-5 w-5 rounded border-[#a5a0b0] accent-[#8751ed]"/>Send receipt to your email</label>
              {receiptRequested && <input type="email" value={donorEmail} onChange={(event) => setDonorEmail(event.target.value)} placeholder="Email address for your receipt" className="w-full rounded-xl border border-[#dcd3f0] bg-white px-4 py-3 text-sm text-[#2c1952] outline-none placeholder:text-gray-400 focus:border-[#8751ed] focus:ring-2 focus:ring-[#8751ed]/15"/>}
              <p className="rounded-xl bg-white/75 px-4 py-3 text-xs leading-relaxed text-[#625678]">Payment preview only. GCC has not connected a payment provider, so no real payment or receipt will be processed.</p>
              <button type="submit" disabled={isProcessing} className="w-full rounded-2xl bg-[#8c55f6] px-5 py-3 text-sm font-bold text-white shadow-[0_8px_20px_rgba(117,63,218,.25)] transition hover:bg-[#7a42e5] disabled:opacity-60">{paymentMethod === 'card' ? 'Continue' : `Continue with ${paymentMethod === 'mtn' ? 'MTN Mobile Money' : paymentMethod === 'airtel' ? 'Airtel Money' : 'M-Pesa'}`}</button>
            </form>
          ) : (
            <form onSubmit={(event) => { event.preventDefault(); setCardNotice('Card payments are not connected yet. No payment was taken.'); }} className="space-y-4 rounded-t-[2rem] bg-white px-3 pb-4 pt-2 sm:px-4">
              <div className="-mx-3 -mt-2 rounded-b-[2.5rem] bg-[#eeebff] px-4 pb-10 pt-2 sm:-mx-4"><div className="relative mx-auto -mb-20 mt-2 h-44 max-w-sm overflow-hidden rounded-2xl bg-gradient-to-br from-[#3c075b] via-[#d91d74] to-[#47005f] p-4 text-white shadow-[0_12px_16px_rgba(44,13,76,.3)]"><div className="absolute inset-0 bg-[radial-gradient(ellipse_at_35%_50%,rgba(255,89,168,.65),transparent_55%),linear-gradient(125deg,transparent_30%,rgba(255,255,255,.12)_31%,transparent_48%,rgba(255,255,255,.10)_66%,transparent_67%)]"/><div className="relative flex h-full flex-col justify-between"><div className="text-sm font-extrabold tracking-wide">GCC FOUNDATION</div><div><div className="text-[10px] text-white/75">CHIP</div><div className="mt-1 text-lg tracking-[.18em]">â–¦ )))</div><div className="mt-2 font-mono text-lg tracking-[.14em]">&bull;&bull;&bull;&bull; &nbsp; &bull;&bull;&bull;&bull; &nbsp; &bull;&bull;&bull;&bull; &nbsp; 2048</div></div><div className="flex items-end justify-between text-[10px] uppercase tracking-wider text-white/75"><span>Cardholder<br/><strong className="mt-1 block text-sm text-white">GCC SUPPORTER</strong></span><span>Expires<br/><strong className="mt-1 block text-sm text-white">MM / YY</strong></span></div></div></div></div>
              <div className="space-y-3 pt-16"><div><label className="mb-2 block text-sm font-bold text-[#2c1952]">Card number</label><input disabled placeholder="XXXX  XXXX  XXXX  XXXX" className="w-full rounded-xl border border-[#dcd3f0] bg-white px-3 py-3 text-sm text-gray-500 placeholder:text-gray-400"/></div><div><label className="mb-2 block text-sm font-bold text-[#2c1952]">Card Holderâ€™s name</label><input disabled placeholder="e.g. John Doe" className="w-full rounded-xl border border-[#dcd3f0] bg-white px-3 py-3 text-sm text-gray-500 placeholder:text-gray-400"/></div><div className="grid grid-cols-[1fr_.48fr] gap-3"><div><label className="mb-2 block text-sm font-bold text-[#2c1952]">Expiration date</label><input disabled placeholder="MM/YY" className="w-full rounded-xl border border-[#dcd3f0] bg-white px-3 py-3 text-sm text-gray-500 placeholder:text-gray-400"/></div><div><label className="mb-2 block text-sm font-bold text-[#2c1952]">CVV</label><input disabled placeholder="&bull;&bull;&bull;" className="w-full rounded-xl border border-[#dcd3f0] bg-white px-3 py-3 text-sm text-gray-500 placeholder:text-gray-400"/></div></div></div>
              <label className="flex items-center gap-3 px-1 text-sm text-[#454051]"><input type="checkbox" disabled className="h-5 w-5 rounded border-gray-300 accent-[#8751ed]"/>Save as default card</label>
              {cardNotice && <p role="status" className="rounded-xl bg-[#f4efff] px-4 py-3 text-sm text-[#57358c]">{cardNotice}</p>}
              <p className="text-center text-xs leading-relaxed text-[#766b88]">Card payments are not connected yet. The fields are shown for design preview only.</p>
              <button type="submit" className="w-full rounded-2xl bg-[#8c55f6] px-5 py-3 text-sm font-bold text-white shadow-[0_8px_20px_rgba(117,63,218,.25)] transition hover:bg-[#7a42e5]">Pay Now</button>
            </form>
          )
        )}
        {/* STEP 2: USSD Prompt Screen */}
        {simulatedStep === 'ussd_prompt' && (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-[#02A95C]/10 text-[#02A95C] rounded-full flex items-center justify-center mx-auto animate-pulse">
              <Phone className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="font-heading font-extrabold text-2xl text-[#1A1A1A]">
                Demo mobile payment: {donorPhone || '+256 7&bull;&bull; &bull;&bull;&bull; 419'}
              </h3>
              <p className="text-xs text-gray-600 max-w-sm mx-auto">
                This is a frontend demonstration. No request was sent to your phone and you must not enter a PIN. Continue only to record a sample donation in this browser.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={finalizeDonation}
                className="bg-[#02A95C] text-white text-xs font-bold px-6 py-3 rounded-full shadow hover:bg-[#028F4D] transition-colors"
              >
                Demo: simulate confirmation (no payment taken)
              </button>
              <button
                type="button"
                onClick={() => setSimulatedStep('idle')}
                className="text-xs text-gray-500 hover:text-gray-800"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Confetti Success Screen */}
        {simulatedStep === 'success' && (
          <div className="p-8 space-y-6 text-center">
            <div className="w-16 h-16 bg-[#E6EED8] text-[#02A95C] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="font-heading font-extrabold text-2xl text-[#1A1A1A]">
                You're amazing! Thank you for giving.
              </h3>
              <p className="text-sm text-gray-600 max-w-md mx-auto">
                Demo only: <strong className="text-[#02A95C]">{totalFormatted.fullString}</strong> was added to the local fundraiser preview. No money was collected and no payment service was contacted.
              </p>
            </div>

            {/* Printable Digital Receipt Card */}
            <div className="bg-[#FBF9F6] border border-[#E5E7EB] rounded-2xl p-5 text-left text-xs font-mono space-y-2">
              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <span className="font-bold text-[#1A1A1A]">GCC FOUNDATION DEMO RECORD</span>
                <span className="text-[10px] text-gray-500">{completedTxRef}</span>
              </div>
              <div className="space-y-1 text-gray-600">
                <div>Beneficiary: <strong className="text-gray-900 font-sans">{activeCampaignForDonation.payoutVerification.institutionName}</strong></div>
                <div>Amount: <strong className="text-[#02A95C] font-bold">{totalFormatted.fullString}</strong></div>
                <div>Method: <strong className="uppercase">{paymentMethod}</strong></div>
                <div>Date: {new Date().toLocaleDateString()}</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="bg-white border border-[#E5E7EB] hover:bg-gray-50 text-gray-800 text-xs font-bold py-3 px-5 rounded-full flex items-center gap-1.5"
              >
                <Download className="w-4 h-4 text-gray-500" />
                <span>Print demo record</span>
              </button>
              <button
                type="button"
                onClick={resetAndClose}
                className="bg-[#02A95C] hover:bg-[#028F4D] text-white text-xs font-bold py-3 px-8 rounded-full"
              >
                Done
              </button>
            </div>
          </div>
        )}

        </div>
      </div>
    </div>
  );
}
