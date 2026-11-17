'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Campaign } from '@/types';
import { useCurrency } from '@/context/CurrencyContext';
import { DONORBOX_URL } from '@/context/DonationContext';
import { MapPin } from 'lucide-react';

interface CampaignCardProps {
  campaign: Campaign;
  isLargeFeatured?: boolean;
}

export default function CampaignCard({ campaign, isLargeFeatured = false }: CampaignCardProps) {
  const { formatUGX } = useCurrency();

  const percentRaised = Math.min(100, Math.round((campaign.raisedUGX / campaign.goalUGX) * 100));

  const formattedDonations =
    campaign.donorCount >= 1000
      ? `${(campaign.donorCount / 1000).toFixed(1)}K donations`
      : `${campaign.donorCount} donations`;

  if (isLargeFeatured) {
    return (
      <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-subtle hover:shadow-elevated transition-all duration-300 flex flex-col justify-between group h-full">
        {/* Large 16:9 / 16:10 Image Container */}
        <div>
          <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden">
            <Link href={`/campaign/${campaign.id}`} className="block w-full h-full">
              <Image
                src={campaign.coverImage}
                alt={campaign.title}
                fill
                className="object-cover group-hover:scale-102 transition-transform duration-300"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </Link>

            {/* Top Badges */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span className="bg-white/95 text-[#1A1A1A] text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                Featured Cause
              </span>
              <span className="bg-[#02A95C] text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                {campaign.category}
              </span>
            </div>

            {/* Donation count */}
            <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#02A95C]"></span>
              <span>{formattedDonations}</span>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-3">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              <span>{campaign.location.facilityName || `${campaign.location.district}, ${campaign.location.country}`}</span>
            </div>

            <h3 className="font-heading font-extrabold text-xl text-[#1A1A1A] group-hover:text-[#02A95C] transition-colors line-clamp-2 leading-snug">
              <Link href={`/campaign/${campaign.id}`}>
                {campaign.title}
              </Link>
            </h3>

            <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
              {campaign.subtitle}
            </p>
          </div>
        </div>

        {/* Financial Progress Block */}
        <div className="p-6 pt-0 space-y-3">
          {/* Thin 6px rounded progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-[#02A95C] h-full rounded-full transition-all duration-300"
              style={{ width: `${percentRaised}%` }}
            />
          </div>

          <div className="flex items-baseline justify-between">
            <span className="font-heading font-extrabold text-lg text-[#1A1A1A] tabular-nums">
              {formatUGX(campaign.raisedUGX)} raised
            </span>
            <span className="text-xs text-gray-500 tabular-nums">
              of {formatUGX(campaign.goalUGX)}
            </span>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex items-center gap-3">
            <a
              href={DONORBOX_URL}
              className="flex-1 bg-[#02A95C] hover:bg-[#028F4D] text-white text-xs font-bold py-3 px-4 rounded-full shadow-sm transition-all text-center"
            >
              Donate Now
            </a>
            <Link
              href={`/campaign/${campaign.id}`}
              className="px-5 py-3 border border-gray-300 hover:border-gray-900 text-gray-800 text-xs font-bold rounded-full transition-colors text-center"
            >
              View Story
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Standard fundraiser card
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-subtle hover:shadow-card transition-all duration-200 flex flex-col justify-between group">
      
      {/* 16:9 Image with 12px radius */}
      <div>
        <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden m-2 rounded-xl">
          <Link href={`/campaign/${campaign.id}`} className="block w-full h-full">
            <Image
              src={campaign.coverImage}
              alt={campaign.title}
              fill
              className="object-cover group-hover:scale-103 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 300px"
            />
          </Link>

          {/* Donation count badge */}
          <div className="absolute bottom-2 left-2 bg-black/75 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#02A95C]"></span>
            <span>{formattedDonations}</span>
          </div>

          {campaign.urgent && (
            <div className="absolute top-2 right-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              Urgent
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="px-4 pt-2 pb-3 space-y-1.5">
          <div className="flex items-center gap-1 text-[11px] text-gray-500 truncate">
            <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
            <span className="truncate">{campaign.location.district}, Uganda</span>
          </div>

          {/* Bold 2-Line Title */}
          <h3 className="font-heading font-bold text-sm text-[#1A1A1A] group-hover:text-[#02A95C] transition-colors line-clamp-2 leading-snug">
            <Link href={`/campaign/${campaign.id}`}>
              {campaign.title}
            </Link>
          </h3>
        </div>
      </div>

      {/* Progress & Single Line Bold Metric */}
      <div className="px-4 pb-4 pt-1 space-y-2.5">
        {/* Thin 6px rounded progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-[#02A95C] h-full rounded-full transition-all duration-300"
            style={{ width: `${percentRaised}%` }}
          />
        </div>

        {/* Bold single-line metric */}
        <div className="flex items-baseline justify-between text-xs font-heading font-extrabold text-[#1A1A1A] tabular-nums">
          <span>{formatUGX(campaign.raisedUGX)} raised</span>
          <span className="text-[11px] text-gray-500 font-normal">of {formatUGX(campaign.goalUGX)}</span>
        </div>

        <div className="pt-1 flex items-center gap-2">
          <a
            href={DONORBOX_URL}
            className="flex-1 bg-[#02A95C] hover:bg-[#028F4D] text-white text-xs font-bold py-2.5 px-3 rounded-full shadow-sm transition-all text-center"
          >
            Donate Now
          </a>
          <Link
            href={`/campaign/${campaign.id}`}
            className="px-3.5 py-2.5 border border-gray-300 hover:border-gray-900 text-gray-800 text-xs font-bold rounded-full transition-colors text-center"
          >
            Details
          </Link>
        </div>
      </div>

    </div>
  );
}
