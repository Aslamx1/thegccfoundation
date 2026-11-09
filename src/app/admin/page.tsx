'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import { useCurrency } from '@/context/CurrencyContext';
import { useDonation } from '@/context/DonationContext';
import Link from 'next/link';
import {
  ShieldCheck,
  Building2,
  Lock,
  UserCheck,
  FileCheck2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  ExternalLink,
  Search
} from 'lucide-react';

export default function AdminCompliancePage() {
  const { campaigns } = useDonation();
  const { formatUGX } = useCurrency();

  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(campaigns[0].id);
  const [auditNote, setAuditNote] = useState('');
  const [approvedStatus, setApprovedStatus] = useState<Record<string, string>>({
    'gcc-med-001': 'Approved & Live',
    'gcc-wat-002': 'Approved & Live',
    'gcc-edu-003': 'Approved & Live',
    'gcc-rel-004': 'Approved & Live',
    'gcc-agr-005': 'Approved & Live',
    'gcc-med-006': 'Approved & Live',
  });

  const selectedCampaign = campaigns.find((c) => c.id === selectedCampaignId) || campaigns[0];

  const handleApproveTranche = (campaignId: string) => {
    alert(`Compliance Action: Authorized Bank EFT tranche for ${selectedCampaign.payoutVerification.institutionName}. Official bank slip generated.`);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#FAF9F6]">
      <Header />

      {/* Admin Top Banner */}
      <section className="bg-[#121E07] text-white border-b border-[#2F4812] py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#2F4812] border border-[#3D5E16] flex items-center justify-center text-[#AFC68A]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-base text-white">
                  Compliance Officer & Auditor Console
                </span>
                <span className="bg-[#3D5E16] text-[#E6EED8] text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  Staff Access
                </span>
              </div>
              <span className="text-xs text-gray-300">
                Auditor: <strong>Pauline Namukasa, FCCA</strong> (Lead Forensic Auditor · Ref: GCC-CMP-04)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-gray-300">
            <span>Audit Status: <strong className="text-emerald-400">All 142 Accounts Reconciled</strong></span>
          </div>
        </div>
      </section>

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-8">
        
        {/* KPI Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 space-y-1 shadow-subtle">
            <span className="text-[11px] text-gray-700 font-bold uppercase">Pending KYC Reviews</span>
            <span className="font-heading font-black text-2xl text-amber-600 block">2 Queue</span>
            <span className="text-[10px] text-gray-700">SLA: Under 12 Hours</span>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 space-y-1 shadow-subtle">
            <span className="text-[11px] text-gray-700 font-bold uppercase">Active Hospital Accounts</span>
            <span className="font-heading font-black text-2xl text-[#3D5E16] block">18 Facilities</span>
            <span className="text-[10px] text-gray-700">Mulago, Nsambya, Soroti</span>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 space-y-1 shadow-subtle">
            <span className="text-[11px] text-gray-700 font-bold uppercase">Whistleblower Reports</span>
            <span className="font-heading font-black text-2xl text-emerald-600 block">0 Open</span>
            <span className="text-[10px] text-gray-700">100% Resolved</span>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 space-y-1 shadow-subtle">
            <span className="text-[11px] text-gray-700 font-bold uppercase">EFT Payouts Today</span>
            <span className="font-heading font-black text-2xl text-gray-900 block">UGX 17.9M</span>
            <span className="text-[10px] text-gray-700">3 Bank Wires Dispatched</span>
          </div>
        </div>

        {/* 2-Column Auditor Inspection View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Campaign List (4 cols) */}
          <div className="lg:col-span-4 bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-card space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                Audited Campaigns ({campaigns.length})
              </span>
              <span className="text-[11px] text-gray-700">Click to Inspect</span>
            </div>

            <div className="space-y-2">
              {campaigns.map((c) => {
                const isSelected = c.id === selectedCampaignId;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCampaignId(c.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-[#3D5E16] bg-[#F4F7EE] ring-1 ring-[#3D5E16]'
                        : 'border-[#E5E7EB] hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] text-gray-700 font-mono mb-1">
                      <span>{c.id}</span>
                      <span className="text-[#3D5E16] font-bold">
                        {approvedStatus[c.id] || 'Verified'}
                      </span>
                    </div>
                    <strong className="text-xs font-bold text-gray-900 block line-clamp-1">
                      {c.title}
                    </strong>
                    <div className="flex items-center justify-between text-[11px] text-gray-700 pt-1 font-mono">
                      <span>{formatUGX(c.raisedUGX)} raised</span>
                      <span>Goal: {formatUGX(c.goalUGX)}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detailed Campaign Compliance Inspection Dossier (8 cols) */}
          <div className="lg:col-span-8 bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-card space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
              <div>
                <span className="text-[10px] font-bold text-[#3D5E16] uppercase font-mono">
                  COMPLIANCE AUDIT DOSSIER · {selectedCampaign.id}
                </span>
                <h2 className="font-heading font-extrabold text-xl text-gray-900 mt-0.5">
                  {selectedCampaign.title}
                </h2>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 w-max">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Active Verified
              </span>
            </div>

            {/* Verification Checklist */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-gray-900 uppercase tracking-wider block">
                Institutional Verification Checklist:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl p-3.5 space-y-1">
                  <span className="text-[10px] text-gray-700 uppercase font-bold block">1. Organizer KYC</span>
                  <strong className="text-gray-900 block">{selectedCampaign.organizer.name}</strong>
                  <span className="font-mono text-[11px] text-[#3D5E16] block">{selectedCampaign.organizer.ninOrIdMasked}</span>
                  <span className="text-gray-700 text-[11px] block">{selectedCampaign.organizer.residence}</span>
                  <span className="text-emerald-700 font-bold text-[10px]">✓ National ID Matches Civil Registry</span>
                </div>

                <div className="bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl p-3.5 space-y-1">
                  <span className="text-[10px] text-gray-700 uppercase font-bold block">2. Hospital / Institution Treasury</span>
                  <strong className="text-gray-900 block">{selectedCampaign.payoutVerification.institutionName}</strong>
                  <span className="font-mono text-[11px] text-gray-700 block">{selectedCampaign.payoutVerification.bankName}</span>
                  <span className="font-mono text-[11px] text-gray-700 block">{selectedCampaign.payoutVerification.accountNumberMasked}</span>
                  <span className="text-emerald-700 font-bold text-[10px]">✓ Direct EFT Destination Authenticated</span>
                </div>
              </div>
            </div>

            {/* Line-Item Ledger Status */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-gray-900 uppercase tracking-wider block">
                Approved Line-Item Expenses:
              </span>
              <div className="border border-[#E5E7EB] rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-[#FAF9F6] text-gray-700 font-bold border-b border-[#E5E7EB]">
                    <tr>
                      <th className="py-2.5 px-3">Item</th>
                      <th className="py-2.5 px-3">Recipient</th>
                      <th className="py-2.5 px-3 text-right">Amount</th>
                      <th className="py-2.5 px-3 text-center">Ledger Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-mono">
                    {selectedCampaign.itemizedBudget.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="py-2.5 px-3 font-body font-semibold text-gray-900">{item.item}</td>
                        <td className="py-2.5 px-3 font-body text-gray-700">{item.recipientEntity}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-gray-900 tabular-nums">
                          {formatUGX(item.amountUGX)}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            item.status === 'Verified Paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.status === 'Disbursed'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Compliance Officer Actions */}
            <div className="bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl p-4 space-y-3">
              <span className="text-xs font-bold text-gray-900 block">Compliance Officer Action Bar:</span>
              
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleApproveTranche(selectedCampaign.id)}
                  className="bg-[#3D5E16] hover:bg-[#2F4812] text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow transition-colors flex items-center gap-1.5"
                >
                  <Building2 className="w-4 h-4 text-[#AFC68A]" />
                  <span>Authorize Hospital EFT Wire Tranche</span>
                </button>

                <Link
                  href={`/campaign/${selectedCampaign.id}`}
                  className="bg-white hover:bg-gray-50 border border-[#E5E7EB] text-gray-800 text-xs font-bold px-4 py-2.5 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <span>View Public Donor Ledger</span>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-600" />
                </Link>
              </div>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
