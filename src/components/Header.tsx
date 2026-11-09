'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useDonation } from '@/context/DonationContext';
import { Search, ChevronDown, Menu, X, ShieldCheck, HeartHandshake, PlusCircle, Building2 } from 'lucide-react';

export default function Header() {
  const { openSearchModal } = useDonation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [donateDropdownOpen, setDonateDropdownOpen] = useState(false);
  const [fundraiseDropdownOpen, setFundraiseDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E5E7EB] h-[72px]">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* LEFT NAV: Search, Donate dropdown, Fundraise dropdown */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Search Trigger (GoFundMe Style) */}
          <button
            type="button"
            onClick={openSearchModal}
            className="flex items-center gap-2 py-2 px-3 text-sm font-semibold text-[#1A1A1A] hover:bg-[#FBF9F6] rounded-full transition-colors"
            aria-label="Search fundraisers"
          >
            <Search className="w-4 h-4 text-gray-700" />
            <span className="hidden sm:inline">Search</span>
          </button>

          {/* Donate Dropdown */}
          <div className="relative hidden md:block">
            <button
              type="button"
              onClick={() => {
                setDonateDropdownOpen(!donateDropdownOpen);
                setFundraiseDropdownOpen(false);
              }}
              onMouseEnter={() => setDonateDropdownOpen(true)}
              className="flex items-center gap-1 py-2 px-3 text-sm font-semibold text-[#1A1A1A] hover:text-[#02A95C] rounded-full transition-colors"
            >
              <span>Donate</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
            </button>

            {donateDropdownOpen && (
              <div
                onMouseLeave={() => setDonateDropdownOpen(false)}
                className="absolute top-full left-0 mt-1 w-56 bg-white border border-[#E5E7EB] rounded-2xl shadow-elevated py-2 z-50 animate-fadeIn"
              >
                <div className="px-4 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Verified Causes
                </div>
                <Link
                  href="/?category=Medical+Care"
                  onClick={() => setDonateDropdownOpen(false)}
                  className="block px-4 py-2 text-sm text-[#1A1A1A] hover:bg-[#FBF9F6] hover:text-[#02A95C] font-medium"
                >
                  Medical & Surgery
                </Link>
                <Link
                  href="/?category=Education+%26+Tuition"
                  onClick={() => setDonateDropdownOpen(false)}
                  className="block px-4 py-2 text-sm text-[#1A1A1A] hover:bg-[#FBF9F6] hover:text-[#02A95C] font-medium"
                >
                  Education & Tuition
                </Link>
                <Link
                  href="/?category=Emergency+Relief"
                  onClick={() => setDonateDropdownOpen(false)}
                  className="block px-4 py-2 text-sm text-[#1A1A1A] hover:bg-[#FBF9F6] hover:text-[#02A95C] font-medium"
                >
                  Emergency Relief
                </Link>
                <Link
                  href="/?category=Clean+Water+Wells"
                  onClick={() => setDonateDropdownOpen(false)}
                  className="block px-4 py-2 text-sm text-[#1A1A1A] hover:bg-[#FBF9F6] hover:text-[#02A95C] font-medium"
                >
                  Clean Water Wells
                </Link>
              </div>
            )}
          </div>

          {/* Fundraise Dropdown */}
          <div className="relative hidden md:block">
            <button
              type="button"
              onClick={() => {
                setFundraiseDropdownOpen(!fundraiseDropdownOpen);
                setDonateDropdownOpen(false);
              }}
              onMouseEnter={() => setFundraiseDropdownOpen(true)}
              className="flex items-center gap-1 py-2 px-3 text-sm font-semibold text-[#1A1A1A] hover:text-[#02A95C] rounded-full transition-colors"
            >
              <span>Fundraise</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
            </button>

            {fundraiseDropdownOpen && (
              <div
                onMouseLeave={() => setFundraiseDropdownOpen(false)}
                className="absolute top-full left-0 mt-1 w-64 bg-white border border-[#E5E7EB] rounded-2xl shadow-elevated py-2 z-50 animate-fadeIn"
              >
                <div className="px-4 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  How to Fundraise
                </div>
                <Link
                  href="/create-campaign"
                  onClick={() => setFundraiseDropdownOpen(false)}
                  className="block px-4 py-2 text-sm text-[#1A1A1A] hover:bg-[#FBF9F6] hover:text-[#02A95C] font-medium"
                >
                  Start a Fundraiser (0% Fee)
                </Link>
                <Link
                  href="/how-it-works"
                  onClick={() => setFundraiseDropdownOpen(false)}
                  className="block px-4 py-2 text-sm text-[#1A1A1A] hover:bg-[#FBF9F6] hover:text-[#02A95C] font-medium"
                >
                  How Vetting Works
                </Link>
                <Link
                  href="/transparency"
                  onClick={() => setFundraiseDropdownOpen(false)}
                  className="block px-4 py-2 text-sm text-[#1A1A1A] hover:bg-[#FBF9F6] hover:text-[#02A95C] font-medium"
                >
                  Public Disbursement Ledger
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* CENTER: GCC FOUNDATION Brand Mark */}
        <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
          <div className="relative w-8 h-8 flex-shrink-0">
            <Image
              src="/images/gcc-emblem.png"
              alt="GCC Foundation Emblem"
              width={32}
              height={32}
              className="object-contain"
              priority
            />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-heading font-black text-xl tracking-tight text-[#3D5E16]">
              GCC
            </span>
            <span className="font-heading font-extrabold text-[11px] tracking-[0.2em] text-[#D97706] uppercase">
              FOUNDATION
            </span>
          </div>
        </Link>

        {/* RIGHT: About, Sign in, Pill Outlined "Start a Fundraiser" */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/our-team"
            className="hidden lg:inline-block py-2 px-3 text-sm font-semibold text-[#1A1A1A] hover:text-[#02A95C] transition-colors"
          >
            About
          </Link>

          <Link
            href="/admin"
            className="hidden sm:inline-block py-2 px-3 text-sm font-semibold text-[#1A1A1A] hover:text-[#02A95C] transition-colors"
          >
            Sign in
          </Link>

          {/* GoFundMe Exact Outlined Pill Button */}
          <Link
            href="/create-campaign"
            className="inline-flex items-center justify-center border border-[#1A1A1A] hover:border-[#02A95C] hover:bg-[#02A95C] hover:text-white text-[#1A1A1A] text-xs sm:text-sm font-bold py-2 sm:py-2.5 px-4 sm:px-5 rounded-full transition-all"
          >
            Start a Fundraiser
          </Link>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-black"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#E5E7EB] px-4 py-4 space-y-3 animate-fadeIn">
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
            <Link
              href="/our-team"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 text-sm font-semibold text-[#1A1A1A] hover:bg-[#FBF9F6] rounded-lg"
            >
              About & Team
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 text-sm font-semibold text-[#1A1A1A] hover:bg-[#FBF9F6] rounded-lg"
            >
              Auditor Portal
            </Link>
          </div>

          <div className="pt-2">
            <Link
              href="/create-campaign"
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
