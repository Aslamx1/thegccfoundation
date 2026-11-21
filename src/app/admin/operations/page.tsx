'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { AdminService } from '@/lib/supabase/admin-service';
import { EventItem, VolunteerLog, OrgSettings } from '@/lib/supabase/types';
import { useAdminToast } from '@/components/admin/AdminToast';
import { StatusBadge, ConfirmModal, EmptyState, TableSkeleton } from '@/components/admin/AdminUI';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  XCircle,
  Plus,
  Send,
  Building,
  Upload,
  Save,
  Loader2,
  Sliders,
  Sparkles,
  FileBadge,
} from 'lucide-react';

export default function AdminOperationsPage() {
  const toast = useAdminToast();

  const [activeTab, setActiveTab] = useState<'events' | 'volunteers' | 'settings' | 'broadcast'>('events');

  // Events & Volunteers state
  const [events, setEvents] = useState<EventItem[]>([]);
  const [volunteerLogs, setVolunteerLogs] = useState<VolunteerLog[]>([]);
  const [orgSettings, setOrgSettings] = useState<OrgSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // New Event Modal
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [eventSubmitting, setEventSubmitting] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    event_date: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 16),
    location: '',
    capacity: 100,
    status: 'upcoming' as EventItem['status'],
  });

  // Settings Save State
  const [settingsForm, setSettingsForm] = useState<OrgSettings | null>(null);
  const [savingSettings, setSavingSettings] = useState(false);

  // Broadcast Announcement State
  const [broadcastForm, setBroadcastForm] = useState({
    title: '',
    targetAudience: 'All Supporters',
    message: '',
  });
  const [sendingBroadcast, setSendingBroadcast] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [eventsData, volunteersData, settingsData] = await Promise.all([
        AdminService.getEvents(),
        AdminService.getVolunteerLogs(),
        AdminService.getOrgSettings(),
      ]);
      setEvents(eventsData);
      setVolunteerLogs(volunteersData);
      setOrgSettings(settingsData);
      setSettingsForm(settingsData);
    } catch {
      toast.error('Failed to load operations data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.title || !eventForm.location) {
      toast.error('Please fill in event title and location.');
      return;
    }

    try {
      setEventSubmitting(true);
      await AdminService.createEvent({
        ...eventForm,
        event_date: new Date(eventForm.event_date).toISOString(),
      });
      toast.success(`Event "${eventForm.title}" published!`);
      setIsEventModalOpen(false);
      setEventForm({
        title: '',
        description: '',
        event_date: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 16),
        location: '',
        capacity: 100,
        status: 'upcoming',
      });
      await loadData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create event.');
    } finally {
      setEventSubmitting(false);
    }
  };

  const handleApproveVolunteerLog = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await AdminService.approveVolunteerLog(id, status);
      toast.success(status === 'approved' ? 'Volunteer hours verified and approved.' : 'Log rejected.');
      await loadData();
    } catch (err: any) {
      toast.error(err.message || 'Action failed.');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settingsForm) return;

    try {
      setSavingSettings(true);
      await AdminService.updateOrgSettings(settingsForm);
      toast.success('Organization receipt & document settings saved.');
      await loadData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update settings.');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastForm.title || !broadcastForm.message) {
      toast.error('Please enter broadcast subject and message.');
      return;
    }

    try {
      setSendingBroadcast(true);
      const res = await AdminService.sendBroadcastAnnouncement(broadcastForm);
      toast.success(
        `Broadcast sent successfully to ${res.deliveredCount} recipients in "${broadcastForm.targetAudience}".`
      );
      setBroadcastForm({
        title: '',
        targetAudience: 'All Supporters',
        message: '',
      });
    } catch (err: any) {
      toast.error(err.message || 'Broadcast failed.');
    } finally {
      setSendingBroadcast(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Events, Volunteers &amp; Organization Settings
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Coordinate field outreaches, verify community volunteer hours, configure legal receipt headers, and broadcast announcements.
          </p>
        </div>

        {activeTab === 'events' && (
          <button
            onClick={() => setIsEventModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Outreach / Event</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex rounded-2xl bg-white border border-slate-200/80 p-1 shadow-xs max-w-fit overflow-x-auto">
        <button
          onClick={() => setActiveTab('events')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'events' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Events &amp; Outreaches ({events.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('volunteers')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'volunteers' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Volunteer Hours Queue ({volunteerLogs.filter((v) => v.status === 'pending').length} pending)</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'settings' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Document &amp; Receipt Settings</span>
        </button>

        <button
          onClick={() => setActiveTab('broadcast')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'broadcast' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Broadcast Announcement</span>
        </button>
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* TAB 1: EVENTS */}
      {/* ---------------------------------------------------------------------- */}
      {activeTab === 'events' && (
        <div className="space-y-4">
          {events.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No events scheduled"
              description="Create community tree plantings, charity dinners, or medical camp outreaches."
              actionLabel="Create Outreach / Event"
              onAction={() => setIsEventModalOpen(true)}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {events.map((ev) => (
                <div
                  key={ev.id}
                  className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <StatusBadge status={ev.status} />
                      <span className="text-xs text-slate-400 font-medium">
                        Capacity: {ev.registered_count} / {ev.capacity} attendees
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug">{ev.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{ev.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{new Date(ev.event_date).toLocaleDateString()} at {new Date(ev.event_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="truncate">{ev.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* TAB 2: VOLUNTEER HOURS */}
      {/* ---------------------------------------------------------------------- */}
      {activeTab === 'volunteers' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Volunteer</th>
                  <th className="py-3 px-4">Activity Description</th>
                  <th className="py-3 px-4">Date Completed</th>
                  <th className="py-3 px-4 text-right">Hours Logged</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {volunteerLogs.map((vol) => (
                  <tr key={vol.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{vol.volunteer_name}</div>
                      <div className="text-[11px] text-slate-400">{vol.volunteer_email}</div>
                    </td>
                    <td className="py-3.5 px-4 max-w-[240px]">
                      <span className="text-slate-700">{vol.activity_name}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{vol.date_completed}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                      {vol.hours_spent} hrs
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <StatusBadge status={vol.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {vol.status === 'pending' ? (
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleApproveVolunteerLog(vol.id, 'approved')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleApproveVolunteerLog(vol.id, 'rejected')}
                            className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 text-[11px] font-semibold transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px] italic">Verified</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* TAB 3: RECEIPT & DOCUMENT SETTINGS */}
      {/* ---------------------------------------------------------------------- */}
      {activeTab === 'settings' && settingsForm && (
        <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs max-w-2xl space-y-5 text-xs">
          <div>
            <h3 className="text-base font-bold text-slate-900">Legal Document &amp; Stamp Configuration</h3>
            <p className="text-xs text-slate-500">Details printed on official tax-deductible donor receipts and financial ledgers.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Official NGO Name *</label>
              <input
                type="text"
                required
                value={settingsForm.ngo_name}
                onChange={(e) => setSettingsForm({ ...settingsForm, ngo_name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">NGO Registration Number *</label>
              <input
                type="text"
                required
                value={settingsForm.registration_number}
                onChange={(e) => setSettingsForm({ ...settingsForm, registration_number: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Tax Exemption / TIN Number</label>
              <input
                type="text"
                value={settingsForm.tax_id || ''}
                onChange={(e) => setSettingsForm({ ...settingsForm, tax_id: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Official Contact Email *</label>
              <input
                type="email"
                required
                value={settingsForm.official_email}
                onChange={(e) => setSettingsForm({ ...settingsForm, official_email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">Headquarters Physical Address *</label>
            <input
              type="text"
              required
              value={settingsForm.physical_address}
              onChange={(e) => setSettingsForm({ ...settingsForm, physical_address: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">Official Digital Stamp / Signature URL</label>
            <input
              type="text"
              value={settingsForm.receipt_stamp_url || ''}
              onChange={(e) => setSettingsForm({ ...settingsForm, receipt_stamp_url: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none"
              placeholder="/images/gcc-emblem.png"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={savingSettings}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs disabled:opacity-50"
            >
              {savingSettings && <Loader2 className="w-4 h-4 animate-spin" />}
              <Save className="w-4 h-4" />
              <span>Save Organization Settings</span>
            </button>
          </div>
        </form>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* TAB 4: BROADCAST ANNOUNCEMENT */}
      {/* ---------------------------------------------------------------------- */}
      {activeTab === 'broadcast' && (
        <form onSubmit={handleSendBroadcast} className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs max-w-2xl space-y-4 text-xs">
          <div>
            <h3 className="text-base font-bold text-slate-900">Broadcast Supporter Dispatch</h3>
            <p className="text-xs text-slate-500">Send urgent emergency appeal updates or impact reports to segmented supporter groups.</p>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">Recipient Segment *</label>
            <select
              value={broadcastForm.targetAudience}
              onChange={(e) => setBroadcastForm({ ...broadcastForm, targetAudience: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none"
            >
              <option value="All Supporters">All Supporters (Donors, Sponsors &amp; Volunteers)</option>
              <option value="Child Sponsors">Active Child Sponsors Only</option>
              <option value="Volunteers">Registered Field Volunteers</option>
              <option value="High Volume Donors">Recurring Donors</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">Announcement Headline *</label>
            <input
              type="text"
              required
              value={broadcastForm.title}
              onChange={(e) => setBroadcastForm({ ...broadcastForm, title: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none"
              placeholder="e.g. Urgent Drought Relief Update: 4 New Boreholes Online in Karamoja"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">Message Content (Markdown Supported) *</label>
            <textarea
              rows={5}
              required
              value={broadcastForm.message}
              onChange={(e) => setBroadcastForm({ ...broadcastForm, message: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none"
              placeholder="Write your email body to supporters..."
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={sendingBroadcast}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs disabled:opacity-50"
            >
              {sendingBroadcast && <Loader2 className="w-4 h-4 animate-spin" />}
              <Send className="w-4 h-4" />
              <span>Broadcast Announcement</span>
            </button>
          </div>
        </form>
      )}

      {/* MODAL: CREATE EVENT */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Create Outreach / Event</h3>
              <button onClick={() => setIsEventModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Event Title *</label>
                <input
                  type="text"
                  required
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none"
                  placeholder="e.g. Free Eye Screening &amp; Glasses Distribution"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Description</label>
                <textarea
                  rows={2}
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none"
                  placeholder="Goals, target attendees, and volunteer roles..."
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Date &amp; Time *</label>
                <input
                  type="datetime-local"
                  required
                  value={eventForm.event_date}
                  onChange={(e) => setEventForm({ ...eventForm, event_date: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Location *</label>
                <input
                  type="text"
                  required
                  value={eventForm.location}
                  onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none"
                  placeholder="e.g. Jinja Community Hall"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Capacity</label>
                <input
                  type="number"
                  min="1"
                  value={eventForm.capacity}
                  onChange={(e) => setEventForm({ ...eventForm, capacity: parseInt(e.target.value) || 50 })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEventModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={eventSubmitting}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs disabled:opacity-50"
                >
                  {eventSubmitting ? 'Publishing...' : 'Publish Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
