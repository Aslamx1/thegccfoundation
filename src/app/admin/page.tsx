'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import { useDonation } from '@/context/DonationContext';
import { useCurrency } from '@/context/CurrencyContext';
import {
  CHILDREN_STORAGE_KEY,
  LETTERS_STORAGE_KEY,
  DONORS_STORAGE_KEY,
  NEWS_STORAGE_KEY,
  DEFAULT_CHILDREN,
  DEFAULT_LETTERS,
  DEFAULT_DONORS,
  DEFAULT_NEWS,
  ChildProfile,
  ChildLetter,
  DonorDirectoryEntry,
  NewsMilestoneItem,
} from '@/data/ngo-portal';
import {
  ShieldCheck,
  DollarSign,
  Users,
  FileText,
  HeartHandshake,
  MailCheck,
  Search,
  Plus,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Download,
  Edit3,
  Upload,
  Check,
  X,
} from 'lucide-react';

type AdminTab = 'analytics' | 'donors' | 'content' | 'children' | 'letters';

interface PayoutRow {
  id: string;
  campaignTitle: string;
  institution: string;
  bankAccount: string;
  amountUGX: number;
  status: 'Pending Review' | 'Approved' | 'Settled via EFT';
  date: string;
}

const INITIAL_PAYOUTS: PayoutRow[] = [
  {
    id: 'PAY-2026-401',
    campaignTitle: 'Emergency Open-Heart Surgery for 6-Year-Old Brenda',
    institution: 'Uganda Heart Institute Accounts Treasury',
    bankAccount: 'Stanbic Bank A/C •••• 8841',
    amountUGX: 4450000,
    status: 'Settled via EFT',
    date: '17 Nov 2026',
  },
  {
    id: 'PAY-2026-402',
    campaignTitle: 'Solar-Powered Borehole for 420 Households in Gweri',
    institution: 'Teso Hydro-Drill Engineering Services Ltd',
    bankAccount: 'Centenary Bank A/C •••• 1092',
    amountUGX: 8200000,
    status: 'Pending Review',
    date: '18 Nov 2026',
  },
  {
    id: 'PAY-2026-403',
    campaignTitle: 'Secondary School Tuition for 38 Displaced Girls',
    institution: 'St. Peter’s Secondary School Bursar Account',
    bankAccount: 'DFCU Bank A/C •••• 7741',
    amountUGX: 5400000,
    status: 'Approved',
    date: '18 Nov 2026',
  },
];

export default function AdminDashboardPage() {
  const { campaigns } = useDonation();
  const { formatUGX } = useCurrency();

  const [activeTab, setActiveTab] = useState<AdminTab>('analytics');

  // 1. Analytics & Payouts state
  const [payouts, setPayouts] = useState<PayoutRow[]>(INITIAL_PAYOUTS);
  const [campaignStatuses, setCampaignStatuses] = useState<Record<string, 'active' | 'paused'>>({});
  const [campaignVerified, setCampaignVerified] = useState<Record<string, boolean>>({});

  // 2. Donor & Member Directory state
  const [donors, setDonors] = useState<DonorDirectoryEntry[]>(DEFAULT_DONORS);
  const [donorSearch, setDonorSearch] = useState('');
  const [showAddDonor, setShowAddDonor] = useState(false);
  const [newDonorName, setNewDonorName] = useState('');
  const [newDonorEmail, setNewDonorEmail] = useState('');
  const [newDonorPhone, setNewDonorPhone] = useState('');
  const [newDonorAddress, setNewDonorAddress] = useState('');
  const [newDonorAmount, setNewDonorAmount] = useState('250000');
  const [newDonorPlan, setNewDonorPlan] = useState('One-Time Supporter');

  // 3. Content & Campaign Manager state
  const [newsList, setNewsList] = useState<NewsMilestoneItem[]>(DEFAULT_NEWS);
  const [newsTitle, setNewsTitle] = useState('');
  const [newsCategory, setNewsCategory] = useState('Project Milestone');
  const [newsSummary, setNewsSummary] = useState('');

  // 4. Child Profile CMS state
  const [childrenList, setChildrenList] = useState<ChildProfile[]>(DEFAULT_CHILDREN);
  const [editingChild, setEditingChild] = useState<ChildProfile | null>(null);
  const [showChildForm, setShowChildForm] = useState(false);
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('9');
  const [childGender, setChildGender] = useState<'Girl' | 'Boy'>('Girl');
  const [childDistrict, setChildDistrict] = useState('Kampala, Uganda');
  const [childSchool, setChildSchool] = useState('');
  const [childMonthlyUSD, setChildMonthlyUSD] = useState('35');
  const [childBio, setChildBio] = useState('');
  const [childDream, setChildDream] = useState('');
  const [childPhotoUrl, setChildPhotoUrl] = useState(
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80'
  );
  const [childStatus, setChildStatus] = useState<'available' | 'sponsored'>('available');

  // 5. Letter Moderation Queue state
  const [letters, setLetters] = useState<ChildLetter[]>(DEFAULT_LETTERS);

  // Load persisted data from localStorage
  useEffect(() => {
    try {
      const savedChildren = localStorage.getItem(CHILDREN_STORAGE_KEY);
      if (savedChildren) setChildrenList(JSON.parse(savedChildren));

      const savedLetters = localStorage.getItem(LETTERS_STORAGE_KEY);
      if (savedLetters) setLetters(JSON.parse(savedLetters));

      const savedDonors = localStorage.getItem(DONORS_STORAGE_KEY);
      if (savedDonors) setDonors(JSON.parse(savedDonors));

      const savedNews = localStorage.getItem(NEWS_STORAGE_KEY);
      if (savedNews) setNewsList(JSON.parse(savedNews));
    } catch {}
  }, []);

  const totalRaisedUGX = useMemo(
    () => campaigns.reduce((sum, c) => sum + c.raisedUGX, 0),
    [campaigns]
  );

  const filteredDonors = useMemo(() => {
    const q = donorSearch.trim().toLowerCase();
    if (!q) return donors;
    return donors.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.email.toLowerCase().includes(q) ||
        d.address.toLowerCase().includes(q) ||
        d.recurringPlan.toLowerCase().includes(q)
    );
  }, [donors, donorSearch]);

  // Handlers
  const updatePayout = (id: string, status: PayoutRow['status']) => {
    setPayouts((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
  };

  const handleAddDonor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDonorName.trim() || !newDonorEmail.trim()) return;
    const entry: DonorDirectoryEntry = {
      id: `dnr-${Date.now()}`,
      name: newDonorName.trim(),
      email: newDonorEmail.trim(),
      phone: newDonorPhone.trim() || '+256 703 601 200',
      address: newDonorAddress.trim() || 'Kampala, Uganda',
      totalDonatedUGX: Number(newDonorAmount) || 0,
      donationsCount: 1,
      recurringPlan: newDonorPlan,
      joinedDate: 'Nov 2026',
    };
    const next = [entry, ...donors];
    setDonors(next);
    try {
      localStorage.setItem(DONORS_STORAGE_KEY, JSON.stringify(next));
    } catch {}
    setNewDonorName('');
    setNewDonorEmail('');
    setNewDonorPhone('');
    setNewDonorAddress('');
    setShowAddDonor(false);
  };

  const handleExportDonorsCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Address', 'Total Donated (UGX)', 'Plan', 'Joined'];
    const rows = donors.map((d) => [
      `"${d.id}"`,
      `"${d.name}"`,
      `"${d.email}"`,
      `"${d.phone}"`,
      `"${d.address}"`,
      d.totalDonatedUGX,
      `"${d.recurringPlan}"`,
      `"${d.joinedDate}"`,
    ]);
    const csv = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csv));
    link.setAttribute('download', 'gcc_foundation_donor_directory.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePublishNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle.trim() || !newsSummary.trim()) return;
    const item: NewsMilestoneItem = {
      id: `news-${Date.now()}`,
      title: newsTitle.trim(),
      category: newsCategory,
      summary: newsSummary.trim(),
      publishedAt: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      author: 'GCC Staff Admin',
    };
    const next = [item, ...newsList];
    setNewsList(next);
    try {
      localStorage.setItem(NEWS_STORAGE_KEY, JSON.stringify(next));
    } catch {}
    setNewsTitle('');
    setNewsSummary('');
  };

  const openAddChild = () => {
    setEditingChild(null);
    setChildName('');
    setChildAge('9');
    setChildGender('Girl');
    setChildDistrict('Soroti District, Uganda');
    setChildSchool('St. Mary’s Primary · Primary 4');
    setChildMonthlyUSD('35');
    setChildBio('');
    setChildDream('');
    setChildPhotoUrl(
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80'
    );
    setChildStatus('available');
    setShowChildForm(true);
  };

  const openEditChild = (child: ChildProfile) => {
    setEditingChild(child);
    setChildName(child.name);
    setChildAge(String(child.age));
    setChildGender(child.gender);
    setChildDistrict(child.district);
    setChildSchool(child.schoolAndGrade);
    setChildMonthlyUSD(String(child.monthlySponsorshipUSD));
    setChildBio(child.bio);
    setChildDream(child.dream);
    setChildPhotoUrl(child.photoUrl);
    setChildStatus(child.status);
    setShowChildForm(true);
  };

  const handleChildPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setChildPhotoUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveChild = (e: React.FormEvent) => {
    e.preventDefault();
    if (!childName.trim()) return;
    const record: ChildProfile = {
      id: editingChild ? editingChild.id : `child-${Date.now()}`,
      name: childName.trim(),
      age: Number(childAge) || 9,
      gender: childGender,
      district: childDistrict.trim(),
      schoolAndGrade: childSchool.trim(),
      monthlySponsorshipUSD: Number(childMonthlyUSD) || 35,
      bio: childBio.trim(),
      dream: childDream.trim() || 'Wants to complete education and serve the community',
      photoUrl: childPhotoUrl.trim(),
      status: childStatus,
    };

    const next = editingChild
      ? childrenList.map((c) => (c.id === editingChild.id ? record : c))
      : [record, ...childrenList];

    setChildrenList(next);
    try {
      localStorage.setItem(CHILDREN_STORAGE_KEY, JSON.stringify(next));
    } catch {}
    setShowChildForm(false);
    setEditingChild(null);
  };

  const toggleChildStatus = (id: string) => {
    const next = childrenList.map((c) =>
      c.id === id
        ? { ...c, status: (c.status === 'available' ? 'sponsored' : 'available') as 'available' | 'sponsored' }
        : c
    );
    setChildrenList(next);
    try {
      localStorage.setItem(CHILDREN_STORAGE_KEY, JSON.stringify(next));
    } catch {}
  };

  const moderateLetter = (id: string, status: ChildLetter['status']) => {
    const next = letters.map((l) => (l.id === id ? { ...l, status } : l));
    setLetters(next);
    try {
      localStorage.setItem(LETTERS_STORAGE_KEY, JSON.stringify(next));
    } catch {}
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] font-sans text-gray-900">
      <Header />

      {/* NGO Staff Admin Top Banner */}
      <section className="bg-[#121E07] text-white border-b border-[#2F4812] py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#2F4812] border border-[#3D5E16] flex items-center justify-center text-[#AFC68A] shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-heading font-black text-lg sm:text-xl text-white">
                  GCC Foundation Administrative Dashboard
                </h1>
                <span className="bg-[#02A95C] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                  NGO Staff Console
                </span>
              </div>
              <p className="text-xs text-gray-300 mt-0.5">
                Donation & Financial Analytics · Donor Directory · Content & Campaign Manager · Child Profile CMS · Letter Moderation Queue
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/account/impact"
              className="rounded-full border border-white/25 hover:bg-white/10 px-4 py-2 text-xs font-bold text-white transition-colors"
            >
              Switch to Member View
            </Link>
            <Link
              href="/create/fundraiser/category"
              className="rounded-full bg-[#02A95C] hover:bg-[#028F4D] px-4 py-2 text-xs font-bold text-white transition-colors flex items-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>New Campaign</span>
            </Link>
          </div>
        </div>
      </section>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 w-full space-y-8">
        {/* Top KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 sm:p-5 shadow-subtle space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
              Total Funds Raised
            </span>
            <span className="font-heading font-black text-xl sm:text-2xl text-[#1A1A1A] block tabular-nums">
              {formatUGX(totalRaisedUGX)}
            </span>
            <span className="text-[11px] font-semibold text-[#02A95C]">
              100% Direct Institutional Escrow
            </span>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 sm:p-5 shadow-subtle space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
              Supporters & Donors
            </span>
            <span className="font-heading font-black text-xl sm:text-2xl text-[#02A95C] block">
              {donors.length}
            </span>
            <span className="text-[11px] text-gray-500">Active in Donor Directory</span>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 sm:p-5 shadow-subtle space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
              Active Campaigns
            </span>
            <span className="font-heading font-black text-xl sm:text-2xl text-gray-900 block">
              {campaigns.length}
            </span>
            <span className="text-[11px] text-gray-500">{newsList.length} Milestones Published</span>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 sm:p-5 shadow-subtle space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
              Child Profiles (CMS)
            </span>
            <span className="font-heading font-black text-xl sm:text-2xl text-blue-600 block">
              {childrenList.length}
            </span>
            <span className="text-[11px] text-gray-500">
              {childrenList.filter((c) => c.status === 'available').length} Available ·{' '}
              {childrenList.filter((c) => c.status === 'sponsored').length} Sponsored
            </span>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 sm:p-5 shadow-subtle space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
              Letter Moderation
            </span>
            <span className="font-heading font-black text-xl sm:text-2xl text-amber-600 block">
              {letters.filter((l) => l.status === 'pending').length}
            </span>
            <span className="text-[11px] text-gray-500">Awaiting Safety Review</span>
          </div>
        </div>

        {/* 5 NGO Staff Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto border-b border-gray-200 pb-3 scrollbar-none">
          {[
            { id: 'analytics', label: '1. Donation & Financial Analytics', icon: DollarSign },
            { id: 'donors', label: '2. Donor & Member Directory', icon: Users },
            { id: 'content', label: '3. Content & Campaign Manager', icon: FileText },
            { id: 'children', label: '4. Child Profile CMS', icon: HeartHandshake },
            {
              id: 'letters',
              label: `5. Letter Moderation Queue (${letters.filter((l) => l.status === 'pending').length})`,
              icon: MailCheck,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#1A1A1A] text-white shadow-xs'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ================= MODULE 1: DONATION & FINANCIAL ANALYTICS ================= */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {/* Institutional Payout Queue */}
            <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-card space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="font-heading font-extrabold text-lg text-gray-900">
                    Institutional Bank EFT Payout Statuses
                  </h2>
                  <p className="text-xs text-gray-500">
                    Approve and settle direct bank wires to verified hospital treasuries, school bursars, and borehole contractors.
                  </p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-[#02A95C]">
                  Real-Time Settlement Tracking
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-[#FAF9F6] text-gray-500 text-xs uppercase font-bold border-b border-gray-200">
                    <tr>
                      <th className="py-3.5 px-4">Voucher ID & Date</th>
                      <th className="py-3.5 px-4">Campaign</th>
                      <th className="py-3.5 px-4">Receiving Institution</th>
                      <th className="py-3.5 px-4 text-right">Amount</th>
                      <th className="py-3.5 px-4 text-center">Status</th>
                      <th className="py-3.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {payouts.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="py-4 px-4 font-mono text-xs">
                          <strong className="text-gray-900 block">{p.id}</strong>
                          <span className="text-gray-400">{p.date}</span>
                        </td>
                        <td className="py-4 px-4 font-semibold text-gray-900 max-w-xs">
                          {p.campaignTitle}
                        </td>
                        <td className="py-4 px-4 text-xs text-gray-600">
                          <strong className="text-gray-900 block">{p.institution}</strong>
                          <span className="font-mono">{p.bankAccount}</span>
                        </td>
                        <td className="py-4 px-4 text-right font-mono font-bold text-gray-900">
                          {formatUGX(p.amountUGX)}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              p.status === 'Settled via EFT'
                                ? 'bg-emerald-100 text-emerald-800'
                                : p.status === 'Approved'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right space-x-2">
                          {p.status === 'Pending Review' && (
                            <button
                              type="button"
                              onClick={() => updatePayout(p.id, 'Approved')}
                              className="rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 text-xs font-bold"
                            >
                              Approve
                            </button>
                          )}
                          {p.status !== 'Settled via EFT' && (
                            <button
                              type="button"
                              onClick={() => updatePayout(p.id, 'Settled via EFT')}
                              className="rounded-full bg-[#02A95C] hover:bg-[#028F4D] text-white px-3.5 py-1.5 text-xs font-bold"
                            >
                              Settle EFT Wire
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Donation Transactions Across Campaigns */}
            <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-card space-y-4">
              <h2 className="font-heading font-extrabold text-lg text-gray-900">
                Recent Donor Transactions
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-[#FAF9F6] text-gray-500 text-xs uppercase font-bold border-b border-gray-200">
                    <tr>
                      <th className="py-3.5 px-4">Supporter</th>
                      <th className="py-3.5 px-4">Fundraiser Supported</th>
                      <th className="py-3.5 px-4">Method</th>
                      <th className="py-3.5 px-4 text-right">Amount</th>
                      <th className="py-3.5 px-4 text-right">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {campaigns.flatMap((c) =>
                      c.recentDonors.map((d) => (
                        <tr key={`${c.id}-${d.id}`} className="hover:bg-gray-50">
                          <td className="py-3.5 px-4 font-bold text-gray-900">
                            {d.isAnonymous ? 'Anonymous Supporter' : d.name}
                          </td>
                          <td className="py-3.5 px-4 text-gray-600">{c.title}</td>
                          <td className="py-3.5 px-4">
                            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-700">
                              {d.paymentMethod}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono font-bold text-[#02A95C]">
                            {formatUGX(d.amountUGX)}
                          </td>
                          <td className="py-3.5 px-4 text-right text-xs text-gray-400">
                            {d.timestamp}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= MODULE 2: DONOR & MEMBER DIRECTORY ================= */}
        {activeTab === 'donors' && (
          <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-card space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-heading font-extrabold text-xl text-gray-900">
                  Donor & Member Directory
                </h2>
                <p className="text-xs text-gray-500">
                  Searchable database of supporters, tax receipt addresses, recurring plans, and lifetime giving histories.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddDonor((v) => !v)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#02A95C] hover:bg-[#028F4D] px-4 py-2 text-xs font-bold text-white"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>{showAddDonor ? 'Close Form' : 'Add Supporter Record'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleExportDonorsCSV}
                  className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 hover:bg-gray-50 px-4 py-2 text-xs font-bold text-gray-700"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {showAddDonor && (
              <form
                onSubmit={handleAddDonor}
                className="rounded-2xl bg-[#FAF9F6] border border-[#E5E7EB] p-5 grid grid-cols-1 sm:grid-cols-3 gap-4"
              >
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={newDonorName}
                  onChange={(e) => setNewDonorName(e.target.value)}
                  className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-xs"
                />
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  value={newDonorEmail}
                  onChange={(e) => setNewDonorEmail(e.target.value)}
                  className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-xs"
                />
                <input
                  type="text"
                  placeholder="Phone (+256...)"
                  value={newDonorPhone}
                  onChange={(e) => setNewDonorPhone(e.target.value)}
                  className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-xs"
                />
                <input
                  type="text"
                  placeholder="Billing / Tax Address"
                  value={newDonorAddress}
                  onChange={(e) => setNewDonorAddress(e.target.value)}
                  className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-xs"
                />
                <input
                  type="number"
                  placeholder="Lifetime Donated (UGX)"
                  value={newDonorAmount}
                  onChange={(e) => setNewDonorAmount(e.target.value)}
                  className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-xs"
                />
                <div className="flex gap-2">
                  <select
                    value={newDonorPlan}
                    onChange={(e) => setNewDonorPlan(e.target.value)}
                    className="h-10 flex-1 rounded-xl border border-gray-200 bg-white px-3 text-xs"
                  >
                    <option>One-Time Supporter</option>
                    <option>Monthly ($35 / mo)</option>
                    <option>Child Sponsor ($35 / mo)</option>
                    <option>Major Institutional Donor</option>
                  </select>
                  <button
                    type="submit"
                    className="rounded-xl bg-[#02A95C] px-4 text-xs font-bold text-white"
                  >
                    Save
                  </button>
                </div>
              </form>
            )}

            {/* Search Input */}
            <div className="relative max-w-md">
              <Search className="h-4 w-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="search"
                value={donorSearch}
                onChange={(e) => setDonorSearch(e.target.value)}
                placeholder="Search supporters by name, email, city, or plan..."
                className="h-10 w-full rounded-xl border border-gray-200 pl-10 pr-4 text-xs sm:text-sm focus:border-[#02A95C] focus:outline-none"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#FAF9F6] text-gray-500 text-xs uppercase font-bold border-b border-gray-200">
                  <tr>
                    <th className="py-3.5 px-4">Supporter</th>
                    <th className="py-3.5 px-4">Contact & Tax Address</th>
                    <th className="py-3.5 px-4">Giving Plan</th>
                    <th className="py-3.5 px-4 text-right">Lifetime Giving</th>
                    <th className="py-3.5 px-4 text-right">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredDonors.map((d) => (
                    <tr key={d.id} className="hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <strong className="font-bold text-gray-900 block">{d.name}</strong>
                        <span className="text-xs text-gray-500">{d.email}</span>
                      </td>
                      <td className="py-4 px-4 text-xs text-gray-600">
                        <span className="block font-semibold text-gray-800">{d.phone}</span>
                        <span>{d.address}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="rounded-full bg-emerald-50 text-[#02A95C] px-2.5 py-1 text-xs font-bold">
                          {d.recurringPlan}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right font-mono font-bold text-gray-900">
                        {formatUGX(d.totalDonatedUGX)}{' '}
                        <span className="text-xs text-gray-400 font-normal block">
                          ({d.donationsCount} gifts)
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right text-xs text-gray-500">{d.joinedDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= MODULE 3: CONTENT & CAMPAIGN MANAGER ================= */}
        {activeTab === 'content' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Publish News & Project Milestones */}
            <div className="lg:col-span-5 bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-card space-y-5">
              <div>
                <h2 className="font-heading font-extrabold text-lg text-gray-900">
                  Publish News Update or Project Milestone
                </h2>
                <p className="text-xs text-gray-500">
                  Post verified field updates, surgical completions, and borehole milestones.
                </p>
              </div>

              <form onSubmit={handlePublishNews} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Headline / Milestone Title
                  </label>
                  <input
                    type="text"
                    required
                    value={newsTitle}
                    onChange={(e) => setNewsTitle(e.target.value)}
                    placeholder="e.g. Nsambya Neonatal ICU Incubator #2 Installed"
                    className="h-10 w-full rounded-xl border border-gray-200 px-3 text-xs sm:text-sm focus:border-[#02A95C] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                  <select
                    value={newsCategory}
                    onChange={(e) => setNewsCategory(e.target.value)}
                    className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-xs sm:text-sm"
                  >
                    <option>Project Milestone</option>
                    <option>Medical Verification</option>
                    <option>Clean Water Update</option>
                    <option>Education Bursar Settlement</option>
                    <option>Emergency Relief Dispatch</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Update Summary & EFT Reference
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={newsSummary}
                    onChange={(e) => setNewsSummary(e.target.value)}
                    placeholder="Describe the field milestone, hospital receipt reference, or community impact..."
                    className="w-full rounded-xl border border-gray-200 p-3 text-xs sm:text-sm focus:border-[#02A95C] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-full bg-[#02A95C] hover:bg-[#028F4D] py-3 text-xs sm:text-sm font-bold text-white transition-colors"
                >
                  Publish Milestone Update
                </button>
              </form>

              <div className="pt-4 border-t border-gray-100 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Published Updates ({newsList.length})
                </h3>
                {newsList.map((n) => (
                  <div
                    key={n.id}
                    className="rounded-2xl bg-[#FAF9F6] border border-[#E5E7EB] p-3.5 space-y-1"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-[#02A95C]">{n.category}</span>
                      <span className="text-gray-400">{n.publishedAt}</span>
                    </div>
                    <h4 className="font-bold text-xs sm:text-sm text-gray-900">{n.title}</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">{n.summary}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Active Campaign Manager */}
            <div className="lg:col-span-7 bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-card space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-heading font-extrabold text-lg text-gray-900">
                    Active Fundraising Campaigns ({campaigns.length})
                  </h2>
                  <p className="text-xs text-gray-500">
                    Manage verification badges, campaign visibility, and institutional payout status.
                  </p>
                </div>
                <Link
                  href="/create/fundraiser/category"
                  className="rounded-full bg-[#02A95C] px-4 py-2 text-xs font-bold text-white hover:bg-[#028F4D]"
                >
                  + Launch Campaign
                </Link>
              </div>

              <div className="space-y-3">
                {campaigns.map((c) => {
                  const status = campaignStatuses[c.id] || 'active';
                  const verified = campaignVerified[c.id] ?? true;
                  return (
                    <div
                      key={c.id}
                      className="rounded-2xl border border-gray-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-[#02A95C] bg-emerald-50 px-2.5 py-0.5 rounded-full">
                            {c.category}
                          </span>
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                              status === 'active'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {status}
                          </span>
                          {verified && (
                            <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                              Verified Badge
                            </span>
                          )}
                        </div>
                        <Link
                          href={`/campaign/${c.id}`}
                          className="font-heading font-bold text-sm text-gray-900 hover:text-[#02A95C] flex items-center gap-1"
                        >
                          <span>{c.title}</span>
                          <ExternalLink className="h-3.5 w-3.5 text-gray-400" />
                        </Link>
                        <p className="text-xs text-gray-500 font-mono">
                          {formatUGX(c.raisedUGX)} raised of {formatUGX(c.goalUGX)} ·{' '}
                          {c.payoutVerification.institutionName}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            setCampaignVerified((prev) => ({ ...prev, [c.id]: !verified }))
                          }
                          className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50"
                        >
                          {verified ? 'Revoke Badge' : 'Verify Badge'}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setCampaignStatuses((prev) => ({
                              ...prev,
                              [c.id]: status === 'active' ? 'paused' : 'active',
                            }))
                          }
                          className="rounded-full bg-gray-100 hover:bg-gray-200 px-3 py-1.5 text-xs font-bold text-gray-800"
                        >
                          {status === 'active' ? 'Pause' : 'Activate'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ================= MODULE 4: CHILD PROFILE CMS ================= */}
        {activeTab === 'children' && (
          <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-card space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-heading font-extrabold text-xl text-gray-900">
                  Child Profile CMS (Sponsorship Directory Manager)
                </h2>
                <p className="text-xs text-gray-500">
                  Add or edit sponsored child profiles, upload photos, and manage sponsorship status (‘available’ or ‘sponsored’). Changes sync immediately with the Member Dashboard.
                </p>
              </div>
              <button
                type="button"
                onClick={openAddChild}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#02A95C] hover:bg-[#028F4D] px-5 py-2.5 text-xs font-bold text-white shrink-0"
              >
                <Plus className="h-4 w-4" />
                <span>Add Child Profile</span>
              </button>
            </div>

            {showChildForm && (
              <form
                onSubmit={handleSaveChild}
                className="rounded-2xl bg-[#FAF9F6] border border-[#E5E7EB] p-6 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-bold text-base text-gray-900">
                    {editingChild ? `Edit Profile: ${editingChild.name}` : 'Add New Child Profile'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowChildForm(false)}
                    className="text-xs font-bold text-gray-500 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Child’s Full Name</label>
                    <input
                      type="text"
                      required
                      value={childName}
                      onChange={(e) => setChildName(e.target.value)}
                      placeholder="e.g. Grace Nakato"
                      className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Age</label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="19"
                      value={childAge}
                      onChange={(e) => setChildAge(e.target.value)}
                      className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Gender</label>
                    <select
                      value={childGender}
                      onChange={(e) => setChildGender(e.target.value as 'Girl' | 'Boy')}
                      className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-xs"
                    >
                      <option value="Girl">Girl</option>
                      <option value="Boy">Boy</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">District / Location</label>
                    <input
                      type="text"
                      required
                      value={childDistrict}
                      onChange={(e) => setChildDistrict(e.target.value)}
                      placeholder="Soroti District, Uganda"
                      className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">School & Grade Level</label>
                    <input
                      type="text"
                      required
                      value={childSchool}
                      onChange={(e) => setChildSchool(e.target.value)}
                      placeholder="St. Mary’s Primary · Primary 4"
                      className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Sponsorship Status
                    </label>
                    <select
                      value={childStatus}
                      onChange={(e) =>
                        setChildStatus(e.target.value as 'available' | 'sponsored')
                      }
                      className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-xs font-bold"
                    >
                      <option value="available">Available</option>
                      <option value="sponsored">Sponsored</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Child’s Dream / Aspiration
                    </label>
                    <input
                      type="text"
                      value={childDream}
                      onChange={(e) => setChildDream(e.target.value)}
                      placeholder="Wants to become a pediatric doctor"
                      className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Photo (Upload File or Paste URL)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={childPhotoUrl}
                        onChange={(e) => setChildPhotoUrl(e.target.value)}
                        className="h-10 flex-1 rounded-xl border border-gray-200 bg-white px-3 text-xs"
                      />
                      <label className="cursor-pointer inline-flex items-center gap-1 rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50">
                        <Upload className="h-3.5 w-3.5" />
                        <span>Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleChildPhotoUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Background Story & Sponsorship Needs
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={childBio}
                    onChange={(e) => setChildBio(e.target.value)}
                    placeholder="Describe the child’s story, school needs, and how monthly sponsorship supports them..."
                    className="w-full rounded-xl border border-gray-200 bg-white p-3 text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="rounded-full bg-[#02A95C] hover:bg-[#028F4D] px-6 py-2.5 text-xs font-bold text-white"
                >
                  {editingChild ? 'Save Changes to Child Profile' : 'Publish Child Profile'}
                </button>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {childrenList.map((child) => (
                <div
                  key={child.id}
                  className="rounded-2xl border border-gray-200 p-4 flex flex-col sm:flex-row gap-4 items-start justify-between"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={child.photoUrl}
                      alt={child.name}
                      className="h-20 w-20 rounded-2xl object-cover shrink-0 bg-gray-100"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-heading font-bold text-base text-gray-900">
                          {child.name} ({child.age} yrs)
                        </h3>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            child.status === 'available'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {child.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {child.district} · {child.schoolAndGrade}
                      </p>
                      <p className="text-xs text-gray-600 line-clamp-2">{child.bio}</p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => openEditChild(child)}
                      className="inline-flex items-center justify-center gap-1 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50"
                    >
                      <Edit3 className="h-3 w-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleChildStatus(child.id)}
                      className="rounded-full bg-[#FAF9F6] border border-gray-200 px-3 py-1.5 text-xs font-bold text-[#02A95C] hover:bg-emerald-50"
                    >
                      Mark {child.status === 'available' ? 'Sponsored' : 'Available'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= MODULE 5: LETTER MODERATION QUEUE ================= */}
        {activeTab === 'letters' && (
          <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-card space-y-6">
            <div>
              <h2 className="font-heading font-extrabold text-xl text-gray-900">
                Donor-to-Child Letter Moderation Queue
              </h2>
              <p className="text-xs text-gray-500">
                Review all supporter-to-child messages before field delivery to ensure child safety, dignity, and privacy compliance.
              </p>
            </div>

            <div className="space-y-4">
              {letters.map((letter) => (
                <div
                  key={letter.id}
                  className="rounded-2xl border border-gray-200 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                          letter.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : letter.status === 'flagged'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {letter.status === 'pending'
                          ? 'Pending Safety Review'
                          : letter.status === 'approved'
                          ? 'Approved & Queued for Field Delivery'
                          : 'Flagged / Held'}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="font-semibold text-gray-800">
                        From: {letter.donorName} ({letter.donorEmail})
                      </span>
                      <span className="text-gray-400">→</span>
                      <span className="font-bold text-[#02A95C]">To Child: {letter.childName}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-400">{letter.createdAt}</span>
                    </div>

                    <p className="text-sm text-gray-800 bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl p-3.5 italic">
                      “{letter.message}”
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    {letter.status !== 'approved' && (
                      <button
                        type="button"
                        onClick={() => moderateLetter(letter.id, 'approved')}
                        className="inline-flex items-center gap-1 rounded-full bg-[#02A95C] hover:bg-[#028F4D] px-4 py-2 text-xs font-bold text-white"
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span>Approve for Delivery</span>
                      </button>
                    )}
                    {letter.status !== 'flagged' && (
                      <button
                        type="button"
                        onClick={() => moderateLetter(letter.id, 'flagged')}
                        className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 hover:bg-red-100 px-4 py-2 text-xs font-bold text-red-700"
                      >
                        <X className="h-3.5 w-3.5" />
                        <span>Hold / Flag</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
