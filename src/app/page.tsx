'use client';

import React, { useState, useMemo } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import CampaignCard from '@/components/CampaignCard';
import { useDonation } from '@/context/DonationContext';
import { useCurrency } from '@/context/CurrencyContext';
import { Category } from '@/types';
import Link from 'next/link';
import {
  ShieldCheck,
  Building2,
  FileSpreadsheet,
  CheckCircle2,
  ArrowRight,
  Filter,
  Sparkles,
  HeartHandshake,
  Layers,
  HelpCircle,
  AlertCircle
} from 'lucide-react';

const CATEGORIES: Category[] = [
  'All',
  'Medical Care',
  'Education & Tuition',
  'Clean Water Wells',
  'Emergency Relief',
  'Rural Agriculture',
];

export default function HomePage() {
  const { campaigns } = useDonation();
  const { formatUGX } = useCurrency();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [sortBy, setSortBy] = useState<'urgent' | 'closest' | 'recent' | 'raised'>('urgent');

  // Filtered and Sorted campaigns
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((c) => {
      const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
      const matchesSearch =
        searchQuery === '' ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.location.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.payoutVerification.institutionName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'urgent') return (b.urgent ? 1 : 0) - (a.urgent ? 1 : 0);
      if (sortBy === 'closest') {
        const remainingA = a.goalUGX - a.raisedUGX;
        const remainingB = b.goalUGX - b.raisedUGX;
        return remainingA - remainingB;
      }
      if (sortBy === 'raised') return b.raisedUGX - a.raisedUGX;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [campaigns, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="flex-1 flex flex-col bg-[#FAF9F6]">
      {/* Sticky Top Header */}
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* Hero Section */}
      <Hero />

      {/* Main Campaign Discovery Section */}
      <section id="campaigns-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full space-y-8">
        
        {/* Section Heading & Filter Bar */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold text-[#3D5E16] uppercase tracking-wider block">
                Verified Community Needs
              </span>
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-gray-900 tracking-tight">
                Active Verified Campaigns
              </h2>
              <p className="text-xs sm:text-sm text-gray-800">
                Every cause undergoes field verification and itemized budget approval before publication.
              </p>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-700 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort campaigns by criteria"
                className="bg-white border border-[#E5E7EB] text-xs font-semibold text-gray-900 py-2 px-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#3D5E16]"
              >
                <option value="urgent">Most Urgent Clinical Need</option>
                <option value="closest">Closest to Target Goal</option>
                <option value="raised">Highest Amount Raised</option>
                <option value="recent">Recently Verified</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#3D5E16] text-white shadow-sm'
                    : 'bg-white text-gray-800 border border-[#E5E7EB] hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 3-Column Campaign Grid */}
        {filteredCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredCampaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-12 text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-gray-600 mx-auto" />
            <h3 className="font-heading font-bold text-base text-gray-800">No campaigns matched your search</h3>
            <p className="text-xs text-gray-800 max-w-sm mx-auto">
              Try searching for a different hospital name, district, or clear your category filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="bg-[#3D5E16] text-white text-xs font-bold px-4 py-2 rounded-lg"
            >
              Reset Filters
            </button>
          </div>
        )}

      </section>

      {/* Institutional Transparency & Anti-Scam Architecture Section */}
      <section className="bg-white border-y border-[#E5E7EB] py-14 sm:py-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="max-w-2xl mx-auto text-center space-y-3">
            <span className="text-[11px] font-bold text-[#D97706] uppercase tracking-wider bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              ANTI-SCAM ARCHITECTURE
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-gray-900 tracking-tight">
              Why GCC Foundation Is Different From Generic Crowdfunding
            </h2>
            <p className="text-xs sm:text-sm text-gray-800">
              Unregulated crowdfunding platforms allow unvetted personal campaigns with zero accountability. We enforce institutional financial safeguards at every single step.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            
            {/* Pillar 1 */}
            <div className="bg-[#FAF9F6] border border-[#E5E7EB] rounded-2xl p-6 space-y-4 hover:border-[#CDDCB3] transition-all">
              <div className="w-12 h-12 bg-[#F4F7EE] text-[#3D5E16] border border-[#CDDCB3] rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-lg text-gray-900">
                100% Direct-to-Institution Payout
              </h3>
              <p className="text-xs text-gray-800 leading-relaxed font-body">
                We never wire medical funds to personal mobile numbers when an established health facility exists. Disbursements are sent directly via EFT to verified hospital accounts (e.g. Uganda Heart Institute, Nsambya Hospital) or official school bursars.
              </p>
              <div className="pt-2 text-[11px] font-bold text-[#3D5E16] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Zero Private Intermediaries</span>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="bg-[#FAF9F6] border border-[#E5E7EB] rounded-2xl p-6 space-y-4 hover:border-[#CDDCB3] transition-all">
              <div className="w-12 h-12 bg-[#F4F7EE] text-[#3D5E16] border border-[#CDDCB3] rounded-xl flex items-center justify-center">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-lg text-gray-900">
                Itemized Invoices & Stamped Receipts
              </h3>
              <p className="text-xs text-gray-800 leading-relaxed font-body">
                Every campaign displays a line-item budget table with exact unit costs (e.g., cardiopulmonary bypass pack: UGX 7,800,000; hospital bed: UGX 4,450,000). Once funds are transferred, stamped bank vouchers and hospital receipts are published publicly.
              </p>
              <div className="pt-2 text-[11px] font-bold text-[#3D5E16] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Auditable Public Ledgers</span>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="bg-[#FAF9F6] border border-[#E5E7EB] rounded-2xl p-6 space-y-4 hover:border-[#CDDCB3] transition-all">
              <div className="w-12 h-12 bg-[#F4F7EE] text-[#3D5E16] border border-[#CDDCB3] rounded-xl flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-lg text-gray-900">
                LC1 & Bedside In-Person Vetting
              </h3>
              <p className="text-xs text-gray-800 leading-relaxed font-body">
                GCC field officers physically visit the hospital ward or community site before any fundraiser goes live. We verify Ugandan National ID (NIN) numbers, Local Council (LC1) recommendation letters, and lead physician signatures.
              </p>
              <div className="pt-2 text-[11px] font-bold text-[#3D5E16] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Physician & LC1 Sign-Off</span>
              </div>
            </div>

          </div>

          <div className="text-center pt-2">
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#3D5E16] hover:text-[#2F4812] underline decoration-2 underline-offset-4"
            >
              <span>Read the Full 4-Tier Verification Protocol & Whistleblower Charter</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* Banner: Need help starting a campaign? */}
      <section className="bg-[#F4F7EE] border-b border-[#CDDCB3] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-[#2F4812] uppercase tracking-wider">
              Facing an Urgent Hospital Bill or Community Need?
            </span>
            <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-gray-900">
              Start a Verified Fundraiser with GCC Foundation
            </h3>
            <p className="text-xs sm:text-sm text-gray-800 max-w-xl">
              0% platform fee. Guided KYC verification within 12 hours. We coordinate directly with your hospital or school bursar.
            </p>
          </div>

          <Link
            href="/create-campaign"
            className="inline-flex items-center gap-2 bg-[#3D5E16] hover:bg-[#2F4812] text-white text-xs font-bold px-6 py-3.5 rounded-lg shadow-sm transition-all whitespace-nowrap"
          >
            <span>Start a Fundraiser Now</span>
            <ArrowRight className="w-4 h-4 text-[#AFC68A]" />
          </Link>
        </div>
      </section>
    </div>
  );
}
