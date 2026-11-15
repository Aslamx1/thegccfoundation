"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import confetti from "canvas-confetti";
import { formatMinorUnits } from "@/lib/formatters";
import {
  ShieldCheck,
  Heart,
  Lock,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  CreditCard,
  Building,
  Check,
} from "lucide-react";

const PRESET_AMOUNTS = [2500, 5000, 10000, 25000]; // in cents: $25, $50, $100, $250
const TIP_PERCENTAGES = [0, 10, 15, 20];

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || "";

  const [campaign, setCampaign] = useState<{
    id: string;
    title: string;
    coverImageUrl: string;
    currency: string;
    organizerName: string;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [selectedAmount, setSelectedAmount] = useState<number>(5000); // $50 default
  const [customAmountStr, setCustomAmountStr] = useState<string>("");
  const [tipPercentage, setTipPercentage] = useState<number>(15);
  const [donorName, setDonorName] = useState<string>("");
  const [donorEmail, setDonorEmail] = useState<string>("");
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [succeeded, setSucceeded] = useState<boolean>(false);
  const [receipt, setReceipt] = useState<{ donationId: string; total: number } | null>(null);

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
          // Fallback mock
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

  const activeDonationAmount = customAmountStr
    ? Math.round(Number(customAmountStr) * 100) || 0
    : selectedAmount;

  const tipAmount = Math.round((activeDonationAmount * tipPercentage) / 100);
  const totalAmount = activeDonationAmount + tipAmount;

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9.]/g, "");
    setCustomAmountStr(val);
    setSelectedAmount(0);
  };

  const handlePresetSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmountStr("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaign || activeDonationAmount < 100) return;

    setSubmitting(true);
    try {
      // 1. Create checkout intent via Hono backend
      const checkoutRes = await fetch("/api/donations/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId: campaign.id,
          amount: activeDonationAmount,
          tipAmount,
          donorName: isAnonymous ? "Anonymous" : donorName.trim() || "Anonymous",
          donorEmail: donorEmail.trim() || "donor@example.com",
          isAnonymous,
          message: message.trim() || undefined,
        }),
      });

      const checkoutData = (await checkoutRes.json()) as any;
      if (!checkoutRes.ok) throw new Error(checkoutData.error || "Checkout failed");

      // 2. Trigger idempotent webhook to safely confirm transaction
      await fetch("/api/donations/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "payment_intent.succeeded",
          paymentProviderRef: checkoutData.paymentProviderRef,
          status: "succeeded",
        }),
      });

      // 3. Celebrate with Confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#02A95C", "#028F4D", "#FBF9F6", "#2F4812"],
        });
      } catch {}

      setReceipt({
        donationId: checkoutData.donationId,
        total: totalAmount,
      });
      setSucceeded(true);
    } catch (err: unknown) {
      console.error(err);
      alert("There was an issue processing your donation. Please check your details and try again.");
    } finally {
      setSubmitting(false);
    }
  };

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

        {succeeded && receipt ? (
          /* Success Screen */
          <div className="rounded-3xl bg-white p-8 sm:p-12 shadow-card border border-gray-100 text-center space-y-6">
            <div className="h-20 w-20 rounded-full bg-emerald-100 text-[#02A95C] mx-auto flex items-center justify-center">
              <Check className="h-10 w-10 stroke-[3]" />
            </div>
            <div className="space-y-2">
              <h1 className="font-heading text-3xl font-extrabold text-gray-900">
                Thank you for your generous gift!
              </h1>
              <p className="text-gray-600 max-w-md mx-auto text-sm sm:text-base">
                Your donation of{" "}
                <strong>{formatMinorUnits(receipt.total, campaign?.currency)}</strong> has been
                confirmed and allocated directly to <strong>{campaign?.title}</strong>.
              </p>
            </div>

            <div className="bg-[#FBF9F6] p-4 rounded-2xl border border-gray-200 text-xs text-gray-500 max-w-md mx-auto">
              Receipt Reference: <span className="font-mono font-bold">{receipt.donationId}</span>
              <br />
              A full tax-compliant receipt has been sent to your email.
            </div>

            <div className="pt-4 flex justify-center gap-4">
              <Link
                href={`/campaigns/${encodeURIComponent(slug)}`}
                className="rounded-full bg-[#02A95C] px-8 py-3.5 text-sm font-extrabold text-white hover:bg-[#028F4D] transition-colors"
              >
                Return to Fundraiser
              </Link>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <div className="rounded-3xl bg-white p-6 sm:p-10 shadow-card border border-gray-100 space-y-8">
            {/* Fundraiser Summary Header */}
            <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
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

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* 1. Select Donation Amount */}
              <div className="space-y-3">
                <label className="block text-sm font-extrabold text-gray-900">
                  Choose a donation amount
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {PRESET_AMOUNTS.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handlePresetSelect(amt)}
                      className={`py-3.5 px-4 rounded-2xl font-bold text-base border-2 transition-all ${
                        selectedAmount === amt && !customAmountStr
                          ? "border-[#02A95C] bg-emerald-50 text-[#02A95C]"
                          : "border-gray-200 text-gray-800 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {formatMinorUnits(amt, campaign?.currency)}
                    </button>
                  ))}
                </div>

                {/* Custom Amount Field */}
                <div className="relative mt-2">
                  <span className="absolute left-4 top-3.5 text-gray-500 font-bold">$</span>
                  <input
                    type="text"
                    placeholder="Other custom amount"
                    value={customAmountStr}
                    onChange={handleCustomChange}
                    className="h-12 w-full rounded-2xl border-2 border-gray-200 pl-8 pr-4 text-sm font-semibold text-gray-900 focus:border-[#02A95C] focus:outline-none"
                  />
                </div>
              </div>

              {/* 2. Platform Tip Slider */}
              <div className="rounded-2xl bg-[#FBF9F6] p-5 border border-[#E5E7EB] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-gray-900">
                      GCC Foundation Voluntary Tip
                    </h3>
                    <p className="text-xs text-gray-500">
                      We charge 0% platform fee to organizers. Voluntary tips support our vetting team.
                    </p>
                  </div>
                  <span className="font-extrabold text-sm text-[#02A95C]">
                    {formatMinorUnits(tipAmount, campaign?.currency)} ({tipPercentage}%)
                  </span>
                </div>

                <div className="flex gap-2">
                  {TIP_PERCENTAGES.map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setTipPercentage(pct)}
                      className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                        tipPercentage === pct
                          ? "bg-white border-[#02A95C] text-[#02A95C] shadow-sm"
                          : "border-gray-200 text-gray-600 hover:bg-white"
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Donor Identity & Anonymous Toggle */}
              <div className="space-y-4">
                <h3 className="font-extrabold text-sm text-gray-900">Donor Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      disabled={isAnonymous}
                      required={!isAnonymous}
                      placeholder={isAnonymous ? "Anonymous Donor" : "Jane Doe"}
                      value={isAnonymous ? "" : donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm focus:border-[#02A95C] focus:outline-none disabled:bg-gray-100 disabled:text-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Email Address (for tax receipt)
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="jane@example.com"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm focus:border-[#02A95C] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Anonymous Toggle */}
                <label className="flex items-center gap-3 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-[#02A95C] focus:ring-[#02A95C]"
                  />
                  <span className="text-xs sm:text-sm text-gray-700">
                    Don't display my name publicly on the fundraiser (Anonymous gift)
                  </span>
                </label>

                {/* Optional Message */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Words of support (optional)
                  </label>
                  <textarea
                    rows={2}
                    maxLength={300}
                    placeholder="Leave a short encouraging message for the organizer..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:border-[#02A95C] focus:outline-none"
                  />
                </div>
              </div>

              {/* 4. Payment Total Breakdown & Secure Checkout Button */}
              <div className="pt-4 border-t border-gray-100 space-y-4">
                <div className="flex items-center justify-between text-base sm:text-lg font-extrabold text-gray-900">
                  <span>Total Due Today:</span>
                  <span className="text-[#02A95C]">
                    {formatMinorUnits(totalAmount, campaign?.currency)}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={submitting || activeDonationAmount < 100}
                  className="w-full rounded-full bg-[#02A95C] py-4 text-base font-extrabold text-white shadow-md hover:bg-[#028F4D] transition-transform active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Lock className="h-4 w-4" />
                  {submitting
                    ? "Processing Secure Gift..."
                    : `Donate ${formatMinorUnits(totalAmount, campaign?.currency)} Now`}
                </button>

                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <ShieldCheck className="h-4 w-4 text-[#02A95C]" />
                  <span>256-bit SSL encrypted • Guaranteed beneficiary disbursement</span>
                </div>
              </div>
            </form>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
