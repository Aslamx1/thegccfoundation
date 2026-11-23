'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import {
  Sparkles,
  ShieldCheck,
  Compass,
  FileCheck2,
  Building2,
  Users,
  Handshake,
  Laptop,
  Target,
  TrendingUp,
  Stethoscope,
  GraduationCap,
  Droplets,
  Sprout,
  AlertTriangle,
  HeartHandshake,
  AlertCircle,
  ArrowRight,
  Clock,
  Heart,
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
              <span>ABOUT US</span>
            </div>
            <h1 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl text-[#1A1A1A] tracking-[-0.02em] leading-tight">
              The GCC Foundation
            </h1>
            <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Empowering vulnerable children and Youths in our community through Education and talents.
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
              GCC Foundation was started in 2020 by a group of church youths who thought they can change the world with a little start.
            </p>
            <p>
              We realized that our community had so many children and youths that had no stable homes, education plus daily necessities. So we started collecting them together and we made them one Family.
            </p>
            <p className="bg-emerald-50/70 border-l-4 border-[#02A95C] p-5 sm:p-6 rounded-r-2xl text-gray-800 leading-relaxed">
              We started bringing out their talents so that we can start benefiting from our talents. Later we formed some tiktok accounts to help us earn a living. Our foundation is a community based Organization in Ndejje, Kampala.
            </p>
            <p>
              Today our Foundation is managed by <strong>Kyagulanyi Monch</strong> as a manager and other three partners that started the foundation with him.
            </p>
          </div>
        </section>

        {/* ================= SECTION: LEADERSHIP AND DAILY OPERATIONS ================= */}
        <section className="bg-white border-y border-gray-200/80 py-16 sm:py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="max-w-3xl space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#02A95C]">Governance &amp; Team</span>
              <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-[#1A1A1A]">
                Leadership and Daily Operations
              </h2>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                Today, The GCC Foundation is managed by <strong>Kyagulanyi Monch</strong> as a manager and other three partners that started the foundation with him in Ndejje, Kampala.
              </p>
              <p className="text-sm sm:text-base text-gray-600">
                Together, we work hand-in-hand with our community to ensure every child has access to food, shelter, education, and the opportunity to showcase their gifts.
              </p>
            </div>

            {/* Core Operational Teams */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Field Vetting & Verification */}
              <div className="bg-[#FBF9F6] border border-gray-200/90 rounded-3xl p-6 sm:p-7 space-y-3 hover:shadow-subtle transition-all">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#02A95C] flex items-center justify-center border border-emerald-200/80">
                  <FileCheck2 className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-lg text-[#1A1A1A]">
                  Field Vetting &amp; Verification
                </h3>
                <p className="text-xs font-semibold text-emerald-700">[Name / Team]</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Carry out on-the-ground checks, review official documents such as hospital proforma invoices and school bursar quotes, and verify beneficiary records.
                </p>
              </div>

              {/* Finance & Direct Disbursements */}
              <div className="bg-[#FBF9F6] border border-gray-200/90 rounded-3xl p-6 sm:p-7 space-y-3 hover:shadow-subtle transition-all">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#02A95C] flex items-center justify-center border border-emerald-200/80">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-lg text-[#1A1A1A]">
                  Finance &amp; Direct Disbursements
                </h3>
                <p className="text-xs font-semibold text-emerald-700">[Name / Team]</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Manage escrowed contributions, direct Bank EFT transfers to verified institutions, and public ledger records.
                </p>
              </div>

              {/* Community & Supporter Coordination */}
              <div className="bg-[#FBF9F6] border border-gray-200/90 rounded-3xl p-6 sm:p-7 space-y-3 hover:shadow-subtle transition-all">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#02A95C] flex items-center justify-center border border-emerald-200/80">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-lg text-[#1A1A1A]">
                  Community &amp; Supporter Coordination
                </h3>
                <p className="text-xs font-semibold text-emerald-700">[Name / Team]</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Assist campaign organizers, coordinate with supporters locally and internationally, and keep campaign updates clear.
                </p>
              </div>
            </div>

            {/* Additional Support Sub-Section */}
            <div className="bg-[#FAF8F5] border border-gray-200 rounded-3xl p-6 sm:p-8 space-y-4">
              <h4 className="font-heading font-bold text-base text-[#1A1A1A] uppercase tracking-wider text-xs text-gray-500">
                Additional Support Comes From:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-[#02A95C] shrink-0 mt-0.5">
                    <Handshake className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-heading font-bold text-sm text-[#1A1A1A]">Field &amp; Partner Liaisons</h5>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      Coordinate directly with hospitals, schools, local leaders, and community project teams on the ground.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-[#02A95C] shrink-0 mt-0.5">
                    <Laptop className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-heading font-bold text-sm text-[#1A1A1A]">Supporter &amp; Technical Operations</h5>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      Keep the platform running smoothly across web, WhatsApp, and giving channels in UGX, KES, and USD.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SECTION: OUR MISSION ================= */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#02A95C] bg-white border border-emerald-200 px-3.5 py-1 rounded-full">
              OUR MISSION
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-[#1A1A1A]">
              Simple But Vital
            </h2>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              The mission of the Foundation is simple but vital to support children in need by providing education, shelter, food and other basic necessities.
            </p>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
              We regularly showcase the children&apos;s performances on social media platforms including Tiktok, Instagram and Youtube, which allows volunteers and well-wishers around the world to connect with us.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 pt-4">
            <div className="bg-white border border-gray-200 rounded-3xl p-7 sm:p-8 space-y-3 shadow-subtle">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#02A95C] flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-lg text-[#1A1A1A]">Education, Shelter &amp; Daily Needs</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Collecting vulnerable children and youths into one loving family, providing stable shelter, nourishing food, school tuition, and daily necessities.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-3xl p-7 sm:p-8 space-y-3 shadow-subtle">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#02A95C] flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-lg text-[#1A1A1A]">Nurturing Talents &amp; Creativity</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Empowering children to develop and showcase their musical and artistic talents, creating opportunities for them to earn a living and connect with supporters globally.
              </p>
            </div>
          </div>
        </section>

        {/* ================= SECTION: ACHIEVEMENTS ================= */}
        <section className="bg-white border-y border-gray-200/80 py-16 sm:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#02A95C] flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" />
                <span>Our Impact</span>
              </span>
              <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-[#1A1A1A]">
                Achievements
              </h2>
            </div>

            <div className="prose prose-lg text-gray-700 leading-relaxed space-y-5 text-base sm:text-lg">
              <p>
                These children are growing up homeless. Some have homes but cant afford day today basic needs.
              </p>
              <p className="bg-[#FAF8F5] border-l-4 border-[#02A95C] p-6 rounded-r-2xl text-gray-900 font-semibold leading-relaxed">
                But right now they have found a home at Gcc Foundation where they can show their talents and build a promising future together as one family.
              </p>
            </div>
          </div>
        </section>

        {/* ================= SECTION: WHAT WE SUPPORT ================= */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#02A95C]">HIGH-IMPACT GIVING</span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-[#1A1A1A]">
              What We Support
            </h2>
            <p className="text-base text-gray-600">
              Every campaign on The GCC Foundation focuses on practical, urgent needs across our communities, including:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Medical Care */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-7 space-y-3 shadow-subtle hover:shadow-card transition-all">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200/60">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-lg text-[#1A1A1A]">Medical Care</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Urgent surgeries, hospital care, and essential equipment such as pediatric cardiac care and neonatal ICU support.
              </p>
            </div>

            {/* Education & Tuition */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-7 space-y-3 shadow-subtle hover:shadow-card transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/60">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-lg text-[#1A1A1A]">Education &amp; Tuition</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Helping students stay in school and improving learning facilities through verified bursar disbursements.
              </p>
            </div>

            {/* Clean Water Wells */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-7 space-y-3 shadow-subtle hover:shadow-card transition-all">
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center border border-cyan-200/60">
                <Droplets className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-lg text-[#1A1A1A]">Clean Water Wells</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Supporting reliable water access—including solar-powered deep boreholes—for underserved families.
              </p>
            </div>

            {/* Community & Agriculture */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-7 space-y-3 shadow-subtle hover:shadow-card transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/60">
                <Sprout className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-lg text-[#1A1A1A]">Community &amp; Agriculture</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Helping local groups, including women farmers, build steady livelihoods and food security.
              </p>
            </div>

            {/* Emergency Relief */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-7 space-y-3 shadow-subtle hover:shadow-card transition-all md:col-span-2 lg:col-span-2">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center border border-red-200/60">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-lg text-[#1A1A1A]">Emergency Relief</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Providing timely medical and shelter assistance during crises such as landslides, floods, and displacement.
              </p>
            </div>
          </div>
        </section>

        {/* ================= SECTION: WHO WE HELP ================= */}
        <section className="bg-white border-y border-gray-200/80 py-16 sm:py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#02A95C]">COMMUNITY SERVED</span>
              <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-[#1A1A1A]">
                Who We Help
              </h2>
              <p className="text-base text-gray-600">
                The foundation supports individuals, families, and communities facing urgent hardships where verified funding can make an immediate difference, including:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {/* Patients & Families */}
              <div className="bg-[#FBF9F6] border border-gray-200 rounded-3xl p-7 space-y-3 hover:shadow-subtle transition-all">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100/70 text-[#02A95C] flex items-center justify-center">
                  <Heart className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-lg text-[#1A1A1A]">
                  Patients &amp; Families
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Facing critical medical bills or urgent hospital procedures where timely deposits are essential for care.
                </p>
              </div>

              {/* Students & Schools */}
              <div className="bg-[#FBF9F6] border border-gray-200 rounded-3xl p-7 space-y-3 hover:shadow-subtle transition-all">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100/70 text-[#02A95C] flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-lg text-[#1A1A1A]">
                  Students &amp; Schools
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Struggling with tuition gaps or essential learning needs, ensuring children remain enrolled in classrooms.
                </p>
              </div>

              {/* Underserved & Crisis-Affected */}
              <div className="bg-[#FBF9F6] border border-gray-200 rounded-3xl p-7 space-y-3 hover:shadow-subtle transition-all">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100/70 text-[#02A95C] flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-lg text-[#1A1A1A]">
                  Underserved Communities
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Dealing with clean water shortages, livelihood setbacks, or sudden displacement caused by environmental crises.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SECTION: CHALLENGES BEFORE SUPPORT ARRIVES ================= */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-12">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full">
              WHY URGENCY MATTERS
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-[#1A1A1A]">
              Challenges Before Support Arrives
            </h2>
            <p className="text-base text-gray-600">
              Before help arrives through a verified campaign, families and communities often face serious pressures, including:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border-l-4 border-rose-500 border-y border-r border-gray-200 rounded-2xl p-6 space-y-2 shadow-subtle">
              <h3 className="font-heading font-bold text-base text-[#1A1A1A]">
                Delayed Medical Treatment
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Due to uncollected hospital deposits or proforma balances that stall surgeries and acute medications.
              </p>
            </div>

            <div className="bg-white border-l-4 border-amber-500 border-y border-r border-gray-200 rounded-2xl p-6 space-y-2 shadow-subtle">
              <h3 className="font-heading font-bold text-base text-[#1A1A1A]">
                Interrupted Schooling
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Lost learning opportunities when students are sent home due to unpaid school fees.
              </p>
            </div>

            <div className="bg-white border-l-4 border-blue-500 border-y border-r border-gray-200 rounded-2xl p-6 space-y-2 shadow-subtle">
              <h3 className="font-heading font-bold text-base text-[#1A1A1A]">
                Daily Community Hardship
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                From unsafe water, fragile livelihoods, or sudden emergencies that threaten family stability.
              </p>
            </div>
          </div>

          <div className="bg-emerald-50/80 border border-emerald-200 rounded-3xl p-8 sm:p-10 space-y-3 text-center max-w-3xl mx-auto">
            <p className="text-base sm:text-lg text-emerald-950 font-semibold leading-relaxed">
              Providing trusted verification, direct institutional payouts, and clear public records is central to why the foundation exists.
            </p>
            <p className="text-sm sm:text-base text-emerald-800 italic font-medium">
              Behind every campaign is a real person or community counting on honest help.
            </p>
          </div>
        </section>

        {/* ================= FINAL CTA ================= */}
        <section className="bg-white border-t border-gray-200/80 py-16 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#1A1A1A]">
              Support a Verified Cause Today
            </h2>
            <p className="text-base text-gray-600 max-w-xl mx-auto">
              Join donors at home and across the diaspora in funding direct medical bills, school tuition, clean water, and relief projects.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
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
