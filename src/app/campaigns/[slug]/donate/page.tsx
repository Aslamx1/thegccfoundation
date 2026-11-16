"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";

export default function CheckoutPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "";

  const [campaign, setCampaign] = useState<{
    id: string;
    title: string;
    coverImageUrl: string;
    currency: string;
    organizerName: string;
  } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCampaign() {
      if (!slug) return;
      try {
        const res = await fetch(`/api/campaigns/${encodeURIComponent(slug)}`);
        if (res.ok) {
          const data = (await res.json()) as any;
          setCampaign({
            id: data.campaign.id,
            title: data.campaign.title,
            coverImageUrl: data.campaign.coverImageUrl,
            currency: data.campaign.currency || "USD",
            organizerName: data.campaign.organizer?.name || "GCC Foundation Organizer",
          });
        } else {
          setCampaign({
            id: `cmp_${slug}`,
            title: slug
              .split("-")
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(" "),
            coverImageUrl:
              "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=1200&auto=format&fit=crop",
            currency: "USD",
            organizerName: "GCC Foundation Care Team",
          });
        }
      } catch {
        setCampaign({
          id: `cmp_${slug}`,
          title: "Community Emergency Healthcare Fund",
          coverImageUrl:
            "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=1200&auto=format&fit=crop",
          currency: "USD",
          organizerName: "GCC Foundation Care Team",
        });
      } finally {
        setLoading(false);
      }
    }
    loadCampaign();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#02A95C]"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F6] font-sans text-gray-900">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto px-4 py-8 sm:py-12 w-full">
        {/* Back Link */}
        <Link
          href={`/campaigns/${encodeURIComponent(slug)}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to fundraiser
        </Link>

        {/* Fundraiser Summary Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-gray-100 mb-8">
          {campaign?.coverImageUrl && (
            <div className="relative h-16 w-24 rounded-2xl overflow-hidden shrink-0 bg-gray-100">
              <Image
                src={campaign.coverImageUrl}
                alt={campaign.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              You are supporting:
            </p>
            <h2 className="font-heading font-extrabold text-lg text-gray-900 line-clamp-1">
              {campaign?.title}
            </h2>
          </div>
        </div>

        {/* Donorbox Widget */}
        <div className="rounded-3xl bg-white p-6 sm:p-10 shadow-card border border-gray-100">
          <script
            type="module"
            src="https://donorbox.org/widgets.js"
            async
            dangerouslySetInnerHTML={{ __html: "" }}
          />
          <dbox-widget
            campaign="gcc-foundation"
            type="donation_form"
            enable-auto-scroll="true"
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
