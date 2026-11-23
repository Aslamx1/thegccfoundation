'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Youtube, Mail } from 'lucide-react';

function TikTokIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.27 6.27 0 0 0 1.89-4.49V8.41a8.3 8.3 0 0 0 4.88 1.59V6.69z" />
    </svg>
  );
}

const footerGroups = [
  {
    title: 'Donate',
    links: [
      { label: 'Medical & hospital care', href: '/?category=Medical+Care' },
      { label: 'Education & tuition', href: '/?category=Education+%26+Tuition' },
      { label: 'Emergency relief', href: '/?category=Emergency+Relief' },
      { label: 'Water and community projects', href: '/?category=Clean+Water+Wells' },
    ],
  },
  {
    title: 'Fundraise',
    links: [
      { label: 'Start a fundraiser', href: '/create/fundraiser/category' },
      { label: 'How fundraising works', href: '/how-to-start' },
      { label: 'Fundraising categories', href: '/fundraising-categories' },
      { label: 'Create a community fundraiser', href: '/team-fundraising' },
    ],
  },
  {
    title: 'About',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'How GCC works', href: '/how-it-works' },
      { label: 'Giving and transparency', href: '/transparency' },
      { label: 'Our team', href: '/our-team' },
      { label: 'Sign in', href: '/sign-in' },
    ],
  },
  {
    title: 'Legal & Policies',
    links: [
      { label: 'Terms & Conditions', href: '/terms-and-conditions' },
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Fundraising tips', href: '/fundraising-tips' },
      { label: 'Transparency & Reports', href: '/transparency' },
    ],
  },
];

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const currentYear = new Date().getFullYear() || 2026;

  return (
    <footer className="border-t border-[#e6e9e6] bg-[#f7f8f6] text-[#20251f]">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        {/* Navigation Columns */}
        <nav aria-label="Footer navigation" className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 md:gap-x-10">
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h2 className="mb-5 text-sm font-bold tracking-tight text-[#20251f]">{group.title}</h2>
              <ul className="space-y-4">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-[#515a53] transition-colors hover:text-[#087443] hover:underline">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Social Media & Contact Card */}
        <div className="mt-12 rounded-2xl bg-white border border-[#e1e5e1] p-6 sm:p-7 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#02A95C]">Official Social Media &amp; Contact</span>
              <h3 className="font-heading text-lg font-bold text-[#20251F]">Connect with The GCC Foundation</h3>
              <p className="text-xs text-gray-600 max-w-md leading-relaxed">
                Watch our children&apos;s daily talents, performances, and updates across our official YouTube channel and TikTok accounts.
              </p>
              <div className="pt-1.5">
                <a
                  href="mailto:mkyagulanyimesach@gmail.com"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#087443] hover:text-[#02A95C] transition-colors hover:underline"
                >
                  <Mail className="w-4 h-4 text-[#02A95C]" />
                  <span>mkyagulanyimesach@gmail.com</span>
                </a>
              </div>
            </div>

            {/* Social Accounts */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* YouTube */}
              <a
                href="http://www.youtube.com/@GccFoundation1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 hover:bg-red-100 px-3.5 py-2 text-xs font-bold text-red-700 transition-colors shadow-2xs"
              >
                <Youtube className="w-4 h-4 text-red-600" />
                <span>YouTube @GccFoundation1</span>
              </a>

              {/* TikTok 1 */}
              <a
                href="http://www.tiktok.com/@gcc.foundation?_r=1&_t=ZS-9BdyXvwYDXo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 hover:bg-gray-100 px-3.5 py-2 text-xs font-bold text-[#1A1A1A] transition-colors shadow-2xs"
              >
                <TikTokIcon className="w-3.5 h-3.5" />
                <span>TikTok @gcc.foundation</span>
              </a>

              {/* TikTok 2 */}
              <a
                href="https://www.tiktok.com/@new.hopee1?_r=1&_t=ZS-9BdysphfLPN"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 hover:bg-gray-100 px-3.5 py-2 text-xs font-bold text-[#1A1A1A] transition-colors shadow-2xs"
              >
                <TikTokIcon className="w-3.5 h-3.5" />
                <span>TikTok @new.hopee1</span>
              </a>

              {/* TikTok 3 */}
              <a
                href="https://www.tiktok.com/@village.of.faith?_r=1&_t=ZS-9Bdz2ujY8Xs"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 hover:bg-gray-100 px-3.5 py-2 text-xs font-bold text-[#1A1A1A] transition-colors shadow-2xs"
              >
                <TikTokIcon className="w-3.5 h-3.5" />
                <span>TikTok @village.of.faith</span>
              </a>
            </div>
          </div>
        </div>

        {/* Brand and Utility Links */}
        <div className="mt-8 flex flex-col gap-6 border-t border-[#e1e5e1] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col items-start gap-2">
            <Link href="/" aria-label="GCC Foundation home">
              <Image src="/images/gcc-logo-full.jpg" alt="GCC Foundation" width={170} height={46} className="h-9 w-auto object-contain" />
            </Link>
            <p className="max-w-sm text-xs leading-relaxed text-[#69716b]">
              Community giving, with clear campaign updates and transparent reporting across East Africa.
            </p>
            <a
              href="mailto:mkyagulanyimesach@gmail.com"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#02A95C] hover:underline"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>mkyagulanyimesach@gmail.com</span>
            </a>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#69716b]">
            <Link href="/terms-and-conditions" className="hover:text-[#20251f] hover:underline">Terms &amp; Conditions</Link>
            <Link href="/privacy-policy" className="hover:text-[#20251f] hover:underline">Privacy Policy</Link>
            <Link href="/transparency" className="hover:text-[#20251f] hover:underline">Transparency</Link>
            <Link href="/about" className="hover:text-[#20251f] hover:underline">About Us</Link>
          </div>
        </div>

        {/* Clean Centered Copyright Bar */}
        <div className="mt-8 border-t border-[#e6e9e6] pt-6 text-center text-xs text-[#69716b]">
          <p>© {currentYear} Gcc Foundation. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
