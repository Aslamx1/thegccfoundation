'use client';

import React from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  FileCheck2,
  Share2,
  Building2,
} from 'lucide-react';

const STEPS = [
  {
    step: '01',
    title: 'Choose Your Location & Cause Category',
    description:
      'Start by selecting the country and district where the beneficiary is located, then pick the category that fits your cause—Medical Care, Education & Tuition, Emergency Relief, Clean Water, or Rural Agriculture.',
    checklist: [
      'Select beneficiary country and district/city',
      'Choose the matching institutional category',
      'Identify the receiving hospital, school, or community project',
    ],
  },
  {
    step: '02',
    title: 'Set Your Verified Target Goal',
    description:
      'Enter your fundraising goal based on the official proforma invoice from the hospital billing desk, the school bursar fee circular, or the engineering contractor quotation.',
    checklist: [
      '0% GCC Foundation platform fee on charities',
      'Itemize surgical, tuition, or project costs clearly',
      'Adjust your target goal anytime if clinical needs change',
    ],
  },
  {
    step: '03',
    title: 'Tell an Honest, Empathetic Story & Add Photos',
    description:
      'Write a clear story explaining who needs support, what happened, and how every contribution will be used. Upload a real, high-clarity photo taken at the hospital ward, school, or community site.',
    checklist: [
      'Explain the diagnosis, admission timeline, or student need',
      'Use authentic, respectful candid photography (never stock photos)',
      'Include the patient file reference or student admission number',
    ],
  },
  {
    step: '04',
    title: 'Submit Organizer KYC & Institutional Payout Details',
    description:
      'Upload your National ID (NIN) or passport along with the hospital proforma invoice or school fee slip. Provide the institution’s official bank account so funds can be wired directly.',
    checklist: [
      'National ID (NIN) or passport verification',
      'Stamped hospital proforma or school bursar invoice',
      'Official hospital or school bank account for direct EFT settlement',
    ],
  },
  {
    step: '05',
    title: 'Launch, Share on WhatsApp & Track Direct Payouts',
    description:
      'Once published, share your campaign link with family, workplace groups, alumni networks, and diaspora supporters. As funds are disbursed to the institution, stamped bank EFT receipts appear on your public ledger.',
    checklist: [
      'One-click sharing to WhatsApp and social networks',
      'Post regular field and bedside updates for donors',
      '100% transparent public ledger of institutional disbursements',
    ],
  },
];

export default function HowToStartPage() {
  return (
    <div className="flex-1 flex flex-col bg-[#FAF9F6]">
      <Header />

      {/* Hero */}
      <section className="bg-white border-b border-[#E5E7EB] py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold text-[#02A95C] uppercase tracking-wider bg-emerald-50 border border-emerald-200 px-3.5 py-1 rounded-full">
            STEP-BY-STEP HELP & GUIDANCE
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-gray-900 tracking-tight">
            How to Start a Fundraiser on GCC Foundation
          </h1>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Everything you need to launch a verified medical, tuition, emergency, or community fundraiser in five guided steps—with 0% platform fees and 100% direct institutional payouts.
          </p>
          <div className="pt-3">
            <Link
              href="/create/fundraiser/category"
              className="inline-flex items-center gap-2 rounded-full bg-[#02A95C] hover:bg-[#028F4D] text-white font-bold text-sm sm:text-base px-8 py-3.5 shadow-sm transition-all"
            >
              <span>Start a Fundraiser Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Steps */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8 w-full">
        {STEPS.map((item) => (
          <div
            key={item.step}
            className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-card flex flex-col md:flex-row gap-6 items-start"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#02A95C] border border-emerald-200 flex items-center justify-center font-heading font-black text-2xl shrink-0">
              {item.step}
            </div>
            <div className="space-y-4 flex-1">
              <h2 className="font-heading font-bold text-xl text-gray-900">{item.title}</h2>
              <p className="text-sm text-gray-700 leading-relaxed">{item.description}</p>
              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                {item.checklist.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-2 rounded-xl bg-[#FAF9F6] border border-[#E5E7EB] p-3 text-xs text-gray-800"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#02A95C] shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}

        {/* Bottom CTA */}
        <div className="bg-[#012D19] text-white rounded-3xl p-8 sm:p-10 text-center space-y-5">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#02A95C] bg-[#02A95C]/20 px-3.5 py-1 rounded-full">
            <ShieldCheck className="w-4 h-4" />
            <span>READY IN MINUTES</span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl">
            Ready to launch your verified fundraiser?
          </h2>
          <p className="text-sm text-gray-300 max-w-xl mx-auto">
            Our guided setup walks you through every step and connects your campaign to our compliance and verification team.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/create/fundraiser/category"
              className="inline-flex items-center gap-2 rounded-full bg-[#02A95C] hover:bg-[#028F4D] text-white font-bold text-sm px-8 py-3.5 transition-all"
            >
              <span>Start a Fundraiser</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 hover:bg-white/10 text-white font-bold text-sm px-6 py-3.5 transition-all"
            >
              <span>View 4-Tier Vetting Protocol</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
