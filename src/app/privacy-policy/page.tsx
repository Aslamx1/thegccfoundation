import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Lock, Eye, Database, FileCheck, CheckCircle2, UserCheck, Scale, Mail, HeartHandshake } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | Gcc Foundation',
  description:
    'Privacy Policy and data protection commitments of Gcc Foundation, in full compliance with the Data Protection and Privacy Act (2019) of the Republic of Uganda.',
};

export default function PrivacyPolicyPage() {
  const lastUpdated = 'November 21, 2026';

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-800 font-sans">
      {/* Hero Header */}
      <div className="bg-gradient-to-b from-[#087443]/10 via-[#02A95C]/5 to-transparent border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-4">
            <Lock className="w-3.5 h-3.5 text-[#02A95C]" />
            Data Protection &amp; Privacy Governance
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-3 text-base text-slate-600 max-w-2xl leading-relaxed">
            Your privacy, donor security, and personal integrity are fundamental to Gcc Foundation. This policy outlines how your data is collected, processed, and safeguarded.
          </p>
          <div className="mt-4 flex items-center gap-4 text-xs text-slate-500 font-medium">
            <span>Last Updated: {lastUpdated}</span>
            <span>&bull;</span>
            <span>Statutory Reference: Uganda Data Protection and Privacy Act (2019)</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10">
        {/* Core Commitments Card */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#02A95C]" />
            Our Four Privacy Guarantees
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                No Selling of Data
              </span>
              <p>We never sell, rent, monetize, or trade your personal records, giving history, or contact lists to any marketing third parties.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Bank-Grade Encryption
              </span>
              <p>Transactions and stored sessions are protected with TLS 1.3 encryption, PBKDF2 credential salting, and secure HttpOnly cookies.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Minor Safeguarding
              </span>
              <p>Child portraits and welfare records are shielded with administrative moderation and anonymization to protect minors.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Full Data Rights
              </span>
              <p>You maintain the right to inspect, correct, export, or delete your personal account data upon written request.</p>
            </div>
          </div>
        </div>

        {/* Section 1: Scope */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 border-b pb-2">
            1. Scope &amp; Data Controller
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            This Privacy Policy applies to all services, web applications, and portal tools operated by <strong>Gcc Foundation</strong> (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) across Uganda and East Africa. Gcc Foundation serves as the primary Data Controller for information submitted on <strong>thegccfoundation.com</strong>.
          </p>
        </section>

        {/* Section 2: Information We Collect */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 border-b pb-2">
            2. Information We Collect
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            We collect only the minimum necessary information to facilitate transparent charitable giving and secure account access:
          </p>
          <div className="space-y-3 text-sm text-slate-600">
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200">
              <strong className="text-slate-900">A. Account Information:</strong> Full name, verified email address, optional contact telephone number, and hashed authentication credentials.
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200">
              <strong className="text-slate-900">B. Donation &amp; Ledger Records:</strong> Transaction timestamps, gift amounts, designated campaign, currency, and payment confirmation receipts. <em>(Note: Sensitive full credit card numbers and mobile money PINs are processed directly by PCI-DSS certified gateways and are never stored on our servers.)</em>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200">
              <strong className="text-slate-900">C. Child Sponsorship &amp; Communications:</strong> Messages, encouragement letters, and milestone updates exchanged between verified sponsors and beneficiaries.
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200">
              <strong className="text-slate-900">D. Technical &amp; Audit Logs:</strong> IP address, device operating system, browser user-agent, and session timestamps collected to prevent brute-force attacks and satisfy NGO accounting standards.
            </div>
          </div>
        </section>

        {/* Section 3: Statutory Compliance with Uganda Data Protection Act */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 border-b pb-2">
            3. Statutory Compliance with Uganda&apos;s Data Protection and Privacy Act (2019)
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Gcc Foundation is strictly compliant with the statutory requirements codified in the <strong>Data Protection and Privacy Act, 2019 (Act 9 of 2019)</strong> of the Republic of Uganda. In accordance with the Act:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600 leading-relaxed">
            <li><strong>Lawful Processing (Section 7):</strong> Data is collected solely with express consent, for legitimate nonprofit governance, or to fulfill legal accountability under the NGO Act.</li>
            <li><strong>Accuracy &amp; Data Minimization (Section 10):</strong> We collect only relevant and adequate information necessary for charity administration.</li>
            <li><strong>Security Measures (Section 20):</strong> We implement state-of-the-art organizational and technical measures—including TLS encryption, edge firewalls, role-based access, and continuous audit logging—to prevent unauthorized disclosure or loss.</li>
            <li><strong>Data Retention Limits (Section 18):</strong> Information is retained only as long as required to fulfill charitable objectives, verify financial audits, and comply with Ugandan non-governmental organization reporting requirements.</li>
          </ul>
        </section>

        {/* Section 4: Your Statutory Rights as a Data Subject */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 border-b pb-2">
            4. Your Rights as a Data Subject
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Under Ugandan and international privacy laws, you possess enforceable rights regarding your personal records:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
            <div className="p-3 rounded-xl bg-white border border-slate-200">
              <strong>Right to Access:</strong> Request a copy of all personal and donation records linked to your identity.
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-200">
              <strong>Right to Rectification:</strong> Update inaccurate or incomplete profile and contact information anytime.
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-200">
              <strong>Right to Erasure:</strong> Request the deletion of your account and personal identifiers, subject to statutory NGO financial retention rules.
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-200">
              <strong>Right to Withdraw Consent:</strong> Opt out of impact newsletters, broadcast communications, or promotional campaign updates.
            </div>
          </div>
        </section>

        {/* Section 5: Cookies & Storage */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 border-b pb-2">
            5. Cookies &amp; Local Session Storage
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Our platform uses essential session cookies (<code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">gcc_session</code>) to maintain secure, authenticated donor sessions. We do not employ third-party behavioral ad tracking cookies.
          </p>
        </section>

        {/* Section 6: Contact & Data Protection Officer */}
        <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#02A95C]" />
            Contact Our Data Protection &amp; Compliance Officer
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
            To exercise your statutory data subject rights, submit a privacy inquiry, or request data corrections, contact our dedicated compliance desk:
          </p>
          <div className="space-y-1 text-xs text-slate-200 font-medium">
            <div>Data Protection Office: <strong>Gcc Foundation Compliance Bureau</strong></div>
            <div>Email: <a href="mailto:compliance@thegccfoundation.com" className="text-[#02A95C] underline font-semibold">compliance@thegccfoundation.com</a></div>
            <div>Physical Address: Kampala, Uganda, East Africa</div>
          </div>
        </div>
      </div>
    </div>
  );
}
