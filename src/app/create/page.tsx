"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { formatMinorUnits } from "@/lib/formatters";
import {
  Sparkles,
  Upload,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  HeartHandshake,
  Image as ImageIcon,
  Building2,
  GraduationCap,
  HeartPulse,
  Flame,
  Globe,
  Loader2,
} from "lucide-react";

const CATEGORIES = [
  { name: "Medical Care", icon: HeartPulse, description: "Surgeries, hospital bills, treatments, recovery" },
  { name: "Emergency Relief", icon: Flame, description: "Disaster aid, displacement, urgent food & shelter" },
  { name: "Education & Tuition", icon: GraduationCap, description: "School tuition, books, dorms, learning materials" },
  { name: "Community & Water", icon: Globe, description: "Clean water wells, boreholes, village solar" },
  { name: "Memorial & Funeral", icon: HeartHandshake, description: "Honoring loved ones and supporting families" },
  { name: "Small Business", icon: Building2, description: "Community markets, vocational tools, recovery" },
];

const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "UGX", symbol: "USh", name: "Ugandan Shilling" },
  { code: "KES", symbol: "KSh", name: "Kenyan Shilling" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "EUR", symbol: "€", name: "Euro" },
];

export default function CreateCampaignWizard() {
  const router = useRouter();

  // Step indicator (1 to 5)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [country, setCountry] = useState("US");
  const [currency, setCurrency] = useState("USD");
  const [category, setCategory] = useState("Medical Care");
  const [goalAmountStr, setGoalAmountStr] = useState("5000");
  const [coverImageUrl, setCoverImageUrl] = useState(
    "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1200&auto=format&fit=crop"
  );
  const [uploadingImage, setUploadingImage] = useState(false);
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [organizerName, setOrganizerName] = useState("");
  const [organizerEmail, setOrganizerEmail] = useState("");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const goalAmountMinorUnits = Math.round((Number(goalAmountStr) || 0) * 100);

  // Handle Cover Photo Upload via API
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setErrorMsg("");
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/uploads/direct", {
        method: "POST",
        body: formData,
      });

      const data = (await res.json()) as any;
      if (res.ok && data.url) {
        setCoverImageUrl(data.url);
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch {
      // Local fallback preview if R2 not bound
      const localUrl = URL.createObjectURL(file);
      setCoverImageUrl(localUrl);
    } finally {
      setUploadingImage(false);
    }
  };

  // AI Story Assistant
  const handleAiAssistance = async () => {
    if (!title && !category) {
      setErrorMsg("Please enter a campaign title first so the AI can craft a tailored story.");
      return;
    }
    setIsGeneratingAi(true);
    setErrorMsg("");

    try {
      const prompt = `Write a heartfelt, empathetic, and compelling crowdfunding story for a ${category} campaign titled "${
        title || "Community Emergency Support"
      }".`;

      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt }),
      });

      if (res.ok) {
        const data = (await res.json()) as any;
        if (data.reply || data.output_text) {
          setStory(data.reply || data.output_text);
        } else {
          throw new Error();
        }
      } else {
        throw new Error();
      }
    } catch {
      // High-quality compassionate template
      setStory(
        `We are reaching out to our community during an urgent time of need. Every single day brings new challenges, but with your kindness and compassion, we know we can overcome this hurdle.\n\nAll funds raised through GCC Foundation are subject to direct beneficiary verification. Contributions will directly fund necessary treatments, equipment, and critical supplies with zero administrative delay.\n\nThank you for standing with us, sharing this story, and offering your heartfelt support.`
      );
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Publish Campaign
  const handlePublish = async () => {
    setPublishing(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          story: story.trim(),
          category,
          country,
          currency,
          goalAmount: goalAmountMinorUnits,
          coverImageUrl,
          organizerName: organizerName.trim() || undefined,
          organizerEmail: organizerEmail.trim() || undefined,
        }),
      });

      const data = (await res.json()) as any;
      if (!res.ok) throw new Error(data.error || "Failed to publish campaign");

      // Redirect to newly published campaign
      router.push(`/campaigns/${encodeURIComponent(data.slug)}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to publish";
      setErrorMsg(msg);
      setPublishing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F6] font-sans text-gray-900">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto px-4 py-8 sm:py-12 w-full space-y-8">
        {/* Step Progress Indicators */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-wider text-gray-500">
            <span>Step {currentStep} of 5</span>
            <span className="text-[#02A95C]">
              {currentStep === 1 && "Category & Currency"}
              {currentStep === 2 && "Target Goal"}
              {currentStep === 3 && "Cover Photo"}
              {currentStep === 4 && "Title & Story"}
              {currentStep === 5 && "Review & Launch"}
            </span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentStep >= step ? "bg-[#02A95C]" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs sm:text-sm text-red-700 font-medium">
            {errorMsg}
          </div>
        )}

        {/* ================= STEP 1: CATEGORY & CURRENCY ================= */}
        {currentStep === 1 && (
          <div className="rounded-3xl bg-white p-6 sm:p-10 shadow-card border border-gray-100 space-y-6">
            <div className="space-y-1">
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-gray-900">
                Where will your fundraiser make an impact?
              </h1>
              <p className="text-sm text-gray-500">
                Select your cause category and local currency for direct payouts.
              </p>
            </div>

            {/* Category Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = category === cat.name;
                return (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => setCategory(cat.name)}
                    className={`p-4 rounded-2xl text-left border-2 transition-all flex items-start gap-3.5 ${
                      isSelected
                        ? "border-[#02A95C] bg-emerald-50/50 shadow-sm"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className={`p-2.5 rounded-xl ${
                        isSelected ? "bg-[#02A95C] text-white" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-900">{cat.name}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{cat.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Currency Selector */}
            <div className="space-y-2 pt-2">
              <label className="block text-sm font-bold text-gray-800">Campaign Currency</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {CURRENCIES.map((cur) => (
                  <button
                    key={cur.code}
                    type="button"
                    onClick={() => setCurrency(cur.code)}
                    className={`py-3 px-3 rounded-xl border text-xs sm:text-sm font-bold transition-all ${
                      currency === cur.code
                        ? "border-[#02A95C] bg-emerald-50 text-[#02A95C]"
                        : "border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {cur.code} ({cur.symbol})
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="rounded-full bg-[#02A95C] px-8 py-3.5 font-extrabold text-white hover:bg-[#028F4D] transition-transform active:scale-[0.98] flex items-center gap-2"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: GOAL AMOUNT ================= */}
        {currentStep === 2 && (
          <div className="rounded-3xl bg-white p-6 sm:p-10 shadow-card border border-gray-100 space-y-6">
            <div className="space-y-1">
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-gray-900">
                How much would you like to raise?
              </h1>
              <p className="text-sm text-gray-500">
                Plan ahead for hospital bills, medical quotes, or institution fees. You can adjust this later.
              </p>
            </div>

            <div className="rounded-2xl bg-[#FBF9F6] p-6 border border-gray-200 text-center space-y-4">
              <div className="inline-flex items-center gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold text-gray-400">{currency}</span>
                <input
                  type="number"
                  min="10"
                  step="10"
                  value={goalAmountStr}
                  onChange={(e) => setGoalAmountStr(e.target.value)}
                  className="font-heading font-extrabold text-4xl sm:text-5xl text-gray-900 bg-transparent text-center focus:outline-none w-56 border-b-2 border-[#02A95C]"
                />
              </div>
              <p className="text-xs text-gray-500">
                Target goal equivalent:{" "}
                <span className="font-bold text-gray-900">
                  {formatMinorUnits(goalAmountMinorUnits, currency)}
                </span>
              </p>
            </div>

            <div className="rounded-2xl bg-emerald-50/60 p-4 border border-emerald-100 flex items-start gap-3 text-xs text-emerald-950">
              <ShieldCheck className="h-5 w-5 text-[#02A95C] shrink-0" />
              <span>
                <strong>0% Platform Fee Guarantee:</strong> Keep every dollar you raise. Standard payment processor charges apply at cost.
              </span>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="rounded-full border border-gray-200 px-6 py-3.5 font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <button
                type="button"
                disabled={goalAmountMinorUnits < 1000}
                onClick={() => setCurrentStep(3)}
                className="rounded-full bg-[#02A95C] px-8 py-3.5 font-extrabold text-white hover:bg-[#028F4D] flex items-center gap-2 disabled:opacity-50"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: COVER PHOTO ================= */}
        {currentStep === 3 && (
          <div className="rounded-3xl bg-white p-6 sm:p-10 shadow-card border border-gray-100 space-y-6">
            <div className="space-y-1">
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-gray-900">
                Add a high-trust cover photo
              </h1>
              <p className="text-sm text-gray-500">
                Fundraisers with clear, authentic photos raise up to 3x more support.
              </p>
            </div>

            {/* Photo Preview Card */}
            <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
              <Image
                src={coverImageUrl}
                alt="Campaign Cover Preview"
                fill
                className="object-cover"
              />
              {uploadingImage && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center text-white gap-2 font-bold text-sm">
                  <Loader2 className="h-6 w-6 animate-spin" /> Uploading to R2...
                </div>
              )}
            </div>

            {/* Upload Button */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <label className="w-full sm:w-auto cursor-pointer rounded-full bg-[#02A95C] px-6 py-3 text-sm font-bold text-white hover:bg-[#028F4D] transition-colors flex items-center justify-center gap-2">
                <Upload className="h-4 w-4" />
                Upload Photo from Device
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={() =>
                  setCoverImageUrl(
                    "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=1200&auto=format&fit=crop"
                  )
                }
                className="text-xs text-gray-500 hover:text-gray-900 underline"
              >
                Use sample healthcare photo
              </button>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="rounded-full border border-gray-200 px-6 py-3.5 font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="rounded-full bg-[#02A95C] px-8 py-3.5 font-extrabold text-white hover:bg-[#028F4D] flex items-center gap-2"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: TITLE & STORY (WITH AI ASSISTANT) ================= */}
        {currentStep === 4 && (
          <div className="rounded-3xl bg-white p-6 sm:p-10 shadow-card border border-gray-100 space-y-6">
            <div className="space-y-1">
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-gray-900">
                Share your story with empathy
              </h1>
              <p className="text-sm text-gray-500">
                Explain who you are raising funds for, what happened, and how the funds will be used.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">
                  Fundraiser Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Urgent Surgery & Care for Grace"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-12 w-full rounded-2xl border-2 border-gray-200 px-4 text-sm font-semibold text-gray-900 focus:border-[#02A95C] focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-bold text-gray-800">Campaign Story</label>
                  <button
                    type="button"
                    onClick={handleAiAssistance}
                    disabled={isGeneratingAi}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#02A95C] hover:text-[#028F4D] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    {isGeneratingAi ? "Crafting story..." : "AI Writing Assistant"}
                  </button>
                </div>
                <textarea
                  rows={8}
                  required
                  placeholder="Tell your story. Include details about the patient or cause, the hospital or school involved, and your message of gratitude..."
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  className="w-full rounded-2xl border-2 border-gray-200 p-4 text-sm text-gray-800 leading-relaxed focus:border-[#02A95C] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Organizer Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your Full Name"
                    value={organizerName}
                    onChange={(e) => setOrganizerName(e.target.value)}
                    className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm focus:border-[#02A95C] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Organizer Email
                  </label>
                  <input
                    type="email"
                    placeholder="organizer@example.com"
                    value={organizerEmail}
                    onChange={(e) => setOrganizerEmail(e.target.value)}
                    className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm focus:border-[#02A95C] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="rounded-full border border-gray-200 px-6 py-3.5 font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <button
                type="button"
                disabled={title.length < 5 || story.length < 20}
                onClick={() => setCurrentStep(5)}
                className="rounded-full bg-[#02A95C] px-8 py-3.5 font-extrabold text-white hover:bg-[#028F4D] flex items-center gap-2 disabled:opacity-50"
              >
                Review Fundraiser <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 5: REVIEW & PUBLISH ================= */}
        {currentStep === 5 && (
          <div className="rounded-3xl bg-white p-6 sm:p-10 shadow-card border border-gray-100 space-y-6">
            <div className="space-y-1">
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-gray-900">
                Ready to publish your fundraiser
              </h1>
              <p className="text-sm text-gray-500">
                Review your campaign preview below. You can start sharing immediately once published.
              </p>
            </div>

            {/* Campaign Preview Card */}
            <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-subtle bg-white space-y-4">
              <div className="relative aspect-[16/9] w-full bg-gray-100">
                <Image src={coverImageUrl} alt={title} fill className="object-cover" />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#02A95C]">
                  {category}
                </div>
              </div>
              <div className="p-5 space-y-3">
                <h3 className="font-heading font-extrabold text-xl text-gray-900">{title}</h3>
                <p className="text-xs text-gray-500">
                  Target:{" "}
                  <strong className="text-gray-900">
                    {formatMinorUnits(goalAmountMinorUnits, currency)}
                  </strong>{" "}
                  • Organizer: {organizerName || "Verified Organizer"}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 line-clamp-3 leading-relaxed">
                  {story}
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-emerald-50 p-4 border border-emerald-100 flex items-start gap-3 text-xs text-emerald-950">
              <CheckCircle2 className="h-5 w-5 text-[#02A95C] shrink-0" />
              <span>
                By publishing, your campaign will be active on GCC Foundation. Our compliance officers will review and apply a verified badge once hospital documents are verified.
              </span>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="rounded-full border border-gray-200 px-6 py-3.5 font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <button
                type="button"
                disabled={publishing}
                onClick={handlePublish}
                className="rounded-full bg-[#02A95C] px-10 py-4 font-extrabold text-white hover:bg-[#028F4D] transition-transform active:scale-[0.98] flex items-center gap-2 disabled:opacity-50"
              >
                {publishing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" /> Publishing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-5 w-5" /> Publish Fundraiser Now
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
