'use client';

import React from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import { Lightbulb, CheckCircle2, ArrowRight } from 'lucide-react';

const TIPS = [
  {
    number: '01',
    title: 'Publish an Itemized, Transparent Budget',
    description:
      'Supporters give up to 2.5x more when they can see exact line items—such as "USh 4,500,000 for Cardiac Bypass Consumables" and "USh 1,800,000 for 5 Days ICU Care"—instead of a single unexplained figure.',
    actionTip: 'Copy the exact line items from your hospital proforma invoice or school fee circular.',
  },
  {
    number: '02',
    title: 'Lead with Authentic, Respectful Photos',
    description:
      'Use clear, real photos from the hospital ward, school compound, or village water site. Never use stock images. Authentic photos build immediate trust and connection with your supporters.',
    actionTip: 'Include at least one photo showing the real setting or project location.',
  },
  {
    number: '03',
    title: 'Secure Your First 10 Donors Within 48 Hours',
    description:
      'Before broadcasting your link to large public groups, privately reach out to 5–10 close family members, friends, or colleagues to make the first contributions. Visitors are far more likely to donate when a campaign already has momentum.',
    actionTip: 'Send personal WhatsApp voice notes to your closest circle on launch day.',
  },
  {
    number: '04',
    title: 'Emphasize the 100% Direct Institutional Payout',
    description:
      'Always highlight in your WhatsApp and social media messages that GCC Foundation wires 100% of raised funds directly to the verified hospital or school bank account. This removes donor hesitation.',
    actionTip: 'Mention the name of the receiving hospital or school in the first sentence of your share message.',
  },
  {
    number: '05',
    title: 'Post Short Field Updates Every 3–5 Days',
    description:
      'Keep supporters engaged by posting brief updates on the campaign page—such as doctor rounds, surgical scheduling, exam registration, or borehole drilling depth.',
    actionTip: 'Each time you post an update, re-share the campaign link with your WhatsApp groups.',
  },
  {
    number: '06',
    title: 'Thank Donors Publicly & Share Stamped Receipts',
    description:
      'Acknowledge supporters by name and post stamped hospital receipts or bank EFT confirmations as soon as tranches are disbursed. Visible gratitude often inspires repeat gifts.',
    actionTip: 'Share a thank-you update whenever you cross 25%, 50%, 75%, and 100% of your goal.',
  },
];

export default function FundraisingTipsPage() {
  return (
    <div className="flex-1 flex flex-col bg-[#FAF9F6]">
      <Header />

      <section className="bg-white border-b border-[#E5E7EB] py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold text-[#02A95C] uppercase tracking-wider bg-emerald-50 border border-emerald-200 px-3.5 py-1 rounded-full">
            IDEAS TO HELP YOUR FUNDRAISER GROW
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-gray-900 tracking-tight">
            Proven Fundraising Tips for Maximum Impact
          </h1>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Practical, field-tested strategies to help your medical, tuition, emergency, or community campaign reach 100% of its goal on GCC Foundation.
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TIPS.map((tip) => (
            <div
              key={tip.number}
              className="bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-7 shadow-card flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <span className="font-heading font-black text-2xl text-[#02A95C] block">
                  {tip.number}
                </span>
                <h2 className="font-heading font-bold text-lg text-gray-900">{tip.title}</h2>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{tip.description}</p>
              </div>
              <div className="rounded-2xl bg-[#FAF9F6] border border-[#E5E7EB] p-3.5 text-xs text-gray-800 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#02A95C] shrink-0 mt-0.5" />
                <span>
                  <strong>Action step:</strong> {tip.actionTip}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-3xl p-8 text-center space-y-4">
          <h3 className="font-heading font-extrabold text-2xl text-gray-900">
            Start applying these tips to your campaign today
          </h3>
          <p className="text-sm text-gray-600 max-w-lg mx-auto">
            Launch your fundraiser with our guided setup and reach supporters across East Africa and the global diaspora.
          </p>
          <Link
            href="/create/fundraiser/category"
            className="inline-flex items-center gap-2 rounded-full bg-[#02A95C] hover:bg-[#028F4D] text-white font-bold text-sm px-8 py-3.5 transition-all"
          >
            <span>Start a Fundraiser</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}
