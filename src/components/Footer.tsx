'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCurrency } from '@/context/CurrencyContext';
import { CurrencyCode } from '@/types';
import {
  ShieldCheck,
  Building2,
  MapPin,
  PhoneCall,
  Mail,
  Lock,
  FileCheck2,
  Globe
} from 'lucide-react';

export default function Footer() {
  const { currency, setCurrency } = useCurrency();
  const currencies: CurrencyCode[] = ['USD', 'UGX', 'KES'];

  return (
    <footer className="bg-white text-gray-700 border-t border-[#E5E7EB] text-xs">
      
      {/* Top Footer Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Col 1 & 2: Brand & Physical Office */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative w-8 h-8 flex-shrink-0">
                <Image
                  src="/images/gcc-emblem.png"
                  alt="GCC Emblem"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-heading font-black text-xl text-[#3D5E16]">
                  GCC
                </span>
                <span className="font-heading font-extrabold text-xs tracking-widest text-[#D97706] uppercase">
                  FOUNDATION
                </span>
              </div>
            </Link>

            <p className="text-gray-500 text-xs leading-relaxed max-w-sm">
              GCC Foundation is an independent, regulated crowdfunding platform for East Africa. 100% of medical and educational disbursements go directly to verified hospital and school bursar bank accounts.
            </p>

            {/* Real Physical Office & Registration */}
            <div className="bg-[#FBF9F6] border border-[#E5E7EB] rounded-2xl p-4 space-y-2 text-[11px] text-gray-600">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#02A95C] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-gray-900 block">Physical Headquarters:</strong>
                  Plot 14, Lumumba Avenue, Nakasero Hill, Kampala, Uganda<br />
                  P.O. Box 7421, Kampala Central Division
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1 border-t border-gray-200">
                <FileCheck2 className="w-4 h-4 text-[#02A95C] flex-shrink-0" />
                <span>NGO Bureau Reg: <strong className="text-gray-900 font-mono">INDR15982736NB</strong></span>
                <span>•</span>
                <span>TIN: <strong className="text-gray-900 font-mono">1018942019</strong></span>
              </div>
            </div>
          </div>

          {/* Col 3: Causes */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-gray-900 uppercase tracking-wider block">
              Fundraise for
            </span>
            <ul className="space-y-2.5 text-xs text-gray-600">
              <li>
                <Link href="/?category=Medical+Care" className="hover:text-[#02A95C] transition-colors">
                  Medical & Hospital Bills
                </Link>
              </li>
              <li>
                <Link href="/?category=Education+%26+Tuition" className="hover:text-[#02A95C] transition-colors">
                  Education & Tuition
                </Link>
              </li>
              <li>
                <Link href="/?category=Emergency+Relief" className="hover:text-[#02A95C] transition-colors">
                  Emergency Relief
                </Link>
              </li>
              <li>
                <Link href="/?category=Clean+Water+Wells" className="hover:text-[#02A95C] transition-colors">
                  Clean Water Boreholes
                </Link>
              </li>
              <li>
                <Link href="/create-campaign" className="text-[#02A95C] font-bold hover:underline">
                  Start a Fundraiser (0% Fee)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Learn More */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-gray-900 uppercase tracking-wider block">
              Learn more
            </span>
            <ul className="space-y-2.5 text-xs text-gray-600">
              <li>
                <Link href="/how-it-works" className="hover:text-[#02A95C] transition-colors">
                  How Vetting Works
                </Link>
              </li>
              <li>
                <Link href="/transparency" className="hover:text-[#02A95C] transition-colors">
                  Public Financial Ledger
                </Link>
              </li>
              <li>
                <Link href="/our-team" className="hover:text-[#02A95C] transition-colors">
                  Our Team & Board
                </Link>
              </li>
              <li>
                <Link href="/how-it-works#guarantee" className="hover:text-[#02A95C] transition-colors">
                  The Giving Guarantee
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[#02A95C] transition-colors">
                  Auditor Console
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Support & Currency Switcher */}
          <div className="space-y-4">
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-900 uppercase tracking-wider block">
                Helpline & Desk
              </span>
              <a
                href="tel:+256772491802"
                className="flex items-center gap-1.5 text-gray-900 font-bold hover:text-[#02A95C] transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#02A95C]" />
                <span>+256 (0) 772 491 802</span>
              </a>
              <a
                href="https://wa.me/256772491802"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-emerald-600 hover:underline font-semibold block"
              >
                WhatsApp Support Desk (24/7)
              </a>
              <span className="text-gray-500 text-[11px] block">
                Nakasero Support Hours: 8am - 5pm EAT
              </span>
            </div>

            {/* Currency Switcher in Footer (Exact Requirement) */}
            <div className="pt-2 border-t border-gray-100 space-y-1.5">
              <span className="text-[11px] font-bold text-gray-700 flex items-center gap-1">
                <Globe className="w-3 h-3 text-gray-500" />
                Select Currency:
              </span>
              <div className="flex items-center gap-1 bg-[#FBF9F6] border border-[#E5E7EB] rounded-full p-0.5 w-max">
                {currencies.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCurrency(c)}
                    className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
                      currency === c
                        ? 'bg-[#1A1A1A] text-white shadow-xs'
                        : 'text-gray-600 hover:text-black'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Payment Rails & Security Badges Bar */}
        <div className="mt-12 pt-6 border-t border-[#E5E7EB] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap text-[11px] text-gray-500 font-semibold">
            <span>Payment Rails:</span>
            <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded font-bold">MTN Mobile Money</span>
            <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded font-bold">Airtel Money</span>
            <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded font-bold">M-Pesa</span>
            <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded font-bold">Visa / Mastercard</span>
            <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded font-bold">PayPal</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-gray-500">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-[#02A95C]" />
              256-Bit SSL Encrypted
            </span>
            <span>•</span>
            <span>PCI-DSS Level 1</span>
            <span>•</span>
            <span>Audited by KPMG East Africa</span>
          </div>
        </div>

        {/* Legal & Copyright */}
        <div className="mt-8 pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-gray-400">
          <p>© {new Date().getFullYear()} GCC Foundation. All rights reserved. A registered charitable non-governmental organisation.</p>
          <div className="flex items-center gap-4">
            <Link href="/how-it-works" className="hover:text-gray-700">Terms of Service</Link>
            <Link href="/how-it-works#guarantee" className="hover:text-gray-700">Giving Guarantee</Link>
            <Link href="/transparency" className="hover:text-gray-700">Audits</Link>
          </div>
        </div>

      </div>

    </footer>
  );
}
