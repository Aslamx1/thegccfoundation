'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  Building2,
  MapPin,
  PhoneCall,
  Mail,
  Lock,
  FileCheck2,
  ExternalLink,
  HeartHandshake
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#121E07] text-[#E6EED8] border-t border-[#2F4812] text-xs">
      
      {/* Upper Institutional Banner: Anti-Fraud Guarantee */}
      <div className="border-b border-[#1F310C] bg-[#18280A] py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#2F4812] border border-[#3D5E16] flex items-center justify-center flex-shrink-0 text-[#AFC68A]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="font-heading font-black text-sm text-white block">
                GCC Anti-Fraud Guarantee & Direct-to-Institution Payout Policy
              </span>
              <span className="text-gray-300 text-xs">
                In the rare event of verified beneficiary misrepresentation, 100% of donor funds are refunded or redirected to vetted hospital ledgers.
              </span>
            </div>
          </div>

          <Link
            href="/how-it-works#guarantee"
            className="inline-flex items-center gap-1.5 bg-[#2F4812] hover:bg-[#3D5E16] text-white px-4 py-2 rounded-lg font-bold text-xs border border-[#4D6B24] transition-colors whitespace-nowrap"
          >
            <span>Read Anti-Fraud Charter</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#AFC68A]" />
          </Link>
        </div>
      </div>

      {/* Main Footer Links & Information */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Column 1 & 2: Organization Info & Physical Address */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 flex-shrink-0">
                <Image
                  src="/images/gcc-emblem.png"
                  alt="GCC Emblem"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <div>
                <span className="font-heading font-black text-xl text-white tracking-tight block">
                  GCC FOUNDATION
                </span>
                <span className="text-[10px] text-[#AFC68A] uppercase tracking-widest font-bold">
                  Humanitarian Trust · East Africa
                </span>
              </div>
            </div>

            <p className="text-gray-300 text-xs leading-relaxed">
              GCC Foundation is an independent, non-profit humanitarian crowdfunding and financial relief platform. We pioneer direct institutional disbursements, hospital bill escrowing, and line-item receipt verification across Uganda and the wider East African Community.
            </p>

            {/* Real Physical Office & Registration */}
            <div className="bg-[#18280A] border border-[#2F4812] rounded-xl p-3.5 space-y-2 text-gray-300 text-[11px]">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#8AA95E] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Physical Headquarters:</strong>
                  Plot 14, Lumumba Avenue, Nakasero Hill, Kampala, Uganda<br />
                  P.O. Box 7421, Kampala Central Division
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1 border-t border-[#2F4812]">
                <FileCheck2 className="w-4 h-4 text-[#8AA95E] flex-shrink-0" />
                <span>NGO Bureau Reg: <strong className="text-white font-mono">INDR15982736NB</strong></span>
                <span className="text-[#4D6B24]">·</span>
                <span>TIN: <strong className="text-white font-mono">1018942019</strong></span>
              </div>
            </div>
          </div>

          {/* Column 3: Verified Causes */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider block border-b border-[#2F4812] pb-1">
              Verified Causes
            </span>
            <ul className="space-y-2 text-xs text-gray-300">
              <li>
                <Link href="/?category=Medical+Care" className="hover:text-white transition-colors">
                  Mulago & Regional Hospital Care
                </Link>
              </li>
              <li>
                <Link href="/?category=Education+%26+Tuition" className="hover:text-white transition-colors">
                  Secondary & University Bursars
                </Link>
              </li>
              <li>
                <Link href="/?category=Clean+Water+Wells" className="hover:text-white transition-colors">
                  Solar Deep Water Boreholes
                </Link>
              </li>
              <li>
                <Link href="/?category=Emergency+Relief" className="hover:text-white transition-colors">
                  Disaster & Mudslide Relief
                </Link>
              </li>
              <li>
                <Link href="/?category=Rural+Agriculture" className="hover:text-white transition-colors">
                  Women’s Agribusiness & Drip Lines
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Institutional Governance */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider block border-b border-[#2F4812] pb-1">
              Governance & Trust
            </span>
            <ul className="space-y-2 text-xs text-gray-300">
              <li>
                <Link href="/how-it-works" className="hover:text-white transition-colors">
                  4-Tier Field Vetting Protocol
                </Link>
              </li>
              <li>
                <Link href="/transparency" className="hover:text-white transition-colors">
                  Live Public Disbursement Ledger
                </Link>
              </li>
              <li>
                <Link href="/our-team" className="hover:text-white transition-colors">
                  Board of Trustees & Medical Leads
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors">
                  Compliance Auditor Console
                </Link>
              </li>
              <li>
                <Link href="/how-it-works#whistleblower" className="hover:text-amber-400 transition-colors">
                  Whistleblower & Fraud Hotdesk
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Support & Contact */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider block border-b border-[#2F4812] pb-1">
              Support & Helpline
            </span>
            <div className="space-y-2.5 text-xs text-gray-300">
              <a
                href="tel:+256772491802"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#AFC68A]" />
                <span>+256 (0) 772 491 802</span>
              </a>

              <a
                href="https://wa.me/256772491802"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>WhatsApp Desk (24/7)</span>
              </a>

              <a
                href="mailto:support@gccfoundation.org"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#AFC68A]" />
                <span>support@gccfoundation.org</span>
              </a>

              <div className="pt-2">
                <Link
                  href="/create-campaign"
                  className="w-full inline-block bg-[#3D5E16] hover:bg-[#2F4812] text-white text-center font-bold py-2 rounded-lg transition-colors border border-[#4D6B24]"
                >
                  Apply for Cause Vetting
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* Payment Partner & Security Badges */}
        <div className="mt-12 pt-8 border-t border-[#1F310C]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Badges */}
            <div className="flex items-center gap-3 flex-wrap justify-center text-[10px] text-gray-300">
              <span className="font-bold uppercase tracking-wider text-white">Payment Rails:</span>
              <span className="bg-[#18280A] border border-[#2F4812] px-2.5 py-1 rounded text-amber-400 font-bold">
                MTN MoMo
              </span>
              <span className="bg-[#18280A] border border-[#2F4812] px-2.5 py-1 rounded text-red-400 font-bold">
                Airtel Money
              </span>
              <span className="bg-[#18280A] border border-[#2F4812] px-2.5 py-1 rounded text-emerald-400 font-bold">
                Safaricom M-Pesa
              </span>
              <span className="bg-[#18280A] border border-[#2F4812] px-2.5 py-1 rounded text-blue-400 font-bold">
                Visa / Mastercard
              </span>
              <span className="bg-[#18280A] border border-[#2F4812] px-2.5 py-1 rounded text-sky-400 font-bold">
                PayPal
              </span>
            </div>

            {/* Security Seals */}
            <div className="flex items-center gap-4 text-[10px] text-gray-300">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-[#AFC68A]" />
                256-Bit SSL Encrypted
              </span>
              <span>·</span>
              <span>PCI-DSS Level 1</span>
              <span>·</span>
              <span>Audited by KPMG East Africa</span>
            </div>

          </div>
        </div>

        {/* Bottom Legal Copyright */}
        <div className="mt-8 pt-4 border-t border-[#18280A] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-gray-400">
          <p>© {new Date().getFullYear()} GCC Foundation Uganda. All rights reserved. A registered charitable non-governmental organisation.</p>
          <div className="flex items-center gap-4">
            <Link href="/how-it-works" className="hover:text-white">Anti-Scam Charter</Link>
            <Link href="/transparency" className="hover:text-white">Public Ledger</Link>
            <Link href="/our-team" className="hover:text-white">Team & Board</Link>
          </div>
        </div>

      </div>

    </footer>
  );
}
