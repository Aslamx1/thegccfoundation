'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

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

        {/* Brand and Utility Links */}
        <div className="mt-12 flex flex-col gap-6 border-t border-[#e1e5e1] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col items-start gap-3">
            <Link href="/" aria-label="GCC Foundation home">
              <Image src="/images/gcc-logo-full.jpg" alt="GCC Foundation" width={170} height={46} className="h-9 w-auto object-contain" />
            </Link>
            <p className="max-w-sm text-xs leading-relaxed text-[#69716b]">
              Community giving, with clear campaign updates and transparent reporting across East Africa.
            </p>
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
