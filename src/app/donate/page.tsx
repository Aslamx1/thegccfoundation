'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import DonorboxWidget from '@/components/DonorboxWidget';
import { DONORBOX_URL } from '@/context/DonationContext';
import { ArrowLeft, Heart, ShieldCheck } from 'lucide-react';

export default function DonatePage() {
  return (
    <div className="flex-1 flex flex-col bg-[#FBF9F6] font-sans text-gray-900">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto px-4 py-8 sm:py-12 w-full space-y-8">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to fundraisers
        </Link>

        {/* Header */}
        <div className="space-y-3 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-bold text-[#02A95C] border border-emerald-200">
            <ShieldCheck className="h-4 w-4" />
            <span>100% Direct Institutional Payouts</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#1A1A1A]">
            Donate to GCC Foundation
          </h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto">
            Support verified medical, education, emergency relief, and clean water causes across East Africa.
          </p>
        </div>

        {/* Donorbox Widget */}
        <DonorboxWidget
          campaign="gcc-foundation"
          type="donation_form"
          enableAutoScroll={true}
          className="rounded-3xl shadow-card"
        />

        {/* Direct Donate Now Button */}
        <div className="text-center space-y-2">
          <a
            href={DONORBOX_URL}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#02A95C] hover:bg-[#028F4D] text-white font-extrabold text-base py-3.5 px-8 shadow-sm transition-all"
          >
            <Heart className="h-5 w-5 fill-current" />
            Donate Now
          </a>
        </div>
      </main>
    </div>
  );
}
