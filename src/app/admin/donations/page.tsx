'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { AdminService } from '@/lib/supabase/admin-service';
import { Donation, Campaign } from '@/lib/supabase/types';
import { useAdminToast } from '@/components/admin/AdminToast';
import { StatusBadge, ConfirmModal, EmptyState, TableSkeleton } from '@/components/admin/AdminUI';
import {
  DollarSign,
  Search,
  Filter,
  Download,
  Plus,
  Receipt,
  RotateCcw,
  Printer,
  CheckCircle2,
  FileSpreadsheet,
  X,
  Loader2,
  Calendar,
  Building,
  Smartphone,
  CreditCard,
  Banknote,
} from 'lucide-react';

export default function DonationsLedgerPage() {
  const toast = useAdminToast();
  const searchParams = useSearchParams();

  const [donations, setDonations] = useState<Donation[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'online' | 'offline'>('all');
  const [campaignFilter, setCampaignFilter] = useState<string>('all');

  // Log Offline Contribution Modal
  const [isOfflineModalOpen, setIsOfflineModalOpen] = useState(false);
  const [offlineSubmitting, setOfflineSubmitting] = useState(false);
  const [offlineForm, setOfflineForm] = useState({
    donor_name: '',
    donor_email: '',
    amount: 100,
    currency: 'USD',
    campaign_id: '',
    payment_method: 'Direct Bank Wire (EFT)',
    reference_code: '',
    notes: '',
  });

  // Receipt Preview Modal
  const [previewDonation, setPreviewDonation] = useState<Donation | null>(null);
  const [resendingId, setResendingId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [donationsData, campaignsData] = await Promise.all([
        AdminService.getDonations(),
        AdminService.getCampaigns(),
      ]);
      setDonations(donationsData);
      setCampaigns(campaignsData);
      if (campaignsData.length > 0 && !offlineForm.campaign_id) {
        setOfflineForm((prev) => ({ ...prev, campaign_id: campaignsData[0].id }));
      }
    } catch {
      toast.error('Failed to load donation ledger.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Quick Action auto-open from query string
  useEffect(() => {
    if (searchParams.get('action') === 'log_offline') {
      setIsOfflineModalOpen(true);
    }
  }, [searchParams]);

  // Log offline donation submit
  const handleLogOffline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!offlineForm.donor_name || !offlineForm.donor_email || offlineForm.amount <= 0) {
      toast.error('Please fill in donor contact details and amount.');
      return;
    }

    try {
      setOfflineSubmitting(true);
      const selectedCamp = campaigns.find((c) => c.id === offlineForm.campaign_id);

      const created = await AdminService.logOfflineDonation({
        campaign_id: offlineForm.campaign_id || null,
        campaign_title: selectedCamp?.title || 'General Relief Fund',
        donor_id: null,
        donor_name: offlineForm.donor_name,
        donor_email: offlineForm.donor_email,
        amount: Number(offlineForm.amount),
        currency: offlineForm.currency,
        payment_method: offlineForm.payment_method,
        reference_code: offlineForm.reference_code || `REF-${Math.floor(100000 + Math.random() * 900000)}`,
        notes: offlineForm.notes,
      });

      toast.success(`Offline contribution recorded! Receipt #${created.receipt_number} issued.`);
      setIsOfflineModalOpen(false);
      setOfflineForm({
        donor_name: '',
        donor_email: '',
        amount: 100,
        currency: 'USD',
        campaign_id: campaigns[0]?.id || '',
        payment_method: 'Direct Bank Wire (EFT)',
        reference_code: '',
        notes: '',
      });
      await loadData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to record donation.');
    } finally {
      setOfflineSubmitting(false);
    }
  };

  // Resend receipt email
  const handleResendReceipt = async (donationId: string) => {
    try {
      setResendingId(donationId);
      const success = await AdminService.resendReceipt(donationId);
      if (success) {
        toast.success('Email receipt queued and resent successfully.');
        await loadData();
      } else {
        toast.error('Failed to resend receipt.');
      }
    } finally {
      setResendingId(null);
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    if (filteredDonations.length === 0) {
      toast.info('No donations to export with current filters.');
      return;
    }

    const headers = [
      'Transaction ID',
      'Date (UTC)',
      'Donor Name',
      'Donor Email',
      'Amount',
      'Currency',
      'Entry Type',
      'Payment Method',
      'Reference Code',
      'Campaign',
      'Payment Status',
      'Receipt Number',
    ];

    const rows = filteredDonations.map((d) => [
      `"${d.id}"`,
      `"${d.created_at}"`,
      `"${d.donor_name.replace(/"/g, '""')}"`,
      `"${d.donor_email}"`,
      d.amount,
      `"${d.currency}"`,
      `"${d.entry_type}"`,
      `"${d.payment_method.replace(/"/g, '""')}"`,
      `"${d.reference_code || ''}"`,
      `"${(d.campaign_title || 'General').replace(/"/g, '""')}"`,
      `"${d.payment_status}"`,
      `"${d.receipt_number || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GCC_Donations_Ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Donations CSV downloaded successfully.');
  };

  // Filtered ledger list
  const filteredDonations = useMemo(() => {
    return donations.filter((d) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        d.donor_name.toLowerCase().includes(q) ||
        d.donor_email.toLowerCase().includes(q) ||
        (d.reference_code && d.reference_code.toLowerCase().includes(q)) ||
        (d.receipt_number && d.receipt_number.toLowerCase().includes(q)) ||
        (d.campaign_title && d.campaign_title.toLowerCase().includes(q));

      const matchesStatus = statusFilter === 'all' ? true : d.payment_status === statusFilter;
      const matchesType = typeFilter === 'all' ? true : d.entry_type === typeFilter;
      const matchesCampaign = campaignFilter === 'all' ? true : d.campaign_id === campaignFilter;

      return matchesSearch && matchesStatus && matchesType && matchesCampaign;
    });
  }, [donations, searchQuery, statusFilter, typeFilter, campaignFilter]);

  const totalFilteredAmount = useMemo(() => {
    return filteredDonations
      .filter((d) => d.payment_status === 'succeeded')
      .reduce((sum, d) => sum + d.amount, 0);
  }, [filteredDonations]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Donations &amp; Financial Ledger
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Immutable giving ledger with multi-channel tracking (Stripe card, bank wire EFT, MTN &amp; Airtel Mobile Money).
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-xs transition-colors"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsOfflineModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Log Offline Donation</span>
          </button>
        </div>
      </div>

      {/* Summary Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Total Filtered Volume</div>
            <div className="text-xl font-bold text-slate-900 mt-0.5">
              ${totalFilteredAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Matching Transactions</div>
            <div className="text-xl font-bold text-slate-900 mt-0.5">
              {filteredDonations.length} records
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <FileSpreadsheet className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Receipt Dispatch Rate</div>
            <div className="text-xl font-bold text-slate-900 mt-0.5">
              {donations.length > 0
                ? Math.round((donations.filter((d) => d.receipt_status === 'sent').length / donations.length) * 100)
                : 0}
              % verified
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Receipt className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Search & Multifilter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search text */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search donor name, email, transaction reference, receipt #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* Type filter */}
          <div className="flex items-center gap-1.5 w-full md:w-auto">
            <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="online">Online Card/Gateway</option>
              <option value="offline">Offline Bank / Cash / MM</option>
            </select>
          </div>

          {/* Campaign filter */}
          <div className="flex items-center gap-1.5 w-full md:w-auto">
            <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Campaign:</span>
            <select
              value={campaignFilter}
              onChange={(e) => setCampaignFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none max-w-[180px] truncate"
            >
              <option value="all">All Campaigns</option>
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1.5 w-full md:w-auto">
            <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="succeeded">Succeeded</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      {loading ? (
        <TableSkeleton rows={6} cols={6} />
      ) : filteredDonations.length === 0 ? (
        <EmptyState
          icon={DollarSign}
          title="No donations found"
          description="No transactions matched your current search criteria. Try loosening your filter criteria or log an offline donation."
          actionLabel="Log Offline Contribution"
          onAction={() => setIsOfflineModalOpen(true)}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Date &amp; Receipt #</th>
                  <th className="py-3 px-4">Donor Name &amp; Contact</th>
                  <th className="py-3 px-4">Campaign Allocation</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-center">Receipt Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredDonations.map((don) => (
                  <tr key={don.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Date and Receipt */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-900">
                        {new Date(don.created_at).toLocaleDateString()}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {don.receipt_number || don.reference_code || don.id.slice(0, 10)}
                      </div>
                    </td>

                    {/* Donor Details */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{don.donor_name}</div>
                      <div className="text-[11px] text-slate-400">{don.donor_email}</div>
                    </td>

                    {/* Campaign Allocation */}
                    <td className="py-3.5 px-4 max-w-[200px] truncate">
                      <span className="text-slate-700">{don.campaign_title || 'General Relief Fund'}</span>
                      {don.notes && (
                        <div className="text-[10px] text-slate-400 italic truncate">{don.notes}</div>
                      )}
                    </td>

                    {/* Payment Method & Type */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <StatusBadge status={don.entry_type} label={don.entry_type} />
                        <span className="text-slate-600 text-[11px]">{don.payment_method}</span>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <span className="font-bold text-slate-900 text-sm">
                        ${don.amount.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-slate-400 ml-1">{don.currency}</span>
                    </td>

                    {/* Receipt Status */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <StatusBadge status={don.receipt_status} />
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => setPreviewDonation(don)}
                          title="View Official Receipt"
                          className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <Receipt className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleResendReceipt(don.id)}
                          disabled={resendingId === don.id}
                          title="Resend Email Receipt"
                          className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {resendingId === don.id ? (
                            <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                          ) : (
                            <RotateCcw className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* MODAL: LOG OFFLINE CONTRIBUTION */}
      {/* ---------------------------------------------------------------------- */}
      {isOfflineModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-600" />
                Log Offline / Manual Contribution
              </h3>
              <button onClick={() => setIsOfflineModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleLogOffline} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700">Donor Name *</label>
                  <input
                    type="text"
                    required
                    value={offlineForm.donor_name}
                    onChange={(e) => setOfflineForm({ ...offlineForm, donor_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none"
                    placeholder="e.g. Dr. Arthur Mukasa"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700">Donor Email *</label>
                  <input
                    type="email"
                    required
                    value={offlineForm.donor_email}
                    onChange={(e) => setOfflineForm({ ...offlineForm, donor_email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none"
                    placeholder="e.g. arthur@hospital.ug"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700">Amount &amp; Currency *</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      required
                      min="1"
                      step="any"
                      value={offlineForm.amount}
                      onChange={(e) => setOfflineForm({ ...offlineForm, amount: parseFloat(e.target.value) || 0 })}
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none font-bold"
                    />
                    <select
                      value={offlineForm.currency}
                      onChange={(e) => setOfflineForm({ ...offlineForm, currency: e.target.value })}
                      className="w-24 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="UGX">UGX (USh)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700">Payment Channel *</label>
                  <select
                    value={offlineForm.payment_method}
                    onChange={(e) => setOfflineForm({ ...offlineForm, payment_method: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none"
                  >
                    <option value="Direct Bank Wire (EFT)">Direct Bank Wire (EFT)</option>
                    <option value="MTN Mobile Money Receipt (Manual)">MTN Mobile Money Receipt</option>
                    <option value="Airtel Money Receipt (Manual)">Airtel Money Receipt</option>
                    <option value="Offline Cash Receipt">Offline Cash Receipt</option>
                    <option value="Physical Cheque / Draft">Physical Cheque</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Allocate to Campaign</label>
                <select
                  value={offlineForm.campaign_id}
                  onChange={(e) => setOfflineForm({ ...offlineForm, campaign_id: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none"
                >
                  <option value="">General Relief Fund</option>
                  {campaigns.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Bank / Slip Reference Code</label>
                <input
                  type="text"
                  value={offlineForm.reference_code}
                  onChange={(e) => setOfflineForm({ ...offlineForm, reference_code: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none"
                  placeholder="e.g. STANBIC-SLIP-991204"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Audit Notes</label>
                <textarea
                  rows={2}
                  value={offlineForm.notes}
                  onChange={(e) => setOfflineForm({ ...offlineForm, notes: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none"
                  placeholder="e.g. Direct cash handed to accountant during field outreach."
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200/80 text-[11px] text-emerald-800 leading-relaxed">
                <CheckCircle2 className="w-3.5 h-3.5 inline mr-1 text-emerald-600" />
                This entry will automatically credit the campaign's raised amount and dispatch a tax-deductible email receipt to the donor.
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsOfflineModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={offlineSubmitting}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs disabled:opacity-50"
                >
                  {offlineSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Confirm &amp; Issue Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* MODAL: OFFICIAL RECEIPT PREVIEW */}
      {/* ---------------------------------------------------------------------- */}
      {previewDonation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Official Donation Receipt</span>
              <button onClick={() => setPreviewDonation(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Receipt Card */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 font-mono text-xs text-slate-700">
              <div className="text-center pb-2 border-b border-dashed border-slate-300">
                <div className="font-bold text-slate-900 text-sm">GCC FOUNDATION UGANDA</div>
                <div className="text-[10px] text-slate-500">Reg: NGO-REG/UG/2022/8941 • TIN: 99482104-E</div>
              </div>

              <div className="flex justify-between">
                <span>Receipt Number:</span>
                <span className="font-bold text-slate-900">{previewDonation.receipt_number || 'GCC-PENDING'}</span>
              </div>
              <div className="flex justify-between">
                <span>Issue Date:</span>
                <span>{new Date(previewDonation.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Donor Name:</span>
                <span className="font-semibold text-slate-900">{previewDonation.donor_name}</span>
              </div>
              <div className="flex justify-between">
                <span>Donor Email:</span>
                <span>{previewDonation.donor_email}</span>
              </div>
              <div className="flex justify-between">
                <span>Allocation:</span>
                <span className="truncate max-w-[180px]">{previewDonation.campaign_title || 'General Fund'}</span>
              </div>
              <div className="flex justify-between">
                <span>Channel:</span>
                <span>{previewDonation.payment_method}</span>
              </div>
              <div className="flex justify-between border-t border-dashed border-slate-300 pt-2 text-sm font-bold text-slate-900">
                <span>Contribution Total:</span>
                <span>${previewDonation.amount.toFixed(2)} USD</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Document</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleResendReceipt(previewDonation.id);
                  setPreviewDonation(null);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Resend to Donor Email</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
