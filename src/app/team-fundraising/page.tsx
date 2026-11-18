'use client';

import React from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import {
  Users,
  CheckCircle2,
  Share2,
  ShieldCheck,
  ArrowRight,
  MessageCircle,
  Award,
} from 'lucide-react';

const TEAM_ROLES = [
  {
    role: '1. Lead KYC & Institutional Organizer',
    duties:
      'Creates the campaign, submits the National ID (NIN), LC1 recommendation letter, and official hospital proforma or school bursar invoice, and serves as the primary contact for GCC Foundation compliance officers.',
  },
  {
    role: '2. WhatsApp & Community Mobilization Captains',
    duties:
      'Coordinate outreach across family WhatsApp groups, workplace colleagues, church/mosque fellowships, and Old Boys / Old Girls (OB/OG) school cohorts to build early momentum.',
  },
  {
    role: '3. Diaspora & International Chapter Leads',
    duties:
      'Share the campaign with supporters in the UK, US, Canada, Europe, and Middle East so international donors can contribute seamlessly in USD, GBP, or EUR via Donorbox.',
  },
  {
    role: '4. Bedside & Field Update Coordinator',
    duties:
      'Posts regular progress updates, doctor reports, thank-you messages, and stamped bank EFT receipt confirmations to keep every donor informed and inspired.',
  },
];

export default function TeamFundraisingPage() {
  return (
    <div className="flex-1 flex flex-col bg-[#FAF9F6]">
      <Header />

      <section className="bg-white border-b border-[#E5E7EB] py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold text-[#02A95C] uppercase tracking-wider bg-emerald-50 border border-emerald-200 px-3.5 py-1 rounded-full">
            FUNDRAISE TOGETHER AS A COMMUNITY
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-gray-900 tracking-tight">
            Team Fundraising on GCC Foundation
          </h1>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Major medical procedures, borehole projects, and tuition drives reach their goals up to 3x faster when families, alumni cohorts, and community committees fundraise together.
          </p>
          <div className="pt-3">
            <Link
              href="/create/fundraiser/category"
              className="inline-flex items-center gap-2 rounded-full bg-[#02A95C] hover:bg-[#028F4D] text-white font-bold text-sm sm:text-base px-8 py-3.5 shadow-sm transition-all"
            >
              <span>Start a Team Fundraiser</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12 w-full">
        {/* How Team Committees Work */}
        <section className="space-y-6">
          <div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-gray-900">
              How to Structure Your Fundraising Committee
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Assigning clear roles within your family or community group makes outreach organized, transparent, and effective.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TEAM_ROLES.map((item) => (
              <div
                key={item.role}
                className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-card space-y-3"
              >
                <div className="flex items-center gap-2.5 text-[#02A95C]">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <h3 className="font-heading font-bold text-base text-gray-900">{item.role}</h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{item.duties}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why Team Fundraising Works */}
        <section className="bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-10 shadow-card space-y-6">
          <h2 className="font-heading font-extrabold text-2xl text-gray-900">
            Why Communities Choose GCC Foundation for Group Drives
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#02A95C] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-gray-900">Zero Treasurer Disputes</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Instead of collecting cash on personal mobile phones, all gifts are held in institutional trust and wired straight to the hospital or school bank account.
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#02A95C] flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-gray-900">Live Public Donor Wall</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Every committee member and supporter can see real-time progress, words of encouragement, and verified disbursement receipts on one shared page.
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#02A95C] flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-gray-900">Material & Volunteer Pledges</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Supporters can also pledge physical supplies (cement, medical consumables) or professional skills directly on the campaign page.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/create/fundraiser/category"
              className="inline-flex items-center gap-2 rounded-full bg-[#02A95C] hover:bg-[#028F4D] text-white font-bold text-sm px-7 py-3.5 transition-all"
            >
              <span>Launch Your Team Campaign</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
