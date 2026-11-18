'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import AccountLayout from '@/components/AccountLayout';
import { useAuth } from '@/context/AuthContext';
import { useDonation } from '@/context/DonationContext';
import {
  CHILDREN_STORAGE_KEY,
  LETTERS_STORAGE_KEY,
  DEFAULT_CHILDREN,
  DEFAULT_LETTERS,
  ChildProfile,
  ChildLetter,
} from '@/data/ngo-portal';
import {
  Sparkles,
  Heart,
  Users,
  PlusCircle,
  AlertCircle,
  ArrowRight,
  Mail,
  Calendar,
  MapPin,
  CheckCircle2,
  Send,
  X,
  ShieldCheck,
} from 'lucide-react';

type Donation = {
  id: string;
  campaignId: string;
  campaignTitle: string;
  amountUGX: number;
  currencyPaid: string;
  date: string;
  isAnonymous: boolean;
};

function ImpactContent() {
  const { user } = useAuth();
  const { campaigns, openDonationModal } = useDonation();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [childrenList, setChildrenList] = useState<ChildProfile[]>(DEFAULT_CHILDREN);
  const [selectedChildForLetter, setSelectedChildForLetter] = useState<ChildProfile | null>(null);
  const [letterText, setLetterText] = useState('');
  const [letterToast, setLetterToast] = useState('');

  useEffect(() => {
    if (!user) return;
    try {
      setDonations(
        JSON.parse(localStorage.getItem(`gcc_foundation_donations_${user.id}`) || '[]') as Donation[]
      );
    } catch {
      setDonations([]);
    }
  }, [user]);

  useEffect(() => {
    try {
      const savedChildren = localStorage.getItem(CHILDREN_STORAGE_KEY);
      if (savedChildren) {
        const parsed = JSON.parse(savedChildren);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setChildrenList(parsed as ChildProfile[]);
        }
      }
    } catch {}
  }, []);

  const firstName = user?.name?.split(' ')[0] || 'Friend';
  const isProfileIncomplete = !user?.phone || !user?.location;
  const myCampaigns = useMemo(
    () => campaigns.filter((campaign) => campaign.ownerUserId === user?.id),
    [campaigns, user?.id]
  );
  const total = donations.reduce((sum, donation) => sum + (Number(donation.amountUGX) || 0), 0);
  const money = (amount: number) =>
    new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      maximumFractionDigits: 0,
    }).format(amount);

  const handleSendLetter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChildForLetter || !letterText.trim()) return;

    const newLetter: ChildLetter = {
      id: `ltr-${Date.now()}`,
      donorName: user?.name || 'Supporter',
      donorEmail: user?.email || 'supporter@thegccfoundation.com',
      childId: selectedChildForLetter.id,
      childName: selectedChildForLetter.name,
      message: letterText.trim(),
      createdAt: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      status: 'pending',
    };

    try {
      const existingRaw = localStorage.getItem(LETTERS_STORAGE_KEY);
      const existing: ChildLetter[] = existingRaw ? JSON.parse(existingRaw) : DEFAULT_LETTERS;
      localStorage.setItem(LETTERS_STORAGE_KEY, JSON.stringify([newLetter, ...existing]));
    } catch {}

    setLetterText('');
    setSelectedChildForLetter(null);
    setLetterToast(
      `Your letter to ${selectedChildForLetter.name} has been sent to our Letter Moderation Queue for safety review before delivery!`
    );
    window.setTimeout(() => setLetterToast(''), 5000);
  };

  return (
    <div className="space-y-8">
      {/* ================= 1. THE WELCOME & ONBOARDING STATE ================= */}
      <div className="rounded-3xl bg-gradient-to-r from-[#012D19] via-[#075B39] to-[#02A95C] p-6 sm:p-8 text-white shadow-card space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1 text-xs font-bold text-[#E6EED8]">
          <Sparkles className="h-3.5 w-3.5" />
          <span>WELCOME TO GCC FOUNDATION</span>
        </div>

        {/* Friendly Greeting Banner */}
        <h2 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight">
          Welcome to the family, {firstName}! We’re thrilled to have you here.
        </h2>

        {/* Impact Introduction Box */}
        <div className="rounded-2xl bg-white/10 border border-white/15 p-4 sm:p-5 text-sm leading-relaxed text-emerald-50">
          <strong className="text-white block mb-1">Your Impact Journey Starts Here</strong>
          Explore our active community projects, sponsor a child’s education and healthcare, or make your first contribution. Every shilling and dollar is tracked with 100% direct institutional payouts.
        </div>
      </div>

      {/* Profile Completion Prompt */}
      {isProfileIncomplete && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/90 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-amber-950">
                Complete your contact & billing address details
              </h3>
              <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
                Please fill out your phone number and billing/tax address so automated tax receipts and project update letters can be generated accurately.
              </p>
            </div>
          </div>
          <Link
            href="/account/profile"
            className="shrink-0 inline-flex items-center justify-center gap-1.5 rounded-full bg-amber-900 hover:bg-amber-950 px-5 py-2.5 text-xs font-bold text-white transition-colors"
          >
            <span>Complete Profile</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {/* ================= 3. CLEAR CALL-TO-ACTION (CTA) SHORTCUTS ================= */}
      <section className="space-y-3">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-gray-500">
          Quick Next Steps
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Shortcut 1: Sponsor a Child */}
          <a
            href="#children-directory"
            className="group rounded-2xl border border-[#DCE9DD] bg-[#F5F8F4] hover:bg-[#EAF5ED] p-5 transition-all flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-xl bg-[#02A95C] text-white flex items-center justify-center">
                <Users className="h-5 w-5" />
              </div>
              <ArrowRight className="h-4 w-4 text-[#087443] group-hover:translate-x-1 transition-transform" />
            </div>
            <div>
              <strong className="block font-heading text-base font-extrabold text-[#20251f]">
                Sponsor a Child
              </strong>
              <span className="mt-1 block text-xs text-[#526057] leading-relaxed">
                Browse the available children’s directory and support school fees, meals, and care.
              </span>
            </div>
          </a>

          {/* Shortcut 2: Make a Donation */}
          <button
            type="button"
            onClick={() => openDonationModal()}
            className="group text-left rounded-2xl border border-[#DCE9DD] bg-[#F5F8F4] hover:bg-[#EAF5ED] p-5 transition-all flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between w-full">
              <div className="h-10 w-10 rounded-xl bg-[#02A95C] text-white flex items-center justify-center">
                <Heart className="h-5 w-5" />
              </div>
              <ArrowRight className="h-4 w-4 text-[#087443] group-hover:translate-x-1 transition-transform" />
            </div>
            <div>
              <strong className="block font-heading text-base font-extrabold text-[#20251f]">
                Make a Donation
              </strong>
              <span className="mt-1 block text-xs text-[#526057] leading-relaxed">
                Quick access to support ongoing emergency medical or community water campaigns.
              </span>
            </div>
          </button>

          {/* Shortcut 3: Start a Fundraiser */}
          <Link
            href="/create/fundraiser/category"
            className="group rounded-2xl border border-[#DCE9DD] bg-[#F5F8F4] hover:bg-[#EAF5ED] p-5 transition-all flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-xl bg-[#02A95C] text-white flex items-center justify-center">
                <PlusCircle className="h-5 w-5" />
              </div>
              <ArrowRight className="h-4 w-4 text-[#087443] group-hover:translate-x-1 transition-transform" />
            </div>
            <div>
              <strong className="block font-heading text-base font-extrabold text-[#20251f]">
                Start a Fundraiser
              </strong>
              <span className="mt-1 block text-xs text-[#526057] leading-relaxed">
                Create a personal peer-to-peer birthday, tuition, or community fundraising campaign.
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* ================= 2. CLEAN "EMPTY STATE" DASHBOARDS (ZERO-DATA VIEWS) ================= */}
      {/* Lifetime Impact Metrics */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ['Lifetime Donations', money(total)],
          ['Projects Supported', String(donations.length)],
          ['Fundraisers Started', String(myCampaigns.length)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-[#e4e8e3] bg-[#f7faf7] p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-[#626b64]">{label}</p>
            <p className="mt-2 text-2xl font-extrabold text-[#20251f]">{value}</p>
          </div>
        ))}
      </div>

      {/* Empty State 1: Your Impact / Giving History */}
      <section className="space-y-3">
        <h3 className="text-lg font-bold text-[#20251f]">Your Impact & Giving History</h3>
        {donations.length > 0 ? (
          <div className="divide-y divide-[#edf0ec] rounded-2xl border border-[#e4e8e3]">
            {donations.map((donation) => (
              <div key={donation.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-semibold text-[#20251f]">{donation.campaignTitle}</p>
                  <p className="mt-1 text-xs text-[#626b64]">
                    {new Date(donation.date).toLocaleDateString()} ·{' '}
                    {donation.isAnonymous ? 'Anonymous gift' : 'Verified Donation'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#087443]">{money(donation.amountUGX)}</p>
                  <p className="text-xs text-[#818981]">{donation.currencyPaid}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#cfd6d0] bg-[#f8faf7] p-6 sm:p-8 text-center space-y-4">
            <div className="mx-auto h-12 w-12 rounded-full bg-[#eaf5ed] text-[#02a95c] flex items-center justify-center">
              <Heart className="h-6 w-6" />
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h4 className="font-heading font-bold text-base text-[#20251f]">
                0 Lifetime Donations · 0 Projects Supported Yet
              </h4>
              <p className="text-xs sm:text-sm text-[#626b64] leading-relaxed">
                When you make a contribution, your itemized tax receipts, hospital EFT references, and field updates will appear right here.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => openDonationModal()}
                className="rounded-full bg-[#02a95c] hover:bg-[#087443] px-6 py-2.5 text-xs sm:text-sm font-bold text-white transition-colors"
              >
                Make Your First Gift
              </button>
              <Link
                href="/#discover"
                className="rounded-full border border-[#cfd6d0] bg-white hover:bg-gray-50 px-6 py-2.5 text-xs sm:text-sm font-bold text-[#20251f] transition-colors"
              >
                Explore Active Projects
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Empty State 2: Recurring Plans & Sponsorships */}
      <section className="space-y-3">
        <h3 className="text-lg font-bold text-[#20251f]">Recurring Plans & Child Sponsorships</h3>
        <div className="rounded-2xl border border-[#e4e8e3] bg-[#f8faf7] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="h-11 w-11 rounded-2xl bg-[#eaf5ed] text-[#087443] flex items-center justify-center shrink-0">
              <Calendar className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-sm sm:text-base text-[#20251f]">
                No active monthly pledges or child sponsorships yet
              </h4>
              <p className="text-xs sm:text-sm text-[#626b64] leading-relaxed max-w-xl">
                Set up a recurring monthly gift or sponsor a child below whenever you are ready. Monthly supporters receive quarterly report cards and direct field letters.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2.5 shrink-0">
            <a
              href="#children-directory"
              className="rounded-full bg-[#02a95c] hover:bg-[#087443] px-5 py-2.5 text-xs font-bold text-white transition-colors"
            >
              Sponsor a Child
            </a>
            <button
              type="button"
              onClick={() => openDonationModal()}
              className="rounded-full border border-[#cfd6d0] bg-white hover:bg-gray-50 px-5 py-2.5 text-xs font-bold text-[#20251f] transition-colors"
            >
              Start Monthly Pledge
            </button>
          </div>
        </div>
      </section>

      {/* Empty State 3: Messages Welcome Preview */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#20251f]">Messages & Leadership Welcome</h3>
          <Link href="/messages/primary" className="text-xs sm:text-sm font-bold text-[#087443] hover:underline">
            Open Full Inbox →
          </Link>
        </div>
        <div className="rounded-2xl border border-[#DCE9DD] bg-white p-5 shadow-subtle space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-full bg-[#02A95C] text-white font-bold text-xs flex items-center justify-center">
                GCC
              </div>
              <div>
                <strong className="text-sm font-bold text-[#20251f] block">
                  GCC Foundation Leadership Team
                </strong>
                <span className="text-[11px] text-gray-500">Welcome Note · Automated Impact Updates</span>
              </div>
            </div>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-[#02A95C]">
              Welcome Message
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#526057] leading-relaxed">
            “Dear {firstName}, thank you for joining the GCC Foundation community! This inbox is where you will receive direct hospital & school disbursement notifications, thank-you notes from families, and moderated letters from sponsored children.”
          </p>
        </div>
      </section>

      {/* ================= AVAILABLE CHILDREN'S DIRECTORY (SPONSOR A CHILD) ================= */}
      <section id="children-directory" className="scroll-mt-24 pt-4 border-t border-[#edf0ec] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#02A95C]">
              Child Sponsorship Program
            </span>
            <h3 className="mt-1 font-heading text-xl sm:text-2xl font-extrabold text-[#20251f]">
              Available Children’s Directory
            </h3>
            <p className="text-xs sm:text-sm text-[#626b64]">
              Sponsor a child’s education, nutrition, and healthcare—or send an encouraging message reviewed by our safety team.
            </p>
          </div>
        </div>

        {letterToast && (
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs sm:text-sm text-[#087443] font-semibold flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{letterToast}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {childrenList.map((child) => (
            <div
              key={child.id}
              className="rounded-2xl border border-[#e4e8e3] bg-white overflow-hidden shadow-subtle flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 w-full bg-gray-100">
                  <img
                    src={child.photoUrl}
                    alt={child.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold shadow-xs ${
                        child.status === 'available'
                          ? 'bg-[#02A95C] text-white'
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      {child.status === 'available' ? 'Available to Sponsor' : 'Sponsored'}
                    </span>
                    <span className="bg-black/75 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                      ${child.monthlySponsorshipUSD}/mo
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-heading font-extrabold text-lg text-[#20251f]">
                      {child.name}, {child.age}
                    </h4>
                    <span className="text-xs font-semibold text-gray-500">{child.gender}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <MapPin className="h-3.5 w-3.5 text-[#02A95C] shrink-0" />
                    <span>{child.district} · {child.schoolAndGrade}</span>
                  </div>
                  <p className="text-xs text-[#526057] leading-relaxed">{child.bio}</p>
                  <p className="text-xs font-semibold text-[#087443] bg-[#f5f8f4] px-3 py-1.5 rounded-lg">
                    Dream: {child.dream}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-2 flex items-center gap-2.5">
                {child.status === 'available' ? (
                  <button
                    type="button"
                    onClick={() => openDonationModal()}
                    className="flex-1 rounded-full bg-[#02A95C] hover:bg-[#087443] text-white text-xs font-bold py-2.5 px-4 transition-colors text-center"
                  >
                    Sponsor {child.name.split(' ')[0]}
                  </button>
                ) : (
                  <span className="flex-1 rounded-full bg-gray-100 text-gray-600 text-xs font-bold py-2.5 px-4 text-center">
                    Sponsored ({child.sponsorName || 'Community Member'})
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedChildForLetter(child)}
                  className="rounded-full border border-[#cfd6d0] hover:border-gray-900 text-[#20251f] text-xs font-bold py-2.5 px-4 transition-colors"
                >
                  Send Letter
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Send Letter to Child Modal */}
      {selectedChildForLetter && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#02A95C]">
                  Donor-to-Child Encouragement
                </span>
                <h3 className="font-heading font-extrabold text-lg text-[#20251f]">
                  Write a Letter to {selectedChildForLetter.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedChildForLetter(null)}
                className="p-1.5 rounded-full text-gray-400 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Your letter will be reviewed by our child-protection moderation queue before being printed and hand-delivered by our field officer in {selectedChildForLetter.district}.
            </p>

            <form onSubmit={handleSendLetter} className="space-y-4">
              <textarea
                rows={4}
                required
                placeholder={`Write an encouraging note to ${selectedChildForLetter.name}...`}
                value={letterText}
                onChange={(e) => setLetterText(e.target.value)}
                className="w-full rounded-xl border border-[#cfd6d0] p-3 text-sm focus:border-[#02A95C] focus:outline-none"
              />
              <div className="flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedChildForLetter(null)}
                  className="rounded-full border border-gray-200 px-4 py-2 text-xs font-bold text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#02A95C] hover:bg-[#087443] px-5 py-2 text-xs font-bold text-white"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Submit Letter for Delivery</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ImpactPage() {
  return (
    <AccountLayout
      active="impact"
      title="Welcome & Impact Dashboard"
      description="Explore your onboarding steps, sponsor a child, make a donation, or track your community impact."
    >
      <ImpactContent />
    </AccountLayout>
  );
}
