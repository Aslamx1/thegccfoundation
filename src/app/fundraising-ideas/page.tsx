'use client';

import React from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';

const IDEAS = [
  {
    category: 'Education & Tuition',
    title: 'Sponsor-a-Term Classroom & Exam Fee Drive',
    description:
      'Unite alumni associations (Old Boys / Old Girls), parish members, or neighborhood groups to clear third-term tuition and UNEB national examination fees for bright orphaned or displaced students.',
    impact: '100% wired directly to the secondary school or university bursar account.',
  },
  {
    category: 'Medical Care',
    title: 'Life-Saving Pediatric Surgery & ICU Fund',
    description:
      'Rally family, coworkers, and diaspora friends around a child or parent needing urgent heart surgery, oncology care, or intensive care treatment at an accredited hospital.',
    impact: '100% wired directly to the hospital treasury with public receipt verification.',
  },
  {
    category: 'Clean Water',
    title: 'Diaspora Village Borehole Matching Challenge',
    description:
      'Challenge sons and daughters of your home district living abroad to match local village contributions dollar-for-dollar to drill a solar-powered borehole for 400+ households.',
    impact: 'Settled in audited engineering tranches with certified hydro-drilling contractors.',
  },
  {
    category: 'Celebrations & Milestones',
    title: 'Birthday, Wedding, or Graduation Giving Pledge',
    description:
      'Dedicate your birthday, wedding anniversary, or graduation milestone to funding a neonatal incubator, rural maternity ward beds, or school textbooks instead of receiving physical gifts.',
    impact: 'Gives guests a meaningful, transparent way to celebrate your milestone.',
  },
  {
    category: 'Rural Agriculture',
    title: 'Women’s Cooperative Drip Irrigation & Seed Bank',
    description:
      'Equip a registered village women’s farming group with solar drip-irrigation lines, water tanks, and drought-resistant seeds to build year-round food security and household income.',
    impact: 'Paid directly to certified agricultural suppliers and cooperative accounts.',
  },
  {
    category: 'Corporate & Workplace',
    title: 'Company CSR & Employee Matching Drive',
    description:
      'Mobilize colleagues at your bank, telecom, firm, or organization to adopt an emergency relief effort or rural school renovation, with corporate matching funds paid straight to the institution.',
    impact: 'Full downloadable audit trail and official institutional receipts for CSR reporting.',
  },
];

export default function FundraisingIdeasPage() {
  return (
    <div className="flex-1 flex flex-col bg-[#FAF9F6]">
      <Header />

      <section className="bg-white border-b border-[#E5E7EB] py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold text-[#02A95C] uppercase tracking-wider bg-emerald-50 border border-emerald-200 px-3.5 py-1 rounded-full">
            GET INSPIRATION FOR YOUR CAMPAIGN
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-gray-900 tracking-tight">
            Fundraising Ideas That Transform Communities
          </h1>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Discover high-impact ways individuals, families, alumni networks, and workplaces are raising verified support across East Africa.
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {IDEAS.map((idea) => (
            <div
              key={idea.title}
              className="bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-7 shadow-card flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                <span className="inline-block text-[11px] font-bold text-[#3D5E16] bg-[#F4F7EE] border border-[#CDDCB3] px-3 py-1 rounded-full">
                  {idea.category}
                </span>
                <h2 className="font-heading font-bold text-lg text-gray-900">{idea.title}</h2>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {idea.description}
                </p>
                <div className="rounded-xl bg-[#FAF9F6] border border-[#E5E7EB] p-3 text-xs text-gray-700">
                  <strong className="text-[#02A95C]">Direct Impact:</strong> {idea.impact}
                </div>
              </div>

              <Link
                href="/create/fundraiser/category"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#02A95C] hover:underline pt-1"
              >
                <span>Launch this fundraising idea</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
