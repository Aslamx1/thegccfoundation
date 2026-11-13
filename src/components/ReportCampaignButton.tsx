'use client';

import { FormEvent, useState } from 'react';
import { Flag, X } from 'lucide-react';

type SavedReport = { id: string; campaignId: string; campaignTitle: string; reason: string; details: string; createdAt: string };

export default function ReportCampaignButton({ campaignId, campaignTitle }: { campaignId: string; campaignTitle: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('Misleading or inaccurate information');
  const [details, setDetails] = useState('');
  const [status, setStatus] = useState('');
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const report: SavedReport = { id: `report_${Date.now()}`, campaignId, campaignTitle, reason, details: details.trim(), createdAt: new Date().toISOString() };
    try {
      const saved = JSON.parse(localStorage.getItem('gcc_foundation_campaign_reports') || '[]') as SavedReport[];
      localStorage.setItem('gcc_foundation_campaign_reports', JSON.stringify([report, ...saved]));
      setStatus('Your report has been recorded in this browser. This demo does not send it to a safety team.');
      setOpen(false);
      setDetails('');
    } catch {
      setStatus('This browser could not save the report. Please contact GCC Support for a human review.');
    }
  }
  return <>
    <button type="button" onClick={() => { setOpen(true); setStatus(''); }} className="inline-flex items-center gap-2 rounded-full border border-[#d7ded7] px-4 py-2 text-sm font-semibold text-[#505a52] hover:border-[#aeb9ae] hover:bg-[#f7faf7]"><Flag className="h-4 w-4"/>Report this fundraiser</button>
    {status && <p role="status" className="mt-2 text-xs leading-relaxed text-[#087443]">{status} <a href="tel:+256772491802" className="font-bold underline">Call GCC Support</a></p>}
    {open && <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}><section role="dialog" aria-modal="true" aria-labelledby="report-title" className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-8"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-wide text-[#087443]">Safety report</p><h2 id="report-title" className="mt-1 text-xl font-extrabold text-[#20251f]">Report this fundraiser</h2><p className="mt-2 text-sm leading-relaxed text-[#626b64]">Tell us what concerns you about “{campaignTitle}”. A report is not a finding that the fundraiser is fraudulent.</p></div><button type="button" onClick={() => setOpen(false)} aria-label="Close report form" className="rounded-full p-2 text-[#626b64] hover:bg-[#f1f4f0]"><X className="h-5 w-5"/></button></div><form onSubmit={submit} className="mt-6 space-y-4"><label className="block text-sm font-semibold text-[#20251f]">Reason<select value={reason} onChange={(event) => setReason(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-[#cfd6d0] bg-white px-3 text-sm">{['Misleading or inaccurate information', 'Impersonation', 'Unsafe or harmful content', 'Suspected misuse of funds', 'Other concern'].map((item) => <option key={item}>{item}</option>)}</select></label><label className="block text-sm font-semibold text-[#20251f]">What should be reviewed?<textarea value={details} onChange={(event) => setDetails(event.target.value)} required maxLength={1000} rows={4} placeholder="Describe the concern. Do not include passwords, payment details, or identity numbers." className="mt-2 w-full rounded-xl border border-[#cfd6d0] p-3 text-sm font-normal"/></label><p className="text-xs leading-relaxed text-[#818981]">Frontend demo only: this report is stored in your browser and is not delivered to a review team. For a human review, call +256 (0) 772 491 802.</p><div className="flex justify-end gap-3"><button type="button" onClick={() => setOpen(false)} className="rounded-full border border-[#cfd6d0] px-5 py-2.5 text-sm font-bold text-[#20251f]">Cancel</button><button type="submit" className="rounded-full bg-[#087443] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#066339]">Record report</button></div></form></section></div>}
  </>;
}