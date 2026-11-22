'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { AdminService } from '@/lib/supabase/admin-service';
import { Campaign, CampaignUpdate, UserFundraiser } from '@/lib/supabase/types';
import { useAdminToast } from '@/components/admin/AdminToast';
import { StatusBadge, ConfirmModal, EmptyState, TableSkeleton } from '@/components/admin/AdminUI';
import {
  Megaphone,
  Plus,
  Edit2,
  CheckCircle2,
  XCircle,
  Star,
  Sparkles,
  Upload,
  Calendar,
  Layers,
  Search,
  ExternalLink,
  ChevronRight,
  Loader2,
  X,
  FileText,
} from 'lucide-react';

export default function CampaignsAdminPage() {
  const toast = useAdminToast();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<'ngo_campaigns' | 'p2p_queue' | 'milestones'>('ngo_campaigns');

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [fundraisers, setFundraisers] = useState<UserFundraiser[]>([]);
  const [loading, setLoading] = useState(true);

  // Campaign Create/Edit Modal
  const [isCampModalOpen, setIsCampModalOpen] = useState(false);
  const [editingCamp, setEditingCamp] = useState<Campaign | null>(null);
  const [campSubmitting, setCampSubmitting] = useState(false);
  const [campForm, setCampForm] = useState({
    title: '',
    slug: '',
    category: 'Healthcare & Medical',
    story: '',
    goal_amount: 25000,
    currency: 'USD',
    banner_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1200&q=80',
    status: 'active' as Campaign['status'],
    is_featured: false,
  });
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string>('');

  // Post Milestone Update Modal
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [milestoneSubmitting, setMilestoneSubmitting] = useState(false);
  const [milestoneForm, setMilestoneForm] = useState({
    campaign_id: '',
    title: '',
    content: '',
    milestone_type: 'Project Milestone',
    author_name: 'Foundation Field Staff',
    image_url: '',
  });

  // P2P Moderation Decision Modal
  const [selectedFundraiser, setSelectedFundraiser] = useState<UserFundraiser | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [p2pSubmitting, setP2pSubmitting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [campData, p2pData] = await Promise.all([
        AdminService.getCampaigns(),
        AdminService.getUserFundraisers(),
      ]);
      setCampaigns(campData);
      setFundraisers(p2pData);
      if (campData.length > 0 && !milestoneForm.campaign_id) {
        setMilestoneForm((prev) => ({ ...prev, campaign_id: campData[0].id }));
      }
    } catch {
      toast.error('Failed to load campaigns data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Quick Action auto-trigger
  useEffect(() => {
    if (searchParams.get('action') === 'new_update') {
      setIsMilestoneModalOpen(true);
    }
  }, [searchParams]);

  const openCreateCampModal = () => {
    setEditingCamp(null);
    setCampForm({
      title: '',
      slug: '',
      category: 'Healthcare & Medical',
      story: '',
      goal_amount: 25000,
      currency: 'USD',
      banner_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1200&q=80',
      status: 'active',
      is_featured: false,
    });
    setBannerFile(null);
    setBannerPreview('');
    setIsCampModalOpen(true);
  };

  const openEditCampModal = (c: Campaign) => {
    setEditingCamp(c);
    setCampForm({
      title: c.title,
      slug: c.slug,
      category: c.category,
      story: c.story,
      goal_amount: c.goal_amount,
      currency: c.currency,
      banner_url: c.banner_url,
      status: c.status,
      is_featured: c.is_featured,
    });
    setBannerFile(null);
    setBannerPreview(c.banner_url);
    setIsCampModalOpen(true);
  };

  const handleCampSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campForm.title.trim() || !campForm.story.trim()) {
      toast.error('Please fill in title and narrative.');
      return;
    }

    try {
      setCampSubmitting(true);
      let bannerUrl = campForm.banner_url;

      if (bannerFile) {
        toast.info('Uploading banner to Supabase Storage campaign-banners bucket...');
        bannerUrl = await AdminService.uploadStorageFile('campaign-banners', bannerFile, 'banners/');
      }

      const generatedSlug = campForm.slug || campForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      const payload = {
        ...campForm,
        slug: generatedSlug,
        banner_url: bannerUrl,
      };

      if (editingCamp) {
        await AdminService.updateCampaign(editingCamp.id, payload);
        toast.success(`Campaign "${payload.title}" updated.`);
      } else {
        await AdminService.createCampaign(payload);
        toast.success(`New campaign "${payload.title}" published!`);
      }

      setIsCampModalOpen(false);
      await loadData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save campaign.');
    } finally {
      setCampSubmitting(false);
    }
  };

  const handleMilestoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!milestoneForm.title || !milestoneForm.content) {
      toast.error('Provide update title and content.');
      return;
    }

    try {
      setMilestoneSubmitting(true);
      await AdminService.postCampaignUpdate({
        campaign_id: milestoneForm.campaign_id,
        title: milestoneForm.title,
        content: milestoneForm.content,
        milestone_type: milestoneForm.milestone_type,
        author_name: milestoneForm.author_name,
        image_url: milestoneForm.image_url || null,
      });

      toast.success('Milestone published to supporter impact feed!');
      setIsMilestoneModalOpen(false);
      setMilestoneForm({
        campaign_id: campaigns[0]?.id || '',
        title: '',
        content: '',
        milestone_type: 'Project Milestone',
        author_name: 'Foundation Field Staff',
        image_url: '',
      });
    } catch (err: any) {
      toast.error(err.message || 'Failed to post update.');
    } finally {
      setMilestoneSubmitting(false);
    }
  };

  const handleP2PDecision = async (status: 'approved' | 'rejected') => {
    if (!selectedFundraiser) return;
    try {
      setP2pSubmitting(true);
      await AdminService.moderateUserFundraiser(selectedFundraiser.id, {
        status,
        rejectionReason: status === 'rejected' ? rejectionReason : undefined,
      });
      toast.success(
        status === 'approved'
          ? `Fundraiser "${selectedFundraiser.title}" approved and live!`
          : `Fundraiser rejected.`
      );
      setSelectedFundraiser(null);
      setRejectionReason('');
      await loadData();
    } catch (err: any) {
      toast.error(err.message || 'Decision failed.');
    } finally {
      setP2pSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Campaigns, P2P &amp; Content Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Publish foundation campaigns, post live field milestone updates, and review peer-to-peer fundraisers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMilestoneModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Post Field Milestone</span>
          </button>

          <button
            onClick={openCreateCampModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New NGO Campaign</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex rounded-2xl bg-white border border-slate-200/80 p-1 shadow-xs max-w-fit">
        <button
          onClick={() => setActiveTab('ngo_campaigns')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'ngo_campaigns' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>Foundation Campaigns ({campaigns.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('p2p_queue')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'p2p_queue' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>P2P Fundraiser Queue</span>
          {fundraisers.filter((f) => f.status === 'pending_review').length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-purple-600 text-white font-bold">
              {fundraisers.filter((f) => f.status === 'pending_review').length}
            </span>
          )}
        </button>
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* TAB 1: FOUNDATION CAMPAIGNS */}
      {/* ---------------------------------------------------------------------- */}
      {activeTab === 'ngo_campaigns' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading ? (
            <TableSkeleton rows={3} cols={3} />
          ) : campaigns.length === 0 ? (
            <EmptyState
              icon={Megaphone}
              title="No campaigns published"
              description="Create a medical, water, or education campaign to begin collecting donations."
              actionLabel="Create Campaign"
              onAction={openCreateCampModal}
            />
          ) : (
            campaigns.map((camp) => {
              const progressPct = Math.min(100, Math.round((camp.raised_amount / camp.goal_amount) * 100));
              return (
                <div
                  key={camp.id}
                  className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
                >
                  <div className="relative h-44 w-full bg-slate-100">
                    {camp.banner_url && (
                      <Image src={camp.banner_url} alt={camp.title} fill className="object-cover" />
                    )}
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <StatusBadge status={camp.status} />
                      {camp.is_featured && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-400 text-amber-950">
                          <Star className="w-3 h-3 fill-current" />
                          Featured
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600">
                        {camp.category}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 line-clamp-1 leading-snug">
                        {camp.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {camp.story}
                      </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-slate-900">
                          ${camp.raised_amount.toLocaleString()}
                        </span>
                        <span className="text-slate-400">
                          of ${camp.goal_amount.toLocaleString()} ({progressPct}%)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-slate-400 font-medium">
                        {camp.donor_count} supporters
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setMilestoneForm((prev) => ({ ...prev, campaign_id: camp.id }));
                            setIsMilestoneModalOpen(true);
                          }}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                        >
                          + Update
                        </button>
                        <button
                          onClick={() => openEditCampModal(camp)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* TAB 2: P2P FUNDRAISER MODERATION QUEUE */}
      {/* ---------------------------------------------------------------------- */}
      {activeTab === 'p2p_queue' && (
        <div className="space-y-4">
          {fundraisers.length === 0 ? (
            <EmptyState
              icon={Layers}
              title="No peer fundraisers submitted"
              description="Supporter campaigns created by donors will appear here for staff review and verification."
            />
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {fundraisers.map((f) => (
                <div
                  key={f.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{f.title}</h4>
                        <StatusBadge status={f.status} />
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Initiator: <span className="text-slate-700 font-semibold">{f.creator_name}</span> ({f.creator_email}) • Goal: ${f.goal_amount.toLocaleString()} USD
                      </div>
                    </div>

                    {f.status === 'pending_review' && (
                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <button
                          onClick={() => {
                            setSelectedFundraiser(f);
                            setRejectionReason('');
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
                        >
                          Review &amp; Approve
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl">
                    {f.story}
                  </p>

                  {f.rejection_reason && (
                    <div className="text-xs text-rose-700 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                      <strong>Rejection Feedback:</strong> {f.rejection_reason}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* MODAL: CREATE / EDIT CAMPAIGN */}
      {/* ---------------------------------------------------------------------- */}
      {isCampModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">
                {editingCamp ? 'Edit NGO Campaign' : 'Create New NGO Campaign'}
              </h3>
              <button onClick={() => setIsCampModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCampSubmit} className="p-6 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Campaign Title *</label>
                <input
                  type="text"
                  required
                  value={campForm.title}
                  onChange={(e) => setCampForm({ ...campForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none"
                  placeholder="e.g. Clean Water Boreholes for Karamoja"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700">Category *</label>
                  <select
                    value={campForm.category}
                    onChange={(e) => setCampForm({ ...campForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none"
                  >
                    <option value="Healthcare & Medical">Healthcare & Medical</option>
                    <option value="Education & Tuition">Education & Tuition</option>
                    <option value="Clean Water & Sanitation">Clean Water & Sanitation</option>
                    <option value="Emergency Relief">Emergency Relief</option>
                    <option value="Community Infrastructure">Community Infrastructure</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700">Goal Amount (USD) *</label>
                  <input
                    type="number"
                    required
                    min="100"
                    step="100"
                    value={campForm.goal_amount}
                    onChange={(e) => setCampForm({ ...campForm, goal_amount: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Story &amp; Direct Need Narrative *</label>
                <textarea
                  rows={4}
                  required
                  value={campForm.story}
                  onChange={(e) => setCampForm({ ...campForm, story: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none"
                  placeholder="Explain the background, target community, cost breakdown, and expected impact..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Banner Photo / Image *</label>
                <div className="flex items-center gap-3">
                  <div className="relative w-20 h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    {bannerPreview || campForm.banner_url ? (
                      <Image
                        src={bannerPreview || campForm.banner_url}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <Upload className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setBannerFile(e.target.files[0]);
                          setBannerPreview(URL.createObjectURL(e.target.files[0]));
                        }
                      }}
                      className="w-full text-xs text-slate-500 file:mr-3 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="url"
                        value={campForm.banner_url}
                        onChange={(e) => {
                          setCampForm({ ...campForm, banner_url: e.target.value });
                          if (!bannerFile) setBannerPreview(e.target.value);
                        }}
                        placeholder="Or paste banner image URL (e.g. https://...)"
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none text-xs"
                      />
                      {(bannerPreview || campForm.banner_url) && (
                        <button
                          type="button"
                          onClick={() => {
                            setBannerFile(null);
                            setBannerPreview('');
                            setCampForm((prev) => ({ ...prev, banner_url: '' }));
                          }}
                          className="px-2.5 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-[11px] font-semibold border border-rose-200 shrink-0 whitespace-nowrap"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={campForm.is_featured}
                    onChange={(e) => setCampForm({ ...campForm, is_featured: e.target.checked })}
                    className="rounded text-emerald-600"
                  />
                  <span className="font-semibold text-slate-700">Feature on Home Page</span>
                </label>

                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-700">Status:</span>
                  <select
                    value={campForm.status}
                    onChange={(e) => setCampForm({ ...campForm, status: e.target.value as any })}
                    className="px-2 py-1 rounded-lg border border-slate-200 bg-slate-50"
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCampModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={campSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs disabled:opacity-50"
                >
                  {campSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingCamp ? 'Save Campaign' : 'Publish Campaign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* MODAL: POST FIELD MILESTONE */}
      {/* ---------------------------------------------------------------------- */}
      {isMilestoneModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Publish Milestone to Supporter Impact Feeds
              </h3>
              <button onClick={() => setIsMilestoneModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleMilestoneSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Select Campaign</label>
                <select
                  value={milestoneForm.campaign_id}
                  onChange={(e) => setMilestoneForm({ ...milestoneForm, campaign_id: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none"
                >
                  {campaigns.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Milestone Title *</label>
                <input
                  type="text"
                  required
                  value={milestoneForm.title}
                  onChange={(e) => setMilestoneForm({ ...milestoneForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none"
                  placeholder="e.g. Solar pump installed and water flowing!"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Milestone Report / Field Story *</label>
                <textarea
                  rows={4}
                  required
                  value={milestoneForm.content}
                  onChange={(e) => setMilestoneForm({ ...milestoneForm, content: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none"
                  placeholder="Share details of the achievement, quotes from community elders, or receipts..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsMilestoneModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={milestoneSubmitting}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs disabled:opacity-50"
                >
                  {milestoneSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Broadcast Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* MODAL: P2P REVIEW DECISION */}
      {/* ---------------------------------------------------------------------- */}
      {selectedFundraiser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Moderate Peer Fundraiser</h3>
              <button onClick={() => setSelectedFundraiser(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="font-bold text-slate-900">{selectedFundraiser.title}</div>
              <div className="text-slate-500">Initiated by {selectedFundraiser.creator_name} ({selectedFundraiser.creator_email})</div>
              <div className="p-3 bg-slate-50 rounded-xl text-slate-700 leading-relaxed">
                {selectedFundraiser.story}
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="font-semibold text-slate-700">Rejection Feedback (if declining)</label>
                <input
                  type="text"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. Please clarify target hospital ward."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleP2PDecision('rejected')}
                disabled={p2pSubmitting}
                className="px-4 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold"
              >
                Reject
              </button>

              <button
                type="button"
                onClick={() => handleP2PDecision('approved')}
                disabled={p2pSubmitting}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
              >
                {p2pSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Approve &amp; Make Live
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
