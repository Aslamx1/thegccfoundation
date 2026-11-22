"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProgressBar from "@/components/ProgressBar";
import { formatMinorUnits, calculateProgress } from "@/lib/formatters";
import { useDonation, matchCategory } from "@/context/DonationContext";
import {
  Search,
  CheckCircle2,
  Users,
  ShieldCheck,
  Plus,
  ArrowRight,
  Filter,
  BadgeCheck,
} from "lucide-react";

interface CampaignItem {
  id: string;
  slug: string;
  title: string;
  story: string;
  category: string;
  currency: string;
  goalAmount: number;
  raisedAmount: number;
  donorCount: number;
  coverImageUrl: string;
  isVerified: boolean;
  status: string;
}

const CATEGORIES = [
  "All",
  "Medical",
  "Education",
  "Emergency",
  "Community",
];

export default function CampaignsDiscoveryPage() {
  const { campaigns: contextCampaigns } = useDonation();
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCampaigns() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (category !== "All") queryParams.set("category", category);
        if (search.trim()) queryParams.set("search", search.trim());

        const res = await fetch(`/api/campaigns?${queryParams.toString()}`);
        if (res.ok) {
          const data = (await res.json()) as any;
          if (data.campaigns && data.campaigns.length > 0) {
            setCampaigns(data.campaigns);
            return;
          }
        }
      } catch (err) {
        console.error("Failed to load campaigns via API:", err);
      } finally {
        setLoading(false);
      }

      // Live fallback using unified DonationContext campaigns
      const filtered = contextCampaigns
        .filter((c) => {
          const matchesCat = matchCategory(c.category, category);
          const q = search.trim().toLowerCase();
          const matchesSearch =
            !q ||
            c.title.toLowerCase().includes(q) ||
            (c.subtitle || "").toLowerCase().includes(q) ||
            (c.location?.district || "").toLowerCase().includes(q);
          return matchesCat && matchesSearch;
        })
        .map((c) => ({
          id: c.id,
          slug: c.slug,
          title: c.title,
          story: c.subtitle || (c.fullStoryHtml?.[0] ?? ""),
          category: c.category,
          currency: "UGX",
          goalAmount: Math.round(c.goalUGX * 100),
          raisedAmount: Math.round(c.raisedUGX * 100),
          donorCount: c.donorCount,
          coverImageUrl: c.coverImage,
          isVerified: true,
          status: "active",
        }));

      setCampaigns(filtered);
      setLoading(false);
    }

    const timer = setTimeout(() => {
      fetchCampaigns();
    }, 150);

    return () => clearTimeout(timer);
  }, [category, search, contextCampaigns]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F6] font-sans text-gray-900">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-8">
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-gray-200">
          <div className="space-y-1">
            <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#1A1A1A]">
              Explore Verified Causes
            </h1>
            <p className="text-sm text-gray-500">
              Discover fundraisers with 100% direct payouts to verified hospitals, schools, and community accounts.
            </p>
          </div>

          <Link
            href="/create"
            className="self-start md:self-auto rounded-full bg-[#02A95C] px-6 py-3 text-sm font-bold text-white hover:bg-[#028F4D] transition-all flex items-center gap-2 shadow-sm"
          >
            <Plus className="h-4 w-4" /> Start a Fundraiser
          </Link>
        </div>

        {/* Filter Controls: Search & Category Pills */}
        <div className="space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, location, or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 w-full rounded-2xl border border-gray-200 bg-white pl-11 pr-4 text-sm focus:border-[#02A95C] focus:outline-none shadow-xs"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                  category === cat
                    ? "bg-[#1A1A1A] text-white shadow-sm"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Campaign Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-96 rounded-3xl bg-white border border-gray-100 p-4 animate-pulse space-y-4"
              >
                <div className="aspect-[16/10] bg-gray-200 rounded-2xl w-full" />
                <div className="h-4 bg-gray-200 rounded-md w-3/4" />
                <div className="h-3 bg-gray-100 rounded-md w-1/2" />
              </div>
            ))}
          </div>
        ) : campaigns.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-12 text-center space-y-3">
            <h3 className="font-heading text-lg font-bold text-gray-900">
              No fundraisers match your criteria
            </h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              Try adjusting your search terms or view all categories to see active campaigns.
            </p>
            <button
              type="button"
              onClick={() => {
                setCategory("All");
                setSearch("");
              }}
              className="mt-2 rounded-full bg-[#02A95C] px-5 py-2 text-xs font-bold text-white hover:bg-[#028F4D]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((camp) => {
              const progress = calculateProgress(camp.raisedAmount, camp.goalAmount);
              return (
                <Link
                  key={camp.id}
                  href={`/campaigns/${encodeURIComponent(camp.slug)}`}
                  className="rounded-3xl bg-white border border-gray-100 overflow-hidden shadow-subtle hover:shadow-card transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden">
                      <Image
                        src={camp.coverImageUrl}
                        alt={camp.title}
                        fill
                        className="object-cover group-hover:scale-102 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute top-3 left-3 bg-white/95 px-2.5 py-1 rounded-full text-[11px] font-bold text-[#02A95C] shadow-xs">
                        {camp.category}
                      </div>
                      {camp.isVerified && (
                        <div className="absolute top-3 right-3 bg-blue-50/95 text-blue-700 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-xs">
                          <BadgeCheck className="h-3.5 w-3.5 text-blue-600" /> Verified
                        </div>
                      )}
                    </div>

                    <div className="px-5 space-y-2">
                      <h3 className="font-heading font-extrabold text-base sm:text-lg text-[#1A1A1A] line-clamp-2 group-hover:text-[#028F4D] transition-colors">
                        {camp.title}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                        {camp.story}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-4 space-y-3">
                    <ProgressBar progress={progress} className="h-2" />
                    <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
                      <span>
                        <strong className="text-gray-900">
                          {formatMinorUnits(camp.raisedAmount, camp.currency)}
                        </strong>{" "}
                        raised
                      </span>
                      <span className="flex items-center gap-1 text-gray-500">
                        <Users className="h-3.5 w-3.5" />
                        {camp.donorCount}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
