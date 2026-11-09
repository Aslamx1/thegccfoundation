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
  Percent
} from 'lucide-react';

export default function TransparencyPage() {
  const { formatUGX } = useCurrency();

  const mockDisbursements = [
    {
      id: 'DISB-2026-091',
      date: '04 Nov 2026',
      recipient: 'Uganda Heart Institute Accounts Treasury',
      purpose: 'Cardiopulmonary Bypass Kit & ICU Bed (Brenda Namubiru)',
      bankRef: 'EFT-STB-UG-884129',
      amountUGX: 4450000,
      auditedBy: 'Pauline Namukasa, FCCA',
      status: 'Bank Settled',
    },
    {
      id: 'DISB-2026-088',
      date: '02 Nov 2026',
      recipient: 'Teso Hydro-Drill Engineering Services Ltd',
      purpose: '110m Rotary Drilling & Casing Tranche 2 (Soroti Water)',
      bankRef: 'EFT-CENT-UG-109284',
      amountUGX: 16500000,
      auditedBy: 'Eng. Francis Opio, PE',
      status: 'Bank Settled',
    },
    {
      id: 'DISB-2026-084',
      date: '29 Oct 2026',
      recipient: 'St. Peter’s Secondary School Bursar Account',
      purpose: 'Term III Tuition Relief for 38 Displaced Girls (Tororo)',
      bankRef: 'EFT-DFCU-UG-774190',
      amountUGX: 7980000,
      auditedBy: 'Florence Nabwire',
      status: 'Bank Settled',
    },
    {
      id: 'DISB-2026-080',
      date: '24 Oct 2026',
      recipient: 'Surgipharm Uganda Ltd / Nsambya Hospital',
      purpose: 'Neonatal Intensive Care Unit Incubator #1 Delivery',
      bankRef: 'EFT-CENT-UG-991823',
      amountUGX: 13500000,
      auditedBy: 'Pauline Namukasa, FCCA',
      status: 'Bank Settled',
    },
    {
      id: 'DISB-2026-075',
      date: '20 Oct 2026',
      recipient: 'Bugisu Grain Millers & Mbale Hardware Depot',
      purpose: 'Bududa Mudslide Emergency Posho & 38 Heavy Tarpaulins',
      bankRef: 'EFT-ABSA-UG-339182',
      amountUGX: 11800000,
      auditedBy: 'Dr. Moses Wepukhulu',
      status: 'Bank Settled',
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#FAF9F6]">
      <Header />

      {/* Header */}
      <section className="bg-white border-b border-[#E5E7EB] py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold text-[#3D5E16] uppercase tracking-wider bg-[#F4F7EE] border border-[#CDDCB3] px-3 py-1 rounded-full">
            REAL-TIME INSTITUTIONAL ACCOUNTABILITY
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-gray-900 tracking-tight">
            The GCC Foundation Public Ledger
          </h1>
          <p className="text-gray-800 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            We believe trust is earned through radical transparency. Inspect every bank wire, EFT transaction reference, and independent auditor report.
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
            <span className="text-[11px] text-gray-700 block">Wired to 142 health facilities & schools</span>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-subtle space-y-2">
            <span className="text-xs font-bold text-gray-700 block">Platform Fee on Charity</span>
            <span className="font-heading font-black text-2xl text-gray-900 block">
              0.0%
            </span>
            <span className="text-[11px] text-gray-700 block">100% of cause funds go to the field</span>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-subtle space-y-2">
            <span className="text-xs font-bold text-gray-700 block">Direct-to-Institution Rate</span>
            <span className="font-heading font-black text-2xl text-[#D97706] block">
              94.6%
            </span>
            <span className="text-[11px] text-gray-700 block">5.4% vetted community cooperatives</span>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-subtle space-y-2">
            <span className="text-xs font-bold text-gray-700 block">Audited by KPMG East Africa</span>
            <span className="font-heading font-black text-2xl text-gray-900 block">
              Unqualified
            </span>
            <span className="text-[11px] text-emerald-700 font-bold block">Clean Audit Opinion 2025/2026</span>
          </div>
        </div>

        {/* Real-Time Bank Wire Ledger Table */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-heading font-extrabold text-xl text-gray-900">
                Recent Institutional Bank Disbursements
              </h2>
              <p className="text-xs text-gray-800">
                Live EFT transfers released to verified hospital treasuries, school bursars, and certified engineering contractors.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-xs font-bold text-emerald-800 font-mono">Real-Time Ledger</span>
            </div>
          </div>

          <div className="overflow-x-auto border border-[#E5E7EB] rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F6] text-gray-700 font-bold border-b border-[#E5E7EB]">
                <tr>
                  <th className="py-3.5 px-4">Date & Voucher ID</th>
                  <th className="py-3.5 px-4">Recipient Institution</th>
                  <th className="py-3.5 px-4">Purpose</th>
                  <th className="py-3.5 px-4">Bank EFT Reference</th>
                  <th className="py-3.5 px-4 text-right">Amount (UGX)</th>
                  <th className="py-3.5 px-4 text-center">Audit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-mono">
                {mockDisbursements.map((row) => (
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
        </div>

        {/* Audited Financial Statements Downloads */}
        <div className="bg-[#FAF9F6] border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="font-heading font-extrabold text-lg text-gray-900">
              Download Independent Audit Reports
            </h3>
            <p className="text-xs text-gray-800">
              In accordance with Section 39 of the Uganda NGO Act, GCC Foundation publishes full statutory financial statements prepared in accordance with IFRS.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 flex items-center justify-between shadow-subtle hover:border-gray-400 transition-colors cursor-pointer">
              <div className="space-y-1">
                <strong className="text-xs font-bold text-gray-900 block">KPMG Annual Audit 2025/2026</strong>
                <span className="text-[11px] text-gray-600 block">PDF · 3.4 MB · Unqualified</span>
              </div>
              <Download className="w-4 h-4 text-[#3D5E16]" />
            </div>

            <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 flex items-center justify-between shadow-subtle hover:border-gray-400 transition-colors cursor-pointer">
              <div className="space-y-1">
                <strong className="text-xs font-bold text-gray-900 block">Uganda NGO Bureau Filing</strong>
                <span className="text-[11px] text-gray-600 block">PDF · 1.8 MB · Reg #INDR15982736NB</span>
              </div>
              <Download className="w-4 h-4 text-[#3D5E16]" />
            </div>

            <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 flex items-center justify-between shadow-subtle hover:border-gray-400 transition-colors cursor-pointer">
              <div className="space-y-1">
                <strong className="text-xs font-bold text-gray-900 block">Tax Exemption Certificate (URA)</strong>
                <span className="text-[11px] text-gray-600 block">PDF · 820 KB · Valid 2026/2027</span>
              </div>
              <Download className="w-4 h-4 text-[#3D5E16]" />
            </div>
          </div>
        </div>

      </section>
    </div>
  );
}
