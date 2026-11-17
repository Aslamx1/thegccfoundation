'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { useDonation, DONORBOX_URL } from '@/context/DonationContext';
import DonorboxWidget from '@/components/DonorboxWidget';
import { X, ShieldCheck, ExternalLink } from 'lucide-react';

export default function CheckoutModal() {
  const { activeCampaignForDonation, isDonationModalOpen, closeDonationModal } = useDonation();

  useEffect(() => {
    if (!isDonationModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDonationModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDonationModalOpen, closeDonationModal]);

  if (!isDonationModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) closeDonationModal();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Donate to GCC Foundation"
        className="bg-white rounded-3xl max-w-lg w-full border border-[#E5E7EB] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="px-5 py-4 bg-[#FBF9F6] border-b border-[#E5E7EB] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {activeCampaignForDonation?.coverImage && (
              <div className="relative w-12 h-10 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                <Image
                  src={activeCampaignForDonation.coverImage}
                  alt={activeCampaignForDonation.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-[#02A95C] uppercase tracking-wider block">
                You are supporting
              </span>
              <h3 className="font-heading font-extrabold text-sm text-[#1A1A1A] truncate">
                {activeCampaignForDonation?.title || 'GCC Foundation Verified Cause'}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={closeDonationModal}
            aria-label="Close donation modal"
            className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Donorbox Widget */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          <DonorboxWidget
            campaign="gcc-foundation"
            type="donation_form"
            enableAutoScroll={true}
            className="border-0 p-0 shadow-none"
          />

          <div className="pt-2 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#02A95C] shrink-0" />
              <span>100% Direct Institutional Payout Guarantee</span>
            </div>
            <a
              href={DONORBOX_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-bold text-[#02A95C] hover:underline shrink-0"
            >
              <span>Open in Donorbox</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
