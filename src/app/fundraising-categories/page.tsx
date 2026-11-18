'use client';

import React from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import {
  HeartPulse,
  GraduationCap,
  Flame,
  Droplets,
  Sprout,
  Building2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

const CATEGORIES = [
  {
    name: 'Medical Care & Hospital Surgery',
    icon: HeartPulse,
    filterParam: 'Medical+Care',
    description:
      'Raise urgent funds for pediatric heart surgery, oncology treatments, neonatal ICU incubators, orthopedic trauma procedures, and emergency hospital admissions.',
    verification:
      'Stamped hospital proforma invoice, patient admission card, and treating consultant registration.',
    payout:
      '100% wired directly via Bank EFT to accredited hospitals (e.g. Uganda Heart Institute, Mulago, Nsambya).',
  },
  {
    name: 'Education & School Tuition',
    icon: GraduationCap,
    filterParam: 'Education+%26+Tuition',
    description:
      'Support primary, secondary, vocational, and university students facing tuition arrears, UNEB national exam registration fees, or boarding requirements.',
    verification:
      'Official school bursar fee structure, student admission/index number, and guardian NIN.',
    payout: '100% wired directly to the school or university bursar bank account.',
  },
  {
    name: 'Emergency & Crisis Relief',
    icon: Flame,
    filterParam: 'Emergency+Relief',
    description:
      'Mobilize rapid community relief for mudslides, flood displacement, fire recovery, emergency food rations, medical kits, and temporary shelter.',
    verification:
      'Local Council (LC1) or District Disaster Committee confirmation and itemized supplier invoices.',
    payout: 'Settled directly with verified food millers, hardware depots, and medical suppliers.',
  },
  {
    name: 'Clean Water & Solar Boreholes',
    icon: Droplets,
    filterParam: 'Clean+Water+Wells',
    description:
      'Fund deep rotary borehole drilling, solar-powered village water pumps, school rainwater harvesting systems, and rural sanitation blocks.',
    verification:
      'Hydrogeological survey report, certified drilling contractor quote, and village water committee agreement.',
    payout: 'Released in audited engineering tranches (mobilization, drilling, pump testing).',
  },
  {
    name: 'Rural Agriculture & Women Co-ops',
    icon: Sprout,
    filterParam: 'Rural+Agriculture',
    description:
      'Equip registered rural women’s cooperatives and smallholder farmers with solar drip irrigation, drought-resistant seeds, and grain milling machinery.',
    verification:
      'Cooperative registration certificate, agricultural supplier proforma, and local leadership sign-off.',
    payout: 'Paid directly to certified agricultural equipment suppliers and cooperative accounts.',
  },
  {
    name: 'Community Infrastructure',
    icon: Building2,
    filterParam: 'Community+Infrastructure',
    description:
      'Build or rehabilitate rural maternity wards, classroom blocks, community health clinics, and solar micro-grids across East Africa.',
    verification:
      'Bill of Quantities (BoQ), registered contractor license, and community board oversight.',
    payout: 'Disbursed directly to verified construction and medical equipment contractors.',
  },
];

export default function FundraisingCategoriesPage() {
  return (
    <div className="flex-1 flex flex-col bg-[#FAF9F6]">
      <Header />

      <section className="bg-white border-b border-[#E5E7EB] py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold text-[#02A95C] uppercase tracking-wider bg-emerald-50 border border-emerald-200 px-3.5 py-1 rounded-full">
            FIND THE RIGHT CAUSE FOR YOUR STORY
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-gray-900 tracking-tight">
            Fundraising Categories on GCC Foundation
          </h1>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Choose the category that best matches your need. Every category is backed by our 0% platform fee and 100% direct-to-institution payout guarantee.
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.name}
                className="bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-8 shadow-card flex flex-col justify-between space-y-5"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#02A95C] flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h2 className="font-heading font-bold text-xl text-gray-900">{cat.name}</h2>
                  </div>

                  <p className="text-sm text-gray-700 leading-relaxed">{cat.description}</p>

                  <div className="rounded-2xl bg-[#FAF9F6] border border-[#E5E7EB] p-4 text-xs space-y-2 text-gray-700">
                    <div>
                      <strong className="text-gray-900 block">Required Verification Documents:</strong>
                      <span>{cat.verification}</span>
                    </div>
                    <div>
                      <strong className="text-[#02A95C] block">Direct Payout Settlement:</strong>
                      <span>{cat.payout}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <Link
                    href="/create/fundraiser/category"
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#02A95C] hover:bg-[#028F4D] text-white text-xs font-bold px-5 py-3 transition-colors"
                  >
                    <span>Start a Fundraiser</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href={`/?category=${cat.filterParam}#discover`}
                    className="rounded-full border border-gray-200 hover:border-gray-400 text-gray-800 text-xs font-bold px-5 py-3 transition-colors"
                  >
                    Browse Active Campaigns
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
