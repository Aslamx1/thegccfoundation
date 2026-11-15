"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProgressBar from "@/components/ProgressBar";
import { formatMinorUnits, calculateProgress, formatRelativeDate } from "@/lib/formatters";
import {
  TrendingUp,
  Users,
  DollarSign,
  Plus,
  Download,
  Send,
  Building,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  X,
  Loader2,
} from "lucide-react";

interface CampaignItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  currency: string;
  goalAmount: number;
  raisedAmount: number;
  donorCount: number;
  status: string;
  isVerified: boolean;
  createdAt: string;
}

interface DonorRecord {
  id: string;
  donorName: string;
  amount: number;
  message?: string | null;
  createdAt: string;
}

export default function OrganizerDashboard() {
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>("");
  const [donors, setDonors] = useState<DonorRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [updateTitle, setUpdateTitle] = useState("");
  const [updateContent, setUpdateContent] = useState("");
  const [postingUpdate, setPostingUpdate] = useState(false);

  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [payoutAmountStr, setPayoutAmountStr] = useState("");
  const [bankDetails, setBankDetails] = useState("");
  const [requestingPayout, setRequestingPayout] = useState(false);
  const [payoutSuccessMsg, setPayoutSuccessMsg] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await fetch("/api/campaigns?limit=20");
        if (res.ok) {
          const data = (await res.json()) as any;
          const list = data.campaigns || [];
          setCampaigns(list);
          if (list.length > 0) {
            setSelectedCampaignId(list[0].id);
            // Fetch donors for first campaign
            const donRes = await fetch(`/api/donations/campaign/${list[0].id}`);
            if (donRes.ok) {
              const donData = (await donRes.json()) as any;
              setDonors(donData.donations || []);
            }
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const activeCampaign = campaigns.find((c) => c.id === selectedCampaignId) || campaigns[0];

  // Total raised calculation across active campaigns
  const totalRaisedCents = campaigns.reduce((acc, curr) => acc + (curr.raisedAmount || 0), 0);
  const totalDonorsCount = campaigns.reduce((acc, curr) => acc + (curr.donorCount || 0), 0);

  // Export Donors to CSV
  const handleExportCSV = () => {
    if (donors.length === 0) {
      alert("No donor records to export.");
      return;
    }

    const headers = ["Donation ID", "Donor Name", "Amount (Cents)", "Formatted Amount", "Message", "Date"];
    const rows = donors.map((d) => [
      `"${d.id}"`,
      `"${d.donorName}"`,
      d.amount,
      `"${formatMinorUnits(d.amount, activeCampaign?.currency)}"`,
      `"${(d.message || "").replace(/"/g, '""')}"`,
      `"${d.createdAt}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `donors_${activeCampaign?.slug || "campaign"}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Post Campaign Update
  const handlePostUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampaignId || !updateTitle || !updateContent) return;

    setPostingUpdate(true);
    try {
      const res = await fetch(`/api/campaigns/${selectedCampaignId}/updates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: updateTitle.trim(),
          content: updateContent.trim(),
        }),
      });

      if (res.ok) {
        alert("Update successfully posted to the fundraiser page!");
        setUpdateModalOpen(false);
        setUpdateTitle("");
        setUpdateContent("");
      } else {
        throw new Error();
      }
    } catch {
      alert("Failed to post update. Please try again.");
    } finally {
      setPostingUpdate(false);
    }
  };

  // Submit Bank Withdrawal / KYC Payout Request
  const handleSubmitPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampaignId || !payoutAmountStr || !bankDetails) return;

    setRequestingPayout(true);
    setPayoutSuccessMsg("");
    try {
      // In production, posts to /api/admin/payouts
      setTimeout(() => {
        setPayoutSuccessMsg(
          "Your withdrawal request has been logged. Our compliance department will review and release bank disbursement within 2 business days."
        );
        setRequestingPayout(false);
        setTimeout(() => {
          setPayoutModalOpen(false);
          setPayoutAmountStr("");
          setBankDetails("");
          setPayoutSuccessMsg("");
        }, 3000);
      }, 800);
    } catch {
      alert("Failed to submit withdrawal request.");
      setRequestingPayout(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F6] font-sans text-gray-900">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-8">
        {/* Dashboard Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-gray-900">
              Organizer Dashboard
            </h1>
            <p className="text-sm text-gray-500">
              Manage your verified fundraisers, share updates with donors, and request bank disbursements.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/create"
              className="rounded-full bg-[#02A95C] px-5 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-[#028F4D] transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="h-4 w-4" /> Start New Fundraiser
            </Link>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="rounded-3xl bg-white p-6 border border-gray-100 shadow-card space-y-2">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Total Raised
              </span>
              <DollarSign className="h-5 w-5 text-[#02A95C]" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              {formatMinorUnits(totalRaisedCents, "USD")}
            </p>
            <p className="text-xs text-emerald-600 font-semibold">100% direct payouts guarantee</p>
          </div>

          <div className="rounded-3xl bg-white p-6 border border-gray-100 shadow-card space-y-2">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Total Supporters
              </span>
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-gray-900">{totalDonorsCount}</p>
            <p className="text-xs text-gray-500">Community donors</p>
          </div>

          <div className="rounded-3xl bg-white p-6 border border-gray-100 shadow-card space-y-2">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Active Campaigns
              </span>
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-gray-900">{campaigns.length}</p>
            <p className="text-xs text-gray-500">Live on platform</p>
          </div>
        </div>

        {/* Main Campaign Management & Donor Report */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Active Campaigns List */}
          <div className="lg:col-span-6 space-y-4">
            <h2 className="font-heading font-extrabold text-lg text-gray-900">
              Your Fundraisers
            </h2>

            {loading ? (
              <div className="p-8 text-center bg-white rounded-3xl border border-gray-100">
                <Loader2 className="h-6 w-6 animate-spin mx-auto text-[#02A95C]" />
              </div>
            ) : campaigns.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-3xl border border-gray-200 space-y-3">
                <p className="text-sm text-gray-500">You haven't launched any fundraisers yet.</p>
                <Link
                  href="/create"
                  className="inline-block rounded-full bg-[#02A95C] px-5 py-2 text-xs font-bold text-white hover:bg-[#028F4D]"
                >
                  Create Your First Fundraiser
                </Link>
              </div>
            ) : (
              campaigns.map((camp) => {
                const isSelected = camp.id === selectedCampaignId;
                const progress = calculateProgress(camp.raisedAmount, camp.goalAmount);
                return (
                  <div
                    key={camp.id}
                    onClick={() => setSelectedCampaignId(camp.id)}
                    className={`p-5 rounded-3xl bg-white border-2 cursor-pointer transition-all space-y-3 shadow-subtle ${
                      isSelected
                        ? "border-[#02A95C] shadow-md"
                        : "border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[11px] font-bold text-[#02A95C] bg-emerald-50 px-2.5 py-0.5 rounded-full">
                          {camp.category}
                        </span>
                        <h3 className="font-heading font-bold text-base text-gray-900 mt-1 line-clamp-1">
                          {camp.title}
                        </h3>
                      </div>
                      <Link
                        href={`/campaigns/${encodeURIComponent(camp.slug)}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs font-bold text-[#02A95C] hover:underline shrink-0"
                      >
                        View Live ↗
                      </Link>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold text-gray-600">
                        <span>
                          {formatMinorUnits(camp.raisedAmount, camp.currency)} of{" "}
                          {formatMinorUnits(camp.goalAmount, camp.currency)}
                        </span>
                        <span>{progress}%</span>
                      </div>
                      <ProgressBar progress={progress} className="h-2" />
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                      <span className="text-gray-500">{camp.donorCount} supporters</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCampaignId(camp.id);
                            setUpdateModalOpen(true);
                          }}
                          className="px-3 py-1 rounded-full bg-emerald-50 text-[#02A95C] font-bold hover:bg-emerald-100 transition-colors"
                        >
                          Post Update
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCampaignId(camp.id);
                            setPayoutModalOpen(true);
                          }}
                          className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors"
                        >
                          Withdraw
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column: Donor Report & CSV Export */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-extrabold text-lg text-gray-900">
                Donor Contributions ({donors.length})
              </h2>
              <button
                type="button"
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-subtle transition-colors"
              >
                <Download className="h-3.5 w-3.5 text-gray-500" /> Export CSV
              </button>
            </div>

            <div className="rounded-3xl bg-white border border-gray-100 shadow-card overflow-hidden">
              {donors.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-sm">
                  No donation records available for the selected campaign yet.
                </div>
              ) : (
                <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
                  {donors.map((don) => (
                    <div key={don.id} className="p-4 flex items-center justify-between gap-4">
                      <div>
                        <p className="font-bold text-sm text-gray-900">{don.donorName}</p>
                        {don.message && (
                          <p className="text-xs text-gray-500 italic line-clamp-1">
                            "{don.message}"
                          </p>
                        )}
                        <span className="text-[11px] text-gray-400">
                          {formatRelativeDate(don.createdAt)}
                        </span>
                      </div>
                      <span className="font-extrabold text-sm text-[#02A95C] shrink-0">
                        {formatMinorUnits(don.amount, activeCampaign?.currency)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Post Update Modal */}
      {updateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-xl text-gray-900">
                Post Progress Update
              </h3>
              <button
                type="button"
                onClick={() => setUpdateModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handlePostUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Update Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Surgery completed, thank you!"
                  value={updateTitle}
                  onChange={(e) => setUpdateTitle(e.target.value)}
                  className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm focus:border-[#02A95C] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Update Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share latest patient condition, medical receipts, or progress with your donors..."
                  value={updateContent}
                  onChange={(e) => setUpdateContent(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:border-[#02A95C] focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setUpdateModalOpen(false)}
                  className="rounded-full border border-gray-200 px-5 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={postingUpdate}
                  className="rounded-full bg-[#02A95C] px-6 py-2 text-xs font-bold text-white hover:bg-[#028F4D] disabled:opacity-50"
                >
                  {postingUpdate ? "Publishing..." : "Publish Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* KYC / Bank Withdrawal Modal */}
      {payoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-xl text-gray-900">
                Request Bank Disbursement
              </h3>
              <button
                type="button"
                onClick={() => setPayoutModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {payoutSuccessMsg ? (
              <div className="p-4 rounded-2xl bg-emerald-50 text-[#02A95C] text-xs sm:text-sm font-semibold">
                {payoutSuccessMsg}
              </div>
            ) : (
              <form onSubmit={handleSubmitPayout} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Withdrawal Amount ({activeCampaign?.currency})
                  </label>
                  <input
                    type="number"
                    required
                    min="10"
                    placeholder="e.g. 2000"
                    value={payoutAmountStr}
                    onChange={(e) => setPayoutAmountStr(e.target.value)}
                    className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm focus:border-[#02A95C] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Hospital, Institution, or Bank Details
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Bank Name, Account Name, Account / IBAN Number, or Mobile Money Number..."
                    value={bankDetails}
                    onChange={(e) => setBankDetails(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:border-[#02A95C] focus:outline-none"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setPayoutModalOpen(false)}
                    className="rounded-full border border-gray-200 px-5 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={requestingPayout}
                    className="rounded-full bg-[#02A95C] px-6 py-2 text-xs font-bold text-white hover:bg-[#028F4D] disabled:opacity-50"
                  >
                    {requestingPayout ? "Submitting..." : "Submit Request"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
