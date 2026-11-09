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
  Heart,
  Building2,
  Phone,
  CreditCard,
  Lock,
  ArrowRight,
  Download,
  Share2,
  AlertCircle,
  Sparkles
} from 'lucide-react';

type PaymentTab = 'mtn' | 'airtel' | 'mpesa' | 'card' | 'paypal';

export default function CheckoutModal() {
  const { activeCampaignForDonation, isDonationModalOpen, closeDonationModal, processDonation } = useDonation();
  const { currency, setCurrency, formatCurrencyAmount, rates } = useCurrency();

  const [frequency, setFrequency] = useState<'one-time' | 'monthly'>('one-time');
  const [selectedPreset, setSelectedPreset] = useState<number>(100000); // in UGX base
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
  const [ussdCountdown, setUssdCountdown] = useState(15);
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

  // Calculate actual base amount in UGX
  const effectiveBaseUGX = customAmount ? parseFloat(customAmount) * (currency === 'USD' ? rates.UGX : currency === 'KES' ? rates.UGX / rates.KES : 1) : selectedPreset;
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
      // Auto complete simulation
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
      // Simulate card processing
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
      name: isAnonymous ? 'Anonymous Supporter' : (donorName || 'Generous Supporter'),
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
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3D5E16', '#D97706', '#E6EED8', '#2F4812'],
      });
    } catch (e) {
      // ignore
    }
  };

  const resetAndClose = () => {
    setSimulatedStep('idle');
    setIsProcessing(false);
    setCustomAmount('');
    setDonorMessage('');
    closeDonationModal();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-[#E5E7EB] shadow-2xl overflow-hidden my-6 animate-fadeIn">
        
        {/* Modal Header */}
        <div className="bg-[#FAF9F6] border-b border-[#E5E7EB] px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 relative flex-shrink-0">
              <Image
                src="/images/gcc-emblem.png"
                alt="GCC Emblem"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <div>
              <span className="font-heading font-black text-sm text-[#3D5E16] block">
                GCC FOUNDATION ESCROW
              </span>
              <span className="text-[11px] text-gray-700 font-medium">
                Regulated Humanitarian Giving Portal · 0% Platform Fee
              </span>
            </div>
          </div>

          <button
            onClick={resetAndClose}
            className="text-gray-600 hover:text-gray-900 p-1.5 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: Main Donation Form */}
        {simulatedStep === 'idle' && (
          <form onSubmit={handleStartPayment} className="p-5 sm:p-6 space-y-5">
            
            {/* Campaign Summary & Direct Payout Notice */}
            <div className="bg-[#F4F7EE] border border-[#CDDCB3] rounded-xl p-3.5 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#2F4812]">Beneficiary Campaign:</span>
                <span className="text-[11px] bg-white border border-[#CDDCB3] text-[#3D5E16] px-2 py-0.5 rounded font-mono font-semibold">
                  100% Direct Payout
                </span>
              </div>
              <p className="font-heading font-bold text-sm text-gray-900 line-clamp-1">
                {activeCampaignForDonation.title}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-gray-800">
                <Building2 className="w-3.5 h-3.5 text-[#3D5E16] flex-shrink-0" />
                <span>
                  Disbursed directly to:{' '}
                  <strong className="text-gray-900 font-semibold">{activeCampaignForDonation.payoutVerification.institutionName}</strong>
                </span>
              </div>
            </div>

            {/* Giving Frequency Switcher */}
            <div className="grid grid-cols-2 bg-gray-100 p-1 rounded-lg border border-[#E5E7EB]">
              <button
                type="button"
                onClick={() => setFrequency('one-time')}
                className={`py-2 text-xs font-bold rounded-md transition-all ${
                  frequency === 'one-time'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                One-Time Gift
              </button>
              <button
                type="button"
                onClick={() => setFrequency('monthly')}
                className={`py-2 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-1.5 ${
                  frequency === 'monthly'
                    ? 'bg-[#3D5E16] text-white shadow-sm'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#AFC68A]" />
                Monthly Sustainer
              </button>
            </div>

            {/* Currency Selector Row */}
            <div className="flex items-center justify-between pt-1">
              <label className="text-xs font-bold text-gray-800">Choose Donation Amount:</label>
              <div className="flex items-center bg-gray-100 p-0.5 rounded border border-gray-200">
                {(['UGX', 'KES', 'USD'] as CurrencyCode[]).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCurrency(c)}
                    className={`px-2 py-0.5 text-[11px] font-bold rounded ${
                      currency === c ? 'bg-[#3D5E16] text-white' : 'text-gray-700 hover:text-gray-900'
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
                    className={`py-2 px-1 text-xs font-bold rounded-lg border tabular-nums transition-all ${
                      isSelected
                        ? 'border-[#3D5E16] bg-[#F4F7EE] text-[#2F4812] ring-1 ring-[#3D5E16]'
                        : 'border-[#E5E7EB] bg-white text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            {/* Custom Amount Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-700 font-bold text-xs">
                {currency === 'USD' ? '$' : currency}
              </div>
              <input
                type="number"
                placeholder="Or enter custom amount..."
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                }}
                className="w-full pl-14 pr-4 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-sm text-gray-900 font-semibold focus:outline-none focus:ring-1 focus:ring-[#3D5E16] focus:border-[#3D5E16] tabular-nums"
              />
            </div>

            {/* Payment Rails Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-800 block">
                Select Secure Payment Method:
              </label>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('mtn')}
                  className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition-all ${
                    paymentMethod === 'mtn'
                      ? 'border-[#3D5E16] bg-[#F4F7EE] ring-1 ring-[#3D5E16]'
                      : 'border-[#E5E7EB] bg-white hover:bg-gray-50'
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-50 px-1 py-0.5 rounded w-max border border-amber-200">
                    MTN MoMo
                  </span>
                  <span className="text-xs font-bold text-gray-900 mt-2">Mobile Money</span>
                  <span className="text-[10px] text-gray-700">Instant USSD Push</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('airtel')}
                  className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition-all ${
                    paymentMethod === 'airtel'
                      ? 'border-[#3D5E16] bg-[#F4F7EE] ring-1 ring-[#3D5E16]'
                      : 'border-[#E5E7EB] bg-white hover:bg-gray-50'
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold text-red-700 bg-red-50 px-1 py-0.5 rounded w-max border border-red-200">
                    Airtel Money
                  </span>
                  <span className="text-xs font-bold text-gray-900 mt-2">Airtel MoMo</span>
                  <span className="text-[10px] text-gray-700">East Africa</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('mpesa')}
                  className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition-all ${
                    paymentMethod === 'mpesa'
                      ? 'border-[#3D5E16] bg-[#F4F7EE] ring-1 ring-[#3D5E16]'
                      : 'border-[#E5E7EB] bg-white hover:bg-gray-50'
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 px-1 py-0.5 rounded w-max border border-emerald-200">
                    Safaricom
                  </span>
                  <span className="text-xs font-bold text-gray-900 mt-2">M-Pesa</span>
                  <span className="text-[10px] text-gray-700">Kenya / Int'l</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition-all ${
                    paymentMethod === 'card'
                      ? 'border-[#3D5E16] bg-[#F4F7EE] ring-1 ring-[#3D5E16]'
                      : 'border-[#E5E7EB] bg-white hover:bg-gray-50'
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold text-blue-700 bg-blue-50 px-1 py-0.5 rounded w-max border border-blue-200">
                    Visa / MC
                  </span>
                  <span className="text-xs font-bold text-gray-900 mt-2">Credit / Debit</span>
                  <span className="text-[10px] text-gray-700">Global Card</span>
                </button>
              </div>
            </div>

            {/* Payment Details Form (Dynamic for MoMo vs Card) */}
            <div className="bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl p-4 space-y-3">
              {(paymentMethod === 'mtn' || paymentMethod === 'airtel' || paymentMethod === 'mpesa') ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
                    <Phone className="w-3.5 h-3.5 text-[#3D5E16]" />
                    <span>Enter Mobile Money Phone Number for Instant Prompt:</span>
                  </div>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 0772 123456 or +256 701 987654"
                      value={donorPhone}
                      onChange={(e) => setDonorPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-lg text-xs text-gray-900 font-mono focus:outline-none focus:ring-1 focus:ring-[#3D5E16]"
                    />
                  </div>
                  <p className="text-[11px] text-gray-700 leading-tight">
                    A secure USSD PIN pop-up will appear directly on this phone screen to authorize disbursement.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-800">
                    <span className="flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-[#3D5E16]" />
                      Card Details (256-Bit SSL Encrypted)
                    </span>
                    <span className="text-[10px] text-gray-700 font-mono">PCI-DSS Level 1</span>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Card Number (4000 •••• •••• 1234)"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded text-xs font-mono"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="MM / YY"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="px-3 py-2 bg-white border border-[#E5E7EB] rounded text-xs font-mono"
                    />
                    <input
                      type="text"
                      required
                      placeholder="CVC / CVV"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="px-3 py-2 bg-white border border-[#E5E7EB] rounded text-xs font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Supporter Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-gray-200">
                <input
                  type="text"
                  placeholder="Your Full Name (or leave blank if anon)"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  disabled={isAnonymous}
                  className="px-3 py-2 bg-white border border-[#E5E7EB] rounded text-xs text-gray-900 disabled:opacity-50"
                />
                <input
                  type="email"
                  placeholder="Email for Official Tax Receipt"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  className="px-3 py-2 bg-white border border-[#E5E7EB] rounded text-xs text-gray-900"
                />
              </div>

              {/* Words of Hope / Message */}
              <input
                type="text"
                placeholder="Optional word of hope or prayer for Brenda / family..."
                value={donorMessage}
                onChange={(e) => setDonorMessage(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded text-xs text-gray-900 placeholder-gray-400"
              />

              {/* Anonymity Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-800">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded text-[#3D5E16] focus:ring-[#3D5E16]"
                />
                <span>Don't display my name publicly on the campaign ledger</span>
              </label>
            </div>

            {/* Optional Tip Slider (0% to 15%) */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-gray-900">Optional Tip for Platform Operations: </span>
                  <span className="font-black text-[#3D5E16]">{tipPercentage}% ({tipFormatted.fullString})</span>
                </div>
                <span className="text-[10px] text-gray-700">0% fee on causes</span>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                step="1"
                value={tipPercentage}
                onChange={(e) => setTipPercentage(parseInt(e.target.value))}
                className="w-full accent-[#3D5E16] cursor-pointer"
              />
              <p className="text-[11px] text-gray-700 leading-tight">
                GCC Foundation charges 0% platform fee to causes. Voluntary tips keep our field officers verifying hospital beds and cover banking gateway charges.
              </p>
            </div>

            {/* Total Ledger Breakdown */}
            <div className="bg-[#FAF9F6] border border-[#E5E7EB] rounded-lg p-3 text-xs space-y-1">
              <div className="flex justify-between text-gray-800">
                <span>Beneficiary Direct Disbursement:</span>
                <span className="font-mono font-bold">{baseFormatted.fullString}</span>
              </div>
              {tipAmountUGX > 0 && (
                <div className="flex justify-between text-gray-800">
                  <span>GCC Operations Tip ({tipPercentage}%):</span>
                  <span className="font-mono font-bold">{tipFormatted.fullString}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-gray-900 text-sm pt-1.5 border-t border-gray-200">
                <span>Total Charge:</span>
                <span className="font-heading font-black text-[#3D5E16] tabular-nums text-base">
                  {totalFormatted.fullString}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-[#3D5E16] hover:bg-[#2F4812] text-white font-bold text-sm py-3.5 px-4 rounded-xl shadow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Contacting Banking Rail...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-[#AFC68A]" />
                  <span>
                    Authorize {totalFormatted.fullString} {frequency === 'monthly' ? '/ Month' : 'Now'}
                  </span>
                </>
              )}
            </button>

            {/* Security Footer Note */}
            <div className="flex items-center justify-center gap-2 text-[11px] text-gray-700 text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-[#3D5E16]" />
              <span>Protected by 100% Anti-Fraud Refund Guarantee · Registered NGO #INDR15982736NB</span>
            </div>

          </form>
        )}

        {/* STEP 2: Simulated USSD Push Notification on Phone */}
        {simulatedStep === 'ussd_prompt' && (
          <div className="p-6 text-center space-y-6">
            <div className="w-16 h-16 bg-amber-50 border-2 border-amber-300 rounded-full flex items-center justify-center mx-auto text-amber-600 animate-pulse">
              <Phone className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="inline-block bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                USSD Prompt Sent to Phone
              </span>
              <h3 className="font-heading font-bold text-xl text-gray-900">
                Check Your Phone: {donorPhone || '+256 7•• ••• 419'}
              </h3>
              <p className="text-xs text-gray-800 max-w-sm mx-auto">
                A popup has been dispatched to your handset from <strong className="text-gray-900">GCC Foundation Escrow</strong>. Enter your Mobile Money PIN on your screen to complete the transfer of <strong className="text-[#3D5E16]">{totalFormatted.fullString}</strong>.
              </p>
            </div>

            {/* Simulated USSD Mock Card */}
            <div className="bg-gray-900 text-amber-400 font-mono text-xs p-4 rounded-xl max-w-xs mx-auto border-2 border-amber-500 shadow-xl text-left space-y-2">
              <div className="text-[10px] text-gray-400 border-b border-gray-800 pb-1">
                USSD GATEWAY PUSH · MTN/AIRTEL
              </div>
              <p className="leading-snug">
                Approve Payment of {totalFormatted.fullString} to GCC FOUNDATION ESCROW (Ref: UHI-NAMUBIRU)?
              </p>
              <div className="text-gray-300 text-[11px]">
                1. Enter MM PIN to Confirm
              </div>
              <div className="text-gray-500 text-[10px] italic pt-1">
                Awaiting response ({ussdCountdown}s)...
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={finalizeDonation}
                className="bg-[#3D5E16] text-white text-xs font-bold px-5 py-2.5 rounded-lg shadow hover:bg-[#2F4812] transition-colors"
              >
                Simulate: "I Have Entered My PIN"
              </button>
              <button
                type="button"
                onClick={() => setSimulatedStep('idle')}
                className="text-xs text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Success Screen & Printable Institutional Receipt */}
        {simulatedStep === 'success' && (
          <div className="p-6 space-y-6">
            
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-[#F4F7EE] text-[#3D5E16] border border-[#CDDCB3] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-heading font-extrabold text-2xl text-gray-900">
                Payment Confirmed & Escrowed!
              </h3>
              <p className="text-xs text-gray-800 max-w-md mx-auto">
                Thank you! Your gift of <strong className="text-[#3D5E16] font-bold">{totalFormatted.fullString}</strong> has been logged to the immutable public ledger.
              </p>
            </div>

            {/* Official Digital Receipt Card */}
            <div className="bg-[#FAF9F6] border-2 border-dashed border-[#CDDCB3] rounded-xl p-4 sm:p-5 text-xs space-y-3 font-mono">
              <div className="flex justify-between items-start border-b border-gray-200 pb-3">
                <div>
                  <span className="font-black text-sm text-[#3D5E16] block">GCC FOUNDATION</span>
                  <span className="text-[10px] text-gray-700">Official Disbursement Voucher</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-700 block">Transaction Reference:</span>
                  <span className="font-bold text-gray-900">{completedTxRef}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-gray-700 block">Date & Timestamp:</span>
                  <span className="text-gray-900 font-bold">{new Date().toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-700 block">Payment Method:</span>
                  <span className="text-gray-900 font-bold uppercase">{paymentMethod}</span>
                </div>
                <div>
                  <span className="text-gray-700 block">Beneficiary Entity:</span>
                  <span className="text-gray-900 font-bold">{activeCampaignForDonation.payoutVerification.institutionName}</span>
                </div>
                <div>
                  <span className="text-gray-700 block">Donor Name:</span>
                  <span className="text-gray-900 font-bold">{isAnonymous ? 'Anonymous' : (donorName || 'Generous Donor')}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-2 flex justify-between items-baseline font-bold">
                <span className="text-gray-800">Total Net Disbursed:</span>
                <span className="text-sm text-[#3D5E16]">{totalFormatted.fullString}</span>
              </div>
            </div>

            {/* Receipt Actions */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 bg-white hover:bg-gray-50 border border-[#E5E7EB] text-gray-800 text-xs font-bold py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-gray-700" />
                <span>Print / Save Tax Receipt</span>
              </button>

              <button
                type="button"
                onClick={resetAndClose}
                className="flex-1 bg-[#3D5E16] hover:bg-[#2F4812] text-white text-xs font-bold py-2.5 px-3 rounded-lg shadow transition-colors text-center"
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
