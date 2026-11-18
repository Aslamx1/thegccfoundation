'use client';

import React from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import {
  ShieldCheck,
  Building2,
  FileCheck2,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ArrowRight,
  PhoneCall,
  Mail,
  Scale
} from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="flex-1 flex flex-col bg-[#FAF9F6]">
      <Header />

      {/* Hero Header */}
      <section className="bg-white border-b border-[#E5E7EB] py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold text-[#3D5E16] uppercase tracking-wider bg-[#F4F7EE] border border-[#CDDCB3] px-3 py-1 rounded-full">
            GOVERNANCE & ANTI-SCAM ARCHITECTURE
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-gray-900 tracking-tight">
            How Our 4-Tier Vetting Protocol Works
          </h1>
          <p className="text-gray-800 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Traditional crowdfunding has a trust problem: unregulated campaigns, fake medical photos, and money diverted to private pockets. At GCC Foundation, we built a zero-intermediary institutional safeguard.
          </p>
        </div>
      </section>

      {/* 4-Tier Protocol Steps */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
        
        <div className="space-y-8">
          
          {/* Tier 1 */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-card flex flex-col md:flex-row gap-6 items-start">
            <div className="w-14 h-14 rounded-2xl bg-[#F4F7EE] text-[#3D5E16] border border-[#CDDCB3] flex items-center justify-center font-heading font-black text-2xl flex-shrink-0">
              01
            </div>
            <div className="space-y-3 flex-1">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="font-heading font-bold text-xl text-gray-900">
                  Bedside Physical Verification & Real-Time Photography
                </h3>
                <span className="bg-[#FAF9F6] border border-gray-200 text-gray-800 text-[11px] font-mono px-2.5 py-0.5 rounded">
                  Field Team In-Person
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-800 leading-relaxed font-body">
                Our local field officers (stationed in Kampala, Mbale, Soroti, and Gulu) physically visit the hospital ward, school, or community borehole site. We photograph the actual patient bedside with current time and location stamps. No stock images or AI-generated photos are ever accepted.
              </p>
              <div className="bg-[#FAF9F6] border border-[#E5E7EB] rounded-lg p-3 text-xs text-gray-800 space-y-1">
                <strong>Enforced Evidence:</strong> High-resolution photos showing patient wristband, hospital admission card, and treating consultant notes.
              </div>
            </div>
          </div>

          {/* Tier 2 */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-card flex flex-col md:flex-row gap-6 items-start">
            <div className="w-14 h-14 rounded-2xl bg-[#F4F7EE] text-[#3D5E16] border border-[#CDDCB3] flex items-center justify-center font-heading font-black text-2xl flex-shrink-0">
              02
            </div>
            <div className="space-y-3 flex-1">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="font-heading font-bold text-xl text-gray-900">
                  Institutional Invoice Audit & Lead Physician Sign-Off
                </h3>
                <span className="bg-[#FAF9F6] border border-gray-200 text-gray-800 text-[11px] font-mono px-2.5 py-0.5 rounded">
                  Dr. Arthur Ssekandi, CMO
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-800 leading-relaxed font-body">
                We independently contact the hospital accounts department (e.g. Uganda Heart Institute, St. Francis Hospital Nsambya, Mulago Complex) to audit the proforma invoice. Our Chief Medical Officer verifies that the prescribed procedure, surgical consumables, and intensive care duration align with standard clinical tariffs.
              </p>
              <div className="bg-[#FAF9F6] border border-[#E5E7EB] rounded-lg p-3 text-xs text-gray-800 space-y-1">
                <strong>Enforced Evidence:</strong> Stamped proforma invoice with official hospital registry number and treating physician’s Uganda Medical and Dental Practitioners Council (UMDPC) registration license.
              </div>
            </div>
          </div>

          {/* Tier 3 */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-card flex flex-col md:flex-row gap-6 items-start">
            <div className="w-14 h-14 rounded-2xl bg-[#F4F7EE] text-[#3D5E16] border border-[#CDDCB3] flex items-center justify-center font-heading font-black text-2xl flex-shrink-0">
              03
            </div>
            <div className="space-y-3 flex-1">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="font-heading font-bold text-xl text-gray-900">
                  National ID (NIN) & Local Council (LC1) Clearance
                </h3>
                <span className="bg-[#FAF9F6] border border-gray-200 text-gray-800 text-[11px] font-mono px-2.5 py-0.5 rounded">
                  National ID System
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-800 leading-relaxed font-body">
                The campaign organizer must provide an authenticated Ugandan National Identification Card (NIN) and an official recommendation letter signed and stamped by their Local Council (LC1) Chairperson confirming relationship to the patient and legal guardianship.
              </p>
              <div className="bg-[#FAF9F6] border border-[#E5E7EB] rounded-lg p-3 text-xs text-gray-800 space-y-1">
                <strong>Enforced Evidence:</strong> High-res scan of National ID card (cross-checked against civil registry) and stamped LC1 letter.
              </div>
            </div>
          </div>

          {/* Tier 4 */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-card flex flex-col md:flex-row gap-6 items-start">
            <div className="w-14 h-14 rounded-2xl bg-[#F4F7EE] text-[#3D5E16] border border-[#CDDCB3] flex items-center justify-center font-heading font-black text-2xl flex-shrink-0">
              04
            </div>
            <div className="space-y-3 flex-1">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="font-heading font-bold text-xl text-gray-900">
                  100% Direct-to-Institution Payout & Public Ledger
                </h3>
                <span className="bg-[#FAF9F6] border border-gray-200 text-gray-800 text-[11px] font-mono px-2.5 py-0.5 rounded">
                  Zero Intermediaries
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-800 leading-relaxed font-body">
                Funds NEVER pass through personal accounts when an institutional account exists. We wire payments directly to the hospital treasury or school bursar via Bank EFT or registered institutional merchant codes. As soon as the transfer clears, the stamped bank deposit slip is published on the campaign ledger.
              </p>
              <div className="bg-[#FAF9F6] border border-[#E5E7EB] rounded-lg p-3 text-xs text-gray-800 space-y-1">
                <strong>Enforced Evidence:</strong> Downloadable PDF bank EFT confirmations, official hospital receipt vouchers, and surgeon discharge summaries.
              </div>
            </div>
          </div>

        </div>

        {/* Anti-Fraud Guarantee Section */}
        <div id="guarantee" className="bg-[#1F310C] text-[#E6EED8] rounded-2xl p-8 sm:p-10 border border-[#2F4812] space-y-6">
          <div className="flex items-center gap-3">
            <Scale className="w-8 h-8 text-[#AFC68A]" />
            <div>
              <h3 className="font-heading font-extrabold text-2xl text-white">
                GCC Foundation 100% Anti-Fraud Guarantee
              </h3>
              <span className="text-xs text-gray-300">
                Institutional protection charter established under Uganda NGO Bureau Reg #INDR15982736NB
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-gray-200 leading-relaxed">
            <p>
              In the unlikely event that a campaign organizer provides falsified documentation that escapes initial scrutiny, or if a hospital confirms that a procedure was cancelled or overfunded, <strong className="text-white">GCC Foundation guarantees a 100% full refund</strong> to the donor's original payment method (MTN Mobile Money, Airtel Money, or Card).
            </p>
            <p>
              Alternatively, donors may opt to redirect their contributions to our emergency pediatric pool, where funds immediately clear awaiting infant heart surgery and neonatal ICU incubators.
            </p>
          </div>
        </div>

        {/* Whistleblower Channel */}
        <div id="whistleblower" className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-card space-y-4">
          <div className="flex items-center gap-2 text-amber-700">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-heading font-bold text-lg text-gray-900">
              Confidential Whistleblower & Fraud Hotdesk
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-gray-800 leading-relaxed">
            If you have reason to suspect any irregularities, inflated hospital bills, or identity impersonation in any campaign published on GCC Foundation, contact our independent compliance desk immediately. All tips are treated with strict legal confidentiality.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs">
            <a
              href="mailto:compliance@gccfoundation.org"
              className="inline-flex items-center gap-1.5 bg-[#FAF9F6] border border-[#E5E7EB] hover:border-gray-400 text-gray-900 font-bold px-4 py-2.5 rounded-lg transition-colors"
            >
              <Mail className="w-4 h-4 text-[#3D5E16]" />
              <span>compliance@gccfoundation.org</span>
            </a>
            <a
              href="tel:+256703601200"
              className="inline-flex items-center gap-1.5 bg-[#FAF9F6] border border-[#E5E7EB] hover:border-gray-400 text-gray-900 font-bold px-4 py-2.5 rounded-lg transition-colors"
            >
              <PhoneCall className="w-4 h-4 text-[#3D5E16]" />
              <span>Hotline: +256 (0) 703 601 200</span>
            </a>
          </div>
        </div>

      </section>
    </div>
  );
}
