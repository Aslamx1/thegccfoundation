'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import { useDonation } from '@/context/DonationContext';
import { useCurrency } from '@/context/CurrencyContext';
import {
  ShieldCheck,
  Building2,
  MapPin,
  Clock,
  HeartHandshake,
  Share2,
  FileText,
  CheckCircle2,
  UserCheck,
  Download,
  AlertCircle,
  Calendar,
  Layers,
  HandHeart,
  MessageCircle,
  Lock,
  ArrowLeft
} from 'lucide-react';

interface CampaignPageProps {
  params: Promise<{ id: string }>;
}

export default function CampaignDetailPage({ params }: CampaignPageProps) {
  const resolvedParams = use(params);
  const { campaigns, openDonationModal, openPledgeModal } = useDonation();
  const { formatUGX } = useCurrency();

  const campaign = campaigns.find((c) => c.id === resolvedParams.id);

  const [activeTab, setActiveTab] = useState<'story' | 'budget' | 'updates' | 'pledges'>('story');
  const [selectedGalleryIdx, setSelectedGalleryIdx] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!campaign) {
    return notFound();
  }

  const percentRaised = Math.min(100, Math.round((campaign.raisedUGX / campaign.goalUGX) * 100));

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      if (navigator.share) {
        navigator.share({
          title: campaign.title,
          text: `Support ${campaign.beneficiary.name} on GCC Foundation: ${campaign.subtitle}`,
          url: window.location.href,
        }).catch(() => {});
      } else {
        navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 3000);
      }
    }
  };

  const handleWhatsAppShare = () => {
    if (typeof window !== 'undefined') {
      const text = encodeURIComponent(`*${campaign.title}*\n${campaign.subtitle}\n\n100% direct hospital/school payout. Support or share:\n${window.location.href}`);
      window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#FAF9F6]">
      <Header />

      {/* Breadcrumb & Navigation */}
      <div className="bg-white border-b border-[#E5E7EB] py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-gray-700 hover:text-[#3D5E16] font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Verified Causes</span>
          </Link>
          <div className="flex items-center gap-2 text-gray-600 font-mono text-[11px]">
            <span>Campaign ID:</span>
            <span className="font-bold text-gray-800">{campaign.id}</span>
          </div>
        </div>
      </div>

      {/* Main Campaign Layout (GoFundMe 2-Column Architecture) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* ================= LEFT COLUMN: 65% (8 cols) ================= */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Header Block */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-[#F4F7EE] text-[#2F4812] border border-[#CDDCB3] text-xs font-bold px-3 py-1 rounded-full">
                  {campaign.category}
                </span>
                {campaign.urgent && (
                  <span className="bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                    Urgent Priority Need
                  </span>
                )}
                <span className="text-xs text-gray-600 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-500" />
                  {campaign.location.facilityName || `${campaign.location.district}, Uganda`}
                </span>
              </div>

              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-gray-900 tracking-tight leading-tight">
                {campaign.title}
              </h1>

              <p className="text-gray-800 text-sm sm:text-base leading-relaxed">
                {campaign.subtitle}
              </p>
            </div>

            {/* Documentary Photo Container */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-card">
              <div className="relative aspect-[16/10] bg-gray-100">
                <Image
                  src={campaign.galleryImages[selectedGalleryIdx]?.url || campaign.coverImage}
                  alt={campaign.title}
                  fill
                  className="object-cover"
                  priority
                />
                
                {/* Photo Stamp Overlay */}
                <div className="absolute bottom-3 left-3 right-3 bg-black/80 backdrop-blur-sm text-white px-3.5 py-2 rounded-lg text-xs flex items-center justify-between">
                  <div className="truncate">
                    <span className="font-semibold block truncate">
                      {campaign.galleryImages[selectedGalleryIdx]?.caption || 'Official field documentation'}
                    </span>
                    <span className="text-[10px] text-gray-300">
                      {campaign.galleryImages[selectedGalleryIdx]?.dateStamp} · {campaign.galleryImages[selectedGalleryIdx]?.capturedBy}
                    </span>
                  </div>
                  <span className="bg-[#3D5E16] text-white text-[10px] font-bold px-2 py-0.5 rounded ml-2 flex-shrink-0">
                    Verified
                  </span>
                </div>
              </div>

              {/* Gallery Thumbnails */}
              {campaign.galleryImages.length > 1 && (
                <div className="p-3 bg-[#FAF9F6] border-t border-[#E5E7EB] flex items-center gap-2 overflow-x-auto">
                  {campaign.galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedGalleryIdx(idx)}
                      className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                        selectedGalleryIdx === idx
                          ? 'border-[#3D5E16] ring-2 ring-[#AFC68A]'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <Image src={img.url} alt="Thumbnail" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Organizer & Beneficiary Verification Box (Mandatory Trust Feature) */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 sm:p-6 shadow-subtle space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-[#3D5E16]" />
                  <span className="font-heading font-bold text-sm text-gray-900">
                    Vetted Identity & Legal Representation
                  </span>
                </div>
                <span className="bg-emerald-50 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ID & Bedside Verified
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Organizer Info */}
                <div className="flex items-start gap-3 bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl p-3.5">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-gray-300">
                    <Image
                      src={campaign.organizer.avatarUrl}
                      alt={campaign.organizer.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="text-xs space-y-1">
                    <span className="text-[10px] text-gray-700 uppercase font-bold block">Organizer / Caretaker</span>
                    <strong className="text-gray-900 font-bold block">{campaign.organizer.name}</strong>
                    <span className="text-gray-800 block">{campaign.organizer.role}</span>
                    <span className="text-[11px] font-mono text-[#3D5E16] block">{campaign.organizer.ninOrIdMasked}</span>
                    <span className="text-[11px] text-gray-700 block">{campaign.organizer.relationshipToBeneficiary}</span>
                  </div>
                </div>

                {/* Direct-to-Institution Payout Details */}
                <div className="bg-[#F4F7EE] border border-[#CDDCB3] rounded-xl p-3.5 text-xs space-y-1.5 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-[#2F4812] uppercase font-bold block flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-[#3D5E16]" />
                      Direct Payout Destination
                    </span>
                    <strong className="text-gray-900 font-bold block mt-1">
                      {campaign.payoutVerification.institutionName}
                    </strong>
                    <span className="text-gray-800 text-[11px] block">
                      Bank: {campaign.payoutVerification.bankName}
                    </span>
                    <span className="text-gray-800 text-[11px] font-mono block">
                      Account: {campaign.payoutVerification.accountNumberMasked}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-[#CDDCB3] text-[10px] text-[#2F4812]">
                    Audited by: <strong>{campaign.payoutVerification.complianceOfficer}</strong> (Ref: {campaign.payoutVerification.verificationReference})
                  </div>
                </div>

              </div>
            </div>

            {/* Navigation Tabs (Story, Budget Ledger, Field Updates, Volunteer Pledges) */}
            <div className="border-b border-[#E5E7EB] flex items-center gap-2 sm:gap-6 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab('story')}
                className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                  activeTab === 'story'
                    ? 'border-[#3D5E16] text-[#3D5E16]'
                    : 'border-transparent text-gray-700 hover:text-gray-900'
                }`}
              >
                Full Story & Clinical Case
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('budget')}
                className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'budget'
                    ? 'border-[#3D5E16] text-[#3D5E16]'
                    : 'border-transparent text-gray-700 hover:text-gray-900'
                }`}
              >
                <span>Itemized Budget & Receipts</span>
                <span className="bg-[#E6EED8] text-[#2F4812] text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {campaign.itemizedBudget.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('updates')}
                className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'updates'
                    ? 'border-[#3D5E16] text-[#3D5E16]'
                    : 'border-transparent text-gray-700 hover:text-gray-900'
                }`}
              >
                <span>Field Updates</span>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {campaign.fieldUpdates.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('pledges')}
                className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'pledges'
                    ? 'border-[#3D5E16] text-[#3D5E16]'
                    : 'border-transparent text-gray-700 hover:text-gray-900'
                }`}
              >
                <span>Material Pledges</span>
                <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {campaign.volunteerPledges.length}
                </span>
              </button>
            </div>

            {/* TAB CONTENT 1: Full Narrative */}
            {activeTab === 'story' && (
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-card space-y-6">
                <div className="space-y-4 text-gray-800 leading-relaxed font-body text-sm sm:text-base">
                  {campaign.fullStoryHtml.map((paragraph, idx) => (
                    <p key={idx} className="leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Beneficiary Quick Summary Badge */}
                <div className="bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl p-4 text-xs space-y-2">
                  <span className="font-bold text-gray-900 block uppercase tracking-wider text-[11px]">
                    Clinical & Registry Reference:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-800">
                    <div>
                      Beneficiary: <strong className="text-gray-900">{campaign.beneficiary.name}</strong>
                      {campaign.beneficiary.age && ` (${campaign.beneficiary.age} years old)`}
                    </div>
                    <div>
                      Hospital / School Ref: <strong className="text-gray-900">{campaign.beneficiary.hospitalOrSchoolRef}</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 2: Itemized Budget & Receipt Ledger */}
            {activeTab === 'budget' && (
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-card space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading font-extrabold text-xl text-gray-900">
                      Line-Item Expense Breakdown & Stamped Receipts
                    </h3>
                    <span className="text-xs bg-[#F4F7EE] text-[#2F4812] border border-[#CDDCB3] px-2.5 py-1 rounded font-bold">
                      Public Ledger
                    </span>
                  </div>
                  <p className="text-xs text-gray-800">
                    Every shilling requested corresponds to a verified hospital proforma, equipment invoice, or school bursary tariff.
                  </p>
                </div>

                {/* Responsive Table */}
                <div className="overflow-x-auto border border-[#E5E7EB] rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF9F6] text-gray-700 font-bold border-b border-[#E5E7EB]">
                      <tr>
                        <th className="py-3 px-4">Item & Description</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Recipient Entity</th>
                        <th className="py-3 px-4 text-right">Amount</th>
                        <th className="py-3 px-4 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-mono">
                      {campaign.itemizedBudget.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-3.5 px-4 font-body font-semibold text-gray-900">
                            {item.item}
                            {item.invoiceNumber && (
                              <span className="block font-mono text-[10px] text-gray-600 mt-0.5">
                                Invoice: {item.invoiceNumber}
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 font-body text-gray-800">
                            {item.category}
                          </td>
                          <td className="py-3.5 px-4 font-body text-gray-800">
                            {item.recipientEntity}
                          </td>
                          <td className="py-3.5 px-4 text-right font-black text-gray-900 tabular-nums">
                            {formatUGX(item.amountUGX)}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            {item.status === 'Verified Paid' && (
                              <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                <CheckCircle2 className="w-3 h-3" />
                                Verified Paid
                              </span>
                            )}
                            {item.status === 'Disbursed' && (
                              <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                Disbursed
                              </span>
                            )}
                            {item.status === 'Estimated' && (
                              <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                Awaiting Funds
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-[#F4F7EE] border border-[#CDDCB3] rounded-xl p-4 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#3D5E16]" />
                    <span className="text-[#2F4812] font-semibold">
                      Stamped bank payment slips and official hospital receipts are archived with KPMG East Africa quarterly audits.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 3: Field Updates */}
            {activeTab === 'updates' && (
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-card space-y-6">
                <h3 className="font-heading font-extrabold text-xl text-gray-900">
                  Chronological Field Log & Clinical Updates
                </h3>

                <div className="space-y-6 relative border-l-2 border-[#CDDCB3] ml-3 pl-6">
                  {campaign.fieldUpdates.map((update) => (
                    <div key={update.id} className="relative space-y-2">
                      {/* Timeline dot */}
                      <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#3D5E16] border-2 border-white"></div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-600 font-mono flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {update.date}
                        </span>
                        {update.disbursedAmountUGX && (
                          <span className="bg-[#E6EED8] text-[#2F4812] text-xs font-bold px-2.5 py-0.5 rounded">
                            Disbursed: {formatUGX(update.disbursedAmountUGX)}
                          </span>
                        )}
                      </div>

                      <h4 className="font-heading font-bold text-base text-gray-900">
                        {update.title}
                      </h4>

                      <p className="text-xs sm:text-sm text-gray-800 leading-relaxed font-body">
                        {update.content}
                      </p>

                      <div className="text-[11px] text-gray-700 pt-1">
                        Posted by <strong>{update.authorName}</strong> ({update.authorRole}) · Verified by: {update.verifiedByOfficer}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT 4: Volunteer & Material Pledges */}
            {activeTab === 'pledges' && (
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-card space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-heading font-extrabold text-xl text-gray-900">
                      Community Volunteer & Material Pledges
                    </h3>
                    <p className="text-xs text-gray-800">
                      Supporters providing physical supplies, blood donations, professional services, or manual labor.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openPledgeModal(campaign)}
                    className="bg-[#3D5E16] text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow hover:bg-[#2F4812] transition-colors whitespace-nowrap"
                  >
                    + Pledge Goods or Time
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {campaign.volunteerPledges.map((vp) => (
                    <div key={vp.id} className="bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-[#3D5E16] bg-[#F4F7EE] px-2 py-0.5 rounded border border-[#CDDCB3]">
                          {vp.pledgeType}
                        </span>
                        <span className="text-[10px] text-gray-600 font-mono">{vp.datePledged}</span>
                      </div>
                      <strong className="text-xs font-bold text-gray-900 block">{vp.supporterName}</strong>
                      <p className="text-xs text-gray-800">{vp.description}</p>
                      <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        Status: {vp.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* ================= RIGHT COLUMN: 35% (4 cols - Sticky Conversion Card) ================= */}
          <div className="lg:col-span-4 sticky top-28 space-y-6">
            
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-elevated space-y-6">
              
              {/* Financial Progress Numbers */}
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="font-heading font-black text-2xl sm:text-3xl text-[#3D5E16] tabular-nums block">
                      {formatUGX(campaign.raisedUGX)}
                    </span>
                    <span className="text-xs text-gray-800 tabular-nums">
                      raised of <strong className="text-gray-900 font-semibold">{formatUGX(campaign.goalUGX)}</strong> goal
                    </span>
                  </div>
                  <span className="font-black text-lg text-gray-900 tabular-nums">
                    {percentRaised}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-[#3D5E16] h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${percentRaised}%` }}
                  />
                </div>

                {/* Quick Stats Row */}
                <div className="flex justify-between items-center text-xs text-gray-800 pt-1 font-medium">
                  <span className="tabular-nums font-bold text-gray-900">{campaign.donorCount} supporters</span>
                  <span className="flex items-center gap-1 text-amber-700 font-bold">
                    <Clock className="w-3.5 h-3.5" />
                    {campaign.daysRemaining} days left
                  </span>
                </div>
              </div>

              {/* Primary Call-to-Actions */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => openDonationModal(campaign)}
                  className="w-full bg-[#3D5E16] hover:bg-[#2F4812] text-white font-extrabold text-base py-4 px-6 rounded-xl shadow-md transition-all hover:shadow-lg transform active:scale-99 flex items-center justify-center gap-2 text-center"
                >
                  <HeartHandshake className="w-5 h-5 text-[#AFC68A]" />
                  <span>Donate to This Cause</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleWhatsAppShare}
                    className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs py-2.5 px-3 rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleShare}
                    className="w-full bg-white hover:bg-gray-50 border border-[#E5E7EB] text-gray-800 font-bold text-xs py-2.5 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Share2 className="w-3.5 h-3.5 text-gray-600" />
                    <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
                  </button>
                </div>

                {/* Secondary: Pledge Materials Button */}
                <button
                  type="button"
                  onClick={() => openPledgeModal(campaign)}
                  className="w-full bg-[#FAF9F6] hover:bg-[#F4F7EE] text-[#3D5E16] border border-[#CDDCB3] text-xs font-bold py-2.5 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <HandHeart className="w-3.5 h-3.5 text-[#3D5E16]" />
                  <span>Pledge Goods, Blood or Volunteer Hours</span>
                </button>
              </div>

              {/* Anti-Fraud Trust Seal */}
              <div className="bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl p-3.5 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 text-[#3D5E16] font-bold text-[11px]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>100% Guaranteed Institution Disbursement</span>
                </div>
                <p className="text-[11px] text-gray-700 leading-tight">
                  Donations cannot be diverted to personal accounts. If the hospital bill is overfunded, surplus shillings are held in escrow for other audited pediatric patients.
                </p>
              </div>

              {/* Live Donors Activity Feed */}
              <div className="space-y-3 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-bold text-xs text-gray-900 uppercase tracking-wider">
                    Recent Supporters ({campaign.recentDonors.length})
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>

                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {campaign.recentDonors.map((donor) => (
                    <div key={donor.id} className="bg-[#FAF9F6] border border-[#E5E7EB] rounded-lg p-3 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <strong className="font-bold text-gray-900">
                          {donor.isAnonymous ? 'Anonymous' : donor.name}
                        </strong>
                        <span className="font-mono font-bold text-[#3D5E16]">
                          {formatUGX(donor.amountUGX)}
                        </span>
                      </div>
                      {donor.message && (
                        <p className="text-gray-800 italic text-[11px]">
                          "{donor.message}"
                        </p>
                      )}
                      <div className="flex items-center justify-between text-[10px] text-gray-600 pt-0.5">
                        <span>{donor.timestamp}</span>
                        <span className="font-mono">{donor.paymentMethod}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
