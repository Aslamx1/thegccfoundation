'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import DonorboxWidget from '@/components/DonorboxWidget';
import CampaignCard from '@/components/CampaignCard';
import { useDonation, matchCategory, DONORBOX_URL } from '@/context/DonationContext';
import { useCurrency } from '@/context/CurrencyContext';
import { LegalAgreementNotice } from '@/components/legal/LegalAgreementNotice';
import {
  ArrowLeft,
  Heart,
  ShieldCheck,
  Sparkles,
  MapPin,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

const DONATE_CATEGORIES = ['All', 'Medical', 'Education', 'Emergency', 'Community'];

export default function DonatePage() {
  const { campaigns, openDonationModal } = useDonation();
  const { formatUGX } = useCurrency();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'causes' | 'general'>('causes');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get('category')?.toLowerCase() ?? '';

    let matched = '';
    if (categoryParam.includes('medical') || categoryParam.includes('health')) matched = 'Medical';
    else if (categoryParam.includes('education') || categoryParam.includes('tuition')) matched = 'Education';
    else if (categoryParam.includes('emergency') || categoryParam.includes('relief') || categoryParam.includes('crisis')) matched = 'Emergency';
    else if (
      categoryParam.includes('water') ||
      categoryParam.includes('agriculture') ||
      categoryParam.includes('community') ||
      categoryParam.includes('infrastructure')
    ) {
      matched = 'Community';
    }

    if (matched) {
      setSelectedCategory(matched);
      setActiveTab('causes');
    }
  }, []);

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((c) => matchCategory(c.category, selectedCategory));
  }, [campaigns, selectedCategory]);

  return (
    <div className="flex-1 flex flex-col bg-[#FBF9F6] font-sans text-gray-900">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-10">
        {/* Top Back Link & Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to fundraisers
          </Link>

          <Link
            href="/admin/sponsorships"
            className="text-xs font-semibold text-gray-400 hover:text-emerald-700 transition-colors flex items-center gap-1"
          >
            <span>Admin CMS</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        {/* Page Hero Header */}
        <div className="space-y-3 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-bold text-[#02A95C] border border-emerald-200">
            <ShieldCheck className="h-4 w-4" />
            <span>100% Direct Institutional Payouts</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#1A1A1A] tracking-[-0.02em]">
            Support Verified GCC Causes
          </h1>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Donate directly to verified medical surgeries, student tuition, emergency relief, and clean water wells across Uganda and East Africa.
          </p>

          {/* Mode Switcher Pills: Direct Causes vs General Fund */}
          <div className="inline-flex items-center bg-white p-1 rounded-full border border-gray-200 shadow-xs mt-4">
            <button
              type="button"
              onClick={() => setActiveTab('causes')}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'causes'
                  ? 'bg-[#02A95C] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Direct Causes ({campaigns.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('general')}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'general'
                  ? 'bg-[#02A95C] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              General Foundation Fund
            </button>
          </div>
        </div>

        {/* TAB 1: DIRECT VERIFIED CAUSES (Medical, Education, Emergency, Community) */}
        {activeTab === 'causes' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Category Filter Pills */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/80 pb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#02A95C]" />
                <h2 className="text-base font-bold text-[#1A1A1A]">
                  Choose a Cause to Support Directly
                </h2>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {DONATE_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? 'bg-[#1A1A1A] text-white shadow-xs'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Campaign Cards Grid */}
            {filteredCampaigns.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCampaigns.map((camp) => {
                  const percentRaised = Math.min(100, Math.round((camp.raisedUGX / camp.goalUGX) * 100));
                  return (
                    <div
                      key={camp.id}
                      className="bg-white rounded-3xl border border-[#E5E7EB] overflow-hidden shadow-subtle hover:shadow-card transition-all duration-200 flex flex-col justify-between group"
                    >
                      <div>
                        {/* Cover Photo */}
                        <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden">
                          <Link href={`/campaign/${camp.id}`} className="block w-full h-full">
                            <Image
                              src={camp.coverImage}
                              alt={camp.title}
                              fill
                              className="object-cover group-hover:scale-103 transition-transform duration-300"
                              sizes="(max-width: 768px) 100vw, 360px"
                            />
                          </Link>

                          {/* Category Badge */}
                          <div className="absolute top-3 left-3 flex items-center gap-2">
                            <span className="bg-[#02A95C] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                              {camp.category}
                            </span>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="p-5 space-y-2.5">
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span className="truncate">
                              {camp.location.facilityName || `${camp.location.district}, ${camp.location.country}`}
                            </span>
                          </div>

                          <h3 className="font-heading font-extrabold text-base text-[#1A1A1A] group-hover:text-[#02A95C] transition-colors line-clamp-2 leading-snug">
                            <Link href={`/campaign/${camp.id}`}>{camp.title}</Link>
                          </h3>

                          <p className="text-gray-600 text-xs line-clamp-2 leading-relaxed">
                            {camp.subtitle}
                          </p>
                        </div>
                      </div>

                      {/* Progress and Donate Action */}
                      <div className="p-5 pt-0 space-y-3">
                        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-[#02A95C] h-full rounded-full transition-all duration-300"
                            style={{ width: `${percentRaised}%` }}
                          />
                        </div>

                        <div className="flex items-baseline justify-between text-xs">
                          <span className="font-heading font-extrabold text-slate-900">
                            {formatUGX(camp.raisedUGX)} raised
                          </span>
                          <span className="text-gray-500">of {formatUGX(camp.goalUGX)}</span>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => openDonationModal(camp)}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-[#02A95C] hover:bg-[#028F4D] text-white font-bold text-xs py-2.5 px-4 shadow-xs transition-all"
                          >
                            <Heart className="w-3.5 h-3.5 fill-current" />
                            Donate
                          </button>
                          <Link
                            href={`/campaign/${camp.id}`}
                            className="px-4 py-2.5 rounded-full border border-gray-200 hover:border-gray-900 text-gray-700 text-xs font-bold transition-colors text-center"
                          >
                            Story
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-12 text-center space-y-3">
                <p className="font-bold text-gray-800">No {selectedCategory} causes found</p>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('All')}
                  className="rounded-full bg-[#02A95C] px-5 py-2 text-xs font-bold text-white hover:bg-[#028F4D]"
                >
                  View All Causes
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: GENERAL DONORBOX FORM */}
        {activeTab === 'general' && (
          <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
            <DonorboxWidget
              campaign="gcc-foundation"
              type="donation_form"
              enableAutoScroll={true}
              className="rounded-3xl shadow-card"
            />

            <div className="text-center space-y-2">
              <a
                href={DONORBOX_URL}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#02A95C] hover:bg-[#028F4D] text-white font-extrabold text-base py-3.5 px-8 shadow-sm transition-all"
              >
                <Heart className="h-5 w-5 fill-current" />
                Donate via Donorbox
              </a>
              <LegalAgreementNotice className="pt-2 max-w-sm mx-auto" actionText="By continuing to donate" />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
