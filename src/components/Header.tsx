'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useDonation } from '@/context/DonationContext';
import { useAuth } from '@/context/AuthContext';
import { Search, ChevronDown, Menu, X, LogOut, ArrowRight, HeartHandshake, Building2 } from 'lucide-react';

const aboutResources = [
  { title: 'How GCC works', description: 'Step-by-step help to get started', href: '/about#how-it-works' },
  { title: 'Trust and safety', description: 'Reporting and published safeguards', href: '/about#safety' },
  { title: 'Supported countries', description: 'Explore fundraiser locations', href: '/about#countries' },
  { title: 'Pricing', description: 'Platform fee and payment details', href: '/about#pricing' },
  { title: 'Help Center', description: 'Answers and guided support', href: '/about#help' },
  { title: 'About GCC', description: 'Learn about the foundation and team', href: '/about#about-gcc' },
  { title: 'Newsroom', description: 'News and campaign updates', href: '/about#newsroom' },
  { title: 'Careers', description: 'Explore current opportunities', href: '/about#careers' },
  { title: 'GCC Foundation', description: 'Community giving across East Africa', href: '/about#foundation' },
  { title: 'Partnerships', description: 'Learn about working with GCC', href: '/about#partnerships' },
];
export default function Header() {
  const { openSearchModal, openDonationModal } = useDonation();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [donateDropdownOpen, setDonateDropdownOpen] = useState(false);
  const [fundraiseDropdownOpen, setFundraiseDropdownOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const donateMenuRef = useRef<HTMLDivElement>(null);
  const fundraiseMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const aboutMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const closeMenus = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
        setDonateDropdownOpen(false);
        setFundraiseDropdownOpen(false);
        setProfileMenuOpen(false);
        setAboutDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', closeMenus);
    return () => window.removeEventListener('keydown', closeMenus);
  }, []);
  useEffect(() => {
    const closeWhenOutside = (event: Event) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (!donateMenuRef.current?.contains(target)) setDonateDropdownOpen(false);
      if (!fundraiseMenuRef.current?.contains(target)) setFundraiseDropdownOpen(false);
      if (!profileMenuRef.current?.contains(target)) setProfileMenuOpen(false);
      if (!aboutMenuRef.current?.contains(target)) setAboutDropdownOpen(false);
      if (!mobileMenuRef.current?.contains(target) && !mobileToggleRef.current?.contains(target)) setMobileMenuOpen(false);
    };
    document.addEventListener('pointerdown', closeWhenOutside);
    document.addEventListener('focusin', closeWhenOutside);
    return () => {
      document.removeEventListener('pointerdown', closeWhenOutside);
      document.removeEventListener('focusin', closeWhenOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E5E7EB] h-16 md:h-[72px]">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* LEFT NAV: Search, Donate dropdown, Fundraise dropdown */}
        <div className="flex min-w-0 items-center gap-0.5 sm:gap-2">
          {/* Campaign search */}
          <button
            type="button"
            onClick={openSearchModal}
            className="flex items-center gap-2 py-2 px-2 sm:px-3 text-sm font-semibold text-[#1A1A1A] hover:bg-[#FBF9F6] rounded-full transition-colors"
            aria-label="Search fundraisers"
          >
            <Search className="w-4 h-4 text-gray-700" />
            <span className="hidden sm:inline">Search</span>
          </button>

          {/* Donate Dropdown */}
          <div ref={donateMenuRef} className="relative hidden md:block" onMouseLeave={() => setDonateDropdownOpen(false)}>
            <button
              type="button"
              aria-haspopup="true"
              aria-expanded={donateDropdownOpen}
              onClick={() => {
                setDonateDropdownOpen(!donateDropdownOpen);
                setFundraiseDropdownOpen(false);
              }}
              onMouseEnter={() => setDonateDropdownOpen(true)}
              className="flex items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold text-[#1A1A1A] transition-colors hover:text-[#02A95C]"
            >
              <span>Donate</span>
              <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
            </button>

            {donateDropdownOpen && (
              <div onMouseLeave={() => setDonateDropdownOpen(false)} className="absolute left-0 top-full z-50 mt-0 w-[min(440px,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white p-5 shadow-2xl animate-fadeIn">
                <div className="mb-3 flex items-center justify-between gap-3 rounded-2xl bg-[#F5F8F4] p-3.5 border border-[#DCE9DD]">
                  <div>
                    <strong className="block text-sm text-[#20251F]">Support GCC Foundation</strong>
                    <span className="text-xs text-gray-600">100% direct institutional payouts</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setDonateDropdownOpen(false);
                      openDonationModal();
                    }}
                    className="shrink-0 rounded-full bg-[#02A95C] px-4 py-2 text-xs font-bold text-white hover:bg-[#028F4D] transition-colors"
                  >
                    Donate Now
                  </button>
                </div>
                <h3 className="px-2 text-sm font-bold text-[#20251F]">Discover fundraisers and community causes to support</h3>
                <div className="mt-2 grid grid-cols-1 gap-1">
                  <Link href="/#discover" onClick={() => setDonateDropdownOpen(false)} className="group rounded-2xl p-3 hover:bg-[#F6F8F5]">
                    <strong className="block text-sm text-[#20251F] group-hover:text-[#087443]">Categories</strong>
                    <span className="mt-1 block text-xs text-gray-500">Browse fundraisers by category</span>
                  </Link>
                  <Link href="/?category=Emergency+Relief" onClick={() => setDonateDropdownOpen(false)} className="group rounded-2xl p-3 hover:bg-[#F6F8F5]">
                    <strong className="block text-sm text-[#20251F] group-hover:text-[#087443]">Crisis relief</strong>
                    <span className="mt-1 block text-xs text-gray-500">Explore fundraisers responding to urgent needs</span>
                  </Link>
                  <Link href="/?category=Community+Infrastructure" onClick={() => setDonateDropdownOpen(false)} className="group rounded-2xl p-3 hover:bg-[#F6F8F5]">
                    <strong className="block text-sm text-[#20251F] group-hover:text-[#087443]">Social Impact Funds</strong>
                    <span className="mt-1 block text-xs text-gray-500">Support community-led projects and local impact</span>
                  </Link>
                  <Link href="/how-it-works" onClick={() => setDonateDropdownOpen(false)} className="group rounded-2xl p-3 hover:bg-[#F6F8F5]">
                    <strong className="block text-sm text-[#20251F] group-hover:text-[#087443]">Supporter Space</strong>
                    <span className="mt-1 block text-xs text-gray-500">Giving guidance, answers, and ways to help</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
          {/* Fundraise menu */}
          <div ref={fundraiseMenuRef} className="relative hidden md:block" onMouseEnter={() => setFundraiseDropdownOpen(true)} onMouseLeave={() => setFundraiseDropdownOpen(false)}>
            <button type="button" aria-haspopup="true" aria-expanded={fundraiseDropdownOpen} onFocus={() => setFundraiseDropdownOpen(true)} onClick={() => { setFundraiseDropdownOpen(true); setDonateDropdownOpen(false); }} className="flex items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold text-[#1A1A1A] transition-colors hover:text-[#02A95C]">
              <span>Fundraise</span>
              <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
            </button>
            {fundraiseDropdownOpen && (
              <div role="region" aria-label="Fundraising resources" className="absolute left-0 top-full z-50 mt-0 w-[min(860px,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white shadow-2xl animate-fadeIn md:-left-10 lg:left-0">
                <div className="grid grid-cols-[260px_minmax(0,1fr)]">
                  <div className="flex flex-col items-start bg-[#F5F8F4] p-6">
                    <span className="rounded-full border border-[#DCE9DD] bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[.12em] text-[#287348]">Fundraise with GCC</span>
                    <h3 className="mt-4 font-heading text-xl font-extrabold leading-tight text-[#20251F]">Start with a story that brings people together.</h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">Create a fundraiser in guided steps, choose a goal, and keep supporters updated as you go.</p>
                    <Link href="/create/fundraiser/category" onClick={() => setFundraiseDropdownOpen(false)} className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#02A95C] px-5 py-3 text-sm font-bold text-white hover:bg-[#028F4D]">Start a fundraiser <ArrowRight className="h-4 w-4" /></Link>
                    <span className="mt-3 text-xs text-gray-500">It only takes a few minutes to get started.</span>
                  </div>
                  <div className="p-4">
                    <h3 className="px-3 pb-3 pt-1 text-sm font-bold text-[#20251F]">Start fundraising, tips, and resources</h3>
                    <div className="grid grid-cols-2 gap-1">
                      <Link href="/how-to-start" onClick={() => setFundraiseDropdownOpen(false)} className="group rounded-2xl p-3 hover:bg-[#F6F8F5]"><strong className="block text-sm text-[#20251F] group-hover:text-[#087443]">How to start a fundraiser</strong><span className="mt-1 block text-xs leading-relaxed text-gray-500">Step-by-step help and guidance</span></Link>
                      <Link href="/fundraising-categories" onClick={() => setFundraiseDropdownOpen(false)} className="group rounded-2xl p-3 hover:bg-[#F6F8F5]"><strong className="block text-sm text-[#20251F] group-hover:text-[#087443]">Fundraising categories</strong><span className="mt-1 block text-xs leading-relaxed text-gray-500">Find the right cause for your story</span></Link>
                      <Link href="/team-fundraising" onClick={() => setFundraiseDropdownOpen(false)} className="group rounded-2xl p-3 hover:bg-[#F6F8F5]"><strong className="block text-sm text-[#20251F] group-hover:text-[#087443]">Team fundraising</strong><span className="mt-1 block text-xs leading-relaxed text-gray-500">Start a fundraiser your community can support</span></Link>
                      <Link href="/fundraising-blog" onClick={() => setFundraiseDropdownOpen(false)} className="group rounded-2xl p-3 hover:bg-[#F6F8F5]"><strong className="block text-sm text-[#20251F] group-hover:text-[#087443]">Fundraising blog</strong><span className="mt-1 block text-xs leading-relaxed text-gray-500">Resources, tips, and guidance</span></Link>
                      <Link href="/fundraising-tips" onClick={() => setFundraiseDropdownOpen(false)} className="group rounded-2xl p-3 hover:bg-[#F6F8F5]"><strong className="block text-sm text-[#20251F] group-hover:text-[#087443]">Fundraising tips</strong><span className="mt-1 block text-xs leading-relaxed text-gray-500">Ideas to help your fundraiser grow</span></Link>
                      <Link href="/fundraising-ideas" onClick={() => setFundraiseDropdownOpen(false)} className="group rounded-2xl p-3 hover:bg-[#F6F8F5]"><strong className="block text-sm text-[#20251F] group-hover:text-[#087443]">Fundraising ideas</strong><span className="mt-1 block text-xs leading-relaxed text-gray-500">Get inspiration for your campaign</span></Link>
                      <Link href="/charity-fundraising" onClick={() => setFundraiseDropdownOpen(false)} className="group rounded-2xl p-3 hover:bg-[#F6F8F5]"><strong className="block text-sm text-[#20251F] group-hover:text-[#087443]">Charity fundraising</strong><span className="mt-1 block text-xs leading-relaxed text-gray-500">Raise support for a community cause</span></Link>
                      <Link href="/sign-up" onClick={() => setFundraiseDropdownOpen(false)} className="group rounded-2xl p-3 hover:bg-[#F6F8F5]"><strong className="block text-sm text-[#20251F] group-hover:text-[#087443]">Sign up as a nonprofit</strong><span className="mt-1 block text-xs leading-relaxed text-gray-500">Create an account to get started</span></Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>        </div>

        {/* CENTER: GCC FOUNDATION Brand Mark */}
        <Link href="/" aria-label="GCC Foundation home" title="Go to GCC Foundation home" className="flex min-w-0 items-center group flex-shrink">
          <Image
            src="/images/gcc-logo-full.jpg"
            alt="The GCC Foundation"
            width={200}
            height={55}
            className="h-7 w-auto max-w-[104px] object-contain sm:h-11 sm:max-w-none"
            priority
          />
        </Link>

        {/* RIGHT: About, Sign in, Pill Outlined "Start a Fundraiser" */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-4">
          <div ref={aboutMenuRef} className="relative hidden lg:block" onMouseLeave={() => setAboutDropdownOpen(false)}>
            <button type="button" aria-haspopup="true" aria-expanded={aboutDropdownOpen} onClick={() => { setAboutDropdownOpen((open) => !open); setDonateDropdownOpen(false); setFundraiseDropdownOpen(false); }} className="flex items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold text-[#1A1A1A] transition-colors hover:text-[#02A95C]">
              About <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
            </button>
            {aboutDropdownOpen && <div className="absolute right-0 top-full z-50 mt-0 w-[min(760px,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white p-5 shadow-2xl animate-fadeIn">
              <h3 className="px-2 text-sm font-bold text-[#20251F]">How it works, pricing, and more</h3>
              <div className="mt-3 grid grid-cols-2 gap-1">{aboutResources.map((resource) => <Link key={resource.title} href={resource.href} onClick={() => setAboutDropdownOpen(false)} className="group rounded-2xl p-3 hover:bg-[#F6F8F5]"><strong className="block text-sm text-[#20251F] group-hover:text-[#087443]">{resource.title}</strong><span className="mt-1 block text-xs leading-relaxed text-gray-500">{resource.description}</span></Link>)}</div>
            </div>}
          </div>

          {user ? (
            <div ref={profileMenuRef} className="relative hidden sm:block" onMouseLeave={() => setProfileMenuOpen(false)}>
              <button
                type="button"
                aria-label="Open account menu"
                aria-expanded={profileMenuOpen}
                onClick={() => setProfileMenuOpen((open) => !open)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8F4EC] text-sm font-bold text-[#126B3A] hover:bg-[#DCEFE2]"
              >
                {user.name.charAt(0).toUpperCase() || 'U'}
              </button>
              {profileMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-[#E5E7EB] bg-white p-2 shadow-xl">
                  <div className="border-b border-[#EEF0ED] px-3 py-2">
                    <p className="truncate text-sm font-bold text-[#20251F]">{user.name}</p>
                    <p className="truncate text-xs text-gray-500">{user.email}</p>
                  </div>
                  <Link href="/account/profile" onClick={() => setProfileMenuOpen(false)} className="block rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-[#F6F8F5]">Profile</Link>
                  <Link href="/account/impact" onClick={() => setProfileMenuOpen(false)} className="block rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-[#F6F8F5]">Your impact</Link>
                  <Link href="/messages/primary" onClick={() => setProfileMenuOpen(false)} className="block rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-[#F6F8F5]">Messages</Link>
                  <Link href="/account/settings" onClick={() => setProfileMenuOpen(false)} className="block rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-[#F6F8F5]">Account settings</Link>
                  <Link href="/create/fundraiser/category" onClick={() => setProfileMenuOpen(false)} className="block rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-[#F6F8F5]">Start a fundraiser</Link>
                  {user.role === 'admin' && <Link href="/admin" onClick={() => setProfileMenuOpen(false)} className="block rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-[#F6F8F5]">Admin dashboard</Link>}
                  <button type="button" onClick={() => { logout(); setProfileMenuOpen(false); }} className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-gray-700 hover:bg-[#F6F8F5]"><LogOut className="h-4 w-4" />Sign out</button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/sign-in" className="hidden sm:inline-block py-2 px-3 text-sm font-semibold text-[#1A1A1A] hover:text-[#02A95C] transition-colors">Sign in</Link>
          )}

          {/* Primary fundraiser action */}
          <Link
            href="/create/fundraiser/category"
            className="inline-flex items-center justify-center border border-[#1A1A1A] hover:border-[#02A95C] hover:bg-[#02A95C] hover:text-white text-[#1A1A1A] text-xs sm:text-sm font-bold py-2 sm:py-2.5 px-2.5 sm:px-5 rounded-full whitespace-nowrap transition-all"
          >
            Start a Fundraiser
          </Link>

          {/* Mobile hamburger */}
          <button ref={mobileToggleRef}
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-full text-gray-700 hover:bg-[#FBF9F6] hover:text-black"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div ref={mobileMenuRef} className="md:hidden bg-white border-b border-[#E5E7EB] px-4 py-4 space-y-3 animate-fadeIn">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              openSearchModal();
            }}
            className="w-full flex items-center gap-2 py-2.5 px-3 bg-[#FBF9F6] border border-[#E5E7EB] rounded-full text-xs text-gray-700 font-semibold"
          >
            <Search className="w-4 h-4 text-gray-500" />
            <span>Search fundraisers...</span>
          </button>

          <div className="space-y-1 pt-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                openDonationModal();
              }}
              className="w-full text-left block py-2 px-3 text-sm font-bold text-[#02A95C] hover:bg-[#FBF9F6] rounded-lg"
            >
              Donate Now
            </button>
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 text-sm font-semibold text-[#1A1A1A] hover:bg-[#FBF9F6] rounded-lg"
            >
              Discover Causes
            </Link>
            <Link
              href="/how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 text-sm font-semibold text-[#1A1A1A] hover:bg-[#FBF9F6] rounded-lg"
            >
              How Vetting Works
            </Link>
            <Link
              href="/transparency"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 text-sm font-semibold text-[#1A1A1A] hover:bg-[#FBF9F6] rounded-lg"
            >
              Public Financial Ledger
            </Link>
            <details className="group rounded-lg px-3 py-2">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-[#1A1A1A]">
                About <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-2 text-xs font-semibold text-gray-500">How it works, pricing, and more</p>
              <div className="mt-1 space-y-1">
                {aboutResources.map((resource) => (
                  <Link key={resource.title} href={resource.href} onClick={() => setMobileMenuOpen(false)} className="block rounded-md px-2 py-2 text-sm text-gray-700 hover:bg-[#FBF9F6]">
                    {resource.title}
                  </Link>
                ))}
              </div>
            </details>
            {user ? (
              <>
                <Link href="/account/profile" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-semibold text-[#1A1A1A] hover:bg-[#FBF9F6]">Profile</Link>
                <Link href="/account/impact" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-semibold text-[#1A1A1A] hover:bg-[#FBF9F6]">Your impact</Link>
                <Link href="/messages/primary" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-semibold text-[#1A1A1A] hover:bg-[#FBF9F6]">Messages</Link>
                <Link href="/account/settings" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-semibold text-[#1A1A1A] hover:bg-[#FBF9F6]">Account settings</Link>
                <button type="button" onClick={() => { logout(); setMobileMenuOpen(false); }} className="block w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-[#1A1A1A] hover:bg-[#FBF9F6]">Sign out of {user.name}</button>
              </>
            ) : (
              <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-semibold text-[#1A1A1A] hover:bg-[#FBF9F6]">Sign in to GCC</Link>
            )}
          </div>

          <div className="pt-2">
            <Link
              href="/create/fundraiser/category"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center bg-[#02A95C] text-white font-bold text-sm py-3 rounded-full shadow-sm"
            >
              Start a GCC Fundraiser
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}




