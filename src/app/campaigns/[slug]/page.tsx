"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProgressBar from "@/components/ProgressBar";
import ReportCampaignButton from "@/components/ReportCampaignButton";
import { formatMinorUnits, calculateProgress, formatRelativeDate } from "@/lib/formatters";
import {
  ShieldCheck,
  Heart,
  Share2,
  Clock,
  Users,
  CheckCircle2,
  ArrowRight,
  Copy,
  Check,
  MessageCircle,
  HelpCircle,
  BadgeCheck,
} from "lucide-react";
import DonorboxWidget from "@/components/DonorboxWidget";

interface CampaignDetail {
  id: string;
  slug: string;
  title: string;
  story: string;
  category: string;
  country: string;
  currency: string;
  goalAmount: number; // In cents
  raisedAmount: number; // In cents
  donorCount: number;
  coverImageUrl: string;
  status: string;
  isVerified: boolean;
  createdAt: string;
  organizer: {
    id: string;
    name: string;
    avatarUrl?: string | null;
    isVerified?: boolean;
    createdAt?: string;
  } | null;
}

interface UpdateItem {
  id: string;
  title: string;
  content: string;
  imageUrl?: string | null;
  createdAt: string;
}

interface DonorItem {
  id: string;
  donorName: string;
  amount: number;
  message?: string | null;
  createdAt: string;
}

export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || "";

  const [campaign, setCampaign] = useState<CampaignDetail | null>(null);
  const [updates, setUpdates] = useState<UpdateItem[]>([]);
  const [recentDonations, setRecentDonations] = useState<DonorItem[]>([]);
  const [topDonations, setTopDonations] = useState<DonorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"story" | "updates" | "donors">("story");
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadCampaign() {
      if (!slug) return;
      try {
        setLoading(true);
        const res = await fetch(`/api/campaigns/${encodeURIComponent(slug)}`);
        if (res.ok) {
          const data = (await res.json()) as any;
          setCampaign(data.campaign);
          setUpdates(data.updates || []);
          setRecentDonations(data.recentDonations || []);
          setTopDonations(data.topDonations || []);
        } else {
          // Fallback to static mock for demo preview if slug not yet created in db
          setCampaign({
            id: `cmp_${slug}`,
            slug,
            title: slug
              .split("-")
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(" "),
            story:
              "We are rallying support for critical medical treatment and emergency care. Every dollar raised directly funds immediate hospital interventions, medication, and rehabilitation. Your contribution, no matter the size, helps give our patient a fighting chance at recovery. Our platform guarantees 100% direct payouts to vetted medical facilities.",
            category: "Medical Care",
            country: "US",
            currency: "USD",
            goalAmount: 1500000, // $15,000
            raisedAmount: 945000, // $9,450
            donorCount: 82,
            coverImageUrl:
              "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=1200&auto=format&fit=crop",
            status: "active",
            isVerified: true,
            createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
            organizer: {
              id: "usr_demo",
              name: "GCC Foundation Care Team",
              isVerified: true,
            },
          });
          setUpdates([
            {
              id: "upd_1",
              title: "Initial Treatment Phase Complete",
              content:
                "Thanks to your incredible generosity, the first procedure was completed successfully this morning. The doctors are optimistic about the recovery timeline.",
              createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
            },
          ]);
          setRecentDonations([
            {
              id: "don_1",
              donorName: "Sarah M.",
              amount: 10000,
              message: "Praying for a speedy and complete recovery!",
              createdAt: new Date(Date.now() - 3600000).toISOString(),
            },
            {
              id: "don_2",
              donorName: "Anonymous",
              amount: 25000,
              message: "Keep fighting, we are with you every step of the way.",
              createdAt: new Date(Date.now() - 14400000).toISOString(),
            },
            {
              id: "don_3",
              donorName: "David K.",
              amount: 5000,
              message: "Sent with love and hope.",
              createdAt: new Date(Date.now() - 86400000).toISOString(),
            },
          ]);
          setTopDonations([
            {
              id: "don_top_1",
              donorName: "Anonymous",
              amount: 100000,
              message: "Matching all community gifts today.",
              createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
            },
          ]);
        }
      } catch (err) {
        console.error("Failed to load campaign:", err);
      } finally {
        setLoading(false);
      }
    }
    loadCampaign();
  }, [slug]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#02A95C]"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <div className="flex-1 max-w-xl mx-auto text-center py-24 px-4 space-y-4">
          <h1 className="text-3xl font-extrabold text-gray-900">Fundraiser Not Found</h1>
          <p className="text-gray-600">The campaign you are looking for does not exist or may have been paused.</p>
          <Link
            href="/"
            className="inline-block mt-4 rounded-full bg-[#02A95C] px-6 py-3 font-bold text-white hover:bg-[#028F4D]"
          >
            Explore Active Fundraisers
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const progressPercent = calculateProgress(campaign.raisedAmount, campaign.goalAmount);

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-gray-900">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        {/* Campaign Title & Category Header */}
        <div className="mb-6 space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-[#02A95C]">
              {campaign.category}
            </span>
            {campaign.isVerified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                <BadgeCheck className="h-4 w-4 text-blue-600" />
                Verified Cause
              </span>
            )}
          </div>
          <h1 className="font-heading text-2xl sm:text-4xl font-extrabold tracking-tight text-[#1A1A1A]">
            {campaign.title}
          </h1>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Main Left Column: Media, Story, Tabs */}
          <div className="lg:col-span-8 space-y-8">
            {/* Cover Image */}
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl bg-gray-100 shadow-sm border border-gray-100">
              <Image
                src={campaign.coverImageUrl}
                alt={campaign.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 800px"
              />
            </div>

            {/* Organizer Trust Card */}
            <div className="flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-[#FBF9F6] border border-[#E5E7EB]">
              <div className="flex items-center gap-3.5">
                <div className="h-12 w-12 rounded-full bg-emerald-100 text-[#02A95C] font-extrabold flex items-center justify-center text-lg">
                  {campaign.organizer?.name?.charAt(0) || "G"}
                </div>
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-gray-900 text-sm sm:text-base">
                    <span>{campaign.organizer?.name || "Verified Organizer"}</span>
                    <CheckCircle2 className="h-4 w-4 text-[#02A95C]" />
                  </div>
                  <p className="text-xs text-gray-500">
                    Organizer • Created {formatRelativeDate(campaign.createdAt)}
                  </p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                <ShieldCheck className="h-4 w-4 text-[#02A95C]" />
                Direct Hospital/School Payout
              </div>
            </div>

            {/* Content Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8" aria-label="Tabs">
                <button
                  type="button"
                  onClick={() => setActiveTab("story")}
                  className={`py-4 px-1 border-b-2 font-bold text-sm sm:text-base transition-colors ${
                    activeTab === "story"
                      ? "border-[#02A95C] text-[#02A95C]"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Story
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("updates")}
                  className={`py-4 px-1 border-b-2 font-bold text-sm sm:text-base transition-colors flex items-center gap-2 ${
                    activeTab === "updates"
                      ? "border-[#02A95C] text-[#02A95C]"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Updates
                  {updates.length > 0 && (
                    <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full font-bold">
                      {updates.length}
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("donors")}
                  className={`py-4 px-1 border-b-2 font-bold text-sm sm:text-base transition-colors flex items-center gap-2 ${
                    activeTab === "donors"
                      ? "border-[#02A95C] text-[#02A95C]"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Donations
                  <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full font-bold">
                    {campaign.donorCount}
                  </span>
                </button>
              </nav>
            </div>

            {/* Tab: Story */}
            {activeTab === "story" && (
              <div className="space-y-6">
                <div className="prose max-w-none text-gray-700 leading-relaxed text-base sm:text-lg whitespace-pre-line font-normal">
                  {campaign.story}
                </div>

                {/* Donor Protection Pledge */}
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-6 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-base">
                    <ShieldCheck className="h-5 w-5 text-[#02A95C]" />
                    GCC Foundation Donor Guarantee
                  </div>
                  <p className="text-sm text-emerald-950 leading-relaxed">
                    We guarantee that 100% of your gift reaches the intended beneficiary. Our compliance team verifies invoices and disburses funds directly to medical centers, suppliers, and institutions.
                  </p>
                </div>
              </div>
            )}

            {/* Tab: Updates */}
            {activeTab === "updates" && (
              <div className="space-y-6">
                {updates.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-2xl">
                    No updates posted yet. Check back soon for progress reports from the organizer.
                  </div>
                ) : (
                  <div className="relative border-l-2 border-gray-100 ml-4 pl-6 space-y-8">
                    {updates.map((update) => (
                      <div key={update.id} className="relative space-y-2">
                        <div className="absolute -left-[31px] top-1.5 h-3.5 w-3.5 rounded-full bg-[#02A95C] ring-4 ring-white" />
                        <span className="text-xs font-semibold text-gray-400">
                          {formatRelativeDate(update.createdAt)}
                        </span>
                        <h3 className="font-bold text-lg text-gray-900">{update.title}</h3>
                        <p className="text-gray-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                          {update.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab: Donors */}
            {activeTab === "donors" && (
              <div className="space-y-6">
                {recentDonations.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-2xl">
                    Be the first supporter to leave a contribution and word of encouragement!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentDonations.map((don) => (
                      <div
                        key={don.id}
                        className="p-4 rounded-2xl bg-white border border-gray-100 flex items-start gap-4 shadow-subtle"
                      >
                        <div className="h-10 w-10 rounded-full bg-emerald-50 text-[#02A95C] font-bold flex items-center justify-center shrink-0">
                          <Heart className="h-5 w-5 fill-current" />
                        </div>
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-gray-900 text-sm">{don.donorName}</h4>
                            <span className="font-bold text-sm text-[#02A95C]">
                              {formatMinorUnits(don.amount, campaign.currency)}
                            </span>
                          </div>
                          {don.message && (
                            <p className="text-xs sm:text-sm text-gray-600 italic">
                              "{don.message}"
                            </p>
                          )}
                          <span className="text-xs text-gray-400 block">
                            {formatRelativeDate(don.createdAt)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Trust and Report Button */}
            <div className="pt-6 border-t border-gray-200 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Created with GCC Foundation verified trust protocol.
              </span>
              <ReportCampaignButton campaignId={campaign.id} campaignTitle={campaign.title} />
            </div>
          </div>

          {/* Sticky Donation Sidebar (Desktop & Mobile) */}
          <div className="lg:col-span-4 lg:sticky lg:top-8 space-y-6">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-card space-y-6">
              {/* Funding Progress Display */}
              <div className="space-y-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A]">
                    {formatMinorUnits(campaign.raisedAmount, campaign.currency)}
                  </span>
                  <span className="text-sm text-gray-500 font-medium">
                    raised of {formatMinorUnits(campaign.goalAmount, campaign.currency)}
                  </span>
                </div>

                <ProgressBar progress={progressPercent} className="h-3" />

                <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 font-semibold pt-1">
                  <span>{progressPercent}% funded</span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-gray-400" />
                    {campaign.donorCount} donations
                  </span>
                </div>
              </div>

              {/* Donate Now Redirect Button */}
              <a
                href="https://donorbox.org/gcc-foundation"
                className="w-full flex items-center justify-center gap-2 rounded-full bg-[#02A95C] px-6 py-4 text-base font-extrabold text-white shadow-md hover:bg-[#028F4D] transition-transform active:scale-[0.98]"
              >
                <Heart className="h-5 w-5 fill-current" />
                Donate Now
              </a>

              {/* Donorbox Widget */}
              <DonorboxWidget
                campaign="gcc-foundation"
                type="donation_form"
                enableAutoScroll={true}
              />

              {/* Share Button */}
              <button
                type="button"
                onClick={() => setShareModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 rounded-full border-2 border-gray-200 bg-white px-6 py-3.5 text-base font-bold text-gray-800 hover:border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <Share2 className="h-5 w-5 text-gray-600" />
                Share Fundraiser
              </button>

              {/* Top Recent Supporters Preview */}
              {topDonations.length > 0 && (
                <div className="border-t border-gray-100 pt-5 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Top Supporter
                  </span>
                  <div className="flex items-center justify-between bg-emerald-50/50 p-3 rounded-2xl border border-emerald-100">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-emerald-100 text-[#02A95C] flex items-center justify-center font-bold text-xs">
                        ★
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900">{topDonations[0].donorName}</p>
                        <p className="text-[11px] text-gray-500">{formatRelativeDate(topDonations[0].createdAt)}</p>
                      </div>
                    </div>
                    <span className="font-bold text-xs text-[#02A95C]">
                      {formatMinorUnits(topDonations[0].amount, campaign.currency)}
                    </span>
                  </div>
                </div>
              )}

              {/* Direct Payout Guarantee Badge */}
              <div className="rounded-2xl bg-[#FBF9F6] p-4 text-xs text-gray-600 flex items-start gap-2.5 border border-[#E5E7EB]">
                <ShieldCheck className="h-5 w-5 text-[#02A95C] shrink-0 mt-0.5" />
                <span>
                  <strong>Donor Protection:</strong> All donations are held in segregated trust and disbursed directly to approved invoices.
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Share Modal */}
      {shareModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-extrabold text-xl text-gray-900">
                Share this fundraiser
              </h3>
              <button
                type="button"
                onClick={() => setShareModalOpen(false)}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-gray-600">
              Sharing is just as powerful as donating. Every share brings an average of 4 new supporters.
            </p>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.open(
                      `https://wa.me/?text=${encodeURIComponent(
                        `Support "${campaign.title}" on GCC Foundation: ${window.location.href}`
                      )}`,
                      "_blank"
                    );
                  }
                }}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] py-3.5 text-sm font-bold text-white hover:opacity-95"
              >
                <MessageCircle className="h-5 w-5" />
                Share on WhatsApp
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="w-full flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white py-3.5 text-sm font-bold text-gray-800 hover:bg-gray-50"
              >
                {copied ? (
                  <>
                    <Check className="h-5 w-5 text-[#02A95C]" />
                    <span className="text-[#02A95C]">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-5 w-5 text-gray-500" />
                    <span>Copy Fundraiser Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
