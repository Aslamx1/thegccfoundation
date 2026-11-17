'use client';

import React, { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import DonorboxWidget from '@/components/DonorboxWidget';
import { useDonation, DONORBOX_URL } from '@/context/DonationContext';
import { ArrowLeft, Heart } from 'lucide-react';

interface CampaignDonatePageProps {
  params: Promise<{ id: string }>;
}

export default function CampaignDonatePage({ params }: CampaignDonatePageProps) {
  const resolvedParams = use(params);
  const { campaigns } = useDonation();
  const campaign = campaigns.find((c) => c.id === resolvedParams.id);

  return (
    <div className="flex-1 flex flex-col bg-[#FBF9F6] font-sans text-gray-900">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto px-4 py-8 sm:py-12 w-full space-y-8">
        <Link
          href={campaign ? `/campaign/${campaign.id}` : '/'}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to fundraiser
        </Link>

        {campaign && (
          <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
            <div className="relative h-16 w-24 rounded-2xl overflow-hidden shrink-0 bg-gray-100">
              <Image
                src={campaign.coverImage}
                alt={campaign.title}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                You are supporting:
              </p>
              <h2 className="font-heading font-extrabold text-lg text-gray-900 line-clamp-1">
                {campaign.title}
              </h2>
            </div>
          </div>
        )}

        <DonorboxWidget
          campaign="gcc-foundation"
          type="donation_form"
          enableAutoScroll={true}
          className="rounded-3xl shadow-card"
        />

        <div className="text-center">
          <a
            href={DONORBOX_URL}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#02A95C] hover:bg-[#028F4D] text-white font-extrabold text-base py-3.5 px-8 shadow-sm transition-all"
          >
            <Heart className="h-4 w-4 fill-current" />
            Donate Now
          </a>
        </div>
      </main>
    </div>
  );
}
