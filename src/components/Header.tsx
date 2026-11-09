'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, PlusCircle, ShieldCheck, FileSpreadsheet, Users, Menu, X, Lock } from 'lucide-react';

interface HeaderProps {
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
}

export default function Header({ searchQuery = '', onSearchChange }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & Platform Name */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0 group">
            <div className="relative w-12 h-12 flex-shrink-0">
              <Image
                src="/images/gcc-emblem.png"
                alt="GCC Foundation Emblem"
                width={48}
                height={48}
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5">
                <span className="font-heading font-black text-2xl tracking-tight text-[#3D5E16]">
                  GCC
                </span>
                <span className="font-heading font-extrabold text-xs tracking-[0.25em] text-[#D97706] uppercase">
                  FOUNDATION
                </span>
              </div>
              <span className="text-[10px] text-gray-700 tracking-wide font-medium">
                Vetted East African Crowdfunding & Relief
              </span>
            </div>
          </Link>

          {/* Search Box (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-sm mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search verified medical, water, education causes..."
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-full text-xs text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#3D5E16] focus:border-[#3D5E16] transition-all"
              />
              <Search className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-gray-800">
            <Link
              href="/how-it-works"
              className="flex items-center gap-1.5 hover:text-[#3D5E16] transition-colors py-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#3D5E16]" />
              <span>How Vetting Works</span>
            </Link>

            <Link
              href="/transparency"
              className="flex items-center gap-1.5 hover:text-[#3D5E16] transition-colors py-1"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#3D5E16]" />
              <span>Public Ledger</span>
            </Link>

            <Link
              href="/our-team"
              className="flex items-center gap-1.5 hover:text-[#3D5E16] transition-colors py-1"
            >
              <Users className="w-3.5 h-3.5 text-[#3D5E16]" />
              <span>Team & Board</span>
            </Link>

            <Link
              href="/admin"
              className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 transition-colors py-1 border-l border-gray-200 pl-4"
              title="Compliance Officer & Auditor Portal"
            >
              <Lock className="w-3 h-3 text-gray-400" />
              <span>Auditor Portal</span>
            </Link>
          </nav>

          {/* CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/create-campaign"
              className="inline-flex items-center gap-2 bg-[#3D5E16] hover:bg-[#2F4812] text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm transition-all hover:shadow hover:-translate-y-0.5 active:translate-y-0"
            >
              <PlusCircle className="w-4 h-4 text-[#AFC68A]" />
              <span>Start a Fundraiser</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Search Input */}
        <div className="md:hidden pb-3">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search causes by name, district, or hospital..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-xs text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#3D5E16]"
            />
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-[#E5E7EB] space-y-3 animate-fadeIn">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-[#F9FAFB] rounded"
            >
              Home / Causes
            </Link>
            <Link
              href="/how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-[#F9FAFB] rounded"
            >
              <ShieldCheck className="w-4 h-4 text-[#3D5E16]" />
              How Vetting Works
            </Link>
            <Link
              href="/transparency"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-[#F9FAFB] rounded"
            >
              <FileSpreadsheet className="w-4 h-4 text-[#3D5E16]" />
              Public Ledger & Receipts
            </Link>
            <Link
              href="/our-team"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-[#F9FAFB] rounded"
            >
              <Users className="w-4 h-4 text-[#3D5E16]" />
              Our Team & Board
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-[#F9FAFB] rounded"
            >
              <Lock className="w-4 h-4 text-gray-400" />
              Auditor & Compliance Portal
            </Link>
            <div className="pt-2">
              <Link
                href="/create-campaign"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-[#3D5E16] text-white text-sm font-bold py-2.5 rounded-lg"
              >
                <PlusCircle className="w-4 h-4" />
                Start a Fundraiser
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
