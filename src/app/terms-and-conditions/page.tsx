import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, FileText, CheckCircle2, AlertTriangle, ArrowRight, Scale, Lock, HeartHandshake } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Gcc Foundation',
  description:
    'Legal terms of service and operating agreements governing user accounts, donations, child sponsorships, and community campaigns on the Gcc Foundation platform.',
};

export default function TermsAndConditionsPage() {
  const lastUpdated = 'November 21, 2026';

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-800 font-sans">
      {/* Hero Header */}
      <div className="bg-gradient-to-b from-[#087443]/10 via-[#02A95C]/5 to-transparent border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-4">
            <Scale className="w-3.5 h-3.5 text-[#02A95C]" />
            Official Governance Document
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Terms &amp; Conditions
          </h1>
          <p className="mt-3 text-base text-slate-600 max-w-2xl leading-relaxed">
            Please read these terms and conditions carefully before creating an account, donating, or organizing a fundraiser on the Gcc Foundation community platform.
          </p>
          <div className="mt-4 flex items-center gap-4 text-xs text-slate-500 font-medium">
            <span>Last Updated: {lastUpdated}</span>
            <span>&bull;</span>
            <span>Jurisdiction: Republic of Uganda</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10">
        {/* Quick Highlights Summary Card */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#02A95C]" />
            Key Principles of Gcc Foundation
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>0% Platform Fee:</strong> 100% of community contributions go directly to verified beneficiaries and initiatives.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Verified Disbursements:</strong> Payouts are made directly to institutional school and hospital accounts.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Child Protection:</strong> Strict moderation on all letters, photographs, and sponsor communications.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Uganda Legal Compliance:</strong> Operating under the NGO Act and Data Protection and Privacy Act (2019).</span>
            </div>
          </div>
        </div>

        {/* Section 1: Introduction */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 border-b pb-2">
            1. Acceptance of Terms
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            These Terms &amp; Conditions (&quot;Terms&quot;) constitute a legally binding agreement between you (&quot;User&quot;, &quot;Donor&quot;, &quot;Organizer&quot;) and <strong>Gcc Foundation</strong>, a non-governmental charitable foundation registered and operating under the laws of the Republic of Uganda.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            By visiting our website, signing up for an account, submitting donation payments, or creating a peer fundraiser, you explicitly accept and agree to abide by these Terms, our <Link href="/privacy-policy" className="text-[#02A95C] underline font-semibold">Privacy Policy</Link>, and all applicable statutory regulations of Uganda.
          </p>
        </section>

        {/* Section 2: User Accounts */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 border-b pb-2">
            2. Account Registration &amp; Security
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600 leading-relaxed">
            <li>You must be at least 18 years old or possess legal guardian consent to register an account or initiate financial transactions.</li>
            <li>You agree to provide true, accurate, and current information during registration. Providing fraudulent credentials or impersonating others will result in immediate termination of access.</li>
            <li>You are responsible for safeguarding your authentication credentials. Gcc Foundation will never ask for your password or payment PIN via unverified phone calls, emails, or text messages.</li>
            <li>We reserve the right to suspend or terminate accounts that violate our community integrity standards, security policies, or applicable national laws.</li>
          </ul>
        </section>

        {/* Section 3: Donations & Financial Ledger */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 border-b pb-2">
            3. Donations, Fees &amp; Escrow Disbursements
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Gcc Foundation is dedicated to complete transparency in community giving:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600 leading-relaxed">
            <li><strong>0% Platform Deductions:</strong> Gcc Foundation charges zero platform fees on charitable campaigns. Standard third-party payment processing fees (e.g., Stripe, PayPal, or local mobile network operator fees) may apply directly at the merchant level.</li>
            <li><strong>Irrevocability of Charitable Donations:</strong> Donations made through verified campaigns or child welfare funds are considered irrevocable charitable gifts once settled, except in cases of verified unauthorized transaction disputes reported within 14 calendar days.</li>
            <li><strong>Direct Payout Verification:</strong> Funds raised for medical interventions, school tuition, or clean water installations are disbursed directly to accredited service providers (e.g., licensed medical centers, accredited academic institutions, or contracted construction providers) to guarantee accountability.</li>
          </ul>
        </section>

        {/* Section 4: Child Sponsorship & Safeguarding */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 border-b pb-2">
            4. Child Sponsorship &amp; Safeguarding Standards
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Gcc Foundation enforces zero-tolerance child safeguarding policies:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600 leading-relaxed">
            <li><strong>Letter &amp; Content Moderation:</strong> All letters, messages, and photographs exchanged between child sponsors and sponsored beneficiaries must pass administrative review before delivery.</li>
            <li><strong>No Unmonitored Contact:</strong> Sponsors may never attempt to bypass official foundation channels to establish unmoderated private phone, social media, or in-person contact with children or their families.</li>
            <li><strong>Privacy of Minors:</strong> Last names, exact residential locations, and identifying contact numbers of sponsored children are kept confidential to protect their safety and dignity.</li>
          </ul>
        </section>

        {/* Section 5: Peer-to-Peer Campaigns */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 border-b pb-2">
            5. User-Created Fundraisers &amp; Moderation
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Users who create peer-to-peer fundraisers warrant that all story details, milestones, and medical/educational documentation submitted are authentic and unmanipulated. Gcc Foundation administrators reserve the right to audit, hold payouts, or remove any campaign suspected of misrepresentation or fraud.
          </p>
        </section>

        {/* Section 6: Data Protection & Privacy Compliance */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 border-b pb-2">
            6. Compliance with Uganda&apos;s Data Protection and Privacy Act (2019)
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            All personal information, giving histories, and identity records collected through the Gcc Foundation platform are collected, processed, and safeguarded in full compliance with the <strong>Data Protection and Privacy Act, 2019</strong> of Uganda. Please review our <Link href="/privacy-policy" className="text-[#02A95C] underline font-semibold">Privacy Policy</Link> for detailed disclosure on your statutory rights.
          </p>
        </section>

        {/* Section 7: Intellectual Property */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 border-b pb-2">
            7. Intellectual Property &amp; Copyright Notice
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            All proprietary software code, visual logos, emblems, text copy, graphic artwork, and impact media on this website are the intellectual property of Gcc Foundation and are protected under Ugandan and international copyright treaties.
          </p>
          <div className="p-4 rounded-2xl bg-slate-100 font-mono text-xs text-slate-700">
            &copy; {new Date().getFullYear()} Gcc Foundation. All rights reserved.
          </div>
        </section>

        {/* Section 8: Governing Law */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 border-b pb-2">
            8. Governing Law &amp; Dispute Resolution
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            These Terms are governed by and construed in accordance with the substantive laws of the <strong>Republic of Uganda</strong>. Any dispute arising out of or in connection with these Terms shall be resolved amicably through constructive dialogue; failing which, it shall be submitted to the competent courts of jurisdiction in Kampala, Uganda.
          </p>
        </section>

        {/* Contact Footer */}
        <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-[#02A95C]" />
            Questions or Legal Enquiries?
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
            For questions regarding these Terms &amp; Conditions or to request certified foundation documentation, please reach out to our legal and compliance desk.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#02A95C]">
            <span>Email: compliance@thegccfoundation.com</span>
            <span>&bull;</span>
            <span>Kampala, Uganda, East Africa</span>
          </div>
        </div>
      </div>
    </div>
  );
}
