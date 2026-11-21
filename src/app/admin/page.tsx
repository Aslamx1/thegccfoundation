'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdminService } from '@/lib/supabase/admin-service';
import { DashboardKPIs, Donation, SponsoredChild, SponsorshipMessage } from '@/lib/supabase/types';
import { StatusBadge, CardSkeleton, Skeleton } from '@/components/admin/AdminUI';
import {
  TrendingUp,
  DollarSign,
  HeartHandshake,
  MailCheck,
  Users,
  ArrowUpRight,
  Plus,
  Megaphone,
  CheckCircle2,
  Calendar,
  Sparkles,
  Receipt,
  Clock,
  Layers,
  ChevronRight,
} from 'lucide-react';

export default function AdminDashboardOverview() {
  const router = useRouter();
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null);
  const [transactions, setTransactions] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [kpiData, donationData] = await Promise.all([
          AdminService.getDashboardKPIs(),
          AdminService.getDonations(),
        ]);
        setKpis(kpiData);
        setTransactions(donationData.slice(0, 6));
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 sm:p-8 text-white shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>GCC Foundation Operations Command</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back to Admin Command
            </h1>
            <p className="text-slate-300 text-sm max-w-xl">
              Track real-time giving disbursements, child welfare sponsorships, donor communications, and field milestones across East Africa.
            </p>
          </div>

          {/* Quick-action buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/admin/sponsorships?action=new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-xs sm:text-sm shadow-md transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              Add Child Profile
            </Link>
            <Link
              href="/admin/campaigns?action=new_update"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-medium text-xs sm:text-sm backdrop-blur-xs transition-all"
            >
              <Megaphone className="w-4 h-4 text-emerald-400" />
              Publish Project Update
            </Link>
            <Link
              href="/admin/letters"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-medium text-xs sm:text-sm backdrop-blur-xs transition-all"
            >
              <MailCheck className="w-4 h-4 text-amber-400" />
              Review Pending Letters
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {loading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          <>
            {/* Total Funds Raised All-Time */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-3">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <span>Total Funds Raised</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 tracking-tight">
                  {formatCurrency(kpis?.totalRaisedAllTime || 0)}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                  <span className="text-emerald-600 font-semibold flex items-center">
                    <TrendingUp className="w-3 h-3 mr-0.5" />
                    {formatCurrency(kpis?.totalRaisedThisMonth || 0)}
                  </span>
                  <span>this month</span>
                </div>
              </div>
              <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-100 flex justify-between">
                <span>This year:</span>
                <span className="font-semibold text-slate-700">
                  {formatCurrency(kpis?.totalRaisedThisYear || 0)}
                </span>
              </div>
            </div>

            {/* Active Sponsorships */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-3">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <span>Active Sponsorships</span>
                <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100">
                  <HeartHandshake className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 tracking-tight">
                  {kpis?.activeSponsorships || 0} Children
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                  <span className="text-sky-600 font-semibold">
                    {kpis?.activeRecurringDonors || 0} active donors
                  </span>
                  <span>pledging monthly</span>
                </div>
              </div>
              <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-100 flex justify-between">
                <span>Direct retention:</span>
                <span className="font-semibold text-emerald-600">96.8%</span>
              </div>
            </div>

            {/* Moderation Queue */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-3">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <span>Pending Approvals</span>
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                  <MailCheck className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 tracking-tight">
                  {(kpis?.pendingLetterApprovals || 0) + (kpis?.pendingFundraiserApprovals || 0)} Items
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                  <span className="text-amber-600 font-semibold">
                    {kpis?.pendingLetterApprovals || 0} letters
                  </span>
                  <span>&amp; {kpis?.pendingFundraiserApprovals || 0} P2P campaigns</span>
                </div>
              </div>
              <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-100 flex justify-between">
                <span>Action needed:</span>
                <Link href="/admin/letters" className="text-amber-600 font-semibold hover:underline">
                  Review queue &rarr;
                </Link>
              </div>
            </div>

            {/* Total Registered Supporters */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-3">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <span>Registered Supporters</span>
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 tracking-tight">
                  {kpis?.totalRegisteredSupporters || 0} Members
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                  <span className="text-purple-600 font-semibold">Verified profiles</span>
                  <span>in public.profiles</span>
                </div>
              </div>
              <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-100 flex justify-between">
                <span>Staff roles:</span>
                <Link href="/admin/users" className="font-semibold text-slate-700 hover:underline">
                  Manage Directory &rarr;
                </Link>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Grid: Recent Transactions Feed & Operational Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Transactions Feed */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recent Transactions &amp; Ledger</h2>
              <p className="text-xs text-slate-500">Live incoming online donations and verified offline ledger receipts</p>
            </div>
            <Link
              href="/admin/donations"
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              <span>Full Ledger</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex-1 overflow-x-auto">
            {loading ? (
              <div className="p-6 space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
            ) : transactions.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500">
                No recent transactions recorded.
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Donor</th>
                    <th className="py-3 px-4">Campaign</th>
                    <th className="py-3 px-4">Method / Type</th>
                    <th className="py-3 px-4 text-right">Amount</th>
                    <th className="py-3 px-4 text-center">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{tx.donor_name}</div>
                        <div className="text-[11px] text-slate-400 font-normal">{tx.donor_email}</div>
                      </td>
                      <td className="py-3.5 px-4 max-w-[180px] truncate">
                        <span className="text-slate-700">{tx.campaign_title || 'General Fund'}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <StatusBadge status={tx.entry_type} label={tx.entry_type} />
                          <span className="text-slate-500 text-[11px] truncate">{tx.payment_method}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="font-bold text-slate-900">{formatCurrency(tx.amount)}</span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <StatusBadge status={tx.receipt_status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="p-4 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Automatic receipts issued via Supabase edge email trigger</span>
            <Link
              href="/admin/donations?action=log_offline"
              className="font-semibold text-emerald-600 hover:underline"
            >
              + Log Offline Contribution
            </Link>
          </div>
        </div>

        {/* Right 1 Col: Operational Activity & Quick Audit */}
        <div className="space-y-6">
          {/* Quick Audits & Safety Check */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Child Safeguarding &amp; Trust Guard
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every message exchanged between international sponsors and children is moderated for safety, privacy, and protection standards before delivery.
            </p>

            <div className="space-y-2.5 pt-2">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 text-xs">
                <span className="text-slate-600 font-medium">Pending Letters</span>
                <span className="px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 text-[11px]">
                  {kpis?.pendingLetterApprovals || 0} waiting
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 text-xs">
                <span className="text-slate-600 font-medium">P2P Fundraiser Reviews</span>
                <span className="px-2 py-0.5 rounded-full font-bold bg-purple-100 text-purple-800 text-[11px]">
                  {kpis?.pendingFundraiserApprovals || 0} waiting
                </span>
              </div>
            </div>

            <Link
              href="/admin/letters"
              className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
            >
              Open Moderation Queue
            </Link>
          </div>

          {/* Quick Section Jump Cards */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Department Shortcuts
            </h3>
            <div className="space-y-1.5">
              <Link
                href="/admin/sponsorships"
                className="flex items-center justify-between p-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-emerald-600" />
                  Child Sponsorship Profiles
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
              <Link
                href="/admin/donations"
                className="flex items-center justify-between p-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  Donations Ledger &amp; CSV Export
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
              <Link
                href="/admin/campaigns"
                className="flex items-center justify-between p-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-purple-600" />
                  Campaigns &amp; Impact Stories
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
              <Link
                href="/admin/operations"
                className="flex items-center justify-between p-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-sky-600" />
                  Outreaches &amp; Volunteer Logs
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
