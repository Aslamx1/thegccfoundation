'use client';

import React from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import {
  HeartHandshake,
  ShieldCheck,
  Building2,
  CheckCircle2,
  ArrowRight,
  Globe,
  FileSpreadsheet,
} from 'lucide-react';

export default function CharityFundraisingPage() {
  return (
    <div className="flex-1 flex flex-col bg-[#FAF9F6]">
      <Header />

      <section className="bg-white border-b border-[#E5E7EB] py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold text-[#02A95C] uppercase tracking-wider bg-emerald-50 border border-emerald-200 px-3.5 py-1 rounded-full">
            0% PLATFORM FEE FOR NONPROFITS & INSTITUTIONS
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-gray-900 tracking-tight">
            Charity & Nonprofit Fundraising on GCC Foundation
          </h1>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Registered NGOs, Community-Based Organizations (CBOs), mission hospitals, and accredited schools use GCC Foundation to raise local and global support with 100% transparent direct bank settlement.
          </p>
          <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/create/fundraiser/category"
              className="inline-flex items-center gap-2 rounded-full bg-[#02A95C] hover:bg-[#028F4D] text-white font-bold text-sm px-8 py-3.5 shadow-sm transition-all"
            >
              <span>Start a Charity Fundraiser</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 rounded-full border border-gray-300 hover:border-gray-900 bg-white text-gray-900 font-bold text-sm px-7 py-3.5 transition-all"
            >
              <span>Create Nonprofit Account</span>
            </Link>
          </div>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-card space-y-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-[#02A95C] flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <h2 className="font-heading font-bold text-lg text-gray-900">
              Direct Institutional Bank EFT
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Funds are wired directly to your organization’s verified Stanbic, Centenary, DFCU, or Absa bank account—never personal accounts.
            </p>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-card space-y-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-[#02A95C] flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <h2 className="font-heading font-bold text-lg text-gray-900">
              Global Multi-Currency Giving
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Accept one-time and recurring monthly donations from supporters in East Africa, Europe, the UK, and North America via Donorbox.
            </p>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-card space-y-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-[#02A95C] flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h2 className="font-heading font-bold text-lg text-gray-900">
              Audited Public Ledger & CSV Reports
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Every campaign includes an itemized budget ledger, stamped receipt publishing, and one-click CSV donor exports for your board and auditors.
            </p>
          </div>
        </div>

        <section className="bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-10 shadow-card space-y-6">
          <h2 className="font-heading font-extrabold text-2xl text-gray-900">
            Nonprofit & Institutional Verification Checklist
          </h2>
          <p className="text-sm text-gray-600">
            To receive the official <strong>Verified Cause</strong> badge on GCC Foundation, prepare the following documentation during campaign setup:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-gray-800">
            {[
              'NGO Bureau Registration Certificate, CBO Certificate, or Ministry License',
              'Official Institutional Bank Account Confirmation or Stamped Bank Slip',
              'Authorized Representative National ID (NIN) or Passport',
              'Itemized Project Budget, Proforma Invoice, or Bill of Quantities (BoQ)',
            ].map((req) => (
              <div
                key={req}
                className="flex items-start gap-2.5 rounded-2xl bg-[#FAF9F6] border border-[#E5E7EB] p-4"
              >
                <CheckCircle2 className="w-4 h-4 text-[#02A95C] shrink-0 mt-0.5" />
                <span>{req}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
