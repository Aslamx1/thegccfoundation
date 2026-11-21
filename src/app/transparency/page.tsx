'use client';

import React from 'react';
import Header from '@/components/Header';
import { useCurrency } from '@/context/CurrencyContext';
import { GCC_INSTITUTIONAL_STATS } from '@/data/campaigns';
import {
  FileSpreadsheet,
  Download,
  ShieldCheck,
  Building2,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Percent,
  Receipt,
  Inbox
} from 'lucide-react';

interface DisbursementRecord {
  id: string;
  date: string;
  recipient: string;
  purpose: string;
  bankRef: string;
  amountUGX: number;
  auditedBy: string;
  status: string;
}

export default function TransparencyPage() {
  const { formatUGX } = useCurrency();

  // Initialized to empty array since platform has not started receiving donations yet
  const disbursements: DisbursementRecord[] = [];

  return (
    <div className="flex-1 flex flex-col bg-[#FAF9F6]">
      <Header />

      {/* Header Banner */}
      <section className="bg-white border-b border-[#E5E7EB] py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold text-[#3D5E16] uppercase tracking-wider bg-[#F4F7EE] border border-[#CDDCB3] px-3 py-1 rounded-full">
            REAL-TIME INSTITUTIONAL ACCOUNTABILITY
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-gray-900 tracking-tight">
            The GCC Foundation Public Ledger
          </h1>
          <p className="text-gray-800 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            We believe trust is earned through radical transparency. Inspect every bank wire, EFT transaction reference, and independent auditor report as contributions and disbursements occur.
          </p>
        </div>
      </section>

      {/* Main Ledger Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10 w-full">
        
        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-subtle space-y-2">
            <span className="text-xs font-bold text-gray-700 block">Total Disbursed to Causes</span>
            <span className="font-heading font-black text-2xl text-[#3D5E16] tabular-nums block">
              {formatUGX(GCC_INSTITUTIONAL_STATS.totalDisbursedUGX)}
            </span>
            <span className="text-[11px] text-gray-500 block">0 disbursements recorded to date</span>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-subtle space-y-2">
            <span className="text-xs font-bold text-gray-700 block">Platform Fee on Charity</span>
            <span className="font-heading font-black text-2xl text-gray-900 block">
              0.0%
            </span>
            <span className="text-[11px] text-gray-500 block">100% of all community gifts go directly to causes</span>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-subtle space-y-2">
            <span className="text-xs font-bold text-gray-700 block">Direct-to-Institution Rate</span>
            <span className="font-heading font-black text-2xl text-[#087443] block">
              100%
            </span>
            <span className="text-[11px] text-gray-500 block">Disbursed directly to verified hospital &amp; school accounts</span>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-subtle space-y-2">
            <span className="text-xs font-bold text-gray-700 block">Statutory Compliance</span>
            <span className="font-heading font-black text-2xl text-gray-900 block">
              Compliant
            </span>
            <span className="text-[11px] text-emerald-700 font-bold block">Registered under Uganda NGO Bureau</span>
          </div>
        </div>

        {/* Real-Time Bank Wire Ledger Table */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-heading font-extrabold text-xl text-gray-900">
                Institutional Bank Disbursements
              </h2>
              <p className="text-xs text-gray-600 mt-0.5">
                Live EFT transfers released to verified hospital treasuries, school bursars, and certified engineering contractors.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
              <span className="text-xs font-bold text-slate-700 font-mono">Ledger Ready (Awaiting First Disbursement)</span>
            </div>
          </div>

          {disbursements.length === 0 ? (
            /* Clean Zero-State Container */
            <div className="text-center py-16 px-6 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mx-auto shadow-2xs text-slate-400">
                <Receipt className="w-7 h-7 text-[#02A95C]" />
              </div>
              <div className="max-w-md mx-auto space-y-1.5">
                <h3 className="font-bold text-base text-slate-900">
                  No Bank Disbursements Recorded Yet
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  The website has not started receiving donations yet. As soon as campaigns receive gifts and funds are wired to verified hospital accounts, school treasuries, or community contractors, every bank EFT reference voucher will automatically be published here in real time.
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Audited Transparency Framework Active</span>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto border border-[#E5E7EB] rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF9F6] text-gray-700 font-bold border-b border-[#E5E7EB]">
                  <tr>
                    <th className="py-3.5 px-4">Date &amp; Voucher ID</th>
                    <th className="py-3.5 px-4">Recipient Institution</th>
                    <th className="py-3.5 px-4">Purpose</th>
                    <th className="py-3.5 px-4">Bank EFT Reference</th>
                    <th className="py-3.5 px-4 text-right">Amount (UGX)</th>
                    <th className="py-3.5 px-4 text-center">Audit Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-mono">
                  {disbursements.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-gray-900 block">{row.date}</span>
                        <span className="text-[10px] text-gray-600">{row.id}</span>
                      </td>
                      <td className="py-3.5 px-4 font-body font-bold text-gray-900">
                        {row.recipient}
                      </td>
                      <td className="py-3.5 px-4 font-body text-gray-800 max-w-xs">
                        {row.purpose}
                      </td>
                      <td className="py-3.5 px-4 text-gray-700 font-semibold text-[11px]">
                        {row.bankRef}
                      </td>
                      <td className="py-3.5 px-4 text-right font-black text-gray-900 tabular-nums text-sm">
                        {formatUGX(row.amountUGX)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Audited Financial Statements Downloads */}
        <div className="bg-[#FAF9F6] border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="font-heading font-extrabold text-lg text-gray-900">
              Statutory Governance &amp; Registration Documents
            </h3>
            <p className="text-xs text-gray-600 mt-0.5">
              In accordance with Section 39 of the Uganda NGO Act, GCC Foundation publishes statutory registration and governance records.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 flex items-center justify-between shadow-subtle hover:border-gray-400 transition-colors cursor-pointer">
              <div className="space-y-1">
                <strong className="text-xs font-bold text-gray-900 block">Uganda NGO Bureau Filing</strong>
                <span className="text-[11px] text-gray-500 block">PDF · Reg #INDR15982736NB</span>
              </div>
              <Download className="w-4 h-4 text-[#3D5E16]" />
            </div>

            <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 flex items-center justify-between shadow-subtle hover:border-gray-400 transition-colors cursor-pointer">
              <div className="space-y-1">
                <strong className="text-xs font-bold text-gray-900 block">Tax Exemption Certificate (URA)</strong>
                <span className="text-[11px] text-gray-500 block">PDF · Valid 2026/2027</span>
              </div>
              <Download className="w-4 h-4 text-[#3D5E16]" />
            </div>

            <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 flex items-center justify-between shadow-subtle hover:border-gray-400 transition-colors cursor-pointer">
              <div className="space-y-1">
                <strong className="text-xs font-bold text-gray-900 block">Charter &amp; Constitution</strong>
                <span className="text-[11px] text-gray-500 block">PDF · Verified NGO Bylaws</span>
              </div>
              <Download className="w-4 h-4 text-[#3D5E16]" />
            </div>
          </div>
        </div>

      </section>
    </div>
  );
}
