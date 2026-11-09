'use client';

import React from 'react';
import { useCurrency } from '@/context/CurrencyContext';
import { ShieldCheck, PhoneCall, CheckCircle2 } from 'lucide-react';
import { CurrencyCode } from '@/types';

export default function TopTrustBar() {
  const { currency, setCurrency } = useCurrency();

  const currencies: CurrencyCode[] = ['UGX', 'KES', 'USD'];

  return (
    <div className="bg-[#1F310C] text-[#E6EED8] text-xs border-b border-[#2F4812] py-2 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        {/* Left: Institutional & Legal Registration */}
        <div className="flex items-center gap-2 text-center md:text-left flex-wrap justify-center md:justify-start">
          <span className="inline-flex items-center gap-1 font-semibold text-[#8AA95E] bg-[#121E07] px-2 py-0.5 rounded text-[11px] border border-[#2F4812]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#AFC68A]" />
            REGULATED NGO
          </span>
          <span className="text-gray-300">
            Uganda NGO Bureau Reg: <strong className="text-white font-mono">INDR15982736NB</strong>
          </span>
          <span className="hidden lg:inline text-[#8AA95E]">·</span>
          <span className="hidden lg:inline-flex items-center gap-1 text-gray-300">
            <CheckCircle2 className="w-3 h-3 text-[#AFC68A]" />
            100% Direct-to-Hospital & School Accounts
          </span>
        </div>

        {/* Right: Phone Helpline & Currency Switcher */}
        <div className="flex items-center gap-4 flex-wrap justify-center">
          <a
            href="tel:+256772491802"
            className="flex items-center gap-1.5 text-gray-200 hover:text-white transition-colors"
          >
            <PhoneCall className="w-3 h-3 text-[#AFC68A]" />
            <span>Nakasero Support: <strong className="text-white">+256 (0) 772 491 802</strong></span>
          </a>

          {/* Currency Switcher */}
          <div className="flex items-center bg-[#121E07] border border-[#2F4812] rounded p-0.5">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider px-1.5 font-medium">Currency:</span>
            {currencies.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCurrency(c)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                  currency === c
                    ? 'bg-[#3D5E16] text-white shadow-sm'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
