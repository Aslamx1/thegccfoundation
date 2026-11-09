'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import confetti from 'canvas-confetti';
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
  Sparkles
} from 'lucide-react';

type PaymentTab = 'mtn' | 'airtel' | 'mpesa' | 'card' | 'paypal';

export default function CheckoutModal() {
  const { activeCampaignForDonation, isDonationModalOpen, closeDonationModal, processDonation } = useDonation();
  const { currency, setCurrency, formatCurrencyAmount, rates } = useCurrency();

  const [frequency, setFrequency] = useState<'one-time' | 'monthly'>('one-time');
  const [selectedPreset, setSelectedPreset] = useState<number>(100000); // base in UGX
  const [customAmount, setCustomAmount] = useState<string>('');
  const [tipPercentage, setTipPercentage] = useState<number>(8); // 8% default
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [donorName, setDonorName] = useState<string>('');
  const [donorEmail, setDonorEmail] = useState<string>('');
  const [donorPhone, setDonorPhone] = useState<string>('');
  const [donorMessage, setDonorMessage] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentTab>('mtn');

  // Card fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  // Processing & Simulation State
  const [isProcessing, setIsProcessing] = useState(false);
  const [simulatedStep, setSimulatedStep] = useState<'idle' | 'ussd_prompt' | 'success'>('idle');
  const [ussdCountdown, setUssdCountdown] = useState(12);
  const [completedTxRef, setCompletedTxRef] = useState<string>('');

  // Presets based on currency
  const getPresets = () => {
    if (currency === 'USD') {
      return [
        { label: '$15', ugx: 15 * rates.UGX },
        { label: '$30', ugx: 30 * rates.UGX },
        { label: '$60', ugx: 60 * rates.UGX },
        { label: '$120', ugx: 120 * rates.UGX },
        { label: '$250', ugx: 250 * rates.UGX },
      ];
    } else if (currency === 'KES') {
      return [
        { label: 'KSh 1,500', ugx: (1500 / rates.KES) * rates.UGX },
        { label: 'KSh 3,000', ugx: (3000 / rates.KES) * rates.UGX },
        { label: 'KSh 7,500', ugx: (7500 / rates.KES) * rates.UGX },
        { label: 'KSh 15,000', ugx: (15000 / rates.KES) * rates.UGX },
      ];
    } else {
      return [
        { label: 'UGX 25,000', ugx: 25000 },
        { label: 'UGX 50,000', ugx: 50000 },
        { label: 'UGX 100,000', ugx: 100000 },
        { label: 'UGX 250,000', ugx: 250000 },
        { label: 'UGX 500,000', ugx: 500000 },
      ];
    }
  };

  const effectiveBaseUGX = customAmount
    ? parseFloat(customAmount) * (currency === 'USD' ? rates.UGX : currency === 'KES' ? rates.UGX / rates.KES : 1)
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

    setIsProcessing(true);

    if (paymentMethod === 'mtn' || paymentMethod === 'airtel' || paymentMethod === 'mpesa') {
      setSimulatedStep('ussd_prompt');
      setUssdCountdown(10);
      setIsProcessing(false);
    } else {
      setTimeout(() => {
        finalizeDonation();
      }, 1800);
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
      confetti({
        particleCount: 120,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#02A95C', '#D97706', '#E6EED8', '#1A1A1A'],
      });
    } catch (e) {}
  };

  const resetAndClose = () => {
    setSimulatedStep('idle');
    setIsProcessing(false);
    setCustomAmount('');
    setDonorMessage('');
    closeDonationModal();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-[#E5E7EB] shadow-2xl overflow-hidden my-6 animate-fadeIn">
        
        {/* Modal Top Bar */}
        <div className="bg-white border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 relative flex-shrink-0">
              <Image
                src="/images/gcc-emblem.png"
                alt="GCC Emblem"
                width={28}
                height={28}
                className="object-contain"
              />
            </div>
            <div>
              <span className="font-heading font-black text-sm text-[#1A1A1A] block">
                GCC FOUNDATION
              </span>
              <span className="text-[11px] text-gray-500 font-medium">
                100% Direct Institutional Escrow
              </span>
            </div>
          </div>

          <button
            onClick={resetAndClose}
            className="text-gray-400 hover:text-gray-900 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: Main Donation Form */}
        {simulatedStep === 'idle' && (
          <form onSubmit={handleStartPayment} className="p-6 space-y-5">
            
            {/* Beneficiary Header */}
            <div className="bg-[#FBF9F6] border border-[#E5E7EB] rounded-2xl p-4 space-y-1">
              <span className="text-[11px] font-bold text-[#02A95C] uppercase tracking-wider block">
                You're supporting:
              </span>
              <h3 className="font-heading font-bold text-base text-[#1A1A1A] line-clamp-1">
                {activeCampaignForDonation.title}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-gray-600 pt-0.5">
                <Building2 className="w-3.5 h-3.5 text-[#02A95C] flex-shrink-0" />
                <span>
                  Direct Payout: <strong className="text-gray-900">{activeCampaignForDonation.payoutVerification.institutionName}</strong>
                </span>
              </div>
            </div>

            {/* Frequency Toggle: One-Time vs. Monthly Sustainer */}
            <div className="grid grid-cols-2 bg-gray-100 p-1 rounded-full border border-[#E5E7EB]">
              <button
                type="button"
                onClick={() => setFrequency('one-time')}
                className={`py-2 text-xs font-bold rounded-full transition-all ${
                  frequency === 'one-time'
                    ? 'bg-white text-[#1A1A1A] shadow-sm'
                    : 'text-gray-500 hover:text-[#1A1A1A]'
                }`}
              >
                One-Time Gift
              </button>
              <button
                type="button"
                onClick={() => setFrequency('monthly')}
                className={`py-2 text-xs font-bold rounded-full transition-all flex items-center justify-center gap-1.5 ${
                  frequency === 'monthly'
                    ? 'bg-[#02A95C] text-white shadow-sm'
                    : 'text-gray-500 hover:text-[#1A1A1A]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-white" />
                Monthly Sustainer
              </button>
            </div>

            {/* Currency Switcher */}
            <div className="flex items-center justify-between pt-1">
              <label className="text-xs font-bold text-[#1A1A1A]">Donation Amount:</label>
              <div className="flex items-center bg-gray-100 p-0.5 rounded-full border border-gray-200">
                {(['UGX', 'KES', 'USD'] as CurrencyCode[]).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCurrency(c)}
                    className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
                      currency === c ? 'bg-[#02A95C] text-white shadow-xs' : 'text-gray-600 hover:text-black'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Preset Amount Pills */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {getPresets().map((preset) => {
                const isSelected = !customAmount && selectedPreset === preset.ugx;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setSelectedPreset(preset.ugx);
                      setCustomAmount('');
                    }}
                    className={`py-2.5 px-1 text-xs font-bold rounded-xl border tabular-nums transition-all ${
                      isSelected
                        ? 'border-[#02A95C] bg-[#02A95C]/10 text-[#02A95C] ring-2 ring-[#02A95C]'
                        : 'border-[#E5E7EB] bg-white text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            {/* Custom Amount */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500 font-bold text-xs">
                {currency === 'USD' ? '$' : currency}
              </span>
              <input
                type="number"
                placeholder="Or enter custom amount..."
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="w-full pl-16 pr-4 py-3 bg-[#FBF9F6] border border-[#E5E7EB] rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#02A95C] tabular-nums"
              />
            </div>

            {/* Payment Method Tabs */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#1A1A1A] block">Payment Method:</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'mtn', name: 'MTN MoMo', tag: 'Mobile Money' },
                  { id: 'airtel', name: 'Airtel Money', tag: 'Airtel MoMo' },
                  { id: 'mpesa', name: 'M-Pesa', tag: 'Safaricom' },
                  { id: 'card', name: 'Card / Visa', tag: 'Credit/Debit' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      paymentMethod === m.id
                        ? 'border-[#02A95C] bg-[#02A95C]/10 ring-2 ring-[#02A95C]'
                        : 'border-[#E5E7EB] bg-white hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-xs font-bold text-gray-900">{m.name}</span>
                    <span className="text-[10px] text-gray-500">{m.tag}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Details Input */}
            <div className="bg-[#FBF9F6] border border-[#E5E7EB] rounded-2xl p-4 space-y-3">
              {paymentMethod === 'mtn' || paymentMethod === 'airtel' || paymentMethod === 'mpesa' ? (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#02A95C]" />
                    <span>Mobile Money Phone Number:</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 0772 123456 or +256 701 987654"
                    value={donorPhone}
                    onChange={(e) => setDonorPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs font-mono text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#02A95C]"
                  />
                  <p className="text-[11px] text-gray-500">
                    A USSD prompt will appear on your phone to enter your PIN and approve disbursement.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-[#02A95C]" />
                    <span>Card Information (256-Bit SSL Encrypted):</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Card Number (4000 •••• •••• 1234)"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-lg text-xs font-mono"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="MM / YY"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="px-3 py-2 bg-white border border-[#E5E7EB] rounded-lg text-xs font-mono"
                    />
                    <input
                      type="text"
                      required
                      placeholder="CVC"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="px-3 py-2 bg-white border border-[#E5E7EB] rounded-lg text-xs font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Supporter Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-gray-200">
                <input
                  type="text"
                  placeholder="Your Full Name"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  disabled={isAnonymous}
                  className="px-3 py-2 bg-white border border-[#E5E7EB] rounded-lg text-xs text-gray-900"
                />
                <input
                  type="email"
                  placeholder="Email for Digital Tax Receipt"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  className="px-3 py-2 bg-white border border-[#E5E7EB] rounded-lg text-xs text-gray-900"
                />
              </div>

              {/* Message of Hope */}
              <input
                type="text"
                placeholder="Optional word of support or prayer..."
                value={donorMessage}
                onChange={(e) => setDonorMessage(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-lg text-xs text-gray-900"
              />

              {/* Anonymous Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded text-[#02A95C] focus:ring-[#02A95C]"
                />
                <span>Don't display my name publicly on the campaign page</span>
              </label>
            </div>

            {/* Optional Tip Slider (0% - 15%) */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-gray-900">Optional Tip for Platform Operations: </span>
                  <span className="font-bold text-[#02A95C]">{tipPercentage}% ({tipFormatted.fullString})</span>
                </div>
                <span className="text-[10px] text-gray-500">0% fee on charity</span>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                step="1"
                value={tipPercentage}
                onChange={(e) => setTipPercentage(parseInt(e.target.value))}
                className="w-full accent-[#02A95C] cursor-pointer"
              />
              <p className="text-[11px] text-gray-500 leading-tight">
                GCC Foundation charges 0% platform fee to causes. Voluntary tips keep our field officers verifying hospital beds.
              </p>
            </div>

            {/* Total Row */}
            <div className="flex justify-between items-baseline pt-2 border-t border-[#E5E7EB] font-heading font-extrabold text-base">
              <span className="text-[#1A1A1A]">Total due today:</span>
              <span className="text-xl text-[#02A95C] tabular-nums">
                {totalFormatted.fullString}
              </span>
            </div>

            {/* Submit Button (GoFundMe Emerald Green Pill) */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-[#02A95C] hover:bg-[#028F4D] text-white font-extrabold text-base py-4 px-6 rounded-full shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <span>Connecting to payment gateway...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-white" />
                  <span>Donate {totalFormatted.fullString} {frequency === 'monthly' ? '/ month' : ''}</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-500 text-center">
              <ShieldCheck className="w-4 h-4 text-[#02A95C]" />
              <span>Protected by the GCC Foundation Giving Guarantee • 100% Refundable</span>
            </div>

          </form>
        )}

        {/* STEP 2: USSD Prompt Screen */}
        {simulatedStep === 'ussd_prompt' && (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-[#02A95C]/10 text-[#02A95C] rounded-full flex items-center justify-center mx-auto animate-pulse">
              <Phone className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="font-heading font-extrabold text-2xl text-[#1A1A1A]">
                Check Your Phone: {donorPhone || '+256 7•• ••• 419'}
              </h3>
              <p className="text-xs text-gray-600 max-w-sm mx-auto">
                A USSD popup has been dispatched to your handset from <strong className="text-gray-900">GCC Foundation Escrow</strong>. Enter your Mobile Money PIN on your screen to authorize payment of <strong className="text-[#02A95C]">{totalFormatted.fullString}</strong>.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={finalizeDonation}
                className="bg-[#02A95C] text-white text-xs font-bold px-6 py-3 rounded-full shadow hover:bg-[#028F4D] transition-colors"
              >
                Simulate: "I Have Entered My PIN"
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
                Your donation of <strong className="text-[#02A95C]">{totalFormatted.fullString}</strong> has been logged to the public campaign ledger.
              </p>
            </div>

            {/* Printable Digital Receipt Card */}
            <div className="bg-[#FBF9F6] border border-[#E5E7EB] rounded-2xl p-5 text-left text-xs font-mono space-y-2">
              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <span className="font-bold text-[#1A1A1A]">GCC FOUNDATION VOUCHER</span>
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
                <span>Print Receipt</span>
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
  );
}
