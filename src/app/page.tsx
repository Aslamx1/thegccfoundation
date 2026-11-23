'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import CampaignCard from '@/components/CampaignCard';
import { useDonation, matchCategory } from '@/context/DonationContext';
import { useCurrency } from '@/context/CurrencyContext';
import Link from 'next/link';
import {
  ShieldCheck,
  Building2,
  FileCheck2,
  ArrowRight,
  Lock,
  Sparkles,
  Users,
  CheckCircle2,
} from 'lucide-react';

const FILTER_CATEGORIES = ['All', 'Medical', 'Education', 'Emergency', 'Community'];

export default function HomePage() {
  const { campaigns } = useDonation();
  const { formatUGX } = useCurrency();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');

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
      // Smooth scroll to the discover section if navigated via category query or hash
      setTimeout(() => {
        const el = document.getElementById('discover');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  }, []);

  // Robust category filtering that works seamlessly with all admin-added and verified causes
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((c) => matchCategory(c.category, selectedCategory));
  }, [campaigns, selectedCategory]);

  // Featured large card is the first item, next 4 form the 2x2 grid, remaining can be viewed
  const featuredCampaign = filteredCampaigns[0];
  const gridCampaigns = filteredCampaigns.slice(1, 5);
  const additionalCampaigns = filteredCampaigns.slice(5);

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Site navigation */}
      <Header />

      {/* Fundraising hero */}
      <Hero />

      {/* ================= SECTION: DISCOVER FUNDRAISERS ================= */}
      <section id="discover" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 w-full space-y-8 scroll-mt-24">
        
        {/* Section Header with Category Filter & Nav Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#02A95C] bg-[#02A95C]/10 border border-[#02A95C]/20 px-3 py-1 rounded-full mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Verified Causes &amp; Direct Impact</span>
            </div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#1A1A1A] tracking-[-0.02em]">
              Discover fundraisers inspired by what you care about
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Every campaign is vetted in-person with 100% direct payouts to hospital or school accounts.
            </p>
          </div>

          {/* Working Category Filter Pills: Medical, Education, Emergency, Community */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {FILTER_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#1A1A1A] text-white shadow-sm'
                    : 'bg-white text-gray-700 border border-[#E5E7EB] hover:border-gray-400 hover:bg-[#FBF9F6]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {featuredCampaign ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-5">
                <CampaignCard campaign={featuredCampaign} isLargeFeatured />
              </div>
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
                {gridCampaigns.map((camp) => (
                  <CampaignCard key={camp.id} campaign={camp} />
                ))}
              </div>
            </div>

            {/* If there are more campaigns in this category, display them in a neat responsive grid */}
            {additionalCampaigns.length > 0 && (
              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-sm font-bold text-gray-700 mb-4">
                  More {selectedCategory === 'All' ? '' : selectedCategory} Causes Needing Support
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {additionalCampaigns.map((camp) => (
                    <CampaignCard key={camp.id} campaign={camp} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#D7DED8] bg-[#F8FAF7] px-6 py-14 text-center">
            <h3 className="font-heading text-xl font-bold text-[#20251F]">
              {selectedCategory === 'All' ? 'No active fundraisers published yet' : `No ${selectedCategory.toLowerCase()} fundraisers yet`}
            </h3>
            <p className="mx-auto mt-2 max-w-lg text-sm text-gray-600">
              New verified community projects and fundraisers will appear here as soon as they are launched by the GCC Foundation team. 100% of donations will go directly to verified school and medical recipients.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              {selectedCategory !== 'All' ? (
                <button
                  type="button"
                  onClick={() => setSelectedCategory('All')}
                  className="rounded-full bg-[#02A95C] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#028F4D]"
                >
                  Browse all fundraisers
                </button>
              ) : (
                <Link
                  href="/admin/campaigns"
                  className="rounded-full bg-[#02A95C] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#028F4D]"
                >
                  Publish a Fundraiser
                </Link>
              )}
            </div>
          </div>
        )}
      </section>

      {/* ================= SECTION: HOW GCC FOUNDATION WORKS (Warm Cream #FBF9F6) ================= */}
      <section className="bg-[#FBF9F6] border-y border-[#E5E7EB] py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="max-w-2xl mx-auto text-center space-y-3">
            <span className="text-xs font-bold text-[#02A95C] uppercase tracking-wider bg-white border border-[#E5E7EB] px-3.5 py-1 rounded-full shadow-subtle">
              TRANSPARENT FROM DAY ONE
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#1A1A1A] tracking-[-0.02em]">
              How GCC Foundation works
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              A clear, guided way to raise support and follow how contributions are used.
            </p>
          </div>

          {/* 3-Step Horizontal Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Step 1 */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 space-y-4 shadow-subtle hover:shadow-card transition-all">
              <div className="w-12 h-12 rounded-full bg-[#E6EED8] text-[#2F4812] font-black text-xl flex items-center justify-center font-heading">
                1
              </div>
              <h3 className="font-heading font-bold text-xl text-[#1A1A1A]">
                Start your verified fundraiser
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed font-body">
                Set your target goal, add a clear story, and upload the patient's hospital proforma or school bursar quote. Our guided wizard ensures zero hassle.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 space-y-4 shadow-subtle hover:shadow-card transition-all">
              <div className="w-12 h-12 rounded-full bg-[#E6EED8] text-[#2F4812] font-black text-xl flex items-center justify-center font-heading">
                2
              </div>
              <h3 className="font-heading font-bold text-xl text-[#1A1A1A]">
                Share with friends &amp; community
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed font-body">
                Broadcast via WhatsApp, copy link, and social channels. Donors can give in US Dollars, Ugandan Shillings (UGX), or Kenyan Shillings (KES) using Mobile Money or Cards.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 space-y-4 shadow-subtle hover:shadow-card transition-all">
              <div className="w-12 h-12 rounded-full bg-[#E6EED8] text-[#2F4812] font-black text-xl flex items-center justify-center font-heading">
                3
              </div>
              <h3 className="font-heading font-bold text-xl text-[#1A1A1A]">
                100% Direct institutional payout
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed font-body">
                Funds are wired straight to the verified hospital, school, or contractor bank account. Receipts and bank payment slips are published publicly to the campaign ledger.
              </p>
            </div>

          </div>

          <div className="text-center pt-2">
            <Link
              href="/create-campaign"
              className="inline-flex items-center justify-center bg-[#02A95C] hover:bg-[#028F4D] text-white text-sm font-bold py-3 px-8 rounded-full shadow-sm hover:shadow transition-all"
            >
              Start a GCC Fundraiser
            </Link>
          </div>

        </div>
      </section>

      {/* ================= SECTION: FULL-WIDTH DARK FOREST GREEN (#012D19) GIVING GUARANTEE ================= */}
      <section className="bg-[#012D19] text-white py-16 sm:py-24 border-b border-[#02A95C]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            
            <div className="inline-flex items-center gap-2 bg-[#02A95C]/20 border border-[#02A95C]/40 text-[#02A95C] px-4 py-1.5 rounded-full text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>THE GCC FOUNDATION GIVING GUARANTEE</span>
            </div>

            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-[-0.02em] leading-tight">
              We've got you covered. <br className="hidden sm:inline" />
              100% donor protection on every shilling.
            </h2>

            <p className="text-base sm:text-lg text-gray-300 font-body leading-relaxed max-w-2xl mx-auto">
              In the rare event that something isn't right with a campaign, we guarantee a full refund. All medical and tuition funds are escrowed and sent directly to hospital and school accounts—never unverified private hands.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left pt-6">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-2">
                <div className="text-[#02A95C] font-bold text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Bedside In-Person Vetting</span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Field officers visit hospital wards and check National IDs (NIN) and LC1 recommendation letters.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-2">
                <div className="text-[#02A95C] font-bold text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Direct Institution Wires</span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Disbursements are wired via Bank EFT directly to hospital accounts (Mulago, Nsambya, etc.).
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-2">
                <div className="text-[#02A95C] font-bold text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Transparent Public Ledger</span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Itemized invoices and stamped bank deposit slips are posted directly on the campaign page.
                </p>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/how-it-works#guarantee"
                className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-[#02A95C] underline decoration-2 underline-offset-4 transition-colors"
              >
                <span>Read our full Giving Guarantee Charter</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
