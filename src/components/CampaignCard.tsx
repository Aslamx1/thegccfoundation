'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Campaign } from '@/types';
import { useCurrency } from '@/context/CurrencyContext';
import { useDonation } from '@/context/DonationContext';
import { MapPin, Building2, ShieldCheck, HeartHandshake, CheckCircle2 } from 'lucide-react';

interface CampaignCardProps {
  campaign: Campaign;
}

export default function CampaignCard({ campaign }: CampaignCardProps) {
  const { formatUGX } = useCurrency();
  const { openDonationModal } = useDonation();

  const percentRaised = Math.min(100, Math.round((campaign.raisedUGX / campaign.goalUGX) * 100));

  const getInstitutionBadgeText = () => {
    switch (campaign.payoutVerification.type) {
      case 'Direct-to-Hospital':
        return 'Direct Hospital Payout';
      case 'Direct-to-School':
        return 'Direct School Bursar';
      case 'Direct-to-Contractor':
        return 'Direct Contractor Escrow';
      default:
        return 'Vetted Trustee Payout';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden shadow-subtle hover:shadow-elevated transition-all duration-200 flex flex-col group">
      
      {/* Authentic Image Container */}
      <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden">
        <Link href={`/campaign/${campaign.id}`} className="block w-full h-full">
          <Image
            src={campaign.coverImage}
            alt={campaign.title}
            fill
            className="object-cover group-hover:scale-102 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          <span className="bg-white/95 text-gray-900 backdrop-blur-sm text-[11px] font-bold px-2.5 py-1 rounded shadow-sm border border-gray-200">
            {campaign.category}
          </span>
          {campaign.urgent && (
            <span className="bg-amber-600 text-white text-[11px] font-bold px-2.5 py-1 rounded shadow-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              Urgent Need
            </span>
          )}
        </div>

        {/* Bottom Location & Verified Stamp */}
        <div className="absolute bottom-2 left-2 right-2 bg-black/75 backdrop-blur-sm text-white px-2.5 py-1 rounded text-[11px] flex items-center justify-between">
          <span className="flex items-center gap-1 truncate text-gray-200">
            <MapPin className="w-3 h-3 text-[#AFC68A] flex-shrink-0" />
            <span className="truncate">{campaign.location.district}, {campaign.location.country}</span>
          </span>
          <span className="flex items-center gap-1 text-[#8AA95E] text-[10px] font-mono flex-shrink-0 ml-1">
            <ShieldCheck className="w-3 h-3" />
            KYC Verified
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div className="space-y-2.5">
          {/* Direct-to-Institution Verification Badge */}
          <div className="inline-flex items-center gap-1.5 bg-[#F4F7EE] text-[#2F4812] border border-[#CDDCB3] text-[11px] font-semibold px-2 py-0.5 rounded">
            <Building2 className="w-3 h-3 text-[#3D5E16]" />
            <span>{getInstitutionBadgeText()}</span>
          </div>

          {/* Title */}
          <h3 className="font-heading font-bold text-base text-gray-900 group-hover:text-[#3D5E16] transition-colors line-clamp-2 leading-snug">
            <Link href={`/campaign/${campaign.id}`}>
              {campaign.title}
            </Link>
          </h3>

          {/* 2-line story preview */}
          <p className="text-gray-800 text-xs line-clamp-2 leading-relaxed">
            {campaign.subtitle}
          </p>
        </div>

        {/* Financial Progress & Tabular Stats */}
        <div className="pt-2 border-t border-gray-100 space-y-2">
          {/* Progress Bar */}
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-[#3D5E16] h-full rounded-full transition-all duration-300"
              style={{ width: `${percentRaised}%` }}
            />
          </div>

          {/* Tabular Financial Ledger Stats */}
          <div className="space-y-1">
            <div className="flex items-baseline justify-between">
              <span className="font-heading font-black text-sm text-[#3D5E16] tabular-nums">
                {formatUGX(campaign.raisedUGX)}
              </span>
              <span className="text-[11px] text-gray-700 tabular-nums">
                of <strong className="text-gray-800 font-semibold">{formatUGX(campaign.goalUGX)}</strong>
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-gray-700 font-medium">
              <span className="tabular-nums text-gray-900 font-semibold">{percentRaised}% reached</span>
              <span className="tabular-nums text-gray-800">{campaign.donorCount} donors</span>
              <span className="text-gray-700">{campaign.daysRemaining} days left</span>
            </div>
          </div>

          {/* Card Action Buttons */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => openDonationModal(campaign)}
              className="flex-1 bg-[#3D5E16] hover:bg-[#2F4812] text-white text-xs font-bold py-2.5 px-3 rounded-lg shadow-sm transition-all text-center flex items-center justify-center gap-1.5"
            >
              <HeartHandshake className="w-3.5 h-3.5 text-[#AFC68A]" />
              <span>Donate</span>
            </button>
            <Link
              href={`/campaign/${campaign.id}`}
              className="px-3 py-2.5 bg-[#F9FAFB] hover:bg-gray-100 border border-[#E5E7EB] text-gray-800 text-xs font-semibold rounded-lg transition-colors text-center"
            >
              Ledger
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
