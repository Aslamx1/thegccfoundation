'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import {
  ShieldCheck,
  Heart,
  Users,
  CheckCircle2,
  Stethoscope,
  GraduationCap,
  Droplets,
  Sprout,
  AlertTriangle,
  Globe,
  Building2,
  FileCheck2,
  ArrowRight,
  Sparkles,
  Lock,
  Compass,
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F6] text-gray-900 font-sans">
      <Header />

      <main className="flex-1 w-full">
        {/* ================= HERO SECTION ================= */}
        <section className="bg-white border-b border-gray-200/80 py-16 sm:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-4 py-1 text-xs font-bold text-[#02A95C] border border-emerald-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ABOUT THE GCC FOUNDATION</span>
            </div>
            <h1 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl text-[#1A1A1A] tracking-[-0.02em] leading-tight">
              Honest, Accountable, and Direct Community Giving
            </h1>
            <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Connecting everyday donors and international supporters with real, verified human and community needs across East Africa.
            </p>
          </div>
        </section>

        {/* ================= SECTION: OUR STORY ================= */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#02A95C]">Where We Began</span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-[#1A1A1A]">
              Our Story
            </h2>
          </div>

          <div className="prose prose-lg text-gray-700 leading-relaxed space-y-5 text-base sm:text-lg">
            <p>
              The GCC Foundation was founded with a clear purpose: <strong>to make community giving in East Africa—and beyond—honest, accountable, and direct.</strong>
            </p>
            <p>
              Across our communities, people step up every day to help neighbors facing sudden medical emergencies, school tuition gaps, unsafe water, crop and livelihood challenges, or displacement from disasters. Yet too often, well-meaning donors hesitate because they are unsure whether funds will reach the intended hospital, school, or project—or whether money will get lost along the way.
            </p>
            <p className="bg-emerald-50/60 border-l-4 border-[#02A95C] p-5 rounded-r-2xl text-gray-800 italic">
              We built The GCC Foundation to close that gap. Starting with work rooted in Uganda and expanding across East Africa, our platform connects everyday donors and international supporters with real, verified needs—ensuring that every contribution is handled with care and directed where it counts most.
            </p>
          </div>
        </section>

        {/* ================= SECTION: OUR MISSION & FOCUS AREAS ================= */}
        <section className="bg-white border-y border-gray-200/80 py-16 sm:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#02A95C]">Purpose Driven</span>
              <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-[#1A1A1A]">
                Our Mission
              </h2>
              <p className="text-base text-gray-600 leading-relaxed">
                Our mission is simple and practical: to make transparent, vetted giving accessible so communities can respond quickly and reliably to urgent human and development needs.
              </p>
            </div>

            {/* 5 Focus Areas Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Medical Care */}
              <div className="bg-[#FBF9F6] border border-gray-200/90 rounded-3xl p-6 space-y-3 hover:shadow-card transition-all">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200/60">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-lg text-[#1A1A1A]">Medical Care</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Supporting urgent surgeries, hospital bills, and essential medical equipment such as neonatal care units.
                </p>
              </div>

              {/* Education & Tuition */}
              <div className="bg-[#FBF9F6] border border-gray-200/90 rounded-3xl p-6 space-y-3 hover:shadow-card transition-all">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/60">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-lg text-[#1A1A1A]">Education &amp; Tuition</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Helping students stay in school and improving learning spaces through direct tuition disbursements.
                </p>
              </div>

              {/* Clean Water Wells */}
              <div className="bg-[#FBF9F6] border border-gray-200/90 rounded-3xl p-6 space-y-3 hover:shadow-card transition-all">
                <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center border border-cyan-200/60">
                  <Droplets className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-lg text-[#1A1A1A]">Clean Water Wells</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Supporting sustainable water access like solar-powered deep boreholes for underserved rural families.
                </p>
              </div>

              {/* Community & Agriculture */}
              <div className="bg-[#FBF9F6] border border-gray-200/90 rounded-3xl p-6 space-y-3 hover:shadow-card transition-all">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/60">
                  <Sprout className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-lg text-[#1A1A1A]">Community &amp; Agriculture</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Helping local grassroots groups—such as women farmers—build steady livelihoods and self-reliance.
                </p>
              </div>

              {/* Emergency Relief */}
              <div className="bg-[#FBF9F6] border border-gray-200/90 rounded-3xl p-6 space-y-3 hover:shadow-card transition-all md:col-span-2 lg:col-span-1">
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center border border-red-200/60">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-lg text-[#1A1A1A]">Emergency Relief</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Delivering timely medical and shelter support during crises such as mudslides, floods, and displacement.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SECTION: HOW WE PROTECT EVERY CONTRIBUTION ================= */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#02A95C] bg-white border border-emerald-200 px-3.5 py-1 rounded-full">
              TRUST &amp; ACCOUNTABILITY
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-[#1A1A1A]">
              How We Protect Every Contribution
            </h2>
            <p className="text-base text-gray-600">
              Our Vetting &amp; Payout Model: Trust is at the center of everything we do. Rather than sending medical or tuition funds into unverified private hands, we follow a strict verification and payout process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white border border-gray-200 rounded-3xl p-8 space-y-4 shadow-subtle hover:shadow-card transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#02A95C] font-black text-xl flex items-center justify-center font-heading border border-emerald-200">
                1
              </div>
              <h3 className="font-heading font-bold text-xl text-[#1A1A1A]">
                In-Person Vetting
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Field officers verify cases on the ground—such as bedside hospital checks—and review supporting records, National IDs (NIN), and local council (LC1) recommendation letters alongside hospital proforma invoices or school bursar quotes.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white border border-gray-200 rounded-3xl p-8 space-y-4 shadow-subtle hover:shadow-card transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#02A95C] font-black text-xl flex items-center justify-center font-heading border border-emerald-200">
                2
              </div>
              <h3 className="font-heading font-bold text-xl text-[#1A1A1A]">
                100% Direct Institutional Payouts
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Medical and tuition donations are escrowed and wired via Bank EFT straight to verified hospital, school, or project accounts, with 0% platform fee charged to charities.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white border border-gray-200 rounded-3xl p-8 space-y-4 shadow-subtle hover:shadow-card transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#02A95C] font-black text-xl flex items-center justify-center font-heading border border-emerald-200">
                3
              </div>
              <h3 className="font-heading font-bold text-xl text-[#1A1A1A]">
                Public Ledger &amp; Donor Protection
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Itemized invoices and stamped bank deposit slips are posted directly on the campaign page, backed by our Giving Guarantee (including a full refund promise if something isn't right with a campaign).
              </p>
            </div>
          </div>
        </section>

        {/* ================= SECTION: LEADERSHIP AND OPERATIONS ================= */}
        <section className="bg-white border-y border-gray-200/80 py-16 sm:py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="max-w-3xl space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#02A95C]">Structure &amp; Governance</span>
              <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-[#1A1A1A]">
                Leadership and Operations
              </h2>
              <p className="text-base text-gray-600 leading-relaxed">
                The GCC Foundation operates through a coordinated team combining local field verification, institutional disbursement oversight, and supporter communications:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Role 1 */}
              <div className="bg-[#FBF9F6] border border-gray-200/90 rounded-3xl p-6 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-base">
                  <Compass className="w-5 h-5 text-[#02A95C]" />
                  <h4>Leadership &amp; Coordination</h4>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Oversees platform operations, campaign review standards, and partner accountability across all regional initiatives.
                </p>
              </div>

              {/* Role 2 */}
              <div className="bg-[#FBF9F6] border border-gray-200/90 rounded-3xl p-6 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-base">
                  <FileCheck2 className="w-5 h-5 text-[#02A95C]" />
                  <h4>Field &amp; Vetting Officers</h4>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Local team members who conduct in-person verification, check official documentation, and confirm beneficiary needs on the ground.
                </p>
              </div>

              {/* Role 3 */}
              <div className="bg-[#FBF9F6] border border-gray-200/90 rounded-3xl p-6 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-base">
                  <Building2 className="w-5 h-5 text-[#02A95C]" />
                  <h4>Finance &amp; Institutional Disbursement</h4>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Team members responsible for escrowing funds and processing direct Bank EFT transfers to verified institutional accounts.
                </p>
              </div>

              {/* Role 4 */}
              <div className="bg-[#FBF9F6] border border-gray-200/90 rounded-3xl p-6 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-base">
                  <Users className="w-5 h-5 text-[#02A95C]" />
                  <h4>Donor &amp; Community Support</h4>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Team members who assist campaign organizers, answer donor questions, and publish campaign updates and payment records.
                </p>
              </div>
            </div>

            <div className="text-xs text-gray-500 italic border-l-2 border-gray-300 pl-3">
              You can meet our field coordinators, compliance officers, and advisors directly on our{' '}
              <Link href="/our-team" className="text-[#02A95C] font-semibold hover:underline">
                Our Team directory
              </Link>
              .
            </div>
          </div>
        </section>

        {/* ================= SECTION: ACCESSIBLE GIVING & WHO WE SERVE ================= */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-16">
          {/* Accessible Giving */}
          <div className="bg-gradient-to-br from-[#012D19] to-[#024827] text-white rounded-3xl p-8 sm:p-12 space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/10 px-3.5 py-1 rounded-full text-xs font-bold text-emerald-300 border border-white/20">
              <Globe className="w-3.5 h-3.5" />
              <span>GLOBAL &amp; LOCAL ACCESS</span>
            </div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-white">
              Accessible Giving Across Borders
            </h2>
            <p className="text-base sm:text-lg text-emerald-100 leading-relaxed max-w-3xl">
              Supporters can share campaigns easily across WhatsApp, social media, and direct links, and contribute in US Dollars (USD), Ugandan Shillings (UGX), or Kenyan Shillings (KES) using Mobile Money or cards—making it straightforward for local residents and the global diaspora to stand together.
            </p>
          </div>

          {/* Who We Serve */}
          <div className="space-y-8">
            <div className="space-y-2 text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-[#02A95C]">Community Focus</span>
              <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-[#1A1A1A]">
                Who We Serve
              </h2>
              <p className="text-base text-gray-600">
                We serve two sides of the same community:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Beneficiary Side */}
              <div className="bg-white border border-gray-200 rounded-3xl p-8 space-y-4 shadow-subtle">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-[#02A95C] flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-xl text-[#1A1A1A]">
                  Families, Schools, Hospitals &amp; Community Groups
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Facing urgent medical bills, tuition needs, water shortages, disaster recovery, or local development projects that need transparent, verified funding.
                </p>
              </div>

              {/* Donor Side */}
              <div className="bg-white border border-gray-200 rounded-3xl p-8 space-y-4 shadow-subtle">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-[#02A95C] flex items-center justify-center font-bold">
                  <Heart className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-xl text-[#1A1A1A]">
                  Donors &amp; Well-Wishers
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  At home and abroad who want clear proof of impact, direct institutional payouts, and honest reporting on every single campaign.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SECTION: LOOKING AHEAD & CTA ================= */}
        <section className="bg-white border-t border-gray-200/80 py-16 sm:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#02A95C] bg-[#FBF9F6] border border-gray-200 px-3.5 py-1 rounded-full">
              OUR ONGOING COMMITMENT
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#1A1A1A]">
              Looking Ahead
            </h2>
            <p className="text-base sm:text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto italic font-serif">
              &ldquo;As The GCC Foundation grows, our commitment stays the same: to keep vetting thorough, keep payouts direct, and keep every ledger clear—so behind every campaign, real people get real help with dignity.&rdquo;
            </p>

            <div className="pt-6 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/#discover"
                className="inline-flex items-center justify-center bg-[#02A95C] hover:bg-[#028F4D] text-white text-sm font-bold py-3.5 px-8 rounded-full shadow-sm hover:shadow transition-all"
              >
                Discover Fundraisers
              </Link>
              <Link
                href="/create-campaign"
                className="inline-flex items-center justify-center border border-gray-300 hover:border-gray-900 text-gray-800 text-sm font-bold py-3.5 px-8 rounded-full transition-colors"
              >
                Start a Fundraiser
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
