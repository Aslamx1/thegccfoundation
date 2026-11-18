'use client';

import Header from '@/components/Header';
import Link from 'next/link';

const resources = [
  { id: 'how-it-works', title: 'How GCC works', description: 'Learn how our 4-tier in-person vetting and direct institutional payouts protect every donor and beneficiary.', action: 'Read how it works', href: '/how-it-works' },
  { id: 'safety', title: 'Trust and safety', description: 'Review our anti-fraud safeguards, bedside verification standards, and public financial audit ledger.', action: 'View transparency ledger', href: '/transparency' },
  { id: 'countries', title: 'Supported countries', description: 'Start a verified fundraiser across Uganda, Kenya, Tanzania, Rwanda, and partner communities worldwide.', action: 'Start a fundraiser', href: '/create/fundraiser/category' },
  { id: 'pricing', title: 'Pricing & 0% charity fee', description: 'GCC Foundation charges a 0% platform fee for causes so 100% of your gift reaches verified hospital and school accounts.', action: 'See pricing details', href: '#pricing-details' },
  { id: 'help', title: 'Help Center', description: 'Get instant answers from the GCC Bot or connect with our Kampala compliance and donor support desk.', action: 'Ask GCC Bot', actionType: 'assistant' as const },
  { id: 'about-gcc', title: 'About GCC', description: 'Meet the medical auditors, field officers, and governance leaders behind GCC Foundation.', action: 'Meet the team', href: '/our-team' },
  { id: 'newsroom', title: 'Newsroom & field updates', description: 'Follow real-time surgical milestones, borehole completions, and verified institutional disbursements.', action: 'Browse field updates', href: '/transparency' },
  { id: 'careers', title: 'Careers & field fellowship', description: 'Join our regional verification and community impact teams across East Africa.', action: 'Contact our team', href: '/our-team' },
  { id: 'foundation', title: 'GCC Foundation', description: 'Direct institutional giving with transparent public receipt ledgers across East Africa.', action: 'Explore causes', href: '/' },
  { id: 'partnerships', title: 'Institutional partnerships', description: 'Partner with GCC Foundation as an accredited hospital, school, or community NGO.', action: 'Contact GCC Support', href: 'tel:+256703601200' },
];

export default function AboutResourcesPage() {
  return (
    <div className="min-h-screen bg-[#f8faf7]">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-wide text-[#087443]">About GCC Foundation</p>
          <h1 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-[#20251f] sm:text-4xl">
            How it works, pricing, and institutional trust
          </h1>
          <p className="mt-4 text-base leading-relaxed text-[#626b64]">
            Learn how GCC Foundation verifies every campaign in person, protects donors with our 100% Giving Guarantee, and wires funds directly to accredited hospitals and schools.
          </p>
        </div>

        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <article id={resource.id} key={resource.id} className="flex scroll-mt-24 flex-col rounded-2xl border border-[#e2e8e2] bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-[#20251f]">{resource.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-[#626b64]">{resource.description}</p>
              {resource.actionType === 'assistant' ? (
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new Event('gcc:open-hopebot'))}
                  className="mt-5 self-start rounded-full bg-[#087443] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#066339]"
                >
                  {resource.action}
                </button>
              ) : (
                <Link href={resource.href ?? '#'} className="mt-5 self-start text-sm font-bold text-[#087443] hover:underline">
                  {resource.action}
                </Link>
              )}
            </article>
          ))}
        </div>

        <section id="pricing-details" className="mt-10 scroll-mt-24 rounded-2xl border border-[#dce8dd] bg-[#eff7ef] p-6 sm:p-8">
          <h2 className="text-xl font-bold text-[#20251f]">0% Platform Fee for Verified Causes</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#526057]">
            GCC Foundation charges a 0% platform fee on charitable campaigns. Donations are processed securely through Donorbox and wired directly to the verified hospital treasury, school bursar, or certified project contractor, with stamped EFT receipts published on the public ledger.
          </p>
        </section>
      </main>
    </div>
  );
}
