"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { formatMinorUnits, formatRelativeDate } from "@/lib/formatters";
import Link from "next/link";
import {
  ShieldCheck,
  Building2,
  Lock,
  UserCheck,
  FileCheck2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  ExternalLink,
  Search,
  Check,
  XCircle,
  Flag,
  DollarSign,
  Loader2,
} from "lucide-react";

interface AdminStats {
  campaignsCount: number;
  openReportsCount: number;
  pendingPayoutsCount: number;
  totalRaisedMinorUnits: number;
  totalTipsMinorUnits: number;
  successfulDonationsCount: number;
}

interface CampaignRow {
  id: string;
  slug: string;
  title: string;
  category: string;
  currency: string;
  goalAmount: number;
  raisedAmount: number;
  donorCount: number;
  status: "draft" | "active" | "paused" | "completed";
  isVerified: boolean;
  createdAt: string;
  organizer: {
    id: string;
    name: string;
    email: string;
  } | null;
}

interface ReportRow {
  id: string;
  reporterEmail: string;
  reason: string;
  details: string;
  status: "open" | "resolved";
  createdAt: string;
  campaign: {
    id: string;
    slug: string;
    title: string;
    status: string;
  } | null;
}

interface PayoutRow {
  id: string;
  amount: number;
  bankDetailsEncrypted: string;
  status: "pending" | "approved" | "paid" | "rejected";
  createdAt: string;
  campaign: {
    id: string;
    title: string;
    currency: string;
    raisedAmount: number;
  } | null;
  organizer: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export default function AdminConsolePage() {
  const [activeTab, setActiveTab] = useState<"campaigns" | "reports" | "payouts">("campaigns");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [campaigns, setCampaigns] = useState<CampaignRow[]>([]);
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [payouts, setPayouts] = useState<PayoutRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Admin requests use the secure, HTTP-only session cookie.
  const adminHeaders = { "Content-Type": "application/json" };

  useEffect(() => {
    async function loadAdminData() {
      try {
        setLoading(true);
        // 1. Stats
        const statsRes = await fetch("/api/admin/stats", { headers: adminHeaders });
        if (statsRes.ok) setStats((await statsRes.json()) as AdminStats);

        // 2. Campaigns
        const campRes = await fetch("/api/admin/campaigns", { headers: adminHeaders });
        if (campRes.ok) {
          const campData = (await campRes.json()) as { campaigns?: CampaignRow[] };
          setCampaigns(campData.campaigns || []);
        }

        // 3. Reports
        const repRes = await fetch("/api/admin/reports", { headers: adminHeaders });
        if (repRes.ok) {
          const repData = (await repRes.json()) as { reports?: ReportRow[] };
          setReports(repData.reports || []);
        }

        // 4. Payouts
        const payRes = await fetch("/api/admin/payouts", { headers: adminHeaders });
        if (payRes.ok) {
          const payData = (await payRes.json()) as { payouts?: PayoutRow[] };
          setPayouts(payData.payouts || []);
        }
      } catch (err) {
        console.error("Admin data load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, []);

  // Action: Toggle Verified Status
  const toggleVerification = async (campaignId: string, currentVerified: boolean) => {
    setActionLoadingId(campaignId);
    try {
      const res = await fetch(`/api/admin/campaigns/${campaignId}/status`, {
        method: "PATCH",
        headers: adminHeaders,
        body: JSON.stringify({ isVerified: !currentVerified }),
      });
      if (res.ok) {
        setCampaigns((prev) =>
          prev.map((c) => (c.id === campaignId ? { ...c, isVerified: !currentVerified } : c))
        );
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  // Action: Toggle Active / Paused Status
  const toggleStatus = async (campaignId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "active" ? "paused" : "active";
    setActionLoadingId(campaignId);
    try {
      const res = await fetch(`/api/admin/campaigns/${campaignId}/status`, {
        method: "PATCH",
        headers: adminHeaders,
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        setCampaigns((prev) =>
          prev.map((c) => (c.id === campaignId ? { ...c, status: nextStatus as any } : c))
        );
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  // Action: Resolve Report
  const resolveReport = async (reportId: string) => {
    setActionLoadingId(reportId);
    try {
      const res = await fetch(`/api/admin/reports/${reportId}/resolve`, {
        method: "PATCH",
        headers: adminHeaders,
        body: JSON.stringify({ status: "resolved" }),
      });
      if (res.ok) {
        setReports((prev) =>
          prev.map((r) => (r.id === reportId ? { ...r, status: "resolved" } : r))
        );
        if (stats) setStats({ ...stats, openReportsCount: Math.max(0, stats.openReportsCount - 1) });
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  // Action: Process Payout
  const updatePayoutStatus = async (payoutId: string, newStatus: "approved" | "paid" | "rejected") => {
    setActionLoadingId(payoutId);
    try {
      const res = await fetch(`/api/admin/payouts/${payoutId}/status`, {
        method: "PATCH",
        headers: adminHeaders,
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setPayouts((prev) =>
          prev.map((p) => (p.id === payoutId ? { ...p, status: newStatus } : p))
        );
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] font-sans text-gray-900">
      <Header />

      {/* Admin Top Banner */}
      <section className="bg-[#121E07] text-white border-b border-[#2F4812] py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2F4812] border border-[#3D5E16] flex items-center justify-center text-[#AFC68A]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-base text-white">
                  GCC Foundation Moderation & Compliance Console
                </span>
                <span className="bg-[#3D5E16] text-[#E6EED8] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Staff Role: Admin
                </span>
              </div>
              <span className="text-xs text-gray-300">
                Direct oversight of verified fundraisers, fraud whistleblowers, and bank payouts.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-gray-300">
            <span>Edge Status: <strong className="text-emerald-400">Cloudflare Hyperdrive Active</strong></span>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-8">
        {/* KPI Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-subtle space-y-1">
            <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">
              Total Raised Platform
            </span>
            <span className="font-heading font-black text-2xl text-gray-900 block">
              {formatMinorUnits(stats?.totalRaisedMinorUnits || 0, "USD")}
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold">
              {stats?.successfulDonationsCount || 0} Successful Gifts
            </span>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-subtle space-y-1">
            <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">
              Total Fundraisers
            </span>
            <span className="font-heading font-black text-2xl text-[#02A95C] block">
              {stats?.campaignsCount || campaigns.length}
            </span>
            <span className="text-[11px] text-gray-500">Live & In Moderation</span>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-subtle space-y-1">
            <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">
              Open Fraud Reports
            </span>
            <span className="font-heading font-black text-2xl text-amber-600 block">
              {stats?.openReportsCount || reports.filter((r) => r.status === "open").length}
            </span>
            <span className="text-[11px] text-gray-500">SLA: Under 12 Hours</span>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-subtle space-y-1">
            <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">
              Pending Payouts
            </span>
            <span className="font-heading font-black text-2xl text-purple-600 block">
              {stats?.pendingPayoutsCount || payouts.filter((p) => p.status === "pending").length}
            </span>
            <span className="text-[11px] text-gray-500">Bank Wires & EFT</span>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-gray-200">
          <button
            type="button"
            onClick={() => setActiveTab("campaigns")}
            className={`py-3 px-6 font-bold text-sm border-b-2 transition-colors ${
              activeTab === "campaigns"
                ? "border-[#02A95C] text-[#02A95C]"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            Fundraisers ({campaigns.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("reports")}
            className={`py-3 px-6 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "reports"
                ? "border-[#02A95C] text-[#02A95C]"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            Fraud & Safety Reports
            {reports.filter((r) => r.status === "open").length > 0 && (
              <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full font-bold">
                {reports.filter((r) => r.status === "open").length}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("payouts")}
            className={`py-3 px-6 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "payouts"
                ? "border-[#02A95C] text-[#02A95C]"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            Bank Payout Requests ({payouts.length})
          </button>
        </div>

        {/* TAB 1: CAMPAIGNS MODERATION */}
        {activeTab === "campaigns" && (
          <div className="bg-white border border-[#E5E7EB] rounded-3xl shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-[#FBF9F6] border-b border-gray-200 text-xs font-bold uppercase text-gray-500">
                  <tr>
                    <th className="px-6 py-4">Fundraiser</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Raised / Goal</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Verification</th>
                    <th className="px-6 py-4 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {campaigns.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                        No campaigns found in database.
                      </td>
                    </tr>
                  ) : (
                    campaigns.map((c) => (
                      <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-gray-900">
                          <Link
                            href={`/campaigns/${encodeURIComponent(c.slug)}`}
                            className="hover:text-[#02A95C] flex items-center gap-1.5"
                          >
                            {c.title}
                            <ExternalLink className="h-3.5 w-3.5 text-gray-400" />
                          </Link>
                          <span className="text-xs text-gray-400 block font-normal">
                            Organizer: {c.organizer?.name || "Direct Verified"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-bold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-full">
                            {c.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono font-bold text-gray-900">
                          {formatMinorUnits(c.raisedAmount, c.currency)} /{" "}
                          <span className="text-gray-400 font-normal">
                            {formatMinorUnits(c.goalAmount, c.currency)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase ${
                              c.status === "active"
                                ? "bg-emerald-100 text-emerald-800"
                                : c.status === "paused"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {c.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {c.isVerified ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
                              <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" /> Verified
                            </span>
                          ) : (
                            <span className="text-xs font-bold text-gray-400">Unverified</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => toggleVerification(c.id, c.isVerified)}
                            disabled={actionLoadingId === c.id}
                            className="px-3 py-1.5 rounded-full border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-100"
                          >
                            {c.isVerified ? "Revoke Badge" : "Verify Badge"}
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleStatus(c.id, c.status)}
                            disabled={actionLoadingId === c.id}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                              c.status === "active"
                                ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            }`}
                          >
                            {c.status === "active" ? "Pause" : "Activate"}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: FRAUD & SAFETY REPORTS */}
        {activeTab === "reports" && (
          <div className="bg-white border border-[#E5E7EB] rounded-3xl shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-[#FBF9F6] border-b border-gray-200 text-xs font-bold uppercase text-gray-500">
                  <tr>
                    <th className="px-6 py-4">Target Campaign</th>
                    <th className="px-6 py-4">Reporter</th>
                    <th className="px-6 py-4">Reason & Details</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Resolution</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {reports.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                        No fraud or safety reports filed.
                      </td>
                    </tr>
                  ) : (
                    reports.map((r) => (
                      <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-gray-900">
                          {r.campaign?.title || "Campaign"}
                        </td>
                        <td className="px-6 py-4 font-mono text-xs">{r.reporterEmail}</td>
                        <td className="px-6 py-4 space-y-1 max-w-sm">
                          <span className="font-bold text-xs text-red-600 block">{r.reason}</span>
                          <p className="text-xs text-gray-600 line-clamp-2">{r.details}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase ${
                              r.status === "open"
                                ? "bg-red-100 text-red-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {r.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {r.status === "open" && (
                            <button
                              type="button"
                              onClick={() => resolveReport(r.id)}
                              disabled={actionLoadingId === r.id}
                              className="px-4 py-1.5 rounded-full bg-[#02A95C] text-xs font-bold text-white hover:bg-[#028F4D]"
                            >
                              Mark Resolved
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: PAYOUT REQUESTS */}
        {activeTab === "payouts" && (
          <div className="bg-white border border-[#E5E7EB] rounded-3xl shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-[#FBF9F6] border-b border-gray-200 text-xs font-bold uppercase text-gray-500">
                  <tr>
                    <th className="px-6 py-4">Campaign & Beneficiary</th>
                    <th className="px-6 py-4">Requested Amount</th>
                    <th className="px-6 py-4">Disbursement Destination</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Approve / Pay</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {payouts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                        No pending payout requests.
                      </td>
                    </tr>
                  ) : (
                    payouts.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-gray-900">
                          {p.campaign?.title}
                          <span className="text-xs text-gray-400 block font-normal">
                            Organizer: {p.organizer?.name}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono font-bold text-gray-900">
                          {formatMinorUnits(p.amount * 100, p.campaign?.currency || "USD")}
                        </td>
                        <td className="px-6 py-4 text-xs font-mono text-gray-700 max-w-xs">
                          {p.bankDetailsEncrypted}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase ${
                              p.status === "paid"
                                ? "bg-emerald-100 text-emerald-800"
                                : p.status === "approved"
                                ? "bg-blue-100 text-blue-800"
                                : p.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          {p.status === "pending" && (
                            <button
                              type="button"
                              onClick={() => updatePayoutStatus(p.id, "approved")}
                              disabled={actionLoadingId === p.id}
                              className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold"
                            >
                              Approve
                            </button>
                          )}
                          {(p.status === "pending" || p.status === "approved") && (
                            <button
                              type="button"
                              onClick={() => updatePayoutStatus(p.id, "paid")}
                              disabled={actionLoadingId === p.id}
                              className="px-3 py-1.5 rounded-full bg-[#02A95C] text-white hover:bg-[#028F4D] text-xs font-bold"
                            >
                              Disburse Wire
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
