'use client';

import React, { useEffect, useState } from 'react';
import { AdminService } from '@/lib/supabase/admin-service';
import { SponsorshipMessage, FieldReport, SponsoredChild } from '@/lib/supabase/types';
import { useAdminToast } from '@/components/admin/AdminToast';
import { StatusBadge, ConfirmModal, EmptyState, TableSkeleton } from '@/components/admin/AdminUI';
import {
  MailCheck,
  ShieldCheck,
  Check,
  X,
  Edit3,
  FileText,
  Upload,
  Download,
  AlertTriangle,
  FolderUp,
  Clock,
  ExternalLink,
  Loader2,
  Calendar,
  User,
  HeartHandshake,
} from 'lucide-react';

export default function LetterModerationPage() {
  const toast = useAdminToast();

  const [activeTab, setActiveTab] = useState<'letters' | 'field_reports'>('letters');

  // Letter moderation state
  const [letters, setLetters] = useState<SponsorshipMessage[]>([]);
  const [letterFilter, setLetterFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [loadingLetters, setLoadingLetters] = useState(true);

  // Moderation edit modal
  const [selectedLetter, setSelectedLetter] = useState<SponsorshipMessage | null>(null);
  const [moderatedText, setModeratedText] = useState('');
  const [moderationNotes, setModerationNotes] = useState('');
  const [moderationSubmitting, setModerationSubmitting] = useState(false);

  // Field reports state
  const [fieldReports, setFieldReports] = useState<FieldReport[]>([]);
  const [children, setChildren] = useState<SponsoredChild[]>([]);
  const [loadingReports, setLoadingReports] = useState(true);

  // Upload Field Report Modal
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [reportForm, setReportForm] = useState({
    title: '',
    document_type: 'Report Card' as FieldReport['document_type'],
    target_type: 'child' as 'child' | 'project',
    target_id: '',
    target_name: '',
    term_or_period: 'Term 3 - 2026',
    notes: '',
  });
  const [reportFile, setReportFile] = useState<File | null>(null);

  const loadLettersData = async () => {
    try {
      setLoadingLetters(true);
      const data = await AdminService.getLetters();
      setLetters(data);
    } catch {
      toast.error('Failed to load letter moderation queue.');
    } finally {
      setLoadingLetters(false);
    }
  };

  const loadReportsData = async () => {
    try {
      setLoadingReports(true);
      const [reportsData, childrenData] = await Promise.all([
        AdminService.getFieldReports(),
        AdminService.getChildren(),
      ]);
      setFieldReports(reportsData);
      setChildren(childrenData);
      if (childrenData.length > 0 && !reportForm.target_id) {
        setReportForm((prev) => ({
          ...prev,
          target_id: childrenData[0].id,
          target_name: `${childrenData[0].first_name} ${childrenData[0].last_name || ''}`.trim(),
        }));
      }
    } catch {
      toast.error('Failed to load field updates and children.');
    } finally {
      setLoadingReports(false);
    }
  };

  useEffect(() => {
    loadLettersData();
    loadReportsData();
  }, []);

  const openModerationModal = (letter: SponsorshipMessage) => {
    setSelectedLetter(letter);
    setModeratedText(letter.moderated_content || letter.original_content);
    setModerationNotes(letter.moderation_notes || '');
  };

  const handleModerationDecision = async (status: 'approved' | 'rejected') => {
    if (!selectedLetter) return;
    try {
      setModerationSubmitting(true);
      await AdminService.moderateLetter(selectedLetter.id, {
        status,
        moderatedContent: moderatedText,
        moderationNotes,
      });
      toast.success(
        status === 'approved'
          ? `Message from ${selectedLetter.sender_name} approved for delivery!`
          : `Message rejected.`
      );
      setSelectedLetter(null);
      await loadLettersData();
    } catch (err: any) {
      toast.error(err.message || 'Moderation decision failed.');
    } finally {
      setModerationSubmitting(false);
    }
  };

  const handleFieldReportUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportForm.title || !reportFile) {
      toast.error('Please provide a report title and select a file to upload.');
      return;
    }

    try {
      setReportSubmitting(true);
      toast.info('Uploading file to Supabase Storage field-reports bucket...');
      const fileUrl = await AdminService.uploadStorageFile('field-reports', reportFile, 'reports/');

      await AdminService.uploadFieldReport({
        title: reportForm.title,
        document_type: reportForm.document_type,
        target_type: reportForm.target_type,
        target_id: reportForm.target_id,
        target_name: reportForm.target_name,
        term_or_period: reportForm.term_or_period,
        notes: reportForm.notes,
        file_url: fileUrl,
        file_name: reportFile.name,
        file_size_bytes: reportFile.size,
        uploaded_by: 'Staff Admin',
      });

      toast.success('Field report published and attached to child record.');
      setIsReportModalOpen(false);
      setReportFile(null);
      await loadReportsData();
    } catch (err: any) {
      toast.error(err.message || 'Report upload failed.');
    } finally {
      setReportSubmitting(false);
    }
  };

  const filteredLetters = letters.filter((l) => {
    if (letterFilter === 'all') return true;
    return l.moderation_status === letterFilter;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Letter &amp; Field Report Moderation
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Child safeguarding oversight: Inspect donor messages, redact sensitive contacts, and upload verified termly report cards.
          </p>
        </div>

        {/* Section Tabs */}
        <div className="flex rounded-2xl bg-white border border-slate-200/80 p-1 shadow-xs self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('letters')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'letters'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MailCheck className="w-4 h-4" />
            <span>Incoming Letters</span>
            {letters.filter((l) => l.moderation_status === 'pending').length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-white font-bold">
                {letters.filter((l) => l.moderation_status === 'pending').length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('field_reports')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'field_reports'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Field Reports &amp; Cards</span>
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* TAB 1: INCOMING LETTERS MODERATION */}
      {/* ---------------------------------------------------------------------- */}
      {activeTab === 'letters' && (
        <div className="space-y-4">
          {/* Status Filter */}
          <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 pl-2">Filter queue:</span>
              <div className="flex gap-1">
                {(['pending', 'approved', 'rejected', 'all'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setLetterFilter(st)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                      letterFilter === st
                        ? 'bg-slate-100 text-slate-900'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {st} (
                    {st === 'all'
                      ? letters.length
                      : letters.filter((l) => l.moderation_status === st).length}
                    )
                  </button>
                ))}
              </div>
            </div>

            <div className="text-[11px] text-slate-400 hidden sm:flex items-center gap-1.5 pr-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>SOP: Redact direct phones, emails, and money requests</span>
            </div>
          </div>

          {loadingLetters ? (
            <TableSkeleton rows={4} cols={5} />
          ) : filteredLetters.length === 0 ? (
            <EmptyState
              icon={MailCheck}
              title="No letters in this queue"
              description="All donor letters for this filter have been reviewed or no new incoming messages are awaiting moderation."
            />
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredLetters.map((msg) => (
                <div
                  key={msg.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3 hover:border-slate-300 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs border border-amber-200">
                        {msg.sender_name[0]}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                          <span>{msg.sender_name}</span>
                          <span className="text-slate-300 font-normal">to</span>
                          <span className="text-emerald-700 font-semibold">{msg.child_name || 'Sponsored Child'}</span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {msg.sender_email} • {new Date(msg.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <StatusBadge status={msg.moderation_status} />
                      <button
                        onClick={() => openModerationModal(msg)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Inspect &amp; Moderate</span>
                      </button>
                    </div>
                  </div>

                  {/* Letter Content Preview */}
                  <div className="space-y-2">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed font-sans">
                      <span className="font-semibold text-slate-900 block mb-1">Message Body:</span>
                      {msg.moderated_content || msg.original_content}
                    </div>

                    {msg.moderation_notes && (
                      <div className="text-[11px] text-amber-800 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/60 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <span>{msg.moderation_notes}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* TAB 2: FIELD REPORTS & PROGRESS UPDATES */}
      {/* ---------------------------------------------------------------------- */}
      {activeTab === 'field_reports' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Termly Academic &amp; Health Reports</h3>
              <p className="text-xs text-slate-500">Official field worker documents attached directly to child profiles and donor feeds.</p>
            </div>
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Term Report</span>
            </button>
          </div>

          {loadingReports ? (
            <TableSkeleton rows={4} cols={5} />
          ) : fieldReports.length === 0 ? (
            <EmptyState
              icon={FolderUp}
              title="No field reports uploaded yet"
              description="Upload school report cards, biometric health checkups, or termly progress photographs."
              actionLabel="Upload Term Report"
              onAction={() => setIsReportModalOpen(true)}
            />
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Document Title</th>
                    <th className="py-3 px-4">Document Type</th>
                    <th className="py-3 px-4">Associated Child / Project</th>
                    <th className="py-3 px-4">Term / Period</th>
                    <th className="py-3 px-4">Uploaded By</th>
                    <th className="py-3 px-4 text-right">Download</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {fieldReports.map((report) => (
                    <tr key={report.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{report.title}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-normal pl-6">{report.file_name}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={report.document_type} label={report.document_type} />
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-800">{report.target_name}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{report.term_or_period}</td>
                      <td className="py-3.5 px-4 text-slate-500">{report.uploaded_by}</td>
                      <td className="py-3.5 px-4 text-right">
                        <a
                          href={report.file_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>File</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* MODAL: INSPECT & MODERATE LETTER */}
      {/* ---------------------------------------------------------------------- */}
      {selectedLetter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  Moderate Donor Letter
                </h3>
                <p className="text-xs text-slate-500">
                  From {selectedLetter.sender_name} to {selectedLetter.child_name || 'Sponsored Child'}
                </p>
              </div>
              <button onClick={() => setSelectedLetter(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Original content view */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Original Submitted Text</label>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 italic">
                {selectedLetter.original_content}
              </div>
            </div>

            {/* Moderated content editor */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-800">
                Safe Delivered Text (Edit to redact phone numbers or personal handles)
              </label>
              <textarea
                rows={4}
                value={moderatedText}
                onChange={(e) => setModeratedText(e.target.value)}
                className="w-full p-3 text-xs rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                placeholder="Sanitized version to be forwarded to child..."
              />
            </div>

            {/* Moderation notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Audit / Moderation Notes</label>
              <input
                type="text"
                value={moderationNotes}
                onChange={(e) => setModerationNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none"
                placeholder="e.g. Redacted phone number for child safety compliance."
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleModerationDecision('rejected')}
                disabled={moderationSubmitting}
                className="px-4 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold transition-colors disabled:opacity-50"
              >
                Reject Letter
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedLetter(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleModerationDecision('approved')}
                  disabled={moderationSubmitting}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50"
                >
                  {moderationSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Approve &amp; Forward
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* MODAL: UPLOAD FIELD REPORT */}
      {/* ---------------------------------------------------------------------- */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Upload className="w-4 h-4 text-emerald-600" />
                Upload Field Report or Report Card
              </h3>
              <button onClick={() => setIsReportModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFieldReportUpload} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Report Title *</label>
                <input
                  type="text"
                  required
                  value={reportForm.title}
                  onChange={(e) => setReportForm({ ...reportForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none"
                  placeholder="e.g. Term 3 Academic Assessment &amp; Report Card"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700">Document Type</label>
                  <select
                    value={reportForm.document_type}
                    onChange={(e) => setReportForm({ ...reportForm, document_type: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none"
                  >
                    <option value="Report Card">Report Card</option>
                    <option value="Medical Checkup">Medical Checkup</option>
                    <option value="Field Photo">Field Photo</option>
                    <option value="Annual Progress">Annual Progress</option>
                    <option value="Project Milestone">Project Milestone</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700">Period / Term</label>
                  <input
                    type="text"
                    required
                    value={reportForm.term_or_period}
                    onChange={(e) => setReportForm({ ...reportForm, term_or_period: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none"
                    placeholder="e.g. Term 3 - 2026"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Target Sponsored Child *</label>
                <select
                  value={reportForm.target_id}
                  onChange={(e) => {
                    const selected = children.find((c) => c.id === e.target.value);
                    setReportForm({
                      ...reportForm,
                      target_id: e.target.value,
                      target_name: selected ? `${selected.first_name} ${selected.last_name || ''}`.trim() : '',
                    });
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none"
                >
                  {children.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.first_name} {c.last_name || ''} ({c.location})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Notes &amp; Academic Summary</label>
                <textarea
                  rows={2}
                  value={reportForm.notes}
                  onChange={(e) => setReportForm({ ...reportForm, notes: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none"
                  placeholder="e.g. Grade A in Literacy, improved attendance."
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Document File (PDF / Image) *</label>
                <input
                  type="file"
                  required
                  accept=".pdf,image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setReportFile(e.target.files[0]);
                    }
                  }}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reportSubmitting}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs disabled:opacity-50"
                >
                  {reportSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Upload to Supabase Storage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
