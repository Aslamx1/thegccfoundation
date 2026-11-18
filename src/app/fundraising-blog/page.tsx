'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import { BookOpen, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';

const ARTICLES = [
  {
    id: 'direct-hospital-eft',
    tag: 'Medical Verification',
    readTime: '4 min read',
    date: 'November 2026',
    title: 'How Direct-to-Hospital EFT Payouts Protect Both Donors and Families',
    summary:
      'Why sending funds straight to accredited hospital accounts (Mulago, Uganda Heart Institute, Nsambya) increases donor confidence by 340% and accelerates surgical scheduling.',
    paragraphs: [
      'When a family faces an urgent surgical or intensive care bill in East Africa, the biggest barrier to raising money online is trust. Distant relatives, diaspora communities, and corporate donors want absolute certainty that their contribution will pay for the medical procedure itself.',
      'Under the GCC Foundation protocol, every medical fundraiser is linked directly to the treating facility’s official bank account and patient file reference. Our Chief Medical Officer audits the proforma invoice before the campaign goes live.',
      'As donations arrive, funds are wired via Bank EFT straight to the hospital treasury. Stamped deposit slips and official hospital receipts are uploaded directly to the campaign’s public ledger—eliminating intermediaries and giving hospitals the financial guarantee they need to proceed with life-saving care.',
    ],
  },
  {
    id: 'whatsapp-diaspora-mobilization',
    tag: 'Fundraising Strategy',
    readTime: '5 min read',
    date: 'November 2026',
    title: 'The Complete Guide to Mobilizing Community & Diaspora Support via WhatsApp',
    summary:
      'Over 78% of East African crowdfunding contributions originate from WhatsApp group broadcasts and personal voice notes. Learn how to structure your outreach.',
    paragraphs: [
      'In Uganda, Kenya, Tanzania, and across the global diaspora, WhatsApp is the primary engine of community generosity. However, simply dropping a link into a group chat rarely produces strong results.',
      'Successful organizers form a 5-person WhatsApp Mobilization Committee before launching publicly. This inner circle commits the first 10–15% of the goal within 24 hours so that when wider groups open the page, they see active momentum.',
      'Pair your GCC Foundation campaign link with a 3-sentence summary: (1) Who needs help and the exact diagnosis or school need, (2) Which verified hospital or school receives the 100% direct payout, and (3) The specific deadline. Post milestone updates every 48 hours to thank donors by name.',
    ],
  },
  {
    id: 'same-day-kyc-verification',
    tag: 'Organizer Checklist',
    readTime: '3 min read',
    date: 'October 2026',
    title: 'Preparing Your Hospital Proforma Invoice & LC1 Letter for Same-Day Verification',
    summary:
      'A step-by-step document checklist for organizers so our Kampala, Mbale, Soroti, and Gulu field teams can verify your campaign within 24 hours.',
    paragraphs: [
      'To receive the GCC Foundation "ID-Verified & Direct Payout" badge quickly, prepare three clear documents before starting the fundraiser wizard:',
      '1. Official Institutional Invoice: For medical cases, obtain a stamped proforma invoice or admission estimate from the hospital billing desk showing the patient’s name, file number, and official hospital bank details. For tuition cases, obtain the school bursar’s fee structure and bank slip.',
      '2. Organizer National ID (NIN) or Passport: A clear photo of the front and back of your National Identification Card confirming your legal identity.',
      '3. Relationship & Guardianship Confirmation: A brief recommendation letter stamped by your Local Council (LC1) Chairperson, parish leader, or treating ward administrator confirming your relationship to the beneficiary.',
    ],
  },
  {
    id: 'solar-boreholes-rural-impact',
    tag: 'Community Impact',
    readTime: '4 min read',
    date: 'October 2026',
    title: 'How Tranche-Based Engineering Payouts Deliver Permanent Clean Water Wells',
    summary:
      'Inside our 3-stage contractor disbursement model for rural borehole drilling and village solar water systems across Eastern and Northern Uganda.',
    paragraphs: [
      'Community infrastructure projects require strict engineering accountability. Instead of releasing 100% of raised funds upfront to a drilling contractor, GCC Foundation holds contributions in segregated trust and releases payments in three verified tranches.',
      'Tranche 1 (30%) covers rig mobilization and hydrogeological siting. Tranche 2 (40%) is released upon reaching target aquifer depth and casing installation. Tranche 3 (30%) is paid only after a 24-hour pump yield test and water quality certification are signed off by our field engineer and the village water committee.',
    ],
  },
];

export default function FundraisingBlogPage() {
  const [expandedId, setExpandedId] = useState<string | null>(ARTICLES[0].id);

  return (
    <div className="flex-1 flex flex-col bg-[#FAF9F6]">
      <Header />

      <section className="bg-white border-b border-[#E5E7EB] py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold text-[#02A95C] uppercase tracking-wider bg-emerald-50 border border-emerald-200 px-3.5 py-1 rounded-full">
            RESOURCES, TIPS & GUIDANCE
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-gray-900 tracking-tight">
            The GCC Foundation Fundraising Blog
          </h1>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            In-depth guides, field reports, and practical strategies from our medical auditors, community organizers, and verification officers across East Africa.
          </p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-6 w-full">
        {ARTICLES.map((article) => {
          const isOpen = expandedId === article.id;
          return (
            <article
              key={article.id}
              className="bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-8 shadow-card space-y-4"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-bold text-[#02A95C] bg-emerald-50 px-3 py-1 rounded-full">
                  {article.tag}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-500">{article.date}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-500">{article.readTime}</span>
              </div>

              <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-gray-900">
                {article.title}
              </h2>

              <p className="text-sm text-gray-600 leading-relaxed">{article.summary}</p>

              {isOpen && (
                <div className="pt-4 border-t border-gray-100 space-y-3.5 text-sm text-gray-800 leading-relaxed">
                  {article.paragraphs.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={() => setExpandedId(isOpen ? null : article.id)}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#02A95C] hover:underline pt-1"
              >
                <span>{isOpen ? 'Close article' : 'Read full article'}</span>
                {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </article>
          );
        })}

        <div className="bg-white border border-[#E5E7EB] rounded-3xl p-8 text-center space-y-4">
          <h3 className="font-heading font-extrabold text-xl text-gray-900">
            Ready to put these insights into action?
          </h3>
          <p className="text-sm text-gray-600 max-w-lg mx-auto">
            Start your verified fundraiser in minutes and share your story with your community.
          </p>
          <Link
            href="/create/fundraiser/category"
            className="inline-flex items-center gap-2 rounded-full bg-[#02A95C] hover:bg-[#028F4D] text-white font-bold text-sm px-7 py-3.5 transition-all"
          >
            <span>Start a Fundraiser</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}
