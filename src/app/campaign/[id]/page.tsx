'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import ReportCampaignButton from '@/components/ReportCampaignButton';
import { useDonation } from '@/context/DonationContext';
import { useCurrency } from '@/context/CurrencyContext';
import { copyTextToClipboard } from '@/lib/browser';
import {
  ShieldCheck,
  Building2,
  MapPin,
  Clock,
  Heart,
  Share2,
  CheckCircle2,
  UserCheck,
  Download,
  AlertCircle,
  Calendar,
  HandHeart,
  ArrowLeft,
  Sparkles
} from 'lucide-react';

interface CampaignPageProps {
  params: Promise<{ id: string }>;
}

export default function CampaignDetailPage({ params }: CampaignPageProps) {
  const resolvedParams = use(params);
  const { campaigns, openDonationModal, openPledgeModal } = useDonation();
  const { formatUGX } = useCurrency();

  const campaign = campaigns.find((c) => c.id === resolvedParams.id);

  const [activeTab, setActiveTab] = useState<'story' | 'budget' | 'updates'>('story');
  const [selectedGalleryIdx, setSelectedGalleryIdx] = useState(0);
  const [shareToast, setShareToast] = useState(false);

  if (!campaign) {
    return notFound();
  }

  const percentRaised = Math.min(100, Math.round((campaign.raisedUGX / campaign.goalUGX) * 100));

  const handleShare = async () => {
    if (typeof window === 'undefined') return;
    const shareData = {
      title: campaign.title,
      text: `Support ${campaign.beneficiary.name} on GCC Foundation: ${campaign.subtitle}`,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // If sharing is cancelled or unavailable, offer the copy fallback.
      }
    }
    try {
      await copyTextToClipboard(shareData.url);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 3000);
    } catch {
      setShareToast(false);
    }
  };

  const handleWhatsApp = () => {
    if (typeof window !== 'undefined') {
      const text = encodeURIComponent(`*${campaign.title}*\n${campaign.subtitle}\n\n100% direct hospital/school payout. Donate or share:\n${window.location.href}`);
      window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      <Header />

      {/* Share Toast Notification */}
      {shareToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1A1A1A] text-white text-xs font-bold px-4 py-3 rounded-full shadow-2xl flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-[#02A95C]" />
          <span>Campaign link copied to clipboard!</span>
        </div>
      )}

      {/* Breadcrumb Header */}
      <div className="bg-[#FBF9F6] border-b border-[#E5E7EB] py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-gray-600 hover:text-[#02A95C] font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to all fundraisers</span>
          </Link>
          <span className="font-mono text-gray-500 text-[11px]">ID: {campaign.id}</span>
        </div>
      </div>

      {/* Campaign detail layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* ================= LEFT COLUMN: 65% (8 cols) ================= */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Title */}
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-[34px] text-[#1A1A1A] tracking-[-0.02em] leading-tight">
              {campaign.title}
            </h1>

            <ReportCampaignButton campaignId={campaign.id} campaignTitle={campaign.title} />

            {/* 16:9 Main Image */}
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100 shadow-card">
              <Image
                src={campaign.galleryImages[selectedGalleryIdx]?.url || campaign.coverImage}
                alt={campaign.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 800px"
              />

              <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-xs text-white text-xs px-3.5 py-1.5 rounded-full flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#02A95C]"></span>
                <span className="truncate">{campaign.location.facilityName || campaign.location.district}</span>
              </div>
            </div>

            {/* Gallery Thumbnails if multiple */}
            {campaign.galleryImages.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {campaign.galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedGalleryIdx(idx)}
                    className={`relative w-20 h-14 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                      selectedGalleryIdx === idx
                        ? 'border-[#02A95C] ring-2 ring-[#02A95C]/30'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img.url} alt="Thumbnail" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Organizer and campaign details */}
            <div className="flex items-center justify-between py-4 border-y border-[#E5E7EB] flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-200 flex-shrink-0">
                  <Image
                    src={campaign.organizer.avatarUrl}
                    alt={campaign.organizer.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-sm">
                  <div className="flex items-center gap-1.5 font-bold text-[#1A1A1A]">
                    <span>Organized by {campaign.organizer.name}</span>
                    <span className="text-[#02A95C] inline-flex items-center gap-0.5 text-xs font-semibold bg-[#E6EED8] px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" />
                      ID-Verified
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {campaign.organizer.relationshipToBeneficiary} • {campaign.location.district}, Uganda
                  </div>
                </div>
              </div>

              {/* Direct-to-Institution Payout Badge */}
              <div className="bg-[#FBF9F6] border border-[#E5E7EB] rounded-xl px-3 py-1.5 text-xs text-gray-700 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#02A95C] flex-shrink-0" />
                <div>
                  <span className="font-bold text-[#1A1A1A] block">Direct Institutional Payout</span>
                  <span className="text-[11px] text-gray-500">{campaign.payoutVerification.institutionName}</span>
                </div>
              </div>
            </div>

            {/* Tabs: Story | Expense Breakdown & Receipts | Updates */}
            <div className="border-b border-[#E5E7EB] flex items-center gap-6">
              <button
                type="button"
                onClick={() => setActiveTab('story')}
                className={`pb-3 text-sm font-bold border-b-2 transition-all ${
                  activeTab === 'story'
                    ? 'border-[#02A95C] text-[#02A95C]'
                    : 'border-transparent text-gray-500 hover:text-[#1A1A1A]'
                }`}
              >
                Story
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('budget')}
                className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                  activeTab === 'budget'
                    ? 'border-[#02A95C] text-[#02A95C]'
                    : 'border-transparent text-gray-500 hover:text-[#1A1A1A]'
                }`}
              >
                <span>Expense Breakdown & Receipts</span>
                <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full font-mono">
                  {campaign.itemizedBudget.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('updates')}
                className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                  activeTab === 'updates'
                    ? 'border-[#02A95C] text-[#02A95C]'
                    : 'border-transparent text-gray-500 hover:text-[#1A1A1A]'
                }`}
              >
                <span>Updates</span>
                <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full font-mono">
                  {campaign.fieldUpdates.length}
                </span>
              </button>
            </div>

            {/* TAB CONTENT: Story */}
            {activeTab === 'story' && (
              <div className="space-y-6 pt-2">
                <div className="space-y-4 text-gray-700 text-base leading-relaxed font-body">
                  {campaign.fullStoryHtml.map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}
                </div>

                {/* Beneficiary Registry Card */}
                <div className="bg-[#FBF9F6] border border-[#E5E7EB] rounded-2xl p-5 space-y-2 text-xs">
                  <span className="font-bold text-gray-900 uppercase tracking-wider block">
                    Institutional Record Reference
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-600">
                    <div>
                      Beneficiary: <strong className="text-gray-900">{campaign.beneficiary.name}</strong>
                    </div>
                    <div>
                      Clinical File: <strong className="text-gray-900 font-mono">{campaign.beneficiary.hospitalOrSchoolRef}</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: Expense Breakdown & Receipts */}
            {activeTab === 'budget' && (
              <div className="space-y-6 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-extrabold text-xl text-[#1A1A1A]">
                    Transparent Itemized Ledger
                  </h3>
                  <span className="text-xs bg-[#E6EED8] text-[#2F4812] px-3 py-1 rounded-full font-bold">
                    Direct Payout Verified
                  </span>
                </div>

                <div className="border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-subtle">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FBF9F6] text-gray-600 font-bold border-b border-[#E5E7EB]">
                      <tr>
                        <th className="py-3 px-4">Item</th>
                        <th className="py-3 px-4">Recipient Entity</th>
                        <th className="py-3 px-4 text-right">Cost</th>
                        <th className="py-3 px-4 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-mono">
                      {campaign.itemizedBudget.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="py-3.5 px-4 font-body font-semibold text-gray-900">
                            {item.item}
                            {item.invoiceNumber && (
                              <span className="block font-mono text-[10px] text-gray-500">
                                Ref: {item.invoiceNumber}
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 font-body text-gray-600">{item.recipientEntity}</td>
                          <td className="py-3.5 px-4 text-right font-black text-gray-900 tabular-nums">
                            {formatUGX(item.amountUGX)}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              item.status === 'Verified Paid'
                                ? 'bg-[#E6EED8] text-[#2F4812]'
                                : item.status === 'Disbursed'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB CONTENT: Updates */}
            {activeTab === 'updates' && (
              <div className="space-y-6 pt-2">
                <h3 className="font-heading font-extrabold text-xl text-[#1A1A1A]">
                  Chronological Field Log
                </h3>

                <div className="space-y-6 border-l-2 border-[#E5E7EB] ml-3 pl-6">
                  {campaign.fieldUpdates.map((update) => (
                    <div key={update.id} className="relative space-y-2">
                      <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#02A95C] border-2 border-white"></div>
                      <span className="text-xs font-mono font-bold text-gray-400 block">{update.date}</span>
                      <h4 className="font-heading font-bold text-base text-[#1A1A1A]">{update.title}</h4>
                      <p className="text-sm text-gray-700 leading-relaxed font-body">{update.content}</p>
                      <div className="text-[11px] text-gray-500 pt-1">
                        By {update.authorName} • Verified by {update.verifiedByOfficer}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Words of Support (Exact GoFundMe Donor Wall) */}
            <div className="pt-8 border-t border-[#E5E7EB] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-extrabold text-lg text-[#1A1A1A]">
                  Words of support ({campaign.recentDonors.length})
                </h3>
                <span className="text-xs text-gray-500">Please donate to share a word of support</span>
              </div>

              <div className="space-y-3">
                {campaign.recentDonors.map((donor) => (
                  <div
                    key={donor.id}
                    className="flex items-start gap-3 p-4 rounded-2xl bg-[#FBF9F6] border border-[#E5E7EB]"
                  >
                    <div className="w-9 h-9 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center flex-shrink-0 text-red-500 shadow-subtle">
                      <Heart className="w-4 h-4 fill-red-500" />
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        <strong className="text-sm font-bold text-[#1A1A1A]">
                          {donor.isAnonymous ? 'Anonymous' : donor.name}
                        </strong>
                        <span className="text-gray-400">•</span>
                        <span className="font-mono font-bold text-[#02A95C]">
                          {formatUGX(donor.amountUGX)}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-400">{donor.timestamp}</span>
                      </div>
                      {donor.message && (
                        <p className="text-gray-700 text-sm leading-relaxed">
                          "{donor.message}"
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ================= RIGHT COLUMN: 35% (4 cols - Exact GoFundMe Sticky Card) ================= */}
          <div className="lg:col-span-4 sticky top-24 space-y-6">
            
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-card space-y-5">
              
              {/* Financial Progress Metric */}
              <div className="space-y-2">
                <div className="flex items-baseline gap-1">
                  <span className="font-heading font-black text-3xl text-[#1A1A1A] tabular-nums">
                    {formatUGX(campaign.raisedUGX)}
                  </span>
                  <span className="text-sm text-gray-500 tabular-nums">
                    raised of {formatUGX(campaign.goalUGX)} goal
                  </span>
                </div>

                {/* Thin 6px rounded progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-[#02A95C] h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${percentRaised}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-xs text-gray-500 pt-0.5">
                  <span className="font-semibold text-gray-800">{campaign.donorCount} donations</span>
                  <span className="font-semibold text-amber-700">{campaign.daysRemaining} days left</span>
                </div>
              </div>

              {/* Exact GoFundMe CTA Pill Buttons */}
              <div className="space-y-2.5">
                {/* Full-width Solid Green Pill "Donate now" */}
                <button
                  type="button"
                  onClick={() => openDonationModal(campaign)}
                  className="w-full bg-[#02A95C] hover:bg-[#028F4D] text-white font-extrabold text-base py-3.5 px-6 rounded-full shadow-sm hover:shadow transition-all transform active:scale-98 text-center"
                >
                  Donate now
                </button>

                {/* Full-width Warm Amber/Yellow Pill "Share" */}
                <button
                  type="button"
                  onClick={handleShare}
                  className="w-full bg-[#FBBF24] hover:bg-[#F59E0B] text-gray-900 font-extrabold text-sm py-3 px-6 rounded-full shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4 text-gray-900" />
                  <span>Share fundraiser</span>
                </button>

                {/* WhatsApp Direct Share */}
                <button
                  type="button"
                  onClick={handleWhatsApp}
                  className="w-full bg-[#FBF9F6] hover:bg-gray-100 border border-[#E5E7EB] text-gray-800 font-bold text-xs py-2.5 px-4 rounded-full transition-colors text-center"
                >
                  Share via WhatsApp
                </button>

                {/* Material / Volunteer Pledge */}
                <button
                  type="button"
                  onClick={() => openPledgeModal(campaign)}
                  className="w-full text-xs text-[#02A95C] hover:underline font-bold py-1.5 text-center block"
                >
                  + Pledge medical supplies or volunteer time
                </button>
              </div>

              {/* Live Vertical Donor Feed */}
              <div className="pt-3 border-t border-[#E5E7EB] space-y-3">
                <span className="text-xs font-bold text-gray-900 uppercase tracking-wider block">
                  Recent Donations
                </span>

                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {campaign.recentDonors.slice(0, 4).map((d) => (
                    <div key={d.id} className="flex items-center justify-between text-xs py-1">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center text-red-500 flex-shrink-0">
                          <Heart className="w-3 h-3 fill-red-500" />
                        </div>
                        <span className="font-semibold text-gray-800">
                          {d.isAnonymous ? 'Anonymous' : d.name}
                        </span>
                      </div>
                      <div className="text-right font-mono">
                        <span className="font-bold text-[#1A1A1A] block">{formatUGX(d.amountUGX)}</span>
                        <span className="text-[10px] text-gray-400">{d.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* GoFundMe Guarantee Reassurance */}
              <div className="bg-[#FBF9F6] border border-[#E5E7EB] rounded-xl p-3.5 text-xs text-gray-600 space-y-1">
                <div className="flex items-center gap-1.5 text-[#02A95C] font-bold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <span>The GCC Foundation Giving Guarantee</span>
                </div>
                <p className="text-[11px] leading-tight">
                  Your donation is protected by our 100% refund guarantee and wired directly to hospital accounts.
                </p>
              </div>

            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
