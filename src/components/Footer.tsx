


import Link from 'next/link';
import Image from 'next/image';

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
      { label: 'How fundraising works', href: '/how-it-works#how-to-start' },
      { label: 'Fundraising categories', href: '/how-it-works#categories' },
      { label: 'Create a community fundraiser', href: '/how-it-works#team-fundraising' },
    ],
  },
  {
    title: 'About',
    links: [
      { label: 'How GCC works', href: '/how-it-works' },
      { label: 'Giving and transparency', href: '/transparency' },
      { label: 'Our team', href: '/our-team' },
      { label: 'Sign in', href: '/sign-in' },
    ],
  },
  {
    title: 'More resources',
    links: [
      { label: 'Browse fundraisers', href: '/#discover' },
      { label: 'Fundraising tips', href: '/how-it-works#tips' },
      { label: 'Campaign updates and reporting', href: '/transparency' },
      { label: 'Start a fundraiser', href: '/create/fundraiser/category' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-[#e6e9e6] bg-[#f7f8f6] text-[#20251f]">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
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

        <div className="mt-12 flex flex-col gap-6 border-t border-[#e1e5e1] pt-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col items-start gap-3">
            <Link href="/" aria-label="GCC Foundation home">
              <Image src="/images/gcc-logo-full.jpg" alt="GCC Foundation" width={170} height={46} className="h-9 w-auto object-contain" />
            </Link>
            <p className="max-w-sm text-xs leading-relaxed text-[#69716b]">
              Community giving, with clear campaign updates and transparent reporting.
            </p>
          </div>
          <div className="flex flex-col gap-3 text-xs text-[#69716b] sm:items-end">
            <p>© {new Date().getFullYear()} GCC Foundation. All rights reserved.</p>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              <Link href="/how-it-works" className="hover:text-[#20251f] hover:underline">How GCC works</Link>
              <Link href="/transparency" className="hover:text-[#20251f] hover:underline">Transparency</Link>
              <Link href="/our-team" className="hover:text-[#20251f] hover:underline">About GCC</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

