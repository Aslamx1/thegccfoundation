'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import {
  ShieldCheck,
  Building2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  PhoneCall,
  Mail,
  Scale,
  Users,
  BookOpen,
  Lightbulb,
  Sparkles,
  HeartHandshake,
  HeartPulse,
  GraduationCap,
  Droplets,
  Sprout,
  Flame,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const BLOG_ARTICLES = [
  {
    id: 'direct-hospital-eft',
    tag: 'Medical Verification',
    readTime: '4 min read',
    date: 'Nov 2026',
    title: 'How Direct-to-Hospital EFT Payouts Protect Both Donors and Families',
    summary:
      'Why sending funds straight to accredited hospital accounts (Mulago, Uganda Heart Institute, Nsambya) increases donor confidence by 340% and accelerates surgical scheduling.',
    fullContent: [
      'When a family faces an urgent surgical or intensive care bill in East Africa, the biggest barrier to raising money online is trust. Distant relatives, diaspora communities, and corporate donors want absolute certainty that their contribution will pay for the medical procedure itself.',
      'Under the GCC Foundation protocol, every medical fundraiser is linked directly to the treating facility’s official bank account and patient file reference. Our Chief Medical Officer audits the proforma invoice before the campaign goes live.',
      'As donations arrive, funds are wired via Bank EFT straight to the hospital treasury. Stamped deposit slips and official hospital receipts are uploaded directly to the campaign’s public ledger—eliminating intermediaries and giving hospitals the financial guarantee they need to proceed with life-saving care.',
    ],
  },
  {
    id: 'whatsapp-diaspora-mobilization',
    tag: 'Fundraising Strategy',
    readTime: '5 min read',
    date: 'Nov 2026',
    title: 'The Complete Guide to Mobilizing Community & Diaspora Support via WhatsApp',
    summary:
      'Over 78% of East African crowdfunding contributions originate from WhatsApp group broadcasts and personal voice notes. Learn how to structure your outreach.',
    fullContent: [
      'In Uganda, Kenya, Tanzania, and across the global diaspora, WhatsApp is the primary engine of community generosity. However, simply dropping a link into a group chat rarely produces strong results.',
      'Successful organizers form a 5-person WhatsApp Mobilization Committee before launching publicly. This inner circle commits the first 10–15% of the goal within 24 hours so that when wider groups open the page, they see active momentum.',
      'Pair your GCC Foundation campaign link with a 3-sentence summary: (1) Who needs help and the exact diagnosis or school need, (2) Which verified hospital or school receives the 100% direct payout, and (3) The specific deadline. Post milestone updates every 48 hours to thank donors by name.',
    ],
  },
  {
    id: 'same-day-kyc-verification',
    tag: 'Organizer Checklist',
    readTime: '3 min read',
    date: 'Oct 2026',
    title: 'Preparing Your Hospital Proforma Invoice & LC1 Letter for Same-Day Verification',
    summary:
      'A step-by-step document checklist for organizers so our Kampala, Mbale, Soroti, and Gulu field teams can verify your campaign within 24 hours.',
    fullContent: [
      'To receive the GCC Foundation "ID-Verified & Direct Payout" badge quickly, prepare three clear documents before starting the fundraiser wizard:',
      '1. Official Institutional Invoice: For medical cases, obtain a stamped proforma invoice or admission estimate from the hospital billing desk showing the patient’s name, file number, and official hospital bank details. For tuition cases, obtain the school bursar’s fee structure and bank slip.',
      '2. Organizer National ID (NIN) or Passport: A clear photo of the front and back of your National Identification Card confirming your legal identity.',
      '3. Relationship & Guardianship Confirmation: A brief recommendation letter stamped by your Local Council (LC1) Chairperson, parish leader, or treating ward administrator confirming your relationship to the beneficiary.',
    ],
  },
];

const FUNDRAISING_CATEGORIES = [
  {
    name: 'Medical Care & Surgery',
    icon: HeartPulse,
    filterParam: 'Medical+Care',
    description:
      'Emergency surgeries, pediatric cardiac procedures, oncology treatments, neonatal ICU care, and post-operative rehabilitation.',
    requirements: 'Stamped hospital proforma invoice, patient admission reference, and treating doctor details.',
    payoutTarget: 'Wired 100% directly to the accredited hospital treasury account.',
  },
  {
    name: 'Education & School Tuition',
    icon: GraduationCap,
    filterParam: 'Education+%26+Tuition',
    description:
      'Secondary school and university tuition relief, national examination registration fees, girls’ boarding scholarships, and classroom learning supplies.',
    requirements: 'Official school bursar fee circular, student admission/index number, and institutional bank account.',
    payoutTarget: 'Wired 100% directly to the school or university bursar bank account.',
  },
  {
    name: 'Emergency & Disaster Relief',
    icon: Flame,
    filterParam: 'Emergency+Relief',
    description:
      'Rapid response to mudslides, floods, fire displacement, urgent food distributions, heavy-duty tarpaulins, and emergency shelter.',
    requirements: 'District disaster committee or LC1 verification and itemized supplier quotations.',
    payoutTarget: 'Settled directly with vetted grain millers, medical depots, and relief suppliers.',
  },
  {
    name: 'Clean Water & Solar Boreholes',
    icon: Droplets,
    filterParam: 'Clean+Water+Wells',
    description:
      'Deep rotary borehole drilling, solar-powered village water pumps, school rainwater harvesting tanks, and sanitation blocks.',
    requirements: 'Hydrogeological survey quote, certified drilling contractor invoice, and village water committee sign-off.',
    payoutTarget: 'Released in audited tranches (mobilization, drilling, pump testing) to the engineering contractor.',
  },
  {
    name: 'Rural Agriculture & Women Co-ops',
    icon: Sprout,
    filterParam: 'Rural+Agriculture',
    description:
      'Solar drip irrigation kits, drought-resistant seed banks, grain milling equipment, and registered women’s agricultural cooperatives.',
    requirements: 'Cooperative registration certificate, supplier proforma invoice, and community leadership endorsement.',
    payoutTarget: 'Paid directly to certified agricultural equipment suppliers and cooperative accounts.',
  },
];

const FUNDRAISING_TIPS = [
  {
    number: '01',
    title: 'Publish an Itemized, Exact Budget',
    detail:
      'Donors give 2.5x more when they can see exact line items—for example, "USh 4,500,000 for Cardiac Bypass Consumables" and "USh 1,800,000 for 5 Days ICU Care"—rather than a single vague lump sum.',
  },
  {
    number: '02',
    title: 'Use Authentic, High-Clarity Photos',
    detail:
      'Upload real, respectful photos from the hospital ward, school compound, or village site. Avoid stock images. Showing the real people and community behind the campaign builds immediate human connection.',
  },
  {
    number: '03',
    title: 'Build Momentum in the First 48 Hours',
    detail:
      'Before sharing your link with the wider public, privately ask 5 to 10 close family members or friends to make the first contributions. New visitors are far more likely to donate when a campaign already has initial support.',
  },
  {
    number: '04',
    title: 'Highlight the 100% Direct Hospital/School Payout',
    detail:
      'Always mention in your WhatsApp and social media messages that GCC Foundation wires 100% of funds directly to the hospital or school bank account. This removes donor hesitation immediately.',
  },
  {
    number: '05',
    title: 'Post Field Updates Every 3–5 Days',
    detail:
      'Share short progress notes—such as doctor rounds, surgical scheduling, or borehole drilling depth—so supporters feel part of the journey and share your link again.',
  },
  {
    number: '06',
    title: 'Thank Supporters Publicly & Share Receipts',
    detail:
      'Acknowledge every donor on the campaign wall and upload stamped hospital or school receipts as soon as tranches are disbursed. Grateful updates often inspire second gifts.',
  },
];

const FUNDRAISING_IDEAS = [
  {
    category: 'Education',
    title: 'Sponsor-a-Term Classroom & Tuition Drive',
    description:
      'Rally old boys/old girls (alumni associations) or parish members to clear third-term tuition and UNEB registration fees for top-performing orphaned or displaced students.',
  },
  {
    category: 'Medical',
    title: 'Community Ward Equipment & Incubator Drive',
    description:
      'Partner with a local health center or mission hospital to fund a neonatal incubator, patient monitor, or oxygen concentrator with direct supplier invoicing.',
  },
  {
    category: 'Clean Water',
    title: 'Diaspora Village Borehole Matching Challenge',
    description:
      'Challenge sons and daughters of a home district living abroad to match local community contributions dollar-for-dollar to drill a permanent solar water well.',
  },
  {
    category: 'Milestones',
    title: 'Birthday, Wedding, or Graduation Giving Pledge',
    description:
      'Dedicate your birthday, anniversary, or graduation celebration to funding a child’s corrective surgery or a rural classroom roof instead of physical gifts.',
  },
  {
    category: 'Women & Youth',
    title: 'Women’s Cooperative Irrigation & Seed Bank',
    description:
      'Fund solar drip-irrigation lines and high-yield vegetable seeds for a registered village women’s farming group to create year-round household income.',
  },
  {
    category: 'Corporate CSR',
    title: 'Workplace & Corporate Matching Campaign',
    description:
      'Unite coworkers at your company or bank to raise funds for an emergency relief or pediatric heart surgery case, with employer matching paid straight to the institution.',
  },
];

export default function HowItWorksPage() {
  const [expandedArticle, setExpandedArticle] = useState<string | null>(BLOG_ARTICLES[0].id);

  return (
    <div className="flex-1 flex flex-col bg-[#FAF9F6]">
      <Header />

      {/* Hero Header */}
      <section className="bg-white border-b border-[#E5E7EB] py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <span className="inline-block text-xs font-bold text-[#3D5E16] uppercase tracking-wider bg-[#F4F7EE] border border-[#CDDCB3] px-4 py-1.5 rounded-full">
            How The GCC Foundation Works
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-gray-900 tracking-tight">
            How Our 4-Tier Vetting Protocol & Fundraising Resources Work
          </h1>
          <p className="text-gray-800 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            At GCC Foundation, we combine in-person bedside verification and 100% direct institutional payouts with practical tools, guides, and support to help your fundraiser succeed.
          </p>

          {/* Quick Jump Navigation Pills */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-2">
            {[
              { label: 'How to Start', href: '#how-to-start' },
              { label: '4-Tier Vetting', href: '#vetting-protocol' },
              { label: 'Categories', href: '#categories' },
              { label: 'Team Fundraising', href: '#team-fundraising' },
              { label: 'Fundraising Blog', href: '#blog' },
              { label: 'Fundraising Tips', href: '#tips' },
              { label: 'Fundraising Ideas', href: '#ideas' },
              { label: 'Charity Fundraising', href: '#charity-fundraising' },
            ].map((nav) => (
              <a
                key={nav.href}
                href={nav.href}
                className="px-3.5 py-2 rounded-full text-xs font-bold bg-[#FAF9F6] border border-[#E5E7EB] text-gray-800 hover:border-[#02A95C] hover:text-[#02A95C] transition-colors"
              >
                {nav.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
        {/* ================= SECTION 1: HOW TO START A FUNDRAISER ================= */}
        <section id="how-to-start" className="scroll-mt-24 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#02A95C]">
                Step-by-Step Guidance
              </span>
              <h2 className="mt-1 font-heading font-extrabold text-2xl sm:text-3xl text-gray-900">
                How to Start a Fundraiser on GCC Foundation
              </h2>
              <p className="mt-1 text-sm text-gray-600 max-w-2xl">
                Launch a verified campaign in five guided steps. It takes just a few minutes to set up and share with your community.
              </p>
            </div>
            <Link
              href="/create/fundraiser/category"
              className="inline-flex items-center gap-2 rounded-full bg-[#02A95C] px-6 py-3 text-sm font-bold text-white hover:bg-[#028F4D] shrink-0 self-start sm:self-auto"
            >
              <span>Start a Fundraiser</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              {
                step: 'Step 1',
                title: 'Choose Location & Cause',
                desc: 'Select the country, district/city, and cause category (Medical, Education, Emergency, Water, or Agriculture).',
              },
              {
                step: 'Step 2',
                title: 'Set Your Target Goal',
                desc: 'Enter the exact amount needed based on your hospital proforma invoice, school bursar circular, or project quote.',
              },
              {
                step: 'Step 3',
                title: 'Tell Your Story & Add Photos',
                desc: 'Share who needs help, the clinical or community background, and upload a clear, authentic cover photo.',
              },
              {
                step: 'Step 4',
                title: 'Submit KYC & Institution Info',
                desc: 'Provide your National ID (NIN) and the receiving hospital or school bank details for direct payout verification.',
              },
              {
                step: 'Step 5',
                title: 'Share & Track Payouts',
                desc: 'Share your live link via WhatsApp and social media. Track donations and direct EFT bank receipts on your ledger.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-subtle flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider text-[#02A95C] bg-emerald-50 px-2.5 py-1 rounded-full">
                    {item.step}
                  </span>
                  <h3 className="font-heading font-bold text-base text-gray-900">{item.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= SECTION 2: 4-TIER VETTING PROTOCOL ================= */}
        <section id="vetting-protocol" className="scroll-mt-24 space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#3D5E16]">
              Institutional Safeguards
            </span>
            <h2 className="mt-1 font-heading font-extrabold text-2xl sm:text-3xl text-gray-900">
              Our 4-Tier Verification Protocol
            </h2>
            <p className="mt-1 text-sm text-gray-600 max-w-2xl">
              Every campaign undergoes strict physical and document verification so donors can give with complete peace of mind.
            </p>
          </div>

          <div className="space-y-6">
            {/* Tier 1 */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-card flex flex-col md:flex-row gap-6 items-start">
              <div className="w-14 h-14 rounded-2xl bg-[#F4F7EE] text-[#3D5E16] border border-[#CDDCB3] flex items-center justify-center font-heading font-black text-2xl flex-shrink-0">
                01
              </div>
              <div className="space-y-3 flex-1">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="font-heading font-bold text-xl text-gray-900">
                    Bedside Physical Verification & Real-Time Photography
                  </h3>
                  <span className="bg-[#FAF9F6] border border-gray-200 text-gray-800 text-[11px] font-mono px-2.5 py-0.5 rounded">
                    Field Team In-Person
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-800 leading-relaxed font-body">
                  Our local field officers (stationed in Kampala, Mbale, Soroti, and Gulu) physically visit the hospital ward, school, or community borehole site. We photograph the actual patient bedside with current time and location stamps. No stock images or AI-generated photos are ever accepted.
                </p>
                <div className="bg-[#FAF9F6] border border-[#E5E7EB] rounded-lg p-3 text-xs text-gray-800 space-y-1">
                  <strong>Enforced Evidence:</strong> High-resolution photos showing patient wristband, hospital admission card, and treating consultant notes.
                </div>
              </div>
            </div>

            {/* Tier 2 */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-card flex flex-col md:flex-row gap-6 items-start">
              <div className="w-14 h-14 rounded-2xl bg-[#F4F7EE] text-[#3D5E16] border border-[#CDDCB3] flex items-center justify-center font-heading font-black text-2xl flex-shrink-0">
                02
              </div>
              <div className="space-y-3 flex-1">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="font-heading font-bold text-xl text-gray-900">
                    Institutional Invoice Audit & Lead Physician Sign-Off
                  </h3>
                  <span className="bg-[#FAF9F6] border border-gray-200 text-gray-800 text-[11px] font-mono px-2.5 py-0.5 rounded">
                    Dr. Arthur Ssekandi, CMO
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-800 leading-relaxed font-body">
                  We independently contact the hospital accounts department (e.g. Uganda Heart Institute, St. Francis Hospital Nsambya, Mulago Complex) to audit the proforma invoice. Our Chief Medical Officer verifies that the prescribed procedure, surgical consumables, and intensive care duration align with standard clinical tariffs.
                </p>
                <div className="bg-[#FAF9F6] border border-[#E5E7EB] rounded-lg p-3 text-xs text-gray-800 space-y-1">
                  <strong>Enforced Evidence:</strong> Stamped proforma invoice with official hospital registry number and treating physician’s Uganda Medical and Dental Practitioners Council (UMDPC) registration license.
                </div>
              </div>
            </div>

            {/* Tier 3 */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-card flex flex-col md:flex-row gap-6 items-start">
              <div className="w-14 h-14 rounded-2xl bg-[#F4F7EE] text-[#3D5E16] border border-[#CDDCB3] flex items-center justify-center font-heading font-black text-2xl flex-shrink-0">
                03
              </div>
              <div className="space-y-3 flex-1">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="font-heading font-bold text-xl text-gray-900">
                    National ID (NIN) & Local Council (LC1) Clearance
                  </h3>
                  <span className="bg-[#FAF9F6] border border-gray-200 text-gray-800 text-[11px] font-mono px-2.5 py-0.5 rounded">
                    National ID System
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-800 leading-relaxed font-body">
                  The campaign organizer must provide an authenticated Ugandan National Identification Card (NIN) and an official recommendation letter signed and stamped by their Local Council (LC1) Chairperson confirming relationship to the patient and legal guardianship.
                </p>
                <div className="bg-[#FAF9F6] border border-[#E5E7EB] rounded-lg p-3 text-xs text-gray-800 space-y-1">
                  <strong>Enforced Evidence:</strong> High-res scan of National ID card (cross-checked against civil registry) and stamped LC1 letter.
                </div>
              </div>
            </div>

            {/* Tier 4 */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-card flex flex-col md:flex-row gap-6 items-start">
              <div className="w-14 h-14 rounded-2xl bg-[#F4F7EE] text-[#3D5E16] border border-[#CDDCB3] flex items-center justify-center font-heading font-black text-2xl flex-shrink-0">
                04
              </div>
              <div className="space-y-3 flex-1">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="font-heading font-bold text-xl text-gray-900">
                    100% Direct-to-Institution Payout & Public Ledger
                  </h3>
                  <span className="bg-[#FAF9F6] border border-gray-200 text-gray-800 text-[11px] font-mono px-2.5 py-0.5 rounded">
                    Zero Intermediaries
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-800 leading-relaxed font-body">
                  Funds NEVER pass through personal accounts when an institutional account exists. We wire payments directly to the hospital treasury or school bursar via Bank EFT or registered institutional merchant codes. As soon as the transfer clears, the stamped bank deposit slip is published on the campaign ledger.
                </p>
                <div className="bg-[#FAF9F6] border border-[#E5E7EB] rounded-lg p-3 text-xs text-gray-800 space-y-1">
                  <strong>Enforced Evidence:</strong> Downloadable PDF bank EFT confirmations, official hospital receipt vouchers, and surgeon discharge summaries.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SECTION 3: FUNDRAISING CATEGORIES ================= */}
        <section id="categories" className="scroll-mt-24 space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#02A95C]">
              Find the Right Cause for Your Story
            </span>
            <h2 className="mt-1 font-heading font-extrabold text-2xl sm:text-3xl text-gray-900">
              Fundraising Categories on GCC Foundation
            </h2>
            <p className="mt-1 text-sm text-gray-600 max-w-2xl">
              Explore our supported categories, what verification documents are needed for each, and how direct institutional payouts are settled.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {FUNDRAISING_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.name}
                  className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-subtle flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-emerald-50 text-[#02A95C] flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-heading font-bold text-lg text-gray-900">{cat.name}</h3>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{cat.description}</p>
                    <div className="rounded-xl bg-[#FAF9F6] border border-[#E5E7EB] p-3 text-xs space-y-1.5 text-gray-700">
                      <div>
                        <strong className="text-gray-900">Verification Needed:</strong> {cat.requirements}
                      </div>
                      <div>
                        <strong className="text-[#02A95C]">Payout Method:</strong> {cat.payoutTarget}
                      </div>
                    </div>
                  </div>
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <Link
                      href="/create/fundraiser/category"
                      className="rounded-full bg-[#02A95C] hover:bg-[#028F4D] text-white text-xs font-bold px-4 py-2.5 transition-colors"
                    >
                      Start in {cat.name.split(' ')[0]}
                    </Link>
                    <Link
                      href={`/?category=${cat.filterParam}#discover`}
                      className="rounded-full border border-gray-200 hover:border-gray-400 text-gray-800 text-xs font-bold px-4 py-2.5 transition-colors"
                    >
                      Browse {cat.name.split(' ')[0]} Causes
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================= SECTION 4: TEAM FUNDRAISING ================= */}
        <section id="team-fundraising" className="scroll-mt-24 bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-10 shadow-card space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#02A95C] flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#02A95C]">
                Collaborate Together
              </span>
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-gray-900">
                Team Fundraising for Families, Alumni & Communities
              </h2>
            </div>
          </div>

          <p className="text-sm text-gray-700 leading-relaxed max-w-3xl">
            Major medical procedures, borehole projects, and school infrastructure drives succeed fastest when organized by a dedicated committee rather than a single person. GCC Foundation supports coordinated team fundraising across families, Old Boys/Old Girls (OB/OG) school cohorts, faith congregations, and diaspora chapters.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-[#FAF9F6] border border-[#E5E7EB] p-5 space-y-2">
              <strong className="text-sm font-bold text-gray-900 block">1. Lead KYC Organizer</strong>
              <p className="text-xs text-gray-600 leading-relaxed">
                Submits the National ID (NIN), LC1 letter, and official hospital or school invoice, and coordinates directly with GCC compliance officers.
              </p>
            </div>
            <div className="rounded-2xl bg-[#FAF9F6] border border-[#E5E7EB] p-5 space-y-2">
              <strong className="text-sm font-bold text-gray-900 block">2. WhatsApp & Diaspora Captains</strong>
              <p className="text-xs text-gray-600 leading-relaxed">
                Share the verified campaign link across workplace groups, alumni networks, and international diaspora chapters to drive multi-currency gifts.
              </p>
            </div>
            <div className="rounded-2xl bg-[#FAF9F6] border border-[#E5E7EB] p-5 space-y-2">
              <strong className="text-sm font-bold text-gray-900 block">3. Field Update Coordinator</strong>
              <p className="text-xs text-gray-600 leading-relaxed">
                Posts bedside updates, thank-you notes, and stamped hospital receipt milestones to keep every supporter engaged.
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/create/fundraiser/category"
              className="inline-flex items-center gap-2 rounded-full bg-[#02A95C] hover:bg-[#028F4D] text-white text-sm font-bold px-6 py-3 transition-colors"
            >
              <span>Start a Team Fundraiser</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* ================= SECTION 5: FUNDRAISING BLOG ================= */}
        <section id="blog" className="scroll-mt-24 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-[#02A95C] flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#02A95C]">
                GCC Foundation Journal
              </span>
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-gray-900">
                Fundraising Blog: Resources, Field Guides & Insights
              </h2>
            </div>
          </div>

          <div className="space-y-4">
            {BLOG_ARTICLES.map((article) => {
              const isOpen = expandedArticle === article.id;
              return (
                <article
                  key={article.id}
                  className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-subtle space-y-3"
                >
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-bold text-[#02A95C] bg-emerald-50 px-2.5 py-0.5 rounded-full">
                      {article.tag}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500">{article.date}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500">{article.readTime}</span>
                  </div>

                  <h3 className="font-heading font-bold text-lg sm:text-xl text-gray-900">
                    {article.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{article.summary}</p>

                  {isOpen && (
                    <div className="pt-3 border-t border-gray-100 space-y-3 text-xs sm:text-sm text-gray-800 leading-relaxed">
                      {article.fullContent.map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setExpandedArticle(isOpen ? null : article.id)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#02A95C] hover:underline pt-1"
                  >
                    <span>{isOpen ? 'Show less' : 'Read full guide'}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </article>
              );
            })}
          </div>
        </section>

        {/* ================= SECTION 6: FUNDRAISING TIPS ================= */}
        <section id="tips" className="scroll-mt-24 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-[#02A95C] flex items-center justify-center shrink-0">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#02A95C]">
                Proven Best Practices
              </span>
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-gray-900">
                6 Fundraising Tips to Help Your Campaign Reach 100%
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FUNDRAISING_TIPS.map((tip) => (
              <div
                key={tip.number}
                className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-subtle space-y-2.5"
              >
                <span className="font-heading font-black text-lg text-[#02A95C] block">
                  {tip.number}
                </span>
                <h3 className="font-heading font-bold text-base text-gray-900">{tip.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{tip.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= SECTION 7: FUNDRAISING IDEAS ================= */}
        <section id="ideas" className="scroll-mt-24 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-[#02A95C] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#02A95C]">
                Campaign Inspiration
              </span>
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-gray-900">
                Fundraising Ideas That Inspire Community Action
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FUNDRAISING_IDEAS.map((idea) => (
              <div
                key={idea.title}
                className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-subtle flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <span className="inline-block text-[11px] font-bold text-[#3D5E16] bg-[#F4F7EE] px-2.5 py-0.5 rounded-full">
                    {idea.category}
                  </span>
                  <h3 className="font-heading font-bold text-base text-gray-900">{idea.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {idea.description}
                  </p>
                </div>
                <Link
                  href="/create/fundraiser/category"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#02A95C] hover:underline"
                >
                  <span>Launch this idea</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ================= SECTION 8: CHARITY & NONPROFIT FUNDRAISING ================= */}
        <section id="charity-fundraising" className="scroll-mt-24 bg-[#F4F7EE] border border-[#CDDCB3] rounded-3xl p-6 sm:p-10 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white text-[#3D5E16] border border-[#CDDCB3] flex items-center justify-center shrink-0">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#3D5E16]">
                0% Platform Fee for Nonprofits
              </span>
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-gray-900">
                Charity & Institutional Fundraising
              </h2>
            </div>
          </div>

          <p className="text-sm text-gray-800 leading-relaxed max-w-3xl">
            Registered East African NGOs, Community-Based Organizations (CBOs), mission hospitals, and accredited schools can raise local and international support on GCC Foundation with a <strong>0.0% platform fee</strong>. Every campaign includes an audited public ledger, downloadable CSV donor reports, and direct institutional bank EFT settlement.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-white rounded-2xl p-4 border border-[#CDDCB3] space-y-1">
              <strong className="text-gray-900 block font-bold">Direct Bank EFT Settlement</strong>
              <span className="text-gray-600 block">
                Disbursements wired directly to your organization’s registered Stanbic, Centenary, DFCU, or Absa bank account.
              </span>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-[#CDDCB3] space-y-1">
              <strong className="text-gray-900 block font-bold">Global Donorbox Checkout</strong>
              <span className="text-gray-600 block">
                Accept one-time and recurring monthly donations from supporters worldwide in USD, UGX, KES, GBP, and EUR.
              </span>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-[#CDDCB3] space-y-1">
              <strong className="text-gray-900 block font-bold">Verified Badge & Audit Trail</strong>
              <span className="text-gray-600 block">
                Receive the Verified Cause badge after NGO Bureau or institutional registration review.
              </span>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/create/fundraiser/category"
              className="rounded-full bg-[#02A95C] hover:bg-[#028F4D] text-white text-sm font-bold px-6 py-3 transition-colors"
            >
              Start a Charity Fundraiser
            </Link>
            <Link
              href="/sign-up"
              className="rounded-full bg-white border border-gray-300 hover:border-gray-900 text-gray-900 text-sm font-bold px-6 py-3 transition-colors"
            >
              Create Nonprofit Account
            </Link>
          </div>
        </section>

        {/* ================= SECTION 9: ANTI-FRAUD GUARANTEE & WHISTLEBLOWER ================= */}
        <div id="guarantee" className="scroll-mt-24 bg-[#1F310C] text-[#E6EED8] rounded-2xl p-8 sm:p-10 border border-[#2F4812] space-y-6">
          <div className="flex items-center gap-3">
            <Scale className="w-8 h-8 text-[#AFC68A]" />
            <div>
              <h3 className="font-heading font-extrabold text-2xl text-white">
                GCC Foundation 100% Anti-Fraud Guarantee
              </h3>
              <span className="text-xs text-gray-300">
                Institutional protection charter established under Uganda NGO Bureau Reg #INDR15982736NB
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-gray-200 leading-relaxed">
            <p>
              In the unlikely event that a campaign organizer provides falsified documentation that escapes initial scrutiny, or if a hospital confirms that a procedure was cancelled or overfunded, <strong className="text-white">GCC Foundation guarantees a 100% full refund</strong> to the donor’s original payment method.
            </p>
            <p>
              Alternatively, donors may opt to redirect their contributions to our emergency pediatric pool, where funds immediately clear awaiting infant heart surgery and neonatal ICU incubators.
            </p>
          </div>
        </div>

        {/* Whistleblower Channel */}
        <div id="whistleblower" className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-card space-y-4">
          <div className="flex items-center gap-2 text-amber-700">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-heading font-bold text-lg text-gray-900">
              Confidential Whistleblower & Fraud Hotdesk
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-gray-800 leading-relaxed">
            If you have reason to suspect any irregularities, inflated hospital bills, or identity impersonation in any campaign published on GCC Foundation, contact our independent compliance desk immediately. All tips are treated with strict legal confidentiality.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs">
            <a
              href="mailto:compliance@gccfoundation.org"
              className="inline-flex items-center gap-1.5 bg-[#FAF9F6] border border-[#E5E7EB] hover:border-gray-400 text-gray-900 font-bold px-4 py-2.5 rounded-lg transition-colors"
            >
              <Mail className="w-4 h-4 text-[#3D5E16]" />
              <span>compliance@gccfoundation.org</span>
            </a>
            <a
              href="tel:+256703601200"
              className="inline-flex items-center gap-1.5 bg-[#FAF9F6] border border-[#E5E7EB] hover:border-gray-400 text-gray-900 font-bold px-4 py-2.5 rounded-lg transition-colors"
            >
              <PhoneCall className="w-4 h-4 text-[#3D5E16]" />
              <span>Hotline: +256 (0) 703 601 200</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
