'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { AdminService } from '@/lib/supabase/admin-service';
import { SponsoredChild, Sponsorship } from '@/lib/supabase/types';
import { useAdminToast } from '@/components/admin/AdminToast';
import {
  StatusBadge,
  ConfirmModal,
  EmptyState,
  TableSkeleton,
} from '@/components/admin/AdminUI';
import {
  HeartHandshake,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Link as LinkIcon,
  Unlink,
  Upload,
  UserCheck,
  CheckCircle,
  MapPin,
  GraduationCap,
  Sparkles,
  X,
  Loader2,
  Calendar,
} from 'lucide-react';

export default function ChildSponsorshipCMS() {
  const toast = useAdminToast();
  const searchParams = useSearchParams();

  const [childrenList, setChildrenList] = useState<SponsoredChild[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'sponsored'>('all');

  // Form Modal (Create or Edit)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingChild, setEditingChild] = useState<SponsoredChild | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    age: 8,
    gender: 'Girl' as 'Girl' | 'Boy',
    location: '',
    region: 'Uganda',
    school_and_grade: '',
    bio: '',
    aspirations: '',
    monthly_amount: 35.0,
    currency: 'USD',
    portrait_url: '',
    status: 'available' as 'available' | 'sponsored',
    category: 'Education' as 'Medical' | 'Education' | 'Emergency' | 'Community',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  // Link Sponsor Modal
  const [linkModalChild, setLinkModalChild] = useState<SponsoredChild | null>(null);
  const [linkForm, setLinkForm] = useState({ sponsor_name: '', sponsor_email: '', monthly_amount: 35 });
  const [linkSubmitting, setLinkSubmitting] = useState(false);

  // Delete Confirmation Modal
  const [deleteChildTarget, setDeleteChildTarget] = useState<SponsoredChild | null>(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  // Unlink Confirmation Modal
  const [unlinkChildTarget, setUnlinkChildTarget] = useState<SponsoredChild | null>(null);
  const [unlinkSubmitting, setUnlinkSubmitting] = useState(false);

  const loadChildren = async () => {
    try {
      setLoading(true);
      const data = await AdminService.getChildren();
      setChildrenList(data);
    } catch (err) {
      toast.error('Failed to load sponsored children directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChildren();
  }, []);

  // Check query parameter to auto-open create modal if navigated from quick actions
  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      openCreateModal();
    }
  }, [searchParams]);

  const openCreateModal = () => {
    setEditingChild(null);
    setFormData({
      first_name: '',
      last_name: '',
      age: 8,
      gender: 'Girl',
      location: 'Katwe, Kampala',
      region: 'Central Uganda',
      school_and_grade: 'Hope Junior Academy, Primary 2',
      bio: '',
      aspirations: '',
      monthly_amount: 35.0,
      currency: 'USD',
      portrait_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=700&q=80',
      status: 'available',
      category: 'Education',
    });
    setImageFile(null);
    setImagePreview('');
    setIsFormOpen(true);
  };

  const openEditModal = (child: SponsoredChild) => {
    setEditingChild(child);
    setFormData({
      first_name: child.first_name,
      last_name: child.last_name || '',
      age: child.age,
      gender: child.gender,
      location: child.location,
      region: child.region,
      school_and_grade: child.school_and_grade,
      bio: child.bio,
      aspirations: child.aspirations,
      monthly_amount: child.monthly_amount,
      currency: child.currency,
      portrait_url: child.portrait_url,
      status: child.status as 'available' | 'sponsored',
      category: ((child.category as any) || 'Education') as 'Medical' | 'Education' | 'Emergency' | 'Community',
    });
    setImageFile(null);
    setImagePreview(child.portrait_url);
    setIsFormOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.first_name.trim() || !formData.bio.trim() || !formData.aspirations.trim()) {
      toast.error('Please complete all required fields.');
      return;
    }

    try {
      setFormSubmitting(true);
      let finalImageUrl = formData.portrait_url;

      if (imageFile) {
        toast.info('Uploading portrait to Supabase Storage bucket...');
        finalImageUrl = await AdminService.uploadStorageFile('child-portraits', imageFile, 'portraits/');
      }

      const payload = {
        ...formData,
        portrait_url: finalImageUrl,
      };

      if (editingChild) {
        await AdminService.updateChild(editingChild.id, payload);
        toast.success(`Child profile for ${payload.first_name} updated successfully.`);
      } else {
        await AdminService.createChild(payload);
        toast.success(`New child profile for ${payload.first_name} added.`);
      }

      setIsFormOpen(false);
      await loadChildren();
    } catch (err: any) {
      toast.error(err.message || 'Operation failed.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteChild = async () => {
    if (!deleteChildTarget) return;
    try {
      setDeleteSubmitting(true);
      await AdminService.deleteChild(deleteChildTarget.id);
      toast.success(`Child profile ${deleteChildTarget.first_name} removed.`);
      setDeleteChildTarget(null);
      await loadChildren();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete profile.');
    } finally {
      setDeleteSubmitting(false);
    }
  };

  const handleLinkSponsor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkModalChild) return;
    if (!linkForm.sponsor_name || !linkForm.sponsor_email) {
      toast.error('Provide a valid donor name and email.');
      return;
    }

    try {
      setLinkSubmitting(true);
      await AdminService.linkSponsorship(linkModalChild.id, {
        name: linkForm.sponsor_name,
        email: linkForm.sponsor_email,
        monthlyAmount: linkForm.monthly_amount,
      });
      toast.success(`Child ${linkModalChild.first_name} linked to sponsor ${linkForm.sponsor_name}.`);
      setLinkModalChild(null);
      await loadChildren();
    } catch (err: any) {
      toast.error(err.message || 'Failed to link sponsorship.');
    } finally {
      setLinkSubmitting(false);
    }
  };

  const handleUnlinkSponsorship = async () => {
    if (!unlinkChildTarget) return;
    try {
      setUnlinkSubmitting(true);
      await AdminService.unlinkSponsorship(unlinkChildTarget.id);
      toast.success(`Sponsorship unlinked for ${unlinkChildTarget.first_name}. Status changed to Available.`);
      setUnlinkChildTarget(null);
      await loadChildren();
    } catch (err: any) {
      toast.error(err.message || 'Failed to unlink sponsorship.');
    } finally {
      setUnlinkSubmitting(false);
    }
  };

  // Filtered Children
  const filteredChildren = useMemo(() => {
    return childrenList.filter((c) => {
      const matchesSearch =
        c.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.last_name && c.last_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        c.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.school_and_grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.active_sponsorship?.sponsor_name &&
          c.active_sponsorship.sponsor_name.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus =
        statusFilter === 'all' ? true : c.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [childrenList, searchTerm, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Child Sponsorship CMS
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Maintain verified child profiles, manage active donor-to-child links, and publish directly to public fundraisers.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs sm:text-sm shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Child Profile</span>
        </button>
      </div>

      {/* Live Sync Information Banner */}
      <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 flex items-start gap-3 text-xs text-emerald-900">
        <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold flex items-center gap-2">
            <span>Public Site Sync Active</span>
            <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full">Medical • Education • Emergency • Community</span>
          </div>
          <p className="text-emerald-800 leading-relaxed text-[11px]">
            Profiles and photos added or edited here are automatically displayed on the <strong>Home Page</strong> (&quot;Discover fundraisers inspired by what you care about&quot;), the <strong>Donate Page</strong>, and category filters.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by child, school, region, or sponsor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <div className="flex rounded-xl bg-slate-100 p-1 w-full sm:w-auto">
            <button
              onClick={() => setStatusFilter('all')}
              className={`flex-1 sm:flex-none px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({childrenList.length})
            </button>
            <button
              onClick={() => setStatusFilter('available')}
              className={`flex-1 sm:flex-none px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'available'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Available ({childrenList.filter((c) => c.status === 'available').length})
            </button>
            <button
              onClick={() => setStatusFilter('sponsored')}
              className={`flex-1 sm:flex-none px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'sponsored'
                  ? 'bg-white text-sky-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sponsored ({childrenList.filter((c) => c.status === 'sponsored').length})
            </button>
          </div>
        </div>
      </div>

      {/* Directory Table / Grid */}
      {loading ? (
        <TableSkeleton rows={6} cols={6} />
      ) : filteredChildren.length === 0 ? (
        <EmptyState
          icon={HeartHandshake}
          title="No child profiles found"
          description="Try adjusting your search terms or filters, or add a new verified child to begin matching."
          actionLabel="Add Child Profile"
          onAction={openCreateModal}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Child Profile</th>
                  <th className="py-3 px-4">Location &amp; School</th>
                  <th className="py-3 px-4">Pledge / Month</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Active Sponsor Link</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredChildren.map((child) => {
                  const hasSponsor = child.status === 'sponsored' && child.active_sponsorship;
                  return (
                    <tr key={child.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Child Profile */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                            {child.portrait_url ? (
                              <Image
                                src={child.portrait_url}
                                alt={child.first_name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400">
                                {child.first_name[0]}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-sm">
                              {child.first_name} {child.last_name || ''}
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                              <span>{child.age} yrs • {child.gender}</span>
                              <span className="font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 text-[10px]">
                                {child.category || 'Education'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Location & School */}
                      <td className="py-3.5 px-4 max-w-[200px]">
                        <div className="text-slate-800 flex items-center gap-1 truncate">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{child.location}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 truncate mt-0.5">
                          <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{child.school_and_grade}</span>
                        </div>
                      </td>

                      {/* Pledge Amount */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900">
                          ${child.monthly_amount.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-slate-400"> / mo</span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <StatusBadge status={child.status} />
                      </td>

                      {/* Active Sponsor Link */}
                      <td className="py-3.5 px-4 max-w-[220px]">
                        {hasSponsor ? (
                          <div className="p-2 rounded-xl bg-sky-50/70 border border-sky-100 text-[11px]">
                            <div className="font-semibold text-sky-950 flex items-center gap-1.5 truncate">
                              <UserCheck className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                              <span className="truncate">{child.active_sponsorship?.sponsor_name}</span>
                            </div>
                            <div className="text-sky-600 truncate">{child.active_sponsorship?.sponsor_email}</div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">Awaiting Sponsor</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          {hasSponsor ? (
                            <button
                              onClick={() => setUnlinkChildTarget(child)}
                              title="Unlink Sponsor"
                              className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            >
                              <Unlink className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setLinkModalChild(child);
                                setLinkForm({
                                  sponsor_name: '',
                                  sponsor_email: '',
                                  monthly_amount: child.monthly_amount,
                                });
                              }}
                              title="Link Sponsor to Child"
                              className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            >
                              <LinkIcon className="w-4 h-4" />
                            </button>
                          )}

                          <button
                            onClick={() => openEditModal(child)}
                            title="Edit Profile"
                            className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setDeleteChildTarget(child)}
                            title="Delete Child Profile"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE / EDIT CHILD MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingChild ? `Edit Profile: ${editingChild.first_name}` : 'Create New Child Profile'}
                </h3>
                <p className="text-xs text-slate-500">
                  Images upload securely to the child-portraits bucket in Supabase Storage.
                </p>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-5">
              {/* Category Selector for Live Display */}
              <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800">Target Category on Public Site *</label>
                  <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Live Sync
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Medical', 'Education', 'Emergency', 'Community'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: cat })}
                      className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition-all text-center flex flex-col items-center justify-center gap-0.5 ${
                        formData.category === cat
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      <span>{cat}</span>
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-slate-500">
                  Selecting <strong>{formData.category}</strong> ensures this entry is shown under &quot;Discover fundraisers inspired by what you care about&quot;, the Donate page, and category filters.
                </p>
              </div>

              {/* Image Upload Area with Direct URL fallback */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">Photo / Portrait Image *</label>
                <div className="flex items-start gap-4">
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    {imagePreview || formData.portrait_url ? (
                      <Image
                        src={imagePreview || formData.portrait_url}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <Upload className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div>
                      <span className="block text-[11px] font-semibold text-slate-600 mb-1">Upload Photo File:</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                      />
                    </div>
                    <div>
                      <span className="block text-[11px] font-semibold text-slate-600 mb-1">Or Direct Photo URL:</span>
                      <input
                        type="url"
                        value={formData.portrait_url}
                        onChange={(e) => {
                          setFormData({ ...formData, portrait_url: e.target.value });
                          if (!imageFile) setImagePreview(e.target.value);
                        }}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Live preview updates instantly. Accepts JPG, PNG, WebP (or Unsplash URL).
                    </p>
                  </div>
                </div>
              </div>

              {/* Names and Age */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">First Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    placeholder="e.g. Amina"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Last Name</label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    placeholder="e.g. Namyalo"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Age &amp; Gender *</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      required
                      min={1}
                      max={25}
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 1 })}
                      className="w-20 px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none"
                    />
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'Girl' | 'Boy' })}
                      className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none"
                    >
                      <option value="Girl">Girl</option>
                      <option value="Boy">Boy</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Location & School */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Location / Community *</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none"
                    placeholder="e.g. Katwe Slum, Kampala"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">School &amp; Grade *</label>
                  <input
                    type="text"
                    required
                    value={formData.school_and_grade}
                    onChange={(e) => setFormData({ ...formData, school_and_grade: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none"
                    placeholder="e.g. St. Peter Primary, Primary 3"
                  />
                </div>
              </div>

              {/* Bio & Aspirations */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Background Story / Bio *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full p-3 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none"
                  placeholder="Share the child's living conditions, family background, and strengths..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Dream / Aspirations *</label>
                <input
                  type="text"
                  required
                  value={formData.aspirations}
                  onChange={(e) => setFormData({ ...formData, aspirations: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none"
                  placeholder="e.g. Wants to become a doctor to care for sick children in her village."
                />
              </div>

              {/* Monthly Amount & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Monthly Pledge Amount (USD)</label>
                  <input
                    type="number"
                    step="5"
                    min="10"
                    value={formData.monthly_amount}
                    onChange={(e) => setFormData({ ...formData, monthly_amount: parseFloat(e.target.value) || 35 })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Sponsorship Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none"
                  >
                    <option value="available">Available for Sponsorship</option>
                    <option value="sponsored">Sponsored</option>
                  </select>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50"
                >
                  {formSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingChild ? 'Save Changes' : 'Create Child Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LINK SPONSOR MODAL */}
      {linkModalChild && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-emerald-600" />
                Link Sponsor to {linkModalChild.first_name}
              </h3>
              <button onClick={() => setLinkModalChild(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleLinkSponsor} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Sponsor Full Name *</label>
                <input
                  type="text"
                  required
                  value={linkForm.sponsor_name}
                  onChange={(e) => setLinkForm({ ...linkForm, sponsor_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none"
                  placeholder="e.g. Marcus Chen"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Sponsor Email *</label>
                <input
                  type="email"
                  required
                  value={linkForm.sponsor_email}
                  onChange={(e) => setLinkForm({ ...linkForm, sponsor_email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none"
                  placeholder="e.g. marcus@company.com"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Monthly Pledge (USD)</label>
                <input
                  type="number"
                  min="10"
                  value={linkForm.monthly_amount}
                  onChange={(e) => setLinkForm({ ...linkForm, monthly_amount: parseFloat(e.target.value) || 35 })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-[11px] leading-relaxed">
                Notice: Supabase constraint <code>unique_active_child_sponsorship</code> enforces that each child can have at most one active sponsorship.
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setLinkModalChild(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={linkSubmitting}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs disabled:opacity-50"
                >
                  {linkSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Confirm Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={Boolean(deleteChildTarget)}
        title="Delete Child Profile"
        message={`Are you sure you want to remove the child profile for ${deleteChildTarget?.first_name}? This action is irreversible.`}
        confirmLabel="Delete Child"
        isDestructive={true}
        isLoading={deleteSubmitting}
        onConfirm={handleDeleteChild}
        onCancel={() => setDeleteChildTarget(null)}
      />

      {/* CONFIRM UNLINK MODAL */}
      <ConfirmModal
        isOpen={Boolean(unlinkChildTarget)}
        title="Unlink Active Sponsor"
        message={`Are you sure you want to unlink the sponsor from ${unlinkChildTarget?.first_name}? The child will be restored to 'available' status for new sponsors.`}
        confirmLabel="Unlink Sponsor"
        isDestructive={false}
        isLoading={unlinkSubmitting}
        onConfirm={handleUnlinkSponsorship}
        onCancel={() => setUnlinkChildTarget(null)}
      />
    </div>
  );
}
