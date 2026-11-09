'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCurrency } from '@/context/CurrencyContext';
import { useDonation } from '@/context/DonationContext';
import { CAMPAIGNS_DATA, GCC_INSTITUTIONAL_STATS } from '@/data/campaigns';
import { ShieldCheck, HeartHandshake, CheckCircle2, ArrowRight, Building2, MapPin, Clock } from 'lucide-react';

export default function Hero() {
  const { formatUGX } = useCurrency();
  const { openDonationModal } = useDonation();

  const featuredCampaign = CAMPAIGNS_DATA[0]; // Brenda Namubiru
  const percentRaised = Math.min(100, Math.round((featuredCampaign.raisedUGX / featuredCampaign.goalUGX) * 100));

  return (
    <section className="bg-[#FAF9F6] border-b border-[#E5E7EB] pt-8 pb-12 sm:pt-12 sm:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Anti-Scam Assurance Banner */}
        <div className="inline-flex items-center gap-2 bg-[#F4F7EE] border border-[#CDDCB3] text-[#2F4812] px-3.5 py-1.5 rounded-full text-xs font-semibold mb-6 shadow-subtle">
          <ShieldCheck className="w-4 h-4 text-[#3D5E16]" />
          <span>Zero-Intermediary Protocol: 100% of Medical & Tuition Disbursements Sent Directly to Verified Institution Accounts</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column (Editorial Split 7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#111827] tracking-tight leading-[1.15]">
              Real help for real people. Every shilling tracked to the{' '}
              <span className="text-[#3D5E16] underline decoration-[#AFC68A] decoration-wavy decoration-2 underline-offset-4">
                hospital bed or school ledger.
              </span>
            </h1>

            <p className="text-gray-800 text-base sm:text-lg leading-relaxed max-w-2xl font-body">
              GCC Foundation is East Africa’s institutional crowdfunding platform modeled for total financial transparency. We verify every patient bedside, upload itemized hospital invoices, and wire funds straight to the health facility or school bursar—never unverified private hands.
            </p>

            {/* Live Verified Fundraising Ledger Stats */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 sm:p-5 shadow-card">
              <div className="text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Live Audited Disbursement Metrics
                </span>
                <span className="font-mono text-[10px] text-gray-700">Audit Reg #KPMG-EA-2026</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
                <div className="pt-2 sm:pt-0">
                  <span className="text-xs text-gray-700 block">Total Disbursed</span>
                  <span className="font-heading font-black text-lg sm:text-xl text-[#3D5E16] tabular-nums tracking-tight">
                    {formatUGX(GCC_INSTITUTIONAL_STATS.totalDisbursedUGX)}
                  </span>
                </div>

                <div className="pt-2 sm:pt-0 sm:pl-4">
                  <span className="text-xs text-gray-700 block">Vetted Causes</span>
                  <span className="font-heading font-black text-lg sm:text-xl text-gray-900 tabular-nums">
                    {GCC_INSTITUTIONAL_STATS.verifiedCampaignsCount} Active
                  </span>
                </div>

                <div className="pt-2 sm:pt-0 sm:pl-4">
                  <span className="text-xs text-gray-700 block">Average Payout</span>
                  <span className="font-heading font-black text-lg sm:text-xl text-gray-900 tabular-nums">
                    {GCC_INSTITUTIONAL_STATS.averagePayoutTimeHours} Hours
                  </span>
                </div>

                <div className="pt-2 sm:pt-0 sm:pl-4">
                  <span className="text-xs text-gray-700 block">Direct-to-Institution</span>
                  <span className="font-heading font-black text-lg sm:text-xl text-[#D97706] tabular-nums">
                    {GCC_INSTITUTIONAL_STATS.directInstitutionPayoutRate}
                  </span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#campaigns-grid"
                className="inline-flex items-center gap-2 bg-[#3D5E16] hover:bg-[#2F4812] text-white font-bold text-sm px-6 py-3.5 rounded-lg shadow-sm transition-all hover:shadow hover:-translate-y-0.5"
              >
                <HeartHandshake className="w-4 h-4 text-[#AFC68A]" />
                <span>Explore Verified Causes</span>
              </a>

              <Link
                href="/how-it-works"
                className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-800 font-bold text-sm px-5 py-3.5 rounded-lg border border-[#E5E7EB] transition-all hover:border-gray-400"
              >
                <span>How Our Vetting Works</span>
                <ArrowRight className="w-4 h-4 text-gray-500" />
              </Link>
            </div>
          </div>

          {/* Right Column (Spotlight Featured Story 5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-elevated transition-all">
              
              {/* Card Header & Verification Ribbon */}
              <div className="bg-[#FAF9F6] border-b border-[#E5E7EB] px-4 py-2.5 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D97706] uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-[#D97706]"></span>
                  Urgent Emergency Spotlight
                </span>
                <span className="text-[11px] text-gray-700 font-mono">ID: {featuredCampaign.id}</span>
              </div>

              {/* Documentary Image Container */}
              <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden">
                <Image
                  src={featuredCampaign.coverImage}
                  alt={featuredCampaign.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 500px"
                  priority
                />
                
                {/* Photo Caption Stamp (Documentary Realism) */}
                <div className="absolute bottom-2 left-2 right-2 bg-black/75 backdrop-blur-sm text-white px-3 py-1.5 rounded text-[11px] flex items-center justify-between">
                  <span className="truncate">Photo: Ward 3B, Uganda Heart Institute (Mulago Complex)</span>
                  <span className="flex-shrink-0 text-emerald-400 font-mono text-[10px] ml-2">● Verified</span>
                </div>
              </div>

              {/* Content & Progress */}
              <div className="p-5 space-y-4">
                {/* Direct Hospital Badge */}
                <div className="flex items-center gap-2 bg-[#F4F7EE] border border-[#CDDCB3] rounded-lg p-2.5 text-xs">
                  <Building2 className="w-4 h-4 text-[#3D5E16] flex-shrink-0" />
                  <div className="leading-tight">
                    <span className="font-bold text-[#2F4812] block">Direct-to-Hospital Payout</span>
                    <span className="text-[11px] text-gray-700">Disbursed to: {featuredCampaign.payoutVerification.institutionName}</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-xs text-gray-700 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-700" />
                    <span>{featuredCampaign.location.facilityName}</span>
                  </div>
                  <h3 className="font-heading font-bold text-lg text-gray-900 leading-snug line-clamp-2">
                    <Link href={`/campaign/${featuredCampaign.id}`} className="hover:text-[#3D5E16] transition-colors">
                      {featuredCampaign.title}
                    </Link>
                  </h3>
                </div>

                {/* Progress Bar & Tabular Counter */}
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="font-heading font-extrabold text-xl text-[#3D5E16] tabular-nums">
                      {formatUGX(featuredCampaign.raisedUGX)}
                    </span>
                    <span className="text-xs text-gray-700 tabular-nums">
                      goal of <strong className="text-gray-900 font-medium">{formatUGX(featuredCampaign.goalUGX)}</strong>
                    </span>
                  </div>

                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-[#3D5E16] h-full rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${percentRaised}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-xs text-gray-700 pt-1">
                    <span className="tabular-nums font-semibold text-gray-800">{percentRaised}% funded</span>
                    <span className="tabular-nums font-semibold text-gray-800">{featuredCampaign.donorCount} donors</span>
                    <span className="flex items-center gap-1 text-amber-700 font-semibold">
                      <Clock className="w-3.5 h-3.5" />
                      {featuredCampaign.daysRemaining} days left
                    </span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => openDonationModal(featuredCampaign)}
                    className="flex-1 bg-[#3D5E16] hover:bg-[#2F4812] text-white font-bold text-sm py-3 px-4 rounded-lg shadow-sm transition-all text-center"
                  >
                    Donate to Brenda Now
                  </button>
                  <Link
                    href={`/campaign/${featuredCampaign.id}`}
                    className="px-4 py-3 bg-[#F9FAFB] hover:bg-gray-100 border border-[#E5E7EB] text-gray-800 text-sm font-semibold rounded-lg transition-colors text-center"
                  >
                    View Ledger
                  </Link>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
