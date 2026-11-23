'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HeartHandshake, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export default function Hero() {
  const photoTiles = [
    {
      category: 'Medical',
      label: 'Pediatric Cardiac Surgery',
      image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
      rotation: '-rotate-2',
      colPos: 'lg:top-4 lg:left-4',
    },
    {
      category: 'Education',
      label: 'Secondary Tuition Relief',
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80',
      rotation: 'rotate-3',
      colPos: 'lg:top-2 lg:right-6',
    },
    {
      category: 'Clean Water',
      label: 'Deep Solar Borehole',
      image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?auto=format&fit=crop&w=600&q=80',
      rotation: 'rotate-1',
      colPos: 'lg:top-1/2 lg:-left-6 lg:-translate-y-1/2',
    },
    {
      category: 'Community',
      label: 'Women’s Drip Irrigation',
      image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80',
      rotation: '-rotate-2',
      colPos: 'lg:top-1/2 lg:-right-6 lg:-translate-y-1/2',
    },
    {
      category: 'Emergency',
      label: 'Bududa Mudslide Relief',
      image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=600&q=80',
      rotation: '-rotate-1',
      colPos: 'lg:bottom-4 lg:left-12',
    },
    {
      category: 'Nonprofit',
      label: 'Neonatal ICU Incubators',
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80',
      rotation: 'rotate-2',
      colPos: 'lg:bottom-4 lg:right-12',
    },
  ];

  return (
    <section className="relative pt-10 pb-16 sm:pt-14 sm:pb-20 overflow-hidden border-b border-[#E5E7EB] bg-gray-900">
      {/* Background Image with enhanced lighting and gentle overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg.jpg"
          alt="The GCC Foundation community"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center brightness-110 contrast-[1.05]"
        />
        {/* Lighter overlay so the people in the photo are clearly illuminated and visible */}
        <div className="absolute inset-0 bg-black/25" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Central Hero Block */}
        <div className="relative min-h-0 sm:min-h-[480px] lg:min-h-[580px] flex flex-col items-center justify-center text-center py-5 sm:py-8">
          
          {/* Arc Photo Tiles (Desktop Positioned in Circle/Arc around center content) */}
          <div className="hidden lg:block absolute inset-0 pointer-events-none select-none">
            {photoTiles.map((tile, idx) => (
              <div
                key={idx}
                className={`absolute ${tile.colPos} ${tile.rotation} w-44 xl:w-52 bg-white p-2 rounded-2xl shadow-card border border-[#E5E7EB] transform transition-transform duration-300 hover:scale-105 pointer-events-auto`}
              >
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
                  <Image
                    src={tile.image}
                    alt={tile.label}
                    fill
                    className="object-cover"
                    sizes="220px"
                  />
                  <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {tile.category}
                  </div>
                </div>
                <div className="pt-2 px-1 text-left">
                  <span className="text-xs font-bold text-[#1A1A1A] truncate block">
                    {tile.label}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Centered campaign introduction */}
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            
            {/* Bold Headline */}
            <h1 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-[54px] text-white tracking-[-0.025em] leading-[1.1] drop-shadow-[0_3px_10px_rgba(0,0,0,0.9)]">
              The GCC Foundation
            </h1>

            <p className="text-white text-base sm:text-lg max-w-lg mx-auto font-body leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] font-medium">
              Empowering vulnerable children and Youths in our community through Education and talents
            </p>

            {/* Primary calls to action */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/create/fundraiser/category"
                className="inline-flex items-center justify-center bg-[#02A95C] hover:bg-[#028F4D] text-white text-base font-bold py-3.5 px-8 rounded-full shadow-lg hover:shadow-xl transition-all transform active:scale-98"
              >
                Start a GCC Fundraiser
              </Link>

              <Link
                href="/how-it-works"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-white hover:text-[#02A95C] py-2 px-4 rounded-full transition-colors drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]"
              >
                <span>How Vetting Works</span>
                <ArrowRight className="w-4 h-4 text-white drop-shadow" />
              </Link>
            </div>

            {/* Trust Assurance Sub-line */}
            <div className="flex items-center justify-center gap-2 text-xs text-white font-medium pt-2 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
              <ShieldCheck className="w-4 h-4 text-[#02A95C] drop-shadow" />
              <span>Direct-to-Institution Payouts • 0% Platform Fee to Charities</span>
            </div>

          </div>

          {/* Mobile/Tablet Photo Carousel Strip */}
          <div className="lg:hidden w-full mt-8 pt-4 overflow-x-auto scrollbar-none flex items-center gap-3 px-2">
            {photoTiles.map((tile, idx) => (
              <div
                key={idx}
                className="w-[min(72vw,10rem)] flex-shrink-0 bg-white p-2 rounded-2xl shadow-subtle border border-[#E5E7EB]"
              >
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
                  <Image src={tile.image} alt={tile.label} fill className="object-cover" />
                  <div className="absolute top-1.5 left-1.5 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    {tile.category}
                  </div>
                </div>
                <span className="text-[11px] font-bold text-[#1A1A1A] block pt-1.5 truncate">
                  {tile.label}
                </span>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}

